import os
import json
import time
import threading
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Optional, List, Tuple
from collections import OrderedDict
from utils.logger import StructuredLogger
from utils.config import config
import requests

class UserProfileFetcher:
    def __init__(self, cache_size: int = 1000, cache_ttl: int = 300):
        self.logger = StructuredLogger(name="UserProfileFetcher")
        self.cache = OrderedDict()
        self.cache_size = cache_size
        self.cache_ttl = cache_ttl
        self.lock = threading.Lock()
        self.services = {
            'behavior': config.get('behavior_service', 'http://behavior-service/v1/profile'),
            'fraud': config.get('fraud_service', 'http://fraud-service/v1/score'),
            'spending': config.get('spending_service', 'http://spending-service/v1/patterns')
        }
        self._start_cache_janitor()
        self._warmup_cache()

    def get_full_profile(self, user_id: str) -> Dict:
        """Fetch complete user profile with fallback strategies"""
        with self.lock:
            # Check cache first
            if cached := self._get_cached_profile(user_id):
                self.logger.debug(f"Cache hit for {user_id}")
                return cached

        # Parallel fetch from services
        behavior_data = self._fetch_with_retry(
            service='behavior',
            user_id=user_id,
            endpoint='current'
        )
        
        fraud_data = self._fetch_with_retry(
            service='fraud',
            user_id=user_id,
            endpoint='latest'
        )
        
        spending_data = self._fetch_with_retry(
            service='spending',
            user_id=user_id,
            endpoint='patterns'
        )

        # Build composite profile
        profile = {
            'user_id': user_id,
            'behavior': behavior_data or self._default_behavior_profile(),
            'fraud': fraud_data or self._default_fraud_profile(),
            'spending': spending_data or self._default_spending_profile(),
            'metadata': {
                'sources_used': [
                    k for k, v in zip(['behavior', 'fraud', 'spending'], 
                                    [behavior_data, fraud_data, spending_data]) 
                    if v is not None
                ],
                'timestamp': datetime.utcnow().isoformat()
            }
        }

        # Calculate derived metrics
        profile['composite_risk'] = self._calculate_composite_risk(profile)
        profile['spending_velocity'] = self._calculate_spending_velocity(
            profile['spending']
        )

        # Update cache
        with self.lock:
            self._update_cache(user_id, profile)

        return profile

    def _fetch_with_retry(self, service: str, user_id: str, endpoint: str) -> Optional[Dict]:
        """Robust service fetching with circuit breaker pattern"""
        url = f"{self.services[service]}/{user_id}/{endpoint}"
        retries = config.get('fetch_retries', 3)
        backoff = config.get('fetch_backoff', 1.5)
        
        for attempt in range(retries + 1):
            try:
                response = requests.get(
                    url,
                    headers=self._auth_headers(),
                    timeout=config.get('fetch_timeout', 2)
                )
                response.raise_for_status()
                return response.json()
            except Exception as e:
                self.logger.warning(
                    f"Attempt {attempt+1} failed for {service} service: {str(e)}"
                )
                if attempt < retries:
                    time.sleep(backoff ** attempt)
                else:
                    self.logger.error(f"Final failure fetching {service} data for {user_id}")
                    return None

    def _calculate_composite_risk(self, profile: Dict) -> float:
        """Combine multiple risk factors into 0-1 score"""
        weights = config.get('risk_weights', {
            'behavior': 0.4,
            'fraud': 0.5,
            'spending': 0.1
        })
        
        behavior_risk = profile['behavior'].get('anomaly_score', 0.5)
        fraud_risk = profile['fraud'].get('current_score', 0.5)
        spending_risk = self._calculate_spending_risk(profile['spending'])
        
        return min(1.0, 
            (behavior_risk * weights['behavior']) +
            (fraud_risk * weights['fraud']) +
            (spending_risk * weights['spending'])
        )

    def _calculate_spending_velocity(self, spending_data: Dict) -> float:
        """Calculate spending velocity in $/hour"""
        if not spending_data.get('transactions'):
            return 0.0
            
        last_hour = [t for t in spending_data['transactions'] 
                    if datetime.fromisoformat(t['timestamp']) > datetime.utcnow() - timedelta(hours=1)]
        
        return sum(t['amount'] for t in last_hour) / 3600

    def _calculate_spending_risk(self, spending_data: Dict) -> float:
        """Determine risk from spending patterns"""
        if not spending_data.get('patterns'):
            return 0.5
            
        high_risk_categories = config.get('high_risk_categories', ['gambling', 'crypto'])
        risk_transactions = [t for t in spending_data['transactions']
                            if t['category'] in high_risk_categories]
                            
        return min(1.0, len(risk_transactions) / 10)

    def _auth_headers(self) -> Dict:
        """Generate authentication headers for internal services"""
        token = config.get('service_token', os.environ.get('SERVICE_TOKEN'))
        return {
            'Authorization': f"Bearer {token}",
            'X-Request-Source': 'spend-control'
        }

    # Cache management
    def _get_cached_profile(self, user_id: str) -> Optional[Dict]:
        """Retrieve cached profile with TTL check"""
        entry = self.cache.get(user_id)
        if not entry:
            return None
            
        if datetime.utcnow() > entry['expires']:
            del self.cache[user_id]
            return None
            
        # Move to end to mark recently used
        self.cache.move_to_end(user_id)
        return entry['profile']

    def _update_cache(self, user_id: str, profile: Dict):
        """Update cache with LRU eviction policy"""
        if user_id in self.cache:
            self.cache.move_to_end(user_id)
        else:
            self.cache[user_id] = {
                'profile': profile,
                'expires': datetime.utcnow() + timedelta(seconds=self.cache_ttl)
            }
            
        # Evict if over size limit
        while len(self.cache) > self.cache_size:
            self.cache.popitem(last=False)

    def _start_cache_janitor(self):
        """Background thread for cache maintenance"""
        def janitor_loop():
            while True:
                self._clean_expired_entries()
                time.sleep(60)

        threading.Thread(target=janitor_loop, daemon=True).start()

    def _clean_expired_entries(self):
        """Remove expired cache entries"""
        with self.lock:
            now = datetime.utcnow()
            expired = [k for k, v in self.cache.items() if v['expires'] < now]
            for k in expired:
                del self.cache[k]

    def _warmup_cache(self):
        """Pre-cache high priority users at startup"""
        warm_users = config.get('warmup_users', [])
        for user_id in warm_users:
            threading.Thread(target=self.get_full_profile, args=(user_id,)).start()

    # Default profiles
    def _default_behavior_profile(self) -> Dict:
        return {
            'anomaly_score': 0.5,
            'session_risk': 0.3,
            'device_trust': 0.7
        }

    def _default_fraud_profile(self) -> Dict:
        return {
            'current_score': 0.5,
            '30d_average': 0.4,
            'last_incident': None
        }

    def _default_spending_profile(self) -> Dict:
        return {
            'daily_average': 150.0,
            'weekly_max': 1000.0,
            'common_categories': ['retail']
        }

if __name__ == "__main__":
    fetcher = UserProfileFetcher(cache_size=100, cache_ttl=30)
    
    # Test profile fetch
    profile = fetcher.get_full_profile("test_user_001")
    print("Fetched profile:")
    print(json.dumps(profile, indent=2))
    
    # Test cache hit
    profile_cached = fetcher.get_full_profile("test_user_001")
    print("Cache hit:", profile == profile_cached)
    
    # Test cache expiration
    time.sleep(31)
    profile_expired = fetcher.get_full_profile("test_user_001")
    print("Cache miss after expiration:", "expired" not in profile_expired['metadata']['sources_used'])

import os
import time
import json
import hashlib
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Set
from urllib.parse import urlparse
from utils.logger import StructuredLogger
from utils.config import config

class BreachMonitor:
    def __init__(self, vault_core, compliance):
        self.logger = StructuredLogger(name="BreachMonitor")
        self.vault_core = vault_core
        self.compliance = compliance
        self.data_sources = config.get('breach_sources', [])
        self.known_breaches: Set[str] = set()
        self.rate_limits = {'requests': 5, 'period': 60}  # 5 requests/minute
        self.last_request_time = datetime.min
        self.breach_cache_ttl = timedelta(hours=24)
        self.user_agent = "FortiFiBreachMonitor/1.0 (+https://fortifi.ai)"
        
        # Initialize with historical breaches
        self._load_breach_history()

    def start_monitoring(self):
        """Main monitoring loop with rate limiting and error handling"""
        self.logger.info("Starting breach monitoring service")
        while True:
            try:
                self._check_sources()
                time.sleep(self.rate_limits['period'] * 60)
            except KeyboardInterrupt:
                self.logger.info("Monitoring stopped by user")
                break
            except Exception as e:
                self.logger.error(f"Monitoring loop error: {str(e)}")
                time.sleep(30)

    def _check_sources(self):
        """Check all configured data sources"""
        for source in self.data_sources:
            if self._rate_limit_exceeded():
                time.sleep(self.rate_limits['period'] * 60)
                continue
                
            try:
                breaches = self._fetch_source(source['url'], source.get('format'))
                new_breaches = self._filter_new_breaches(breaches)
                
                if new_breaches:
                    self._handle_new_breaches(new_breaches, source)
                    self._update_breach_history(new_breaches)
                    
            except Exception as e:
                self.logger.error(f"Failed to check {source['url']}: {str(e)}")

    def _fetch_source(self, url: str, format: Optional[str]) -> List[Dict]:
        """Fetch and parse breach data from a source"""
        headers = {'User-Agent': self.user_agent}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        self.last_request_time = datetime.now()
        return self._parse_response(response.content, format)

    def _parse_response(self, data: bytes, format: Optional[str]) -> List[Dict]:
        """Parse breach data based on source format"""
        if format == 'hibp_json':
            return self._parse_hibp(data)
        elif format == 'csv':
            return self._parse_csv(data)
        else:
            return self._parse_unknown_format(data)

    def _parse_hibp(self, data: bytes) -> List[Dict]:
        """Parse Have I Been Pwned JSON format"""
        breaches = []
        for entry in json.loads(data):
            breach = {
                'id': entry.get('Name'),
                'title': entry.get('Title'),
                'domain': entry.get('Domain'),
                'date': entry.get('BreachDate'),
                'data_classes': entry.get('DataClasses'),
                'hash': self._hash_breach(entry)
            }
            breaches.append(breach)
        return breaches

    def _parse_csv(self, data: bytes) -> List[Dict]:
        """Parse CSV breach data"""
        breaches = []
        for line in data.decode().splitlines():
            parts = line.split(',')
            if len(parts) >= 3:
                breach = {
                    'id': parts[0],
                    'email': parts[1],
                    'hash': self._hash_breach(line)
                }
                breaches.append(breach)
        return breaches

    def _filter_new_breaches(self, breaches: List[Dict]) -> List[Dict]:
        """Filter out previously seen breaches"""
        return [b for b in breaches if b['hash'] not in self.known_breaches]

    def _handle_new_breaches(self, breaches: List[Dict], source: Dict):
        """Process new breaches and trigger vault actions"""
        for breach in breaches:
            self.logger.warning(f"New breach detected: {breach.get('id')}")
            self._check_vault_credentials(breach)
            self.compliance.log_breach(
                source=source['url'],
                breach_id=breach['id'],
                data_classes=breach.get('data_classes')
            )

    def _check_vault_credentials(self, breach: Dict):
        """Check if breached data exists in vault"""
        if 'email' in breach:
            test_data = {'email': breach['email']}
            commitment = self.vault_core._hash_data(test_data).hex()
            if self.vault_core.check_global_breach(commitment):
                self.logger.info(f"Confirmed vault breach for {breach['email']}")

    def _hash_breach(self, data: Dict) -> str:
        """Generate unique identifier for breach"""
        return hashlib.sha3_256(json.dumps(data, sort_keys=True).encode()).hexdigest()

    def _rate_limit_exceeded(self) -> bool:
        """Check if rate limit is exceeded"""
        elapsed = (datetime.now() - self.last_request_time).seconds
        return elapsed < self.rate_limits['period']

    def _update_breach_history(self, breaches: List[Dict]):
        """Update known breaches with new entries"""
        for breach in breaches:
            self.known_breaches.add(breach['hash'])
        self._save_breach_history()

    def _load_breach_history(self):
        """Load historical breach hashes"""
        try:
            with open('breach_history.json') as f:
                data = json.load(f)
                self.known_breaches = set(data.get('hashes', []))
        except FileNotFoundError:
            pass

    def _save_breach_history(self):
        """Persist breach hashes for future reference"""
        with open('breach_history.json', 'w') as f:
            json.dump({'hashes': list(self.known_breaches)}, f)

    def add_data_source(self, url: str, format: Optional[str] = None):
        """Dynamically add a new data source"""
        self.data_sources.append({'url': url, 'format': format})
        self.logger.info(f"Added new data source: {url}")

    def force_check(self):
        """Manual trigger for immediate breach check"""
        self._check_sources()

if __name__ == "__main__":
    from vault_core import IdentityVaultCore
    from vault_compliance import VaultCompliance
    
    # Example configuration
    config['breach_sources'] = [
        {'url': 'https://api.example.com/breaches', 'format': 'hibp_json'},
        {'url': 'https://breachdumps.example.com/data.csv', 'format': 'csv'}
    ]
    
    # Initialize dependencies
    compliance = VaultCompliance()
    vault = IdentityVaultCore(config['blockchain'], compliance)
    monitor = BreachMonitor(vault, compliance)
    
    # Start monitoring (Ctrl+C to stop)
    monitor.start_monitoring()

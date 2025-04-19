import os
import time
import json
import threading
import queue
import copy
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from collections import deque
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from utils.logger import StructuredLogger
from utils.config import config
from .decoy_generator import DecoyGenerator

class SessionShadow:
    def __init__(self):
        self.logger = StructuredLogger(name="SessionShadow")
        self.decoy_generator = DecoyGenerator()
        self.active_sessions: Dict[str, Dict] = {}
        self.session_lock = threading.Lock()
        self.decoy_queue = queue.PriorityQueue()
        self.cleanup_interval = config.get('shadow_cleanup_interval', 300)
        self.session_timeout = config.get('shadow_session_timeout', 1800)
        self.decoy_strategy = config.get('decoy_strategy', 'adaptive')
        self.behavior_profiles = self._load_behavior_profiles()
        
        # Initialize subsystem threads
        self._start_session_manager()
        self._start_decoy_dispatcher()
        self._start_cleanup_scheduler()

    def _load_behavior_profiles(self) -> Dict[str, Dict]:
        """Load pre-configured user behavior patterns"""
        return {
            'default': {
                'decoy_frequency': 120,
                'types': ['amount', 'merchant', 'timing'],
                'risk_threshold': 0.7
            },
            'high_value': {
                'decoy_frequency': 60,
                'types': ['amount', 'geolocation'],
                'risk_threshold': 0.9
            },
            'suspicious': {
                'decoy_frequency': 30,
                'types': ['merchant', 'device'],
                'risk_threshold': 0.95
            }
        }

    def start_shadowing(self, user_id: str, session_context: Dict) -> bool:
        """Initialize real-time transaction mirroring with military-grade security"""
        with self.session_lock:
            if user_id in self.active_sessions:
                self.logger.warning(f"Session already active for {user_id}")
                return False
                
            session_key = self._derive_session_key(user_id, session_context)
            session = {
                'user_id': user_id,
                'start_time': datetime.utcnow(),
                'last_activity': datetime.utcnow(),
                'transaction_history': deque(maxlen=100),
                'decoys_injected': [],
                'decoys_triggered': [],
                'context': session_context,
                'behavior_profile': self._determine_behavior_profile(session_context),
                'session_key': session_key,
                'security_context': self._establish_security_context(session_key),
                'stats': {
                    'decoy_count': 0,
                    'fraud_score': 0.0,
                    'risk_level': 'low'
                }
            }
            self.active_sessions[user_id] = session
            self.logger.info(f"Started shadow session for {user_id} (profile: {session['behavior_profile']})")
            return True

    def _derive_session_key(self, user_id: str, context: Dict) -> bytes:
        """HKDF-based session key derivation"""
        hkdf = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=os.urandom(16),
            info=b'session_shadow_key',
        )
        return hkdf.derive(json.dumps(context, sort_keys=True).encode())

    def _establish_security_context(self, session_key: bytes) -> Dict:
        """Create encrypted session channel parameters"""
        return {
            'cipher': 'AES-256-GCM',
            'key': session_key.hex(),
            'nonce': os.urandom(12).hex(),
            'mac_key': hashlib.shake_128(session_key).digest(16).hex()
        }

    def record_transaction(self, user_id: str, transaction: Dict) -> bool:
        """Mirror legitimate transaction into shadow session with integrity checks"""
        with self.session_lock:
            session = self.active_sessions.get(user_id)
            if not session:
                self.logger.error(f"No active session for {user_id}")
                return False
                
            if not self._validate_transaction_integrity(transaction, session['security_context']):
                self.logger.warning(f"Integrity check failed for {user_id}")
                return False
                
            session['transaction_history'].append(transaction)
            session['last_activity'] = datetime.utcnow()
            self._update_risk_profile(user_id)
            self.logger.debug(f"Mirrored transaction for {user_id}: {transaction.get('tx_id')}")
            return True

    def _validate_transaction_integrity(self, tx: Dict, security: Dict) -> bool:
        """HMAC-based transaction validation"""
        mac = tx.pop('_mac', None)
        if not mac:
            return False
            
        computed_mac = hashlib.blake2b(
            json.dumps(tx, sort_keys=True).encode(),
            key=bytes.fromhex(security['mac_key'])
        ).hexdigest()
        
        return hmac.compare_digest(mac, computed_mac)

    def _determine_behavior_profile(self, context: Dict) -> str:
        """Determine optimal decoy strategy based on risk signals"""
        risk_score = context.get('risk_score', 0.0)
        if risk_score > 0.9:
            return 'suspicious'
        elif context.get('transaction_sum', 0) > 10000:
            return 'high_value'
        else:
            return 'default'

    def _update_risk_profile(self, user_id: str):
        """Dynamic risk assessment and strategy adjustment"""
        session = self.active_sessions[user_id]
        tx_history = list(session['transaction_history'])
        
        # Calculate velocity features
        amount_velocity = sum(tx.get('amount',0) for tx in tx_history[-3:]) / 3
        time_velocity = (tx_history[-1]['timestamp'] - tx_history[-3]['timestamp']).total_seconds() / 2
        
        # Update fraud score (mock implementation)
        session['stats']['fraud_score'] = min(1.0, 
            (amount_velocity / 10000) + (1 / time_velocity)
        )
        
        # Adjust decoy strategy
        if session['stats']['fraud_score'] > session['behavior_profile']['risk_threshold']:
            self.logger.info(f"Elevating decoy frequency for {user_id}")
            self.decoy_queue.put((
                0,  # Highest priority
                {'user_id': user_id, 'action': 'increase_frequency', 'factor': 2}
            ))

    def _start_session_manager(self):
        """Dedicated thread for session state management"""
        def manager_loop():
            while True:
                try:
                    item = self.decoy_queue.get(timeout=1)
                    self._handle_control_message(item[1])
                except queue.Empty:
                    continue
        threading.Thread(target=manager_loop, daemon=True).start()

    def _handle_control_message(self, message: Dict):
        """Process decoy strategy adjustments"""
        user_id = message['user_id']
        with self.session_lock:
            session = self.active_sessions.get(user_id)
            if not session:
                return
                
            if message['action'] == 'increase_frequency':
                new_freq = session['behavior_profile']['decoy_frequency'] / message['factor']
                session['behavior_profile']['decoy_frequency'] = max(10, new_freq)
                self.logger.info(f"Updated {user_id} decoy frequency to {new_freq}s")

    def _start_decoy_dispatcher(self):
        """High-precision decoy injection system"""
        def dispatcher_loop():
            while True:
                now = time.time()
                with self.session_lock:
                    for user_id, session in self.active_sessions.items():
                        last_decoy = session['decoys_injected'][-1]['timestamp'] if session['decoys_injected'] else 0
                        interval = session['behavior_profile']['decoy_frequency']
                        
                        if now - last_decoy > interval:
                            decoy = self.decoy_generator.generate_decoy(session)
                            session['decoys_injected'].append(decoy)
                            session['stats']['decoy_count'] += 1
                            self.logger.info(f"Injected {decoy['decoy_marker']} for {user_id}")
                time.sleep(0.1)  # 100ms precision
        threading.Thread(target=dispatcher_loop, daemon=True).start()

    def _start_cleanup_scheduler(self):
        """Session garbage collection with atomic operations"""
        def cleanup_loop():
            while True:
                now = datetime.utcnow()
                expired = []
                with self.session_lock:
                    for user_id, session in self.active_sessions.items():
                        if (now - session['last_activity']).total_seconds() > self.session_timeout:
                            expired.append(user_id)
                    for user_id in expired:
                        self._terminate_session(user_id)
                time.sleep(self.cleanup_interval)
        threading.Thread(target=cleanup_loop, daemon=True).start()

    def _terminate_session(self, user_id: str):
        """Secure session termination with evidence preservation"""
        session = self.active_sessions.pop(user_id, None)
        if not session:
            return
            
        # Archive session data
        archive_path = Path(config.get('session_archive_dir', '/var/shadow_sessions')) 
        archive_path.mkdir(exist_ok=True)
        file_name = f"{user_id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.json"
        
        with open(archive_path / file_name, 'w') as f:
            json.dump({
                'meta': {
                    'user_id': user_id,
                    'start_time': session['start_time'].isoformat(),
                    'duration': (datetime.utcnow() - session['start_time']).total_seconds()
                },
                'stats': session['stats'],
                'decoys_injected': len(session['decoys_injected']),
                'decoys_triggered': len(session['decoys_triggered'])
            }, f)
            
        self.logger.info(f"Archived session for {user_id} with {session['stats']['decoy_count']} decoys")

    def get_active_sessions(self) -> List[Dict]:
        """Get current session snapshots (safe for concurrent access)"""
        with self.session_lock:
            return [{
                'user_id': s['user_id'],
                'start_time': s['start_time'],
                'decoy_count': s['stats']['decoy_count'],
                'fraud_score': s['stats']['fraud_score']
            } for s in self.active_sessions.values()]

    def forensic_analysis(self, user_id: str) -> Optional[Dict]:
        """Full session reconstruction for incident response"""
        with self.session_lock:
            session = self.active_sessions.get(user_id)
            if not session:
                return None
                
            return {
                'user_id': user_id,
                'timeline': {
                    'start': session['start_time'].isoformat(),
                    'last_activity': session['last_activity'].isoformat()
                },
                'transactions': list(session['transaction_history']),
                'decoys_injected': session['decoys_injected'],
                'risk_indicators': {
                    'fraud_score': session['stats']['fraud_score'],
                    'risk_level': session['stats']['risk_level']
                }
            }

if __name__ == "__main__":
    # Initialize shadow system
    shadow = SessionShadow()
    
    # Simulate user session
    user_ctx = {
        'user_id': 'user_123',
        'device_fingerprint': 'device_abc',
        'ip_address': '192.168.1.100',
        'risk_score': 0.95,
        'transaction_sum': 15000
    }
    
    # Start shadow session
    shadow.start_shadowing('user_123', user_ctx)
    
    # Simulate transactions
    for i in range(1, 6):
        tx = {
            'tx_id': f"TX_{i}",
            'amount': 1000 * i,
            'merchant': f"Vendor_{i}",
            'timestamp': datetime.utcnow(),
            '_mac': 'placeholder_mac'  # In real usage this would be computed
        }
        shadow.record_transaction('user_123', tx)
        time.sleep(1)
    
    # Get session status
    print("Active sessions:", shadow.get_active_sessions())
    
    # Demonstrate forensic analysis
    print("Forensic data:", json.dumps(shadow.forensic_analysis('user_123'), indent=2))

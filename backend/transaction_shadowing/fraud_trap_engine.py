import os
import json
import time
import hashlib
import threading
import queue
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Set
from pathlib import Path
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from utils.logger import StructuredLogger
from utils.config import config

class FraudTrapEngine:
    def __init__(self, session_shadow):
        self.logger = StructuredLogger(name="FraudTrapEngine")
        self.session_shadow = session_shadow
        self.active_traps: Dict[str, Dict] = {}
        self.triggered_traps: Set[str] = set()
        self.trap_queue = queue.Queue(maxsize=1000)
        self.analysis_lock = threading.Lock()
        self._init_trap_storage()
        self._start_detection_pipeline()
        self._start_forensic_analyzer()

    def _init_trap_storage(self):
        """Initialize trap storage with crash-safe recovery"""
        self.trap_archive_dir = Path(config.get('trap_archive_dir', '/var/traps'))
        self.trap_archive_dir.mkdir(exist_ok=True, mode=0o750)
        
        # Load historical traps from disk
        for trap_file in self.trap_archive_dir.glob('*.json'):
            try:
                with open(trap_file, 'r') as f:
                    trap = json.load(f)
                    self.active_traps[trap['trap_id']] = trap
            except Exception as e:
                self.logger.error(f"Failed to load trap {trap_file}: {str(e)}")

    def register_trap(self, decoy_transaction: Dict) -> str:
        """Arm a decoy transaction for fraud detection"""
        trap_id = self._generate_trap_id(decoy_transaction)
        trap = {
            'trap_id': trap_id,
            'decoy_data': decoy_transaction,
            'armed_at': datetime.utcnow().isoformat(),
            'trigger_count': 0,
            'last_triggered': None,
            'forensic_evidence': [],
            'context_signature': self._create_context_signature(decoy_transaction)
        }
        
        with self.analysis_lock:
            self.active_traps[trap_id] = trap
            self._persist_trap(trap)
            
        self.logger.info(f"Armed trap {trap_id} for {decoy_transaction.get('decoy_marker')}")
        return trap_id

    def _generate_trap_id(self, decoy: Dict) -> str:
        """Create unique trap identifier with HMAC protection"""
        hkdf = HKDF(
            algorithm=hashes.SHA3_256(),
            length=32,
            salt=os.urandom(16),
            info=b'trap_id_generation',
        )
        return hkdf.derive(json.dumps(decoy, sort_keys=True).encode()).hex()

    def _create_context_signature(self, decoy: Dict) -> str:
        """Create cryptographic signature of decoy context"""
        return hashlib.blake2b(
            json.dumps(decoy['metadata'], sort_keys=True).encode(),
            key=os.urandom(32)
        ).hexdigest()

    def analyze_transaction(self, transaction: Dict):
        """Submit transaction for fraud trap analysis"""
        try:
            self.trap_queue.put_nowait(transaction)
        except queue.Full:
            self.logger.warning("Trap analysis queue overloaded, dropping transaction")

    def _start_detection_pipeline(self):
        """Real-time trap detection pipeline with multiple analysis stages"""
        def detection_worker():
            while True:
                try:
                    tx = self.trap_queue.get(timeout=1)
                    self._process_transaction(tx)
                except queue.Empty:
                    continue
                
        for _ in range(config.get('trap_workers', 4)):
            threading.Thread(target=detection_worker, daemon=True).start()

    def _process_transaction(self, transaction: Dict):
        """Multi-layer fraud detection analysis"""
        trap_id = self._detect_trap_trigger(transaction)
        if not trap_id:
            return
            
        with self.analysis_lock:
            if trap_id in self.triggered_traps:
                self.logger.debug(f"Duplicate trigger for trap {trap_id}")
                return
                
            self.triggered_traps.add(trap_id)
            trap = self.active_traps[trap_id]
            trap['trigger_count'] += 1
            trap['last_triggered'] = datetime.utcnow().isoformat()
            
            evidence = {
                'timestamp': datetime.utcnow().isoformat(),
                'transaction': transaction,
                'session_context': self.session_shadow.forensic_analysis(
                    transaction.get('user_id')
                ),
                'network_metadata': self._capture_network_forensics()
            }
            trap['forensic_evidence'].append(evidence)
            self._persist_trap(trap)
            
            self._execute_countermeasures(transaction, trap)
            self.logger.critical(f"TRAP TRIGGERED: {trap_id} by {transaction.get('user_id')}")

    def _detect_trap_trigger(self, transaction: Dict) -> Optional[str]:
        """Multi-factor trap detection logic"""
        # Direct marker match
        if 'decoy_marker' in transaction:
            for trap_id, trap in self.active_traps.items():
                if trap['decoy_data'].get('decoy_marker') == transaction['decoy_marker']:
                    return trap_id
                    
        # Behavioral pattern match
        for trap_id, trap in self.active_traps.items():
            if self._behavioral_match(transaction, trap['decoy_data']):
                return trap_id
                
        # Statistical anomaly detection
        if self._anomaly_detection(transaction):
            return 'ANOMALY_' + hashlib.sha3_256(json.dumps(transaction).encode()).hexdigest()
            
        return None

    def _behavioral_match(self, tx: Dict, decoy: Dict) -> bool:
        """Advanced behavioral pattern matching"""
        # Amount sequencing analysis
        if abs(tx.get('amount', 0) - decoy.get('amount', 0)) < 10:
            return True
            
        # Merchant similarity detection
        tx_merchant = tx.get('merchant', '').lower()
        decoy_merchant = decoy.get('merchant', '').lower()
        if tx_merchant and decoy_merchant and (tx_merchant in decoy_merchant or decoy_merchant in tx_merchant):
            return True
            
        # Temporal analysis
        tx_time = datetime.fromisoformat(tx['timestamp'])
        decoy_time = datetime.fromisoformat(decoy['timestamp'])
        if abs((tx_time - decoy_time).total_seconds()) < 30:
            return True
            
        return False

    def _anomaly_detection(self, tx: Dict) -> bool:
        """Machine learning-based anomaly scoring"""
        # Feature extraction
        features = {
            'amount_velocity': self._calculate_amount_velocity(tx['user_id']),
            'geo_velocity': self._calculate_geo_velocity(tx['user_id']),
            'device_entropy': self._calculate_device_entropy(tx['user_id'])
        }
        
        # Mock anomaly score (real system would use ML model)
        score = min(1.0, 
            (features['amount_velocity'] / 1000) +
            (features['geo_velocity'] / 100) +
            (features['device_entropy'] * 10)
        )
        return score > 0.85

    def _execute_countermeasures(self, tx: Dict, trap: Dict):
        """Execute real-time fraud containment measures"""
        # 1. Session termination
        self.session_shadow._terminate_session(tx['user_id'])
        
        # 2. Network blocking
        self._block_network_source(tx.get('ip_address'))
        
        # 3. Forensic capture
        self._capture_system_state(tx['user_id'])
        
        # 4. Alert escalation
        self._trigger_soc_alert(tx, trap)
        
        # 5. Financial safeguards
        self._freeze_related_accounts(tx['user_id'])

    def _start_forensic_analyzer(self):
        """Background forensic evidence processor"""
        def analyzer_loop():
            while True:
                time.sleep(10)
                self._analyze_trigger_patterns()
        threading.Thread(target=analyzer_loop, daemon=True).start()

    def _analyze_trigger_patterns(self):
        """Advanced pattern analysis of triggered traps"""
        with self.analysis_lock:
            for trap_id in self.triggered_traps:
                trap = self.active_traps.get(trap_id)
                if not trap:
                    continue
                    
                # Temporal analysis
                trigger_times = [datetime.fromisoformat(e['timestamp']) 
                               for e in trap['forensic_evidence']]
                               
                # Geo-pattern analysis
                locations = [e['transaction'].get('geo_code') 
                           for e in trap['forensic_evidence']]
                           
                # Device fingerprint analysis
                devices = [e['transaction'].get('device_hash') 
                         for e in trap['forensic_evidence']]
                         
                # Generate intelligence report
                report = {
                    'trap_id': trap_id,
                    'trigger_count': len(trigger_times),
                    'temporal_pattern': self._detect_temporal_pattern(trigger_times),
                    'geo_cluster': self._detect_geo_cluster(locations),
                    'device_diversity': len(set(devices)),
                    'risk_assessment': self._calculate_risk_level(trap)
                }
                
                self._store_intelligence_report(report)

    def _persist_trap(self, trap: Dict):
        """Crash-safe trap persistence with atomic writes"""
        trap_file = self.trap_archive_dir / f"{trap['trap_id']}.json"
        temp_file = trap_file.with_suffix('.tmp')
        
        try:
            with open(temp_file, 'w') as f:
                json.dump(trap, f, indent=2)
            os.replace(temp_file, trap_file)
        except Exception as e:
            self.logger.error(f"Failed to persist trap {trap['trap_id']}: {str(e)}")

    def _capture_network_forensics(self) -> Dict:
        """Capture network-level forensic evidence"""
        return {
            'tcp_dump': 'mock packet capture data',
            'dns_records': 'mock DNS query log',
            'ssl_certificates': 'mock SSL/TLS cert chain'
        }

    def _block_network_source(self, ip_address: str):
        """Execute network containment measures"""
        self.logger.info(f"Blocking malicious IP {ip_address}")
        # Implementation would interact with firewall/NAC systems

    def _trigger_soc_alert(self, tx: Dict, trap: Dict):
        """Escalate to security operations center"""
        alert = {
            'severity': 'CRITICAL',
            'title': 'Decoy Transaction Triggered',
            'details': {
                'transaction': tx,
                'trap_details': trap['decoy_data'],
                'forensic_summary': trap['forensic_evidence'][-1]
            }
        }
        self.logger.critical(f"SOC Alert: {json.dumps(alert, indent=2)}")

    def get_active_traps(self) -> List[Dict]:
        """Get list of armed traps for monitoring"""
        with self.analysis_lock:
            return [{
                'trap_id': t['trap_id'],
                'decoy_marker': t['decoy_data'].get('decoy_marker'),
                'trigger_count': t['trigger_count']
            } for t in self.active_traps.values()]

    def get_triggered_traps(self) -> List[Dict]:
        """Get detailed report of triggered traps"""
        with self.analysis_lock:
            return [self.active_traps[tid] for tid in self.triggered_traps]

if __name__ == "__main__":
    from session_shadow import SessionShadow  # Assume previous implementation
    
    # Initialize dependencies
    shadow = SessionShadow()
    engine = FraudTrapEngine(shadow)
    
    # Generate test decoy
    decoy_tx = {
        'amount': 1500,
        'merchant': 'Decoy Merchant Inc',
        'decoy_marker': 'DECOY_123',
        'timestamp': datetime.utcnow().isoformat(),
        'user_id': 'user_123',
        'metadata': {
            'is_decoy': True,
            'generated_at': time.time()
        }
    }
    
    # Arm the trap
    trap_id = engine.register_trap(decoy_tx)
    print(f"Armed trap: {trap_id}")
    
    # Simulate malicious transaction
    malicious_tx = decoy_tx.copy()
    malicious_tx['amount'] = 1499.99  # Slight variation
    engine.analyze_transaction(malicious_tx)
    
    # Allow processing time
    time.sleep(2)
    
    # Check results
    print("Triggered traps:", [t['trap_id'] for t in engine.get_triggered_traps()])
    print("Active traps:", engine.get_active_traps())
    print("Active traps count:", len(engine.get_active_traps()))
    print("Triggered traps count:", len(engine.get_triggered_traps()))  
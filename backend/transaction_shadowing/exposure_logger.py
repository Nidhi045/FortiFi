import os
import json
import time
import queue
import threading
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Set
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from utils.logger import StructuredLogger
from utils.config import config

class ExposureLogger:
    def __init__(self):
        self.logger = StructuredLogger(name="ExposureLogger")
        self.log_queue = queue.Queue(maxsize=10000)
        self.encryption_key = self._derive_encryption_key()
        self.iv_cache = {}
        self.active_logs: Set[str] = set()
        self.retention_days = config.get('log_retention_days', 90)
        self.log_rotation_size = config.get('log_rotation_size', 104857600)  # 100MB
        self._init_log_directory()
        self._start_log_processor()
        self._start_retention_enforcer()
        self._start_health_monitor()

    def _derive_encryption_key(self) -> bytes:
        """Derive AES-256-GCM key from system secret"""
        hkdf = HKDF(
            algorithm=hashes.SHA512(),
            length=32,
            salt=config['system_salt'],
            info=b'exposure_log_encryption',
            backend=default_backend()
        )
        return hkdf.derive(config['secret_key'])

    def _init_log_directory(self):
        """Initialize secure log storage structure"""
        self.log_dir = Path(config.get('exposure_log_dir', '/var/log/exposures'))
        self.log_dir.mkdir(exist_ok=True, mode=0o750)
        self.current_log_file = self.log_dir / 'exposures.enc'
        self._rotate_log_file(force=True)

    def log_exposure(self, exposure: Dict):
        """Queue exposure event for secure logging"""
        try:
            sanitized = self._sanitize_exposure(exposure)
            self.log_queue.put_nowait(sanitized)
        except queue.Full:
            self.logger.error("Exposure log queue full - dropping event")

    def _sanitize_exposure(self, exposure: Dict) -> Dict:
        """Anonymize PII and enforce data minimization"""
        sanitized = exposure.copy()
        
        # Hash user identifiers
        if 'user_id' in sanitized:
            sanitized['user_id'] = self._anonymize_id(sanitized['user_id'])
            
        # Remove sensitive fields
        for field in ['ip_address', 'device_id', 'card_number']:
            sanitized.pop(field, None)
            
        # Add audit metadata
        sanitized['_log_meta'] = {
            'received_at': datetime.utcnow().isoformat(),
            'log_version': '2.1',
            'system_id': config['system_id']
        }
        
        return sanitized

    def _anonymize_id(self, user_id: str) -> str:
        """GDPR-compliant identifier hashing"""
        return hashlib.blake2b(
            user_id.encode(),
            salt=config['anon_salt'],
            person=b'exposure_log'
        ).hexdigest()

    def _start_log_processor(self):
        """Background processor for high-throughput logging"""
        def processor_worker():
            while True:
                try:
                    exposure = self.log_queue.get(timeout=1)
                    self._write_exposure(exposure)
                except queue.Empty:
                    self._check_log_rotation()
                    continue

        for _ in range(config.get('log_workers', 4)):
            threading.Thread(target=processor_worker, daemon=True).start()

    def _write_exposure(self, exposure: Dict):
        """Cryptographically secure log write operation"""
        try:
            log_data = json.dumps(exposure) + '\n'
            iv = os.urandom(12)
            
            cipher = Cipher(
                algorithms.AES(self.encryption_key),
                modes.GCM(iv),
                backend=default_backend()
            )
            encryptor = cipher.encryptor()
            encrypted = encryptor.update(log_data.encode()) + encryptor.finalize()
            
            with open(self.current_log_file, 'ab') as f:
                f.write(iv + encryptor.tag + encrypted)
                
            self.active_logs.add(self.current_log_file.name)
        except Exception as e:
            self.logger.error(f"Failed to write exposure: {str(e)}")

    def _check_log_rotation(self):
        """Rotate log file if size exceeds limit"""
        try:
            if self.current_log_file.stat().st_size > self.log_rotation_size:
                self._rotate_log_file()
        except FileNotFoundError:
            self._rotate_log_file(force=True)

    def _rotate_log_file(self, force: bool = False):
        """Perform log rotation with atomic operations"""
        new_file = self.log_dir / f"exposures_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.enc"
        try:
            if not force and self.current_log_file.exists():
                self.current_log_file.rename(new_file)
            self.current_log_file.touch(exist_ok=True)
            os.chmod(self.current_log_file, 0o640)
            self.active_logs.add(self.current_log_file.name)
        except Exception as e:
            self.logger.error(f"Log rotation failed: {str(e)}")

    def _start_retention_enforcer(self):
        """Background thread for log retention management"""
        def retention_loop():
            while True:
                self._enforce_retention_policy()
                time.sleep(3600)  # Run hourly

        threading.Thread(target=retention_loop, daemon=True).start()

    def _enforce_retention_policy(self):
        """Delete logs older than retention period"""
        cutoff = datetime.utcnow() - timedelta(days=self.retention_days)
        for log_file in self.log_dir.glob('*.enc'):
            if log_file.stat().st_mtime < cutoff.timestamp():
                try:
                    log_file.unlink()
                    self.logger.info(f"Deleted old log {log_file.name}")
                except Exception as e:
                    self.logger.error(f"Failed to delete {log_file}: {str(e)}")

    def _start_health_monitor(self):
        """Monitor and report logging system health"""
        def health_loop():
            while True:
                self._report_health()
                time.sleep(300)

        threading.Thread(target=health_loop, daemon=True).start()

    def _report_health(self):
        """Generate system health metrics"""
        stats = {
            'timestamp': datetime.utcnow().isoformat(),
            'queue_size': self.log_queue.qsize(),
            'active_logs': len(self.active_logs),
            'disk_usage': sum(f.stat().st_size for f in self.log_dir.glob('*.enc')),
            'retention_days': self.retention_days
        }
        self.logger.metric("exposure_log_health", stats)

    def search_exposures(self, query: Dict) -> List[Dict]:
        """Compliance interface for log searches"""
        results = []
        for log_file in self.log_dir.glob('*.enc'):
            results.extend(self._search_log_file(log_file, query))
        return results

    def _search_log_file(self, log_file: Path, query: Dict) -> List[Dict]:
        """Search encrypted log file for matching entries"""
        results = []
        try:
            with open(log_file, 'rb') as f:
                while True:
                    iv = f.read(12)
                    tag = f.read(16)
                    if not iv or not tag:
                        break
                        
                    cipher = Cipher(
                        algorithms.AES(self.encryption_key),
                        modes.GCM(iv, tag),
                        backend=default_backend()
                    )
                    decryptor = cipher.decryptor()
                    
                    chunk = b''
                    while True:
                        data = f.read(4096)
                        if not data:
                            break
                        chunk += decryptor.update(data)
                    
                    chunk += decryptor.finalize()
                    
                    for line in chunk.splitlines():
                        entry = json.loads(line)
                        if self._matches_query(entry, query):
                            results.append(entry)
        except Exception as e:
            self.logger.error(f"Search failed for {log_file}: {str(e)}")
        return results

    def _matches_query(self, entry: Dict, query: Dict) -> bool:
        """Check if log entry matches search criteria"""
        for key, value in query.items():
            if key not in entry:
                return False
            if isinstance(value, dict):
                if not self._matches_query(entry[key], value):
                    return False
            elif entry[key] != value:
                return False
        return True

    def handle_data_request(self, user_id: str) -> List[Dict]:
        """GDPR Article 15 compliance interface"""
        anonymized_id = self._anonymize_id(user_id)
        return self.search_exposures({'user_id': anonymized_id})

    def export_logs(self, output_dir: Path) -> Path:
        """Create encrypted export package for forensic analysis"""
        export_time = datetime.utcnow().strftime('%Y%m%d%H%M%S')
        export_path = output_dir / f"exposure_export_{export_time}.zip"
        
        # Create secure export package
        with zipfile.ZipFile(export_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for log_file in self.log_dir.glob('*.enc'):
                zipf.write(log_file, arcname=log_file.name)
                
            # Include metadata
            meta = {
                'export_time': export_time,
                'system_id': config['system_id'],
                'log_count': len(list(self.log_dir.glob('*.enc')))
            }
            zipf.writestr('metadata.json', json.dumps(meta))
            
        # Encrypt the export package
        export_key = os.urandom(32)
        cipher = Cipher(
            algorithms.AES(export_key),
            modes.GCM(os.urandom(12)),
            backend=default_backend()
        )
        encryptor = cipher.encryptor()
        
        with open(export_path, 'rb') as f:
            encrypted_data = encryptor.update(f.read()) + encryptor.finalize()
            
        with open(export_path.with_suffix('.enc'), 'wb') as f:
            f.write(encryptor.iv + encryptor.tag + encrypted_data)
            
        os.remove(export_path)
        return export_path.with_suffix('.enc')

if __name__ == "__main__":
    # Initialize logger with test config
    config.update({
        'secret_key': os.urandom(32),
        'system_salt': os.urandom(16),
        'anon_salt': os.urandom(16),
        'system_id': 'TEST_SYSTEM_001'
    })
    
    logger = ExposureLogger()
    
    # Generate test exposures
    for i in range(5):
        exposure = {
            'event_type': 'DECOY_TRIGGER',
            'user_id': f"user_{i}",
            'timestamp': datetime.utcnow().isoformat(),
            'decoy_marker': f"DECOY_{i}",
            'risk_score': 0.85 + i*0.03
        }
        logger.log_exposure(exposure)
    
    # Allow processing time
    time.sleep(2)
    
    # Demonstrate search
    print("Search results:", logger.search_exposures({'event_type': 'DECOY_TRIGGER'}))
    
    # Demonstrate GDPR export
    print("User data request:", logger.handle_data_request("user_0"))
    
    # Demonstrate forensic export
    export = logger.export_logs(Path('/tmp'))
    print(f"Generated forensic export: {export}")
import zipfile
from cryptography.hazmat.primitives.kdf.hkdf import HKDF    
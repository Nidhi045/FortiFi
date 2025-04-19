import os
import json
import csv
import zlib
import time
import queue
import threading
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from utils.logger import StructuredLogger
from utils.config import config

class LimitLogger:
    def __init__(self, log_dir: str, retention_days: int):
        self.logger = StructuredLogger(name="LimitLogger")
        self.log_dir = Path(log_dir)
        self.retention_days = retention_days
        self.encryption_key = self._derive_encryption_key()
        self.log_queue = queue.Queue(maxsize=10000)
        self.active_log_file = None
        self._init_logging_infra()
        self._start_log_processor()
        self._start_retention_enforcer()

    def _derive_encryption_key(self) -> bytes:
        """Derive AES-256-GCM key from system secret"""
        return hashlib.pbkdf2_hmac(
            'sha256',
            config['log_secret'].encode(),
            salt=os.urandom(16),
            iterations=100000,
            dklen=32
        )

    def _init_logging_infra(self):
        """Initialize logging infrastructure with security checks"""
        self.log_dir.mkdir(exist_ok=True, mode=0o750)
        self.current_log_path = self._get_current_log_path()
        self._rotate_log_file()
        
        # Security verification
        if not os.access(self.log_dir, os.W_OK):
            raise PermissionError(f"Log directory not writable: {self.log_dir}")

    def log(self, log_entry: Dict):
        """Queue log entry for secure writing"""
        try:
            self.log_queue.put_nowait(log_entry)
        except queue.Full:
            self.logger.error("Limit log queue full - entry dropped")

    def _start_log_processor(self):
        """Background thread for log processing"""
        def processor_loop():
            while True:
                try:
                    entry = self.log_queue.get(timeout=1)
                    self._process_log_entry(entry)
                except queue.Empty:
                    self._check_log_rotation()
                    continue

        threading.Thread(target=processor_loop, daemon=True).start()

    def _process_log_entry(self, entry: Dict):
        """Process and write log entry with integrity checks"""
        try:
            encrypted_entry = self._encrypt_entry(entry)
            self._write_to_log(encrypted_entry)
            self._update_index(entry)
        except Exception as e:
            self.logger.error(f"Failed to process log entry: {str(e)}")

    def _encrypt_entry(self, entry: Dict) -> bytes:
        """Encrypt log entry with authenticated encryption"""
        iv = os.urandom(12)
        cipher = Cipher(algorithms.AES(self.encryption_key), modes.GCM(iv), backend=default_backend())
        encryptor = cipher.encryptor()

        serialized = json.dumps(entry).encode()
        compressed = zlib.compress(serialized)
        encrypted = encryptor.update(compressed) + encryptor.finalize()
        
        return iv + encryptor.tag + encrypted

    def _write_to_log(self, data: bytes):
        """Atomic write to current log file"""
        with open(self.current_log_path, 'ab') as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())

    def _update_index(self, entry: Dict):
        """Maintain searchable index for quick audits"""
        index_path = self.log_dir / 'index.csv'
        index_fields = [
            entry['timestamp'],
            entry['user_id'],
            entry['new_limits']['daily'],
            entry['new_limits']['transaction'],
            self.current_log_path.name,
            hashlib.sha256(json.dumps(entry).encode()).hexdigest()
        ]
        
        with open(index_path, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(index_fields)

    def _get_current_log_path(self) -> Path:
        """Generate timestamped log file path"""
        return self.log_dir / f"limits_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.enc"

    def _check_log_rotation(self):
        """Rotate log file if exceeds size limit"""
        if self.current_log_path.stat().st_size > config.get('max_log_size', 104857600):  # 100MB
            self._rotate_log_file()

    def _rotate_log_file(self):
        """Rotate to new log file with atomic operation"""
        new_path = self._get_current_log_path()
        self.current_log_path = new_path
        self.current_log_path.touch(exist_ok=True)
        os.chmod(self.current_log_path, 0o640)
        self.logger.info(f"Rotated to new log file: {new_path.name}")

    def _start_retention_enforcer(self):
        """Background thread for retention management"""
        def retention_loop():
            while True:
                self._enforce_retention_policy()
                time.sleep(3600)  # Run hourly

        threading.Thread(target=retention_loop, daemon=True).start()

    def _enforce_retention_policy(self):
        """Delete logs older than retention period"""
        cutoff = datetime.utcnow() - timedelta(days=self.retention_days)
        for log_file in self.log_dir.glob('*.enc'):
            if datetime.utcfromtimestamp(log_file.stat().st_mtime) < cutoff:
                log_file.unlink()
                self.logger.info(f"Deleted old log file: {log_file.name}")

    def flush(self):
        """Ensure all queued entries are written"""
        while not self.log_queue.empty():
            time.sleep(0.1)
        os.sync()

    def search_logs(self, query: Dict) -> List[Dict]:
        """Search logs using indexed criteria"""
        results = []
        index_path = self.log_dir / 'index.csv'
        
        if not index_path.exists():
            return []

        with open(index_path, 'r') as f:
            reader = csv.reader(f)
            for row in reader:
                if self._matches_query(row, query):
                    log_entry = self._retrieve_log_entry(row[4], row[5])
                    if log_entry:
                        results.append(log_entry)

        return results

    def _matches_query(self, index_row: List[str], query: Dict) -> bool:
        """Check if index row matches query parameters"""
        timestamp = datetime.fromisoformat(index_row[0])
        if 'start_time' in query and timestamp < query['start_time']:
            return False
        if 'end_time' in query and timestamp > query['end_time']:
            return False
        if 'user_id' in query and index_row[1] != query['user_id']:
            return False
        if 'min_daily_limit' in query and float(index_row[2]) < query['min_daily_limit']:
            return False
        return True

    def _retrieve_log_entry(self, log_file: str, entry_hash: str) -> Optional[Dict]:
        """Retrieve and decrypt specific log entry"""
        try:
            with open(self.log_dir / log_file, 'rb') as f:
                while True:
                    iv = f.read(12)
                    tag = f.read(16)
                    data = f.read(4096)
                    
                    if not iv or not tag or not data:
                        break
                        
                    cipher = Cipher(algorithms.AES(self.encryption_key), modes.GCM(iv, tag), backend=default_backend())
                    decryptor = cipher.decryptor()
                    decrypted = decryptor.update(data) + decryptor.finalize()
                    decompressed = zlib.decompress(decrypted)
                    entry = json.loads(decompressed)
                    
                    if hashlib.sha256(json.dumps(entry).encode()).hexdigest() == entry_hash:
                        return entry
        except Exception as e:
            self.logger.error(f"Failed to retrieve log entry: {str(e)}")
            return None

    def export_logs(self, output_path: Path) -> Path:
        """Create encrypted export package"""
        export_dir = output_path / f"limit_logs_export_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        export_dir.mkdir(parents=True, exist_ok=True)
        
        # Copy log files
        for log_file in self.log_dir.glob('*.enc'):
            os.link(log_file, export_dir / log_file.name)
        
        # Create manifest
        manifest = {
            'export_time': datetime.utcnow().isoformat(),
            'log_count': len(list(self.log_dir.glob('*.enc'))),
            'system_id': config['system_id']
        }
        with open(export_dir / 'manifest.json', 'w') as f:
            json.dump(manifest, f)
        
        # Create checksum
        checksum = hashlib.sha256()
        for file in export_dir.glob('*'):
            checksum.update(file.read_bytes())
        (export_dir / 'checksum.sha256').write_text(checksum.hexdigest())
        
        return export_dir

if __name__ == "__main__":
    # Test configuration
    config.update({
        'log_secret': 'secure_secret_key',
        'system_id': 'TEST_SYSTEM_001',
        'max_log_size': 1024  # 1KB for testing rotation
    })
    
    # Initialize logger
    logger = LimitLogger('/tmp/limit_logs_test', retention_days=1)
    
    # Test log entries
    for i in range(5):
        logger.log({
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': f"user_{i}",
            'new_limits': {
                'daily': 1000 * (i+1),
                'transaction': 200 * (i+1)
            },
            'signature': f"signature_{i}"
        })
    
    # Allow processing
    time.sleep(2)
    
    # Test search
    print("Search results:", logger.search_logs({'user_id': 'user_0'}))
    
    # Test export
    export_path = logger.export_logs(Path('/tmp'))
    print(f"Exported logs to: {export_path}")
    
    # Cleanup
    # os.system(f"rm -rf {export_path}")
    # os.system("rm -rf /tmp/limit_logs_test")
    # os.system("rm -rf /tmp/limit_logs_test/*")
    # os.system("rm -rf /tmp/limit_logs_test")    
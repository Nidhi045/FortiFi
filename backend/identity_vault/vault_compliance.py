import os
import json
import csv
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import threading
from utils.logger import StructuredLogger
from utils.config import config

class VaultCompliance:
    def __init__(self):
        self.logger = StructuredLogger(name="VaultCompliance")
        self.base_dir = Path(config.get('compliance_dir', '/var/fortifi/compliance'))
        self.retention_period = timedelta(days=config.get('retention_days', 365))
        self.audit_lock = threading.Lock()
        self.audit_log_dir = self.base_dir / 'audit_logs'
        self.consent_records_dir = self.base_dir / 'consents'
        self.reports_dir = self.base_dir / 'reports'
        self._ensure_directories()
        self._start_retention_enforcer()

    def _ensure_directories(self):
        try:
            self.audit_log_dir.mkdir(parents=True, exist_ok=True, mode=0o750)
            self.consent_records_dir.mkdir(parents=True, exist_ok=True, mode=0o750)
            self.reports_dir.mkdir(parents=True, exist_ok=True, mode=0o750)
        except PermissionError as e:
            self.logger.error(f"Directory creation failed: {str(e)}")
            raise

    def log_operation(self, user_id: str, operation_type: str, metadata: Dict):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': user_id,
            'operation': operation_type,
            'metadata': metadata,
            'system': {
                'host': os.uname().nodename,
                'process_id': os.getpid()
            }
        }
        log_file = self.audit_log_dir / f"{datetime.utcnow().date().isoformat()}.ndjson"
        try:
            with self.audit_lock, open(log_file, 'a') as f:
                f.write(json.dumps(log_entry) + '\n')
        except IOError as e:
            self.logger.error(f"Failed to write audit log: {str(e)}")

    def record_consent(self, user_id: str, consent_type: str, scope: Dict):
        consent_record = {
            'user_id': user_id,
            'timestamp': datetime.utcnow().isoformat(),
            'consent_type': consent_type,
            'scope': scope,
            'method': 'web_form',
            'version': '1.0'
        }
        consent_file = self.consent_records_dir / f"{user_id}.json"
        try:
            with open(consent_file, 'w') as f:
                json.dump(consent_record, f, indent=2)
        except IOError as e:
            self.logger.error(f"Consent recording failed: {str(e)}")

    def generate_audit_report(self, start_date: datetime, end_date: datetime) -> Path:
        report_data = []
        current_date = start_date.date()
        while current_date <= end_date.date():
            log_file = self.audit_log_dir / f"{current_date.isoformat()}.ndjson"
            if log_file.exists():
                with open(log_file, 'r') as f:
                    for line in f:
                        report_data.append(json.loads(line))
            current_date += timedelta(days=1)
        report_path = self.reports_dir / f"audit_report_{datetime.utcnow().timestamp()}.csv"
        if report_data:
            fieldnames = ['timestamp', 'user_id', 'operation', 'metadata', 'system']
            with open(report_path, 'w') as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(report_data)
        return report_path

    def _start_retention_enforcer(self):
        def enforcer_loop():
            while True:
                self._enforce_retention()
                time.sleep(86400)
        thread = threading.Thread(target=enforcer_loop, daemon=True)
        thread.start()

    def _enforce_retention(self):
        cutoff = datetime.utcnow() - self.retention_period
        for log_file in self.audit_log_dir.glob('*.ndjson'):
            file_date = datetime.strptime(log_file.stem, '%Y-%m-%d').date()
            if datetime(file_date.year, file_date.month, file_date.day) < cutoff:
                log_file.unlink()
                self.logger.info(f"Deleted old audit log: {log_file.name}")
        for report_file in self.reports_dir.glob('*.csv'):
            if report_file.stat().st_mtime < cutoff.timestamp():
                report_file.unlink()
                self.logger.info(f"Deleted old report: {report_file.name}")

    def handle_data_subject_request(self, user_id: str) -> Dict:
        user_data = {
            'audit_logs': [],
            'consents': [],
            'breach_reports': []
        }
        for log_file in self.audit_log_dir.glob('*.ndjson'):
            with open(log_file, 'r') as f:
                for line in f:
                    entry = json.loads(line)
                    if entry['user_id'] == user_id:
                        user_data['audit_logs'].append(entry)
        consent_file = self.consent_records_dir / f"{user_id}.json"
        if consent_file.exists():
            with open(consent_file, 'r') as f:
                user_data['consents'] = json.load(f)
        report_path = self.generate_user_report(user_id)
        if report_path.exists():
            user_data['breach_reports'] = str(report_path)
        return user_data

    def generate_user_report(self, user_id: str) -> Path:
        user_data = self.handle_data_subject_request(user_id)
        report_path = self.reports_dir / f"user_report_{user_id}_{datetime.utcnow().date()}.pdf"
        with open(report_path, 'w') as f:
            f.write(f"Compliance Report for {user_id}\n")
            f.write(f"Generated at: {datetime.utcnow().isoformat()}\n")
            f.write(f"Audit Entries: {len(user_data['audit_logs'])}\n")
        return report_path

    def delete_user_data(self, user_id: str) -> bool:
        consent_file = self.consent_records_dir / f"{user_id}.json"
        if consent_file.exists():
            consent_file.unlink()
        self.log_operation(user_id, "DATA_DELETION", {'status': 'completed'})
        return True

if __name__ == "__main__":
    compliance = VaultCompliance()
    compliance.log_operation("user_123", "DATA_STORE", {"type": "email"})
    compliance.record_consent("user_123", "DATA_PROCESSING", {"purpose": "fraud_detection"})
    start_date = datetime.utcnow() - timedelta(days=7)
    report_path = compliance.generate_audit_report(start_date, datetime.utcnow())
    print(f"Generated audit report: {report_path}")
    user_report = compliance.handle_data_subject_request("user_123")
    print("User data:", json.dumps(user_report, indent=2))
    compliance.delete_user_data("user_123")
    print("User data deleted successfully.")
import time 
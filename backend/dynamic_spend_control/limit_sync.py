import os
import json
import time
import threading
import requests
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Any
from utils.logger import StructuredLogger
from utils.config import config

class LimitSync:
    def __init__(self, endpoints: List[str], retry_policy: Dict):
        self.logger = StructuredLogger(name="LimitSync")
        self.endpoints = endpoints
        self.retry_policy = retry_policy
        self.sync_queue = []
        self.sync_lock = threading.Lock()
        self.status_dir = Path(config.get('limit_sync_status_dir', '/var/fortifi/limit_sync_status'))
        self.status_dir.mkdir(parents=True, exist_ok=True)
        self._start_sync_worker()
        self._start_status_monitor()

    def apply(self, user_id: str, limits: Dict) -> Dict:
        """Apply new limits to all endpoints with retry and audit"""
        sync_id = self._generate_sync_id(user_id, limits)
        sync_entry = {
            'sync_id': sync_id,
            'user_id': user_id,
            'limits': limits,
            'status': 'pending',
            'attempts': 0,
            'results': [],
            'timestamp': datetime.utcnow().isoformat()
        }
        with self.sync_lock:
            self.sync_queue.append(sync_entry)
        self.logger.info(f"Queued limit sync for user {user_id} ({sync_id})")
        return {'status': 'queued', 'sync_id': sync_id}

    def _start_sync_worker(self):
        """Background thread for limit synchronization"""
        def sync_loop():
            while True:
                self._process_sync_queue()
                time.sleep(1)
        threading.Thread(target=sync_loop, daemon=True).start()

    def _process_sync_queue(self):
        """Process queued sync requests with retry/backoff"""
        with self.sync_lock:
            for sync_entry in list(self.sync_queue):
                if sync_entry['status'] in ('completed', 'failed'):
                    continue
                self._sync_to_endpoints(sync_entry)
                if sync_entry['status'] in ('completed', 'failed'):
                    self._write_status(sync_entry)
                    self.sync_queue.remove(sync_entry)

    def _sync_to_endpoints(self, sync_entry: Dict):
        """Push limits to all endpoints, retry on failure"""
        endpoints = self.endpoints
        max_retries = self.retry_policy.get('max_retries', 3)
        backoff = self.retry_policy.get('backoff', 1.5)
        results = []
        for endpoint in endpoints:
            attempt = 0
            while attempt <= max_retries:
                try:
                    url = self._format_endpoint_url(endpoint, sync_entry['user_id'])
                    response = requests.post(
                        url,
                        headers=self._auth_headers(),
                        json={'limits': sync_entry['limits'], 'user_id': sync_entry['user_id']},
                        timeout=5
                    )
                    if response.status_code == 200:
                        results.append({'endpoint': endpoint, 'status': 'success'})
                        self.logger.info(f"Limit sync success for {sync_entry['user_id']} at {endpoint}")
                        break
                    else:
                        results.append({'endpoint': endpoint, 'status': 'error', 'code': response.status_code})
                        self.logger.warning(f"Limit sync error {response.status_code} for {sync_entry['user_id']} at {endpoint}")
                        attempt += 1
                        time.sleep(backoff ** attempt)
                except Exception as e:
                    results.append({'endpoint': endpoint, 'status': 'exception', 'error': str(e)})
                    self.logger.error(f"Limit sync exception for {sync_entry['user_id']} at {endpoint}: {e}")
                    attempt += 1
                    time.sleep(backoff ** attempt)
            else:
                sync_entry['status'] = 'failed'
                self.logger.error(f"Limit sync failed for {sync_entry['user_id']} at {endpoint}")
        if all(r['status'] == 'success' for r in results):
            sync_entry['status'] = 'completed'
        sync_entry['results'] = results
        sync_entry['completed_at'] = datetime.utcnow().isoformat()

    def _format_endpoint_url(self, endpoint: str, user_id: str) -> str:
        """Format endpoint URL for limit sync"""
        if '{user_id}' in endpoint:
            return endpoint.format(user_id=user_id)
        return f"{endpoint}/users/{user_id}/limits"

    def _auth_headers(self) -> Dict[str, str]:
        """Generate authentication headers for downstream APIs"""
        token = config.get('sync_api_token', os.environ.get('SYNC_API_TOKEN', 'testtoken'))
        return {
            'Authorization': f"Bearer {token}",
            'Content-Type': 'application/json',
            'X-System-Id': config.get('system_id', 'SPEND_CTRL')
        }

    def _generate_sync_id(self, user_id: str, limits: Dict) -> str:
        """Create unique sync operation identifier"""
        data = f"{user_id}-{json.dumps(limits, sort_keys=True)}-{datetime.utcnow().isoformat()}"
        return hashlib.sha256(data.encode()).hexdigest()

    def _write_status(self, sync_entry: Dict):
        """Write sync status to persistent status file"""
        status_file = self.status_dir / f"{sync_entry['sync_id']}.json"
        with open(status_file, 'w') as f:
            json.dump(sync_entry, f, indent=2)
        self.logger.info(f"Wrote sync status: {status_file}")

    def get_sync_status(self, sync_id: str) -> Optional[Dict]:
        """Retrieve sync status by ID"""
        status_file = self.status_dir / f"{sync_id}.json"
        if not status_file.exists():
            return None
        with open(status_file, 'r') as f:
            return json.load(f)

    def _start_status_monitor(self):
        """Background thread to monitor and clean old status files"""
        def monitor_loop():
            while True:
                self._cleanup_status_files()
                time.sleep(3600)
        threading.Thread(target=monitor_loop, daemon=True).start()

    def _cleanup_status_files(self):
        """Delete status files older than retention period"""
        cutoff = datetime.utcnow() - timedelta(days=30)
        for status_file in self.status_dir.glob('*.json'):
            if datetime.utcfromtimestamp(status_file.stat().st_mtime) < cutoff:
                status_file.unlink()
                self.logger.info(f"Deleted old sync status: {status_file.name}")

    def list_recent_syncs(self, limit: int = 50) -> List[Dict]:
        """List recent sync statuses for monitoring"""
        files = sorted(self.status_dir.glob('*.json'), key=lambda f: f.stat().st_mtime, reverse=True)
        statuses = []
        for f in files[:limit]:
            with open(f, 'r') as file:
                statuses.append(json.load(file))
        return statuses

    def manual_resync(self, sync_id: str):
        """Manual trigger to re-sync a failed operation"""
        sync_entry = self.get_sync_status(sync_id)
        if not sync_entry or sync_entry['status'] != 'failed':
            self.logger.warning(f"No failed sync to resync for {sync_id}")
            return
        sync_entry['status'] = 'pending'
        sync_entry['attempts'] = 0
        with self.sync_lock:
            self.sync_queue.append(sync_entry)
        self.logger.info(f"Manual resync triggered for {sync_id}")

    def sync_summary_report(self, days: int = 7) -> Dict[str, Any]:
        """Generate summary report of sync operations"""
        cutoff = datetime.utcnow() - timedelta(days=days)
        files = [f for f in self.status_dir.glob('*.json') if datetime.utcfromtimestamp(f.stat().st_mtime) > cutoff]
        summary = {
            'total': len(files),
            'completed': 0,
            'failed': 0,
            'pending': 0,
            'by_endpoint': {}
        }
        for f in files:
            with open(f, 'r') as file:
                entry = json.load(file)
                status = entry['status']
                summary[status] = summary.get(status, 0) + 1
                for r in entry.get('results', []):
                    ep = r['endpoint']
                    ep_stats = summary['by_endpoint'].setdefault(ep, {'success': 0, 'error': 0, 'exception': 0})
                    ep_stats[r['status']] = ep_stats.get(r['status'], 0) + 1
        return summary

if __name__ == "__main__":
    endpoints = [
        "http://localhost:8000/api/limits/{user_id}",
        "http://localhost:8001/api/limits"
    ]
    retry_policy = {'max_retries': 2, 'backoff': 1.2}
    sync = LimitSync(endpoints, retry_policy)
    user_id = "user_123"
    limits = {'daily': 2000, 'transaction': 500, 'weekly': 10000}
    result = sync.apply(user_id, limits)
    print("Sync apply result:", result)
    time.sleep(3)
    status = sync.get_sync_status(result['sync_id'])
    print("Sync status:", status)
    print("Recent syncs:", sync.list_recent_syncs())
    print("Summary report:", sync.sync_summary_report(1))
    sync.manual_resync(result['sync_id'])
    print("Manual resync triggered")    
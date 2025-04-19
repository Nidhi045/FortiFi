import os
import json
import time
import queue
import threading
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from concurrent.futures import ThreadPoolExecutor
from utils.logger import StructuredLogger
from utils.config import config
from .user_profile_fetcher import UserProfileFetcher
from .risk_evaluator import RiskEvaluator
from .limit_engine import LimitEngine
from .limit_sync import LimitSync
from .limit_logger import LimitLogger

class SpendController:
    def __init__(self):
        self.logger = StructuredLogger(name="SpendController")
        self._init_queues()
        self._init_components()
        self._start_system_services()
        self._load_circuit_breakers()

    def _init_queues(self):
        """Initialize processing queues with monitoring"""
        self.transaction_queue = queue.PriorityQueue(maxsize=100000)
        self.high_priority_queue = queue.PriorityQueue(maxsize=1000)
        self.emergency_queue = queue.Queue(maxsize=100)
        self.queue_metrics = {
            'total_processed': 0,
            'avg_processing_time': 0.0,
            'last_processed': None
        }

    def _init_components(self):
        """Initialize subsystem components with dependency injection"""
        self.profile_fetcher = UserProfileFetcher(
            cache_size=config.get('profile_cache_size', 1000),
            cache_ttl=config.get('profile_cache_ttl', 300)
        )
        self.risk_evaluator = RiskEvaluator(
            model_path=config.get('risk_model_path', '/models/risk_v1.onnx'),
            rule_engine=PolicyRules()
        )
        self.limit_engine = LimitEngine(
            base_limits=config.get('base_limits', {'daily': 5000, 'transaction': 1000}),
            decay_rate=config.get('limit_decay_rate', 0.1)
        )
        self.limit_sync = LimitSync(
            endpoints=config.get('sync_endpoints', ['payment-core', 'fraud-api']),
            retry_policy=config.get('sync_retry_policy', {'max_retries': 3, 'backoff': 1.5})
        )
        self.limit_logger = LimitLogger(
            log_dir=config.get('limit_log_dir', '/var/log/limit_changes'),
            retention_days=config.get('log_retention_days', 90)
        )

    def _start_system_services(self):
        """Start core system threads and executors"""
        # Main processing workers
        self.workers = ThreadPoolExecutor(
            max_workers=config.get('controller_workers', 32),
            thread_name_prefix='SpendWorker'
        )
        
        # Emergency processing thread
        self.emergency_processor = threading.Thread(
            target=self._process_emergency_queue,
            daemon=True
        )
        self.emergency_processor.start()
        
        # Monitoring thread
        self.monitor = threading.Thread(
            target=self._monitor_system_health,
            daemon=True
        )
        self.monitor.start()

    def _load_circuit_breakers(self):
        """Initialize circuit breakers for fault tolerance"""
        self.circuit_breakers = {
            'profile_service': {'failures': 0, 'last_failure': None, 'tripped': False},
            'risk_service': {'failures': 0, 'last_failure': None, 'tripped': False},
            'limit_service': {'failures': 0, 'last_failure': None, 'tripped': False}
        }

    def process_transaction(self, transaction: Dict, priority: int = 1):
        """Entry point for transaction processing with priority handling"""
        try:
            if self._is_emergency_transaction(transaction):
                self.emergency_queue.put_nowait(transaction)
            else:
                self.transaction_queue.put_nowait((priority, transaction))
            self.logger.debug(f"Queued transaction {transaction.get('id')}")
        except queue.Full:
            self.logger.error("Transaction queue capacity exceeded")
            self._trigger_circuit_breaker('queue_overflow')

    def _process_emergency_queue(self):
        """Dedicated emergency processing pipeline"""
        while True:
            try:
                tx = self.emergency_queue.get(timeout=1)
                start_time = time.monotonic()
                self._process_transaction(tx, emergency=True)
                processing_time = time.monotonic() - start_time
                self._update_metrics(processing_time)
            except queue.Empty:
                continue

    def _process_transaction(self, transaction: Dict, emergency: bool = False):
        """Core transaction processing logic"""
        tx_id = transaction.get('id')
        user_id = transaction['user_id']
        
        try:
            # Stage 1: Fetch user profile
            profile = self._get_user_profile(user_id)
            
            # Stage 2: Risk evaluation
            risk_assessment = self._evaluate_risk(profile, transaction)
            
            # Stage 3: Limit calculation
            limit_update = self._calculate_limits(profile, risk_assessment)
            
            # Stage 4: Synchronization
            if limit_update:
                sync_result = self._sync_limits(user_id, limit_update)
                self._log_limit_change(user_id, limit_update, sync_result)
                
                if emergency:
                    self._execute_emergency_protocols(user_id, limit_update)

            return True
        except Exception as e:
            self.logger.error(f"Failed processing {tx_id}: {str(e)}")
            self._handle_processing_failure(user_id)
            return False

    def _get_user_profile(self, user_id: str) -> Dict:
        """Get user profile with circuit breaker protection"""
        if self.circuit_breakers['profile_service']['tripped']:
            raise RuntimeError("Profile service circuit breaker tripped")
            
        try:
            return self.profile_fetcher.get_full_profile(user_id)
        except Exception as e:
            self._update_circuit_breaker('profile_service')
            raise

    def _evaluate_risk(self, profile: Dict, transaction: Dict) -> Dict:
        """Risk evaluation with fallback strategies"""
        if self.circuit_breakers['risk_service']['tripped']:
            return self._fallback_risk_assessment(transaction)
            
        try:
            return self.risk_evaluator.evaluate(
                profile, 
                transaction,
                use_ai=not self.circuit_breakers['risk_service']['tripped']
            )
        except Exception as e:
            self._update_circuit_breaker('risk_service')
            return self._fallback_risk_assessment(transaction)

    def _calculate_limits(self, profile: Dict, risk: Dict) -> Optional[Dict]:
        """Limit calculation with degradation handling"""
        try:
            return self.limit_engine.calculate(
                current_limits=profile['limits'],
                risk_assessment=risk,
                market_conditions=self._get_market_conditions()
            )
        except Exception as e:
            self.logger.error(f"Limit calculation failed: {str(e)}")
            return None

    def _sync_limits(self, user_id: str, limits: Dict) -> Dict:
        """Limit synchronization with retry logic"""
        attempts = 0
        max_retries = self.limit_sync.retry_policy['max_retries']
        
        while attempts <= max_retries:
            try:
                return self.limit_sync.apply(user_id, limits)
            except Exception as e:
                attempts += 1
                if attempts > max_retries:
                    raise
                sleep_time = self.limit_sync.retry_policy['backoff'] ** attempts
                time.sleep(sleep_time)

    def _log_limit_change(self, user_id: str, limits: Dict, sync_result: Dict):
        """Audit logging with cryptographic signatures"""
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': user_id,
            'new_limits': limits,
            'sync_status': sync_result.get('status'),
            'signature': self._generate_log_signature(user_id, limits)
        }
        self.limit_logger.log(log_entry)

    def _generate_log_signature(self, user_id: str, limits: Dict) -> str:
        """Generate HMAC signature for audit log integrity"""
        secret = config.get('log_secret', os.urandom(32))
        return hashlib.blake2b(
            json.dumps(limits).encode(),
            key=secret,
            salt=user_id.encode()
        ).hexdigest()

    def _monitor_system_health(self):
        """Comprehensive system health monitoring"""
        while True:
            self._check_circuit_breakers()
            self._adjust_worker_pool()
            self._report_system_status()
            time.sleep(10)

    def _check_circuit_breakers(self):
        """Evaluate and reset circuit breakers"""
        for service, state in self.circuit_breakers.items():
            if state['tripped'] and (datetime.now() - state['last_failure']).seconds > 300:
                state.update({'tripped': False, 'failures': 0})
                self.logger.info(f"Reset circuit breaker for {service}")

    def shutdown(self):
        """Orderly system shutdown procedure"""
        self.logger.info("Initiating controlled shutdown...")
        self.workers.shutdown(wait=True)
        self.limit_logger.flush()
        self._dump_queue_state()
        self.logger.info("Shutdown complete")

if __name__ == "__main__":
    controller = SpendController()
    
    # Simulate load
    for i in range(1000):
        tx = {
            'id': f"tx_{i}",
            'user_id': f"user_{i%100}",
            'amount': 100 * (i%10 + 1),
            'merchant': 'Test Merchant',
            'category': 'testing'
        }
        controller.process_transaction(tx)
    
    time.sleep(5)
    controller.shutdown()
    print("Controller shutdown successfully.")
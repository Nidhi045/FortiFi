import os
import time
import json
import logging
import threading
from datetime import datetime, timedelta
from typing import Dict, Optional, List
from cryptography.fernet import Fernet
import requests
from retry import retry

logger = logging.getLogger(__name__)

class CardLifecycleManager:
    def __init__(self, generator, validator):
        self.generator = generator
        self.validator = validator
        self.lock = threading.Lock()
        self.webhook_urls = self._load_webhook_config()
        self.retention_days = 7  # GDPR-compliant retention period
        
        # Start background tasks
        self._start_expiration_monitor()
        self._start_retention_cleaner()
        self._start_fraud_monitor()

    def _load_webhook_config(self) -> List[str]:
        """Load webhook endpoints for real-time notifications"""
        return [
            "https://fraud-alert.example.com/api/v1/notify",
            "https://banking-core.example.com/api/card-status"
        ]

    def invalidate_card(self, card_number: str, reason: str = "used"):
        """Immediately invalidate a card and notify stakeholders"""
        with self.lock:
            card_id = hashlib.sha3_256(card_number.encode()).hexdigest()
            if metadata := self.generator.card_metadata_store.get(card_id):
                metadata['status'] = 'invalidated'
                metadata['invalidation_reason'] = reason
                metadata['invalidated_at'] = datetime.utcnow().isoformat()
                
                # Log the invalidation
                logger.warning(f"Invalidated card {card_id} - Reason: {reason}")
                
                # Trigger webhooks
                self._trigger_webhooks(card_id, reason)
                
                return True
            return False

    @retry(tries=3, delay=1, backoff=2, logger=logger)
    def _trigger_webhooks(self, card_id: str, reason: str):
        """Notify external systems with retry logic"""
        payload = {
            'card_id': card_id,
            'timestamp': datetime.utcnow().isoformat(),
            'reason': reason,
            'action': 'card_invalidation'
        }
        
        for url in self.webhook_urls:
            try:
                response = requests.post(
                    url,
                    json=payload,
                    timeout=3,
                    headers={'Authorization': f"Bearer {os.getenv('WEBHOOK_TOKEN')}"}
                )
                response.raise_for_status()
            except Exception as e:
                logger.error(f"Webhook failed to {url}: {str(e)}")
                raise

    def _start_expiration_monitor(self):
        """Background thread to invalidate expired cards"""
        def monitor_loop():
            while True:
                try:
                    now = datetime.utcnow()
                    to_invalidate = []
                    
                    with self.lock:
                        for card_id, metadata in self.generator.card_metadata_store.items():
                            expires_at = datetime.fromisoformat(metadata['expires_at'])
                            if expires_at < now and metadata.get('status') != 'invalidated':
                                to_invalidate.append(card_id)
                                
                        for card_id in to_invalidate:
                            self.invalidate_card_by_id(card_id, reason="expired")
                            
                    time.sleep(60)  # Check every minute
                    
                except Exception as e:
                    logger.error(f"Expiration monitor failed: {str(e)}")

        threading.Thread(target=monitor_loop, daemon=True).start()

    def _start_retention_cleaner(self):
        """Background thread to purge old records"""
        def cleaner_loop():
            while True:
                try:
                    cutoff = datetime.utcnow() - timedelta(days=self.retention_days)
                    to_delete = []
                    
                    with self.lock:
                        for card_id, metadata in self.generator.card_metadata_store.items():
                            invalidated_at = metadata.get('invalidated_at')
                            if invalidated_at and datetime.fromisoformat(invalidated_at) < cutoff:
                                to_delete.append(card_id)
                                
                        for card_id in to_delete:
                            del self.generator.card_metadata_store[card_id]
                            
                    logger.info(f"Cleaned up {len(to_delete)} expired card records")
                    time.sleep(3600)  # Run hourly
                    
                except Exception as e:
                    logger.error(f"Retention cleaner failed: {str(e)}")

        threading.Thread(target=cleaner_loop, daemon=True).start()

    def _start_fraud_monitor(self):
        """Monitor for fraud events and auto-invalidate"""
        def fraud_loop():
            while True:
                try:
                    # In production, this would consume from a message queue
                    # For now, simulate fraud detection
                    time.sleep(5)
                except Exception as e:
                    logger.error(f"Fraud monitor failed: {str(e)}")

        threading.Thread(target=fraud_loop, daemon=True).start()

    def handle_fraud_event(self, card_number: str, risk_data: Dict):
        """Handle fraud detection from validation system"""
        logger.critical(f"Fraud detected on card {card_number}: {risk_data}")
        self.invalidate_card(card_number, reason="fraud")
        self._trigger_fraud_investigation(card_number, risk_data)

    def _trigger_fraud_investigation(self, card_number: str, risk_data: Dict):
        """Initiate full fraud investigation workflow"""
        investigation_id = hashlib.sha3_256(card_number.encode()).hexdigest()[:16]
        payload = {
            'investigation_id': investigation_id,
            'card_number': card_number,
            'risk_score': risk_data.get('risk_score', 0),
            'indicators': risk_data.get('failure_reasons', []),
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Store investigation record
        investigation_path = Path(f"/var/investigations/{investigation_id}.json")
        investigation_path.write_text(json.dumps(payload))
        
        # Alert SOC team
        logger.info(f"Initiated fraud investigation {investigation_id}")

    def get_card_status(self, card_number: str) -> Dict:
        """Retrieve current card lifecycle status"""
        card_id = hashlib.sha3_256(card_number.encode()).hexdigest()
        with self.lock:
            if metadata := self.generator.card_metadata_store.get(card_id):
                return {
                    'status': metadata.get('status', 'active'),
                    'generated_at': metadata['generated_at'],
                    'expires_at': metadata['expires_at'],
                    'usage_count': metadata['usage_count'],
                    'invalidated': metadata.get('invalidated_at')
                }
            return {'error': 'card_not_found'}

    def invalidate_card_by_id(self, card_id: str, reason: str):
        """Internal invalidation by card ID"""
        with self.lock:
            if metadata := self.generator.card_metadata_store.get(card_id):
                card_number = "***" + json.loads(
                    Fernet(self.generator.encryption_key).decrypt(
                        metadata['encrypted_data'].encode()
                    )
                )['card_number'][-4:]
                self.invalidate_card(card_number, reason)

if __name__ == "__main__":
    from card_generator import VirtualCardGenerator
    from card_validator import VirtualCardValidator
    
    # Initialize components
    generator = VirtualCardGenerator()
    validator = VirtualCardValidator(generator)
    lifecycle = CardLifecycleManager(generator, validator)
    
    # Generate test card
    config = VirtualCardConfig(user_id="test_user", expiry_minutes=1/60)  # 1 minute expiry
    card = generator.generate_card(config)
    
    # Test expiration monitor
    print("Card status:", lifecycle.get_card_status(card['card_number']))
    time.sleep(70)  # Wait for expiration
    print("Expired status:", lifecycle.get_card_status(card['card_number']))
    
    # Test fraud handling
    lifecycle.handle_fraud_event(card['card_number'], {'risk_score': 0.8})
    print("Fraud status:", lifecycle.get_card_status(card['card_number']))
    
    # Test cleanup
    lifecycle._start_retention_cleaner()
    time.sleep(2)
    print("Retention status:", lifecycle.get_card_status(card['card_number']))
import hashlib
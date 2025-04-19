import random
import time
import json
from datetime import datetime, timedelta
from typing import Dict, List
from faker import Faker
from utils.logger import StructuredLogger
from utils.config import config

class DecoyGenerator:
    def __init__(self):
        self.logger = StructuredLogger(name="DecoyGenerator")
        self.faker = Faker()
        self.decoy_pool = []
        self.decoy_types = config.get('decoy_types', ['amount', 'merchant', 'timing'])
        self.user_profiles = {}
        self.load_interval = config.get('decoy_refresh_interval', 300)
        self._load_decoy_patterns()
        
    def _load_decoy_patterns(self):
        """Load decoy templates from config"""
        self.decoy_templates = {
            'amount': {
                'min_amount_multiplier': 0.5,
                'max_amount_multiplier': 3.0,
                'amount_step': 50
            },
            'merchant': {
                'risk_categories': ['gambling', 'crypto', 'adult'],
                'fake_merchant_format': '{adjective} {noun} {suffix}'
            },
            'timing': {
                'min_delay_sec': 2,
                'max_delay_sec': 15
            }
        }
        
    def generate_decoy(self, user_session: Dict) -> Dict:
        """Generate context-aware decoy transaction"""
        decoy_type = self._select_decoy_type(user_session)
        base_tx = user_session.get('last_transaction', {})
        
        if decoy_type == 'amount':
            return self._create_amount_decoy(base_tx)
        elif decoy_type == 'merchant':
            return self._create_merchant_decoy(base_tx)
        elif decoy_type == 'timing':
            return self._create_timing_decoy(base_tx)
        else:
            return self._create_random_decoy()

    def _create_amount_decoy(self, base_tx: Dict) -> Dict:
        """Generate amount-based decoy"""
        base_amount = base_tx.get('amount', 100)
        min_amount = base_amount * self.decoy_templates['amount']['min_amount_multiplier']
        max_amount = base_amount * self.decoy_templates['amount']['max_amount_multiplier']
        amount = random.randrange(
            int(min_amount // 100) * 100,
            int(max_amount // 100) * 100,
            self.decoy_templates['amount']['amount_step']
        )
        return self._build_decoy(base_tx, {
            'amount': amount,
            'decoy_marker': 'amt_' + hashlib.sha3_256(str(amount).encode()).hexdigest()[:8]
        })

    def _create_merchant_decoy(self, base_tx: Dict) -> Dict:
        """Generate merchant-based decoy"""
        template = self.decoy_templates['merchant']
        merchant = template['fake_merchant_format'].format(
            adjective=self.faker.color_name(),
            noun=self.faker.word(),
            suffix=random.choice(['LLC', 'Inc', 'Group'])
        )
        return self._build_decoy(base_tx, {
            'merchant': merchant,
            'merchant_risk': random.choice(template['risk_categories']),
            'decoy_marker': 'mch_' + hashlib.sha3_256(merchant.encode()).hexdigest()[:8]
        })

    def _build_decoy(self, base_tx: Dict, overrides: Dict) -> Dict:
        """Construct decoy transaction with honeypot markers"""
        decoy = {
            'timestamp': datetime.utcnow().isoformat(),
            'user_id': base_tx.get('user_id', ''),
            'device_fingerprint': base_tx.get('device_fingerprint', ''),
            'ip_address': self.faker.ipv4(),
            **overrides,
            'metadata': {
                'is_decoy': True,
                'generated_at': time.time(),
                'decoy_system': 'shadow_v1'
            }
        }
        self.decoy_pool.append(decoy)
        return decoy

    def _select_decoy_type(self, user_session: Dict) -> str:
        """Select decoy type based on user behavior"""
        tx_history = user_session.get('transaction_history', [])
        if len(tx_history) < 3:
            return random.choice(self.decoy_types)
            
        last_amounts = [tx.get('amount', 0) for tx in tx_history[-3:]]
        amount_variance = max(last_amounts) - min(last_amounts)
        
        if amount_variance > 1000:
            return 'amount'
        elif any(tx.get('merchant_risk') == 'high' for tx in tx_history):
            return 'merchant'
        else:
            return 'timing'

    def refresh_decoys(self):
        """Periodically refresh decoy pool"""
        while True:
            self.decoy_pool = [d for d in self.decoy_pool 
                             if time.time() - d['metadata']['generated_at'] < 3600]
            time.sleep(self.load_interval)

if __name__ == "__main__":
    generator = DecoyGenerator()
    test_session = {
        'last_transaction': {
            'amount': 1500,
            'merchant': 'SecureStore Inc',
            'user_id': 'user_123'
        },
        'transaction_history': [
            {'amount': 1200, 'timestamp': '2025-04-20T12:00:00Z'},
            {'amount': 800, 'timestamp': '2025-04-20T12:05:00Z'}
        ]
    }
    print("Amount decoy:", generator.generate_decoy(test_session))
    print("Merchant decoy:", generator.generate_decoy(test_session))
    print("Timing decoy:", generator.generate_decoy(test_session))
    print("Random decoy:", generator.generate_decoy(test_session))  
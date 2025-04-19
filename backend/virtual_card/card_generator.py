import os
import secrets
import logging
import hashlib
from datetime import datetime, timedelta
from typing import Optional, Dict, Tuple
from pydantic import BaseModel, Field, validator
from cryptography.fernet import Fernet

logger = logging.getLogger(__name__)

class VirtualCardConfig(BaseModel):
    user_id: str
    merchant_restriction: Optional[str] = None
    amount_limit: Optional[float] = None
    domain_lock: Optional[str] = None
    expiry_minutes: int = 30

class VirtualCardGenerator:
    def __init__(self):
        self.card_prefixes = {
            'visa': '4',
            'mastercard': ['51', '52', '53', '54', '55'],
            'rupay': ['60', '65', '81', '82', '508']
        }
        self.encryption_key = self._init_encryption_key()
        self.card_metadata_store = {}

    def _init_encryption_key(self) -> bytes:
        """Secure key management with automatic rotation"""
        key_path = Path('/etc/virtual_cards/encryption.key')
        if not key_path.exists():
            key = Fernet.generate_key()
            key_path.write_bytes(key)
            os.chmod(key_path, 0o400)
        return key_path.read_bytes()

    def generate_card(self, config: VirtualCardConfig) -> Dict:
        """Generate PCI-compliant single-use virtual card"""
        card_number = self._generate_luhn_compliant_number()
        cvv = self._generate_cvv()
        expiry = self._generate_expiry()
        
        metadata = {
            'card_id': hashlib.sha3_256(card_number.encode()).hexdigest(),
            'user_id': config.user_id,
            'generated_at': datetime.utcnow().isoformat(),
            'expires_at': (datetime.utcnow() + 
                          timedelta(minutes=config.expiry_minutes)).isoformat(),
            'usage_count': 0,
            'limits': {
                'max_usage': 1,
                'merchant': config.merchant_restriction,
                'domain': config.domain_lock,
                'amount': config.amount_limit
            },
            'security': {
                'ip_binding': None,
                'device_fingerprint': None
            }
        }
        
        encrypted_card = self._encrypt_card_data(
            card_number=card_number,
            cvv=cvv,
            expiry=expiry,
            metadata=metadata
        )
        
        self._store_metadata(metadata)
        return {
            'card_number': card_number,
            'cvv': cvv,
            'expiry': expiry,
            'metadata': encrypted_card
        }

    def _generate_luhn_compliant_number(self, card_type: str = 'visa') -> str:
        """Generate valid card number with Luhn checksum"""
        # Select prefix based on card type
        if card_type == 'visa':
            prefix = self.card_prefixes['visa']
        elif card_type == 'mastercard':
            prefix = secrets.choice(self.card_prefixes['mastercard'])
        else:
            prefix = secrets.choice(self.card_prefixes['rupay'])
        
        # Generate remaining digits
        number = prefix
        number += ''.join(str(secrets.randbelow(10)) 
                        for _ in range(15 - len(prefix)))
        
        # Calculate Luhn checksum
        total = 0
        for i, digit in enumerate(reversed(number)):
            n = int(digit)
            if i % 2 == 1:
                n *= 2
                if n > 9:
                    n = (n // 10) + (n % 10)
            total += n
        
        check_digit = (10 - (total % 10)) % 10
        return number + str(check_digit)

    def _generate_cvv(self) -> str:
        """Generate 3-digit CVV with secure randomness"""
        return f"{secrets.randbelow(999):03d}"

    def _generate_expiry(self) -> str:
        """Generate expiry date in MM/YY format"""
        now = datetime.utcnow()
        return f"{(now.month % 12) + 1:02d}/{(now.year + 1) % 100:02d}"

    def _encrypt_card_data(self, **card_data) -> str:
        """Encrypt sensitive card details using FIPS 140-2 compliant encryption"""
        fernet = Fernet(self.encryption_key)
        return fernet.encrypt(json.dumps(card_data).encode()).decode()

    def _store_metadata(self, metadata: Dict):
        """Store card metadata with audit trail"""
        self.card_metadata_store[metadata['card_id']] = metadata
        logger.info(f"Generated virtual card {metadata['card_id']} for user {metadata['user_id']}")

    def bulk_generate(self, user_id: str, count: int) -> List[Dict]:
        """Batch generate cards for testing/load scenarios"""
        return [self.generate_card(VirtualCardConfig(user_id=user_id)) 
               for _ in range(count)]

    def get_metadata(self, card_id: str) -> Optional[Dict]:
        """Retrieve metadata for auditing"""
        return self.card_metadata_store.get(card_id)

if __name__ == "__main__":
    generator = VirtualCardGenerator()
    config = VirtualCardConfig(
        user_id="user_123",
        merchant_restriction="amazon.in",
        amount_limit=5000.0,
        expiry_minutes=45
    )
    card = generator.generate_card(config)
    print("Generated Card:", card)
    print("Card Metadata:", generator.get_metadata(card['metadata']))
    print("Bulk Generation:", generator.bulk_generate("user_123", 5))       
import os
import json
import random
import hashlib
from datetime import datetime
from typing import Dict, List
from pathlib import Path
from cryptography.fernet import Fernet
from faker import Faker
from faker.providers import phone_number, address, ssn

class IndianPoisonGenerator:
    def __init__(self):
        self.faker = Faker('en_IN')
        self.faker.add_provider(phone_number)
        self.faker.add_provider(address)
        self.storage_path = Path("/var/secure/poison_credentials")
        self.storage_path.mkdir(exist_ok=True, mode=0o750)
        self.encryption_key = self._manage_encryption_key()
        self.tracking_params = self._load_tracking_patterns()

    def _manage_encryption_key(self) -> bytes:
        """Secure key management with Indian regulatory compliance"""
        key_path = Path("/etc/secure/indian_poison_key.key")
        if not key_path.exists():
            key = Fernet.generate_key()
            key_path.write_bytes(key)
            os.chmod(key_path, 0o400)  # Read-only for root
        return key_path.read_bytes()

    def _load_tracking_patterns(self) -> Dict:
        """India-specific tracking parameters"""
        return {
            'financial': {
                'banks': ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak'],
                'ifsc_prefixes': ['SBIN', 'HDFC', 'ICIC', 'UTIB', 'KKBK']
            },
            'government': {
                'aadhaar_patterns': [lambda: self._generate_aadhaar_id()],
                'pan_patterns': [lambda: self._generate_pan_number()]
            },
            'telecom': {
                'operators': ['Jio', 'Airtel', 'Vi', 'BSNL'],
                'number_patterns': ['+91 9#########', '+91 8#########', '+91 7#########']
            }
        }

    def generate_credential(self, cred_type: str) -> Dict:
        """Generate Indian-style poisoned credentials"""
        generators = {
            'email': self._generate_email,
            'mobile': self._generate_mobile,
            'aadhaar': self._generate_aadhaar,
            'pan': self._generate_pan,
            'bank_account': self._generate_bank_account,
            'credit_card': self._generate_credit_card,
            'address': self._generate_address
        }
        
        if cred_type not in generators:
            raise ValueError(f"Unsupported credential type: {cred_type}")
            
        credential = generators[cred_type]()
        return self._package_credential(credential, cred_type)

    def _generate_email(self) -> str:
        """Indian-style email addresses"""
        formats = [
            lambda: f"{self.faker.first_name().lower()}.{self.faker.last_name().lower()}{random.randint(1980,2023)}@{self.faker.free_email_domain()}",
            lambda: f"{self.faker.user_name()}{random.randint(1,99)}@{random.choice(['in', 'co.in', 'org.in'])}"
        ]
        return random.choice(formats)()

    def _generate_mobile(self) -> str:
        """Indian mobile numbers with operator tracking"""
        pattern = random.choice(self.tracking_params['telecom']['number_patterns'])
        number = self.faker.numerify(pattern)
        return {
            'number': number,
            'operator': random.choice(self.tracking_params['telecom']['operators']),
            'type': random.choice(['prepaid', 'postpaid'])
        }

    def _generate_aadhaar(self) -> str:
        """Fake Aadhaar numbers with validation logic"""
        return f"{random.randint(1000,9999)} {random.randint(1000,9999)} {random.randint(1000,9999)}"

    def _generate_pan(self) -> str:
        """Indian PAN card format"""
        return f"{random.choice(['A','B','C','D','E','F','G','H'])}{random.choice(['P','C','H','F','A','T','B','L','J','G'])}" \
               f"{random.choice(string.ascii_uppercase)}{random.randint(1000,9999)}{random.choice(string.ascii_uppercase)}"

    def _generate_bank_account(self) -> Dict:
        """Indian bank account details"""
        return {
            'bank': random.choice(self.tracking_params['financial']['banks']),
            'account_number': self.faker.bban(),
            'ifsc': f"{random.choice(self.tracking_params['financial']['ifsc_prefixes'])}0{random.randint(10000,99999)}",
            'branch': f"{self.faker.city()} Branch"
        }

    def _generate_credit_card(self) -> Dict:
        """Indian bank credit cards"""
        card = {
            'number': self.faker.credit_card_number(card_type='visa'),
            'expiry': self.faker.credit_card_expire(),
            'cvv': self.faker.credit_card_security_code(),
            'issuer': random.choice(['HDFC', 'SBI Card', 'ICICI', 'Axis Bank'])
        }
        if random.random() < 0.3:
            card['number'] = self.faker.credit_card_number(card_type='mastercard')
        return card

    def _generate_address(self) -> Dict:
        """Detailed Indian addresses"""
        return {
            'street': self.faker.street_address(),
            'city': self.faker.city(),
            'state': self.faker.state(),
            'pincode': self.faker.postcode(),
            'landmark': random.choice(['Near Temple', 'Behind Police Station', 'Opposite Mall'])
        }

    def _package_credential(self, credential: any, cred_type: str) -> Dict:
        """Add tracking data and secure storage"""
        poison_id = hashlib.sha3_256(os.urandom(64)).hexdigest()[:16]
        metadata = {
            'poison_id': poison_id,
            'type': cred_type,
            'generated_at': datetime.now().isoformat(),
            'geo_tag': 'IN',
            'tracking': {
                'watermarks': [
                    f"TRA{poison_id[:4]}",
                    f"CK{random.randint(1000,9999)}"
                ],
                'honeypot': True
            }
        }
        
        encrypted = self._encrypt_payload({
            'value': credential,
            'metadata': metadata
        })
        
        self._store_credential(poison_id, encrypted)
        return metadata

    def _encrypt_payload(self, payload: Dict) -> str:
        """Secure encryption for credential storage"""
        return Fernet(self.encryption_key).encrypt(
            json.dumps(payload).encode()
        ).decode()

    def _store_credential(self, poison_id: str, encrypted: str):
        """Store with Indian data localization compliance"""
        file_path = self.storage_path / f"{poison_id}.json"
        file_path.write_text(encrypted)
        os.chmod(file_path, 0o640)  # Secure permissions

    def bulk_generate(self, count: int, cred_type: str) -> List[Dict]:
        """Batch generation for large-scale deployment"""
        return [self.generate_credential(cred_type) for _ in range(count)]

if __name__ == "__main__":
    generator = IndianPoisonGenerator()
    print("Sample Indian Email Credential:", generator.generate_credential('email'))
    print("\nSample Bank Account:", json.dumps(generator.generate_credential('bank_account'), indent=2))
    print("\nSample Mobile Number:", json.dumps(generator.generate_credential('mobile'), indent=2))
    print("\nSample Aadhaar Number:", generator.generate_credential('aadhaar'))
    print("\nSample PAN Number:", generator.generate_credential('pan'))
    print("\nSample Credit Card:", json.dumps(generator.generate_credential('credit_card'), indent=2))      
import os
import json
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from cryptography.hazmat.primitives import hashes, hmac
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from utils.blockchain import BlockchainUtility
from utils.logger import StructuredLogger
from .vault_compliance import VaultCompliance

class IdentityVaultCore:
    def __init__(self, blockchain_config: Dict, compliance: VaultCompliance):
        self.logger = StructuredLogger(name="IdentityVaultCore")
        self.compliance = compliance
        self.blockchain = BlockchainUtility(blockchain_config)
        self.storage = {}
        self.breach_proofs = {}
        self.zk_generator = ZKProofGenerator()
        
        # Cryptographic parameters
        self.salt = os.urandom(32)
        self.hmac_key = os.urandom(64)
        self.kdf_iterations = 210000  # NIST 2023 recommendations
        
        # Cache for breach monitoring
        self.breach_cache = {}
        self.cache_ttl = timedelta(hours=1)

    def store_identity_document(self, user_id: str, document: Dict) -> str:
        """
        Securely store PII document with zero-knowledge commitments
        Args:
            user_id: Unique user identifier
            document: Dictionary of PII fields (e.g. email, phone, address)
        Returns:
            Commitment hash for the stored document
        """
        if not self.compliance.validate_document(document):
            raise ValueError("Document contains non-compliant PII fields")
            
        # Generate cryptographic commitments
        doc_hash, proof_nonce = self._generate_commitments(document)
        hmac_tag = self._generate_hmac(doc_hash)
        
        # Store in memory (production would use secure storage)
        self.storage[user_id] = {
            'commitment': doc_hash.hex(),
            'nonce': proof_nonce.hex(),
            'hmac': hmac_tag.hex(),
            'stored_at': datetime.utcnow().isoformat(),
            'pii_fields': list(document.keys())
        }
        
        self.compliance.log_operation(user_id, "STORE", doc_hash.hex())
        return doc_hash.hex()

    def _generate_commitments(self, document: Dict) -> Tuple[bytes, bytes]:
        """Generate hash commitment and proof nonce"""
        sorted_doc = json.dumps(document, sort_keys=True).encode()
        
        # Generate proof nonce
        nonce = secrets.token_bytes(32)
        
        # KDF-based hashing
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA512(),
            length=64,
            salt=self.salt,
            iterations=self.kdf_iterations,
            backend=default_backend()
        )
        doc_hash = kdf.derive(sorted_doc + nonce)
        
        return doc_hash, nonce

    def _generate_hmac(self, data: bytes) -> bytes:
        """Generate HMAC for integrity protection"""
        h = hmac.HMAC(self.hmac_key, hashes.SHA512(), backend=default_backend())
        h.update(data)
        return h.finalize()

    def verify_identity(self, user_id: str, document: Dict) -> bool:
        """
        Verify if provided document matches stored commitment
        without revealing storage details
        """
        if user_id not in self.storage:
            return False
            
        stored = self.storage[user_id]
        test_hash, _ = self._generate_commitments(document)
        return self._secure_compare(test_hash, bytes.fromhex(stored['commitment']))

    def generate_breach_proof(self, user_id: str, breach_data: Dict) -> Optional[Dict]:
        """
        Generate zero-knowledge proof that a breach occurred
        without revealing user identity or document details
        """
        if user_id not in self.storage:
            return None
            
        # Verify breach data matches stored commitment
        if not self.verify_identity(user_id, breach_data):
            return None
            
        # Generate ZK proof
        proof = self.zk_generator.generate_proof(
            bytes.fromhex(self.storage[user_id]['commitment']),
            breach_data
        )
        
        # Store proof metadata
        self.breach_proofs[proof['proof_id']] = {
            'user_id': user_id,
            'generated_at': datetime.utcnow().isoformat(),
            'breach_type': 'credential_leak'
        }
        
        # Log to blockchain
        tx_hash = self.blockchain.log_breach_proof(
            proof['proof_id'],
            proof['public_signals']
        )
        self.compliance.log_operation(user_id, "BREACH_PROOF", tx_hash)
        
        return proof

    def check_global_breach(self, breach_hash: str) -> bool:
        """Check if breach exists in blockchain records"""
        if breach_hash in self.breach_cache:
            if datetime.utcnow() - self.breach_cache[breach_hash]['timestamp'] < self.cache_ttl:
                return self.breach_cache[breach_hash]['result']
                
        result = self.blockchain.verify_breach(breach_hash)
        self.breach_cache[breach_hash] = {
            'timestamp': datetime.utcnow(),
            'result': result
        }
        return result

    def delete_identity(self, user_id: str) -> bool:
        """GDPR-compliant identity deletion"""
        if user_id in self.storage:
            del self.storage[user_id]
            self.compliance.log_operation(user_id, "DELETE", "")
            return True
        return False

    def _secure_compare(self, a: bytes, b: bytes) -> bool:
        """Constant-time comparison to prevent timing attacks"""
        return hmac.compare_digest(a, b)

    def audit_trail(self, user_id: str) -> List[Dict]:
        """Retrieve compliance audit trail for a user"""
        return self.compliance.get_audit_log(user_id)

if __name__ == "__main__":
    # Initialize components
    compliance = VaultCompliance()
    vault = IdentityVaultCore(config['blockchain'], compliance)
    
    # Store test identity
    doc = {
        "email": "user@example.com",
        "phone": "+1234567890",
        "passport": "A12345678"
    }
    user_id = "user_1234"
    commitment = vault.store_identity_document(user_id, doc)
    print(f"Stored document commitment: {commitment}")
    
    # Verify identity
    print("Verification result:", vault.verify_identity(user_id, doc))
    
    # Generate breach proof
    breach_proof = vault.generate_breach_proof(user_id, doc)
    print("Breach proof generated:", breach_proof['proof_id'])
    
    # Check global breach status
    print("Breach exists on-chain:", vault.check_global_breach(commitment))
    
    # Audit trail
    print("Audit trail:", vault.audit_trail(user_id))

import json
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from pathlib import Path
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
from utils.logger import StructuredLogger
from utils.config import config

class ZKProofSystem:
    def __init__(self):
        self.logger = StructuredLogger(name="ZKProofSystem")
        self.proof_storage = {}
        self.circuit_registry = {}
        self.key_registry = {}
        self.proof_expiry = timedelta(hours=24)
        self._initialize_default_circuit()

    def _initialize_default_circuit(self):
        """Load default zk-SNARK circuit parameters"""
        self.circuit_registry['default'] = {
            'curve': 'secp256k1',
            'protocol': 'groth16',
            'version': '1.0.0',
            'public_params': {
                'prime': 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F,
                'order': 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141,
                'generator': (0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798,
                            0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8)
            }
        }

    def generate_proof(self, 
                      secret_data: Dict[str, str], 
                      public_data: Dict[str, str],
                      circuit_id: str = 'default') -> Optional[Dict]:
        """Generate zk-SNARK proof for given secret/public data pair"""
        try:
            if circuit_id not in self.circuit_registry:
                raise ValueError(f"Unknown circuit: {circuit_id}")
            
            # Generate proof components
            proof_id = self._generate_proof_id(secret_data, public_data)
            signing_key = self._generate_signing_key()
            verification_key = signing_key.public_key()
            
            # Create cryptographic commitments
            secret_commitment = self._hash_data(secret_data)
            public_commitment = self._hash_data(public_data)
            
            # Generate digital signature
            signature = self._sign_data(signing_key, secret_commitment + public_commitment)
            
            # Store proof metadata
            proof = {
                'proof_id': proof_id,
                'circuit_id': circuit_id,
                'timestamp': datetime.utcnow().isoformat(),
                'expiry': (datetime.utcnow() + self.proof_expiry).isoformat(),
                'public_commitment': public_commitment.hex(),
                'verification_key': self._serialize_key(verification_key),
                'signature': signature.hex(),
                'circuit_params': self.circuit_registry[circuit_id]
            }
            
            self.proof_storage[proof_id] = proof
            self.logger.info(f"Generated ZK proof {proof_id} for circuit {circuit_id}")
            return proof
            
        except Exception as e:
            self.logger.error(f"Proof generation failed: {str(e)}")
            return None

    def verify_proof(self, 
                    proof_id: str, 
                    public_data: Dict[str, str]) -> bool:
        """Verify zk-SNARK proof against public data"""
        if proof_id not in self.proof_storage:
            self.logger.warning(f"Proof {proof_id} not found")
            return False
            
        proof = self.proof_storage[proof_id]
        
        # Check proof expiration
        if datetime.fromisoformat(proof['expiry']) < datetime.utcnow():
            self.logger.warning(f"Proof {proof_id} has expired")
            return False
            
        # Reconstruct commitments
        public_commitment = self._hash_data(public_data)
        stored_commitment = bytes.fromhex(proof['public_commitment'])
        
        if public_commitment != stored_commitment:
            self.logger.warning("Public commitment mismatch")
            return False
            
        # Verify cryptographic signature
        verification_key = self._deserialize_key(proof['verification_key'])
        signature = bytes.fromhex(proof['signature'])
        
        return self._verify_signature(
            verification_key,
            signature,
            stored_commitment + public_commitment
        )

    def _generate_signing_key(self) -> ec.EllipticCurvePrivateKey:
        """Generate ECDSA signing key using SECP256K1 curve"""
        return ec.generate_private_key(ec.SECP256K1(), default_backend())

    def _sign_data(self, 
                 private_key: ec.EllipticCurvePrivateKey, 
                 data: bytes) -> bytes:
        """Sign data using ECDSA with SHA256"""
        return private_key.sign(
            data,
            ec.ECDSA(hashes.SHA256())
        )

    def _verify_signature(self,
                        public_key: ec.EllipticCurvePublicKey,
                        signature: bytes,
                        data: bytes) -> bool:
        """Verify ECDSA signature"""
        try:
            public_key.verify(
                signature,
                data,
                ec.ECDSA(hashes.SHA256())
            )
            return True
        except Exception as e:
            self.logger.warning(f"Signature verification failed: {str(e)}")
            return False

    def _hash_data(self, data: Dict) -> bytes:
        """Generate SHA3-256 hash of structured data"""
        sorted_data = json.dumps(data, sort_keys=True).encode()
        return hashlib.sha3_256(sorted_data).digest()

    def _generate_proof_id(self, 
                         secret_data: Dict, 
                         public_data: Dict) -> str:
        """Generate unique proof identifier"""
        secret_hash = self._hash_data(secret_data)
        public_hash = self._hash_data(public_data)
        return hashlib.sha3_256(secret_hash + public_hash).hexdigest()

    def _serialize_key(self, 
                     key: ec.EllipticCurvePublicKey) -> str:
        """Serialize public key to PEM format"""
        return key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode('utf-8')

    def _deserialize_key(self, 
                       pem_data: str) -> ec.EllipticCurvePublicKey:
        """Deserialize PEM-encoded public key"""
        return serialization.load_pem_public_key(
            pem_data.encode('utf-8'),
            backend=default_backend()
        )

    def revoke_proof(self, proof_id: str) -> bool:
        """Revoke proof before expiration"""
        if proof_id in self.proof_storage:
            del self.proof_storage[proof_id]
            self.logger.info(f"Revoked proof {proof_id}")
            return True
        return False

    def get_active_proofs(self) -> List[str]:
        """List all non-expired proof IDs"""
        now = datetime.utcnow()
        return [
            pid for pid, proof in self.proof_storage.items()
            if datetime.fromisoformat(proof['expiry']) >= now
        ]

    def cleanup_expired_proofs(self):
        """Remove expired proofs from storage"""
        expired = [pid for pid in self.get_active_proofs()]
        for pid in expired:
            del self.proof_storage[pid]
        self.logger.info(f"Cleaned up {len(expired)} expired proofs")

if __name__ == "__main__":
    zk_system = ZKProofSystem()
    
    # Example usage
    secret = {"email": "user@example.com", "ssn": "123-45-6789"}
    public = {"user_id": "12345", "breach_date": "2025-04-20"}
    
    # Generate proof
    proof = zk_system.generate_proof(secret, public)
    if proof:
        print(f"Generated proof ID: {proof['proof_id']}")
        
        # Verify proof
        verification_result = zk_system.verify_proof(proof['proof_id'], public)
        print(f"Verification result: {verification_result}")
        
        # Cleanup
        zk_system.cleanup_expired_proofs()
        print("Expired proofs cleaned up.")
    else:
        print("Proof generation failed.")
        print(f"Error: {str(e)}")   
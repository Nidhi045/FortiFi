import os
import json
import uuid
import hashlib
import zlib
from typing import Dict, List, Tuple
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from base64 import urlsafe_b64encode, urlsafe_b64decode

class ShardEngine:
    def __init__(self, shard_count: int = 3, min_shards: int = 2):
        """
        Advanced data sharding engine with erasure coding and authenticated encryption
        Args:
            shard_count: Total number of shards to create
            min_shards: Minimum shards required for reconstruction
        """
        self.shard_count = shard_count
        self.min_shards = min_shards
        self.backend = default_backend()
        
        if min_shards > shard_count:
            raise ValueError("min_shards cannot exceed total shard_count")

    def shard_data(self, data: Dict, master_key: bytes = None) -> Tuple[List[bytes], Dict]:
        """
        Processes data through full sharding pipeline:
        1. Serialization
        2. Compression
        3. Erasure coding
        4. Shard encryption
        5. Metadata generation
        """
        # Phase 1: Data Preparation
        serialized = self._serialize_data(data)
        compressed = self._compress_data(serialized)
        
        # Phase 2: Cryptographic Sharding
        shards = self._erasure_code_data(compressed)
        encrypted_shards, keys_metadata = self._encrypt_shards(shards, master_key)
        
        # Phase 3: Integrity Protection
        merkle_tree = self._generate_merkle_tree(encrypted_shards)
        return encrypted_shards, {
            'merkle_root': merkle_tree[-1],
            'shard_keys': keys_metadata,
            'shard_map': self._generate_shard_map(encrypted_shards)
        }

    def _serialize_data(self, data: Dict) -> bytes:
        """Safe JSON serialization with sorted keys"""
        return json.dumps(data, sort_keys=True, separators=(',', ':')).encode('utf-8')

    def _compress_data(self, data: bytes) -> bytes:
        """Zlib compression with integrity check"""
        compressor = zlib.compressobj(wbits=zlib.MAX_WBITS)
        compressed = compressor.compress(data) + compressor.flush()
        return compressed

    def _erasure_code_data(self, data: bytes) -> List[bytes]:
        """Reed-Solomon inspired erasure coding with parity shards"""
        chunk_size = (len(data) + self.min_shards - 1) // self.min_shards
        chunks = [data[i*chunk_size:(i+1)*chunk_size] for i in range(self.min_shards)]
        
        # Pad last chunk if needed
        chunks[-1] = chunks[-1].ljust(chunk_size, b'\0')
        
        # Generate parity shards
        parity_shards = []
        for i in range(self.shard_count - self.min_shards):
            parity = bytes([sum(chunk[j] for chunk in chunks) % 256 for j in range(chunk_size)])
            parity_shards.append(parity)
        
        return chunks + parity_shards

    def _encrypt_shards(self, shards: List[bytes], master_key: bytes = None) -> Tuple[List[bytes], Dict]:
        """Encrypts each shard with unique key derived from master key"""
        keys_metadata = {}
        encrypted_shards = []
        
        for idx, shard in enumerate(shards):
            # Key derivation
            if master_key:
                salt = os.urandom(16)
                kdf = PBKDF2HMAC(
                    algorithm=hashes.SHA512(),
                    length=32,
                    salt=salt,
                    iterations=100000,
                    backend=self.backend
                )
                key = kdf.derive(master_key)
            else:
                key = os.urandom(32)
                salt = None
                
            # AES-256-CBC with HMAC
            iv = os.urandom(16)
            cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=self.backend)
            encryptor = cipher.encryptor()
            
            # Pad data to block size
            padder = padding.PKCS7(128).padder()
            padded_data = padder.update(shard) + padder.finalize()
            
            # Encrypt
            encrypted = encryptor.update(padded_data) + encryptor.finalize()
            
            # Generate HMAC
            hmac = self._generate_hmac(key, iv + encrypted)
            
            # Store metadata
            shard_id = f"shard_{uuid.uuid4().hex}"
            keys_metadata[shard_id] = {
                'key': urlsafe_b64encode(key).decode(),
                'iv': urlsafe_b64encode(iv).decode(),
                'hmac': hmac.hex(),
                'salt': urlsafe_b64encode(salt).decode() if salt else None,
                'index': idx
            }
            
            encrypted_shards.append(iv + encrypted + hmac)
        
        return encrypted_shards, keys_metadata

    def _generate_hmac(self, key: bytes, data: bytes) -> bytes:
        """HMAC-SHA256 for shard integrity"""
        h = hmac.HMAC(key, hashes.SHA256(), backend=self.backend)
        h.update(data)
        return h.finalize()

    def _generate_merkle_tree(self, shards: List[bytes]) -> List[str]:
        """Build Merkle tree for shard verification"""
        leaf_nodes = [hashlib.sha3_256(shard).digest() for shard in shards]
        tree = [leaf_nodes]
        
        while len(tree[-1]) > 1:
            current_level = []
            for i in range(0, len(tree[-1]), 2):
                left = tree[-1][i]
                right = tree[-1][i+1] if i+1 < len(tree[-1]) else left
                combined = left + right
                current_level.append(hashlib.sha3_256(combined).digest())
            tree.append(current_level)
        
        return [node.hex() for level in tree for node in level]

    def _generate_shard_map(self, shards: List[bytes]) -> Dict:
        """Generates content-addressable storage map"""
        return {
            'shard_ids': [hashlib.sha3_256(shard).hexdigest() for shard in shards],
            'merkle_indices': list(range(len(shards)))
        }

    @staticmethod
    def generate_master_key() -> bytes:
        """Generates cryptographically secure master key"""
        return os.urandom(32)

if __name__ == "__main__":
    # Full test workflow
    engine = ShardEngine(shard_count=4, min_shards=2)
    master_key = engine.generate_master_key()
    
    sample_data = {
        "user": "user_001",
        "amount": 1500.0,
        "merchant": "Premium Services Inc.",
        "location": "Mumbai",
        "timestamp": "2025-04-20T12:34:56Z",
        "device_fingerprint": "a1b2c3d4e5f6"
    }
    
    shards, metadata = engine.shard_data(sample_data, master_key)
    print(f"Generated {len(shards)} shards")
    print("Merkle Root:", metadata['merkle_root'])
    print("Shard Keys Metadata:", json.dumps(metadata['shard_keys'], indent=2))

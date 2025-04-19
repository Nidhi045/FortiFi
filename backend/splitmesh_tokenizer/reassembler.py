import os
import json
import hashlib
import zlib
from typing import Dict, List, Optional
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding, hashes, hmac
from cryptography.hazmat.backends import default_backend
from base64 import urlsafe_b64decode
from utils.blockchain import BlockchainUtility
from utils.logger import StructuredLogger

class Reassembler:
    def __init__(self, contract_config: Dict[str, str], min_shards: int = 2):
        self.min_shards = min_shards
        self.backend = default_backend()
        self.logger = StructuredLogger(name="Reassembler")
        self.blockchain = BlockchainUtility(
            contract_config['rpc_url'],
            contract_config['contract_address'],
            contract_config['abi_path'],
            contract_config['private_key']
        )

    def reassemble(self, tx_id: str, shards: List[bytes], keys_metadata: Dict, requestor: str) -> Optional[Dict]:
        if not self._verify_permission_onchain(tx_id, requestor):
            self.logger.error(f"Permission denied for {requestor} to reassemble tx {tx_id}")
            return None

        if len(shards) < self.min_shards:
            self.logger.error(f"Insufficient shards ({len(shards)}) for reassembly (min required: {self.min_shards})")
            return None

        decrypted_chunks = []
        for shard, (shard_id, meta) in zip(shards, keys_metadata.items()):
            key = urlsafe_b64decode(meta['key'])
            iv = urlsafe_b64decode(meta['iv'])
            hmac_val = bytes.fromhex(meta['hmac'])
            salt = urlsafe_b64decode(meta['salt']) if meta.get('salt') else None

            # Integrity check
            if not self._verify_hmac(key, shard, hmac_val):
                self.logger.error(f"HMAC validation failed for shard {shard_id}")
                return None

            # Decrypt
            decrypted = self._decrypt_shard(shard, key, iv)
            decrypted_chunks.append(decrypted)

        # Erasure decode (strip parity, join, decompress, deserialize)
        data_bytes = self._combine_chunks(decrypted_chunks)
        try:
            decompressed = zlib.decompress(data_bytes)
            data = json.loads(decompressed.decode('utf-8'))
            self.logger.info(f"Successfully reassembled transaction {tx_id}")
            return data
        except Exception as e:
            self.logger.error(f"Failed to decompress or decode data: {e}")
            return None

    def _decrypt_shard(self, encrypted: bytes, key: bytes, iv: bytes) -> bytes:
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=self.backend)
        decryptor = cipher.decryptor()
        padded = decryptor.update(encrypted[16:-32]) + decryptor.finalize()
        unpadder = padding.PKCS7(128).unpadder()
        return unpadder.update(padded) + unpadder.finalize()

    def _verify_hmac(self, key: bytes, data: bytes, expected_hmac: bytes) -> bool:
        h = hmac.HMAC(key, hashes.SHA256(), backend=self.backend)
        h.update(data)
        try:
            h.verify(expected_hmac)
            return True
        except Exception:
            return False

    def _combine_chunks(self, chunks: List[bytes]) -> bytes:
        # Remove parity (last chunk), join the rest
        if len(chunks) > self.min_shards:
            chunks = chunks[:self.min_shards]
        return b''.join(chunks)

    def _verify_permission_onchain(self, tx_id: str, requestor: str) -> bool:
        try:
            return self.blockchain.call_function("verifyRecombinationPermission", tx_id, requestor)
        except Exception as e:
            self.logger.error(f"Blockchain permission check failed: {e}")
            return False

if __name__ == "__main__":
    # Example usage with mock data
    contract_config = {
        'rpc_url': os.getenv('BLOCKCHAIN_RPC_URL'),
        'contract_address': os.getenv('CONTRACT_ADDRESS'),
        'abi_path': os.getenv('CONTRACT_ABI_PATH'),
        'private_key': os.getenv('PRIVATE_KEY')
    }
    reassembler = Reassembler(contract_config)
    # You would provide actual shards and keys_metadata from ShardEngine/shard storage
    print("Reassembler ready for integration.")
    # Example: reassembler.reassemble(tx_id, shards, keys_metadata, requestor)

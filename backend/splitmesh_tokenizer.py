import os
import uuid
import hashlib
import random
from typing import Dict, List, Optional
from datetime import datetime

class ShardStorageProvider:
    def __init__(self, base_path: str):
        self.base_path = base_path
        os.makedirs(self.base_path, exist_ok=True)

    def store_shard(self, shard_id: str, data: bytes) -> str:
        shard_path = os.path.join(self.base_path, f"{shard_id}.shard")
        with open(shard_path, "wb") as f:
            f.write(data)
        return shard_path

    def retrieve_shard(self, shard_id: str) -> Optional[bytes]:
        shard_path = os.path.join(self.base_path, f"{shard_id}.shard")
        if not os.path.exists(shard_path):
            return None
        with open(shard_path, "rb") as f:
            return f.read()

    def delete_shard(self, shard_id: str):
        shard_path = os.path.join(self.base_path, f"{shard_id}.shard")
        if os.path.exists(shard_path):
            os.remove(shard_path)

class SplitMeshTokenizer:
    def __init__(self, shard_count: int, storage_providers: List[ShardStorageProvider]):
        self.shard_count = shard_count
        self.providers = storage_providers
        if len(self.providers) != self.shard_count:
            raise ValueError("Number of storage providers must match shard count.")

    def _split_data(self, data: bytes) -> List[bytes]:
        shard_size = len(data) // self.shard_count
        shards = [data[i * shard_size:(i + 1) * shard_size] for i in range(self.shard_count - 1)]
        shards.append(data[(self.shard_count - 1) * shard_size:])
        return shards

    def _combine_shards(self, shards: List[bytes]) -> bytes:
        return b"".join(shards)

    def tokenize_transaction(self, tx_record: Dict) -> Dict[str, str]:
        tx_bytes = str(tx_record).encode("utf-8")
        shards = self._split_data(tx_bytes)
        shard_ids = []
        for idx, shard in enumerate(shards):
            shard_id = f"{tx_record['tx_id']}_shard_{idx}_{uuid.uuid4().hex[:8]}"
            self.providers[idx].store_shard(shard_id, shard)
            shard_ids.append(shard_id)
        return {f"shard_{i}": shard_ids[i] for i in range(self.shard_count)}

    def reconstruct_transaction(self, shard_id_map: Dict[str, str]) -> Optional[Dict]:
        shards = []
        for i in range(self.shard_count):
            shard_id = shard_id_map.get(f"shard_{i}")
            if not shard_id:
                return None
            shard = self.providers[i].retrieve_shard(shard_id)
            if shard is None:
                return None
            shards.append(shard)
        tx_bytes = self._combine_shards(shards)
        try:
            return eval(tx_bytes.decode("utf-8"))
        except Exception:
            return None

    def attempt_unauthorized_access(self, shard_id: str, provider_idx: int) -> bool:
        """Returns True if attacker can reconstruct data from a single shard (should always be False)."""
        shard = self.providers[provider_idx].retrieve_shard(shard_id)
        if not shard or len(shard) < 8:
            return False
        try:
            # Try to decode as UTF-8 and parse as dict (should fail)
            _ = eval(shard.decode("utf-8"))
            return True
        except Exception:
            return False

    def delete_transaction(self, shard_id_map: Dict[str, str]):
        for i in range(self.shard_count):
            shard_id = shard_id_map.get(f"shard_{i}")
            if shard_id:
                self.providers[i].delete_shard(shard_id)

# Example usage for demo/testing
if __name__ == "__main__":
    tx = {
        "tx_id": "tx_123456",
        "user_id": "user_001",
        "amount": 1200.50,
        "merchant": "Amazon",
        "timestamp": datetime.utcnow().isoformat(),
        "status": "completed"
    }
    # Setup three local storage providers (simulate S3, GCP, Azure, etc.)
    providers = [
        ShardStorageProvider("./shard_store_1"),
        ShardStorageProvider("./shard_store_2"),
        ShardStorageProvider("./shard_store_3"),
    ]
    tokenizer = SplitMeshTokenizer(shard_count=3, storage_providers=providers)

    # Tokenize and store
    shard_map = tokenizer.tokenize_transaction(tx)
    print("Shard map:", shard_map)

    # Attempt unauthorized access (should fail)
    success = tokenizer.attempt_unauthorized_access(shard_map["shard_0"], 0)
    print("Unauthorized access result:", success)

    # Reconstruct (authorized)
    reconstructed = tokenizer.reconstruct_transaction(shard_map)
    print("Reconstructed transaction:", reconstructed)

    # Delete shards
    tokenizer.delete_transaction(shard_map)

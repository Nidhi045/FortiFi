import torch
import os
import hashlib
import hmac
import time
from typing import Dict, Any
from utils.logger import StructuredLogger
from .delta_encoder import DeltaEncoder

class ModelUpdater:
    def __init__(self, model_registry_path: str = "/var/fortifi/models", secret_key: bytes = b'fortifi_federation_secret'):
        self.registry_path = model_registry_path
        self.secret_key = secret_key
        self.logger = StructuredLogger(name="ModelUpdater")
        os.makedirs(self.registry_path, exist_ok=True)

    def apply_update(self, delta: Dict[str, Any], metadata: Dict[str, Any]):
        if not self._validate_delta(delta, metadata.get('proof', '')):
            self.logger.error("Delta integrity check failed. Update rejected.")
            return False

        current_model = self._load_current_model()
        updated_weights = self._merge_delta(current_model, delta)
        version_hash = self._commit_new_version(updated_weights, metadata)
        self.logger.info(f"Model updated and committed: version {version_hash}")
        return True

    def _load_current_model(self) -> Dict[str, torch.Tensor]:
        current_path = os.path.join(self.registry_path, "current.pth")
        if not os.path.exists(current_path):
            # Initialize with random weights for demonstration
            self.logger.warning("No current model found. Initializing new model.")
            return {"layer1.weight": torch.randn(64, 32), "layer1.bias": torch.randn(64)}
        return torch.load(current_path)

    def _merge_delta(self, model: Dict[str, torch.Tensor], delta: Dict[str, Any]) -> Dict[str, torch.Tensor]:
        updated = {}
        for k in model:
            if k in delta:
                # Convert numpy array to tensor if necessary
                delta_tensor = torch.tensor(delta[k]) if not isinstance(delta[k], torch.Tensor) else delta[k]
                updated[k] = model[k] + delta_tensor
            else:
                updated[k] = model[k]
        return updated

    def _commit_new_version(self, weights: Dict[str, torch.Tensor], metadata: Dict[str, Any]) -> str:
        version_hash = hashlib.sha3_256(str(metadata).encode()).hexdigest()[:12]
        version_path = os.path.join(self.registry_path, f"{version_hash}.pth")
        torch.save(weights, version_path)
        torch.save(weights, os.path.join(self.registry_path, "current.pth"))
        self.logger.info(f"Committed model version {version_hash} at {version_path}")
        return version_hash

    def _validate_delta(self, delta: Dict[str, Any], proof: str) -> bool:
        expected_proof = self._generate_proof(delta)
        result = hmac.compare_digest(expected_proof, proof)
        if not result:
            self.logger.error(f"Delta validation failed. Expected {expected_proof}, got {proof}")
        return result

    def _generate_proof(self, delta: Dict[str, Any]) -> str:
        sorted_keys = sorted(delta.keys())
        proof_data = b''.join([
            torch.tensor(delta[k]).numpy().tobytes() if not isinstance(delta[k], torch.Tensor) else delta[k].numpy().tobytes()
            for k in sorted_keys
        ])
        return hmac.new(self.secret_key, proof_data, hashlib.sha3_256).hexdigest()

if __name__ == "__main__":
    updater = ModelUpdater()
    dummy_delta = {"layer1.weight": torch.randn(64, 32), "layer1.bias": torch.randn(64)}
    dummy_metadata = {
        "proof": updater._generate_proof(dummy_delta),
        "timestamp": time.time()
    }
    updater.apply_update(dummy_delta, dummy_metadata)

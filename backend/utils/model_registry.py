import os
import torch
import hashlib
import time
from typing import Dict, Any, Optional

class ModelRegistry:
    def __init__(self, registry_path: str = "/var/fortifi/models"):
        self.registry_path = registry_path
        os.makedirs(self.registry_path, exist_ok=True)

    def get_current_model(self) -> Dict[str, torch.Tensor]:
        current_path = os.path.join(self.registry_path, "current.pth")
        if not os.path.exists(current_path):
            return self._initialize_model()
        return torch.load(current_path)

    def commit_version(self, weights: Dict[str, torch.Tensor], metadata: Optional[Dict[str, Any]] = None) -> str:
        version_hash = self._generate_version_hash(weights, metadata)
        version_path = os.path.join(self.registry_path, f"{version_hash}.pth")
        torch.save(weights, version_path)
        torch.save(weights, os.path.join(self.registry_path, "current.pth"))
        if metadata:
            meta_path = os.path.join(self.registry_path, f"{version_hash}.meta")
            with open(meta_path, "w") as f:
                f.write(str(metadata))
        return version_hash

    def list_versions(self) -> list:
        return [f for f in os.listdir(self.registry_path) if f.endswith(".pth") and f != "current.pth"]

    def load_version(self, version_hash: str) -> Dict[str, torch.Tensor]:
        version_path = os.path.join(self.registry_path, f"{version_hash}.pth")
        if not os.path.exists(version_path):
            raise FileNotFoundError(f"Model version {version_hash} not found.")
        return torch.load(version_path)

    def _generate_version_hash(self, weights: Dict[str, torch.Tensor], metadata: Optional[Dict[str, Any]]) -> str:
        hash_input = str(time.time())
        for k, v in sorted(weights.items()):
            hash_input += k + str(v.sum().item())
        if metadata:
            hash_input += str(sorted(metadata.items()))
        return hashlib.sha3_256(hash_input.encode()).hexdigest()[:16]

    def _initialize_model(self) -> Dict[str, torch.Tensor]:
        # Dummy initial weights for demonstration
        weights = {
            "layer1.weight": torch.randn(64, 32),
            "layer1.bias": torch.randn(64),
            "layer2.weight": torch.randn(32, 16)
        }
        torch.save(weights, os.path.join(self.registry_path, "current.pth"))
        return weights

if __name__ == "__main__":
    registry = ModelRegistry("/tmp/fortifi_models")
    model = registry.get_current_model()
    print("Current model keys:", list(model.keys()))
    version = registry.commit_version(model, {"updated_by": "test"})
    print("Committed version hash:", version)
    print("Available versions:", registry.list_versions())
    loaded = registry.load_version(version)
    print("Loaded version keys:", list(loaded.keys()))

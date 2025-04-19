import torch
import os
from typing import Any, Dict

class ModelLoader:
    def __init__(self, model_dir: str = "/models"):
        self.model_dir = model_dir

    def load_behavior_model(self, model_path: str = None):
        path = model_path or os.path.join(self.model_dir, "behavior_profiler_epoch50.pth")
        if not os.path.exists(path):
            raise FileNotFoundError(f"Behavior model not found at {path}")
        model = self._get_model_architecture()
        model.load_state_dict(torch.load(path, map_location=self._get_device()))
        model.eval()
        return model

    def _get_model_architecture(self):
        from timelock_verification.behavior_profiler import LSTMBehaviorProfiler
        return LSTMBehaviorProfiler().to(self._get_device())

    def _get_device(self):
        return torch.device("cuda" if torch.cuda.is_available() else "cpu")

    def save_model(self, model: Any, path: str):
        torch.save(model.state_dict(), path)

    def load_model_version(self, version_hash: str) -> Any:
        path = os.path.join(self.model_dir, f"{version_hash}.pth")
        if not os.path.exists(path):
            raise FileNotFoundError(f"Model version {version_hash} not found.")
        model = self._get_model_architecture()
        model.load_state_dict(torch.load(path, map_location=self._get_device()))
        model.eval()
        return model

    def list_versions(self):
        return [f for f in os.listdir(self.model_dir) if f.endswith(".pth")]

if __name__ == "__main__":
    loader = ModelLoader("/models")
    try:
        model = loader.load_behavior_model()
        print("Behavior model loaded successfully.")
    except Exception as e:
        print("Error loading model:", e)
    print("Available model versions:", loader.list_versions())
    try:
        version_model = loader.load_model_version("some_version_hash")
        print("Model version loaded successfully.")
    except Exception as e:
        print("Error loading model version:", e)    
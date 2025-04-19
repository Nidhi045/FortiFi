import torch
import numpy as np
import hashlib
import hmac
from typing import Dict, Any

class DeltaEncoder:
    def __init__(self, epsilon: float = 0.7, delta: float = 1e-5):
        self.epsilon = epsilon  # Privacy budget
        self.delta = delta      # Privacy failure probability
        self._validate_parameters()

    def compute_secure_delta(self, 
                            current_state: Dict[str, torch.Tensor], 
                            updated_state: Dict[str, torch.Tensor],
                            secret_key: bytes) -> Dict[str, Any]:
        """Computes differentially private model delta with integrity proof"""
        raw_delta = self._compute_raw_delta(current_state, updated_state)
        protected_delta = self._apply_differential_privacy(raw_delta)
        integrity_proof = self._generate_integrity_proof(protected_delta, secret_key)
        
        return {
            'delta': protected_delta,
            'proof': integrity_proof,
            'metadata': {
                'epsilon': self.epsilon,
                'delta': self.delta,
                'timestamp': torch.tensor(time.time()).item()
            }
        }

    def _compute_raw_delta(self, current, updated):
        return {k: updated[k] - current[k] for k in current.keys()}

    def _apply_differential_privacy(self, delta: Dict[str, torch.Tensor]) -> Dict[str, torch.Tensor]:
        sigma = np.sqrt(2 * np.log(1.25 / self.delta)) / self.epsilon
        return {k: v + torch.normal(0, sigma, size=v.shape) for k, v in delta.items()}

    def _generate_integrity_proof(self, delta: Dict[str, torch.Tensor], secret: bytes) -> str:
        sorted_keys = sorted(delta.keys())
        proof_data = b''.join([self._serialize_tensor(delta[k]) for k in sorted_keys])
        return hmac.new(secret, proof_data, hashlib.sha3_256).hexdigest()

    def _serialize_tensor(self, tensor: torch.Tensor) -> bytes:
        return tensor.numpy().tobytes() + str(tensor.shape).encode()

    def _validate_parameters(self):
        if self.epsilon <= 0 or self.delta <= 0:
            raise ValueError("Epsilon and delta must be positive values")
        if self.delta >= 1.0:
            raise ValueError("Delta must be less than 1.0")

    @staticmethod
    def verify_delta_integrity(delta: Dict[str, Any], secret: bytes) -> bool:
        expected_proof = hmac.new(
            secret,
            b''.join([DeltaEncoder._serialize_tensor(v) for k, v in sorted(delta['delta'].items())]),
            hashlib.sha3_256
        ).hexdigest()
        return hmac.compare_digest(expected_proof, delta['proof'])

if __name__ == "__main__":
    # Test with sample model weights
    current_model = {
        'layer1.weight': torch.randn(64, 32),
        'layer1.bias': torch.randn(64),
        'layer2.weight': torch.randn(32, 16)
    }
    
    updated_model = {
        'layer1.weight': current_model['layer1.weight'] * 1.05,
        'layer1.bias': current_model['layer1.bias'] * 0.95,
        'layer2.weight': current_model['layer2.weight'] * 1.1
    }
    
    encoder = DeltaEncoder(epsilon=0.5, delta=1e-6)
    secret = b'fortifi_shared_secret_256'
    
    secure_delta = encoder.compute_secure_delta(current_model, updated_model, secret)
    print(f"Delta keys: {list(secure_delta['delta'].keys())}")
    print(f"Proof valid: {DeltaEncoder.verify_delta_integrity(secure_delta, secret)}")

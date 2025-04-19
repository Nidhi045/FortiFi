import os
import time
import hashlib
import numpy as np
from typing import Dict, Any
from .pattern_abstractor import PatternAbstractor
from .delta_encoder import DeltaEncoder
from .federated_broadcast import FederatedBroadcaster
from .model_updater import ModelUpdater
from .onchain_metadata_logger import OnchainMetadataLogger
from utils.logger import StructuredLogger

class SyncOrchestrator:
    def __init__(self, config: Dict[str, Any]):
        self.node_id = config['node_id']
        self.secret_key = config['federation_secret'].encode()
        self.peer_nodes = config['peer_nodes']
        self.model_registry_path = config['model_registry_path']
        self.blockchain = config['blockchain']
        self.logger = StructuredLogger(name="SyncOrchestrator")
        self.abstractor = PatternAbstractor()
        self.encoder = DeltaEncoder()
        self.broadcaster = FederatedBroadcaster(self.node_id, self.peer_nodes, self.secret_key)
        self.model_updater = ModelUpdater(self.model_registry_path, self.secret_key)
        self.onchain_logger = OnchainMetadataLogger(
            self.blockchain['rpc_url'],
            self.blockchain['contract_address'],
            self.blockchain['abi_path'],
            self.blockchain['private_key']
        )

    def process_fraud_pattern(self, fraud_case: Dict[str, Any]):
        embedding = self.abstractor.abstract_pattern(fraud_case)
        pattern_hash = hashlib.sha3_256(embedding.tobytes()).hexdigest()
        current_model = self._load_model_weights()
        updated_model = self._retrain_with_embedding(current_model, embedding)
        delta_package = self.encoder.compute_secure_delta(current_model, updated_model, self.secret_key)
        delta_hash = hashlib.sha3_256(
            b''.join([v.numpy().tobytes() for v in delta_package['delta'].values()])
        ).hexdigest()
        metadata = {
            'proof': delta_package['proof'],
            'pattern_hash': pattern_hash,
            'delta_hash': delta_hash,
            'timestamp': time.time()
        }
        self.broadcaster.broadcast_update(delta_package['delta'], metadata)
        self.model_updater.apply_update(delta_package['delta'], metadata)
        tx_hash = self.onchain_logger.log_propagation(delta_hash, pattern_hash)
        self.logger.info(f"Pattern propagated and logged on-chain: tx={tx_hash}")

    def _load_model_weights(self) -> Dict[str, Any]:
        return self.model_updater._load_current_model()

    def _retrain_with_embedding(self, model: Dict[str, Any], embedding: np.ndarray) -> Dict[str, Any]:
        updated = {}
        for k, v in model.items():
            emb_factor = float(np.mean(embedding)) if embedding.size else 1.0
            updated[k] = v * (1.0 + emb_factor * 0.01)
        return updated

if __name__ == "__main__":
    config = {
        'node_id': 'bank1.fortifi.net',
        'federation_secret': 'fortifi_federation_secret',
        'peer_nodes': ['bank2.fortifi.net', 'bank3.fortifi.net'],
        'model_registry_path': '/var/fortifi/models',
        'blockchain': {
            'rpc_url': os.getenv('BLOCKCHAIN_RPC_URL'),
            'contract_address': os.getenv('CONTRACT_ADDRESS'),
            'abi_path': os.getenv('CONTRACT_ABI_PATH'),
            'private_key': os.getenv('PRIVATE_KEY')
        }
    }
    orchestrator = SyncOrchestrator(config)
    dummy_fraud_case = {
        'amount': 2500.0,
        'transaction_velocity': 2.1,
        'geo_risk_score': 0.78,
        'device_fingerprint': 'a1b2c3d4e5',
        'user_behavior_anomaly': 0.34
    }
    orchestrator.process_fraud_pattern(dummy_fraud_case)

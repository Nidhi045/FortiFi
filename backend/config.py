"""
FortiFi Configuration Management
Handles environment variables, system thresholds, feature toggles, and integration URIs.
"""

import os
import json
from typing import Any, Dict, List

class ConfigLoader:
    """Loads environment-specific configuration for FortiFi."""
    @staticmethod
    def load(env: str = "production") -> "EnvironmentConfig":
        config_path = os.environ.get("FORTIFI_CONFIG_PATH", f"./config/{env}.json")
        if os.path.exists(config_path):
            with open(config_path, "r") as f:
                data = json.load(f)
            return EnvironmentConfig(**data)
        # Fallback to defaults if no file
        return EnvironmentConfig()

class EnvironmentConfig:
    def __init__(
        self,
        log_level: str = "INFO",
        enable_cloud_logging: bool = False,
        db_dsn: str = "postgresql://fortifi:fortifi@localhost:5432/fortifi",
        db_pool_size: int = 10,
        redis_host: str = "localhost",
        redis_port: int = 6379,
        redis_db: int = 0,
        neo4j_uri: str = "bolt://localhost:7687",
        blockchain_rpc: str = "http://localhost:8545",
        zk_contract_address: str = "0x0000000000000000000000000000000000000000",
        federation_nodes: List[str] = None,
        model_repo_url: str = "https://models.fortifi.ai/repo",
        phantom_batch_size: int = 500,
        phantom_geo_dispersion: float = 0.6,
        detection_interval: int = 10,
        adaptive_learning_rate: float = 0.05,
        splitmesh_shards: int = 3,
        storage_providers: List[str] = None,
        risk_thresholds: Dict[str, Any] = None,
        feature_toggles: Dict[str, bool] = None,
        **kwargs
    ):
        self.log_level = log_level
        self.enable_cloud_logging = enable_cloud_logging
        self.db_dsn = db_dsn
        self.db_pool_size = db_pool_size
        self.redis_host = redis_host
        self.redis_port = redis_port
        self.redis_db = redis_db
        self.neo4j_uri = neo4j_uri
        self.blockchain_rpc = blockchain_rpc
        self.zk_contract_address = zk_contract_address
        self.federation_nodes = federation_nodes or [
            "bankA.fortifi.net", "bankB.fortifi.net", "bankC.fortifi.net"
        ]
        self.model_repo_url = model_repo_url
        self.phantom_batch_size = phantom_batch_size
        self.phantom_geo_dispersion = phantom_geo_dispersion
        self.detection_interval = detection_interval
        self.adaptive_learning_rate = adaptive_learning_rate
        self.splitmesh_shards = splitmesh_shards
        self.storage_providers = storage_providers or [
            "s3://fortifi-shard-1", "s3://fortifi-shard-2", "s3://fortifi-shard-3"
        ]
        self.risk_thresholds = risk_thresholds or {
            "low": 3,
            "medium": 6,
            "high": 8,
            "critical": 9
        }
        self.feature_toggles = feature_toggles or {
            "enable_phantom_transactions": True,
            "enable_shadow_layer": True,
            "enable_graph_fraud_mapping": True,
            "enable_synapse_sync": True,
            "enable_splitmesh": True,
            "enable_dynamic_spend_control": True,
            "enable_credential_poisoning": True,
            "enable_virtual_cards": True
        }
        for k, v in kwargs.items():
            setattr(self, k, v)

    def as_dict(self) -> Dict[str, Any]:
        """Return all config as a dictionary."""
        return self.__dict__

    def __repr__(self):
        return f"<EnvironmentConfig {self.as_dict()}>"

# Example usage:
if __name__ == "__main__":
    config = ConfigLoader.load("development")
    print(json.dumps(config.as_dict(), indent=2))

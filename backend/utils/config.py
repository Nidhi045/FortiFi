import os

class FortiFiConfig:
    def __init__(self):
        self.config = self._load_config()

    def _load_config(self) -> dict:
        return {
            'federation': self._federation_config(),
            'model_registry': self._model_registry_config(),
            'blockchain': self._blockchain_config(),
            'timelock': self._timelock_config(),
            'splitmesh': {
                'storage': self._storage_config(),
                'retention': self._retention_config(),
                'sharding': self._shard_settings(),
                'crypto': self._crypto_settings()
            }
        }

    def _federation_config(self) -> dict:
        return {
            'peer_nodes': [n.strip() for n in os.getenv('FEDERATION_PEERS', 'bank1.fortifi.net,bank2.fortifi.net').split(',')],
            'shared_secret': os.getenv('FEDERATION_SECRET', 'default_fortifi_secret'),
            'grpc_port': int(os.getenv('FEDERATION_GRPC_PORT', 50051))
        }

    def _model_registry_config(self) -> dict:
        return {
            'path': os.getenv('MODEL_REGISTRY_PATH', '/var/fortifi/models'),
            'current_model': os.getenv('CURRENT_MODEL', 'current.pth'),
            'retention_policy': int(os.getenv('MODEL_RETENTION', 30))  # Days
        }

    def _blockchain_config(self) -> dict:
        return {
            'rpc_url': os.getenv('BLOCKCHAIN_RPC_URL', 'https://mainnet.infura.io/v3/your_project_id'),
            'contract_address': os.getenv('CONTRACT_ADDRESS', '0x0000000000000000000000000000000000000000'),
            'abi_path': os.getenv('CONTRACT_ABI_PATH', './contract_abi.json'),
            'private_key': os.getenv('PRIVATE_KEY', 'your_private_key_here'),
            'audit_address': os.getenv('AUDIT_CONTRACT_ADDRESS', '0x0000000000000000000000000000000000000000'),
            'audit_abi_path': os.getenv('AUDIT_CONTRACT_ABI_PATH', './audit_contract_abi.json')
        }

    def _timelock_config(self) -> dict:
        return {
            'trust_threshold': float(os.getenv('TRUST_THRESHOLD', 0.6)),
            'base_lock_mins': int(os.getenv('BASE_LOCK_MINS', 5)),
            'max_lock_mins': int(os.getenv('MAX_LOCK_MINS', 15)),
            'risk_weights': {
                'amount': float(os.getenv('RISK_WEIGHT_AMOUNT', 0.22)),
                'merchant': float(os.getenv('RISK_WEIGHT_MERCHANT', 0.18)),
                'geo': float(os.getenv('RISK_WEIGHT_GEO', 0.16)),
                'device': float(os.getenv('RISK_WEIGHT_DEVICE', 0.13)),
                'behavior': float(os.getenv('RISK_WEIGHT_BEHAVIOR', 0.13)),
                'velocity': float(os.getenv('RISK_WEIGHT_VELOCITY', 0.10)),
                'history': float(os.getenv('RISK_WEIGHT_HISTORY', 0.08))
            },
            'decay_params': {
                'rate': float(os.getenv('DECAY_RATE', 0.02)),
                'min_trust': float(os.getenv('MIN_TRUST', 0.1)),
                'reinforcement': float(os.getenv('TRUST_REINFORCE', 0.15))
            }
        }

    def _storage_config(self) -> dict:
        return {
            'postgres': {
                'host': os.getenv('POSTGRES_HOST', 'localhost'),
                'user': os.getenv('POSTGRES_USER', 'fortifi'),
                'password': os.getenv('POSTGRES_PASSWORD', 'secret'),
                'database': os.getenv('POSTGRES_DB', 'fortifi_shards')
            },
            'mongodb': {
                'host': os.getenv('MONGO_HOST', 'localhost'),
                'username': os.getenv('MONGO_USER', 'fortifi'),
                'password': os.getenv('MONGO_PASS', 'secret'),
                'authSource': os.getenv('MONGO_AUTH_SOURCE', 'admin')
            },
            's3': {
                'aws_access_key_id': os.getenv('AWS_ACCESS_KEY'),
                'aws_secret_access_key': os.getenv('AWS_SECRET_KEY'),
                'region_name': os.getenv('AWS_REGION', 'ap-south-1')
            }
        }

    def _retention_config(self) -> dict:
        return {
            'retention_days': int(os.getenv('RETENTION_DAYS', 90)),
            'shred_immediately': os.getenv('SHRED_IMMEDIATE', 'false').lower() == 'true'
        }

    def _shard_settings(self) -> dict:
        return {
            'shard_count': int(os.getenv('SHARD_COUNT', 4)),
            'min_shards': int(os.getenv('MIN_SHARDS', 2))
        }

    def _crypto_settings(self) -> dict:
        return {
            'key_length': int(os.getenv('CRYPTO_KEY_LENGTH', 32)),
            'pbkdf2_iterations': int(os.getenv('PBKDF2_ITERATIONS', 100000)),
            'aes_mode': os.getenv('AES_MODE', 'GCM'),
            'hmac_algorithm': os.getenv('HMAC_ALGORITHM', 'SHA256')
        }

    def get_config(self) -> dict:
        return self.config

    # Legacy accessors
    def get_peer_nodes(self) -> list:
        return self.config['federation']['peer_nodes']

    def get_federation_secret(self) -> str:
        return self.config['federation']['shared_secret']

    def get_model_registry_path(self) -> str:
        return self.config['model_registry']['path']

    def get_blockchain_config(self) -> dict:
        return self.config['blockchain']

    def get_timelock_config(self) -> dict:
        return self.config['timelock']

# Singleton instance
config = FortiFiConfig().get_config()

if __name__ == "__main__":
    print("FortiFi Configuration Manager")
    print("=============================")
    for section, settings in config.items():
        print(f"\n[{section.upper()}]")
        if isinstance(settings, dict):
            for k, v in settings.items():
                if isinstance(v, dict):
                    print(f"  {k}:")
                    for sk, sv in v.items():
                        print(f"    {sk}: {sv}")
                else:
                    print(f"  {k}: {v}")
        else:
            print(settings)
    print("\nConfiguration loaded successfully.")
#     encrypted = encrypt_aead(data, key)   
"""
FortiFi SynapseSync: Federated Fraud Pattern Sharing
Enables secure, privacy-preserving propagation of fraud intelligence across institutions.
"""

import asyncio
import hashlib
import json
import logging
import os
from datetime import datetime
from typing import Dict, List, Optional

try:
    import synapseclient
    from synapseclient import File, Project
except ImportError:
    raise RuntimeError("Synapse client required: pip install synapseclient")

class SynapseSyncCoordinator:
    def __init__(
        self,
        config: Dict[str, Any],
        logger: logging.Logger
    ):
        self.config = config
        self.logger = logger
        self.syn = synapseclient.Synapse()
        self.project_cache = {}
        self.model_version = "1.8.0"
        self.retry_policy = {
            'max_attempts': 3,
            'delay': [1, 5, 10]
        }

    async def _execute_with_retry(self, func, *args):
        """Handles transient failures in Synapse operations"""
        for attempt in range(self.retry_policy['max_attempts']):
            try:
                return await func(*args)
            except synapseclient.core.exceptions.SynapseHTTPError as e:
                if e.response.status_code in [429, 502, 503, 504]:
                    delay = self.retry_policy['delay'][attempt]
                    self.logger.warning(f"Retry attempt {attempt+1} in {delay}s")
                    await asyncio.sleep(delay)
                else:
                    raise
        raise RuntimeError(f"Operation failed after {self.retry_policy['max_attempts']} attempts")

    async def authenticate(self, auth_token: Optional[str] = None):
        """Establishes secure session with Synapse backend"""
        try:
            if auth_token or self.config.get('synapse_token'):
                await self._execute_with_retry(
                    self.syn.login,
                    authToken=auth_token or self.config['synapse_token']
                )
            else:
                raise ValueError("Authentication token required for Synapse")
        except Exception as e:
            self.logger.error(f"Synapse auth failed: {str(e)}")
            raise

    async def _get_or_create_project(self, project_name: str) -> str:
        """Manages Synapse project lifecycle"""
        if project_name in self.project_cache:
            return self.project_cache[project_name]

        query = f"select id from project where name == '{project_name}'"
        results = await self._execute_with_retry(
            self.syn.query, query
        )

        if results['totalNumberOfResults'] > 0:
            project_id = results['results'][0]['id']
        else:
            project = Project(project_name)
            stored_project = await self._execute_with_retry(
                self.syn.store, project
            )
            project_id = stored_project.id

        self.project_cache[project_name] = project_id
        return project_id

    async def propagate_fraud_pattern(
        self,
        pattern_type: str,
        pattern_embedding: Dict[str, Any],
        institution_id: str
    ) -> str:
        """Secures and shares fraud pattern with federated network"""
        project_id = await self._get_or_create_project(
            self.config['federation_project']
        )

        # Anonymize and hash pattern data
        pattern_hash = hashlib.sha256(
            json.dumps(pattern_embedding, sort_keys=True).encode()
        ).hexdigest()
        
        payload = {
            "pattern_type": pattern_type,
            "embedding_hash": pattern_hash,
            "institution_hash": hashlib.sha256(institution_id.encode()).hexdigest(),
            "model_version": self.model_version,
            "timestamp": datetime.utcnow().isoformat(),
            "signature": self._generate_pattern_signature(pattern_embedding)
        }

        file_path = await self._write_temp_pattern_file(payload)
        file_entity = await self._execute_with_retry(
            self.syn.store,
            File(file_path, parent=project_id)
        )
        
        self.logger.info(
            f"Propagated {pattern_type} pattern: {file_entity.id}",
            extra={"pattern_hash": pattern_hash}
        )
        return file_entity.id

    async def fetch_fraud_patterns(
        self,
        pattern_type: Optional[str] = None,
        since: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """Retrieves latest federated fraud patterns"""
        project_id = await self._get_or_create_project(
            self.config['federation_project']
        )

        query = f"select * from file where parentId == '{project_id}'"
        if pattern_type:
            query += f" AND name LIKE '%{pattern_type}%'"
        if since:
            query += f" AND createdOn >= {since.isoformat()}"

        results = await self._execute_with_retry(
            self.syn.query, query
        )

        patterns = []
        for item in results['results']:
            try:
                file_entity = await self._execute_with_retry(
                    self.syn.get, item['id'], downloadFile=True
                )
                with open(file_entity.path, 'r') as f:
                    pattern_data = json.load(f)
                    if self._validate_pattern_signature(pattern_data):
                        patterns.append(pattern_data)
            except Exception as e:
                self.logger.error(f"Pattern load failed: {str(e)}")
        return patterns

    def _generate_pattern_signature(self, data: Dict) -> str:
        """Generates HMAC signature for pattern validation"""
        secret = self.config['federation_secret']
        message = json.dumps(data, sort_keys=True).encode()
        return hmac.new(secret.encode(), message, hashlib.sha256).hexdigest()

    def _validate_pattern_signature(self, data: Dict) -> bool:
        """Verifies pattern integrity using HMAC"""
        provided_sig = data.pop('signature', None)
        if not provided_sig:
            return False
        expected_sig = self._generate_pattern_signature(data)
        return hmac.compare_digest(provided_sig, expected_sig)

    async def _write_temp_pattern_file(self, data: Dict) -> str:
        """Handles secure temporary file creation"""
        file_name = f"fortifi_{data['pattern_type']}_{datetime.utcnow().timestamp()}.json"
        temp_path = os.path.join(self.config['temp_dir'], file_name)
        
        with open(temp_path, 'w') as f:
            json.dump(data, f, separators=(',', ':'))
        
        os.chmod(temp_path, 0o600)
        return temp_path

# Example integration
if __name__ == "__main__":
    from config import ConfigLoader
    from utils.logger import StructuredLogger

    async def main():
        config = ConfigLoader().load("production")
        logger = StructuredLogger(name="SynapseSyncDemo")
        
        coordinator = SynapseSyncCoordinator(config, logger)
        try:
            await coordinator.authenticate(config['synapse_token'])
            
            # Propagate new pattern
            pattern_id = await coordinator.propagate_fraud_pattern(
                "account_takeover",
                {"vector": [0.34, 0.12, 0.78]},
                "bank_alpha"
            )
            
            # Fetch recent patterns
            patterns = await coordinator.fetch_fraud_patterns()
            print(f"Fetched {len(patterns)} federated patterns")
            
        except Exception as e:
            logger.critical(f"Synapse sync failed: {str(e)}")
            raise

    asyncio.run(main())

import os
from datetime import datetime
from typing import List, Dict, Any
from web3 import Web3
import json
from utils.logger import StructuredLogger

class AuditLogger:
    def __init__(self):
        self.logger = StructuredLogger(name="AuditLogger")
        self.config = {
            'rpc_url': os.getenv('BLOCKCHAIN_RPC_URL'),
            'contract_address': os.getenv('AUDIT_CONTRACT_ADDRESS'),
            'abi_path': os.getenv('AUDIT_CONTRACT_ABI_PATH'),
            'private_key': os.getenv('PRIVATE_KEY')
        }
        self.w3 = Web3(Web3.HTTPProvider(self.config['rpc_url']))
        with open(self.config['abi_path'], 'r') as f:
            abi = json.load(f)
        self.contract = self.w3.eth.contract(
            address=self.config['contract_address'],
            abi=abi
        )
        self.account = self.w3.eth.account.from_key(self.config['private_key'])

    def log_access(self, tx_hash: str, shard_ids: List[str], accessor: str, action: str, purpose: str):
        try:
            nonce = self.w3.eth.get_transaction_count(self.account.address)
            tx = self.contract.functions.logAccessEvent(
                tx_hash,
                shard_ids,
                accessor,
                action,
                purpose,
                int(datetime.utcnow().timestamp())
            ).buildTransaction({
                'from': self.account.address,
                'nonce': nonce,
                'gas': 180000,
                'gasPrice': self.w3.toWei('50', 'gwei')
            })
            signed_tx = self.account.sign_transaction(tx)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            self.logger.info(f"Logged access event for {accessor} on {shard_ids} (action: {action}, purpose: {purpose}) tx: {tx_hash.hex()}")
            return tx_hash.hex()
        except Exception as e:
            self.logger.error(f"Failed to log access event: {e}")
            return ""

    def log_reconstruction(self, tx_hash: str, accessor: str, status: str, reason: str, shard_ids: List[str]):
        try:
            nonce = self.w3.eth.get_transaction_count(self.account.address)
            tx = self.contract.functions.logReconstructionEvent(
                tx_hash,
                accessor,
                status,
                reason,
                shard_ids,
                int(datetime.utcnow().timestamp())
            ).buildTransaction({
                'from': self.account.address,
                'nonce': nonce,
                'gas': 180000,
                'gasPrice': self.w3.toWei('50', 'gwei')
            })
            signed_tx = self.account.sign_transaction(tx)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            self.logger.info(f"Logged reconstruction event for {accessor} (status: {status}, reason: {reason}) tx: {tx_hash.hex()}")
            return tx_hash.hex()
        except Exception as e:
            self.logger.error(f"Failed to log reconstruction event: {e}")
            return ""

    def get_access_logs(self, tx_hash: str) -> List[Dict[str, Any]]:
        try:
            logs = self.contract.functions.getAccessLogs(tx_hash).call()
            self.logger.info(f"Fetched access logs for {tx_hash}: {logs}")
            return logs
        except Exception as e:
            self.logger.error(f"Failed to fetch access logs: {e}")
            return []

    def get_reconstruction_logs(self, tx_hash: str) -> List[Dict[str, Any]]:
        try:
            logs = self.contract.functions.getReconstructionLogs(tx_hash).call()
            self.logger.info(f"Fetched reconstruction logs for {tx_hash}: {logs}")
            return logs
        except Exception as e:
            self.logger.error(f"Failed to fetch reconstruction logs: {e}")
            return []

if __name__ == "__main__":
    logger = AuditLogger()
    # Example: logger.log_access("0xabc", ["shard1", "shard2"], "0xUser", "read", "fraud_investigation")
    # Example: logger.get_access_logs("0xabc")
    print("AuditLogger ready.")

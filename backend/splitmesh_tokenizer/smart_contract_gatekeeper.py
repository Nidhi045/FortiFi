import os
import json
from web3 import Web3
from typing import List, Dict, Any
from utils.logger import StructuredLogger

class SmartContractGatekeeper:
    def __init__(self, contract_config: Dict[str, Any]):
        self.logger = StructuredLogger(name="SmartContractGatekeeper")
        self.w3 = Web3(Web3.HTTPProvider(contract_config['rpc_url']))
        with open(contract_config['abi_path'], 'r') as f:
            abi = json.load(f)
        self.contract = self.w3.eth.contract(address=contract_config['contract_address'], abi=abi)
        self.account = self.w3.eth.account.from_key(contract_config['private_key'])

    def verify_recombination_permission(self, tx_id: str, accessor: str) -> bool:
        try:
            allowed = self.contract.functions.verifyRecombinationPermission(tx_id, accessor).call({
                'from': self.account.address
            })
            self.logger.info(f"Permission check for {accessor} on tx {tx_id}: {allowed}")
            return allowed
        except Exception as e:
            self.logger.error(f"Permission check failed: {e}")
            return False

    def log_recombination_event(self, tx_id: str, shard_ids: List[str], accessor: str) -> str:
        try:
            nonce = self.w3.eth.get_transaction_count(self.account.address)
            tx = self.contract.functions.logRecombinationEvent(
                tx_id,
                shard_ids,
                accessor,
                int(self.w3.eth.getBlock('latest')['timestamp'])
            ).buildTransaction({
                'from': self.account.address,
                'nonce': nonce,
                'gas': 200000,
                'gasPrice': self.w3.toWei('50', 'gwei')
            })
            signed_tx = self.account.sign_transaction(tx)
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            self.logger.info(f"Logged recombination event for tx {tx_id} by {accessor}: {tx_hash.hex()}")
            return tx_hash.hex()
        except Exception as e:
            self.logger.error(f"Failed to log recombination event: {e}")
            return ""

    def get_recombination_log(self, tx_id: str) -> Dict[str, Any]:
        try:
            log = self.contract.functions.getRecombinationLog(tx_id).call()
            self.logger.info(f"Fetched recombination log for {tx_id}: {log}")
            return log
        except Exception as e:
            self.logger.error(f"Failed to fetch recombination log: {e}")
            return {}

if __name__ == "__main__":
    contract_config = {
        'rpc_url': os.getenv('BLOCKCHAIN_RPC_URL'),
        'contract_address': os.getenv('CONTRACT_ADDRESS'),
        'abi_path': os.getenv('CONTRACT_ABI_PATH'),
        'private_key': os.getenv('PRIVATE_KEY')
    }
    gatekeeper = SmartContractGatekeeper(contract_config)
    # Example usage:
    tx_id = "TX123"
    accessor = "0xUserAddress"
    allowed = gatekeeper.verify_recombination_permission(tx_id, accessor)
    print("Permission:", allowed)
    if allowed:
        shard_ids = ["SHARD1", "SHARD2"]
        tx_hash = gatekeeper.log_recombination_event(tx_id, shard_ids, accessor)
        print("Logged event tx hash:", tx_hash)
        log = gatekeeper.get_recombination_log(tx_id)
        print("Recombination log:", log)
    else:
        print("Access denied for recombination.")       
from web3 import Web3
import json
import os
from datetime import datetime
from typing import Dict, Any

class SmartContractHandler:
    def __init__(self, rpc_url: str, contract_address: str, abi_path: str, private_key: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        with open(abi_path, 'r') as f:
            abi = json.load(f)
        self.contract = self.w3.eth.contract(address=contract_address, abi=abi)
        self.account = self.w3.eth.account.from_key(private_key)

    def initiate_time_lock(self, tx_id: str, user_id: str, lock_minutes: int, trust_score: float, risk_score: float) -> str:
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        tx = self.contract.functions.initiateTimeLock(
            tx_id,
            user_id,
            int(lock_minutes),
            int(trust_score * 10000),
            int(risk_score * 10000),
            int(datetime.utcnow().timestamp())
        ).buildTransaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': 250000,
            'gasPrice': self.w3.toWei('50', 'gwei')
        })
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return tx_hash.hex()

    def release_time_lock(self, tx_id: str) -> str:
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        tx = self.contract.functions.releaseTimeLock(
            tx_id,
            int(datetime.utcnow().timestamp())
        ).buildTransaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': 120000,
            'gasPrice': self.w3.toWei('50', 'gwei')
        })
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return tx_hash.hex()

    def get_lock_status(self, tx_id: str) -> Dict[str, Any]:
        status = self.contract.functions.getLockStatus(tx_id).call()
        return {
            "locked": bool(status[0]),
            "unlock_time": datetime.utcfromtimestamp(status[1]),
            "initiator": status[2],
            "trust_at_lock": status[3] / 10000.0,
            "risk_at_lock": status[4] / 10000.0,
            "last_update": datetime.utcfromtimestamp(status[5])
        }

    def log_event(self, event_type: str, tx_id: str, user_id: str, extra: Dict[str, Any]):
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        tx = self.contract.functions.logTimeLockEvent(
            event_type,
            tx_id,
            user_id,
            json.dumps(extra),
            int(datetime.utcnow().timestamp())
        ).buildTransaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': 80000,
            'gasPrice': self.w3.toWei('50', 'gwei')
        })
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return tx_hash.hex()

if __name__ == "__main__":
    import dotenv
    dotenv.load_dotenv()
    rpc_url = os.getenv('BLOCKCHAIN_RPC_URL')
    contract_address = os.getenv('CONTRACT_ADDRESS')
    abi_path = os.getenv('CONTRACT_ABI_PATH')
    private_key = os.getenv('PRIVATE_KEY')
    handler = SmartContractHandler(rpc_url, contract_address, abi_path, private_key)
    tx_id = "TX_LOCK_001"
    user_id = "user_abc123"
    lock_hash = handler.initiate_time_lock(tx_id, user_id, 5, 0.35, 0.8)
    print(f"Initiated time-lock, tx: {lock_hash}")
    status = handler.get_lock_status(tx_id)
    print("Lock status:", status)
    release_hash = handler.release_time_lock(tx_id)
    print(f"Released lock, tx: {release_hash}")

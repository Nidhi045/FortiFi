from web3 import Web3
import json
import os
from typing import Any, Dict

class BlockchainUtility:
    def __init__(self, rpc_url: str, contract_address: str, abi_path: str, private_key: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        with open(abi_path, 'r') as f:
            abi = json.load(f)
        self.contract = self.w3.eth.contract(address=contract_address, abi=abi)
        self.account = self.w3.eth.account.from_key(private_key)

    def send_transaction(self, function_name: str, *args) -> str:
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        contract_function = getattr(self.contract.functions, function_name)
        tx = contract_function(*args).buildTransaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': 250000,
            'gasPrice': self.w3.toWei('50', 'gwei')
        })
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return tx_hash.hex()

    def call_function(self, function_name: str, *args) -> Any:
        contract_function = getattr(self.contract.functions, function_name)
        return contract_function(*args).call()

    def get_contract(self):
        return self.contract

    def log_event(self, event_type: str, tx_id: str, user_id: str, extra: Dict[str, Any]):
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        tx = self.contract.functions.logTimeLockEvent(
            event_type,
            tx_id,
            user_id,
            json.dumps(extra),
            int(self.w3.eth.getBlock('latest')['timestamp'])
        ).buildTransaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': 90000,
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
    blockchain = BlockchainUtility(rpc_url, contract_address, abi_path, private_key)
    print("Contract address:", blockchain.contract.address)
    print("Account address:", blockchain.account.address)
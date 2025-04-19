from web3 import Web3
import json
import time
import os

class OnchainMetadataLogger:
    def __init__(self, rpc_url: str, contract_address: str, abi_path: str, private_key: str):
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        with open(abi_path, 'r') as f:
            abi = json.load(f)
        self.contract = self.w3.eth.contract(address=contract_address, abi=abi)
        self.account = self.w3.eth.account.from_key(private_key)

    def log_propagation(self, delta_hash: str, pattern_hash: str) -> str:
        nonce = self.w3.eth.get_transaction_count(self.account.address)
        tx = self.contract.functions.logPatternPropagation(
            self.w3.toBytes(hexstr=delta_hash),
            self.w3.toBytes(hexstr=pattern_hash),
            int(time.time())
        ).buildTransaction({
            'from': self.account.address,
            'nonce': nonce,
            'gas': 200000,
            'gasPrice': self.w3.toWei('50', 'gwei')
        })
        signed_tx = self.account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
        return tx_hash.hex()

    def verify_log(self, delta_hash: str) -> bool:
        return self.contract.functions.verifyPropagation(self.w3.toBytes(hexstr=delta_hash)).call()


# Example usage
if __name__ == '__main__':
    import dotenv
    dotenv.load_dotenv()
    RPC_URL = os.getenv('BLOCKCHAIN_RPC_URL')
    CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS')
    ABI_PATH = os.getenv('CONTRACT_ABI_PATH')
    PRIVATE_KEY = os.getenv('PRIVATE_KEY')

    logger = OnchainMetadataLogger(RPC_URL, CONTRACT_ADDRESS, ABI_PATH, PRIVATE_KEY)
    delta_hash = '0x123abc456def7890abcdef1234567890abcdef1234567890abcdef1234567890'
    pattern_hash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    tx_hash = logger.log_propagation(delta_hash, pattern_hash)
    print(f'Logged propagation with tx hash: {tx_hash}')
    verified = logger.verify_log(delta_hash)
    print(f'Verification result: {verified}')

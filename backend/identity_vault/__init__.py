"""
Web3 Identity Vault
==================
Secure, privacy-compliant, and zero-knowledge identity management for decentralized applications.
"""

from .vault_core import IdentityVaultCore
from .zk_proof_generator import ZKProofSystem
from .onchain_tracker import OnchainTracker
from .breach_monitor import BreachMonitor
from .vault_compliance import VaultCompliance

__all__ = [
    "IdentityVaultCore",
    "ZKProofSystem",
    "OnchainTracker",
    "BreachMonitor",
    "VaultCompliance"
]

def initialize_identity_vault_system(config):
    """
    Factory function to initialize the full Identity Vault system.
    Returns a dictionary of all major components, wired together.
    """
    compliance = VaultCompliance()
    zk_proof = ZKProofSystem()
    vault_core = IdentityVaultCore(config['blockchain'], compliance)
    onchain_tracker = OnchainTracker(config['blockchain'])
    breach_monitor = BreachMonitor(vault_core, compliance)
    return {
        "compliance": compliance,
        "zk_proof": zk_proof,
        "vault_core": vault_core,
        "onchain_tracker": onchain_tracker,
        "breach_monitor": breach_monitor
    }

if __name__ == "__main__":
    from utils.config import config
    system = initialize_identity_vault_system(config)
    print("Identity Vault system initialized with components:")
    for k, v in system.items():
        print(f"  - {k}: {type(v).__name__}")

    # Example: Store a credential and generate a proof
    doc = {
        "email": "user@example.com",
        "phone": "+1234567890",
        "passport": "A12345678"
    }
    user_id = "user_1234"
    commitment = system["vault_core"].store_identity_document(user_id, doc)
    print(f"Stored document commitment: {commitment}")

    # Generate a ZK proof and log on-chain
    proof = system["vault_core"].generate_breach_proof(user_id, doc)
    if proof:
        tx_hash = system["onchain_tracker"].log_breach(proof['proof_id'], proof['public_signals'])
        print(f"Breach proof logged on-chain: {tx_hash}")

    # Start breach monitoring (runs in background)
    # system["breach_monitor"].start_monitoring()

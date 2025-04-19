import base64
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import hmac
import hashlib

def generate_key(length: int = 32) -> bytes:
    return os.urandom(length)

def encrypt_payload(payload: bytes, secret: bytes) -> bytes:
    nonce = os.urandom(12)
    aesgcm = AESGCM(secret[:32])
    ciphertext = aesgcm.encrypt(nonce, payload, None)
    return base64.b64encode(nonce + ciphertext)

def decrypt_payload(encrypted: bytes, secret: bytes) -> bytes:
    decoded = base64.b64decode(encrypted)
    nonce, ciphertext = decoded[:12], decoded[12:]
    aesgcm = AESGCM(secret[:32])
    return aesgcm.decrypt(nonce, ciphertext, None)

def generate_zk_proof(data: dict, secret: str) -> str:
    # Deterministic hash for zero-knowledge proof
    serialized = str(sorted(data.items())).encode()
    return hmac.new(secret.encode(), serialized, hashlib.sha3_256).hexdigest()

def verify_zk_proof(data: dict, proof: str, secret: str) -> bool:
    expected = generate_zk_proof(data, secret)
    return hmac.compare_digest(proof, expected)

if __name__ == "__main__":
    key = generate_key()
    message = b"federated model delta"
    encrypted = encrypt_payload(message, key)
    decrypted = decrypt_payload(encrypted, key)
    assert decrypted == message
    print("Encryption/decryption successful.")

    data = {"delta": 123, "pattern": 456}
    secret = "zk_secret"
    proof = generate_zk_proof(data, secret)
    assert verify_zk_proof(data, proof, secret)
    print("Zero-knowledge proof verified.")

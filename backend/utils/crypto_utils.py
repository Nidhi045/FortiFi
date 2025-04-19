import os
import hashlib
from cryptography.hazmat.primitives import hashes, hmac
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from base64 import urlsafe_b64encode, urlsafe_b64decode

def generate_aead_key(length: int = 32) -> bytes:
    """Generate a secure random key for AES-GCM."""
    return os.urandom(length)

def derive_iv(key: bytes, salt: bytes = None) -> bytes:
    """Derive a 96-bit IV using PBKDF2."""
    salt = salt or os.urandom(16)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=12,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    return kdf.derive(key)

def encrypt_aead(plaintext: bytes, key: bytes, associated_data: bytes = None) -> bytes:
    """Encrypt using AES-GCM, returns nonce + ciphertext + tag."""
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    ciphertext = aesgcm.encrypt(nonce, plaintext, associated_data)
    return nonce + ciphertext

def decrypt_aead(encrypted: bytes, key: bytes, associated_data: bytes = None) -> bytes:
    """Decrypt using AES-GCM, expects nonce + ciphertext + tag."""
    nonce = encrypted[:12]
    ciphertext = encrypted[12:]
    aesgcm = AESGCM(key)
    return aesgcm.decrypt(nonce, ciphertext, associated_data)

def generate_hmac(key: bytes, data: bytes) -> str:
    """Generate HMAC-SHA256 hex digest."""
    h = hmac.HMAC(key, hashes.SHA256(), backend=default_backend())
    h.update(data)
    return h.finalize().hex()

def validate_hmac(data: bytes, expected_hash: str, key: bytes) -> bool:
    """Validate HMAC-SHA256."""
    h = hmac.HMAC(key, hashes.SHA256(), backend=default_backend())
    h.update(data)
    try:
        h.verify(bytes.fromhex(expected_hash))
        return True
    except Exception:
        return False

def hash_bytes(data: bytes) -> str:
    """SHA3-256 hex digest."""
    return hashlib.sha3_256(data).hexdigest()

def secure_erase(data: bytearray):
    """Attempt to securely erase sensitive data in memory."""
    for i in range(len(data)):
        data[i] = 0

if __name__ == "__main__":
    key = generate_aead_key()
    data = b"super secret data"
    encrypted = encrypt_aead(data, key)
    decrypted = decrypt_aead(encrypted, key)
    print("Original:", data)
    print("Decrypted:", decrypted)
    assert data == decrypted

    hmac_val = generate_hmac(key, data)
    print("HMAC valid:", validate_hmac(data, hmac_val, key))
    print("SHA3-256 hash:", hash_bytes(data))
    secure_erase(data)  # Securely erase sensitive data
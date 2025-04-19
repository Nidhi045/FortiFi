import random
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

class SimulatedDB:
    def __init__(self):
        self.users = [
            {"user_id": "user_001", "name": "Alice", "email": "alice@example.com"},
            {"user_id": "user_002", "name": "Bob", "email": "bob@example.com"},
            {"user_id": "user_003", "name": "Charlie", "email": "charlie@example.com"},
        ]
        self.transactions = []
        self.phantom_transactions = []
        self.shadow_transactions = []
        self.behavior_profiles = {
            "user_001": {"swipe_speed": 0.9, "device": "iPhone", "phone_angle": 5, "location": "Delhi", "ip": "192.168.1.10"},
            "user_002": {"swipe_speed": 1.2, "device": "Android", "phone_angle": 15, "location": "Mumbai", "ip": "192.168.1.20"},
            "user_003": {"swipe_speed": 0.7, "device": "iPhone", "phone_angle": 0, "location": "Bangalore", "ip": "192.168.1.30"},
        }
        self.risk_scores = {"user_001": 3, "user_002": 8, "user_003": 6}
        self.spend_limits = {"user_001": 5000, "user_002": 1000, "user_003": 3000}
        self.credential_breaches = [
            {"credential": "alice@example.com:password123", "timestamp": datetime.utcnow().isoformat()}
        ]
        self.phantom_access_logs = []
        self.security_events = []

    async def get_active_users(self) -> List[Dict[str, Any]]:
        return self.users

    async def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        user = next((u for u in self.users if u["user_id"] == user_id), None)
        return user or {}

    async def insert_phantom_transaction(self, tx: Dict[str, Any]):
        self.phantom_transactions.append(tx)

    async def get_phantom_access_logs(self) -> List[Dict[str, Any]]:
        return self.phantom_access_logs

    async def update_phantom_status(self, phantom_id: str, status: str):
        for tx in self.phantom_transactions:
            if tx.get("phantom_id") == phantom_id:
                tx["status"] = status

    async def log_phantom_access(self, access_log: Dict[str, Any]):
        self.phantom_access_logs.append(access_log)

    async def get_expired_phantom_transactions(self) -> List[Dict[str, Any]]:
        now = datetime.utcnow()
        expired = []
        for tx in self.phantom_transactions:
            tx_time = datetime.fromisoformat(tx["timestamp"])
            if (now - tx_time).total_seconds() > 3600 and tx["status"] == "active":
                expired.append(tx)
        return expired

    async def get_user_phantom_transactions(self, user_id: str, status: str = "active") -> List[Dict[str, Any]]:
        return [tx for tx in self.phantom_transactions if tx["user_id"] == user_id and tx["status"] == status]

    async def get_high_value_transactions(self, min_amount: float = 1000) -> List[Dict[str, Any]]:
        now = datetime.utcnow()
        if not self.transactions:
            for user in self.users:
                tx = {
                    "tx_id": f"tx_{uuid.uuid4().hex[:8]}",
                    "user_id": user["user_id"],
                    "amount": random.uniform(1000, 5000),
                    "merchant": random.choice(["Amazon", "Flipkart", "Uber"]),
                    "location": user.get("location", "Delhi"),
                    "timestamp": (now - timedelta(minutes=random.randint(1, 60))).isoformat(),
                    "mirrored": False,
                    "risk_score": None,
                    "device_fingerprint": uuid.uuid4().hex,
                    "ip": user.get("ip", "127.0.0.1"),
                    "status": "pending"
                }
                self.transactions.append(tx)
        return [tx for tx in self.transactions if tx["amount"] >= min_amount]

    async def insert_shadow_transaction(self, tx: Dict[str, Any]):
        self.shadow_transactions.append(tx)

    async def update_transaction(self, tx_id: str, updates: Dict[str, Any]):
        for tx in self.transactions:
            if tx["tx_id"] == tx_id:
                tx.update(updates)

    async def mark_transaction_as_safe(self, tx_id: str):
        for tx in self.transactions:
            if tx["tx_id"] == tx_id:
                tx["status"] = "safe"

    async def lock_transaction(self, tx_id: str, lock_until: str):
        for tx in self.transactions:
            if tx["tx_id"] == tx_id:
                tx["status"] = "locked"
                tx["lock_until"] = lock_until

    async def log_security_event(self, event: Dict[str, Any]):
        self.security_events.append(event)

    async def get_all_users(self) -> List[Dict[str, Any]]:
        return self.users

    async def get_user_risk_score(self, user_id: str) -> int:
        return self.risk_scores.get(user_id, 3)

    async def get_user_base_spend_limit(self, user_id: str) -> int:
        return self.spend_limits.get(user_id, 1000)

    async def update_user_spend_limit(self, user_id: str, new_limit: int):
        self.spend_limits[user_id] = new_limit

    async def get_all_transactions(self) -> List[Dict[str, Any]]:
        return self.transactions + self.phantom_transactions + self.shadow_transactions

    async def get_user_behavior_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        return self.behavior_profiles.get(user_id)

    async def update_user_behavior_profile(self, user_id: str, profile: Dict[str, Any]):
        self.behavior_profiles[user_id] = profile

    async def get_credential_breaches(self) -> List[Dict[str, Any]]:
        return self.credential_breaches

    async def record_breach_on_chain(self, breach_hash: str, timestamp: str):
        print(f"[SimulatedDB] Breach hash {breach_hash} recorded at {timestamp}")

if __name__ == "__main__":
    import asyncio

    async def main():
        db = SimulatedDB()
        users = await db.get_active_users()
        print("Users:", users)
        txs = await db.get_high_value_transactions()
        print("High value transactions:", txs)
        await db.log_security_event({"event": "test_event", "timestamp": datetime.utcnow().isoformat()})
        print("Security events:", db.security_events)

    asyncio.run(main())

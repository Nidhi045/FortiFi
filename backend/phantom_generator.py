"""
Phantom Transaction Engine for FortiFi
Generates, inserts, and monitors AI-powered decoy (phantom) transactions for pre-emptive fraud interception.
"""

import random
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any

class PhantomTransactionEngine:
    def __init__(self, db, cache, config):
        self.db = db
        self.cache = cache
        self.config = config

    def _generate_phantom_tx(self, user_id: str, profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generates a single AI-modeled phantom transaction based on user profile and system heuristics.
        """
        merchant_pool = [
            "Amazon", "Flipkart", "Uber", "Swiggy", "Zomato", "IRCTC", "Paytm", "Myntra", "BigBasket"
        ]
        location_pool = [
            "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"
        ]
        # Simulate realistic but synthetic transaction attributes
        tx = {
            "phantom_id": f"phantom_{uuid.uuid4().hex[:12]}",
            "user_id": user_id,
            "amount": round(random.uniform(10, 5000), 2),
            "merchant": random.choice(merchant_pool),
            "location": random.choice(location_pool),
            "timestamp": (datetime.utcnow() - timedelta(minutes=random.randint(0, 120))).isoformat(),
            "phantom": True,
            "profile_similarity": round(random.uniform(0.7, 1.0), 3),
            "risk_bait_level": random.randint(5, 9),
            "decoy_type": random.choice(["purchase", "transfer", "billpay"]),
            "session_fingerprint": uuid.uuid4().hex,
            "status": "active"
        }
        return tx

    async def generate_decoys(self, count: int = 100, geographic_dispersion: float = 0.5) -> List[Dict[str, Any]]:
        """
        Generates and inserts a batch of phantom transactions for a randomized set of users.
        """
        users = await self.db.get_active_users()
        decoys = []
        for _ in range(count):
            user = random.choice(users)
            profile = await self.db.get_user_profile(user["user_id"])
            tx = self._generate_phantom_tx(user["user_id"], profile)
            # Optionally disperse location for geo-baiting
            if random.random() < geographic_dispersion:
                tx["location"] = random.choice([
                    "Singapore", "London", "Dubai", "Frankfurt", "San Francisco"
                ])
            await self.db.insert_phantom_transaction(tx)
            decoys.append(tx)
            # Cache for fast lookup
            await self.cache.set(f"phantom:{tx['phantom_id']}", tx, expire=3600)
        return decoys

    async def monitor_decoys(self) -> List[Dict[str, Any]]:
        """
        Monitors access logs for phantom transactions. Returns a list of triggered decoys.
        """
        logs = await self.db.get_phantom_access_logs()
        triggered = []
        for log in logs:
            if log["accessed"]:
                # Enrich with threat context
                trigger = {
                    "phantom_id": log["phantom_id"],
                    "access_time": log["access_time"],
                    "source_ip": log["ip"],
                    "geo": log.get("geo", "unknown"),
                    "device_fingerprint": log.get("device_fingerprint", "unknown"),
                    "threat_level": log["threat_level"],
                    "user_id": log["user_id"]
                }
                triggered.append(trigger)
                # Mark as triggered in DB
                await self.db.update_phantom_status(log["phantom_id"], "triggered")
        return triggered

    async def simulate_phantom_activity(self, user_id: str):
        """
        For demo: Simulates phantom transaction generation and access for a specific user.
        """
        profile = await self.db.get_user_profile(user_id)
        tx = self._generate_phantom_tx(user_id, profile)
        await self.db.insert_phantom_transaction(tx)
        await self.cache.set(f"phantom:{tx['phantom_id']}", tx, expire=1800)
        # Simulate access by a 'fraudster'
        access_log = {
            "phantom_id": tx["phantom_id"],
            "access_time": datetime.utcnow().isoformat(),
            "ip": f"203.0.113.{random.randint(1, 254)}",
            "geo": random.choice(["Russia", "Ukraine", "Nigeria", "Brazil", "India"]),
            "device_fingerprint": uuid.uuid4().hex,
            "threat_level": random.randint(6, 9),
            "user_id": user_id,
            "accessed": True
        }
        await self.db.log_phantom_access(access_log)
        return tx, access_log

    async def cleanup_expired_decoys(self):
        """
        Periodically deactivate or delete expired phantom transactions.
        """
        expired = await self.db.get_expired_phantom_transactions()
        for tx in expired:
            await self.db.update_phantom_status(tx["phantom_id"], "expired")
            await self.cache.delete(f"phantom:{tx['phantom_id']}")
        return len(expired)

    async def get_active_decoys(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Returns all active phantom transactions for a user.
        """
        return await self.db.get_user_phantom_transactions(user_id, status="active")

    async def get_triggered_decoys(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Returns all triggered phantom transactions for a user.
        """
        return await self.db.get_user_phantom_transactions(user_id, status="triggered")

# Example usage for testing/demo
if __name__ == "__main__":
    import asyncio
    from data.simulated_db import SimulatedDB
    from utils.mock_cache import MockCache
    from config import ConfigLoader

    async def main():
        db = SimulatedDB()
        cache = MockCache()
        config = ConfigLoader.load("development")
        engine = PhantomTransactionEngine(db, cache, config)
        print("Generating decoys...")
        decoys = await engine.generate_decoys(count=10)
        print(f"Generated {len(decoys)} phantom transactions.")
        print("Simulating access...")
        tx, log = await engine.simulate_phantom_activity("user_001")
        print("Phantom transaction:", tx)
        print("Access log:", log)
        triggered = await engine.monitor_decoys()
        print("Triggered:", triggered)

    asyncio.run(main())

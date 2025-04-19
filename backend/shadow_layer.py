"""
FortiFi Shadow Transaction Layer
Mirrors high-risk transactions, performs live behavioral profiling, and dynamically adapts risk scoring and controls.
"""

import uuid
import random
from datetime import datetime, timedelta
from typing import Dict, Any, List

class ShadowTransactionManager:
    def __init__(self, db, risk_model, behavior_model):
        self.db = db
        self.risk_model = risk_model
        self.behavior_model = behavior_model

    async def monitor_high_value_transactions(self):
        """
        Detects high-value or high-risk transactions, mirrors them, and applies behavioral profiling.
        """
        txs = await self.db.get_high_value_transactions(min_amount=1000)
        for tx in txs:
            if not tx.get("mirrored"):
                shadow_tx = await self._mirror_transaction(tx)
                profile_data = await self._collect_session_profile(tx["user_id"], tx)
                risk_score = await self._score_transaction(tx, profile_data)
                await self.db.update_transaction(
                    tx["tx_id"], {"mirrored": True, "shadow_tx_id": shadow_tx["tx_id"], "risk_score": risk_score}
                )
                if risk_score >= 8:
                    await self._enforce_time_lock(tx, profile_data)
                else:
                    await self.db.mark_transaction_as_safe(tx["tx_id"])

    async def _mirror_transaction(self, tx: Dict[str, Any]) -> Dict[str, Any]:
        """
        Creates a shadow (decoy) transaction that mirrors the real one, for fraud baiting and behavioral analysis.
        """
        shadow_tx = {
            "tx_id": f"shadow_{uuid.uuid4().hex[:12]}",
            "user_id": tx["user_id"],
            "amount": tx["amount"],
            "merchant": tx.get("merchant", "Unknown"),
            "location": tx.get("location", "Unknown"),
            "timestamp": datetime.utcnow().isoformat(),
            "mirrored": True,
            "risk_score": None,
            "session_fingerprint": uuid.uuid4().hex,
            "status": "pending",
            "decoy": True,
            "original_tx_id": tx["tx_id"]
        }
        await self.db.insert_shadow_transaction(shadow_tx)
        return shadow_tx

    async def _collect_session_profile(self, user_id: str, tx: Dict[str, Any]) -> Dict[str, Any]:
        """
        Collects behavioral and device/session data for the transaction session.
        """
        session = await self.db.get_user_session(user_id)
        # Simulate behavioral signals
        profile = {
            "ip": session.get("ip", "0.0.0.0"),
            "device": session.get("device", "Unknown"),
            "swipe_speed": random.uniform(0.1, 2.0),
            "phone_angle": random.uniform(-45, 45),
            "location": tx.get("location", "Unknown"),
            "timestamp": datetime.utcnow().isoformat()
        }
        return profile

    async def _score_transaction(self, tx: Dict[str, Any], profile: Dict[str, Any]) -> float:
        """
        Uses AI/ML risk and behavioral models to score the transaction in real time.
        """
        # Risk model: transaction attributes (amount, merchant, geo, time)
        risk_score = await self.risk_model.score(tx)
        # Behavior model: session behavior vs. trusted profile
        anomaly_score = await self.behavior_model.compare(tx["user_id"], profile)
        # Weighted aggregation
        final_score = round(0.7 * risk_score + 0.3 * anomaly_score, 2)
        return final_score

    async def _enforce_time_lock(self, tx: Dict[str, Any], profile: Dict[str, Any]):
        """
        Enforces a time-lock on flagged transactions, with dynamic behavioral decay.
        """
        lock_duration = self._calculate_lock_duration(profile)
        lock_until = (datetime.utcnow() + timedelta(minutes=lock_duration)).isoformat()
        await self.db.lock_transaction(tx["tx_id"], lock_until)
        # Log reason for lock
        await self.db.log_security_event({
            "event": "time_lock_enforced",
            "tx_id": tx["tx_id"],
            "user_id": tx["user_id"],
            "reason": f"Behavioral anomaly detected; lock for {lock_duration} minutes.",
            "timestamp": datetime.utcnow().isoformat()
        })

    def _calculate_lock_duration(self, profile: Dict[str, Any]) -> int:
        """
        Dynamically determines lock duration based on deviation from trusted behavior.
        """
        deviation = abs(profile["swipe_speed"] - 1.0) + abs(profile["phone_angle"]) / 45
        if deviation > 1.5:
            return 10  # max lock
        elif deviation > 0.7:
            return 5
        else:
            return 3

    async def dynamic_spend_control(self):
        """
        Continuously adapts user spend limits based on evolving risk posture.
        """
        users = await self.db.get_all_users()
        for user in users:
            risk_score = await self.db.get_user_risk_score(user["user_id"])
            base_limit = await self.db.get_user_base_spend_limit(user["user_id"])
            if risk_score >= 9:
                new_limit = max(100, int(base_limit * 0.1))
            elif risk_score >= 7:
                new_limit = int(base_limit * 0.5)
            else:
                new_limit = base_limit
            await self.db.update_user_spend_limit(user["user_id"], new_limit)
            await self.db.log_security_event({
                "event": "spend_limit_adjusted",
                "user_id": user["user_id"],
                "new_limit": new_limit,
                "risk_score": risk_score,
                "timestamp": datetime.utcnow().isoformat()
            })

    async def analyze_device(self, device_fingerprint: str) -> Dict[str, Any]:
        """
        Performs device fingerprint analysis for advanced threat enrichment.
        """
        # Simulated device intelligence
        known_malicious = ["baddevice123", "emulator_x", "rooted_abc"]
        is_malicious = device_fingerprint in known_malicious
        return {
            "device_fingerprint": device_fingerprint,
            "malicious": is_malicious,
            "confidence": 0.95 if is_malicious else 0.01
        }

    async def initialize_models(self):
        """
        Loads or warms up the risk and behavior models.
        """
        await self.risk_model.load()
        await self.behavior_model.load()

    async def adapt_model(self, threat_data: Dict[str, Any], learning_rate: float = 0.05):
        """
        Adapts risk/behavior models in response to new fraud triggers.
        """
        await self.risk_model.adapt(threat_data, learning_rate)
        await self.behavior_model.adapt(threat_data, learning_rate)

# Example usage for testing/demo
if __name__ == "__main__":
    import asyncio
    from data.simulated_db import SimulatedDB
    from utils.risk_models import DynamicRiskModel
    from utils.behavior_analyzer import BehaviorProfilingEngine

    async def main():
        db = SimulatedDB()
        risk_model = DynamicRiskModel()
        behavior_model = BehaviorProfilingEngine()
        manager = ShadowTransactionManager(db, risk_model, behavior_model)
        await manager.monitor_high_value_transactions()
        await manager.dynamic_spend_control()
        print("Shadow layer operations complete.")

    asyncio.run(main())

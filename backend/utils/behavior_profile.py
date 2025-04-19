from typing import Dict, Any, Optional

class BehaviorProfile:
    def __init__(self, db, logger):
        self.db = db
        self.logger = logger

    async def compare(self, user_id: str, session_data: Dict[str, Any]) -> float:
        trusted = await self.db.get_user_behavior_profile(user_id)
        if not trusted:
            self.logger.warning(f"No trusted behavior profile for user {user_id}.")
            return 5.0

        score = 0.0
        if "swipe_speed" in session_data and "swipe_speed" in trusted:
            diff = abs(session_data["swipe_speed"] - trusted["swipe_speed"])
            if diff > 0.8:
                score += 3.0
            elif diff > 0.4:
                score += 1.5
        if "phone_angle" in session_data and "phone_angle" in trusted:
            diff = abs(session_data["phone_angle"] - trusted["phone_angle"])
            if diff > 20:
                score += 2.0
            elif diff > 10:
                score += 1.0
        if "device" in session_data and "device" in trusted:
            if session_data["device"] != trusted["device"]:
                score += 2.5
        if "location" in session_data and "location" in trusted:
            if session_data["location"] != trusted["location"]:
                score += 1.0
        if "ip" in session_data and "ip" in trusted:
            if session_data["ip"] != trusted["ip"]:
                score += 0.5

        self.logger.info(
            f"Behavior comparison for user {user_id}: session={session_data}, trusted={trusted}, anomaly_score={score}"
        )
        return round(score, 2)

    async def update_profile(self, user_id: str, session_data: Dict[str, Any]):
        await self.db.update_user_behavior_profile(user_id, session_data)
        self.logger.info(f"Updated behavior profile for user {user_id}: {session_data}")

    async def load(self):
        pass

    async def adapt(self, threat_data: Dict[str, Any], learning_rate: float = 0.05):
        self.logger.info(f"Adapting behavior model with threat data: {threat_data}, lr={learning_rate}")

if __name__ == "__main__":
    import asyncio
    from data.simulated_db import SimulatedDB
    from utils.logger import StructuredLogger

    async def main():
        db = SimulatedDB()
        logger = StructuredLogger(level="DEBUG")
        bp = BehaviorProfile(db, logger)
        session = {
            "swipe_speed": 1.2,
            "phone_angle": 25,
            "device": "Android",
            "location": "Delhi",
            "ip": "192.168.1.100"
        }
        score = await bp.compare("user_001", session)
        print("Anomaly score:", score)
        await bp.update_profile("user_001", session)

    asyncio.run(main())

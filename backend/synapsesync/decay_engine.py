import math
from datetime import datetime, timedelta
from typing import Dict, Any

class DecayEngine:
    def __init__(self, config: Dict[str, Any]):
        self.decay_rate = config.get("decay_config", {}).get("decay_rate", 0.02)
        self.min_trust = config.get("decay_config", {}).get("min_trust", 0.1)
        self.max_trust = config.get("decay_config", {}).get("max_trust", 1.0)
        self.user_decay_states = {}  # user_id -> (last_decay_time, trust_value)

    def decay_trust(self, user_id: str, current_trust: float, now: datetime) -> float:
        last_decay_time, prev_trust = self.user_decay_states.get(user_id, (now, current_trust))
        elapsed = (now - last_decay_time).total_seconds() / 60.0
        decayed_trust = self._apply_decay(prev_trust, elapsed)
        decayed_trust = max(self.min_trust, min(self.max_trust, decayed_trust))
        self.user_decay_states[user_id] = (now, decayed_trust)
        return decayed_trust

    def _apply_decay(self, trust: float, minutes: float) -> float:
        # Exponential decay: trust decreases over time if not reinforced
        return trust * math.exp(-self.decay_rate * minutes)

    def reinforce_trust(self, user_id: str, increment: float, now: datetime):
        last_decay_time, prev_trust = self.user_decay_states.get(user_id, (now, self.max_trust))
        new_trust = min(self.max_trust, prev_trust + increment)
        self.user_decay_states[user_id] = (now, new_trust)

    def reset_trust(self, user_id: str, now: datetime, to_value: float = None):
        value = to_value if to_value is not None else self.max_trust
        self.user_decay_states[user_id] = (now, value)

    def get_trust(self, user_id: str) -> float:
        return self.user_decay_states.get(user_id, (None, self.max_trust))[1]

if __name__ == "__main__":
    from datetime import datetime, timedelta
    config = {
        "decay_config": {
            "decay_rate": 0.05,
            "min_trust": 0.1,
            "max_trust": 1.0
        }
    }
    engine = DecayEngine(config)
    user_id = "user_xyz"
    now = datetime.utcnow()
    trust = 0.8
    print(f"Initial trust: {trust}")
    for i in range(1, 11):
        later = now + timedelta(minutes=i)
        trust = engine.decay_trust(user_id, trust, later)
        print(f"Minute {i} | Trust: {trust:.4f}")
    engine.reinforce_trust(user_id, 0.15, now + timedelta(minutes=11))
    print(f"After reinforcement: {engine.get_trust(user_id):.4f}")
    engine.reset_trust(user_id, now + timedelta(minutes=12))
    print(f"After reset: {engine.get_trust(user_id):.4f}")
    engine.reset_trust(user_id, now + timedelta(minutes=13), to_value=0.5)  
import os
import json
import random
from typing import Dict, Any, List

class AIModelInterface:
    def __init__(self, model_path: str = "./ai_models/models/"):
        self.model_path = model_path
        self.fraud_patterns = self._load_patterns()
        self.decoy_templates = self._load_decoy_templates()

    def _load_patterns(self) -> List[Dict[str, Any]]:
        patterns_file = os.path.join(self.model_path, "fraud_patterns.json")
        if os.path.exists(patterns_file):
            with open(patterns_file, "r") as f:
                return json.load(f)
        return [
            {"pattern_id": "ring_1", "features": [0.8, 0.2, 0.1], "risk": 9},
            {"pattern_id": "synth_id", "features": [0.6, 0.6, 0.6], "risk": 8},
        ]

    def _load_decoy_templates(self) -> List[Dict[str, Any]]:
        templates_file = os.path.join(self.model_path, "decoy_templates.json")
        if os.path.exists(templates_file):
            with open(templates_file, "r") as f:
                return json.load(f)
        return [
            {"merchant": "Amazon", "location": "Delhi"},
            {"merchant": "Uber", "location": "Bangalore"},
            {"merchant": "Flipkart", "location": "Mumbai"},
        ]

    def generate_decoy(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        template = random.choice(self.decoy_templates)
        amount = round(random.uniform(10, 5000), 2)
        decoy = {
            "amount": amount,
            "merchant": template["merchant"],
            "location": template["location"],
            "profile_similarity": round(random.uniform(0.7, 1.0), 3),
            "phantom": True,
            "timestamp": None
        }
        return decoy

    def fraud_score(self, tx: Dict[str, Any], session_profile: Dict[str, Any]) -> float:
        base = 0.0
        for pattern in self.fraud_patterns:
            features = [random.random() for _ in range(3)]
            pattern_score = sum(abs(a - b) for a, b in zip(pattern["features"], features))
            if pattern_score < 0.4:
                base += pattern["risk"]
        if tx.get("amount", 0) > 1000:
            base += 2.0
        if session_profile.get("device") not in ["iPhone", "Android"]:
            base += 1.5
        if abs(session_profile.get("swipe_speed", 1.0) - 1.0) > 0.8:
            base += 1.0
        return min(round(base, 2), 10.0)

    def update_patterns(self, new_patterns: List[Dict[str, Any]]):
        self.fraud_patterns = new_patterns

    def load(self):
        pass

    def adapt(self, threat_data: Dict[str, Any], learning_rate: float = 0.05):
        pass

if __name__ == "__main__":
    ai = AIModelInterface()
    profile = {"device": "Android", "swipe_speed": 1.1}
    decoy = ai.generate_decoy(profile)
    print("Decoy transaction:", decoy)
    tx = {"amount": 1200, "merchant": "Amazon"}
    session = {"device": "Android", "swipe_speed": 1.3}
    score = ai.fraud_score(tx, session)
    print("Fraud score:", score)

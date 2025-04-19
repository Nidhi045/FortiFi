import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
import hashlib

class RiskEvaluator:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.risk_weights = config.get("risk_weights", {
            "amount": 0.22,
            "merchant_risk": 0.18,
            "geo_risk": 0.16,
            "device_risk": 0.13,
            "behavior_score": 0.13,
            "velocity": 0.10,
            "history_risk": 0.08
        })
        self.high_risk_threshold = config.get("high_risk_threshold", 0.7)
        self.critical_risk_threshold = config.get("critical_risk_threshold", 0.9)
        self.user_profiles = {}  # In-memory user risk cache

    def evaluate(self, tx: Dict[str, Any], user_history: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        features = self._extract_features(tx, user_history)
        risk_score = self._weighted_risk_score(features)
        risk_level = self._risk_level(risk_score)
        risk_factors = self._risk_factors(features)
        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "features": features
        }

    def _extract_features(self, tx: Dict[str, Any], user_history: Optional[List[Dict[str, Any]]]) -> Dict[str, float]:
        amount = tx['amount']
        merchant_risk = tx['merchant'].get('risk_category', 0.5)
        geo_risk = tx['location'].get('country_risk_score', 0.5)
        device_risk = self._device_risk(tx['device'])
        behavior_score = tx.get('behavior_trust_score', 0.5)
        velocity = self._velocity(tx, user_history)
        history_risk = self._history_risk(user_history)
        return {
            "amount": np.tanh(amount / 10000.0),
            "merchant_risk": merchant_risk,
            "geo_risk": geo_risk,
            "device_risk": device_risk,
            "behavior_score": behavior_score,
            "velocity": velocity,
            "history_risk": history_risk
        }

    def _device_risk(self, device: Dict[str, Any]) -> float:
        emulator_penalty = 0.7 if device.get("is_emulator") else 0.0
        tilt_penalty = np.tanh(abs(device.get("tilt_angle", 0)) / 30.0)
        swipe_penalty = np.tanh(abs(device.get("swipe_velocity", 1.0) - 1.0))
        return min(1.0, emulator_penalty + tilt_penalty + swipe_penalty)

    def _velocity(self, tx: Dict[str, Any], user_history: Optional[List[Dict[str, Any]]]) -> float:
        if not user_history or len(user_history) < 2:
            return 0.0
        last_time = datetime.fromisoformat(user_history[-2]['timestamp'])
        curr_time = datetime.fromisoformat(tx['timestamp'])
        delta_seconds = (curr_time - last_time).total_seconds()
        return np.tanh(3600.0 / (delta_seconds + 1))

    def _history_risk(self, user_history: Optional[List[Dict[str, Any]]]) -> float:
        if not user_history or len(user_history) < 5:
            return 0.5
        chargebacks = sum(1 for tx in user_history if tx.get("chargeback", False))
        return min(1.0, chargebacks / len(user_history) * 2.0)

    def _weighted_risk_score(self, features: Dict[str, float]) -> float:
        score = 0.0
        for k, v in features.items():
            score += self.risk_weights.get(k, 0.0) * v
        return round(min(score, 1.0), 4)

    def _risk_level(self, score: float) -> str:
        if score >= self.critical_risk_threshold:
            return "critical"
        elif score >= self.high_risk_threshold:
            return "high"
        elif score >= 0.4:
            return "medium"
        else:
            return "low"

    def _risk_factors(self, features: Dict[str, float]) -> List[str]:
        factors = []
        for k, v in features.items():
            if v > 0.7:
                factors.append(k)
        return factors

    def update_user_profile(self, user_id: str, tx: Dict[str, Any], risk_score: float):
        if user_id not in self.user_profiles:
            self.user_profiles[user_id] = []
        self.user_profiles[user_id].append({
            "tx_id": tx["tx_id"],
            "risk_score": risk_score,
            "timestamp": tx["timestamp"]
        })

    def get_user_risk_trend(self, user_id: str) -> float:
        history = self.user_profiles.get(user_id, [])
        if not history:
            return 0.0
        return np.mean([h["risk_score"] for h in history[-10:]])

if __name__ == "__main__":
    config = {
        "risk_weights": {
            "amount": 0.22,
            "merchant_risk": 0.18,
            "geo_risk": 0.16,
            "device_risk": 0.13,
            "behavior_score": 0.13,
            "velocity": 0.10,
            "history_risk": 0.08
        },
        "high_risk_threshold": 0.7,
        "critical_risk_threshold": 0.9
    }
    evaluator = RiskEvaluator(config)
    tx = {
        "tx_id": "TX123",
        "amount": 5000,
        "merchant": {"risk_category": 0.9},
        "location": {"country_risk_score": 0.8},
        "device": {"is_emulator": 1, "tilt_angle": 20, "swipe_velocity": 2.1},
        "behavior_trust_score": 0.3,
        "timestamp": datetime.now().isoformat()
    }
    user_history = [
        {"timestamp": (datetime.now() - timedelta(minutes=10)).isoformat(), "chargeback": False},
        {"timestamp": (datetime.now() - timedelta(minutes=5)).isoformat(), "chargeback": True},
        {"timestamp": (datetime.now() - timedelta(minutes=2)).isoformat(), "chargeback": False},
    ]
    result = evaluator.evaluate(tx, user_history)
    print("Risk evaluation:", result)

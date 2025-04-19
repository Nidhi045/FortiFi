import numpy as np
import pandas as pd
import math
import json
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from utils.logger import StructuredLogger
from utils.config import config

class FraudScorer:
    def __init__(self):
        self.logger = StructuredLogger(name="FraudScorer")
        self.feature_weights = self._load_feature_weights()
        self.models = self._load_models()
        self.score_cache = {}
        self.last_score_time = datetime.min
        self.ensemble_strategy = "weighted_average"

    def _load_feature_weights(self) -> Dict[str, float]:
        # In production, load from config, DB, or feature store
        return config.get('fraud_scoring', {}).get(
            'feature_weights',
            {
                'amount': 0.22,
                'merchant_risk': 0.18,
                'geo_velocity': 0.15,
                'device_trust': 0.12,
                'behavior_anomaly': 0.10,
                'user_history': 0.08,
                'time_of_day': 0.07,
                'network_analysis': 0.05,
                'bin_analysis': 0.03
            }
        )

    def _load_models(self) -> Dict[str, Any]:
        # In production, load from model registry, ONNX, or MLflow
        return {
            'xgboost': self._load_xgboost_model(),
            'neural_net': self._load_onnx_model()
        }

    def calculate_score(self, transaction: Dict[str, Any]) -> Dict[str, Any]:
        try:
            if not self._precheck(transaction):
                return {'error': 'Invalid transaction data'}

            features = self._extract_features(transaction)
            rule_based_score = self._rule_based_score(features)
            ml_score = self._ml_based_score(features)
            final_score = self._combine_scores(rule_based_score, ml_score)

            self._post_score_actions(transaction, final_score)
            return self._format_output(features, final_score, rule_based_score, ml_score)

        except Exception as e:
            self.logger.error(f"Scoring failed: {str(e)}")
            return {'error': 'Scoring system error'}

    def _precheck(self, tx: Dict) -> bool:
        required_fields = ['amount', 'user_id', 'merchant', 'timestamp']
        if not all(field in tx for field in required_fields):
            self.logger.warning(f"Missing required fields in transaction {tx.get('tx_id')}")
            return False
        if tx['amount'] < 0:
            self.logger.warning(f"Negative amount in transaction {tx.get('tx_id')}")
            return False
        return True

    def _extract_features(self, tx: Dict) -> Dict[str, float]:
        # In production, use feature_mapper.py
        return {
            'amount': self._normalize_amount(tx['amount']),
            'merchant_risk': self._get_merchant_risk(tx['merchant']),
            'geo_velocity': self._calculate_geo_velocity(tx.get('location_history', [])),
            'device_trust': self._device_trust_score(tx.get('device_fingerprint', '')),
            'behavior_anomaly': self._behavior_anomaly_score(tx.get('user_behavior', {})),
            'user_history': self._user_history_score(tx.get('user_id', '')),
            'time_of_day': self._time_of_day_score(tx['timestamp']),
            'network_analysis': self._network_analysis_score(tx.get('ip_address', '')),
            'bin_analysis': self._bin_analysis_score(tx.get('card_bin', ''))
        }

    def _rule_based_score(self, features: Dict) -> float:
        # Weighted sum of normalized features
        return sum(features[k] * self.feature_weights[k] for k in features.keys())

    def _ml_based_score(self, features: Dict) -> float:
        try:
            model_input = pd.DataFrame([features]).values.astype(np.float32)
            return float(self.models['neural_net'].predict(model_input)[0][0])
        except Exception as e:
            self.logger.error(f"ML scoring failed: {str(e)}")
            return float(self.models['xgboost'].predict([list(features.values())])[0])

    def _combine_scores(self, rule_score: float, ml_score: float) -> float:
        if self.ensemble_strategy == "weighted_average":
            recency_weight = np.tanh((datetime.now() - self.last_score_time).seconds / 3600)
            return float((0.7 * ml_score) + (0.3 * rule_score) * (1 + recency_weight))
        elif self.ensemble_strategy == "max":
            return max(rule_score, ml_score)
        elif self.ensemble_strategy == "min":
            return min(rule_score, ml_score)
        else:
            return (ml_score + rule_score) / 2

    def _normalize_amount(self, amount: float) -> float:
        return min(np.log10(amount + 1) / 6, 1.0)

    def _get_merchant_risk(self, merchant_id: str) -> float:
        # In production, call merchant risk service or DB
        return 0.5  # Placeholder

    def _calculate_geo_velocity(self, location_history: List[str]) -> float:
        # In production, compute from user location sequence
        if not location_history or len(location_history) < 2:
            return 0.0
        # Mock: if last two countries are different, high velocity
        return 1.0 if location_history[-1] != location_history[-2] else 0.2

    def _device_trust_score(self, device_hash: str) -> float:
        return 0.8 if device_hash and hash(device_hash) % 100 > 10 else 0.2

    def _behavior_anomaly_score(self, user_behavior: Dict) -> float:
        # In production, use behavior_profiler
        return float(user_behavior.get('anomaly_score', 0.5))

    def _user_history_score(self, user_id: str) -> float:
        # In production, query user risk profile/history
        return 0.6 if user_id and user_id.startswith("USER") else 0.3

    def _time_of_day_score(self, timestamp: str) -> float:
        try:
            dt = datetime.fromisoformat(timestamp)
            return abs((dt.hour - 12) / 12)
        except Exception:
            return 0.5

    def _network_analysis_score(self, ip_address: str) -> float:
        # In production, use IP intelligence service
        if not ip_address:
            return 0.5
        octet = int(ip_address.split('.')[0])
        return 0.9 if octet in [192, 10] else 0.3

    def _bin_analysis_score(self, card_bin: str) -> float:
        # In production, use BIN risk DB
        risky_bins = {'4111', '5110', '3714'}
        return 0.7 if card_bin in risky_bins else 0.2

    def _post_score_actions(self, tx: Dict, score: float):
        self.score_cache[tx.get('tx_id', str(hash(str(tx))))] = score
        self.last_score_time = datetime.now()
        if score > 0.8:
            self.logger.metric("high_risk_transaction", 1)

    def _format_output(self, features: Dict, score: float, rule_score: float, ml_score: float) -> Dict:
        return {
            'score': round(score, 4),
            'rule_score': round(rule_score, 4),
            'ml_score': round(ml_score, 4),
            'features': {k: round(v, 4) for k, v in features.items()},
            'weights': self.feature_weights,
            'ensemble_strategy': self.ensemble_strategy,
            'version': '1.2.0',
            'timestamp': datetime.now().isoformat()
        }

    # --- Mock model loading ---
    def _load_xgboost_model(self):
        from xgboost import XGBClassifier
        class DummyXGB:
            def predict(self, X):
                return [float(np.mean(X))]
        return DummyXGB()

    def _load_onnx_model(self):
        class DummyONNX:
            def predict(self, X):
                return np.clip(np.mean(X, axis=1, keepdims=True), 0, 1)
        return DummyONNX()

if __name__ == "__main__":
    scorer = FraudScorer()
    sample_tx = {
        'tx_id': 'TX123',
        'amount': 150.0,
        'user_id': 'USER001',
        'merchant': 'MERC456',
        'timestamp': datetime.now().isoformat(),
        'location_history': ['IN', 'US'],
        'device_fingerprint': 'DEVICE123',
        'user_behavior': {'anomaly_score': 0.7},
        'ip_address': '192.168.1.1',
        'card_bin': '4111'
    }
    result = scorer.calculate_score(sample_tx)
    print("Fraud score result:", json.dumps(result, indent=2))
    
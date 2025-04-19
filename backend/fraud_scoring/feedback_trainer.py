import os
import time
import json
import threading
import queue
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple
import numpy as np
import pandas as pd
from utils.logger import StructuredLogger
from utils.config import config

class FeedbackTrainer:
    def __init__(self):
        self.logger = StructuredLogger(name="FeedbackTrainer")
        self.feedback_queue = queue.Queue()
        self.training_data_path = config.get('fraud_scoring', {}).get('feedback_data_path', '/var/fortifi/feedback_training.csv')
        self.model_save_path = config.get('fraud_scoring', {}).get('model_save_path', '/var/fortifi/models/fraud_model_latest.pkl')
        self.model_type = config.get('fraud_scoring', {}).get('model_type', 'xgboost')
        self.training_thread = threading.Thread(target=self._training_loop, daemon=True)
        self.training_thread.start()
        self.training_interval = int(config.get('fraud_scoring', {}).get('training_interval', 3600))
        self.last_training_time = datetime.min
        self.model = self._load_initial_model()
        self.feature_columns = self._get_feature_columns()
        self.feedback_history = []

    def submit_feedback(self, transaction_id: str, features: Dict[str, float], label: int, meta: Optional[Dict[str, Any]] = None):
        """Queue feedback for training."""
        feedback = {
            'transaction_id': transaction_id,
            'features': features,
            'label': label,
            'meta': meta or {},
            'timestamp': datetime.now().isoformat()
        }
        self.feedback_queue.put(feedback)
        self.logger.info(f"Feedback queued for tx {transaction_id} label={label}")

    def _training_loop(self):
        """Background thread that periodically retrains the model."""
        while True:
            try:
                if self.feedback_queue.qsize() > 0:
                    self._process_feedback_queue()
                if (datetime.now() - self.last_training_time).total_seconds() > self.training_interval:
                    self._retrain_model()
                    self.last_training_time = datetime.now()
                time.sleep(5)
            except Exception as e:
                self.logger.error(f"Training loop error: {e}")

    def _process_feedback_queue(self):
        """Persist feedback to disk for batch training."""
        feedbacks = []
        while not self.feedback_queue.empty():
            feedback = self.feedback_queue.get()
            feedbacks.append(feedback)
            self.feedback_history.append(feedback)
            self.feedback_queue.task_done()
        if feedbacks:
            self._append_feedback_to_file(feedbacks)

    def _append_feedback_to_file(self, feedbacks: List[Dict[str, Any]]):
        """Append feedback to CSV for batch retraining."""
        rows = []
        for fb in feedbacks:
            row = {**fb['features'], 'label': fb['label'], 'transaction_id': fb['transaction_id'], 'timestamp': fb['timestamp']}
            rows.append(row)
        df = pd.DataFrame(rows)
        if not os.path.exists(self.training_data_path):
            df.to_csv(self.training_data_path, index=False)
        else:
            df.to_csv(self.training_data_path, mode='a', header=False, index=False)
        self.logger.info(f"Appended {len(rows)} feedback rows to {self.training_data_path}")

    def _retrain_model(self):
        """Retrain the model using all available feedback data."""
        if not os.path.exists(self.training_data_path):
            self.logger.warning(f"No training data found at {self.training_data_path}")
            return
        df = pd.read_csv(self.training_data_path)
        if len(df) < 100:
            self.logger.info(f"Insufficient feedback rows ({len(df)}) for retraining. Skipping.")
            return
        X = df[self.feature_columns].values
        y = df['label'].values
        self.logger.info(f"Retraining model on {len(X)} samples...")
        if self.model_type == 'xgboost':
            self._train_xgboost(X, y)
        elif self.model_type == 'lightgbm':
            self._train_lightgbm(X, y)
        elif self.model_type == 'sklearn':
            self._train_sklearn_rf(X, y)
        else:
            self.logger.warning(f"Unknown model type: {self.model_type}. Skipping retrain.")
            return
        self._save_model()
        self.logger.info(f"Model retrained and saved to {self.model_save_path}")

    def _train_xgboost(self, X, y):
        import xgboost as xgb
        self.model = xgb.XGBClassifier(n_estimators=100, max_depth=5, learning_rate=0.1, n_jobs=2)
        self.model.fit(X, y)

    def _train_lightgbm(self, X, y):
        import lightgbm as lgb
        self.model = lgb.LGBMClassifier(n_estimators=100, max_depth=5, learning_rate=0.1, n_jobs=2)
        self.model.fit(X, y)

    def _train_sklearn_rf(self, X, y):
        from sklearn.ensemble import RandomForestClassifier
        self.model = RandomForestClassifier(n_estimators=100, max_depth=5, n_jobs=2)
        self.model.fit(X, y)

    def _save_model(self):
        import joblib
        joblib.dump(self.model, self.model_save_path)

    def _load_initial_model(self):
        import joblib
        if os.path.exists(self.model_save_path):
            self.logger.info(f"Loading initial model from {self.model_save_path}")
            return joblib.load(self.model_save_path)
        else:
            self.logger.info("No initial model found. Using untrained model.")
            from sklearn.ensemble import RandomForestClassifier
            return RandomForestClassifier(n_estimators=100, max_depth=5, n_jobs=2)

    def _get_feature_columns(self) -> List[str]:
        # In production, load from feature registry or config
        return [
            'amount_log', 'amount_ratio_avg', 'currency_risk', 'transaction_type_risk',
            'hour_sin', 'hour_cos', 'day_of_week', 'days_since_epoch', 'is_holiday', 'time_since_last_tx',
            'ip_country_risk', 'ip_continent', 'billing_ip_distance', 'distance_risk', 'geo_velocity',
            'device_trust_score', 'device_age_days', 'is_emulator', 'is_rooted', 'os_version_risk',
            'screen_density', 'font_density', 'session_duration_norm', 'input_velocity', 'mouse_entropy',
            'behavior_anomaly_score', 'ip_reputation', 'asn_risk', 'proxy_risk', 'tor_exit_node', 'vpn_usage',
            'bin_risk', 'card_age_days', 'card_velocity', 'wallet_balance_ratio', 'merchant_risk_score',
            'merchant_category_risk', 'merchant_chargeback_rate', 'amount_velocity_interaction',
            'device_merchant_risk', 'network_behavior_risk'
        ]

    def get_feedback_history(self, limit: int = 100) -> List[Dict[str, Any]]:
        return self.feedback_history[-limit:]

    def manual_retrain(self):
        """Manual trigger for retraining."""
        self.logger.info("Manual retrain triggered.")
        self._retrain_model()

    def predict(self, features: Dict[str, float]) -> float:
        """Predict fraud probability for a feature vector."""
        X = np.array([features[col] for col in self.feature_columns]).reshape(1, -1)
        return float(self.model.predict_proba(X)[0][1])

    def shutdown(self):
        """Graceful shutdown for trainer."""
        self.logger.info("Shutting down FeedbackTrainer...")
        self.training_thread.join(timeout=2)

if __name__ == "__main__":
    trainer = FeedbackTrainer()
    # Submit feedback for a transaction
    features = {col: np.random.rand() for col in trainer.feature_columns}
    trainer.submit_feedback("TX_FEEDBACK_001", features, label=1)
    time.sleep(2)
    print("Feedback history:", trainer.get_feedback_history())
    trainer.manual_retrain()
    print("Prediction for random features:", trainer.predict(features))
    trainer.shutdown()
        #         return np.random.rand(1, 1)       
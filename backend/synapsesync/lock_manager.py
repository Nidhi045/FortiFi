import os
from datetime import datetime
from .behavior_profiler import RealTimeProfiler
from .risk_evaluator import RiskEvaluator
from .timelock_engine import TimeLockEngine
from .decay_engine import DecayEngine
from .smart_contract_handler import SmartContractHandler
from utils.config import get_timelock_config
from utils.logger import StructuredLogger

class LockManager:
    def __init__(self):
        self.config = get_timelock_config()
        self.logger = StructuredLogger(name="LockManager")
        self.profiler = RealTimeProfiler(self.config['behavior_model_path'])
        self.risk_evaluator = RiskEvaluator(self.config)
        self.timelock_engine = TimeLockEngine(self.config)
        self.decay_engine = DecayEngine(self.config)
        self.contract_handler = SmartContractHandler(
            self.config['blockchain']['rpc_url'],
            self.config['blockchain']['contract_address'],
            self.config['blockchain']['abi_path'],
            self.config['blockchain']['private_key']
        )

    def process_transaction(self, user_id: str, transaction: dict, user_history: list):
        risk_result = self.risk_evaluator.evaluate(transaction, user_history)
        risk_score = risk_result['risk_score']
        risk_level = risk_result['risk_level']
        self.logger.info(f"Transaction {transaction['tx_id']} risk: {risk_score:.3f} ({risk_level})")

        if risk_level in ["high", "critical"]:
            trust_score = self.profiler.process_transaction(user_id, transaction)
            self.logger.info(f"Behavioral trust score for {user_id}: {trust_score:.3f}")
            lock_minutes = self._determine_lock_duration(transaction, risk_score, trust_score)
            if trust_score < self.config['trust_threshold']:
                self.timelock_engine.lock_transaction(
                    tx_id=transaction['tx_id'],
                    user_id=user_id,
                    initial_trust=trust_score,
                    trust_threshold=self.config['trust_threshold'],
                    lock_minutes=lock_minutes
                )
                tx_hash = self.contract_handler.initiate_time_lock(
                    transaction['tx_id'], user_id, lock_minutes, trust_score, risk_score
                )
                self.logger.info(f"On-chain time-lock initiated: {tx_hash}")
                self.contract_handler.log_event(
                    "LOCK_INITIATED", transaction['tx_id'], user_id,
                    {"risk_score": risk_score, "trust_score": trust_score, "lock_minutes": lock_minutes}
                )
                return {"locked": True, "lock_minutes": lock_minutes, "tx_hash": tx_hash}
            else:
                self.logger.info(f"Trust score above threshold, no lock needed for {transaction['tx_id']}")
                return {"locked": False, "risk_score": risk_score, "trust_score": trust_score}
        else:
            self.logger.info(f"Transaction {transaction['tx_id']} is not high risk, no lock applied.")
            return {"locked": False, "risk_score": risk_score}

    def _determine_lock_duration(self, transaction: dict, risk_score: float, trust_score: float) -> int:
        base = self.config.get('base_lock_minutes', 5)
        if risk_score > 0.9:
            return min(15, base + 5)
        elif risk_score > 0.7:
            return base
        elif trust_score < 0.2:
            return min(10, base + 2)
        return base

    def release_transaction(self, tx_id: str, user_id: str):
        self.timelock_engine.release_lock(tx_id)
        tx_hash = self.contract_handler.release_time_lock(tx_id)
        self.logger.info(f"On-chain lock released: {tx_hash}")
        self.contract_handler.log_event(
            "LOCK_RELEASED", tx_id, user_id, {"released_at": datetime.utcnow().isoformat()}
        )
        return {"released": True, "tx_hash": tx_hash}

    def get_lock_status(self, tx_id: str):
        lock_info = self.timelock_engine.get_lock_info(tx_id)
        if lock_info:
            status = self.contract_handler.get_lock_status(tx_id)
            return {"local": lock_info, "onchain": status}
        return {"locked": False}

if __name__ == "__main__":
    manager = LockManager()
    user_id = "user_abc123"
    transaction = {
        "tx_id": "TX_LOCK_001",
        "amount": 5000,
        "merchant": {"risk_category": 0.9},
        "location": {"country_risk_score": 0.8},
        "device": {"is_emulator": 1, "tilt_angle": 20, "swipe_velocity": 2.1},
        "behavior_trust_score": 0.3,
        "timestamp": datetime.now().isoformat()
    }
    user_history = [
        {"timestamp": (datetime.now()).isoformat(), "chargeback": False},
        {"timestamp": (datetime.now()).isoformat(), "chargeback": True}
    ]
    result = manager.process_transaction(user_id, transaction, user_history)
    print("LockManager result:", result)
    lock_status = manager.get_lock_status(transaction['tx_id'])
    print("Lock status:", lock_status)  
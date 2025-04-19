import logging
import sys
import re
from datetime import datetime
from typing import Optional, Dict, Any

class StructuredLogger:
    def __init__(self, name: str = "FortiFi", level: str = "INFO", log_file: Optional[str] = None):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(getattr(logging, level.upper()))
        formatter = logging.Formatter('[%(asctime)s] %(levelname)s %(name)s: %(message)s')
        if log_file:
            file_handler = logging.FileHandler(log_file)
            file_handler.setFormatter(formatter)
            self.logger.addHandler(file_handler)
        stream_handler = logging.StreamHandler(sys.stdout)
        stream_handler.setFormatter(formatter)
        self.logger.addHandler(stream_handler)

    def _mask_pii(self, msg: str) -> str:
        msg = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b', '[EMAIL]', msg)
        msg = re.sub(r'\b\d{10,}\b', '[PHONE]', msg)
        msg = re.sub(r'user_[0-9a-zA-Z]+', 'user_[***]', msg)
        msg = re.sub(r'\b\d{12,19}\b', '[CARD]', msg)
        return msg

    def info(self, msg: str, extra: Optional[Dict[str, Any]] = None):
        msg = self._mask_pii(msg)
        if extra:
            msg += f" | extra: {extra}"
        self.logger.info(msg)

    def warning(self, msg: str, extra: Optional[Dict[str, Any]] = None):
        msg = self._mask_pii(msg)
        if extra:
            msg += f" | extra: {extra}"
        self.logger.warning(msg)

    def error(self, msg: str, extra: Optional[Dict[str, Any]] = None):
        msg = self._mask_pii(msg)
        if extra:
            msg += f" | extra: {extra}"
        self.logger.error(msg)

    def critical(self, msg: str, extra: Optional[Dict[str, Any]] = None):
        msg = self._mask_pii(msg)
        if extra:
            msg += f" | extra: {extra}"
        self.logger.critical(msg)

    def metric(self, name: str, value: float, units: str = ""):
        metric_msg = f"[METRIC] {name}: {value} {units}".strip()
        self.logger.info(metric_msg)

if __name__ == "__main__":
    logger = StructuredLogger(level="DEBUG")
    logger.info("User user_001 logged in with email alice@example.com and phone 9876543210.")
    logger.warning("Suspicious activity detected for user_002.")
    logger.error("Failed transaction for user_003: insufficient funds.")
    logger.metric("fraud_score_avg", 6.7, units="score")
    logger.critical("Critical error: system failure in module XYZ.")
#         return [tx for tx in self.transactions if tx["amount"] >= min_amount] 
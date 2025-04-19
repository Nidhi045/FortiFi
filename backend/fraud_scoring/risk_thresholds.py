import math
import time
import json
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from collections import deque
from utils.logger import StructuredLogger
from utils.config import config

class RiskThresholdEngine:
    def __init__(self):
        self.logger = StructuredLogger(name="RiskThresholds")
        self.base_thresholds = self._load_base_thresholds()
        self.historical_scores = deque(maxlen=1000)
        self.adjustment_factors = {'critical': 1.0, 'high': 1.0, 'medium': 1.0}
        self.last_adjustment_time = datetime.min
        self.velocity_window = timedelta(minutes=5)
        self.geo_risk_db = self._load_geo_risk_data()
        self.merchant_blacklist = self._load_merchant_blacklist()
        self.hysteresis_ranges = {
            'critical': 0.02,
            'high': 0.03,
            'medium': 0.05
        }

    def evaluate_risk(self, score: float, transaction: Dict) -> Dict[str, Any]:
        """Full risk evaluation pipeline with dynamic thresholds"""
        try:
            validated = self._validate_inputs(score, transaction)
            if not validated:
                return {'error': 'Invalid input parameters'}

            adjusted_score = self._apply_contextual_adjustment(score, transaction)
            risk_level = self._determine_risk_level(adjusted_score)
            actions = self._determine_actions(risk_level, transaction)
            
            self._update_system_state(adjusted_score, transaction)
            
            return self._format_output(
                score, 
                adjusted_score, 
                risk_level, 
                actions,
                transaction
            )
            
        except Exception as e:
            self.logger.error(f"Risk evaluation failed: {str(e)}")
            return {'error': 'Risk evaluation system error'}

    def _validate_inputs(self, score: float, tx: Dict) -> bool:
        """Comprehensive input validation"""
        if not (0 <= score <= 1):
            self.logger.warning(f"Invalid score value: {score}")
            return False
            
        required_fields = ['tx_id', 'amount', 'merchant_id', 'user_id']
        if not all(field in tx for field in required_fields):
            self.logger.warning(f"Missing required fields in transaction {tx.get('tx_id')}")
            return False
            
        if not isinstance(tx['amount'], (int, float)) or tx['amount'] < 0:
            self.logger.warning(f"Invalid amount: {tx['amount']}")
            return False
            
        return True

    def _apply_contextual_adjustment(self, score: float, tx: Dict) -> float:
        """Apply real-time contextual adjustments to raw score"""
        adjustment = 1.0
        
        # Time-based adjustments
        current_hour = datetime.now().hour
        if 0 <= current_hour < 6:
            adjustment *= 1.15  # Night time premium
            
        # Geographic risk
        adjustment *= self._get_geo_adjustment(tx.get('country_code'))
        
        # Merchant risk
        if tx['merchant_id'] in self.merchant_blacklist:
            adjustment *= 1.25
            
        # Velocity check
        if self._high_velocity(tx['user_id']):
            adjustment *= 1.3
            
        # Holiday adjustment
        if self._is_holiday_period():
            adjustment *= 1.1
            
        # Apply dynamic threshold scaling
        self._update_dynamic_factors()
        level_adjustment = self.adjustment_factors.get(
            self._determine_risk_level(score), 
            1.0
        )
        
        return min(score * adjustment * level_adjustment, 1.0)

    def _determine_risk_level(self, score: float) -> str:
        """Hysteresis-enabled risk classification"""
        current_thresholds = self._get_current_thresholds()
        
        if score >= (current_thresholds['critical'] - self.hysteresis_ranges['critical']):
            return 'critical'
        if score >= (current_thresholds['high'] - self.hysteresis_ranges['high']):
            return 'high' if score > current_thresholds['high'] else 'medium'
        if score >= (current_thresholds['medium'] - self.hysteresis_ranges['medium']):
            return 'medium' if score > current_thresholds['medium'] else 'low'
        return 'low'

    def _determine_actions(self, risk_level: str, tx: Dict) -> List[str]:
        """Action determination with escalation policies"""
        action_map = {
            'critical': ['block', 'freeze_account', 'alert_soc'],
            'high': ['review', 'require_2fa', 'flag_account'],
            'medium': ['verify', 'delay_settlement'],
            'low': ['approve']
        }
        
        actions = action_map.get(risk_level, ['review'])
        
        # Additional merchant-specific actions
        if tx['merchant_id'].startswith('HIGH_RISK_'):
            actions.append('merchant_investigation')
            
        # Cross-border transaction actions
        if tx.get('is_cross_border', False):
            actions.append('enhanced_kyc_check')
            
        # Large amount actions
        if tx['amount'] > config.get('large_amount_threshold', 10000):
            actions.append('manager_approval')
            
        return sorted(list(set(actions)))

    def _update_system_state(self, score: float, tx: Dict):
        """Update internal state for adaptive thresholding"""
        self.historical_scores.append(score)
        
        # Update thresholds every 5 minutes
        if datetime.now() - self.last_adjustment_time > timedelta(minutes=5):
            self._adjust_thresholds()
            self.last_adjustment_time = datetime.now()

    def _adjust_thresholds(self):
        """Adaptive threshold adjustment based on recent activity"""
        recent_scores = list(self.historical_scores)[-100:]
        
        if len(recent_scores) >= 50:
            fraud_rate = sum(1 for s in recent_scores if s > 0.7) / len(recent_scores)
            
            # Adjust thresholds based on fraud rate
            self.adjustment_factors['critical'] = 0.95 + (fraud_rate * 0.5)
            self.adjustment_factors['high'] = 0.90 + (fraud_rate * 0.4)
            self.adjustment_factors['medium'] = 0.85 + (fraud_rate * 0.3)
            
            # Ensure thresholds stay within valid ranges
            for level in self.adjustment_factors:
                self.adjustment_factors[level] = max(0.5, min(1.5, self.adjustment_factors[level]))

    def _get_current_thresholds(self) -> Dict[str, float]:
        return {
            'critical': self.base_thresholds['critical'] * self.adjustment_factors['critical'],
            'high': self.base_thresholds['high'] * self.adjustment_factors['high'],
            'medium': self.base_thresholds['medium'] * self.adjustment_factors['medium']
        }

    def _load_base_thresholds(self) -> Dict[str, float]:
        return config.get('fraud_scoring', {}).get(
            'thresholds',
            {
                'critical': 0.95,
                'high': 0.85,
                'medium': 0.65
            }
        )

    def _load_geo_risk_data(self) -> Dict[str, float]:
        return {
            'US': 0.4, 'IN': 0.3, 'CN': 0.6,
            'RU': 0.8, 'NG': 0.7, 'BR': 0.5
        }

    def _load_merchant_blacklist(self) -> set:
        return {'MERC_BLACK_123', 'MERC_HIGH_RISK_456'}

    def _get_geo_adjustment(self, country_code: str) -> float:
        return self.geo_risk_db.get(country_code, 1.0)

    def _high_velocity(self, user_id: str) -> bool:
        """Check transaction velocity via external service"""
        return False  # Implementation would query velocity service

    def _is_holiday_period(self) -> bool:
        """Check against holiday calendar"""
        return False  # Implementation would use holiday calendar service

    def _format_output(self, raw_score: float, adj_score: float,
                      risk_level: str, actions: List[str],
                      tx: Dict) -> Dict:
        return {
            'transaction_id': tx['tx_id'],
            'raw_score': round(raw_score, 4),
            'adjusted_score': round(adj_score, 4),
            'risk_level': risk_level,
            'actions': actions,
            'thresholds': self._get_current_thresholds(),
            'factors': {
                'geo_adjustment': self._get_geo_adjustment(tx.get('country_code')),
                'time_adjustment': 1.15 if 0 <= datetime.now().hour < 6 else 1.0,
                'merchant_adjustment': 1.25 if tx['merchant_id'] in self.merchant_blacklist else 1.0
            },
            'timestamp': datetime.now().isoformat(),
            'system_state': {
                'historical_score_count': len(self.historical_scores),
                'last_adjustment': self.last_adjustment_time.isoformat(),
                'current_factors': self.adjustment_factors
            }
        }

if __name__ == "__main__":
    engine = RiskThresholdEngine()
    
    test_transaction = {
        'tx_id': 'TX_987654',
        'amount': 15000.0,
        'merchant_id': 'MERC_BLACK_123',
        'user_id': 'USER_12345',
        'country_code': 'NG'
    }
    
    print("Critical Risk:", engine.evaluate_risk(0.96, test_transaction))
    print("High Risk:", engine.evaluate_risk(0.88, test_transaction))
    print("Medium Risk:", engine.evaluate_risk(0.70, test_transaction))
    print("Low Risk:", engine.evaluate_risk(0.30, test_transaction))
    print("Invalid Risk:", engine.evaluate_risk(1.5, test_transaction))
    print("Invalid Transaction:", engine.evaluate_risk(0.85, {}))   
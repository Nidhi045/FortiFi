import os
import json
import math
import time
import threading
from datetime import datetime, timedelta
from typing import Dict, Optional, List, Tuple
from collections import defaultdict, deque
from utils.logger import StructuredLogger
from utils.config import config
from .policy_rules import PolicyRules

class LimitEngine:
    def __init__(self, base_limits: Dict, decay_rate: float):
        self.logger = StructuredLogger(name="LimitEngine")
        self.base_limits = base_limits
        self.decay_rate = decay_rate
        self.user_states = defaultdict(self._default_user_state)
        self.market_conditions = self._get_initial_market_conditions()
        self.policy_rules = PolicyRules()
        self.lock = threading.Lock()
        self._start_market_monitor()
        self._start_state_janitor()

    def calculate_limits(self, current_limits: Dict, risk_assessment: Dict, 
                        market_conditions: Dict) -> Optional[Dict]:
        """Calculate new spending limits using adaptive algorithms"""
        with self.lock:
            user_id = risk_assessment.get('user_id', 'unknown')
            
            try:
                # Get current state
                state = self.user_states[user_id]
                
                # Calculate limit adjustments
                adjustments = self._calculate_adjustments(
                    current_limits,
                    risk_assessment,
                    state,
                    market_conditions
                )
                
                # Apply policy constraints
                new_limits = self._apply_policy_constraints(
                    adjustments,
                    user_id,
                    risk_assessment.get('location', 'global')
                )
                
                # Update state history
                self._update_user_state(user_id, new_limits, risk_assessment)
                
                return new_limits
                
            except Exception as e:
                self.logger.error(f"Limit calculation failed for {user_id}: {str(e)}")
                return None

    def _calculate_adjustments(self, current: Dict, risk: Dict, 
                              state: Dict, market: Dict) -> Dict:
        """Core limit adjustment algorithm"""
        base_risk = risk['final_risk_score']
        behavior_factor = self._calculate_behavior_factor(state)
        market_factor = self._calculate_market_factor(market)
        decay_factor = self._calculate_decay_factor(state['history'])
        
        # Calculate proposed limits
        return {
            'daily': self._adjust_limit(
                current['daily'],
                self.base_limits['daily'],
                base_risk,
                behavior_factor,
                market_factor,
                decay_factor
            ),
            'transaction': self._adjust_limit(
                current['transaction'],
                self.base_limits['transaction'],
                base_risk,
                behavior_factor,
                market_factor,
                decay_factor
            ),
            'weekly': self._adjust_limit(
                current.get('weekly', self.base_limits['daily'] * 7),
                self.base_limits['daily'] * 7,
                base_risk,
                behavior_factor,
                market_factor,
                decay_factor
            )
        }

    def _adjust_limit(self, current: float, base: float, risk: float, 
                     behavior: float, market: float, decay: float) -> float:
        """Adaptive limit adjustment formula"""
        target = base * (1 - risk) * market
        adjusted = current + (target - current) * behavior
        return max(0, adjusted * (1 - decay))

    def _calculate_behavior_factor(self, state: Dict) -> float:
        """Determine behavior-based adjustment rate"""
        if state['consecutive_approvals'] > 5:
            return 0.2  # Accelerate positive adjustments
        if state['recent_declines'] > 3:
            return -0.3  # Accelerate negative adjustments
        return 0.1  # Default adjustment rate

    def _calculate_market_factor(self, market: Dict) -> float:
        """Market conditions influence on limits"""
        factors = [
            1.0 - market.get('fraud_index', 0.0),
            market.get('economic_index', 1.0),
            1.0 - market.get('volatility', 0.0)
        ]
        return math.prod(factors) ** (1/3)

    def _calculate_decay_factor(self, history: deque) -> float:
        """Calculate limit decay based on usage patterns"""
        if len(history) < 3:
            return 0.0
            
        recent_usage = sum(h['usage'] for h in list(history)[-3:]) / 3
        return min(1.0, recent_usage * self.decay_rate)

    def _apply_policy_constraints(self, limits: Dict, user_id: str, 
                                 location: str) -> Dict:
        """Enforce policy-based limits and regulations"""
        constraints = self.policy_rules.get_location_constraints(location)
        
        return {
            'daily': min(limits['daily'], constraints['max_daily']),
            'transaction': min(limits['transaction'], constraints['max_transaction']),
            'weekly': min(limits['weekly'], constraints['max_weekly'])
        }

    def _update_user_state(self, user_id: str, new_limits: Dict, risk: Dict):
        """Update user's limit state and history"""
        state = self.user_states[user_id]
        state['current_limits'] = new_limits
        state['history'].append({
            'timestamp': datetime.utcnow().isoformat(),
            'risk_score': risk['final_risk_score'],
            'market_conditions': self.market_conditions,
            'usage': self._calculate_usage(user_id)
        })
        
        # Maintain history window
        if len(state['history']) > config.get('history_window', 30):
            state['history'].popleft()
            
        # Update behavior counters
        if new_limits['daily'] > state['current_limits'].get('daily', 0):
            state['consecutive_approvals'] += 1
            state['recent_declines'] = 0
        else:
            state['consecutive_approvals'] = 0
            state['recent_declines'] += 1

    def _calculate_usage(self, user_id: str) -> float:
        """Calculate recent limit usage percentage"""
        # Implementation would interface with transaction service
        return 0.0  # Placeholder

    def _start_market_monitor(self):
        """Background thread for market data updates"""
        def monitor_loop():
            while True:
                self.market_conditions = self._fetch_market_conditions()
                time.sleep(config.get('market_update_interval', 300))

        threading.Thread(target=monitor_loop, daemon=True).start()

    def _fetch_market_conditions(self) -> Dict:
        """Retrieve current market conditions from external service"""
        # Implementation would make API call to market data service
        return {
            'fraud_index': 0.15,
            'economic_index': 0.92,
            'volatility': 0.3
        }

    def _start_state_janitor(self):
        """Cleanup inactive user states"""
        def janitor_loop():
            while True:
                self._clean_inactive_states()
                time.sleep(3600)

        threading.Thread(target=janitor_loop, daemon=True).start()

    def _clean_inactive_states(self):
        """Remove user states without recent activity"""
        cutoff = datetime.utcnow() - timedelta(days=30)
        with self.lock:
            inactive = [uid for uid, state in self.user_states.items()
                       if state['last_updated'] < cutoff]
            for uid in inactive:
                del self.user_states[uid]

    def _default_user_state(self) -> Dict:
        """Default state for new users"""
        return {
            'current_limits': self.base_limits.copy(),
            'history': deque(maxlen=30),
            'consecutive_approvals': 0,
            'recent_declines': 0,
            'last_updated': datetime.utcnow()
        }

    def get_user_state(self, user_id: str) -> Optional[Dict]:
        """Retrieve current state for monitoring/debugging"""
        with self.lock:
            return self.user_states.get(user_id)

    def reset_user_limits(self, user_id: str):
        """Reset limits to base values (admin function)"""
        with self.lock:
            if user_id in self.user_states:
                self.user_states[user_id]['current_limits'] = self.base_limits.copy()
                self.user_states[user_id]['history'].clear()

if __name__ == "__main__":
    engine = LimitEngine(
        base_limits={'daily': 5000, 'transaction': 1000},
        decay_rate=0.1
    )
    
    # Test calculation
    current_limits = {'daily': 5000, 'transaction': 1000, 'weekly': 35000}
    risk_data = {
        'final_risk_score': 0.65,
        'user_id': 'test_user',
        'location': 'US'
    }
    
    new_limits = engine.calculate_limits(current_limits, risk_data, {})
    print("New limits:", json.dumps(new_limits, indent=2))
    
    # Test state management
    print("User state:", engine.get_user_state('test_user'))
    
    # Test reset
    engine.reset_user_limits('test_user')
    print("After reset:", engine.get_user_state('test_user'))
    print("Market conditions:", engine.market_conditions)   
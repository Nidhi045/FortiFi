import os
import json
import time
import threading
from pathlib import Path
from functools import lru_cache
from typing import Dict, List, Optional
from utils.logger import StructuredLogger
from utils.config import config

class PolicyRules:
    def __init__(self, rules_path: str = None):
        self.logger = StructuredLogger(name="PolicyRules")
        self.rules_path = rules_path or config.get('policy_rules_path', '/etc/fortifi/policy_rules.json')
        self.rules = {'global': self._default_global_rules()}
        self.last_modified = 0
        self.lock = threading.Lock()
        self._load_rules()
        self._start_file_watcher()

    def _load_rules(self):
        """Load rules from file with validation and fallback"""
        try:
            with open(self.rules_path, 'r') as f:
                new_rules = json.load(f)
                
            if not self._validate_rules(new_rules):
                raise ValueError("Invalid policy rules structure")
                
            with self.lock:
                self.rules = new_rules
                self.last_modified = os.path.getmtime(self.rules_path)
                self.logger.info(f"Loaded policy rules from {self.rules_path}")
                
        except Exception as e:
            self.logger.error(f"Failed to load rules: {str(e)} - Using defaults")
            self.rules = {'global': self._default_global_rules()}

    def _validate_rules(self, rules: Dict) -> bool:
        """Validate rules structure"""
        required_global = ['max_daily', 'max_transaction', 'high_risk_categories']
        return all(k in rules.get('global', {}) for k in required_global)

    def get_rules(self, location: str, merchant_category: str) -> Dict:
        """Get applicable rules for location and merchant category"""
        with self.lock:
            # Get location-specific rules or fallback to global
            location_rules = self.rules.get(location, self.rules['global'])
            
            # Merge with category-specific rules if exists
            category_rules = self.rules.get('categories', {}).get(merchant_category, {})
            
            return self._merge_rules(location_rules, category_rules)

    def _merge_rules(self, base: Dict, override: Dict) -> Dict:
        """Deep merge two rule sets"""
        merged = base.copy()
        for key, value in override.items():
            if isinstance(value, dict):
                merged[key] = self._merge_rules(merged.get(key, {}), value)
            else:
                merged[key] = value
        return merged

    @lru_cache(maxsize=1000)
    def get_merchant_risk(self, merchant_id: str) -> Optional[float]:
        """Get merchant-specific risk score if defined"""
        with self.lock:
            return self.rules.get('merchants', {}).get(merchant_id, {}).get('risk_score')

    @lru_cache(maxsize=1000)
    def get_location_risk(self, location: str) -> Optional[float]:
        """Get location risk score with fallback"""
        with self.lock:
            return self.rules.get('locations', {}).get(location, {}).get('risk_score', 0.5)

    def get_location_constraints(self, location: str) -> Dict:
        """Get location-specific spending constraints"""
        with self.lock:
            return self.rules.get(location, self.rules['global']).get('constraints', {})

    def _start_file_watcher(self):
        """Background thread to watch for rule changes"""
        def watcher_loop():
            while True:
                try:
                    current_modified = os.path.getmtime(self.rules_path)
                    if current_modified > self.last_modified:
                        self.logger.info("Detected policy rules change, reloading...")
                        self._load_rules()
                except Exception as e:
                    self.logger.error(f"File watcher error: {str(e)}")
                time.sleep(5)

        threading.Thread(target=watcher_loop, daemon=True).start()

    def reload_rules(self):
        """Manual trigger for rules reload"""
        self.logger.info("Manual rules reload triggered")
        self._load_rules()

    def _default_global_rules(self) -> Dict:
        """Default fallback rules"""
        return {
            "max_daily": 5000.0,
            "max_transaction": 1000.0,
            "max_weekly": 35000.0,
            "high_risk_categories": ["gambling", "crypto", "adult"],
            "constraints": {
                "max_daily": 10000.0,
                "max_transaction": 5000.0,
                "max_weekly": 70000.0
            },
            "risk_parameters": {
                "velocity_threshold": 1000.0,
                "decline_decay_rate": 0.2
            }
        }

    def list_high_risk_categories(self) -> List[str]:
        """Get current list of high-risk categories"""
        with self.lock:
            return self.rules['global'].get('high_risk_categories', [])

    def get_rule_metadata(self) -> Dict:
        """Get rules metadata for auditing"""
        with self.lock:
            return {
                "source": self.rules_path,
                "last_modified": self.last_modified,
                "locations": len(self.rules.get('locations', {})),
                "merchants": len(self.rules.get('merchants', {})),
                "categories": len(self.rules.get('categories', {}))
            }

if __name__ == "__main__":
    # Test implementation
    rules = PolicyRules("./test_rules.json")
    
    # Create test rules file
    test_rules = {
        "global": {
            "max_daily": 5000,
            "max_transaction": 1000,
            "high_risk_categories": ["gambling"]
        },
        "US": {
            "max_daily": 10000,
            "constraints": {
                "max_daily": 20000
            }
        },
        "categories": {
            "gambling": {
                "max_transaction": 500
            }
        }
    }
    
    with open("./test_rules.json", "w") as f:
        json.dump(test_rules, f)
    
    # Load test rules
    rules.reload_rules()
    
    # Test rule merging
    print("US Gambling Rules:", rules.get_rules("US", "gambling"))
    print("Merchant Risk:", rules.get_merchant_risk("casino_123"))
    print("Location Risk:", rules.get_location_risk("US"))
    print("High Risk Categories:", rules.list_high_risk_categories())
    print("Rule Metadata:", rules.get_rule_metadata())
    
    # Cleanup
    os.remove("./test_rules.json")
    rules.reload_rules()  # Reload to reset to defaults
    print("Reloaded to default rules:", rules.get_rule_metadata())  
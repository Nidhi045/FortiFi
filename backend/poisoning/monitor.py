import os
import re
import json
import socket
import geoip2.database
from datetime import datetime
from typing import Dict, Optional, Tuple, List
from cryptography.fernet import Fernet, InvalidToken
from .generator import IndianPoisonGenerator

class BharatPoisonMonitor:
    def __init__(self, encryption_key: bytes):
        self.encryption_key = encryption_key
        self.reader = geoip2.database.Reader('/usr/share/GeoIP/GeoLite2-Country.mmdb')
        self.patterns = {
            'aadhaar': re.compile(r'\b\d{4}\s\d{4}\s\d{4}\b'),
            'pan': re.compile(r'[A-Z]{5}[0-9]{4}[A-Z]{1}'),
            'mobile': re.compile(r'(\+91[-\s]?)?[6-9]\d{9}'),
            'ifsc': re.compile(r'^[A-Z]{4}0[A-Z0-9]{6}$'),
            'poison_id': re.compile(r'TRA[0-9A-F]{4}')
        }
        self.operator_prefixes = {
            'Jio': ['7', '6'],
            'Airtel': ['9', '8'], 
            'Vi': ['7', '9'],
            'BSNL': ['8', '7']
        }

    def inspect_payload(self, payload: Dict) -> Optional[Dict]:
        """Comprehensive inspection of any data payload"""
        findings = []
        
        # Check all string fields
        for key, value in payload.items():
            if isinstance(value, str):
                if result := self._analyze_text(value):
                    findings.extend(result)
                    
        # Special financial checks
        if 'bank_details' in payload:
            findings.extend(self._check_bank_details(payload['bank_details']))
            
        if 'kyc_documents' in payload:
            findings.extend(self._check_kyc_documents(payload['kyc_documents']))
            
        return findings if findings else None

    def _analyze_text(self, text: str) -> List[Dict]:
        """Deep inspection of text for poisoned patterns"""
        detected = []
        
        # Check for poison watermarks
        if poison_id := self._extract_poison_id(text):
            detected.append({'type': 'poison_marker', 'value': poison_id})
            
        # Indian credential pattern matching
        if self.patterns['aadhaar'].search(text):
            detected.append({'type': 'aadhaar_detected', 'value': text[:8] + '****'})
            
        if self.patterns['pan'].search(text):
            detected.append({'type': 'pan_detected', 'value': text})
            
        if mob := self.patterns['mobile'].search(text):
            operator = self._identify_operator(mob.group())
            detected.append({'type': 'mobile', 'value': mob.group(), 'operator': operator})
            
        return detected

    def _extract_poison_id(self, text: str) -> Optional[str]:
        """Extract and validate poison tracking IDs"""
        if match := self.patterns['poison_id'].search(text):
            try:
                return self._validate_poison_record(match.group())
            except InvalidToken:
                return None
        return None

    def _validate_poison_record(self, poison_id: str) -> Optional[str]:
        """Decrypt and verify poison credential metadata"""
        try:
            file_path = Path(f"/var/secure/poison_credentials/{poison_id}.json")
            decrypted = Fernet(self.encryption_key).decrypt(file_path.read_text().encode())
            metadata = json.loads(decrypted)['metadata']
            
            if metadata.get('geo_tag') == 'IN' and metadata['poison_id'] == poison_id:
                return poison_id
        except Exception as e:
            pass
        return None

    def _check_bank_details(self, details: Dict) -> List[Dict]:
        """Specialized check for Indian banking patterns"""
        findings = []
        if 'ifsc' in details and self.patterns['ifsc'].match(details['ifsc']):
            findings.append({'type': 'bank_ifsc', 'value': details['ifsc']})
            
        if 'account_number' in details and len(details['account_number']) not in [9, 11, 15]:
            findings.append({'type': 'suspicious_account', 'value': details['account_number']})
            
        return findings

    def _check_kyc_documents(self, documents: List[Dict]) -> List[Dict]:
        """Verify KYC documents against Indian standards"""
        findings = []
        for doc in documents:
            if doc['type'] == 'aadhaar' and not self._validate_aadhaar_format(doc['number']):
                findings.append({'type': 'invalid_aadhaar', 'value': doc['number']})
            if doc['type'] == 'pan' and not self._validate_pan_format(doc['number']):
                findings.append({'type': 'invalid_pan', 'value': doc['number']})
        return findings

    def _validate_aadhaar_format(self, number: str) -> bool:
        """Validate Aadhaar number structure"""
        return len(number) == 14 and number.count(' ') == 2

    def _validate_pan_format(self, number: str) -> bool:
        """Validate PAN card structure"""
        return self.patterns['pan'].fullmatch(number) is not None

    def _identify_operator(self, number: str) -> str:
        """Identify Indian telecom operator from number"""
        clean_num = number[-10:]
        for op, prefixes in self.operator_prefixes.items():
            if clean_num[0] in prefixes:
                return op
        return 'Unknown'

    def track_usage(self, request_data: Dict) -> Optional[Dict]:
        """Full-spectrum analysis of web request data"""
        source_ip = request_data.get('ip', '')
        user_agent = request_data.get('user_agent', '')
        
        detection_result = {
            'timestamp': datetime.now().isoformat(),
            'source': self._geolocate_ip(source_ip),
            'user_agent': user_agent,
            'findings': self.inspect_payload(request_data),
            'risk_score': 0
        }
        
        if detection_result['findings']:
            detection_result['risk_score'] = self._calculate_risk_score(detection_result['findings'])
            return detection_result
        return None

    def _geolocate_ip(self, ip: str) -> Dict:
        """Geolocation with Indian data localization compliance"""
        try:
            response = self.reader.country(ip)
            return {
                'country': response.country.iso_code,
                'state': response.subdivisions.most_specific.name,
                'is_indian': response.country.iso_code == 'IN'
            }
        except Exception:
            return {'country': 'Unknown', 'is_indian': False}

    def _calculate_risk_score(self, findings: List[Dict]) -> int:
        """Risk scoring algorithm for Indian fraud patterns"""
        score = 0
        for finding in findings:
            if finding['type'] == 'poison_marker':
                score += 100
            elif finding['type'] in ['aadhaar_detected', 'pan_detected']:
                score += 70
            elif finding['type'] == 'invalid_aadhaar':
                score += 50
        return min(score, 100)

    def monitor_real_time(self, log_stream):
        """Real-time monitoring for integration with web servers"""
        for log_entry in log_stream:
            if result := self.track_usage(log_entry):
                yield result

if __name__ == "__main__":
    # Initialize with test key
    key = Fernet.generate_key()
    monitor = BharatPoisonMonitor(key)
    
    # Test payload with poisoned data
    test_payload = {
        'username': 'user_TRA1A3B',
        'mobile': '+91 9876543210',
        'aadhaar': '1234 5678 9012',
        'bank_details': {
            'ifsc': 'SBIN0001234',
            'account_number': '123456789'
        }
    }
    
    print("Detection results:", monitor.inspect_payload(test_payload))
    
    # Simulate web request
    mock_request = {
        'ip': '103.216.127.0',  # Indian IP
        'user_agent': 'Mozilla/5.0 (Android 14; Mobile)',
        'username': 'test_TRA1B2C',
        'mobile': '919876543210'
    }
    print("Request analysis:", monitor.track_usage(mock_request))

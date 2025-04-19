import os
import re
import json
import socket
import hashlib
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from collections import defaultdict
from geoip2 import database
from cryptography.fernet import Fernet

class BharatTracingEngine:
    def __init__(self):
        self.sessions = defaultdict(self._new_session)
        self.geoip_reader = database.Reader('/usr/share/GeoIP/GeoLite2-City.mmdb')
        self.indian_isps = self._load_indian_isps()
        self.threat_feeds = self._load_indian_threat_feeds()
        self.device_patterns = self._load_indian_device_patterns()

    def _new_session(self):
        """Initialize new attack session with India-specific tracking"""
        return {
            'start_time': datetime.now(),
            'last_activity': datetime.now(),
            'activities': [],
            'geo_path': [],
            'network_indicators': {},
            'behavioral_patterns': {
                'typical_attack_hours': defaultdict(int),
                'preferred_targets': defaultdict(int)
            },
            'compliance_metadata': {
                'data_localization': 'IN',
                'retention_period': timedelta(days=180)
            }
        }

    def _load_indian_isps(self) -> Dict:
        """Major Indian ISPs and their ASN mappings"""
        return {
            'AS45671': 'Airtel Broadband',
            'AS24560': 'Reliance Jio',
            'AS4755': 'Tata Communications',
            'AS9829': 'BSNL Network',
            'AS18047': 'ACT Fibernet'
        }

    def _load_indian_threat_feeds(self) -> Dict:
        """Indian CERT-In and local threat intelligence"""
        return {
            'malicious_ips': self._load_feed('https://cert-in.org.in/feed/malicious_ips.json'),
            'phishing_domains': self._load_feed('https://cert-in.org.in/feed/phishing_domains.json')
        }

    def _load_indian_device_patterns(self) -> Dict:
        """Common device strings in Indian fraud operations"""
        return {
            'android_emulators': ['Android SDK', 'BlueStacks', 'LDPlayer'],
            'spoofed_devices': ['iPhone12,1', 'SM-G998B']
        }

    def record_activity(self, poison_id: str, event_type: str, metadata: Dict):
        """Record detailed attack telemetry with India context"""
        session = self.sessions[poison_id]
        
        # Geographic analysis
        geo_data = self._analyze_indian_geo(metadata.get('ip'))
        session['geo_path'].append(geo_data)
        
        # Network fingerprinting
        session['network_indicators'].update(
            self._analyze_network(metadata.get('ip'))
        )
        
        # Behavioral analysis
        self._update_behavioral_profile(session, event_type, metadata)
        
        # Activity logging
        session['activities'].append({
            'timestamp': datetime.now().isoformat(),
            'type': event_type,
            'metadata': self._sanitize_metadata(metadata),
            'geo_data': geo_data,
            'threat_intel_matches': self._check_threat_feeds(metadata)
        })
        
        session['last_activity'] = datetime.now()

    def _analyze_indian_geo(self, ip: str) -> Dict:
        """Detailed geolocation within India"""
        try:
            city = self.geoip_reader.city(ip)
            return {
                'country': 'IN',
                'state': city.subdivisions.most_specific.name,
                'city': city.city.name,
                'latitude': city.location.latitude,
                'longitude': city.location.longitude,
                'isp': self._identify_indian_isp(ip),
                'is_known_fraud_region': self._is_fraud_region(city)
            }
        except Exception:
            return {'country': 'IN', 'state': 'Unknown'}

    def _identify_indian_isp(self, ip: str) -> str:
        """Resolve ISP using ASN information"""
        try:
            asn = socket.gethostbyname_ex(ip)[0]
            return self.indian_isps.get(asn, 'Unknown ISP')
        except socket.gaierror:
            return 'Unknown ISP'

    def _is_fraud_region(self, city) -> bool:
        """Check against known Indian cybercrime hotspots"""
        fraud_cities = ['Mumbai', 'Noida', 'Jamtara', 'Bengaluru']
        return city.city.name in fraud_cities

    def _analyze_network(self, ip: str) -> Dict:
        """Network fingerprinting for Indian infrastructure"""
        return {
            'reverse_dns': socket.getnameinfo((ip, 0), socket.NI_NAMEREQD)[0],
            'asn': self._get_asn(ip),
            'is_tor_exit': self._check_tor_node(ip),
            'is_public_proxy': self._check_public_proxy(ip)
        }

    def _update_behavioral_profile(self, session: Dict, event_type: str, metadata: Dict):
        """Build behavioral model specific to Indian attack patterns"""
        hour = datetime.now().hour
        session['behavioral_patterns']['typical_attack_hours'][hour] += 1
        
        if 'target' in metadata:
            session['behavioral_patterns']['preferred_targets'][metadata['target']] += 1
            
        if 'device' in metadata:
            self._detect_suspicious_device(session, metadata['device'])

    def _detect_suspicious_device(self, session: Dict, device_str: str):
        """Detect common fraud devices in India"""
        for pattern in self.device_patterns['android_emulators']:
            if pattern in device_str:
                session['network_indicators']['emulator_used'] = True
                
        for pattern in self.device_patterns['spoofed_devices']:
            if pattern in device_str:
                session['network_indicators']['device_spoofing'] = True

    def _check_threat_feeds(self, metadata: Dict) -> List[str]:
        """Check against Indian threat intelligence"""
        matches = []
        if metadata.get('ip') in self.threat_feeds['malicious_ips']:
            matches.append('malicious_ip')
        if metadata.get('domain') in self.threat_feeds['phishing_domains']:
            matches.append('phishing_domain')
        return matches

    def _sanitize_metadata(self, metadata: Dict) -> Dict:
        """GDPR-like sanitization for Indian DPDP Act compliance"""
        sensitive_fields = ['aadhaar', 'pan', 'cvv']
        return {k: '***REDACTED***' if k in sensitive_fields else v 
                for k, v in metadata.items()}

    def generate_forensic_report(self, poison_id: str) -> Dict:
        """Generate CERT-In compatible incident report"""
        session = self.sessions.get(poison_id)
        if not session:
            return {}
            
        return {
            'summary': {
                'duration': str(session['last_activity'] - session['start_time']),
                'geo_path': session['geo_path'],
                'total_activities': len(session['activities'])
            },
            'network_analysis': session['network_indicators'],
            'behavior_analysis': {
                'peak_attack_hours': dict(session['behavioral_patterns']['typical_attack_hours']),
                'common_targets': dict(session['behavioral_patterns']['preferred_targets'])
            },
            'compliance_data': {
                'data_localized': session['compliance_metadata']['data_localization'],
                'retention_valid_until': (
                    session['start_time'] + 
                    session['compliance_metadata']['retention_period']
                ).isoformat()
            },
            'evidence_package': {
                'log_hashes': [hashlib.sha256(json.dumps(a).encode()).hexdigest() 
                             for a in session['activities']],
                'ioc_count': len(session['network_indicators'])
            }
        }

    def list_active_sessions(self, hours: int = 24) -> List[str]:
        """Get recent attack sessions"""
        cutoff = datetime.now() - timedelta(hours=hours)
        return [pid for pid, session in self.sessions.items()
               if session['last_activity'] > cutoff]

    def _load_feed(self, url: str) -> List[str]:
        """Load threat feed from Indian CERT"""
        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return []

if __name__ == "__main__":
    tracer = BharatTracingEngine()
    
    # Simulate attack from Jamtara
    tracer.record_activity("TRA1A3B", "phishing_attempt", {
        'ip': '103.216.127.20',  # Jamtara IP
        'device': 'Android SDK built for x86',
        'target': 'SBI NetBanking'
    })
    
    # Simulate financial fraud from Mumbai
    tracer.record_activity("TRA1A3B", "banking_fraud", {
        'ip': '49.36.123.45',  # Mumbai IP
        'device': 'iPhone12,1',
        'aadhaar': '1234 5678 9012'
    })
    
    print("Forensic Report:", json.dumps(
        tracer.generate_forensic_report("TRA1A3B"), 
        indent=2)
    )
    print("Active Sessions:", tracer.list_active_sessions())
    print("Recent Activities:", json.dumps(
        tracer.sessions["TRA1A3B"]['activities'], 
        indent=2)
    )
    print("Geolocation Data:", json.dumps(
        tracer.sessions["TRA1A3B"]['geo_path'], 
        indent=2)
    )
    print("Network Indicators:", json.dumps(
        tracer.sessions["TRA1A3B"]['network_indicators'], 
        indent=2)
    )
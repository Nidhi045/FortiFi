import smtplib
import json
import requests
import threading
import queue
import time
from typing import Dict, Any, List, Optional
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from utils.logger import StructuredLogger
from utils.config import config

class AlertDispatcher:
    def __init__(self):
        self.logger = StructuredLogger(name="AlertDispatcher")
        self.alert_queue = queue.Queue()
        self.email_settings = self._load_email_settings()
        self.webhook_settings = self._load_webhook_settings()
        self.sms_settings = self._load_sms_settings()
        self.siem_settings = self._load_siem_settings()
        self.alert_history = []
        self.dispatch_thread = threading.Thread(target=self._dispatch_loop, daemon=True)
        self.dispatch_thread.start()

    def _load_email_settings(self) -> Dict[str, Any]:
        return config.get('alerting', {}).get('email', {
            'smtp_server': 'smtp.example.com',
            'smtp_port': 587,
            'username': 'alert@fortifi.com',
            'password': 'password',
            'from_addr': 'alert@fortifi.com',
            'to_addrs': ['fraud_team@fortifi.com']
        })

    def _load_webhook_settings(self) -> Dict[str, Any]:
        return config.get('alerting', {}).get('webhook', {
            'url': 'https://fraud-webhook.fortifi.com/alert',
            'headers': {'Authorization': 'Bearer mytoken'}
        })

    def _load_sms_settings(self) -> Dict[str, Any]:
        return config.get('alerting', {}).get('sms', {
            'provider_url': 'https://api.smsprovider.com/send',
            'api_key': 'smsapikey',
            'from_number': '+1234567890'
        })

    def _load_siem_settings(self) -> Dict[str, Any]:
        return config.get('alerting', {}).get('siem', {
            'endpoint': 'https://siem.fortifi.com/ingest',
            'api_key': 'siemapikey'
        })

    def send_alert(self, alert: Dict[str, Any]):
        """Public method to queue an alert for dispatch."""
        self.alert_queue.put(alert)
        self.logger.info(f"Alert queued: {alert.get('alert_type', 'unknown')} for tx {alert.get('transaction_id')}")

    def _dispatch_loop(self):
        """Background thread for dispatching alerts."""
        while True:
            try:
                alert = self.alert_queue.get(timeout=1)
                self._dispatch_alert(alert)
                self.alert_queue.task_done()
            except queue.Empty:
                continue
            except Exception as e:
                self.logger.error(f"Alert dispatch failed: {e}")

    def _dispatch_alert(self, alert: Dict[str, Any]):
        """Dispatch alert to all configured channels."""
        alert_type = alert.get('alert_type', 'generic')
        tx_id = alert.get('transaction_id', 'unknown')
        risk_level = alert.get('risk_level', 'unknown')
        self.logger.info(f"Dispatching {alert_type} alert for tx {tx_id} (risk: {risk_level})")

        # Email
        if risk_level in ['critical', 'high']:
            self._send_email_alert(alert)
        # Webhook
        if risk_level in ['critical', 'high', 'medium']:
            self._send_webhook_alert(alert)
        # SMS
        if risk_level == 'critical':
            self._send_sms_alert(alert)
        # SIEM
        self._send_siem_alert(alert)

        self.alert_history.append({
            'timestamp': time.time(),
            'alert': alert
        })

    def _send_email_alert(self, alert: Dict[str, Any]):
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email_settings['from_addr']
            msg['To'] = ", ".join(self.email_settings['to_addrs'])
            msg['Subject'] = f"[FRAUD ALERT] {alert.get('risk_level', '').upper()} - TX {alert.get('transaction_id')}"
            body = f"""
            Fraud Alert Triggered

            Transaction ID: {alert.get('transaction_id')}
            Risk Level: {alert.get('risk_level')}
            Actions: {', '.join(alert.get('actions', []))}
            Score: {alert.get('score_details', {}).get('adjusted_score')}
            Details: {json.dumps(alert, indent=2)}
            """
            msg.attach(MIMEText(body, 'plain'))
            with smtplib.SMTP(self.email_settings['smtp_server'], self.email_settings['smtp_port']) as server:
                server.starttls()
                server.login(self.email_settings['username'], self.email_settings['password'])
                server.sendmail(
                    self.email_settings['from_addr'],
                    self.email_settings['to_addrs'],
                    msg.as_string()
                )
            self.logger.info(f"Email alert sent for tx {alert.get('transaction_id')}")
        except Exception as e:
            self.logger.error(f"Failed to send email alert: {e}")

    def _send_webhook_alert(self, alert: Dict[str, Any]):
        try:
            response = requests.post(
                self.webhook_settings['url'],
                headers=self.webhook_settings['headers'],
                json=alert,
                timeout=5
            )
            if response.status_code == 200:
                self.logger.info(f"Webhook alert sent for tx {alert.get('transaction_id')}")
            else:
                self.logger.warning(f"Webhook alert failed: {response.status_code} {response.text}")
        except Exception as e:
            self.logger.error(f"Failed to send webhook alert: {e}")

    def _send_sms_alert(self, alert: Dict[str, Any]):
        try:
            message = f"CRITICAL FRAUD ALERT: TX {alert.get('transaction_id')} Risk: {alert.get('risk_level')}"
            payload = {
                'api_key': self.sms_settings['api_key'],
                'to': alert.get('user_phone', '+0000000000'),
                'from': self.sms_settings['from_number'],
                'text': message
            }
            response = requests.post(
                self.sms_settings['provider_url'],
                json=payload,
                timeout=5
            )
            if response.status_code == 200:
                self.logger.info(f"SMS alert sent for tx {alert.get('transaction_id')}")
            else:
                self.logger.warning(f"SMS alert failed: {response.status_code} {response.text}")
        except Exception as e:
            self.logger.error(f"Failed to send SMS alert: {e}")

    def _send_siem_alert(self, alert: Dict[str, Any]):
        try:
            payload = {
                'event_type': 'fraud_alert',
                'timestamp': int(time.time()),
                'data': alert
            }
            response = requests.post(
                self.siem_settings['endpoint'],
                headers={'Authorization': f"Bearer {self.siem_settings['api_key']}"},
                json=payload,
                timeout=5
            )
            if response.status_code == 200:
                self.logger.info(f"SIEM alert sent for tx {alert.get('transaction_id')}")
            else:
                self.logger.warning(f"SIEM alert failed: {response.status_code} {response.text}")
        except Exception as e:
            self.logger.error(f"Failed to send SIEM alert: {e}")

    def get_alert_history(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Return the most recent alert dispatches."""
        return self.alert_history[-limit:]

    def resend_alert(self, alert: Dict[str, Any]):
        """Manual re-dispatch of an alert."""
        self.logger.info(f"Manually resending alert for tx {alert.get('transaction_id')}")
        self._dispatch_alert(alert)

    def shutdown(self):
        """Graceful shutdown for dispatcher."""
        self.logger.info("Shutting down AlertDispatcher...")
        self.dispatch_thread.join(timeout=2)

if __name__ == "__main__":
    dispatcher = AlertDispatcher()
    test_alert = {
        'alert_type': 'fraud',
        'transaction_id': 'TX_999888',
        'risk_level': 'critical',
        'actions': ['block', 'alert_soc'],
        'score_details': {'adjusted_score': 0.98},
        'user_phone': '+11234567890'
    }
    dispatcher.send_alert(test_alert)
    time.sleep(2)
    print("Alert history:", dispatcher.get_alert_history())
    dispatcher.shutdown()
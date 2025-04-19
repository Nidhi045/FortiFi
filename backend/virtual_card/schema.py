from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from pydantic import BaseModel, Field, validator, root_validator, constr, conint, confloat, ValidationError

class CardLimit(BaseModel):
    max_usage: conint(ge=1, le=5) = 1
    merchant: Optional[str] = None
    domain: Optional[str] = None
    amount: Optional[confloat(gt=0)] = None

class CardSecurityBinding(BaseModel):
    ip_binding: Optional[str] = None
    device_fingerprint: Optional[str] = None
    geo_locations: List[str] = []
    velocity_limit: Optional[conint(ge=1, le=10)] = 3

class CardMetadata(BaseModel):
    card_id: str
    user_id: str
    generated_at: datetime
    expires_at: datetime
    usage_count: int = 0
    limits: CardLimit
    security: CardSecurityBinding
    status: str = "active"
    invalidation_reason: Optional[str] = None
    invalidated_at: Optional[datetime] = None

    @validator('expires_at')
    def expiry_in_future(cls, v, values):
        if 'generated_at' in values and v <= values['generated_at']:
            raise ValueError('Card expiry must be after generation time')
        return v

    @validator('status')
    def status_must_be_valid(cls, v):
        if v not in ['active', 'invalidated', 'expired']:
            raise ValueError('Invalid card status')
        return v

    @root_validator
    def check_usage_and_status(cls, values):
        if values.get('usage_count', 0) >= values['limits'].max_usage:
            if values['status'] == 'active':
                values['status'] = 'invalidated'
        return values

class VirtualCard(BaseModel):
    card_number: constr(regex=r'^\d{16}$')
    cvv: constr(regex=r'^\d{3}$')
    expiry: constr(regex=r'^\d{2}/\d{2}$')
    metadata: CardMetadata

    @validator('card_number')
    def luhn_check(cls, v):
        def luhn_checksum(card_number):
            def digits_of(n): return [int(d) for d in str(n)]
            digits = digits_of(card_number)
            odd_digits = digits[-1::-2]
            even_digits = digits[-2::-2]
            checksum = sum(odd_digits)
            for d in even_digits:
                checksum += sum(digits_of(d*2))
            return checksum % 10
        if luhn_checksum(v) != 0:
            raise ValueError('Invalid card number (Luhn check failed)')
        return v

    @validator('expiry')
    def expiry_format(cls, v):
        try:
            month, year = map(int, v.split('/'))
            if not (1 <= month <= 12):
                raise ValueError
            if year < 0 or year > 99:
                raise ValueError
        except Exception:
            raise ValueError('Expiry must be in MM/YY format')
        return v

class CardTransactionContext(BaseModel):
    user_id: str
    amount: float
    merchant: str
    domain: str
    ip_address: Optional[str] = None
    device_fingerprint: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    currency: str = "INR"
    upi_id: Optional[str] = None

    @validator('amount')
    def amount_positive(cls, v):
        if v <= 0:
            raise ValueError('Amount must be positive')
        return v

    @validator('currency')
    def currency_code(cls, v):
        if len(v) != 3:
            raise ValueError('Currency must be 3-letter code')
        return v

class CardAuditLogEntry(BaseModel):
    card_id: str
    event: str
    timestamp: datetime
    user_id: str
    details: Dict[str, Any] = {}

class CardLifecycleEvent(BaseModel):
    event: str
    card_id: str
    user_id: str
    reason: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None

class CardFraudAlert(BaseModel):
    card_id: str
    risk_score: float
    indicators: List[str]
    triggered_at: datetime = Field(default_factory=datetime.utcnow)
    context: CardTransactionContext

    @validator('risk_score')
    def risk_score_range(cls, v):
        if not (0 <= v <= 1):
            raise ValueError('Risk score must be between 0 and 1')
        return v

class CardExportPackage(BaseModel):
    cards: List[VirtualCard]
    audit_logs: List[CardAuditLogEntry]
    lifecycle_events: List[CardLifecycleEvent]
    fraud_alerts: List[CardFraudAlert]
    exported_at: datetime = Field(default_factory=datetime.utcnow)
    exported_by: str

    def to_json(self):
        return self.json(indent=2, sort_keys=True, default=str)

if __name__ == "__main__":
    # Example usage
    try:
        meta = CardMetadata(
            card_id="abc123",
            user_id="user_001",
            generated_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(minutes=30),
            usage_count=0,
            limits=CardLimit(max_usage=1, merchant="amazon.in", amount=5000.0),
            security=CardSecurityBinding(
                ip_binding="192.168.1.1",
                device_fingerprint="dev_123",
                geo_locations=["Delhi", "Mumbai"]
            )
        )
        card = VirtualCard(
            card_number="4539876234567890",
            cvv="123",
            expiry="12/25",
            metadata=meta
        )
        print("Card schema validated:", card)
    except ValidationError as e:
        print("Validation error:", e)
    except Exception as e:
        print("Unexpected error:", e)
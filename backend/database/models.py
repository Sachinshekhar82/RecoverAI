from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum
from datetime import datetime

class CategoryEnum(str, Enum):
    PAYMENT_FAILURE = "PAYMENT_FAILURE"
    CHECKOUT_ABANDONMENT = "CHECKOUT_ABANDONMENT"
    FAILED_SUBSCRIPTION = "FAILED_SUBSCRIPTION"
    OVERDUE_INVOICE = "OVERDUE_INVOICE"

class RiskLevelEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ActionTypeEnum(str, Enum):
    RETRY_PAYMENT = "RETRY_PAYMENT"
    GENERATE_PAYMENT_LINK = "GENERATE_PAYMENT_LINK"
    SEND_EMAIL = "SEND_EMAIL"
    SEND_WHATSAPP = "SEND_WHATSAPP"
    ESCALATE_TO_MERCHANT = "ESCALATE_TO_MERCHANT"
    STOP_RECOVERY = "STOP_RECOVERY"

class StatusEnum(str, Enum):
    DETECTED = "DETECTED"
    DIAGNOSED = "DIAGNOSED"
    INTERVENTION_PENDING = "INTERVENTION_PENDING"
    APPROVED = "APPROVED"
    EXECUTING = "EXECUTING"
    RECOVERED = "RECOVERED"
    FAILED_ATTEMPT = "FAILED_ATTEMPT"
    SAFELY_STOPPED = "SAFELY_STOPPED"
    ESCALATED = "ESCALATED"
    EXCEPTIONAL = "EXCEPTIONAL"

class RecoveryCaseModel(BaseModel):
    id: str
    transaction_id: str
    customer_id: str
    customer_name: str
    customer_email: str
    customer_phone: str
    category: CategoryEnum
    amount: float
    currency: str = "INR"
    failure_reason: str
    payment_attempts: int = 1
    contacts_count: int = 0
    days_overdue: int = 0
    previous_success_rate: float = 0.8
    opted_out: bool = False
    
    risk_level: RiskLevelEnum = RiskLevelEnum.MEDIUM
    risk_score: float = 0.5
    
    root_cause: str = ""
    confidence: float = 0.0
    recovery_probability: float = 0.0
    recommended_action: ActionTypeEnum = ActionTypeEnum.RETRY_PAYMENT
    reasoning: str = ""
    
    status: StatusEnum = StatusEnum.DETECTED
    last_action: Optional[str] = None
    execution_result: Optional[Dict[str, Any]] = None
    policy_status: Optional[str] = None
    policy_reason: Optional[str] = None
    
    created_at: str
    updated_at: str
    last_attempt_at: Optional[str] = None

class AuditEventModel(BaseModel):
    event_id: str
    timestamp: str
    transaction_id: str
    customer_id: str
    action: str
    actor: str  # "AI_AGENT", "POLICY_ENGINE", "EXECUTION_SERVICE", "MERCHANT_USER"
    AI_reason: str
    confidence: float
    policy_decision: str  # "APPROVED", "REJECTED"
    execution_status: str  # "SUCCESS", "FAILED", "STOPPED", "ESCALATED"
    provider_response: Dict[str, Any]
    amount: float
    result: str

class PolicyDecisionResult(BaseModel):
    allowed: bool
    rule_name: str
    reason: str
    rejection_category: Optional[str] = None

class AgentQueryRequest(BaseModel):
    query: str

class AgentQueryResponse(BaseModel):
    answer: str
    intent: str
    data_context: Optional[Dict[str, Any]] = None
    recommended_actions: Optional[List[Dict[str, Any]]] = None

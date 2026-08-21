from backend.engine.policy_engine import policy_engine
from backend.database.models import ActionTypeEnum, StatusEnum

def test_policy_engine_max_payment_retries():
    # Case with 3 attempts already
    case_data = {
        "id": "RC-1001",
        "payment_attempts": 3,
        "contacts_count": 1,
        "amount": 4999.0,
        "status": StatusEnum.DIAGNOSED.value,
        "opted_out": False
    }
    
    # Proposed action: RETRY_PAYMENT
    result = policy_engine.evaluate(case_data, ActionTypeEnum.RETRY_PAYMENT.value)
    
    assert result.allowed is False
    assert result.rule_name == "MAX_PAYMENT_RETRIES_EXCEEDED"
    assert "Maximum payment retry limit" in result.reason

def test_policy_engine_max_customer_contacts():
    case_data = {
        "id": "RC-1002",
        "payment_attempts": 1,
        "contacts_count": 2,
        "amount": 2999.0,
        "status": StatusEnum.DIAGNOSED.value,
        "opted_out": False
    }
    
    result = policy_engine.evaluate(case_data, ActionTypeEnum.SEND_EMAIL.value)
    
    assert result.allowed is False
    assert result.rule_name == "MAX_CUSTOMER_CONTACTS_EXCEEDED"

def test_policy_engine_stop_after_success():
    case_data = {
        "id": "RC-1003",
        "payment_attempts": 1,
        "contacts_count": 0,
        "amount": 9999.0,
        "status": StatusEnum.RECOVERED.value,
        "opted_out": False
    }
    
    result = policy_engine.evaluate(case_data, ActionTypeEnum.RETRY_PAYMENT.value)
    
    assert result.allowed is False
    assert result.rule_name == "STOP_AFTER_SUCCESS"

def test_policy_engine_allow_valid_retry():
    case_data = {
        "id": "RC-1004",
        "payment_attempts": 1,
        "contacts_count": 0,
        "amount": 4999.0,
        "status": StatusEnum.DIAGNOSED.value,
        "opted_out": False
    }
    
    result = policy_engine.evaluate(case_data, ActionTypeEnum.RETRY_PAYMENT.value)
    
    assert result.allowed is True
    assert result.rule_name == "POLICY_PASSED"

def test_policy_engine_cooldown_period():
    from datetime import datetime, timedelta
    recent_time = (datetime.utcnow() - timedelta(minutes=5)).strftime("%Y-%m-%dT%H:%M:%SZ")
    case_data = {
        "id": "RC-1005",
        "payment_attempts": 1,
        "contacts_count": 0,
        "amount": 4999.0,
        "status": StatusEnum.DIAGNOSED.value,
        "opted_out": False,
        "last_attempt_at": recent_time
    }
    
    result = policy_engine.evaluate(case_data, ActionTypeEnum.RETRY_PAYMENT.value)
    assert result.allowed is False
    assert result.rule_name == "COOLDOWN_PERIOD_ACTIVE"

def test_policy_engine_max_amount_threshold():
    case_data = {
        "id": "RC-1006",
        "payment_attempts": 1,
        "contacts_count": 0,
        "amount": 600000.0,  # Exceeds max 5,00,000 INR limit
        "status": StatusEnum.DIAGNOSED.value,
        "opted_out": False
    }
    
    result = policy_engine.evaluate(case_data, ActionTypeEnum.RETRY_PAYMENT.value)
    assert result.allowed is False
    assert result.rule_name == "MAX_AMOUNT_LIMIT_EXCEEDED"

def test_policy_engine_customer_opt_out():
    case_data = {
        "id": "RC-1007",
        "payment_attempts": 1,
        "contacts_count": 0,
        "amount": 4999.0,
        "status": StatusEnum.DIAGNOSED.value,
        "opted_out": True
    }
    
    result = policy_engine.evaluate(case_data, ActionTypeEnum.RETRY_PAYMENT.value)
    assert result.allowed is False
    assert result.rule_name == "STOP_AFTER_CUSTOMER_OPT_OUT"


from backend.database.db import db_manager
from backend.engine.risk_detector import risk_detector
from backend.engine.root_cause_analyzer import root_cause_analyzer
from backend.engine.recovery_agent import recovery_agent
from backend.engine.policy_engine import policy_engine
from backend.engine.execution_service import execution_service
from backend.engine.verification_service import verification_service
from backend.engine.audit_logger import audit_logger
from backend.database.models import ActionTypeEnum, StatusEnum

def test_full_successful_recovery_workflow():
    # 1. Create a synthetic high-risk payment failure case
    case_id = "RC-TEST-001"
    case_data = {
        "id": case_id,
        "transaction_id": "txn_test_9999",
        "customer_id": "cust_test_8888",
        "customer_name": "Rohan Mehta",
        "customer_email": "rohan.mehta@example.com",
        "customer_phone": "+919876543210",
        "category": "PAYMENT_FAILURE",
        "amount": 4999.0,
        "currency": "INR",
        "failure_reason": "Gateway timeout during 2FA authentication",
        "payment_attempts": 1,
        "contacts_count": 0,
        "days_overdue": 0,
        "previous_success_rate": 0.90,
        "opted_out": False,
        "risk_level": "HIGH",
        "status": "DETECTED",
        "created_at": "2026-08-21T10:00:00Z",
        "updated_at": "2026-08-21T10:00:00Z"
    }
    db_manager.insert_one("recovery_cases", case_data)

    # 2. Risk Detection
    risk_res = risk_detector.detect_risk(case_data)
    assert risk_res["risk_level"] in ["HIGH", "CRITICAL"]

    # 3. AI Diagnosis & Decision
    ai_dec = recovery_agent.decide_intervention(case_data)
    assert ai_dec["recommended_action"] in [ActionTypeEnum.RETRY_PAYMENT.value, ActionTypeEnum.GENERATE_PAYMENT_LINK.value]

    # 4. Policy Engine Evaluation
    policy_res = policy_engine.evaluate(case_data, ai_dec["recommended_action"])
    assert policy_res.allowed is True

    # 5. Recovery Execution & Verification
    exec_res = execution_service.execute(case_data, ai_dec["recommended_action"])
    verif_res = verification_service.verify_and_update(case_id, exec_res)
    assert verif_res["verified"] is True
    assert verif_res["status"] == StatusEnum.RECOVERED.value

    # 6. Audit Trail Logging
    evt = audit_logger.log_event(
        transaction_id=case_data["transaction_id"],
        customer_id=case_data["customer_id"],
        action=ai_dec["recommended_action"],
        actor="EXECUTION_SERVICE",
        AI_reason=ai_dec["reason"],
        confidence=ai_dec["confidence"],
        policy_decision="APPROVED",
        execution_status="SUCCESS",
        provider_response=exec_res["provider_response"],
        amount=case_data["amount"],
        result="Successfully recovered revenue"
    )
    assert evt["policy_decision"] == "APPROVED"

def test_full_policy_rejection_stopping_workflow():
    # Case with max retries (3) reached
    case_id = "RC-TEST-002"
    case_data = {
        "id": case_id,
        "transaction_id": "txn_test_9998",
        "customer_id": "cust_test_8887",
        "customer_name": "Anita Roy",
        "customer_email": "anita.roy@example.com",
        "customer_phone": "+919876543211",
        "category": "PAYMENT_FAILURE",
        "amount": 2999.0,
        "currency": "INR",
        "failure_reason": "Bank authorization declined",
        "payment_attempts": 3,
        "contacts_count": 2,
        "days_overdue": 0,
        "previous_success_rate": 0.50,
        "opted_out": False,
        "risk_level": "MEDIUM",
        "status": "FAILED_ATTEMPT",
        "created_at": "2026-08-21T10:00:00Z",
        "updated_at": "2026-08-21T10:00:00Z"
    }
    db_manager.insert_one("recovery_cases", case_data)

    # Proposed action RETRY_PAYMENT should be rejected by Policy Engine
    policy_res = policy_engine.evaluate(case_data, ActionTypeEnum.RETRY_PAYMENT.value)
    assert policy_res.allowed is False
    assert policy_res.rule_name == "MAX_PAYMENT_RETRIES_EXCEEDED"

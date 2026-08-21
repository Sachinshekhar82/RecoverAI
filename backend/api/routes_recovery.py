from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from backend.database.db import db_manager
from backend.engine.risk_detector import risk_detector
from backend.engine.root_cause_analyzer import root_cause_analyzer
from backend.engine.recovery_agent import recovery_agent
from backend.engine.policy_engine import policy_engine
from backend.engine.execution_service import execution_service
from backend.engine.verification_service import verification_service
from backend.engine.audit_logger import audit_logger

router = APIRouter(prefix="/api/recovery", tags=["Recovery Workflows"])

@router.get("/cases")
def get_recovery_cases(
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None)
):
    cases = db_manager.get_collection("recovery_cases")
    if category:
        cases = [c for c in cases if c.get("category") == category]
    if status:
        cases = [c for c in cases if c.get("status") == status]
    if risk_level:
        cases = [c for c in cases if c.get("risk_level") == risk_level]
    return {"count": len(cases), "cases": cases}

@router.get("/{case_id}")
def get_case_detail(case_id: str):
    case = db_manager.find_one("recovery_cases", {"id": case_id})
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")
    
    # Fetch audit events for this case's transaction_id
    audit_events = db_manager.get_collection("audit_events")
    case_audits = [e for e in audit_events if e.get("transaction_id") == case.get("transaction_id")]

    return {"case": case, "audit_trail": case_audits}

@router.post("/{case_id}/analyze")
def analyze_case(case_id: str):
    case = db_manager.find_one("recovery_cases", {"id": case_id})
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")
    
    risk_analysis = risk_detector.detect_risk(case)
    ai_decision = recovery_agent.decide_intervention(case)
    
    # Update case with analysis findings
    update_data = {
        "risk_level": risk_analysis.get("risk_level"),
        "risk_score": risk_analysis.get("risk_score"),
        "root_cause": ai_decision.get("root_cause"),
        "confidence": ai_decision.get("confidence"),
        "recovery_probability": ai_decision.get("recovery_probability"),
        "recommended_action": ai_decision.get("recommended_action"),
        "reasoning": ai_decision.get("reason"),
        "status": "DIAGNOSED" if case.get("status") == "DETECTED" else case.get("status")
    }
    db_manager.update_one("recovery_cases", {"id": case_id}, {"$set": update_data})

    return {
        "case_id": case_id,
        "risk_analysis": risk_analysis,
        "ai_decision": ai_decision
    }

@router.post("/{case_id}/execute")
def execute_intervention(case_id: str, action_type: Optional[str] = None):
    case = db_manager.find_one("recovery_cases", {"id": case_id})
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")

    target_action = action_type or case.get("recommended_action") or "RETRY_PAYMENT"

    # Step 1: Policy Engine Validation
    policy_check = policy_engine.evaluate(case, target_action)
    
    if not policy_check.allowed:
        # Policy rejected execution! Log event & escalate/stop
        audit_logger.log_event(
            transaction_id=case.get("transaction_id"),
            customer_id=case.get("customer_id"),
            action=target_action,
            actor="POLICY_ENGINE",
            AI_reason=case.get("reasoning", "AI recommended action"),
            confidence=case.get("confidence", 0.85),
            policy_decision="REJECTED",
            execution_status="STOPPED",
            provider_response={"policy_rule": policy_check.rule_name, "reason": policy_check.reason},
            amount=case.get("amount", 0.0),
            result=f"Action REJECTED by Policy Engine: {policy_check.reason}"
        )
        
        # Update case policy status
        db_manager.update_one("recovery_cases", {"id": case_id}, {
            "$set": {
                "policy_status": "REJECTED",
                "policy_reason": policy_check.reason,
                "status": "SAFELY_STOPPED" if policy_check.rule_name == "MAX_PAYMENT_RETRIES_EXCEEDED" else case.get("status")
            }
        })

        return {
            "success": False,
            "policy_passed": False,
            "policy_decision": policy_check.model_dump(),
            "message": f"Policy Violation: {policy_check.reason}"
        }

    # Step 2: Policy Approved — Execute Action via Execution Service
    exec_result = execution_service.execute(case, target_action)

    # Step 3: Verify Result & Update DB State
    verification = verification_service.verify_and_update(case_id, exec_result)

    # Step 4: Record Audit Event Log
    audit_logger.log_event(
        transaction_id=case.get("transaction_id"),
        customer_id=case.get("customer_id"),
        action=target_action,
        actor="EXECUTION_SERVICE",
        AI_reason=case.get("reasoning", "AI decision"),
        confidence=case.get("confidence", 0.85),
        policy_decision="APPROVED",
        execution_status=exec_result.get("status"),
        provider_response=exec_result.get("provider_response", {}),
        amount=case.get("amount", 0.0),
        result=exec_result.get("reason", "Executed recovery action")
    )

    return {
        "success": True,
        "policy_passed": True,
        "execution_result": exec_result,
        "verification": verification
    }

@router.post("/{case_id}/stop")
def stop_recovery_case(case_id: str, reason: str = "Merchant manual halt"):
    case = db_manager.find_one("recovery_cases", {"id": case_id})
    if not case:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found.")

    db_manager.update_one("recovery_cases", {"id": case_id}, {
        "$set": {"status": "SAFELY_STOPPED", "policy_reason": reason}
    })

    audit_logger.log_event(
        transaction_id=case.get("transaction_id"),
        customer_id=case.get("customer_id"),
        action="STOP_RECOVERY",
        actor="MERCHANT_USER",
        AI_reason="Manual merchant intervention",
        confidence=1.0,
        policy_decision="APPROVED",
        execution_status="STOPPED",
        provider_response={"stopped_by": "merchant"},
        amount=case.get("amount", 0.0),
        result=f"Recovery stopped manually by merchant: {reason}"
    )

    return {"success": True, "status": "SAFELY_STOPPED"}

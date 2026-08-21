from fastapi import APIRouter
from backend.engine.batch_evaluator import batch_evaluator
from backend.database.db import db_manager

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("")
def get_dashboard_summary():
    metrics = batch_evaluator.evaluate_batch()
    cases = db_manager.get_collection("recovery_cases")
    
    # Active recovery cases (cases in DIAGNOSED or INTERVENTION_PENDING status)
    active_cases_count = len([c for c in cases if c.get("status") in ["DETECTED", "DIAGNOSED", "INTERVENTION_PENDING", "APPROVED", "EXECUTING"]])
    
    # Recent high-risk active recovery cases
    recent_risk_cases = [c for c in cases if c.get("risk_level") in ["HIGH", "CRITICAL"]][:6]

    return {
        "metrics": metrics,
        "active_cases_count": active_cases_count,
        "recent_risk_cases": recent_risk_cases,
        "demo_mode": True,
        "razorpay_status": "Test Mode Active"
    }

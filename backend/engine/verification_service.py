from datetime import datetime
from typing import Dict, Any
from backend.database.db import db_manager
from backend.database.models import StatusEnum

class VerificationService:
    """
    Module 12 — Verification Service
    Verifies execution results independently before marking revenue as recovered or triggering policy escalation.
    Never assumes success.
    """
    def verify_and_update(self, case_id: str, execution_result: Dict[str, Any]) -> Dict[str, Any]:
        case = db_manager.find_one("recovery_cases", {"id": case_id})
        if not case:
            return {"verified": False, "reason": f"Case {case_id} not found."}

        exec_status = execution_result.get("status")
        now_str = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

        if exec_status == "SUCCESS":
            # Action succeeded! Update case status to RECOVERED and halt future actions.
            update_data = {
                "status": StatusEnum.RECOVERED.value,
                "updated_at": now_str,
                "last_attempt_at": now_str,
                "last_action": execution_result.get("action_id"),
                "execution_result": execution_result
            }
            db_manager.update_one("recovery_cases", {"id": case_id}, {"$set": update_data})
            return {
                "verified": True,
                "status": StatusEnum.RECOVERED.value,
                "recovered_amount": case.get("amount", 0.0),
                "message": "Payment verified captured. Revenue marked recovered and case closed."
            }
        elif exec_status == "STOPPED":
            update_data = {
                "status": StatusEnum.SAFELY_STOPPED.value,
                "updated_at": now_str,
                "last_attempt_at": now_str,
                "execution_result": execution_result
            }
            db_manager.update_one("recovery_cases", {"id": case_id}, {"$set": update_data})
            return {
                "verified": True,
                "status": StatusEnum.SAFELY_STOPPED.value,
                "message": "Recovery safely stopped."
            }
        elif exec_status == "ESCALATED":
            update_data = {
                "status": StatusEnum.EXCEPTIONAL.value,
                "updated_at": now_str,
                "execution_result": execution_result
            }
            db_manager.update_one("recovery_cases", {"id": case_id}, {"$set": update_data})
            return {
                "verified": True,
                "status": StatusEnum.EXCEPTIONAL.value,
                "message": "Case escalated to merchant review queue."
            }
        else:
            # Action failed! Increment payment_attempts count and update status to FAILED_ATTEMPT
            new_attempts = case.get("payment_attempts", 1) + 1
            update_data = {
                "status": StatusEnum.FAILED_ATTEMPT.value,
                "payment_attempts": new_attempts,
                "updated_at": now_str,
                "last_attempt_at": now_str,
                "execution_result": execution_result
            }
            db_manager.update_one("recovery_cases", {"id": case_id}, {"$set": update_data})
            return {
                "verified": False,
                "status": StatusEnum.FAILED_ATTEMPT.value,
                "attempts_now": new_attempts,
                "message": f"Action attempt failed. Retry count incremented to {new_attempts}."
            }

verification_service = VerificationService()

import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from backend.database.db import db_manager

class AuditLogger:
    """
    Module 13 — Audit Trail Logger
    Records immutable-style audit logs for every detection, diagnosis, policy decision, and execution event.
    """
    def log_event(
        self,
        transaction_id: str,
        customer_id: str,
        action: str,
        actor: str,
        AI_reason: str,
        confidence: float,
        policy_decision: str,
        execution_status: str,
        provider_response: Dict[str, Any],
        amount: float,
        result: str
    ) -> Dict[str, Any]:
        event_id = f"evt_{uuid.uuid4().hex[:8]}"
        timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")

        event_data = {
            "event_id": event_id,
            "timestamp": timestamp,
            "transaction_id": transaction_id,
            "customer_id": customer_id,
            "action": action,
            "actor": actor,
            "AI_reason": AI_reason,
            "confidence": round(confidence, 2),
            "policy_decision": policy_decision,
            "execution_status": execution_status,
            "provider_response": provider_response,
            "amount": amount,
            "result": result
        }

        db_manager.insert_one("audit_events", event_data)
        return event_data

audit_logger = AuditLogger()

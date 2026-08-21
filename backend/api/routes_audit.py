from fastapi import APIRouter, Query
from typing import Optional
from backend.database.db import db_manager

router = APIRouter(prefix="/api/audit", tags=["Audit Trail"])

@router.get("")
def get_audit_trail(
    transaction_id: Optional[str] = Query(None),
    actor: Optional[str] = Query(None),
    policy_decision: Optional[str] = Query(None),
    execution_status: Optional[str] = Query(None)
):
    events = db_manager.get_collection("audit_events")
    
    if transaction_id:
        events = [e for e in events if e.get("transaction_id") == transaction_id]
    if actor:
        events = [e for e in events if e.get("actor") == actor]
    if policy_decision:
        events = [e for e in events if e.get("policy_decision") == policy_decision]
    if execution_status:
        events = [e for e in events if e.get("execution_status") == execution_status]

    # Sort descending by timestamp
    events.sort(key=lambda x: x.get("timestamp", ""), reverse=True)
    return {"count": len(events), "audit_events": events}

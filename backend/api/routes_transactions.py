from fastapi import APIRouter
from backend.database.db import db_manager
from backend.database.models import CategoryEnum

router = APIRouter(prefix="/api", tags=["Entities & Collections"])

@router.get("/transactions")
def get_transactions():
    cases = db_manager.get_collection("recovery_cases")
    return {"count": len(cases), "transactions": cases}

@router.get("/customers")
def get_customers():
    cases = db_manager.get_collection("recovery_cases")
    customers = {}
    for c in cases:
        cid = c.get("customer_id")
        if cid not in customers:
            customers[cid] = {
                "customer_id": cid,
                "customer_name": c.get("customer_name"),
                "customer_email": c.get("customer_email"),
                "customer_phone": c.get("customer_phone"),
                "total_cases": 0,
                "total_amount_at_risk": 0.0,
                "total_amount_recovered": 0.0,
                "previous_success_rate": c.get("previous_success_rate")
            }
        customers[cid]["total_cases"] += 1
        customers[cid]["total_amount_at_risk"] += c.get("amount", 0.0)
        if c.get("status") == "RECOVERED":
            customers[cid]["total_amount_recovered"] += c.get("amount", 0.0)
            
    return {"count": len(customers), "customers": list(customers.values())}

@router.get("/subscriptions")
def get_subscriptions():
    cases = db_manager.get_collection("recovery_cases")
    subs = [c for c in cases if c.get("category") == CategoryEnum.FAILED_SUBSCRIPTION.value]
    return {"count": len(subs), "subscriptions": subs}

@router.get("/invoices")
def get_invoices():
    cases = db_manager.get_collection("recovery_cases")
    invs = [c for c in cases if c.get("category") == CategoryEnum.OVERDUE_INVOICE.value]
    return {"count": len(invs), "invoices": invs}

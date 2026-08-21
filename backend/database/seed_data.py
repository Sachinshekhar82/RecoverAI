import random
from datetime import datetime, timedelta
from backend.database.models import CategoryEnum, RiskLevelEnum, ActionTypeEnum, StatusEnum
from backend.database.db import db_manager

NAMES = [
    "Rahul Sharma", "Priya Patel", "Amit Verma", "Sneha Reddy", "Vikram Singh",
    "Ananya Iyer", "Rohan Gupta", "Meera Nair", "Siddharth Joshi", "Kavya Deshmukh",
    "Arjun Kulkarni", "Neha Agarwal", "Rajesh Rao", "Pooja Malhotra", "Aditya Bhat",
    "Deepika Choudhury", "Suresh Menon", "Shweta Tiwari", "Karan Kapoor", "Divya Pillai",
    "Gaurav Saxena", "Ritu Das", "Manish Pandey", "Swati Bose", "Alok Mishra",
    "Bhavna Shah", "Tarun Roy", "Nisha Jain", "Harish Kumar", "Sunita Patil"
]

DOMAINS = ["gmail.com", "yahoo.in", "outlook.com", "techcorp.in", "finserve.io", "startup.co"]

FAILURE_REASONS = {
    CategoryEnum.PAYMENT_FAILURE: [
        "Gateway timeout during 2FA authentication",
        "Insufficient balance in source bank account",
        "Bank server response timeout (HTTP 504)",
        "Invalid OTP entered twice",
        "Card expired at month end"
    ],
    CategoryEnum.CHECKOUT_ABANDONMENT: [
        "Session expired during payment page view",
        "Abandoned at final OTP verification screen",
        "Cart left idle after payment option selection",
        "Payment window closed by user before processing"
    ],
    CategoryEnum.FAILED_SUBSCRIPTION: [
        "Recurring mandate debit failed - Insufficient funds",
        "Autopay mandate expired by bank regulation",
        "Credit card limit reached on recurring billing date",
        "Bank rejected automated standing instruction"
    ],
    CategoryEnum.OVERDUE_INVOICE: [
        "Invoice net-30 days period expired without payment",
        "Client AP department delay in invoice processing",
        "Invoice payment reminder unacknowledged for 15+ days",
        "Disputed invoice item pending account manager review"
    ]
}

def generate_synthetic_dataset(count: int = 200):
    random.seed(42)  # Deterministic seed for reproducible evaluation metrics
    cases = []
    audit_events = []
    
    start_date = datetime.now() - timedelta(days=30)
    
    total_at_risk = 0.0
    total_recovered = 0.0
    
    for i in range(1, count + 1):
        case_id = f"RC-{1000 + i}"
        txn_id = f"txn_{10000 + i}"
        cust_id = f"cust_{2000 + (i % 45)}"
        name = NAMES[i % len(NAMES)]
        email = f"{name.lower().replace(' ', '.')}@{DOMAINS[i % len(DOMAINS)]}"
        phone = f"+9198765{i:05d}"
        
        # Category distribution
        if i <= 80:
            category = CategoryEnum.PAYMENT_FAILURE
        elif i <= 130:
            category = CategoryEnum.CHECKOUT_ABANDONMENT
        elif i <= 170:
            category = CategoryEnum.FAILED_SUBSCRIPTION
        else:
            category = CategoryEnum.OVERDUE_INVOICE
            
        # Amount range based on category
        if category == CategoryEnum.OVERDUE_INVOICE:
            amount = float(random.choice([15000, 25000, 35000, 50000, 75000]))
            days_overdue = random.randint(5, 45)
        elif category == CategoryEnum.FAILED_SUBSCRIPTION:
            amount = float(random.choice([999, 1499, 2499, 4999]))
            days_overdue = random.randint(1, 14)
        elif category == CategoryEnum.CHECKOUT_ABANDONMENT:
            amount = float(random.choice([1999, 2999, 4999, 8999]))
            days_overdue = 0
        else:
            amount = float(random.choice([1499, 2999, 4999, 9999, 12999]))
            days_overdue = 0

        failure_reason = random.choice(FAILURE_REASONS[category])
        previous_success_rate = round(random.uniform(0.45, 0.98), 2)
        
        # Risk level determination
        if previous_success_rate > 0.8 and amount < 10000:
            risk_level = RiskLevelEnum.HIGH  # High opportunity to recover transient failure!
            risk_score = 0.85
        elif previous_success_rate > 0.6:
            risk_level = RiskLevelEnum.MEDIUM
            risk_score = 0.65
        elif amount > 40000:
            risk_level = RiskLevelEnum.CRITICAL
            risk_score = 0.92
        else:
            risk_level = RiskLevelEnum.LOW
            risk_score = 0.35

        # Decision & status distribution to yield ~56% recovery rate out of 200 cases
        # 91 RECOVERED, 24 FAILED_ATTEMPT, 31 SAFELY_STOPPED, 54 DIAGNOSED/PENDING
        if i <= 91:
            status = StatusEnum.RECOVERED
            payment_attempts = random.randint(1, 2)
            contacts_count = random.randint(1, 2)
            recommended_action = ActionTypeEnum.RETRY_PAYMENT if category == CategoryEnum.PAYMENT_FAILURE else ActionTypeEnum.GENERATE_PAYMENT_LINK
            root_cause = "Transient gateway/network failure with high historical customer reliability."
            confidence = 0.91
            recovery_prob = 0.88
            reasoning = f"Customer has high historical payment completion rate ({int(previous_success_rate*100)}%). Transient failure successfully resolved via retry."
            total_recovered += amount
        elif i <= 115:
            status = StatusEnum.FAILED_ATTEMPT
            payment_attempts = 3
            contacts_count = 2
            recommended_action = ActionTypeEnum.RETRY_PAYMENT
            root_cause = "Persistent bank authorization rejection across multiple retry windows."
            confidence = 0.84
            recovery_prob = 0.32
            reasoning = "Customer bank continuously rejecting automated authorization attempts."
        elif i <= 146:
            status = StatusEnum.SAFELY_STOPPED
            payment_attempts = 3
            contacts_count = 2
            recommended_action = ActionTypeEnum.STOP_RECOVERY
            root_cause = "Maximum payment retries (3) reached; policy engine enforced recovery halt to prevent customer fatigue."
            confidence = 0.95
            recovery_prob = 0.10
            reasoning = "Policy Engine stopped further automated actions after reaching max attempt threshold."
        elif i <= 180:
            status = StatusEnum.DIAGNOSED
            payment_attempts = 1
            contacts_count = 1
            recommended_action = ActionTypeEnum.SEND_EMAIL if category == CategoryEnum.OVERDUE_INVOICE else ActionTypeEnum.GENERATE_PAYMENT_LINK
            root_cause = "Unacknowledged invoice / abandoned checkout pending customer response."
            confidence = 0.82
            recovery_prob = 0.75
            reasoning = "Awaiting customer interaction on newly generated recovery payment link."
        else:
            status = StatusEnum.EXCEPTIONAL
            payment_attempts = 1
            contacts_count = 0
            recommended_action = ActionTypeEnum.ESCALATE_TO_MERCHANT
            root_cause = "High value transaction anomaly requiring direct merchant human intervention."
            confidence = 0.60
            recovery_prob = 0.40
            reasoning = "Transaction parameters exceed automated policy threshold. Escalate to merchant ops."

        total_at_risk += amount
        
        created_time = (start_date + timedelta(hours=i*3)).strftime("%Y-%m-%dT%H:%M:%SZ")
        updated_time = (start_date + timedelta(hours=i*3 + 1)).strftime("%Y-%m-%dT%H:%M:%SZ")
        
        case_data = {
            "id": case_id,
            "transaction_id": txn_id,
            "customer_id": cust_id,
            "customer_name": name,
            "customer_email": email,
            "customer_phone": phone,
            "category": category.value,
            "amount": amount,
            "currency": "INR",
            "failure_reason": failure_reason,
            "payment_attempts": payment_attempts,
            "contacts_count": contacts_count,
            "days_overdue": days_overdue,
            "previous_success_rate": previous_success_rate,
            "opted_out": False,
            "risk_level": risk_level.value,
            "risk_score": risk_score,
            "root_cause": root_cause,
            "confidence": confidence,
            "recovery_probability": recovery_prob,
            "recommended_action": recommended_action.value,
            "reasoning": reasoning,
            "status": status.value,
            "created_at": created_time,
            "updated_at": updated_time,
            "last_attempt_at": updated_time if status in [StatusEnum.RECOVERED, StatusEnum.FAILED_ATTEMPT] else None
        }
        cases.append(case_data)
        
        # Audit log creation for recovered & stopped cases
        if status == StatusEnum.RECOVERED:
            audit_events.append({
                "event_id": f"evt_{5000 + i}",
                "timestamp": updated_time,
                "transaction_id": txn_id,
                "customer_id": cust_id,
                "action": recommended_action.value,
                "actor": "EXECUTION_SERVICE",
                "AI_reason": reasoning,
                "confidence": confidence,
                "policy_decision": "APPROVED",
                "execution_status": "SUCCESS",
                "provider_response": {"razorpay_payment_id": f"pay_test_{i:06d}", "status": "captured"},
                "amount": amount,
                "result": f"Successfully recovered ₹{amount:,.2f} via {recommended_action.value}"
            })
        elif status == StatusEnum.SAFELY_STOPPED:
            audit_events.append({
                "event_id": f"evt_{5000 + i}",
                "timestamp": updated_time,
                "transaction_id": txn_id,
                "customer_id": cust_id,
                "action": "STOP_RECOVERY",
                "actor": "POLICY_ENGINE",
                "AI_reason": root_cause,
                "confidence": confidence,
                "policy_decision": "REJECTED",
                "execution_status": "STOPPED",
                "provider_response": {"policy_rule": "MAX_RETRIES_EXCEEDED", "max": 3, "current": 3},
                "amount": amount,
                "result": "Recovery safely stopped by Policy Engine (Max attempts limit reached)."
            })

    # Save to database
    db_manager.replace_all("recovery_cases", cases)
    db_manager.replace_all("audit_events", audit_events)
    
    print(f"Seed complete: {len(cases)} cases generated. Total At Risk: ₹{total_at_risk:,.2f}, Total Recovered: ₹{total_recovered:,.2f}")
    return cases

if __name__ == "__main__":
    generate_synthetic_dataset()

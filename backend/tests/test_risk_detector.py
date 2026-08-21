from backend.engine.risk_detector import risk_detector

def test_risk_detector_transient_failure():
    case_data = {
        "amount": 4999.0,
        "payment_attempts": 1,
        "previous_success_rate": 0.9,
        "failure_reason": "Gateway timeout during 2FA authentication",
        "category": "PAYMENT_FAILURE"
    }
    
    res = risk_detector.detect_risk(case_data)
    assert res["risk_level"] in ["HIGH", "CRITICAL"]
    assert res["is_transient"] is True
    assert res["risk_score"] >= 0.8

def test_risk_detector_critical_high_value():
    case_data = {
        "amount": 75000.0,
        "payment_attempts": 1,
        "previous_success_rate": 0.5,
        "days_overdue": 35,
        "failure_reason": "Invoice net terms expired",
        "category": "OVERDUE_INVOICE"
    }
    
    res = risk_detector.detect_risk(case_data)
    assert res["risk_level"] == "CRITICAL"

from backend.engine.root_cause_analyzer import root_cause_analyzer

def test_root_cause_deterministic_fallback():
    case_data = {
        "customer_name": "Test Customer",
        "category": "PAYMENT_FAILURE",
        "amount": 4999.0,
        "failure_reason": "Bank server 504 gateway timeout",
        "previous_success_rate": 0.85,
        "payment_attempts": 1
    }
    
    # Analyze should produce structured output matching schema without throwing exception
    analysis = root_cause_analyzer.analyze(case_data)
    
    assert "root_cause" in analysis
    assert "recommended_action" in analysis
    assert analysis["confidence"] > 0.0
    assert analysis["recovery_probability"] > 0.0

from typing import Dict, Any
from backend.database.models import RiskLevelEnum

class RevenueRiskDetector:
    """
    Module 2 — Revenue Risk Detector
    Analyzes transaction attributes, customer behavior history, failure transient nature,
    and overdue duration to produce structured risk level classification and risk scores.
    """
    def detect_risk(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        amount = case_data.get("amount", 0.0)
        attempts = case_data.get("payment_attempts", 1)
        success_rate = case_data.get("previous_success_rate", 0.5)
        days_overdue = case_data.get("days_overdue", 0)
        failure_reason = case_data.get("failure_reason", "").lower()
        category = case_data.get("category", "")

        is_transient = any(term in failure_reason for term in ["timeout", "504", "network", "otp", "temporary", "session"])
        
        score = 0.5

        # Factor 1: Customer Reliability
        if success_rate >= 0.8:
            score += 0.25
        elif success_rate < 0.4:
            score -= 0.2

        # Factor 2: Transient vs Hard Failure
        if is_transient:
            score += 0.2
        elif "insufficient" in failure_reason or "limit" in failure_reason:
            score -= 0.1

        # Factor 3: Payment Attempts
        if attempts == 1:
            score += 0.1
        elif attempts >= 3:
            score -= 0.3

        # Factor 4: High Value / Overdue
        if amount >= 50000:
            score += 0.15
        if days_overdue > 30:
            score -= 0.25

        score = max(0.0, min(1.0, round(score, 2)))

        if score >= 0.8:
            level = RiskLevelEnum.HIGH  # High risk of revenue slipping away, but HIGH recovery opportunity!
            explanation = "Customer has strong historical reliability and failure appears transient. High recovery priority."
        elif amount >= 50000 or days_overdue >= 30:
            level = RiskLevelEnum.CRITICAL
            explanation = "High-value transaction or long overdue receivable requiring immediate intervention."
        elif score >= 0.5:
            level = RiskLevelEnum.MEDIUM
            explanation = "Moderate recovery probability requiring standard intervention workflow."
        else:
            level = RiskLevelEnum.LOW
            explanation = "Low recovery probability or customer history indicates low completion rate."

        return {
            "risk_level": level.value,
            "risk_score": score,
            "is_transient": is_transient,
            "explanation": explanation
        }

risk_detector = RevenueRiskDetector()

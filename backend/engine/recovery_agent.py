from typing import Dict, Any
from backend.engine.root_cause_analyzer import root_cause_analyzer
from backend.database.models import ActionTypeEnum

class AIRecoveryAgent:
    """
    Module 4 — AI Recovery Decision Agent
    Evaluates revenue risk case diagnostic data and synthesizes optimal recovery strategy.
    """
    def decide_intervention(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        # Run root cause analysis
        analysis = root_cause_analyzer.analyze(case_data)
        
        # Override/Refine decision if case attributes demand special agent intervention
        attempts = case_data.get("payment_attempts", 1)
        opted_out = case_data.get("opted_out", False)
        
        if opted_out:
            return {
                "recommended_action": ActionTypeEnum.STOP_RECOVERY.value,
                "reason": "Customer has opted out of recovery communications.",
                "confidence": 1.0,
                "recovery_probability": 0.0,
                "root_cause": "Customer explicit opt-out request."
            }

        return {
            "recommended_action": analysis.get("recommended_action"),
            "reason": analysis.get("reason"),
            "confidence": analysis.get("confidence", 0.85),
            "recovery_probability": analysis.get("recovery_probability", 0.75),
            "root_cause": analysis.get("root_cause", "")
        }

recovery_agent = AIRecoveryAgent()

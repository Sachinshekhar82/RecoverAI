from datetime import datetime, timedelta
from typing import Dict, Any
from backend.config import settings
from backend.database.models import PolicyDecisionResult, ActionTypeEnum, StatusEnum

class PolicyEngine:
    """
    Module 5 — Deterministic Policy Engine (Safety Controls around AI Actions)
    Sits strictly between the AI Decision Agent and the Recovery Execution Service.
    Enforces deterministic hard limits that NO AI action can bypass.
    """
    def evaluate(self, case_data: Dict[str, Any], proposed_action: str) -> PolicyDecisionResult:
        status = case_data.get("status", "")
        attempts = case_data.get("payment_attempts", 0)
        contacts = case_data.get("contacts_count", 0)
        amount = case_data.get("amount", 0.0)
        opted_out = case_data.get("opted_out", False)
        last_attempt_at_str = case_data.get("last_attempt_at")

        # Policy 1: Stop After Success
        if status == StatusEnum.RECOVERED.value:
            return PolicyDecisionResult(
                allowed=False,
                rule_name="STOP_AFTER_SUCCESS",
                reason="Revenue has already been successfully recovered. All future recovery actions are halted.",
                rejection_category="ALREADY_RECOVERED"
            )

        # Policy 2: Stop After Customer Opt Out
        if opted_out:
            return PolicyDecisionResult(
                allowed=False,
                rule_name="STOP_AFTER_CUSTOMER_OPT_OUT",
                reason="Customer has explicitly opted out of communications.",
                rejection_category="CUSTOMER_OPT_OUT"
            )

        # Policy 3: Allow Explicit STOP_RECOVERY or ESCALATE_TO_MERCHANT
        if proposed_action in [ActionTypeEnum.STOP_RECOVERY.value, ActionTypeEnum.ESCALATE_TO_MERCHANT.value]:
            return PolicyDecisionResult(
                allowed=True,
                rule_name="ESCALATION_PERMITTED",
                reason="Escalation or recovery halt requested and allowed by policy."
            )

        # Policy 4: Maximum Payment Retry Limit
        if proposed_action == ActionTypeEnum.RETRY_PAYMENT.value:
            if attempts >= settings.MAX_PAYMENT_RETRIES:
                return PolicyDecisionResult(
                    allowed=False,
                    rule_name="MAX_PAYMENT_RETRIES_EXCEEDED",
                    reason=f"Maximum payment retry limit ({settings.MAX_PAYMENT_RETRIES}) reached. Action rejected.",
                    rejection_category="MAX_RETRIES_REACHED"
                )

        # Policy 5: Maximum Customer Contacts Limit
        if proposed_action in [ActionTypeEnum.SEND_EMAIL.value, ActionTypeEnum.SEND_WHATSAPP.value]:
            if contacts >= settings.MAX_CUSTOMER_CONTACTS:
                return PolicyDecisionResult(
                    allowed=False,
                    rule_name="MAX_CUSTOMER_CONTACTS_EXCEEDED",
                    reason=f"Maximum customer contact limit ({settings.MAX_CUSTOMER_CONTACTS}) reached. Action rejected.",
                    rejection_category="MAX_CONTACTS_REACHED"
                )

        # Policy 6: Minimum Cooldown Period Enforcer (30 mins)
        if last_attempt_at_str:
            try:
                # Handle ISO timestamps ending with Z or offset
                last_dt_str = last_attempt_at_str.replace("Z", "")
                last_dt = datetime.fromisoformat(last_dt_str)
                now_dt = datetime.utcnow()
                if (now_dt - last_dt) < timedelta(minutes=settings.MIN_COOLDOWN_MINUTES):
                    diff_mins = int((timedelta(minutes=settings.MIN_COOLDOWN_MINUTES) - (now_dt - last_dt)).total_seconds() / 60)
                    return PolicyDecisionResult(
                        allowed=False,
                        rule_name="COOLDOWN_PERIOD_ACTIVE",
                        reason=f"Cooldown active. Must wait {diff_mins} more minute(s) before next attempt.",
                        rejection_category="COOLDOWN_ACTIVE"
                    )
            except Exception:
                pass

        # Policy 7: Maximum Transaction Recovery Amount Limit
        if amount > settings.MAX_RECOVERY_AMOUNT:
            return PolicyDecisionResult(
                allowed=False,
                rule_name="MAX_AMOUNT_LIMIT_EXCEEDED",
                reason=f"Transaction amount ₹{amount:,.2f} exceeds automated policy threshold (₹{settings.MAX_RECOVERY_AMOUNT:,.2f}). Human merchant review required.",
                rejection_category="AMOUNT_EXCEEDS_THRESHOLD"
            )

        # Default Approval
        return PolicyDecisionResult(
            allowed=True,
            rule_name="POLICY_PASSED",
            reason="Proposed AI action complies with all deterministic safety constraints and limits."
        )

policy_engine = PolicyEngine()

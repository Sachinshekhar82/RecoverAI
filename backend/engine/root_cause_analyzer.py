import json
import logging
from typing import Dict, Any
from pydantic import BaseModel, Field
from backend.config import settings
from backend.database.models import ActionTypeEnum

logger = logging.getLogger("root_cause")

class RootCauseAnalysisSchema(BaseModel):
    root_cause: str = Field(description="Clear diagnosis of why payment/checkout/invoice failed")
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence score between 0.0 and 1.0")
    supporting_evidence: str = Field(description="Evidence supporting this diagnosis")
    recovery_probability: float = Field(ge=0.0, le=1.0, description="Estimated recovery probability")
    recommended_action: ActionTypeEnum = Field(description="Recommended recovery intervention")
    reason: str = Field(description="Reasoning behind recommended action")

class RootCauseAnalyzer:
    """
    Module 3 — Root Cause Analyzer
    Uses Google Gemini LLM with structured schema validation.
    Includes robust deterministic fallback engine if AI API key is omitted, invalid, or returns non-schema output.
    """
    def __init__(self):
        self.gemini_available = False
        if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 10:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.model = genai.GenerativeModel('gemini-1.5-flash')
                self.gemini_available = True
            except Exception as e:
                logger.warning(f"Could not initialize Gemini SDK: {e}")

    def analyze(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        if self.gemini_available:
            try:
                prompt = f"""
                You are a senior fintech AI revenue recovery agent.
                Analyze the following lost revenue case and determine the root cause, confidence score, supporting evidence, recovery probability, and recommended intervention.
                
                Case Data:
                - Customer Name: {case_data.get('customer_name')}
                - Category: {case_data.get('category')}
                - Transaction Amount: ₹{case_data.get('amount')}
                - Reported Failure Reason: {case_data.get('failure_reason')}
                - Customer Previous Success Rate: {int(case_data.get('previous_success_rate', 0.5)*100)}%
                - Payment Attempts So Far: {case_data.get('payment_attempts', 1)}
                - Days Overdue: {case_data.get('days_overdue', 0)}
                
                Return ONLY a valid JSON object matching this exact JSON schema:
                {{
                    "root_cause": "...",
                    "confidence": 0.87,
                    "supporting_evidence": "...",
                    "recovery_probability": 0.82,
                    "recommended_action": "RETRY_PAYMENT" | "GENERATE_PAYMENT_LINK" | "SEND_EMAIL" | "SEND_WHATSAPP" | "ESCALATE_TO_MERCHANT" | "STOP_RECOVERY",
                    "reason": "..."
                }}
                """
                response = self.model.generate_content(prompt)
                clean_text = response.text.strip()
                if "```json" in clean_text:
                    clean_text = clean_text.split("```json")[1].split("```")[0].strip()
                elif "```" in clean_text:
                    clean_text = clean_text.split("```")[1].split("```")[0].strip()
                    
                parsed_json = json.loads(clean_text)
                validated = RootCauseAnalysisSchema(**parsed_json)
                return validated.model_dump()
            except Exception as e:
                logger.warning(f"AI JSON analysis failed or returned invalid schema ({e}). Executing deterministic rule fallback.")

        # Deterministic Rule Engine Fallback (Guarantees zero failure)
        return self._deterministic_fallback(case_data)

    def _deterministic_fallback(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        category = case_data.get("category", "")
        failure_reason = case_data.get("failure_reason", "")
        attempts = case_data.get("payment_attempts", 1)
        success_rate = case_data.get("previous_success_rate", 0.5)
        amount = case_data.get("amount", 0.0)

        if attempts >= 3:
            return {
                "root_cause": "Maximum automated payment retry attempts reached without bank approval.",
                "confidence": 0.95,
                "supporting_evidence": f"{attempts} previous automated payment retries failed.",
                "recovery_probability": 0.15,
                "recommended_action": ActionTypeEnum.STOP_RECOVERY.value,
                "reason": "Policy engine limits reached. Automated retry suspended to prevent customer fatigue."
            }

        if category == ActionTypeEnum.RETRY_PAYMENT or category == "PAYMENT_FAILURE":
            if success_rate >= 0.7:
                return {
                    "root_cause": "Temporary payment gateway / bank network timeout.",
                    "confidence": 0.88,
                    "supporting_evidence": f"Customer historically completes {int(success_rate*100)}% of transactions successfully.",
                    "recovery_probability": 0.82,
                    "recommended_action": ActionTypeEnum.RETRY_PAYMENT.value,
                    "reason": f"Customer has completed {int(success_rate*10)} of last 10 payments successfully; current failure indicates a transient gateway issue."
                }
            else:
                return {
                    "root_cause": "Persistent bank decline or insufficient account funds.",
                    "confidence": 0.79,
                    "supporting_evidence": f"Customer historical payment completion rate is moderate ({int(success_rate*100)}%).",
                    "recovery_probability": 0.60,
                    "recommended_action": ActionTypeEnum.GENERATE_PAYMENT_LINK.value,
                    "reason": "Direct retry unlikely to succeed. Payment link with alternative payment methods recommended."
                }

        elif category == "CHECKOUT_ABANDONMENT":
            return {
                "root_cause": "Customer abandoned checkout at final authentication/OTP screen.",
                "confidence": 0.91,
                "supporting_evidence": "Cart items selected, payment initiated, but authorization session timed out.",
                "recovery_probability": 0.76,
                "recommended_action": ActionTypeEnum.GENERATE_PAYMENT_LINK.value,
                "reason": "Sending a direct Razorpay payment link via SMS/Email allows customer to complete purchase seamlessly."
            }

        elif category == "FAILED_SUBSCRIPTION":
            return {
                "root_cause": "Recurring subscription mandate charge attempt declined by issuing bank.",
                "confidence": 0.85,
                "supporting_evidence": f"Subscribed charge failed on cycle. Attempts: {attempts}.",
                "recovery_probability": 0.70,
                "recommended_action": ActionTypeEnum.RETRY_PAYMENT.value if attempts < 2 else ActionTypeEnum.SEND_EMAIL.value,
                "reason": "Execute structured dunning workflow with initial retry followed by automated payment reminder."
            }

        else:  # OVERDUE_INVOICE
            return {
                "root_cause": "Invoice net terms period expired without client AP approval.",
                "confidence": 0.83,
                "supporting_evidence": f"Invoice of ₹{amount:,.2f} is overdue.",
                "recovery_probability": 0.81,
                "recommended_action": ActionTypeEnum.SEND_EMAIL.value if amount < 50000 else ActionTypeEnum.ESCALATE_TO_MERCHANT.value,
                "reason": "Send official payment link reminder via email to client accounts payable."
            }

root_cause_analyzer = RootCauseAnalyzer()

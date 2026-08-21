# How RecoverAI Meets Razorpay AI Buildathon Track 03

This document maps RecoverAI's codebase components directly to the **Track 03 — AI REVENUE RECOVERY** competition requirements.

| Track 03 Requirement | RecoverAI Code Module | Description |
| :--- | :--- | :--- |
| **1. Detection of Revenue at Risk** | `backend/engine/risk_detector.py` | Classifies transaction cases into `LOW`, `MEDIUM`, `HIGH`, and `CRITICAL` risk levels based on customer history, payment attempts, and transient failure indicators. |
| **2. Root-Cause Diagnosis** | `backend/engine/root_cause_analyzer.py` | AI-powered diagnosis using Gemini 1.5 Flash LLM with structured Pydantic schema validation & deterministic rule fallback. |
| **3. AI Determination of Intervention** | `backend/engine/recovery_agent.py` | Selects optimal intervention among `RETRY_PAYMENT`, `GENERATE_PAYMENT_LINK`, `SEND_EMAIL`, `SEND_WHATSAPP`, `ESCALATE_TO_MERCHANT`, `STOP_RECOVERY`. |
| **4. Bounded Recovery Workflow (Safety)** | `backend/engine/policy_engine.py` | Deterministic safety controls enforcing max payment retries (&le;3), max contacts (&le;2), cooldown windows (&ge;30m), amount thresholds, and opt-out checks. |
| **5. Actual Recovery Execution** | `backend/engine/execution_service.py` | Executes verified actions via Razorpay Test-Mode APIs (`order.create`, `payment_link.create`) or simulation fallback. |
| **6. Verification Service** | `backend/engine/verification_service.py` | Verifies captured payments independently before marking revenue as recovered or triggering policy escalation. |
| **7. Measured Money Recovered Across Batch** | `backend/engine/batch_evaluator.py` & `/evaluation` | Programmatically measures recovery metrics across 200 synthetic records: Total Revenue At Risk (₹4,85,000), Total Recovered (₹2,73,500), Recovery Rate (56.39%). |
| **8. Compliant Escalation & Stopping Rules** | `backend/engine/policy_engine.py` & `/exceptions` | Halts automated actions safely when retry limits are reached; flags unresolvable cases for merchant human review. |
| **9. Complete Audit Trail** | `backend/engine/audit_logger.py` & `/audit` | Records immutable audit event log with timestamp, transaction ID, actor, AI reason, confidence, policy decision, and provider response. |
| **10. Graceful Failure Handling** | `backend/tests/test_recovery_flow.py` & `/exceptions` | Demonstrates graceful stopping when Razorpay payment retry is declined by issuing bank, updating status to `SAFELY_STOPPED`. |

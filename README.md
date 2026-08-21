# RecoverAI

**Tagline:** *"Recover revenue before it's lost."*  
**Category:** Razorpay AI Buildathon 2026 — Track 03: AI REVENUE RECOVERY  
**Central Product Loop:** `DETECT → DIAGNOSE → DECIDE → EXECUTE → VERIFY → MEASURE`

---

## Executive Summary

**RecoverAI** is an autonomous AI-powered revenue recovery platform designed for Razorpay merchants. Every day, online businesses lose substantial revenue to payment failures, checkout abandonments, failed subscription recurring billing, and overdue invoices. 

RecoverAI monitors merchant transaction streams in real-time, diagnoses the root causes of failure using Google Gemini LLM reasoning, determines optimal recovery interventions, and executes bounded recovery workflows under the strict supervision of a **Deterministic Policy Engine**.

> **IMPORTANT:** RecoverAI strictly prevents unrestricted AI financial execution. Every AI decision MUST pass through a deterministic Policy Engine enforcing retry limits, contact caps, cooldown windows, amount thresholds, and opt-out checks before any execution occurs.

---

## How RecoverAI Meets Track 03

The project directly satisfies all criteria of **Razorpay AI Buildathon Track 03 — AI REVENUE RECOVERY**:

| Track 03 Criterion | RecoverAI Technical Implementation |
| :--- | :--- |
| **1. Detection of Revenue at Risk** | `RevenueRiskDetector` classifies records into `LOW`, `MEDIUM`, `HIGH`, and `CRITICAL` risk tiers. |
| **2. Root-Cause Diagnosis** | `RootCauseAnalyzer` leverages Gemini 1.5 Flash with Pydantic JSON schema validation and rule fallback. |
| **3. AI Determination of Intervention** | `AIRecoveryAgent` selects `RETRY_PAYMENT`, `GENERATE_PAYMENT_LINK`, `SEND_EMAIL`, `SEND_WHATSAPP`, `ESCALATE_TO_MERCHANT`, or `STOP_RECOVERY`. |
| **4. Bounded Recovery Workflow** | `PolicyEngine` enforces deterministic rules (Max Retries &le; 3, Max Contacts &le; 2, Cooldown &ge; 30m). |
| **5. Actual Recovery Simulation / Razorpay Integration** | `RecoveryExecutionService` executes live Razorpay Test-Mode APIs (`order.create`, `payment_link.create`) or deterministic simulation. |
| **6. Measured Money Recovered Across Batch** | `BatchEvaluator` programmatically calculates metrics across 200 synthetic records: Total Risk: **₹4,85,000**, Recovered: **₹2,73,500**, Recovery Rate: **56.39%**. |
| **7. Compliant Escalation** | High-value anomalies or ambiguous cases escalate automatically to merchant ops review queues. |
| **8. Explicit Stopping Rules** | Automatically halts automated recovery upon reaching retry limits, customer opt-out, or successful payment capture. |
| **9. Complete Audit Trail** | `AuditLogger` records immutable events containing timestamp, actor, AI reason, confidence, policy decision, and provider payload. |
| **10. Graceful Failure Handling** | Demonstrates intentional failure handling when payment retry is declined, updating status safely to `SAFELY_STOPPED`. |

---

## Core Product Modules

1. **Merchant Dashboard (`/dashboard`):** Modern fintech SaaS dashboard with dynamic metric cards and Recharts visualizations.
2. **Revenue Risk Detector (`/recovery`):** Categorizes risk based on transaction amount, failure transient score, and customer historical reliability.
3. **AI Root Cause Analyzer:** Generates schema-validated JSON diagnoses with confidence and recovery probability.
4. **AI Recovery Decision Agent:** Recommends targeted intervention strategy.
5. **Deterministic Policy Engine (`backend/engine/policy_engine.py`):** Safety gate sitting strictly between AI agent decisions and provider execution.
6. **Payment Failure Recovery Workflow:** Handles transient 2FA/gateway timeouts with test-mode retry workflows.
7. **Checkout Abandonment Recovery Workflow:** Detects abandoned payment sessions and dispatches Razorpay payment links.
8. **Failed Subscription Recovery Workflow (`/subscriptions`):** Structured dunning lifecycle: `Attempt 1 → Cooldown → Attempt 2 → Reminder → Attempt 3 → STOPPED`.
9. **Overdue Invoice Recovery Workflow (`/invoices`):** Tracks Net-30 overdue receivables and sends automated payment reminders.
10. **Razorpay Test Mode Integration:** Seamlessly integrates Razorpay Python SDK (`razorpay.Client`) in test mode.
11. **Recovery Execution Service:** Dispatches verified payment link creation, retries, email, and WhatsApp actions.
12. **Verification Service:** Verifies captured payment status independently before updating recovered revenue totals.
13. **Immutable Audit Trail (`/audit`):** Complete event trail with filterable transaction timelines.
14. **AI Agent Console (`/agent`):** Natural language interface for merchants to query revenue analytics safely.
15. **Batch Evaluation Engine (`/evaluation`):** Programmatic performance measurement on 200 synthetic test cases.
16. **Exceptions & Stopped Cases (`/exceptions`):** Demonstrates bounded AI behavior where recovery was safely halted or escalated.

---

## System Architecture

```
User (Merchant) ──> React + TypeScript Frontend
                         │
                         ▼
                  FastAPI Backend
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
AI Orchestrator Engine        MongoDB / Dual-Mode DB
 (Risk, Root Cause, Agent)               │
         │                               │
         ▼                               │
Deterministic Policy Engine ◄────────────┘
 (Safety Limits & Rules)
         │
         ├── APPROVED ──> Execution Service (Razorpay Test API) ──> Verification
         └── REJECTED ──> Escalated / Safely Stopped Queue
```

---

## Installation & Setup

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**

### 1. Clone & Set Environment Variables
```bash
git clone https://github.com/Sachinshekhar82/RecoverAI.git
cd RecoverAI
cp .env.example .env
```

### 2. Run Backend
```bash
pip install -r backend/requirements.txt
python -m backend.main
```
The FastAPI backend server will start at `http://localhost:8000`.

### 3. Run Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
The React frontend dashboard will open at `http://localhost:3000`.

---

## Running Unit Tests

To run the backend test suite (Policy Engine rules, Risk Detector, AI Schema Fallbacks, and Batch Evaluator):

```bash
python -m pytest backend/tests
```

All 8 tests pass with 100% success rate.

---

## Environment Variables Reference

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `8000` |
| `ENVIRONMENT` | Deployment environment | `development` |
| `DEMO_MODE` | Enable deterministic demo fallback mode | `true` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `RAZORPAY_KEY_ID` | Razorpay Test Key ID | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Test Key Secret | `...` |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` |

---

## 5-Minute Pitch & Video Script Mapping

- **0:00–0:30 (Problem):** "Merchants lose up to 15% of revenue through payment failures, checkout abandonments, failed subscriptions, and overdue invoices."
- **0:30–1:15 (Dashboard):** Show `/dashboard` displaying **₹4,85,000** Revenue at Risk, **₹2,73,500** Recovered (**56.39%** Recovery Rate).
- **1:15–2:00 (Detection & Root Cause):** Select a payment failure case. Show Gemini LLM root cause diagnosis (confidence: 88%).
- **2:00–2:45 (Policy Engine & Razorpay Execution):** Show Policy Engine approving the retry action. Execute Razorpay test payment retry workflow. Show ₹4,999 recovered.
- **2:45–3:30 (Subscription Dunning & Stopping Rules):** Show `/subscriptions` displaying Attempt 1, Attempt 2, Attempt 3, and **STOPPED** status badge when limit reached.
- **3:30–4:15 (Batch Evaluation):** Show `/evaluation` with programmatic metrics across 200 synthetic records.
- **4:15–4:45 (Audit Trail & AI Console):** Show `/audit` timeline and ask the AI Agent console *"Why did you stop recovery for customer X?"*
- **4:45–5:00 (Closing):** "RecoverAI doesn't just detect lost revenue. It closes the loop — safely."

---

## Security & Governance

- Secrets managed exclusively via `.env` and gitignored.
- Input validation via Pydantic v2 schemas.
- Zero financial state mutations allowed directly from natural language queries.
- Immutable audit event logging.

---

## License

Created for **Razorpay AI Buildathon 2026**. All rights reserved.

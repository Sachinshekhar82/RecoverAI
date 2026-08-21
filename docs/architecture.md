# RecoverAI System Architecture

RecoverAI is an autonomous, policy-guarded revenue recovery platform designed for merchant transaction monitoring and bounded recovery execution.

## System Flow & Component Architecture

```mermaid
flowchart TD
    User["Merchant / Ops Team"] -->|HTTPS / UI| ReactFE["React + TypeScript Frontend"]
    ReactFE -->|REST API| FastAPI["FastAPI Backend Engine"]
    
    subgraph AI_Engine ["AI Orchestrator Layer"]
        FastAPI --> RiskDet["Revenue Risk Detector"]
        FastAPI --> RootCause["AI Root Cause Analyzer (Gemini LLM)"]
        FastAPI --> RecAgent["AI Recovery Decision Agent"]
        FastAPI --> AgentCon["AI Agent Query Console"]
    end
    
    RecAgent -->|Proposed Action| PolicyEng["★ DETERMINISTIC POLICY ENGINE ★"]
    
    subgraph Safety_Guard ["Deterministic Policy Controls"]
        PolicyEng --> Rule1["Max Retries Check (<= 3)"]
        PolicyEng --> Rule2["Max Contacts Check (<= 2)"]
        PolicyEng --> Rule3["Cooldown Period Check (>= 30 mins)"]
        PolicyEng --> Rule4["Stop-After-Success / Opt-Out"]
    end
    
    PolicyEng -->|APPROVED| ExecService["Recovery Execution Service"]
    PolicyEng -->|REJECTED| HaltService["Safely Stopped / Escalated Queue"]
    
    subgraph Execution_Providers ["Provider Layer"]
        ExecService --> Razorpay["Razorpay Test-Mode API / Simulation"]
        ExecService --> Email["Email Dispatcher"]
        ExecService --> WA["WhatsApp Business API"]
    end
    
    ExecService --> VerifService["Verification Service"]
    VerifService --> DB[("MongoDB / Dual-Mode Store")]
    VerifService --> Audit[("Immutable Audit Trail")]
```

## Key Architectural Principles

1. **Deterministic Safety Primacy:** AI agents generate recommendations, but NO financial action is executed without passing through the deterministic Policy Engine.
2. **Fail-Safe Reliability:** Automatic dual-mode database (MongoDB Atlas + built-in JSON fallback) and Razorpay integration (Live Test Mode + Simulation fallback) guarantee zero downtime.
3. **Structured AI Validation:** All Gemini LLM outputs are strictly schema-validated via Pydantic; invalid responses trigger immediate deterministic rule fallback.
4. **Immutable Audit Events:** Every detection, diagnosis, policy check, and provider API response is logged in an immutable audit timeline.

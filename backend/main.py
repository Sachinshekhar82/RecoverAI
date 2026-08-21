import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database.db import db_manager
from backend.database.seed_data import generate_synthetic_dataset

from backend.api.routes_dashboard import router as dashboard_router
from backend.api.routes_recovery import router as recovery_router
from backend.api.routes_agent import router as agent_router
from backend.api.routes_evaluation import router as evaluation_router
from backend.api.routes_audit import router as audit_router
from backend.api.routes_transactions import router as transactions_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

app = FastAPI(
    title="RecoverAI Backend API",
    description="Autonomous Revenue Recovery Platform for Razorpay AI Buildathon 2026 — Track 03",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(dashboard_router)
app.include_router(recovery_router)
app.include_router(agent_router)
app.include_router(evaluation_router)
app.include_router(audit_router)
app.include_router(transactions_router)

@app.on_event("startup")
def startup_event():
    logger.info("Initializing RecoverAI Backend Server...")
    existing_cases = db_manager.get_collection("recovery_cases")
    if not existing_cases or len(existing_cases) < 50:
        logger.info("Database is empty or missing synthetic data. Generating 200 synthetic records...")
        generate_synthetic_dataset(200)
    else:
        logger.info(f"Database ready with {len(existing_cases)} active recovery cases.")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RecoverAI Engine",
        "demo_mode": settings.DEMO_MODE,
        "razorpay_configured": bool(settings.RAZORPAY_KEY_ID),
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=settings.PORT, reload=True)

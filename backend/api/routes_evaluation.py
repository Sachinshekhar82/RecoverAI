from fastapi import APIRouter
from backend.engine.batch_evaluator import batch_evaluator
from backend.database.db import db_manager
from backend.database.models import StatusEnum

router = APIRouter(prefix="/api/evaluation", tags=["Batch Evaluation & Exceptions"])

@router.get("")
def get_batch_evaluation():
    return batch_evaluator.evaluate_batch()

@router.get("/exceptions")
def get_exceptions():
    cases = db_manager.get_collection("recovery_cases")
    exceptions = [c for c in cases if c.get("status") in [StatusEnum.EXCEPTIONAL.value, StatusEnum.SAFELY_STOPPED.value, StatusEnum.FAILED_ATTEMPT.value]]
    return {
        "count": len(exceptions),
        "exceptions": exceptions
    }

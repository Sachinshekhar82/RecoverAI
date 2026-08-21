from backend.database.seed_data import generate_synthetic_dataset
from backend.engine.batch_evaluator import batch_evaluator

def test_batch_evaluator_metrics():
    # Seed dataset
    generate_synthetic_dataset(200)
    
    metrics = batch_evaluator.evaluate_batch()
    
    assert metrics["total_records"] == 200
    assert metrics["total_revenue_at_risk"] > 0
    assert metrics["total_revenue_recovered"] > 0
    assert metrics["recovery_rate"] > 0
    assert metrics["successful_recovery_cases"] > 0
    assert "by_category" in metrics

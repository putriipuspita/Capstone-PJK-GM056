from collections import Counter, defaultdict

from src.api_app.services.insight_service import (
    build_aspect_insights,
    build_complaints,
    build_recommendations,
    build_strengths,
)
from src.ml.dummy_predictor import DummySentimentPredictor
from src.shared.database import SessionLocal
from src.shared.models import Review
from src.shared.repositories.analysis_repository import (
    create_analysis_result,
    get_analysis_run,
    update_analysis_status,
    update_review_predictions,
)
from src.shared.repositories.dataset_repository import get_reviews_by_dataset
from src.utils.csv_reader import ReviewRow


def process_analysis(analysis_id: str) -> None:
    db = SessionLocal()
    try:
        analysis_run = get_analysis_run(db, analysis_run_id=analysis_id)
        if not analysis_run:
            return

        update_analysis_status(db, analysis_run=analysis_run, status="processing", progress=10)
        db.commit()

        reviews = get_reviews_by_dataset(db, dataset_id=analysis_run.dataset_id)
        rows = [_review_to_row(review) for review in reviews]

        predictor = DummySentimentPredictor()
        predictions = predictor.predict_sentiments([row.review_text for row in rows])

        update_review_predictions(db, reviews=reviews, predictions=predictions)
        update_analysis_status(
            db,
            analysis_run=analysis_run,
            status="processing",
            progress=70,
            processed_reviews=len(rows),
        )
        db.commit()

        aspect_insights = build_aspect_insights(rows, predictions)
        complaints = build_complaints(rows, predictions)
        strengths = build_strengths(rows, predictions)
        recommendations = build_recommendations(complaints, aspect_insights)

        result = {
            "summary": _build_summary(predictions),
            "trends": _build_trends(rows, predictions),
            "aspect_insights": aspect_insights,
            "complaints": complaints,
            "strengths": strengths,
            "recommendations": recommendations,
            "sample_predictions": predictions[:10],
        }

        create_analysis_result(db, analysis_run_id=analysis_id, result=result)
        update_analysis_status(
            db,
            analysis_run=analysis_run,
            status="completed",
            progress=100,
            processed_reviews=len(rows),
        )
        db.commit()
    except Exception as exc:
        db.rollback()
        analysis_run = get_analysis_run(db, analysis_run_id=analysis_id)
        if analysis_run:
            update_analysis_status(db, analysis_run=analysis_run, status="failed", error_message=str(exc))
            db.commit()
    finally:
        db.close()


def _review_to_row(review: Review) -> ReviewRow:
    return ReviewRow(
        review_date=review.review_date or "",
        review_text=review.review_text,
        rating=str(review.rating or ""),
    )


def _build_summary(predictions: list[dict]) -> dict:
    counts = Counter(prediction["sentiment"] for prediction in predictions)
    total = len(predictions)

    positive = counts.get("positive", 0)
    neutral = counts.get("neutral", 0)
    negative = counts.get("negative", 0)
    satisfaction_score = round(((positive + (neutral * 0.5)) / total) * 100) if total else 0

    return {
        "positive": positive,
        "neutral": neutral,
        "negative": negative,
        "positive_percentage": round((positive / total) * 100, 1) if total else 0,
        "neutral_percentage": round((neutral / total) * 100, 1) if total else 0,
        "negative_percentage": round((negative / total) * 100, 1) if total else 0,
        "satisfaction_score": satisfaction_score,
    }


def _build_trends(rows: list[ReviewRow], predictions: list[dict]) -> list[dict]:
    grouped: dict[str, Counter] = defaultdict(Counter)

    for row, prediction in zip(rows, predictions):
        period = row.review_date or "Tidak diketahui"
        grouped[period][prediction["sentiment"]] += 1

    return [
        {
            "period": period,
            "positive": counts.get("positive", 0),
            "neutral": counts.get("neutral", 0),
            "negative": counts.get("negative", 0),
        }
        for period, counts in grouped.items()
    ]

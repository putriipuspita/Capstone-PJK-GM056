from collections import Counter, defaultdict

from sqlalchemy.orm import Session

from src.api_app.services.insight_service import (
    build_aspect_insights,
    build_complaints,
    build_recommendations,
    build_strengths,
)
from src.ml.predictor import get_sentiment_predictor
from src.shared.config import settings
from src.shared.database import SessionLocal
from src.shared.models import AnalysisRun, Review
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

        predictions = _predict_in_batches(
            texts=[row.review_text for row in rows],
            analysis_run=analysis_run,
            db=db,
        )
        if len(predictions) != len(rows):
            raise RuntimeError(
                f"Jumlah prediksi sentiment tidak sesuai jumlah review: {len(predictions)} dari {len(rows)}."
            )

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
        recommendations = build_recommendations(complaints, aspect_insights, strengths)

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


def _predict_in_batches(
    *,
    texts: list[str],
    analysis_run: AnalysisRun,
    db: Session,
) -> list[dict]:
    predictor = get_sentiment_predictor()
    configured_batch_size = (
        settings.huggingface_batch_size
        if settings.sentiment_predictor_provider.lower() == "huggingface"
        else settings.sentiment_batch_size
    )
    batch_size = max(configured_batch_size, 1)
    predictions: list[dict] = []
    total = len(texts)

    if total == 0:
        return predictions

    for start_index in range(0, total, batch_size):
        batch = texts[start_index : start_index + batch_size]
        batch_predictions = predictor.predict_sentiments(batch)
        if len(batch_predictions) != len(batch):
            raise RuntimeError(
                f"Batch predictor mengembalikan {len(batch_predictions)} prediksi untuk {len(batch)} teks."
            )

        predictions.extend(batch_predictions)

        processed_reviews = min(start_index + len(batch), total)
        progress = 10 + round((processed_reviews / total) * 60)
        update_analysis_status(
            db,
            analysis_run=analysis_run,
            status="processing",
            progress=min(progress, 70),
            processed_reviews=processed_reviews,
        )
        db.commit()

    return predictions


def _build_summary(predictions: list[dict]) -> dict:
    counts = Counter(prediction["sentiment"] for prediction in predictions)
    total = len(predictions)

    positif = counts.get("positif", 0)
    netral = counts.get("netral", 0)
    negatif = counts.get("negatif", 0)
    satisfaction_score = round(((positif + (netral * 0.5)) / total) * 100) if total else 0

    return {
        "positif": positif,
        "netral": netral,
        "negatif": negatif,
        "positif_percentage": round((positif / total) * 100, 1) if total else 0,
        "netral_percentage": round((netral / total) * 100, 1) if total else 0,
        "negatif_percentage": round((negatif / total) * 100, 1) if total else 0,
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
            "positif": counts.get("positif", 0),
            "netral": counts.get("netral", 0),
            "negatif": counts.get("negatif", 0),
        }
        for period, counts in grouped.items()
    ]

from collections import Counter, defaultdict

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from src.ml.dummy_predictor import DummySentimentPredictor
from src.utils.csv_reader import parse_review_csv

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("")
async def upload_reviews(
    product_name: str = Form(...),
    file: UploadFile = File(...),
) -> dict:
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File harus berformat .csv.",
        )

    content = await file.read()

    try:
        rows = parse_review_csv(content)
    except UnicodeDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File CSV harus menggunakan encoding UTF-8.",
        ) from exc
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    predictor = DummySentimentPredictor()
    predictions = predictor.predict_sentiments([row.review_text for row in rows])

    summary = _build_summary(predictions)
    trends = _build_trends(rows, predictions)

    return {
        "product_name": product_name,
        "file_name": file.filename,
        "total_reviews": len(rows),
        "summary": summary,
        "trends": trends,
        "sample_predictions": predictions[:10],
    }


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


def _build_trends(rows: list, predictions: list[dict]) -> list[dict]:
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

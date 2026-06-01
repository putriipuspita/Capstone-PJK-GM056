from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from src.shared.models import AnalysisResult, AnalysisRun, Review


def create_analysis_run(
    db: Session,
    *,
    product_id: str,
    dataset_id: str,
    total_reviews: int,
) -> AnalysisRun:
    analysis_run = AnalysisRun(
        product_id=product_id,
        dataset_id=dataset_id,
        status="queued",
        progress=0,
        total_reviews=total_reviews,
        processed_reviews=0,
    )
    db.add(analysis_run)
    db.flush()
    return analysis_run


def get_analysis_run(db: Session, *, analysis_run_id: str) -> AnalysisRun | None:
    return db.get(
        AnalysisRun,
        analysis_run_id,
        options=[
            selectinload(AnalysisRun.product),
            selectinload(AnalysisRun.dataset),
            selectinload(AnalysisRun.result),
        ],
    )


def list_analysis_history(
    db: Session,
    *,
    user_id: str,
    product_name: str | None = None,
) -> list[AnalysisRun]:
    statement = (
        select(AnalysisRun)
        .join(AnalysisRun.product)
        .options(
            selectinload(AnalysisRun.product),
            selectinload(AnalysisRun.dataset),
            selectinload(AnalysisRun.result),
        )
        .where(AnalysisRun.product.has(user_id=user_id))
        .order_by(AnalysisRun.created_at.desc())
    )

    if product_name:
        statement = statement.where(AnalysisRun.product.has(name=product_name))

    return list(db.execute(statement).scalars().all())


def list_completed_analysis_runs(db: Session, *, user_id: str) -> list[AnalysisRun]:
    statement = (
        select(AnalysisRun)
        .join(AnalysisRun.product)
        .options(
            selectinload(AnalysisRun.product),
            selectinload(AnalysisRun.dataset),
            selectinload(AnalysisRun.result),
        )
        .where(AnalysisRun.product.has(user_id=user_id), AnalysisRun.status == "completed")
        .order_by(AnalysisRun.created_at.desc())
    )

    return list(db.execute(statement).scalars().all())


def get_latest_completed_analysis_for_product(
    db: Session,
    *,
    user_id: str,
    product_id: str,
) -> AnalysisRun | None:
    statement = (
        select(AnalysisRun)
        .join(AnalysisRun.product)
        .options(
            selectinload(AnalysisRun.product),
            selectinload(AnalysisRun.dataset),
            selectinload(AnalysisRun.result),
        )
        .where(
            AnalysisRun.product.has(user_id=user_id),
            AnalysisRun.product_id == product_id,
            AnalysisRun.status == "completed",
        )
        .order_by(AnalysisRun.created_at.desc())
        .limit(1)
    )

    return db.execute(statement).scalar_one_or_none()


def update_analysis_status(
    db: Session,
    *,
    analysis_run: AnalysisRun,
    status: str,
    progress: int | None = None,
    processed_reviews: int | None = None,
    error_message: str | None = None,
) -> AnalysisRun:
    analysis_run.status = status
    if progress is not None:
        analysis_run.progress = progress
    if processed_reviews is not None:
        analysis_run.processed_reviews = processed_reviews
    if error_message is not None:
        analysis_run.error_message = error_message
    if status == "processing" and analysis_run.started_at is None:
        analysis_run.started_at = datetime.utcnow()
    if status in {"completed", "failed"}:
        analysis_run.finished_at = datetime.utcnow()

    db.flush()
    return analysis_run


def update_review_predictions(db: Session, *, reviews: list[Review], predictions: list[dict]) -> None:
    for review, prediction in zip(reviews, predictions):
        review.sentiment = prediction["sentiment"]
        review.confidence = prediction["confidence"]

    db.flush()


def create_analysis_result(
    db: Session,
    *,
    analysis_run_id: str,
    result: dict,
) -> AnalysisResult:
    analysis_result = AnalysisResult(
        analysis_run_id=analysis_run_id,
        summary=result["summary"],
        trends=result["trends"],
        aspect_insights=result["aspect_insights"],
        complaints=result["complaints"],
        strengths=result["strengths"],
        recommendations=result["recommendations"],
        sample_predictions=result["sample_predictions"],
    )
    db.add(analysis_result)
    db.flush()
    return analysis_result

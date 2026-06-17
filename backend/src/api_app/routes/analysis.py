from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.api_app.services.history_service import build_history_item
from src.shared.auth import CurrentUser, get_current_user
from src.shared.database import get_db
from src.shared.repositories.analysis_repository import get_analysis_run_for_user, list_analysis_history

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.get("/history")
def get_analysis_history(
    status_filter: str | None = None,
    quality_status_filter: str | None = None,
    product_name: str | None = None,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> list[dict]:
    analysis_runs = list_analysis_history(
        db,
        user_id=current_user.user_id,
        product_name=product_name,
    )
    history = [build_history_item(analysis_run) for analysis_run in analysis_runs]

    if status_filter and status_filter.lower() != "semua":
        history = [
            item
            for item in history
            if _matches_process_status(item, status_filter)
        ]

    if quality_status_filter and quality_status_filter.lower() != "semua":
        history = [
            item
            for item in history
            if item["quality_status"] and item["quality_status"].lower() == quality_status_filter.lower()
        ]

    return history


def _matches_process_status(item: dict, status_filter: str) -> bool:
    normalized = status_filter.lower()
    return item["process_status"].lower() == normalized or item["process_status_label"].lower() == normalized


@router.get("/{analysis_id}/status")
def get_analysis_status(
    analysis_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> dict:
    analysis_run = get_analysis_run_for_user(
        db,
        analysis_run_id=analysis_id,
        user_id=current_user.user_id,
    )
    if not analysis_run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis run tidak ditemukan.",
        )

    return {
        "analysis_id": analysis_run.id,
        "status": analysis_run.status,
        "progress": analysis_run.progress,
        "total_reviews": analysis_run.total_reviews,
        "processed_reviews": analysis_run.processed_reviews,
        "error_message": analysis_run.error_message,
    }


@router.get("/{analysis_id}")
def get_analysis_result(
    analysis_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> dict:
    analysis_run = get_analysis_run_for_user(
        db,
        analysis_run_id=analysis_id,
        user_id=current_user.user_id,
    )
    if not analysis_run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis run tidak ditemukan.",
        )

    if analysis_run.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Analysis belum selesai. Status saat ini: {analysis_run.status}.",
        )

    if not analysis_run.result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hasil analysis tidak ditemukan.",
        )

    return {
        "analysis_id": analysis_run.id,
        "product_name": analysis_run.product.name,
        "file_name": analysis_run.dataset.file_name,
        "total_reviews": analysis_run.total_reviews,
        "summary": analysis_run.result.summary,
        "trends": analysis_run.result.trends,
        "aspect_insights": analysis_run.result.aspect_insights,
        "complaints": analysis_run.result.complaints,
        "strengths": analysis_run.result.strengths,
        "recommendations": analysis_run.result.recommendations,
        "sample_predictions": analysis_run.result.sample_predictions,
    }


@router.delete("/{analysis_id}")
def delete_analysis(
    analysis_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> dict:
    from src.shared.repositories.analysis_repository import delete_analysis_run

    analysis_run = get_analysis_run_for_user(
        db,
        analysis_run_id=analysis_id,
        user_id=current_user.user_id,
    )
    if not analysis_run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis run tidak ditemukan.",
        )

    delete_analysis_run(db, analysis_run=analysis_run)
    db.commit()

    return {"message": "Data analisis berhasil dihapus."}

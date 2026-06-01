from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.shared.database import get_db
from src.shared.repositories.analysis_repository import get_analysis_run

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.get("/{analysis_id}/status")
def get_analysis_status(analysis_id: str, db: Session = Depends(get_db)) -> dict:
    analysis_run = get_analysis_run(db, analysis_run_id=analysis_id)
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
def get_analysis_result(analysis_id: str, db: Session = Depends(get_db)) -> dict:
    analysis_run = get_analysis_run(db, analysis_run_id=analysis_id)
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

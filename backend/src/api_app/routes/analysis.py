from fastapi import APIRouter, HTTPException, status

from src.shared.analysis_store import get_analysis_run

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.get("/{analysis_id}/status")
def get_analysis_status(analysis_id: str) -> dict:
    analysis_run = get_analysis_run(analysis_id)
    if not analysis_run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis run tidak ditemukan.",
        )

    return {
        "analysis_id": analysis_run["analysis_id"],
        "status": analysis_run["status"],
        "progress": analysis_run["progress"],
        "total_reviews": analysis_run["total_reviews"],
        "processed_reviews": analysis_run["processed_reviews"],
        "error_message": analysis_run["error_message"],
    }


@router.get("/{analysis_id}")
def get_analysis_result(analysis_id: str) -> dict:
    analysis_run = get_analysis_run(analysis_id)
    if not analysis_run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis run tidak ditemukan.",
        )

    if analysis_run["status"] != "completed":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Analysis belum selesai. Status saat ini: {analysis_run['status']}.",
        )

    return {
        "analysis_id": analysis_run["analysis_id"],
        "product_name": analysis_run["product_name"],
        "file_name": analysis_run["file_name"],
        "total_reviews": analysis_run["total_reviews"],
        **analysis_run["result"],
    }

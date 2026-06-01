from uuid import uuid4

from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile, status

from src.api_app.services.analysis_service import process_analysis
from src.shared.analysis_store import create_analysis_run
from src.utils.csv_reader import parse_review_csv

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("")
async def upload_reviews(
    background_tasks: BackgroundTasks,
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

    analysis_id = str(uuid4())
    analysis_run = create_analysis_run(
        analysis_id=analysis_id,
        product_name=product_name,
        file_name=file.filename,
        total_reviews=len(rows),
    )
    background_tasks.add_task(process_analysis, analysis_id, rows)

    return {
        "analysis_id": analysis_run["analysis_id"],
        "product_name": product_name,
        "file_name": file.filename,
        "total_reviews": len(rows),
        "status": analysis_run["status"],
        "progress": analysis_run["progress"],
    }

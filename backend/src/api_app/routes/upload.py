from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from src.api_app.services.analysis_service import process_analysis
from src.shared.config import settings
from src.shared.database import get_db
from src.shared.repositories.analysis_repository import create_analysis_run
from src.shared.repositories.dataset_repository import create_dataset, create_reviews
from src.shared.repositories.product_repository import get_or_create_product, get_or_create_user_profile
from src.utils.csv_reader import parse_review_csv

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("")
async def upload_reviews(
    background_tasks: BackgroundTasks,
    product_name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
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

    user_profile = get_or_create_user_profile(
        db,
        user_id=settings.dev_user_id,
        store_name=settings.dev_store_name,
        email=settings.dev_user_email,
    )
    product = get_or_create_product(db, user_id=user_profile.user_id, product_name=product_name)
    dataset = create_dataset(
        db,
        product_id=product.id,
        file_name=file.filename,
        total_reviews=len(rows),
    )
    create_reviews(db, dataset_id=dataset.id, rows=rows)
    analysis_run = create_analysis_run(
        db,
        product_id=product.id,
        dataset_id=dataset.id,
        total_reviews=len(rows),
    )
    db.commit()

    background_tasks.add_task(process_analysis, analysis_run.id)

    return {
        "analysis_id": analysis_run.id,
        "product_name": product_name,
        "file_name": file.filename,
        "total_reviews": len(rows),
        "status": analysis_run.status,
        "progress": analysis_run.progress,
    }

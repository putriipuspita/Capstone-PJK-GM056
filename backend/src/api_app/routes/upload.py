from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from src.api_app.services.analysis_service import ai_task_executor, process_analysis
from src.shared.auth import CurrentUser, get_current_user
from src.shared.database import get_db
from src.shared.repositories.analysis_repository import create_analysis_run
from src.shared.repositories.dataset_repository import create_dataset, create_reviews
from src.shared.repositories.product_repository import get_or_create_product, get_or_create_user_profile
from src.shared.storage import upload_csv_file
from src.utils.csv_reader import parse_review_csv

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("")
async def upload_reviews(
    background_tasks: BackgroundTasks,
    product_name: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
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
        user_id=current_user.user_id,
        store_name=current_user.store_name,
        email=current_user.email,
    )
    product = get_or_create_product(db, user_id=user_profile.user_id, product_name=product_name)
    storage_path = upload_csv_file(
        content=content,
        file_name=file.filename,
        user_id=user_profile.user_id,
        product_id=product.id,
    )
    dataset = create_dataset(
        db,
        product_id=product.id,
        file_name=file.filename,
        total_reviews=len(rows),
        storage_path=storage_path,
    )
    create_reviews(db, dataset_id=dataset.id, rows=rows)
    analysis_run = create_analysis_run(
        db,
        product_id=product.id,
        dataset_id=dataset.id,
        total_reviews=len(rows),
    )
    db.commit()

    # Menggunakan executor internal Python sebagai antrean (Queue)
    ai_task_executor.submit(process_analysis, analysis_run.id)

    return {
        "analysis_id": analysis_run.id,
        "product_name": product_name,
        "file_name": file.filename,
        "storage_path": storage_path,
        "total_reviews": len(rows),
        "status": analysis_run.status,
        "progress": analysis_run.progress,
    }

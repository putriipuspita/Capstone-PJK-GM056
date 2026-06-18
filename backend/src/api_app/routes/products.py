from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.api_app.services.product_dashboard_service import build_product_dashboard
from src.shared.auth import CurrentUser, get_current_user
from src.shared.database import get_db
from src.shared.repositories.analysis_repository import get_latest_completed_analysis_for_product
from src.shared.repositories.product_repository import list_products_with_analysis_stats

router = APIRouter(prefix="/products", tags=["products"])


@router.get("")
def list_products(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> list[dict]:
    return list_products_with_analysis_stats(db, user_id=current_user.user_id)


@router.get("/{product_id}/dashboard")
def get_product_dashboard(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> dict:
    analysis_run = get_latest_completed_analysis_for_product(
        db,
        user_id=current_user.user_id,
        product_id=product_id,
    )
    if not analysis_run or not analysis_run.result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dashboard produk tidak ditemukan.",
        )

    return build_product_dashboard(analysis_run)

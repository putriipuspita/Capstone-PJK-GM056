from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.shared.config import settings
from src.shared.database import get_db
from src.shared.repositories.product_repository import list_products_with_analysis_stats

router = APIRouter(prefix="/products", tags=["products"])


@router.get("")
def list_products(db: Session = Depends(get_db)) -> list[dict]:
    return list_products_with_analysis_stats(db, user_id=settings.dev_user_id)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.api_app.services.dashboard_service import build_global_dashboard
from src.shared.config import settings
from src.shared.database import get_db
from src.shared.repositories.analysis_repository import list_completed_analysis_runs

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
def get_global_dashboard(db: Session = Depends(get_db)) -> dict:
    analysis_runs = list_completed_analysis_runs(db, user_id=settings.dev_user_id)
    return build_global_dashboard(analysis_runs)

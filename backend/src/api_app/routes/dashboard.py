from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.api_app.services.dashboard_service import build_global_dashboard
from src.shared.auth import CurrentUser, get_current_user
from src.shared.database import get_db
from src.shared.repositories.analysis_repository import list_completed_analysis_runs

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
def get_global_dashboard(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
) -> dict:
    analysis_runs = list_completed_analysis_runs(db, user_id=current_user.user_id)
    return build_global_dashboard(analysis_runs)

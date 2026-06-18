import sys
import json
import os

# Set working directory to backend
sys.path.insert(0, os.path.abspath("."))

from src.shared.database import SessionLocal
from src.shared.models import UserProfile, AnalysisRun
from src.shared.repositories.analysis_repository import list_completed_analysis_runs
from src.api_app.services.dashboard_service import build_global_dashboard

db = SessionLocal()
try:
    users = db.query(UserProfile).all()
    for user in users:
        print(f"User: {user.email} (ID: {user.user_id})")
        runs = list_completed_analysis_runs(db, user_id=user.user_id)
        print(f"  Completed runs: {len(runs)}")
        if runs:
            dash = build_global_dashboard(runs)
            print("  Dashboard Data:")
            print(json.dumps(dash, indent=2))
finally:
    db.close()

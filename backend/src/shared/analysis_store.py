from copy import deepcopy
from threading import Lock
from typing import Any


_analysis_runs: dict[str, dict[str, Any]] = {}
_lock = Lock()


def create_analysis_run(analysis_id: str, product_name: str, file_name: str, total_reviews: int) -> dict:
    analysis_run = {
        "analysis_id": analysis_id,
        "product_name": product_name,
        "file_name": file_name,
        "status": "queued",
        "progress": 0,
        "total_reviews": total_reviews,
        "processed_reviews": 0,
        "result": None,
        "error_message": None,
    }

    with _lock:
        _analysis_runs[analysis_id] = analysis_run

    return deepcopy(analysis_run)


def get_analysis_run(analysis_id: str) -> dict | None:
    with _lock:
        analysis_run = _analysis_runs.get(analysis_id)
        return deepcopy(analysis_run) if analysis_run else None


def update_analysis_run(analysis_id: str, **changes: Any) -> dict | None:
    with _lock:
        analysis_run = _analysis_runs.get(analysis_id)
        if not analysis_run:
            return None

        analysis_run.update(changes)
        return deepcopy(analysis_run)

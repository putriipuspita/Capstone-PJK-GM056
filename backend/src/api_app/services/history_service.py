from src.shared.models import AnalysisRun


def build_history_item(analysis_run: AnalysisRun) -> dict:
    satisfaction_score = _get_satisfaction_score(analysis_run)

    return {
        "analysis_id": analysis_run.id,
        "product_name": analysis_run.product.name,
        "analyzed_at": analysis_run.finished_at or analysis_run.created_at,
        "total_reviews": analysis_run.total_reviews,
        "satisfaction_score": satisfaction_score,
        "quality_status": _build_quality_status(satisfaction_score),
        "process_status": analysis_run.status,
        "process_status_label": _build_process_status_label(analysis_run.status),
    }


def _get_satisfaction_score(analysis_run: AnalysisRun) -> int | None:
    if not analysis_run.result:
        return None

    score = analysis_run.result.summary.get("satisfaction_score")
    return int(score) if score is not None else None


def _build_quality_status(score: int | None) -> str | None:
    if score is None:
        return None
    if score >= 90:
        return "Sangat Baik"
    if score >= 70:
        return "Baik"
    if score >= 50:
        return "Cukup"
    return "Buruk"


def _build_process_status_label(status: str) -> str:
    labels = {
        "queued": "Menunggu",
        "processing": "Sedang Dianalisis",
        "completed": "Selesai",
        "failed": "Gagal",
    }
    return labels.get(status, status)

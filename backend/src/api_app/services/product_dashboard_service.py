from src.shared.models import AnalysisRun


def build_product_dashboard(analysis_run: AnalysisRun) -> dict:
    result = analysis_run.result

    return {
        "analysis_id": analysis_run.id,
        "product_id": analysis_run.product_id,
        "product_name": analysis_run.product.name,
        "file_name": analysis_run.dataset.file_name,
        "analyzed_at": analysis_run.finished_at or analysis_run.created_at,
        "total_reviews": analysis_run.total_reviews,
        "summary": result.summary,
        "trends": result.trends,
        "aspect_insights": result.aspect_insights,
        "complaints": result.complaints,
        "strengths": result.strengths,
        "recommendations": result.recommendations,
        "sample_predictions": result.sample_predictions,
    }

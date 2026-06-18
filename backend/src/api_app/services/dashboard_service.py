from collections import Counter, defaultdict

from src.shared.models import AnalysisRun


def build_global_dashboard(analysis_runs: list[AnalysisRun]) -> dict:
    summary_counts: Counter = Counter()
    total_reviews = 0
    trends = defaultdict(Counter)
    aspects: Counter = Counter()
    complaints: Counter = Counter()
    product_rows = []

    for analysis_run in analysis_runs:
        if not analysis_run.result:
            continue

        summary = analysis_run.result.summary
        positive = int(summary.get("positif", 0))
        neutral = int(summary.get("netral", 0))
        negative = int(summary.get("negatif", 0))
        run_total = positive + neutral + negative

        summary_counts["positive"] += positive
        summary_counts["neutral"] += neutral
        summary_counts["negative"] += negative
        total_reviews += run_total

        for trend in analysis_run.result.trends:
            period = trend.get("name", "Tidak diketahui")
            trends[period]["positive"] += int(trend.get("positif", 0))
            trends[period]["neutral"] += int(trend.get("netral", 0))
            trends[period]["negative"] += int(trend.get("negatif", 0))

        for aspect in analysis_run.result.aspect_insights:
            aspects[aspect.get("label", "Lainnya")] += int(aspect.get("jumlah", 0))

        for complaint in analysis_run.result.complaints:
            complaints[complaint.get("label", "Keluhan lainnya")] += int(complaint.get("jumlah", 0))

        product_rows.append(
            {
                "analysis_id": analysis_run.id,
                "product_name": analysis_run.product.name,
                "total_reviews": run_total,
                "positive": positive,
                "neutral": neutral,
                "negative": negative,
                "satisfaction_score": int(summary.get("satisfaction_score", 0)),
            }
        )

    return {
        "summary": _build_summary(summary_counts, total_reviews),
        "trends": _build_trends(trends),
        "top_aspects": _build_ranked_items(aspects, total_reviews),
        "top_complaints": _build_ranked_items(complaints, max(summary_counts["negative"], 1)),
        "products": sorted(product_rows, key=lambda item: item["satisfaction_score"], reverse=True),
    }


def _build_summary(counts: Counter, total: int) -> dict:
    positive = counts["positive"]
    neutral = counts["neutral"]
    negative = counts["negative"]
    satisfaction_score = round(((positive + (neutral * 0.5)) / total) * 100) if total else 0

    return {
        "total_reviews": total,
        "positive": positive,
        "neutral": neutral,
        "negative": negative,
        "positive_percentage": round((positive / total) * 100, 1) if total else 0,
        "neutral_percentage": round((neutral / total) * 100, 1) if total else 0,
        "negative_percentage": round((negative / total) * 100, 1) if total else 0,
        "satisfaction_score": satisfaction_score,
    }


def _build_trends(trends: dict[str, Counter]) -> list[dict]:
    return [
        {
            "period": period,
            "positive": counts["positive"],
            "neutral": counts["neutral"],
            "negative": counts["negative"],
        }
        for period, counts in sorted(trends.items())
    ]


def _build_ranked_items(counter: Counter, total: int) -> list[dict]:
    return [
        {
            "label": label,
            "jumlah": count,
            "persen": round((count / total) * 100, 1) if total else 0,
        }
        for label, count in counter.most_common(5)
    ]

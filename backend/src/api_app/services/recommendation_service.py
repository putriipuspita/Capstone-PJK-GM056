from src.api_app.services.insight_service import build_recommendations
from src.shared.config import settings
from src.utils.csv_reader import ReviewRow


def generate_recommendations(
    *,
    rows: list[ReviewRow],
    summary: dict,
    complaints: list[dict],
    aspect_insights: list[dict],
    strengths: list[str],
) -> list[dict]:
    provider = settings.recommendation_provider.lower()

    if provider == "rule_based":
        return build_recommendations(complaints, aspect_insights)

    if provider == "gemini":
        return generate_gemini_recommendations(
            rows=rows,
            summary=summary,
            complaints=complaints,
            aspect_insights=aspect_insights,
            strengths=strengths,
        )

    raise RuntimeError(f"Provider recommendation tidak dikenal: {settings.recommendation_provider}.")


def generate_gemini_recommendations(
    *,
    rows: list[ReviewRow],
    summary: dict,
    complaints: list[dict],
    aspect_insights: list[dict],
    strengths: list[str],
) -> list[dict]:
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY belum dikonfigurasi.")

    # Placeholder until Gemini integration is enabled. Keep the return shape stable.
    recommendations = build_recommendations(complaints, aspect_insights)
    if recommendations:
        return [
            {
                **recommendation,
                "source": "gemini_placeholder",
            }
            for recommendation in recommendations
        ]

    return [
        {
            "title": "Tinjau Pola Sentimen Pelanggan",
            "description": "Gunakan ringkasan sentimen, keluhan, dan aspek yang paling sering dibahas untuk menentukan prioritas perbaikan.",
            "source": "gemini_placeholder",
        }
    ]

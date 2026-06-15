import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

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
        return build_recommendations(complaints, aspect_insights)

    prompt = _build_gemini_prompt(
        rows=rows,
        summary=summary,
        complaints=complaints,
        aspect_insights=aspect_insights,
        strengths=strengths,
    )

    try:
        raw_text = _call_gemini(prompt)
        recommendations = _parse_recommendations(raw_text)
    except (RuntimeError, ValueError, HTTPError, URLError, TimeoutError):
        return build_recommendations(complaints, aspect_insights)

    if recommendations:
        return recommendations

    return [
        {
            "title": "Tinjau Pola Sentimen Pelanggan",
            "description": "Gunakan ringkasan sentimen, keluhan, dan aspek yang paling sering dibahas untuk menentukan prioritas perbaikan.",
            "source": "gemini",
        }
    ]


def _build_gemini_prompt(
    *,
    rows: list[ReviewRow],
    summary: dict,
    complaints: list[dict],
    aspect_insights: list[dict],
    strengths: list[str],
) -> str:
    sample_reviews = [row.review_text for row in rows[:20]]
    payload = {
        "summary": summary,
        "complaints": complaints[:10],
        "aspect_insights": aspect_insights[:10],
        "strengths": strengths[:10],
        "sample_reviews": sample_reviews,
    }

    return (
        "Anda adalah analis customer experience untuk toko online Indonesia. "
        "Buat 3 sampai 5 rekomendasi bisnis yang spesifik, praktis, dan berdasarkan data berikut. "
        "Jawab hanya JSON array valid. Setiap item wajib memiliki key: title, description, source. "
        "Gunakan source bernilai \"gemini\". Jangan gunakan markdown.\n\n"
        f"DATA:\n{json.dumps(payload, ensure_ascii=False)}"
    )


def _call_gemini(prompt: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent"
    request_body = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt,
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "responseMimeType": "application/json",
        },
    }
    request = Request(
        url,
        data=json.dumps(request_body).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "x-goog-api-key": settings.gemini_api_key or "",
        },
        method="POST",
    )

    with urlopen(request, timeout=settings.gemini_timeout_seconds) as response:
        response_body = json.loads(response.read().decode("utf-8"))

    candidates = response_body.get("candidates") or []
    if not candidates:
        raise RuntimeError("Gemini tidak mengembalikan kandidat rekomendasi.")

    parts = candidates[0].get("content", {}).get("parts", [])
    text_parts = [part.get("text", "") for part in parts if part.get("text")]
    if not text_parts:
        raise RuntimeError("Gemini tidak mengembalikan teks rekomendasi.")

    return "\n".join(text_parts)


def _parse_recommendations(raw_text: str) -> list[dict]:
    parsed = json.loads(raw_text)
    if not isinstance(parsed, list):
        raise ValueError("Response rekomendasi Gemini harus berupa JSON array.")

    recommendations: list[dict] = []
    for item in parsed:
        if not isinstance(item, dict):
            continue

        title = str(item.get("title", "")).strip()
        description = str(item.get("description", "")).strip()
        if not title or not description:
            continue

        recommendations.append(
            {
                "title": title,
                "description": description,
                "source": "gemini",
            }
        )

    return recommendations[:5]

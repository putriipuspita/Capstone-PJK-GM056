import json
import logging
import time

from google import genai
from google.genai import types

from src.shared.config import settings

logger = logging.getLogger(__name__)


def generate_gemini_recommendations(
    complaints: list[dict], aspect_insights: list[dict], strengths: list[str]
) -> list[dict] | None:
    if not settings.gemini_api_key:
        return None

    client = genai.Client(api_key=settings.gemini_api_key)

    prompt = f"""
Anda adalah konsultan bisnis e-commerce yang ahli menganalisis ulasan pelanggan (terutama di Tokopedia).
Saya akan memberikan data sentimen pelanggan dari produk saya.
Tugas Anda: Berikan 3 rekomendasi bisnis/operasional yang paling *actionable* (bisa langsung dilakukan) untuk meningkatkan kepuasan pelanggan dan penjualan.

Data Insight Sentimen:
- Top Keluhan (Berdasarkan ulasan negatif): {json.dumps(complaints, indent=2, ensure_ascii=False)}
- Aspek yang sering dibicarakan: {json.dumps(aspect_insights, indent=2, ensure_ascii=False)}
- Ulasan positif (sebagai kekuatan produk): {json.dumps(strengths, indent=2, ensure_ascii=False)}

Aturan Output:
- HANYA KEMBALIKAN JSON ARRAY.
- JSON berisi 3 objek.
- Masing-masing objek harus memiliki:
  - "judul": (String, maksimal 6 kata)
  - "deskripsi": (String, kalimat rekomendasi yang solutif, 2-3 kalimat)
  - "source": (String, nilainya WAJIB "gemini")

Contoh Output:
[
  {{
    "judul": "Evaluasi Ekspedisi Pengiriman",
    "deskripsi": "Banyak keluhan terkait pengiriman lambat. Pertimbangkan untuk mengevaluasi mitra logistik atau memberikan kompensasi diskon untuk keterlambatan.",
    "source": "gemini"
  }}
]
"""

    models_to_try = [
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro"
    ]

    for model_name in models_to_try:
        try:
            logger.info(f"Mencoba model Gemini: {model_name}")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.7,
                ),
            )

            if not response.text:
                logger.error("Gemini mengembalikan teks kosong.")
                return None

            recommendations = json.loads(response.text)
            
            # Validasi struktur
            valid_recs = []
            for rec in recommendations:
                if isinstance(rec, dict) and "judul" in rec and "deskripsi" in rec:
                    rec["source"] = "gemini"
                    valid_recs.append(rec)
            
            return valid_recs[:3]

        except Exception as exc:
            err_msg = str(exc)
            if "503" in err_msg or "429" in err_msg or "UNAVAILABLE" in err_msg:
                logger.warning(f"Model {model_name} sibuk/error. Beralih ke model cadangan... ({err_msg})")
                time.sleep(1)
                continue
            logger.error(f"Gagal memanggil API Gemini ({model_name}): {err_msg}")
            # Lanjut ke model berikutnya meskipun error lain (siapa tahu model lain berhasil)
            continue

    logger.error("Semua model Gemini gagal dihubungi.")
    return None

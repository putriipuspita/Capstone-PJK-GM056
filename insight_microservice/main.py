import json
import logging
import os
import time
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Insight Microservice", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RecommendationRequest(BaseModel):
    complaints: list[dict]
    aspect_insights: list[dict]
    strengths: list[str]


@app.get("/")
def read_root():
    return {"message": "Insight Microservice is running!"}


@app.post("/api/recommendations")
def generate_recommendations(payload: RecommendationRequest):
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY belum dikonfigurasi di environment microservice ini.")

    client = genai.Client(api_key=gemini_api_key)

    prompt = f"""
Anda adalah konsultan bisnis e-commerce yang ahli menganalisis ulasan pelanggan (terutama di Tokopedia).
Saya akan memberikan data sentimen pelanggan dari produk saya.
Tugas Anda: Berikan 3 rekomendasi bisnis/operasional yang paling *actionable* (bisa langsung dilakukan) untuk meningkatkan kepuasan pelanggan dan penjualan.

Data Insight Sentimen:
- Top Keluhan (Berdasarkan ulasan negatif): {json.dumps(payload.complaints, indent=2, ensure_ascii=False)}
- Aspek yang sering dibicarakan: {json.dumps(payload.aspect_insights, indent=2, ensure_ascii=False)}
- Ulasan positif (sebagai kekuatan produk): {json.dumps(payload.strengths, indent=2, ensure_ascii=False)}

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
        "gemini-2.5-flash",
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
                continue

            recommendations = json.loads(response.text)
            
            # Validasi struktur
            valid_recs = []
            for rec in recommendations:
                if isinstance(rec, dict) and "judul" in rec and "deskripsi" in rec:
                    rec["source"] = "gemini"
                    valid_recs.append(rec)
            
            if valid_recs:
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

    raise HTTPException(status_code=503, detail="Semua model Gemini gagal dihubungi atau mengembalikan error.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)

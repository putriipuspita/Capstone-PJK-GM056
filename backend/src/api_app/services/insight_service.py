import re
from collections import Counter, defaultdict

from src.utils.csv_reader import ReviewRow

ASPECT_KEYWORDS = {
    "Pengiriman & Logistik": ["pengiriman", "kirim", "kurir", "sampai", "sampe", "resi", "lama", "lambat", "ekspedisi", "paket", "jne", "jnt", "sicepat", "ninja", "anteraja", "kurirnya"],
    "Kualitas Produk": ["kualitas", "bagus", "rusak", "pecah", "palsu", "material", "ringkih", "awet", "jelek", "bahan", "original", "ori", "kw", "cacat", "sobek", "patah", "berfungsi", "mantap"],
    "Harga & Nilai": ["harga", "murah", "mahal", "merakyat", "terjangkau", "price", "diskon", "promo", "overprice", "worth it", "cuan", "sepadan"],
    "Pelayanan Penjual": ["penjual", "respon", "chat", "ramah", "dibalas", "tanggung jawab", "admin", "seller", "pelayanan", "judes", "sopan", "balas"],
    "Kemasan & Packing": ["kemasan", "packing", "pengemasan", "bungkus", "bubble wrap", "kardus", "penyok", "hancur", "aman", "rapi", "box", "plastik"],
    "Kesesuaian Pesanan": ["sesuai", "beda", "salah", "kurang", "ukuran", "warna", "deskripsi", "gambar", "realpict", "size", "pas"],
    "Estetika & Desain": ["desain", "model", "warna", "bentuk", "motif", "elegan", "cantik", "lucu", "keren", "kuno", "jelek"],
    "Kenyamanan": ["nyaman", "enak", "pas", "gatal", "panas", "empuk", "lembut", "keras", "sakit", "berat"],
    "Ketahanan & Keawetan": ["awet", "tahan lama", "luntur", "cepat rusak", "garansi", "kuat", "kokoh"],
    "Ketersediaan Stok": ["stok", "habis", "kosong", "restock", "varian", "pilihan", "ready"],
    "Ongkos Kirim": ["ongkir", "gratis ongkir", "biaya kirim", "mahal ongkir", "free ongkir", "berat pengiriman"],
    "Promo & Diskon": ["promo", "diskon", "cashback", "voucher", "flash sale", "potongan"],
    "Fungsionalitas": ["berfungsi", "berguna", "tidak bisa dipakai", "mati", "error", "rusak", "nyala", "macet"],
    "Kemudahan Penggunaan": ["mudah", "gampang", "ribet", "susah", "instalasi", "panduan", "rakit", "tutorial"]
}

COMPLAINT_RULES = {
    "Pengiriman lambat/bermasalah": (
        ["lama", "lambat", "lelet", "nyasar", "belum sampai", "kurir"], 
        ["tidak lama", "ga lama", "ngga lama", "gak lama", "lumayan cepat", "cepat", "aman"]
    ),
    "Produk rusak/cacat": (
        ["rusak", "pecah", "ringkih", "cacat", "patah", "sobek", "hancur", "bocor", "penyok"], 
        ["tidak rusak", "ga rusak", "ngga rusak", "aman"]
    ),
    "Produk tidak sesuai pesanan": (
        ["tidak sesuai", "beda", "palsu", "kw", "salah warna", "salah ukuran", "kecewa"], 
        ["sesuai", "sama", "original", "ori", "pas"]
    ),
    "Barang kurang/hilang": (
        ["kurang", "hilang", "tidak lengkap", "ketinggalan", "kosong"],
        ["lengkap", "pas", "sesuai", "tidak kurang"]
    ),
    "Respon penjual buruk": (
        ["respon", "chat", "dibalas", "lambat", "judes", "cuek", "admin", "seller", "bintang 1", "tidak sopan", "sombong"], 
        ["cepat", "ramah", "baik", "tanggung jawab"]
    ),
    "Kemasan kurang aman": (
        ["kemasan", "packing", "pengemasan", "tipis", "bolong", "terbuka", "tanpa bubble"], 
        ["aman", "rapi", "tebal", "kardus", "bubble"]
    ),
    "Bahan tidak berkualitas": (
        ["tipis", "panas", "gatal", "murahan", "kasar", "keras", "kaku", "bau"],
        ["tebal", "adem", "nyaman", "halus", "lembut", "wangi"]
    ),
    "Produk cepat rusak/luntur": (
        ["cepat rusak", "baru dipakai", "luntur", "gampang putus", "mengelupas", "copot"],
        ["awet", "kuat", "tahan lama"]
    ),
    "Deskripsi produk menipu": (
        ["menipu", "ekspektasi", "beda foto", "bohong", "jebakan", "tidak realpict"],
        ["sesuai foto", "realpict", "sama dengan foto"]
    ),
    "Fungsionalitas bermasalah": (
        ["mati", "error", "macet", "tidak nyala", "tidak bisa dipakai", "rusak total", "tidak berfungsi"],
        ["berfungsi", "normal", "nyala", "lancar"]
    ),
    "Kedaluwarsa / Basi": (
        ["expired", "basi", "tengik", "bau", "jamur", "kadaluarsa"],
        ["fresh", "baru", "segar", "masih lama"]
    ),
    "Harga & Ongkir Mahal": (
        ["ongkir mahal", "overprice", "terlalu mahal", "tidak sepadan"],
        ["murah", "gratis ongkir", "worth it"]
    )
}

def analyze_insights(rows: list[ReviewRow], predictions: list[dict]) -> dict:
    aspect_counts: Counter = Counter()
    aspect_sentiments: dict[str, Counter] = defaultdict(Counter)
    
    complaint_counts: Counter = Counter()
    negative_total = 0
    
    strengths: list[str] = []
    total_reviews = len(rows)

    for row, prediction in zip(rows, predictions):
        text = row.review_text.lower()
        sentiment = prediction["sentiment"]

        for aspect, keywords in ASPECT_KEYWORDS.items():
            if any(kw in text for kw in keywords):
                aspect_counts[aspect] += 1
                aspect_sentiments[aspect][sentiment] += 1
                
        if sentiment == "negatif":
            negative_total += 1
            matched = False
            for complaint, (must_contain, must_not_contain) in COMPLAINT_RULES.items():
                if any(kw in text for kw in must_contain) and not any(n_kw in text for n_kw in must_not_contain):
                    complaint_counts[complaint] += 1
                    matched = True
            
            if not matched:
                complaint_counts["Keluhan lainnya"] += 1
                
        if sentiment == "positif":
            if (len(text) > 10 & len(text) < 16):
                strengths.append(row.review_text)

    # Format Aspek
    aspect_insights = []
    for aspect, count in aspect_counts.most_common():
        sentiments = aspect_sentiments[aspect]
        dominant_sentiment = sentiments.most_common(1)[0][0] if sentiments else "netral"
        aspect_insights.append({
            "label": aspect,
            "jumlah": count,
            "persen": round((count / total_reviews) * 100, 1) if total_reviews else 0,
            "dominant_sentiment": dominant_sentiment,
        })
        
    # Format Keluhan
    complaints = [
        {
            "label": label,
            "jumlah": count,
            "persen": round((count / negative_total) * 100, 1) if negative_total else 0,
        }
        for label, count in complaint_counts.most_common()
    ]
    
    strengths.sort(key=len, reverse=True)
    top_strengths = strengths[:5]
    
    if not top_strengths:
        all_positives = [r.review_text for r, p in zip(rows, predictions) if p["sentiment"] == "positif"]
        all_positives.sort(key=len, reverse=True)
        top_strengths = all_positives[:5]

    return {
        "aspect_insights": aspect_insights,
        "complaints": complaints,
        "strengths": top_strengths
    }

def build_recommendations(complaints: list[dict], aspect_insights: list[dict], strengths: list[str]) -> list[dict]:
    from src.shared.config import settings
    import requests
    import logging
    
    logger = logging.getLogger(__name__)

    # Jika microservice URL dikonfigurasi, tembak ke microservice
    if settings.insight_microservice_url:
        try:
            logger.info(f"Memanggil Insight Microservice di {settings.insight_microservice_url}...")
            response = requests.post(
                f"{settings.insight_microservice_url.rstrip('/')}/api/recommendations",
                json={
                    "complaints": complaints,
                    "aspect_insights": aspect_insights,
                    "strengths": strengths
                },
                timeout=60
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Gagal memanggil Insight Microservice: {e}. Jatuh kembali ke proses lokal/rule-based.")

    # Jika tidak ada microservice, atau microservice gagal, coba panggil fungsi gemini_service lokal
    from src.api_app.services.gemini_service import generate_gemini_recommendations
    
    gemini_recs = generate_gemini_recommendations(complaints, aspect_insights, strengths)
    if gemini_recs:
        return gemini_recs

    # Fallback ke rule-based jika Gemini gagal atau API key tidak ada
    recommendations = []

    for complaint in complaints[:3]:
        label = complaint["label"]
        if "Pengiriman" in label:
            recommendations.append(
                {
                    "judul": "Evaluasi Proses Pengiriman",
                    "deskripsi": "Keluhan pengiriman cukup menonjol. Pertimbangkan evaluasi ekspedisi, estimasi waktu, dan komunikasi status pesanan.",
                    "source": "rule_based",
                }
            )
        elif "rusak" in label or "pecah" in label or "Kemasan" in label:
            recommendations.append(
                {
                    "judul": "Perkuat Kualitas dan Kemasan",
                    "deskripsi": "Ada keluhan terkait produk rusak atau kemasan. Gunakan pelindung tambahan dan lakukan pengecekan sebelum dikirim.",
                    "source": "rule_based",
                }
            )
        elif "Respon" in label:
            recommendations.append(
                {
                    "judul": "Tingkatkan Kecepatan Respon",
                    "deskripsi": "Respon penjual yang lambat dapat menurunkan kepuasan. Siapkan template balasan dan target waktu respon.",
                    "source": "rule_based",
                }
            )

    if not recommendations and aspect_insights:
        recommendations.append(
            {
                "judul": f"Pantau Aspek {aspect_insights[0]['label']}",
                "deskripsi": "Aspek ini paling sering dibicarakan pelanggan. Gunakan sebagai prioritas pemantauan kualitas layanan.",
                "source": "rule_based",
            }
        )

    return recommendations

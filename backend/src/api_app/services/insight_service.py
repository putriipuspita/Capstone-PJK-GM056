from collections import Counter, defaultdict

from src.utils.csv_reader import ReviewRow


ASPECT_KEYWORDS = {
    "Pengiriman": ["pengiriman", "kirim", "kurir", "sampai", "sampe", "resi", "lama"],
    "Kualitas Produk": ["kualitas", "bagus", "rusak", "pecah", "palsu", "material", "ringkih"],
    "Harga": ["harga", "murah", "mahal", "merakyat", "terjangkau"],
    "Pelayanan": ["penjual", "respon", "chat", "ramah", "dibalas", "tanggung jawab"],
    "Kemasan": ["kemasan", "packing", "pengemasan", "bungkus", "paket"],
}

COMPLAINT_RULES = {
    "Pengiriman lama": ["pengiriman lama", "lama", "sampai lama", "sampe lama"],
    "Produk rusak atau pecah": ["rusak", "pecah", "ringkih"],
    "Produk tidak sesuai": ["tidak sesuai", "beda", "palsu"],
    "Respon penjual lambat": ["respon", "chat", "dibalas", "lambat"],
    "Kemasan kurang baik": ["kemasan", "packing", "pengemasan"],
}


def build_aspect_insights(rows: list[ReviewRow], predictions: list[dict]) -> list[dict]:
    aspect_counts: Counter = Counter()
    aspect_sentiments: dict[str, Counter] = defaultdict(Counter)
    total_reviews = len(rows)

    for row, prediction in zip(rows, predictions):
        text = row.review_text.lower()
        for aspect, keywords in ASPECT_KEYWORDS.items():
            if any(keyword in text for keyword in keywords):
                aspect_counts[aspect] += 1
                aspect_sentiments[aspect][prediction["sentiment"]] += 1

    insights = []
    for aspect, count in aspect_counts.most_common():
        sentiments = aspect_sentiments[aspect]
        dominant_sentiment = sentiments.most_common(1)[0][0] if sentiments else "netral"
        insights.append(
            {
                "aspect": aspect,
                "count": count,
                "percentage": round((count / total_reviews) * 100, 1) if total_reviews else 0,
                "dominant_sentiment": dominant_sentiment,
            }
        )

    return insights


def build_complaints(rows: list[ReviewRow], predictions: list[dict]) -> list[dict]:
    complaint_counts: Counter = Counter()
    negative_total = 0

    for row, prediction in zip(rows, predictions):
        if prediction["sentiment"] != "negatif":
            continue

        negative_total += 1
        text = row.review_text.lower()
        matched = False

        for complaint, keywords in COMPLAINT_RULES.items():
            if any(keyword in text for keyword in keywords):
                complaint_counts[complaint] += 1
                matched = True

        if not matched:
            complaint_counts["Keluhan lainnya"] += 1

    return [
        {
            "label": label,
            "count": count,
            "percentage": round((count / negative_total) * 100, 1) if negative_total else 0,
        }
        for label, count in complaint_counts.most_common()
    ]


def build_strengths(rows: list[ReviewRow], predictions: list[dict], limit: int = 5) -> list[str]:
    strengths: list[str] = []

    for row, prediction in zip(rows, predictions):
        if prediction["sentiment"] == "positif":
            strengths.append(row.review_text)

        if len(strengths) >= limit:
            break

    return strengths


def build_recommendations(complaints: list[dict], aspect_insights: list[dict]) -> list[dict]:
    recommendations = []

    for complaint in complaints[:3]:
        label = complaint["label"]
        if "Pengiriman" in label:
            recommendations.append(
                {
                    "title": "Evaluasi Proses Pengiriman",
                    "description": "Keluhan pengiriman cukup menonjol. Pertimbangkan evaluasi ekspedisi, estimasi waktu, dan komunikasi status pesanan.",
                    "source": "rule_based",
                }
            )
        elif "rusak" in label or "pecah" in label or "Kemasan" in label:
            recommendations.append(
                {
                    "title": "Perkuat Kualitas dan Kemasan",
                    "description": "Ada keluhan terkait produk rusak atau kemasan. Gunakan pelindung tambahan dan lakukan pengecekan sebelum dikirim.",
                    "source": "rule_based",
                }
            )
        elif "Respon" in label:
            recommendations.append(
                {
                    "title": "Tingkatkan Kecepatan Respon",
                    "description": "Respon penjual yang lambat dapat menurunkan kepuasan. Siapkan template balasan dan target waktu respon.",
                    "source": "rule_based",
                }
            )

    if not recommendations and aspect_insights:
        recommendations.append(
            {
                "title": f"Pantau Aspek {aspect_insights[0]['aspect']}",
                "description": "Aspek ini paling sering dibicarakan pelanggan. Gunakan sebagai prioritas pemantauan kualitas layanan.",
                "source": "rule_based",
            }
        )

    return recommendations

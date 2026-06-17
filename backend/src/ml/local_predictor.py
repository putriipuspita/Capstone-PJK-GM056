from transformers import pipeline

from src.shared.config import settings


class LocalSentimentPredictor:
    def __init__(self) -> None:
        if not settings.huggingface_model_id:
            raise RuntimeError("HUGGINGFACE_MODEL_ID belum dikonfigurasi.")

        # Inisialisasi pipeline sentiment analysis dari Transformers
        # Task "text-classification" digunakan untuk model sentiment
        self.classifier = pipeline(
            "text-classification",
            model=settings.huggingface_model_id,
            # Jika punya GPU lokal bisa tambahkan device=0, tapi kita default ke CPU
        )

        self._id2label = self._build_id2label()

    def predict_sentiments(self, texts: list[str]) -> list[dict]:
        if not texts:
            return []

        # Pipeline mengembalikan array of dict, misal: [{'label': 'LABEL_1', 'score': 0.9}]
        predictions = self.classifier(texts)

        return [
            {
                "text": text,
                "sentiment": self._normalize_label(str(prediction["label"])),
                "confidence": round(float(prediction["score"]), 4),
            }
            for text, prediction in zip(texts, predictions)
        ]

    def _normalize_label(self, label: str) -> str:
        normalized = label.strip().lower()
        aliases = {
            "negative": "negatif",
            "negatif": "negatif",
            "neg": "negatif",
            "neutral": "netral",
            "netral": "netral",
            "neu": "netral",
            "positive": "positif",
            "positif": "positif",
            "pos": "positif",
        }

        if normalized in aliases:
            return aliases[normalized]

        if normalized.startswith("label_"):
            label_id = normalized.replace("label_", "", 1)
            if label_id.isdigit():
                return self._normalize_label(self._id2label.get(int(label_id), label))

        raise RuntimeError(f"Label sentiment dari Hugging Face tidak dikenali: {label}.")

    def _build_id2label(self) -> dict[int, str]:
        labels = [label.strip() for label in settings.huggingface_id2label.split(",") if label.strip()]
        return {index: label for index, label in enumerate(labels)}

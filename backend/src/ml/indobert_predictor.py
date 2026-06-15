from src.ml.predictor import SentimentLabel, SentimentPrediction
from src.shared.config import settings


class IndoBertSentimentPredictor:
    def __init__(self) -> None:
        if not settings.indobert_model_path:
            raise RuntimeError(
                "INDOBERT_MODEL_PATH belum diisi. Isi dengan path folder model final atau Hugging Face model id."
            )

        try:
            import torch
            from transformers import AutoModelForSequenceClassification, AutoTokenizer
        except ImportError as exc:
            raise RuntimeError(
                "Dependency IndoBERT belum terpasang. Install dependency ML dari requirements-ml.txt "
                "sebelum memakai SENTIMENT_PREDICTOR_PROVIDER=indobert."
            ) from exc

        self._torch = torch
        self._tokenizer = AutoTokenizer.from_pretrained(settings.indobert_model_path)
        self._model = AutoModelForSequenceClassification.from_pretrained(settings.indobert_model_path)
        self._model.eval()
        self._id2label = _build_id2label(self._model.config.id2label)

    def predict_sentiments(self, texts: list[str]) -> list[SentimentPrediction]:
        if not texts:
            return []

        encoded = self._tokenizer(
            texts,
            padding=True,
            truncation=True,
            max_length=settings.indobert_max_length,
            return_tensors="pt",
        )

        with self._torch.no_grad():
            outputs = self._model(**encoded)
            probabilities = self._torch.softmax(outputs.logits, dim=-1)
            confidences, label_ids = self._torch.max(probabilities, dim=-1)

        predictions: list[SentimentPrediction] = []
        for text, label_id, confidence in zip(texts, label_ids.tolist(), confidences.tolist()):
            sentiment = self._normalize_label(self._id2label.get(label_id, str(label_id)))
            predictions.append(
                {
                    "text": text,
                    "sentiment": sentiment,
                    "confidence": round(float(confidence), 4),
                }
            )

        return predictions

    def _normalize_label(self, label: str) -> SentimentLabel:
        normalized = label.strip().lower()
        label_aliases: dict[str, SentimentLabel] = {
            "positive": "positive",
            "positif": "positive",
            "pos": "positive",
            "neutral": "neutral",
            "netral": "neutral",
            "neu": "neutral",
            "negative": "negative",
            "negatif": "negative",
            "neg": "negative",
        }

        if normalized in label_aliases:
            return label_aliases[normalized]

        if normalized.startswith("label_"):
            label_id = normalized.replace("label_", "", 1)
            if label_id.isdigit():
                return self._normalize_label(self._id2label.get(int(label_id), label))

        raise RuntimeError(f"Label sentiment dari model tidak dikenali: {label}.")


def _build_id2label(model_id2label: dict[int, str] | dict[str, str]) -> dict[int, str]:
    configured_labels = [label.strip() for label in settings.indobert_id2label.split(",") if label.strip()]
    fallback = {index: label for index, label in enumerate(configured_labels)}

    parsed_model_labels: dict[int, str] = {}
    for key, value in model_id2label.items():
        try:
            parsed_model_labels[int(key)] = value
        except (TypeError, ValueError):
            continue

    if not parsed_model_labels:
        return fallback

    has_generic_labels = all(label.upper().startswith("LABEL_") for label in parsed_model_labels.values())
    if has_generic_labels and fallback:
        return fallback

    return parsed_model_labels

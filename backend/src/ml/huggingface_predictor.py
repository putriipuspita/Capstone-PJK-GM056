import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from src.shared.config import settings


class HuggingFaceSentimentPredictor:
    def __init__(self) -> None:
        if not settings.huggingface_model_id:
            raise RuntimeError("HUGGINGFACE_MODEL_ID belum dikonfigurasi.")

        if not settings.huggingface_api_token:
            raise RuntimeError("HUGGINGFACE_API_TOKEN belum dikonfigurasi.")

        self._id2label = _build_id2label()

    def predict_sentiments(self, texts: list[str]) -> list[dict]:
        if not texts:
            return []

        response = self._call_inference_api(texts)
        predictions = self._parse_response(response)

        if len(predictions) != len(texts):
            raise RuntimeError(
                f"Hugging Face mengembalikan {len(predictions)} prediksi untuk {len(texts)} teks."
            )

        return [
            {
                "text": text,
                "sentiment": prediction["sentiment"],
                "confidence": prediction["confidence"],
            }
            for text, prediction in zip(texts, predictions)
        ]

    def _call_inference_api(self, texts: list[str]) -> object:
        url = f"https://router.huggingface.co/hf-inference/models/{settings.huggingface_model_id}"
        body = {
            "inputs": texts,
            "options": {
                "wait_for_model": True,
            },
        }
        request = Request(
            url,
            data=json.dumps(body).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {settings.huggingface_api_token}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        try:
            with urlopen(request, timeout=settings.huggingface_timeout_seconds) as response:
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            error_body = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Hugging Face inference gagal: {exc.code} {error_body}") from exc
        except URLError as exc:
            raise RuntimeError(f"Hugging Face inference tidak bisa diakses: {exc.reason}") from exc

    def _parse_response(self, response: object) -> list[dict]:
        if isinstance(response, dict) and response.get("error"):
            raise RuntimeError(f"Hugging Face inference error: {response['error']}")

        if not isinstance(response, list):
            raise RuntimeError("Format response Hugging Face tidak valid.")

        if not response:
            return []

        if all(_is_label_score(item) for item in response):
            return [self._normalize_prediction(response)]

        predictions: list[dict] = []
        for item in response:
            if _is_label_score(item):
                predictions.append(self._normalize_prediction([item]))
            elif isinstance(item, list):
                predictions.append(self._normalize_prediction(item))
            else:
                raise RuntimeError("Item response Hugging Face tidak valid.")

        return predictions

    def _normalize_prediction(self, label_scores: list[object]) -> dict:
        valid_scores = [item for item in label_scores if _is_label_score(item)]
        if not valid_scores:
            raise RuntimeError("Response Hugging Face tidak memiliki label sentiment.")

        best = max(valid_scores, key=lambda item: float(item["score"]))
        return {
            "sentiment": self._normalize_label(str(best["label"])),
            "confidence": round(float(best["score"]), 4),
        }

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


def _build_id2label() -> dict[int, str]:
    labels = [label.strip() for label in settings.huggingface_id2label.split(",") if label.strip()]
    return {index: label for index, label in enumerate(labels)}


def _is_label_score(item: object) -> bool:
    return isinstance(item, dict) and "label" in item and "score" in item

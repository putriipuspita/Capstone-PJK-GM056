from typing import Protocol

from src.shared.config import settings


class SentimentPredictor(Protocol):
    def predict_sentiments(self, texts: list[str]) -> list[dict]:
        """Return sentiment predictions for each input text."""


def get_sentiment_predictor() -> SentimentPredictor:
    provider = settings.sentiment_predictor_provider.lower()

    if provider == "dummy":
        from src.ml.dummy_predictor import DummySentimentPredictor

        return DummySentimentPredictor()

    if provider == "huggingface":
        from src.ml.huggingface_predictor import HuggingFaceSentimentPredictor

        return HuggingFaceSentimentPredictor()

    raise RuntimeError(f"Provider sentiment tidak dikenal: {settings.sentiment_predictor_provider}.")

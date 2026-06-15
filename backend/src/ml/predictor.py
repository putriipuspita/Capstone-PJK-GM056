from typing import Literal, Protocol, TypedDict

from src.shared.config import settings


SentimentLabel = Literal["positive", "neutral", "negative"]


class SentimentPrediction(TypedDict):
    text: str
    sentiment: SentimentLabel
    confidence: float


class SentimentPredictor(Protocol):
    def predict_sentiments(self, texts: list[str]) -> list[SentimentPrediction]:
        """Return sentiment predictions for each input text."""


def get_sentiment_predictor() -> SentimentPredictor:
    provider = settings.sentiment_predictor_provider.lower()

    if provider == "dummy":
        from src.ml.dummy_predictor import DummySentimentPredictor

        return DummySentimentPredictor()

    if provider == "indobert":
        raise RuntimeError(
            "Provider indobert belum tersedia. Tetap gunakan SENTIMENT_PREDICTOR_PROVIDER=dummy "
            "sampai model IndoBERT final siap untuk inference."
        )

    raise RuntimeError(f"Provider sentiment tidak dikenal: {settings.sentiment_predictor_provider}.")

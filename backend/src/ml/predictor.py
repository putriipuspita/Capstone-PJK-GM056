from typing import Protocol


class SentimentPredictor(Protocol):
    def predict_sentiments(self, texts: list[str]) -> list[dict]:
        """Return sentiment predictions for each input text."""

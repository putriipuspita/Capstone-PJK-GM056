from src.ml.predictor import SentimentPrediction


class DummySentimentPredictor:
    def predict_sentiments(self, texts: list[str]) -> list[SentimentPrediction]:
        predictions: list[SentimentPrediction] = []

        for text in texts:
            lowered = text.lower()
            if any(word in lowered for word in ["bagus", "cepat", "mantap", "puas"]):
                sentiment = "positive"
                confidence = 0.8
            elif any(word in lowered for word in ["rusak", "lama", "buruk", "kecewa"]):
                sentiment = "negative"
                confidence = 0.8
            else:
                sentiment = "neutral"
                confidence = 0.6

            predictions.append(
                {
                    "text": text,
                    "sentiment": sentiment,
                    "confidence": confidence,
                }
            )

        return predictions

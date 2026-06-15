# Sentix Backend

FastAPI backend and AI worker for Sentix.

## Local development

Install dependencies:

```bash
pip install -r requirements.txt
```

Run API:

```bash
uvicorn src.api_app.main:app --reload
```

Run worker placeholder:

```bash
python -m src.ai_worker.main
```

## Self-hosted experiment

This branch is used to explore running Sentix without Supabase-managed services.

Target architecture:

```txt
Next.js frontend
  -> FastAPI API
      -> PostgreSQL
      -> local uploads or object storage
      -> JWT auth
      -> AI worker / model inference
```

Provider settings:

```env
AUTH_PROVIDER=supabase
STORAGE_PROVIDER=supabase
UPLOAD_DIR=uploads
SENTIMENT_PREDICTOR_PROVIDER=dummy
RECOMMENDATION_PROVIDER=rule_based
```

Migration plan:

1. Point `DATABASE_URL` to a self-hosted PostgreSQL database.
2. Move CSV storage from Supabase Storage to local uploads.
3. Replace Supabase Auth with FastAPI JWT auth.
4. Keep the existing upload, analysis, and inference flow unchanged as much as possible.

## Analysis providers

During development, keep sentiment inference on the dummy provider:

```env
SENTIMENT_PREDICTOR_PROVIDER=dummy
```

When the final IndoBERT model is ready, install the optional ML dependencies and point the backend to the exported model folder or Hugging Face model id:

```bash
pip install -r requirements-ml.txt
```

```env
SENTIMENT_PREDICTOR_PROVIDER=indobert
INDOBERT_MODEL_PATH=../model/final-indobert
INDOBERT_MAX_LENGTH=128
INDOBERT_ID2LABEL=negative,neutral,positive
```

Recommendations use rule-based logic by default. To enable Gemini:

```env
RECOMMENDATION_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_TIMEOUT_SECONDS=30
```

If Gemini is not configured or the request fails, the backend falls back to rule-based recommendations so an analysis run can still complete.

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
```

Migration plan:

1. Point `DATABASE_URL` to a self-hosted PostgreSQL database.
2. Move CSV storage from Supabase Storage to local uploads.
3. Replace Supabase Auth with FastAPI JWT auth.
4. Keep the existing upload, analysis, and inference flow unchanged as much as possible.

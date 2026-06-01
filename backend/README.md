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

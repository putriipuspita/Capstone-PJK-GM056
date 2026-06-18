# Menggunakan base image Python yang ringan
FROM python:3.11-slim

# Mengatur environment variable
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV POETRY_VIRTUALENVS_IN_PROJECT=true
# Hugging Face Spaces secara default menggunakan port 7860
ENV PORT=7860
ENV HOST=0.0.0.0

# Setup working directory
WORKDIR /app

# Install system dependencies (untuk library tertentu jika butuh build tools)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Buat user non-root (syarat wajib dari Hugging Face Spaces)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# Copy requirements terlebih dahulu untuk caching docker layer
COPY --chown=user requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy sisa folder project
COPY --chown=user . .

# Jalankan server FastAPI menggunakan uvicorn
CMD ["uvicorn", "src.api_app.main:app", "--host", "0.0.0.0", "--port", "7860"]

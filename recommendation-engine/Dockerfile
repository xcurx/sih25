# Cloud Run optimized Dockerfile for recommendation engine
# Uses slim Python image to reduce base size
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HF_HOME=/app/.cache/hf

WORKDIR /app

# System deps (optional: install libgomp for faiss performance)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first to leverage Docker layer caching
COPY requirements.txt ./requirements.txt

# Install deps
RUN pip install --no-cache-dir -r requirements.txt \
    && python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('paraphrase-MiniLM-L3-v2')"

# Copy application code
COPY app ./app
COPY init_db.py ./

# Create non-root user
RUN useradd -m appuser && chown -R appuser /app
USER appuser

# Initialize empty index if not present (safe; runs fast)
RUN python init_db.py || true

# Cloud Run listens on $PORT; default to 8080
ENV PORT=8080
EXPOSE 8080

# Disable auto-reload to avoid duplicate model processes
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]

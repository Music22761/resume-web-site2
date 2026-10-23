FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY app.py .
COPY data ./data
COPY static ./static
COPY templates ./templates

RUN useradd --create-home appuser
USER appuser

EXPOSE 8000

# PORT can be overridden by the host (Render, Railway, Cloud Run, etc.)
CMD ["sh", "-c", "exec gunicorn --bind 0.0.0.0:${PORT} --workers 2 --access-logfile - app:app"]

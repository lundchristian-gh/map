FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt /app/
COPY src/ /app
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 5000
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]

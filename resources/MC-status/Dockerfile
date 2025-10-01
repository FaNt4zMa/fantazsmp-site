# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt requirements.txt
COPY name_server.py name_server.py
COPY uuids.json uuids.json

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5010

CMD ["python", "name_server.py"]

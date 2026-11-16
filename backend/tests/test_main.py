from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

def test_logs():
    r = client.get("/api/logs")
    assert r.status_code == 200
    assert isinstance(r.json(), list)
    assert len(r.json()) > 0

def test_summarize():
    r = client.get("/api/summarize")
    assert r.status_code == 200
    assert "summary" in r.json()

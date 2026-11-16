from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Log
from ..services.mock_data import generate_logs

router = APIRouter(prefix="/api", tags=["logs"])

@router.get("/logs")
def list_logs(db: Session = Depends(get_db)):
    if db.query(Log).count() == 0:
        for r in generate_logs(60):
            db.add(Log(**r))
        db.commit()
    rows = db.query(Log).order_by(Log.timestamp.desc()).limit(100).all()
    return [
        {"id": r.id, "timestamp": r.timestamp.isoformat(), "ip": r.ip,
         "event": r.event, "severity": r.severity, "details": r.details}
        for r in rows
    ]

@router.post("/logs/refresh")
def refresh_logs(db: Session = Depends(get_db)):
    db.query(Log).delete()
    db.commit()
    for r in generate_logs(60):
        db.add(Log(**r))
    db.commit()
    return {"status": "ok", "count": 60}

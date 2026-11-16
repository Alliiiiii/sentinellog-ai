from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Log
from ..services.ai import summarize_logs

router = APIRouter(prefix="/api", tags=["ai"])

@router.get("/summarize")
def summarize(db: Session = Depends(get_db)):
    rows = db.query(Log).order_by(Log.timestamp.desc()).limit(30).all()
    logs = [{"timestamp": r.timestamp.isoformat(), "ip": r.ip,
             "event": r.event, "severity": r.severity} for r in rows]
    if not logs:
        return {"summary": "No logs available yet."}
    return {"summary": summarize_logs(logs)}

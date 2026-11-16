import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import logs, summarize

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SentinelLog AI", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(logs.router)
app.include_router(summarize.router)

@app.get("/health")
def health():
    return {"status": "ok"}

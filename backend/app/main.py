"""NetraAI — FastAPI Application Entry Point"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

# Load .env before anything else
load_dotenv()

from .database.db import init_db, SessionLocal
from .seed import run_seed
from .routers import auth, patients, screenings, doctor, admin, explainability, telehealth


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables + seed demo data."""
    print("[*] NetraAI Backend starting up...")
    init_db()

    # Seed demo data
    db = SessionLocal()
    try:
        run_seed(db)
    finally:
        db.close()

    # Ensure uploads directory exists
    upload_dir = os.getenv("UPLOAD_DIR", "./uploads")
    os.makedirs(upload_dir, exist_ok=True)

    yield
    print("[*] NetraAI Backend shutting down...")


app = FastAPI(
    title="NetraAI API",
    description=(
        "AI-Assisted Diabetic Retinopathy Screening Platform.\n\n"
        "Provides REST APIs for patient registration, fundus image screening, "
        "AI-powered DR grading, doctor review workflows, and admin analytics."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads
upload_dir = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

# Register routers under /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(patients.router, prefix="/api")
app.include_router(screenings.router, prefix="/api")
app.include_router(doctor.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(explainability.router, prefix="/api")
app.include_router(telehealth.router, prefix="/api")


@app.get("/", tags=["Health"])
def root():
    """Health check endpoint."""
    return {
        "service": "NetraAI API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
    }


@app.get("/api/health", tags=["Health"])
def health():
    """API health check."""
    return {"status": "ok", "service": "netra-ai-backend"}

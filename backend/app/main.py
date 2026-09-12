"""NetraAI — FastAPI Application Entry Point"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os

load_dotenv()

from .database.db import init_db, SessionLocal
from .seed import run_seed
from .routers import auth, patients, screenings, doctor, admin, explainability, telehealth, reports, sync


@asynccontextmanager
async def lifespan(app: FastAPI):
 
    print("[*] NetraAI Backend starting up...")
    try:
        init_db()
        db = SessionLocal()
        try:
            run_seed(db)
        finally:
            db.close()
    except Exception as e:
        print(f"[!] Warning DB init/seed: {e}")

    upload_dir = os.getenv("UPLOAD_DIR", "/tmp/uploads" if os.getenv("VERCEL") else "./uploads")
    try:
        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs(os.path.join(upload_dir, "heatmaps"), exist_ok=True)
        os.makedirs(os.path.join(upload_dir, "reports"), exist_ok=True)
    except Exception as e:
        print(f"[!] Warning creating upload directories: {e}")

    # Log AI model status
    try:
        from .services.ai_service import get_model_status
        status = get_model_status()
        print(f"[*] AI Mode: {status['inference_mode']} | Model: {status['model_name']}")
        if status['model_exists']:
            print(f"[*] Model path: {status['model_path']}")
        else:
            print(f"[*] No trained model found. Using mock predictions.")
    except Exception as e:
        print(f"[!] AI status check failed: {e}")

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


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

is_serverless = any(k in os.environ for k in ("VERCEL", "VERCEL_ENV", "AWS_LAMBDA_FUNCTION_NAME", "LAMBDA_TASK_ROOT"))
upload_dir = os.getenv("UPLOAD_DIR", "/tmp/uploads" if is_serverless else "./uploads")
try:
    os.makedirs(upload_dir, exist_ok=True)
    if os.path.isdir(upload_dir):
        app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")
except Exception as e:
    print(f"[!] Warning: /uploads static files skipped: {e}")


app.include_router(auth.router, prefix="/api")
app.include_router(patients.router, prefix="/api")
app.include_router(screenings.router, prefix="/api")
app.include_router(doctor.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(explainability.router, prefix="/api")
app.include_router(telehealth.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(sync.router, prefix="/api")


@app.get("/", tags=["Health"])
@app.get("/api", tags=["Health"])
@app.get("/api/index", tags=["Health"])
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

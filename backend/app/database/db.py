"""NetraAI — Database Configuration"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.engine.url import make_url
import os
import shutil

is_serverless = any(k in os.environ for k in ("VERCEL", "VERCEL_ENV", "AWS_LAMBDA_FUNCTION_NAME", "LAMBDA_TASK_ROOT"))

if is_serverless:
    tmp_db = "/tmp/netra_ai.db"
    src_db = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "netra_ai.db"))
    if not os.path.exists(tmp_db) and os.path.exists(src_db):
        try:
            shutil.copyfile(src_db, tmp_db)
        except Exception:
            pass
    default_db_url = "sqlite:////tmp/netra_ai.db"
else:
    default_db_url = "sqlite:///./netra_ai.db"

# Parse and sanitize DATABASE_URL from environment
raw_db_url = os.getenv("DATABASE_URL")
if raw_db_url:
    raw_db_url = raw_db_url.strip().strip('"').strip("'")

DATABASE_URL = None
if raw_db_url:
    # Fix legacy Heroku/Supabase postgres:// scheme
    if raw_db_url.startswith("postgres://"):
        raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)

    try:
        parsed = make_url(raw_db_url)
        if is_serverless and parsed.drivername == "sqlite":
            DATABASE_URL = "sqlite:////tmp/netra_ai.db"
        else:
            DATABASE_URL = raw_db_url
    except Exception as err:
        print(f"[!] Warning: Could not parse DATABASE_URL ('{raw_db_url}'): {err}. Falling back to SQLite.")
        DATABASE_URL = None

if not DATABASE_URL:
    DATABASE_URL = default_db_url

# Safely create engine with automatic fallback
try:
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
    )
except Exception as err:
    print(f"[!] Warning: Failed to create engine for '{DATABASE_URL}': {err}. Using default SQLite.")
    DATABASE_URL = default_db_url
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"[!] Warning during init_db: {e}")

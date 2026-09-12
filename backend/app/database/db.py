"""NetraAI — Database Configuration"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os
import shutil

is_serverless = bool(os.getenv("VERCEL") or os.getenv("VERCEL_ENV") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"))

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

raw_db_url = os.getenv("DATABASE_URL", default_db_url)
# Guard against read-only filesystem crash on serverless environments
if is_serverless and raw_db_url.startswith("sqlite") and not raw_db_url.startswith("sqlite:////tmp/"):
    DATABASE_URL = "sqlite:////tmp/netra_ai.db"
else:
    DATABASE_URL = raw_db_url

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

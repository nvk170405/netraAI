"""NetraAI — Database Configuration"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os
import shutil

# In Vercel serverless environment, the deployment root is read-only.
# We redirect SQLite to /tmp/netra_ai.db and copy the pre-seeded DB on cold start.
if os.getenv("VERCEL"):
    tmp_db = "/tmp/netra_ai.db"
    src_db = os.path.join(os.path.dirname(__file__), "..", "..", "netra_ai.db")
    if not os.path.exists(tmp_db) and os.path.exists(src_db):
        try:
            shutil.copyfile(src_db, tmp_db)
        except Exception:
            pass
    default_db_url = f"sqlite:///{tmp_db}"
else:
    default_db_url = "sqlite:///./netra_ai.db"

DATABASE_URL = os.getenv("DATABASE_URL", default_db_url)

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
    Base.metadata.create_all(bind=engine)

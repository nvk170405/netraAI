"""Vercel Serverless Function Entrypoint for NetraAI FastAPI Backend"""
import sys
import os

# Add backend directory to sys.path so app package is importable
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)

if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from app.main import app

# Export app directly for ASGI-compatible runners
app = app

# Export Mangum handler for AWS Lambda / Vercel Serverless runtime
try:
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
except Exception:
    handler = app

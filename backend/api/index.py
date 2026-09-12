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

# Vercel's Python ASGI runtime requires `app` to be exported.
# Note: Do NOT export a variable named `handler` here because Vercel's Python
# runtime reserves `handler` for `BaseHTTPRequestHandler` instances and will crash.
app = app

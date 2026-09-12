"""Vercel Serverless Function Entrypoint for NetraAI FastAPI Backend"""
import sys
import os

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

# Export app for Vercel WSGI/ASGI handler
app = app

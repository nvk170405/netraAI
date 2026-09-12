"""Vercel Serverless Function Entrypoint for NetraAI FastAPI Backend"""
import sys
import os
import json
import traceback

# Ensure current directory and parent directory are in sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)

for p in (parent_dir, current_dir):
    if p not in sys.path:
        sys.path.insert(0, p)


class ErrorHandlingASGIApp:
    """Wraps the ASGI application to catch unhandled exceptions and return tracebacks as JSON."""
    def __init__(self, inner_app):
        self.inner_app = inner_app

    async def __call__(self, scope, receive, send):
        try:
            await self.inner_app(scope, receive, send)
        except Exception as e:
            tb = traceback.format_exc()
            print("CRITICAL SERVERLESS EXCEPTION:\n", tb)
            if scope.get("type") == "http":
                body = json.dumps({
                    "status": "runtime_error",
                    "error": str(e),
                    "type": type(e).__name__,
                    "traceback": tb.splitlines()
                }, indent=2).encode("utf-8")
                await send({
                    "type": "http.response.start",
                    "status": 500,
                    "headers": [
                        [b"content-type", b"application/json"],
                        [b"content-length", str(len(body)).encode("utf-8")],
                        [b"access-control-allow-origin", b"*"],
                    ],
                })
                await send({
                    "type": "http.response.body",
                    "body": body,
                })
            else:
                raise


# Attempt to import the main application
try:
    from app.main import app as _real_app
    app = ErrorHandlingASGIApp(_real_app)
except Exception as startup_err:
    startup_tb = traceback.format_exc()
    print("FATAL STARTUP EXCEPTION:\n", startup_tb)

    from fastapi import FastAPI
    from fastapi.responses import JSONResponse

    app = FastAPI(title="NetraAI Diagnostics")

    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
    async def startup_diagnostics(path: str = ""):
        return JSONResponse(
            status_code=500,
            content={
                "status": "startup_import_error",
                "error": str(startup_err),
                "type": type(startup_err).__name__,
                "traceback": startup_tb.splitlines(),
                "sys_path": sys.path,
                "cwd": os.getcwd(),
                "files_in_cwd": os.listdir(os.getcwd()) if os.path.exists(os.getcwd()) else []
            }
        )

    @app.get("/")
    async def root_diagnostics():
        return await startup_diagnostics()

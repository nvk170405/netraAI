"""NetraAI — Telehealth Router"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone
import uuid

from ..database.db import get_db
from ..models.models import User
from ..services.auth import get_current_user

router = APIRouter(prefix="/telehealth", tags=["Telehealth"])

# In-memory session store for demo (no DB table needed for MVP)
_sessions: list[dict] = []


def _init_demo_sessions():
    """Seed demo telehealth sessions if empty."""
    if _sessions:
        return
    _sessions.extend([
        {
            "id": "tele-001",
            "patient_name": "Sunita Devi",
            "patient_code": "P-10291",
            "doctor_name": "Dr. Rajesh Kumar",
            "status": "scheduled",
            "scheduled_at": "2026-09-06T10:00:00",
            "notes": "Follow-up for moderate DR screening",
            "created_by": "HW001",
        },
        {
            "id": "tele-002",
            "patient_name": "Arjun Singh",
            "patient_code": "P-10293",
            "doctor_name": "Dr. Rajesh Kumar",
            "status": "completed",
            "scheduled_at": "2026-09-05T14:00:00",
            "notes": "Urgent PDR case — confirmed by specialist",
            "created_by": "HW001",
        },
        {
            "id": "tele-003",
            "patient_name": "Kavita Kumari",
            "patient_code": "P-10286",
            "doctor_name": "Dr. Priya Mehta",
            "status": "in_progress",
            "scheduled_at": "2026-09-06T09:30:00",
            "notes": "Severe DR — specialist review in progress",
            "created_by": "HW001",
        },
    ])


@router.get("/sessions")
def list_sessions(
    status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
):
    """List tele-ophthalmology sessions."""
    _init_demo_sessions()
    if status:
        return [s for s in _sessions if s["status"] == status]
    return _sessions


@router.post("/sessions", status_code=201)
def create_session(
    patient_name: str,
    patient_code: str,
    doctor_name: str,
    scheduled_at: str,
    notes: str = "",
    current_user: User = Depends(get_current_user),
):
    """Create a new telehealth session."""
    _init_demo_sessions()
    session = {
        "id": f"tele-{uuid.uuid4().hex[:6]}",
        "patient_name": patient_name,
        "patient_code": patient_code,
        "doctor_name": doctor_name,
        "status": "scheduled",
        "scheduled_at": scheduled_at,
        "notes": notes,
        "created_by": str(current_user.id),
    }
    _sessions.append(session)
    return session


@router.patch("/sessions/{session_id}")
def update_session(
    session_id: str,
    new_status: str = Query(..., description="New status: scheduled, in_progress, completed, cancelled"),
    current_user: User = Depends(get_current_user),
):
    """Update a telehealth session status."""
    _init_demo_sessions()
    valid = {"scheduled", "in_progress", "completed", "cancelled"}
    if new_status not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid}")

    for s in _sessions:
        if s["id"] == session_id:
            s["status"] = new_status
            return s

    raise HTTPException(status_code=404, detail="Session not found")

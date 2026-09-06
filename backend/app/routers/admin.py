"""NetraAI — Admin Router"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, extract
from typing import Optional

from ..database.db import get_db
from ..models.models import User, Patient, Screening
from ..schemas.schemas import AnalyticsResponse
from ..services.auth import get_current_user, require_role, hash_password

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/analytics", response_model=AnalyticsResponse)
def get_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(require_role("admin")),
):
    """Get aggregate dashboard analytics."""
    total = db.query(func.count(Screening.id)).scalar() or 0
    no_dr = db.query(func.count(Screening.id)).filter(Screening.predicted_class == 0).scalar() or 0
    mild = db.query(func.count(Screening.id)).filter(Screening.predicted_class == 1).scalar() or 0
    moderate = db.query(func.count(Screening.id)).filter(Screening.predicted_class == 2).scalar() or 0
    severe = db.query(func.count(Screening.id)).filter(Screening.predicted_class == 3).scalar() or 0
    proliferative = db.query(func.count(Screening.id)).filter(Screening.predicted_class == 4).scalar() or 0

    referrals = db.query(func.count(Screening.id)).filter(
        Screening.referral_status.in_(["recommended", "urgent"])
    ).scalar() or 0
    referral_rate = round((referrals / total * 100) if total > 0 else 0, 1)

    return AnalyticsResponse(
        total_screened=total,
        no_dr=no_dr,
        mild=mild,
        moderate=moderate,
        severe=severe,
        proliferative=proliferative,
        referral_rate=referral_rate,
    )


@router.get("/users")
def list_users(
    role: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    admin: User = Depends(require_role("admin")),
):
    """List all users, optionally filtered by role."""
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    users = query.order_by(User.created_at.desc()).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "role": u.role,
            "phone": u.phone,
            "email": u.email,
            "location": u.location,
            "created_at": u.created_at.isoformat() if u.created_at else None,
        }
        for u in users
    ]


@router.post("/users", status_code=201)
def create_user(
    name: str,
    role: str,
    phone: str,
    password: str,
    email: str = None,
    location: str = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role("admin")),
):
    """Create a new user (admin only)."""
    if role not in ("health_worker", "doctor", "admin"):
        raise HTTPException(status_code=400, detail="Invalid role")

    existing = db.query(User).filter(User.phone == phone).first()
    if existing:
        raise HTTPException(status_code=409, detail="Phone already registered")

    user = User(
        name=name,
        role=role,
        phone=phone,
        email=email,
        password_hash=hash_password(password),
        location=location,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "name": user.name, "role": user.role, "message": "User created"}


@router.get("/monthly-stats")
def monthly_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_role("admin")),
):
    """Get monthly screening counts for chart data."""
    results = (
        db.query(
            func.strftime("%Y-%m", Screening.created_at).label("month"),
            func.count(Screening.id).label("count"),
        )
        .group_by(func.strftime("%Y-%m", Screening.created_at))
        .order_by(func.strftime("%Y-%m", Screening.created_at))
        .all()
    )
    month_names = {
        "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
        "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
        "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec",
    }
    return [
        {
            "month": month_names.get(r.month.split("-")[1], r.month) if r.month else "Unknown",
            "count": r.count,
        }
        for r in results
    ]


@router.get("/high-risk")
def high_risk_cases(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    admin: User = Depends(require_role("admin")),
):
    """Get recent high-risk cases for admin dashboard."""
    screenings = (
        db.query(Screening)
        .options(joinedload(Screening.patient))
        .filter(Screening.risk_level == "high")
        .order_by(Screening.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "patientId": s.patient.patient_code if s.patient else "",
            "name": s.patient.name if s.patient else "",
            "village": s.patient.village if s.patient else "",
            "result": s.predicted_label or "Pending",
            "confidence": s.confidence,
            "date": s.created_at.strftime("%Y-%m-%d") if s.created_at else "",
        }
        for s in screenings
    ]


@router.get("/village-stats")
def village_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_role("admin")),
):
    """Get screening counts grouped by village."""
    results = (
        db.query(
            Patient.village,
            func.count(Screening.id).label("count"),
        )
        .join(Screening, Screening.patient_id == Patient.id)
        .filter(Patient.village.isnot(None))
        .group_by(Patient.village)
        .order_by(func.count(Screening.id).desc())
        .all()
    )
    return [{"name": r.village, "count": r.count} for r in results]

"""NetraAI — Doctor Router"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timezone
from typing import Optional

from ..database.db import get_db
from ..models.models import User, Screening, Patient, Explanation, DoctorReview
from ..schemas.schemas import DoctorReviewCreate, DoctorReviewResponse, DoctorCaseResponse
from ..services.auth import get_current_user, require_role

router = APIRouter(prefix="/doctor", tags=["Doctor"])


@router.get("/cases")
def list_doctor_cases(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    doctor: User = Depends(require_role("doctor", "admin")),
):
    """List cases pending doctor review.

    Returns screenings that need review (referral/review status) joined
    with patient data, formatted for the doctor dashboard.
    """
    query = (
        db.query(Screening)
        .options(joinedload(Screening.patient), joinedload(Screening.review))
        .filter(Screening.status.in_(["referral", "review", "escalated"]))
    )

    if status_filter == "pending":
        query = query.filter(
            (Screening.review == None) |
            (Screening.review.has(DoctorReview.status == "pending"))
        )
    elif status_filter == "reviewed":
        query = query.filter(
            Screening.review.has(DoctorReview.status == "reviewed")
        )

    screenings = query.order_by(Screening.created_at.desc()).offset(skip).limit(limit).all()

    cases = []
    for s in screenings:
        # Determine priority from risk
        if s.risk_level == "high" or (s.predicted_class and s.predicted_class >= 3):
            pri = "HIGH"
        elif s.risk_level == "moderate" or (s.predicted_class and s.predicted_class == 2):
            pri = "MEDIUM"
        else:
            pri = "LOW"

        if priority and pri != priority.upper():
            continue

        review_status = "pending"
        if s.review and s.review.status:
            review_status = s.review.status

        cases.append({
            "id": f"dc-{s.id:03d}",
            "screening_id": s.id,
            "patientId": s.patient.patient_code if s.patient else "",
            "patientName": s.patient.name if s.patient else "",
            "age": s.patient.age if s.patient else None,
            "gender": s.patient.gender if s.patient else None,
            "village": s.patient.village if s.patient else None,
            "diabetesDuration": s.patient.diabetes_duration if s.patient else None,
            "result": s.predicted_label or "Pending",
            "confidence": s.confidence,
            "priority": pri,
            "status": review_status,
            "date": s.created_at.strftime("%Y-%m-%d") if s.created_at else "",
        })
    return cases


@router.get("/cases/{screening_id}")
def get_case_detail(
    screening_id: int,
    db: Session = Depends(get_db),
    doctor: User = Depends(require_role("doctor", "admin")),
):
    """Get full detail for a specific case."""
    screening = (
        db.query(Screening)
        .options(
            joinedload(Screening.patient),
            joinedload(Screening.explanation),
            joinedload(Screening.review),
        )
        .filter(Screening.id == screening_id)
        .first()
    )
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")

    return {
        "screening_id": screening.id,
        "patient": {
            "id": screening.patient.id,
            "patient_code": screening.patient.patient_code,
            "name": screening.patient.name,
            "age": screening.patient.age,
            "gender": screening.patient.gender,
            "village": screening.patient.village,
            "phone": screening.patient.phone,
            "diabetes_duration": screening.patient.diabetes_duration,
        } if screening.patient else None,
        "image_url": screening.image_url,
        "image_quality": screening.image_quality,
        "prediction": {
            "class": screening.predicted_class,
            "label": screening.predicted_label,
            "confidence": screening.confidence,
            "probabilities": {
                "no_dr": screening.prob_no_dr,
                "mild": screening.prob_mild,
                "moderate": screening.prob_moderate,
                "severe": screening.prob_severe,
                "proliferative": screening.prob_proliferative,
            },
        },
        "risk_level": screening.risk_level,
        "referral_status": screening.referral_status,
        "status": screening.status,
        "date": screening.created_at.strftime("%Y-%m-%d") if screening.created_at else "",
        "explanation": {
            "heatmap_url": screening.explanation.heatmap_url,
            "text": screening.explanation.explanation_text,
        } if screening.explanation else None,
        "review": {
            "id": screening.review.id,
            "doctor_id": screening.review.doctor_id,
            "notes": screening.review.notes,
            "status": screening.review.status,
            "reviewed_at": screening.review.reviewed_at.isoformat() if screening.review.reviewed_at else None,
        } if screening.review else None,
    }


@router.post("/review/{screening_id}", response_model=DoctorReviewResponse, status_code=201)
def submit_review(
    screening_id: int,
    body: DoctorReviewCreate,
    db: Session = Depends(get_db),
    doctor: User = Depends(require_role("doctor")),
):
    """Submit a doctor's review for a screening."""
    screening = db.query(Screening).filter(Screening.id == screening_id).first()
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")

    # Check for existing review
    existing = db.query(DoctorReview).filter(DoctorReview.screening_id == screening_id).first()
    if existing:
        # Update existing review
        existing.notes = body.notes
        existing.status = body.status
        existing.reviewed_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(existing)
        return existing

    review = DoctorReview(
        screening_id=screening_id,
        doctor_id=doctor.id,
        notes=body.notes,
        status=body.status,
        reviewed_at=datetime.now(timezone.utc),
    )
    db.add(review)

    # Update screening status
    screening.status = "complete" if body.status == "reviewed" else screening.status
    db.commit()
    db.refresh(review)
    return review

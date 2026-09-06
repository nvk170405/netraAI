"""NetraAI — Screening Router"""
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from datetime import datetime, timezone
import os
import uuid
import shutil

from ..database.db import get_db
from ..models.models import User, Patient, Screening, Explanation
from ..schemas.schemas import ScreeningResponse
from ..services.auth import get_current_user
from ..services.ai_service import predict, check_image_quality

router = APIRouter(prefix="/screenings", tags=["Screenings"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")


@router.post("", status_code=201)
def create_screening(
    patient_id: Optional[int] = Form(None),
    patient_code: Optional[str] = Form(None),
    image: UploadFile = File(None),
    demo_case: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new screening.

    Upload a fundus image (or skip for mock). The mock AI service will
    generate a prediction. If demo_case is provided (no_dr, moderate, severe),
    a predefined result is returned.
    """
    # Verify or lookup patient
    patient = None
    if patient_id:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient and patient_code:
        patient = db.query(Patient).filter(Patient.patient_code == patient_code).first()
    if not patient and patient_id:
        # Check if patient_id was passed as code
        patient = db.query(Patient).filter(Patient.patient_code == str(patient_id)).first()

    # If still not found, create a patient so screening can be persisted
    if not patient:
        code = patient_code or f"P-{uuid.uuid4().hex[:6].upper()}"
        patient = Patient(
            patient_code=code,
            name="Screening Patient",
            age=55,
            gender="Unknown",
            village="Demo Village",
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)

    # Save uploaded image
    image_url = None
    image_path = None
    if image and image.filename:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        ext = os.path.splitext(image.filename)[1] or ".jpg"
        filename = f"{uuid.uuid4().hex}{ext}"
        image_path = os.path.join(UPLOAD_DIR, filename)
        with open(image_path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_url = f"/uploads/{filename}"

    # Check image quality (mock)
    quality = check_image_quality(image_path)

    # Run AI prediction (mock or real)
    result = predict(image_path, demo_case=demo_case)

    # Determine risk and referral
    pred_class = result["predicted_class"]
    risk_level = result["risk_level"]
    referral = "none"
    if pred_class >= 3:
        referral = "urgent"
    elif pred_class >= 2:
        referral = "recommended"
    elif pred_class >= 1:
        referral = "consider"

    status_val = "complete"
    if referral in ("urgent", "recommended"):
        status_val = "referral"
    elif referral == "consider":
        status_val = "review"

    probs = result["probabilities"]

    screening = Screening(
        patient_id=patient.id,
        image_url=image_url,
        image_quality=quality["overall"],
        predicted_class=pred_class,
        predicted_label=result["prediction"],
        confidence=result["confidence"],
        prob_no_dr=probs.get("no_dr", 0),
        prob_mild=probs.get("mild", 0),
        prob_moderate=probs.get("moderate", 0),
        prob_severe=probs.get("severe", 0),
        prob_proliferative=probs.get("proliferative", 0),
        risk_level=risk_level,
        referral_status=referral,
        status=status_val,
    )
    db.add(screening)
    db.commit()
    db.refresh(screening)

    # Create explanation record
    explanation = Explanation(
        screening_id=screening.id,
        heatmap_url=None,
        explanation_text=result.get("referral_recommendation", ""),
    )
    db.add(explanation)
    db.commit()

    return {
        "screening_id": screening.id,
        "patient_id": patient_id,
        "patient_code": patient.patient_code,
        "patient_name": patient.name,
        "image_quality": quality,
        "prediction": {
            "class": pred_class,
            "label": result["prediction"],
            "confidence": result["confidence"],
            "probabilities": probs,
        },
        "risk_level": risk_level,
        "referral_status": referral,
        "referral_recommendation": result.get("referral_recommendation", ""),
        "status": status_val,
        "is_mock": result.get("is_mock", False),
    }


@router.get("/recent")
def recent_screenings(
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the most recent screenings for dashboard feed."""
    screenings = (
        db.query(Screening)
        .options(joinedload(Screening.patient))
        .order_by(Screening.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": f"s-{s.id:03d}",
            "patientId": s.patient.patient_code if s.patient else "",
            "patientName": s.patient.name if s.patient else "",
            "result": s.predicted_label or "Pending",
            "confidence": s.confidence,
            "status": s.status,
            "date": s.created_at.strftime("%Y-%m-%d") if s.created_at else "",
            "riskLevel": s.risk_level or "low",
        }
        for s in screenings
    ]


@router.get("", response_model=list[ScreeningResponse])
def list_screenings(
    status: Optional[str] = Query(None),
    risk_level: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List screenings with optional filters."""
    query = db.query(Screening)
    if status:
        query = query.filter(Screening.status == status)
    if risk_level:
        query = query.filter(Screening.risk_level == risk_level)
    return query.order_by(Screening.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{screening_id}")
def get_screening(
    screening_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get full screening detail with patient, explanation, and review data."""
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

    resp = {
        "id": screening.id,
        "patient": {
            "id": screening.patient.id,
            "patient_code": screening.patient.patient_code,
            "name": screening.patient.name,
            "age": screening.patient.age,
            "gender": screening.patient.gender,
            "village": screening.patient.village,
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
        "created_at": screening.created_at.isoformat() if screening.created_at else None,
        "explanation": {
            "heatmap_url": screening.explanation.heatmap_url,
            "text": screening.explanation.explanation_text,
        } if screening.explanation else None,
        "review": {
            "id": screening.review.id,
            "doctor_id": screening.review.doctor_id,
            "notes": screening.review.notes,
            "status": screening.review.status,
            "reviewed_at": screening.review.reviewed_at.isoformat() if screening.review and screening.review.reviewed_at else None,
        } if screening.review else None,
    }
    return resp


@router.patch("/{screening_id}/status")
def update_screening_status(
    screening_id: int,
    new_status: str = Query(..., description="New status value"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update the status of a screening."""
    screening = db.query(Screening).filter(Screening.id == screening_id).first()
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")

    valid = {"pending", "complete", "review", "referral", "escalated"}
    if new_status not in valid:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid}")

    screening.status = new_status
    db.commit()
    return {"message": "Status updated", "screening_id": screening_id, "status": new_status}

"""NetraAI — Patient Router"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from ..database.db import get_db
from ..models.models import User, Patient
from ..schemas.schemas import PatientCreate, PatientResponse
from ..services.auth import get_current_user

router = APIRouter(prefix="/patients", tags=["Patients"])


def _generate_patient_code(db: Session) -> str:
    """Generate the next sequential patient code like P-10294."""
    last = db.query(Patient).order_by(Patient.id.desc()).first()
    if last and last.patient_code.startswith("P-"):
        try:
            num = int(last.patient_code.split("-")[1]) + 1
        except ValueError:
            num = 10300
    else:
        num = 10289
    return f"P-{num}"


@router.post("", response_model=PatientResponse, status_code=201)
def create_patient(
    body: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Register a new patient."""
    # Auto-generate code if not provided or if provided code already exists
    code = body.patient_code
    if not code:
        code = _generate_patient_code(db)
    else:
        existing = db.query(Patient).filter(Patient.patient_code == code).first()
        if existing:
            code = _generate_patient_code(db)

    patient = Patient(
        patient_code=code,
        name=body.name,
        age=body.age,
        gender=body.gender,
        phone=body.phone,
        village=body.village,
        diabetes_duration=body.diabetes_duration,
        existing_eye_problems=body.existing_eye_problems,
        previous_screening=body.previous_screening,
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.get("", response_model=list[PatientResponse])
def list_patients(
    search: Optional[str] = Query(None, description="Search by name, code, or village"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List patients with optional search and pagination."""
    query = db.query(Patient)
    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                Patient.name.ilike(term),
                Patient.patient_code.ilike(term),
                Patient.village.ilike(term),
            )
        )
    return query.order_by(Patient.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a patient by ID."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.get("/code/{patient_code}", response_model=PatientResponse)
def get_patient_by_code(
    patient_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a patient by their unique patient code."""
    patient = db.query(Patient).filter(Patient.patient_code == patient_code).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

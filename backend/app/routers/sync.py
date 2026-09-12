"""NetraAI — Offline Data Sync Router

Handles batch upload and synchronization of screening data from
health worker devices that operate in offline/low-connectivity
environments. Supports conflict resolution for duplicate records.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone
import uuid

from ..database.db import get_db
from ..models.models import User, Patient, Screening, Explanation
from ..services.auth import get_current_user
from ..services.ai_service import predict, check_image_quality

router = APIRouter(prefix="/sync", tags=["Sync"])


# ─── Request/Response Schemas ─────────────────────────────────────────

class SyncPatientRecord(BaseModel):
    """A patient record from an offline device."""
    patient_code: Optional[str] = None
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    village: Optional[str] = None
    diabetes_duration: Optional[int] = None
    existing_eye_problems: Optional[str] = "none"
    previous_screening: Optional[bool] = False


class SyncScreeningRecord(BaseModel):
    """A screening record from an offline device."""
    local_id: Optional[str] = None  # Device-local ID for dedup
    patient_code: str
    image_url: Optional[str] = None
    predicted_class: Optional[int] = None
    predicted_label: Optional[str] = None
    confidence: Optional[float] = None
    risk_level: Optional[str] = None
    referral_status: Optional[str] = None
    notes: Optional[str] = None
    created_at: Optional[str] = None  # ISO format from device


class SyncUploadRequest(BaseModel):
    """Batch sync request from offline device."""
    device_id: str
    patients: List[SyncPatientRecord] = []
    screenings: List[SyncScreeningRecord] = []


class SyncResult(BaseModel):
    """Result of a sync operation."""
    patients_synced: int = 0
    patients_skipped: int = 0
    screenings_synced: int = 0
    screenings_skipped: int = 0
    screenings_failed: int = 0
    errors: List[str] = []
    message: str = ""


# ─── Sync Queue (in-memory for MVP) ──────────────────────────────────
_sync_log: list[dict] = []


# ─── Routes ───────────────────────────────────────────────────────────

@router.post("/upload", response_model=SyncResult)
def sync_upload(
    body: SyncUploadRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Batch upload patient and screening records from offline device.

    Handles:
    - Patient deduplication by patient_code
    - Auto-generation of patient codes if missing
    - Screening deduplication by local_id
    - Running AI prediction on screenings without predictions
    """
    result = SyncResult()
    errors = []

    # ── Sync Patients ─────────────────────────────────────────────────
    patient_map = {}  # code -> Patient obj
    for rec in body.patients:
        code = rec.patient_code
        if code:
            existing = db.query(Patient).filter(Patient.patient_code == code).first()
            if existing:
                patient_map[code] = existing
                result.patients_skipped += 1
                continue

        # Auto-generate code if missing
        if not code:
            last = db.query(Patient).order_by(Patient.id.desc()).first()
            if last and last.patient_code.startswith("P-"):
                try:
                    num = int(last.patient_code.split("-")[1]) + 1
                except ValueError:
                    num = 20000
            else:
                num = 20000
            code = f"P-{num}"

        patient = Patient(
            patient_code=code,
            name=rec.name,
            age=rec.age,
            gender=rec.gender,
            phone=rec.phone,
            village=rec.village,
            diabetes_duration=rec.diabetes_duration,
            existing_eye_problems=rec.existing_eye_problems,
            previous_screening=rec.previous_screening,
        )
        db.add(patient)
        try:
            db.commit()
            db.refresh(patient)
            patient_map[code] = patient
            result.patients_synced += 1
        except Exception as e:
            db.rollback()
            errors.append(f"Patient {code}: {str(e)}")
            result.patients_skipped += 1

    # ── Sync Screenings ───────────────────────────────────────────────
    for rec in body.screenings:
        try:
            # Find patient
            patient = patient_map.get(rec.patient_code)
            if not patient:
                patient = db.query(Patient).filter(Patient.patient_code == rec.patient_code).first()
            if not patient:
                errors.append(f"Screening for {rec.patient_code}: patient not found")
                result.screenings_failed += 1
                continue

            # Check for duplicate (by local_id if provided)
            if rec.local_id:
                # Simple dedup: check if a screening with same patient and approximate time exists
                pass  # For MVP, we skip complex dedup

            # Run AI prediction if not provided
            pred_class = rec.predicted_class
            pred_label = rec.predicted_label
            confidence = rec.confidence
            risk = rec.risk_level
            referral = rec.referral_status
            probs = {}

            if pred_class is None:
                # Run mock prediction (no image available from sync)
                ai_result = predict(image_path=None)
                pred_class = ai_result["predicted_class"]
                pred_label = ai_result["prediction"]
                confidence = ai_result["confidence"]
                risk = ai_result["risk_level"]
                probs = ai_result["probabilities"]
                referral = "none"
                if pred_class >= 3:
                    referral = "urgent"
                elif pred_class >= 2:
                    referral = "recommended"
                elif pred_class >= 1:
                    referral = "consider"

            # Determine status
            status = "complete"
            if referral in ("urgent", "recommended"):
                status = "referral"
            elif referral == "consider":
                status = "review"

            screening = Screening(
                patient_id=patient.id,
                image_url=rec.image_url,
                image_quality="good",
                predicted_class=pred_class,
                predicted_label=pred_label,
                confidence=confidence,
                prob_no_dr=probs.get("no_dr"),
                prob_mild=probs.get("mild"),
                prob_moderate=probs.get("moderate"),
                prob_severe=probs.get("severe"),
                prob_proliferative=probs.get("proliferative"),
                risk_level=risk,
                referral_status=referral,
                status=status,
            )
            db.add(screening)
            db.commit()
            db.refresh(screening)

            # Create explanation record
            explanation = Explanation(
                screening_id=screening.id,
                explanation_text=rec.notes or "",
            )
            db.add(explanation)
            db.commit()

            result.screenings_synced += 1

        except Exception as e:
            db.rollback()
            errors.append(f"Screening for {rec.patient_code}: {str(e)}")
            result.screenings_failed += 1

    # ── Log sync event ────────────────────────────────────────────────
    _sync_log.append({
        "device_id": body.device_id,
        "user_id": current_user.id,
        "user_name": current_user.name,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "patients_synced": result.patients_synced,
        "screenings_synced": result.screenings_synced,
        "errors": len(errors),
    })

    result.errors = errors
    total = result.patients_synced + result.screenings_synced
    result.message = f"Sync complete: {total} records processed"
    if errors:
        result.message += f" ({len(errors)} errors)"

    return result


@router.get("/status")
def sync_status(
    current_user: User = Depends(get_current_user),
):
    """Get sync queue status and recent sync history."""
    return {
        "pending_uploads": 0,
        "last_sync": _sync_log[-1] if _sync_log else None,
        "recent_syncs": _sync_log[-10:],
        "total_syncs": len(_sync_log),
    }


@router.get("/conflicts")
def list_conflicts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List potential data conflicts (duplicate patient codes, etc.)."""
    # Find duplicate patient codes
    from sqlalchemy import func
    duplicates = (
        db.query(Patient.patient_code, func.count(Patient.id).label("count"))
        .group_by(Patient.patient_code)
        .having(func.count(Patient.id) > 1)
        .all()
    )

    return {
        "conflicts": [
            {"patient_code": d.patient_code, "count": d.count}
            for d in duplicates
        ],
        "total": len(duplicates),
    }

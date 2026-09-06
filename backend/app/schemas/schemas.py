"""NetraAI — Pydantic Schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# Auth
class LoginRequest(BaseModel):
    employee_id: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

# Patient
class PatientCreate(BaseModel):
    patient_code: str
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    village: Optional[str] = None
    diabetes_duration: Optional[int] = None
    existing_eye_problems: Optional[str] = "none"
    previous_screening: Optional[bool] = False

class PatientResponse(BaseModel):
    id: int
    patient_code: str
    name: str
    age: Optional[int]
    gender: Optional[str]
    phone: Optional[str]
    village: Optional[str]
    diabetes_duration: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

# Screening
class ScreeningCreate(BaseModel):
    patient_id: int

class ScreeningResponse(BaseModel):
    id: int
    patient_id: int
    image_url: Optional[str]
    image_quality: Optional[str]
    predicted_class: Optional[int]
    predicted_label: Optional[str]
    confidence: Optional[float]
    prob_no_dr: Optional[float]
    prob_mild: Optional[float]
    prob_moderate: Optional[float]
    prob_severe: Optional[float]
    prob_proliferative: Optional[float]
    risk_level: Optional[str]
    referral_status: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# AI Prediction
class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    predicted_class: int
    probabilities: dict
    risk_level: str
    referral_recommendation: str

# Image Quality
class ImageQualityResponse(BaseModel):
    sharpness: bool
    brightness: bool
    retinal_area: bool
    visibility: bool
    overall: str  # good, poor

# Explainability
class ExplanationResponse(BaseModel):
    heatmap_url: Optional[str]
    explanation_text: str
    screening_id: int

# Doctor Review
class DoctorReviewCreate(BaseModel):
    notes: Optional[str] = ""
    status: str = "reviewed"

class DoctorReviewResponse(BaseModel):
    id: int
    screening_id: int
    doctor_id: int
    notes: Optional[str]
    status: str
    reviewed_at: Optional[datetime]

    class Config:
        from_attributes = True

# Doctor Case
class DoctorCaseResponse(BaseModel):
    screening_id: int
    patient_id: str
    patient_name: str
    age: Optional[int]
    gender: Optional[str]
    village: Optional[str]
    result: Optional[str]
    confidence: Optional[float]
    priority: str
    status: str
    date: str

# Sync
class SyncRequest(BaseModel):
    records: list

class SyncResponse(BaseModel):
    synced: int
    failed: int
    message: str

# Analytics
class AnalyticsResponse(BaseModel):
    total_screened: int
    no_dr: int
    mild: int
    moderate: int
    severe: int
    proliferative: int
    referral_rate: float

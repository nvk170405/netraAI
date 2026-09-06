"""NetraAI — SQLAlchemy Models"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from ..database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False)  # health_worker, doctor, admin
    phone = Column(String(15), unique=True)
    email = Column(String(100), unique=True, nullable=True)
    password_hash = Column(String(256), nullable=False)
    location = Column(String(200))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    reviews = relationship("DoctorReview", back_populates="doctor")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_code = Column(String(20), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer)
    gender = Column(String(10))
    phone = Column(String(15))
    village = Column(String(100))
    diabetes_duration = Column(Integer)
    existing_eye_problems = Column(String(100))
    previous_screening = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    screenings = relationship("Screening", back_populates="patient")


class Screening(Base):
    __tablename__ = "screenings"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    image_url = Column(String(500))
    image_quality = Column(String(20))  # good, poor
    predicted_class = Column(Integer)  # 0-4
    predicted_label = Column(String(30))
    confidence = Column(Float)
    prob_no_dr = Column(Float)
    prob_mild = Column(Float)
    prob_moderate = Column(Float)
    prob_severe = Column(Float)
    prob_proliferative = Column(Float)
    risk_level = Column(String(20))  # low, moderate, high
    referral_status = Column(String(30))  # none, recommended, urgent
    status = Column(String(20), default="pending")  # pending, complete, review, referral
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    patient = relationship("Patient", back_populates="screenings")
    explanation = relationship("Explanation", back_populates="screening", uselist=False)
    review = relationship("DoctorReview", back_populates="screening", uselist=False)


class Explanation(Base):
    __tablename__ = "explanations"

    id = Column(Integer, primary_key=True, index=True)
    screening_id = Column(Integer, ForeignKey("screenings.id"), nullable=False, unique=True)
    heatmap_url = Column(String(500))
    explanation_text = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    screening = relationship("Screening", back_populates="explanation")


class DoctorReview(Base):
    __tablename__ = "doctor_reviews"

    id = Column(Integer, primary_key=True, index=True)
    screening_id = Column(Integer, ForeignKey("screenings.id"), nullable=False, unique=True)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    notes = Column(Text)
    status = Column(String(20), default="pending")  # pending, reviewed
    reviewed_at = Column(DateTime, nullable=True)

    screening = relationship("Screening", back_populates="review")
    doctor = relationship("User", back_populates="reviews")

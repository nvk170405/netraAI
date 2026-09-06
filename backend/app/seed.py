"""NetraAI — Database Seeder

Seeds demo users, patients, screenings, explanations, and reviews
to match the frontend mock data. Idempotent — skips if data already exists.
"""
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from .models.models import User, Patient, Screening, Explanation, DoctorReview
from .services.auth import hash_password

DEFAULT_PASSWORD = "netra123"


def seed_users(db: Session) -> dict:
    """Seed the 3 demo users. Returns a map of role -> user_id."""
    users_data = [
        {
            "name": "Anjali Sharma",
            "role": "health_worker",
            "phone": "health001",
            "email": "anjali@netra.ai",
            "location": "PHC Bharatpur",
        },
        {
            "name": "Dr. Rajesh Kumar",
            "role": "doctor",
            "phone": "doctor001",
            "email": "rajesh@netra.ai",
            "location": "District Hospital, Jaipur",
        },
        {
            "name": "Priya Singh",
            "role": "admin",
            "phone": "admin001",
            "email": "priya@netra.ai",
            "location": "State Health Office",
        },
    ]
    user_map = {}
    for data in users_data:
        existing = db.query(User).filter(User.phone == data["phone"]).first()
        if existing:
            user_map[data["role"]] = existing.id
            continue
        user = User(
            name=data["name"],
            role=data["role"],
            phone=data["phone"],
            email=data["email"],
            password_hash=hash_password(DEFAULT_PASSWORD),
            location=data["location"],
        )
        db.add(user)
        db.flush()
        user_map[data["role"]] = user.id
    return user_map


def seed_patients(db: Session) -> dict:
    """Seed demo patients matching frontend mockData. Returns code -> id map."""
    patients_data = [
        {"patient_code": "P-10289", "name": "Ramesh Patel", "age": 55, "gender": "Male", "phone": "9812345671", "village": "Bahadurpur", "diabetes_duration": 8},
        {"patient_code": "P-10290", "name": "Vikram Yadav", "age": 50, "gender": "Male", "phone": "9812345674", "village": "Indore", "diabetes_duration": 5},
        {"patient_code": "P-10291", "name": "Sunita Devi", "age": 62, "gender": "Female", "phone": "9812345672", "village": "Khandwa", "diabetes_duration": 15},
        {"patient_code": "P-10293", "name": "Arjun Singh", "age": 68, "gender": "Male", "phone": "9812345673", "village": "Dewas", "diabetes_duration": 22},
        {"patient_code": "P-10288", "name": "Meera Joshi", "age": 47, "gender": "Female", "phone": "9812345675", "village": "Indore", "diabetes_duration": 6},
        {"patient_code": "P-10287", "name": "Rahul Sharma", "age": 44, "gender": "Male", "phone": "9812345676", "village": "Bhopal", "diabetes_duration": 3},
        {"patient_code": "P-10286", "name": "Kavita Kumari", "age": 58, "gender": "Female", "phone": "9812345677", "village": "Barwani", "diabetes_duration": 18},
        {"patient_code": "P-10285", "name": "Suresh Gupta", "age": 53, "gender": "Male", "phone": "9812345678", "village": "Ujjain", "diabetes_duration": 10},
        {"patient_code": "P-10284", "name": "Anita Devi", "age": 49, "gender": "Female", "phone": "9812345679", "village": "Sagar", "diabetes_duration": 7},
        {"patient_code": "P-10280", "name": "Gopal Das", "age": 71, "gender": "Male", "phone": "9812345680", "village": "Sagar", "diabetes_duration": 20},
        {"patient_code": "P-10278", "name": "Lakshmi Bai", "age": 65, "gender": "Female", "phone": "9812345681", "village": "Ratlam", "diabetes_duration": 12},
        {"patient_code": "P-10271", "name": "Bhagwan Das", "age": 73, "gender": "Male", "phone": "9812345682", "village": "Khandwa", "diabetes_duration": 25},
        {"patient_code": "P-10265", "name": "Kamla Bai", "age": 60, "gender": "Female", "phone": "9812345683", "village": "Ujjain", "diabetes_duration": 14},
        {"patient_code": "P-10258", "name": "Ratan Lal", "age": 66, "gender": "Male", "phone": "9812345684", "village": "Sagar", "diabetes_duration": 19},
    ]
    patient_map = {}
    for data in patients_data:
        existing = db.query(Patient).filter(Patient.patient_code == data["patient_code"]).first()
        if existing:
            patient_map[data["patient_code"]] = existing.id
            continue
        patient = Patient(**data)
        db.add(patient)
        db.flush()
        patient_map[data["patient_code"]] = patient.id
    return patient_map


REFERRAL_TEXT = {
    0: "No significant DR detected. Follow normal clinical follow-up protocols.",
    1: "Mild abnormalities detected. Consider ophthalmic evaluation.",
    2: "AI screening indicates potential diabetic retinopathy. Specialist evaluation recommended.",
    3: "Significant abnormalities detected. Priority specialist evaluation recommended.",
    4: "Proliferative DR detected. URGENT specialist evaluation required.",
}


def seed_screenings(db: Session, patient_map: dict, doctor_id: int):
    """Seed demo screenings matching frontend RECENT_SCREENINGS and DOCTOR_CASES."""
    now = datetime.now(timezone.utc)
    screenings_data = [
        # Matching RECENT_SCREENINGS from mockData.js
        {"code": "P-10291", "class": 2, "label": "Moderate DR", "conf": 0.82, "risk": "moderate", "ref": "recommended", "status": "referral", "days_ago": 1},
        {"code": "P-10290", "class": 0, "label": "No DR", "conf": 0.91, "risk": "low", "ref": "none", "status": "complete", "days_ago": 1},
        {"code": "P-10289", "class": 0, "label": "No DR", "conf": 0.94, "risk": "low", "ref": "none", "status": "complete", "days_ago": 1},
        {"code": "P-10288", "class": 1, "label": "Mild DR", "conf": 0.76, "risk": "low", "ref": "consider", "status": "review", "days_ago": 2},
        {"code": "P-10287", "class": 0, "label": "No DR", "conf": 0.88, "risk": "low", "ref": "none", "status": "complete", "days_ago": 2},
        {"code": "P-10286", "class": 3, "label": "Severe DR", "conf": 0.89, "risk": "high", "ref": "urgent", "status": "referral", "days_ago": 2},
        {"code": "P-10285", "class": 2, "label": "Moderate DR", "conf": 0.78, "risk": "moderate", "ref": "recommended", "status": "review", "days_ago": 3},
        {"code": "P-10284", "class": 0, "label": "No DR", "conf": 0.93, "risk": "low", "ref": "none", "status": "complete", "days_ago": 3},
        # Additional high-risk cases matching ADMIN_STATS.highRiskCases
        {"code": "P-10293", "class": 3, "label": "Severe DR", "conf": 0.89, "risk": "high", "ref": "urgent", "status": "referral", "days_ago": 1},
        {"code": "P-10280", "class": 2, "label": "Moderate DR", "conf": 0.81, "risk": "moderate", "ref": "recommended", "status": "review", "days_ago": 4},
        {"code": "P-10278", "class": 1, "label": "Mild DR", "conf": 0.72, "risk": "low", "ref": "consider", "status": "review", "days_ago": 5},
        {"code": "P-10271", "class": 4, "label": "Proliferative DR", "conf": 0.91, "risk": "high", "ref": "urgent", "status": "referral", "days_ago": 7},
        {"code": "P-10265", "class": 3, "label": "Severe DR", "conf": 0.85, "risk": "high", "ref": "urgent", "status": "referral", "days_ago": 9},
        {"code": "P-10258", "class": 3, "label": "Severe DR", "conf": 0.87, "risk": "high", "ref": "urgent", "status": "referral", "days_ago": 12},
    ]

    # Probability templates based on class
    prob_templates = {
        0: {"no_dr": 0.90, "mild": 0.05, "moderate": 0.03, "severe": 0.01, "proliferative": 0.01},
        1: {"no_dr": 0.10, "mild": 0.70, "moderate": 0.12, "severe": 0.05, "proliferative": 0.03},
        2: {"no_dr": 0.03, "mild": 0.07, "moderate": 0.80, "severe": 0.07, "proliferative": 0.03},
        3: {"no_dr": 0.01, "mild": 0.02, "moderate": 0.05, "severe": 0.88, "proliferative": 0.04},
        4: {"no_dr": 0.01, "mild": 0.01, "moderate": 0.03, "severe": 0.05, "proliferative": 0.90},
    }

    # Skip if screenings already exist
    if db.query(Screening).count() > 0:
        return

    for s_data in screenings_data:
        patient_id = patient_map.get(s_data["code"])
        if not patient_id:
            continue

        probs = prob_templates.get(s_data["class"], prob_templates[0])
        created = now - timedelta(days=s_data["days_ago"])

        screening = Screening(
            patient_id=patient_id,
            image_url=None,
            image_quality="good",
            predicted_class=s_data["class"],
            predicted_label=s_data["label"],
            confidence=s_data["conf"],
            prob_no_dr=probs["no_dr"],
            prob_mild=probs["mild"],
            prob_moderate=probs["moderate"],
            prob_severe=probs["severe"],
            prob_proliferative=probs["proliferative"],
            risk_level=s_data["risk"],
            referral_status=s_data["ref"],
            status=s_data["status"],
            created_at=created,
        )
        db.add(screening)
        db.flush()

        # Create explanation for each screening
        explanation = Explanation(
            screening_id=screening.id,
            heatmap_url=None,
            explanation_text=REFERRAL_TEXT.get(s_data["class"], ""),
            created_at=created,
        )
        db.add(explanation)

        # Create doctor reviews for already-reviewed cases
        if s_data["code"] in ("P-10280", "P-10278"):
            review = DoctorReview(
                screening_id=screening.id,
                doctor_id=doctor_id,
                notes=f"Reviewed case for {s_data['label']}. Patient counseled.",
                status="reviewed",
                reviewed_at=created + timedelta(hours=4),
            )
            db.add(review)


def run_seed(db: Session):
    """Run the complete seeding process."""
    print("[*] Seeding database...")
    user_map = seed_users(db)
    print(f"  [OK] Users seeded: {user_map}")

    patient_map = seed_patients(db)
    print(f"  [OK] Patients seeded: {len(patient_map)} records")

    doctor_id = user_map.get("doctor", 2)
    seed_screenings(db, patient_map, doctor_id)
    print("  [OK] Screenings, explanations, and reviews seeded")

    db.commit()
    print("[*] Database seeding complete!")

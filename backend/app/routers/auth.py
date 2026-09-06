"""NetraAI — Authentication Router"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..models.models import User
from ..schemas.schemas import LoginRequest, TokenResponse
from ..services.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_role,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate with employee_id + password and receive a JWT."""
    user = db.query(User).filter(
        (User.phone == body.employee_id) | (User.email == body.employee_id)
    ).first()

    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid employee ID or password",
        )

    token = create_access_token({"user_id": user.id, "role": user.role})
    return TokenResponse(
        access_token=token,
        user={
            "id": str(user.id),
            "name": user.name,
            "role": user.role,
            "phone": user.phone,
            "location": user.location or "",
        },
    )


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "role": current_user.role,
        "phone": current_user.phone,
        "email": current_user.email,
        "location": current_user.location or "",
    }


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(
    name: str,
    role: str,
    phone: str,
    password: str,
    email: str = None,
    location: str = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role("admin")),
):
    """Create a new user (admin-only)."""
    if role not in ("health_worker", "doctor", "admin"):
        raise HTTPException(status_code=400, detail="Invalid role")

    existing = db.query(User).filter(User.phone == phone).first()
    if existing:
        raise HTTPException(status_code=409, detail="Phone number already registered")

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
    return {
        "id": user.id,
        "name": user.name,
        "role": user.role,
        "phone": user.phone,
        "message": "User created successfully",
    }

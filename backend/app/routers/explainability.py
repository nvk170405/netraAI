"""NetraAI — Explainability Router (Grad-CAM)"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database.db import get_db
from ..models.models import User, Screening, Explanation
from ..services.auth import get_current_user

router = APIRouter(prefix="/explainability", tags=["Explainability"])


MOCK_EXPLANATION_TEMPLATES = {
    0: (
        "The AI model examined the fundus image and found no significant signs of diabetic retinopathy. "
        "The retinal vasculature appears normal, with no microaneurysms, hemorrhages, or exudates detected. "
        "The optic disc and macula appear healthy. Confidence: {confidence:.0%}."
    ),
    1: (
        "The screening model detected potential early signs of diabetic retinopathy. "
        "A small number of microaneurysms were identified, primarily in the temporal region. "
        "No significant hemorrhages or exudates were observed. Confidence: {confidence:.0%}. "
        "Consider scheduling a follow-up examination."
    ),
    2: (
        "The AI analysis indicates moderate non-proliferative diabetic retinopathy (NPDR). "
        "Multiple microaneurysms and dot-blot hemorrhages were detected across the retinal image. "
        "Some hard exudates are visible near the macular region. Confidence: {confidence:.0%}. "
        "Ophthalmological referral is recommended."
    ),
    3: (
        "Significant findings consistent with severe non-proliferative diabetic retinopathy. "
        "The model detected extensive hemorrhages, venous beading, and intraretinal microvascular "
        "abnormalities (IRMA) in multiple quadrants. Confidence: {confidence:.0%}. "
        "Urgent specialist evaluation is strongly recommended."
    ),
    4: (
        "The screening model has identified features suggestive of proliferative diabetic retinopathy (PDR). "
        "Neovascularization and possible vitreous/preretinal hemorrhage patterns were detected. "
        "Confidence: {confidence:.0%}. "
        "URGENT: Immediate ophthalmological referral required. Risk of vision loss without treatment."
    ),
}


@router.get("/{screening_id}")
def get_explanation(
    screening_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get explainability data (Grad-CAM heatmap + text) for a screening."""
    screening = db.query(Screening).filter(Screening.id == screening_id).first()
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")

    explanation = db.query(Explanation).filter(Explanation.screening_id == screening_id).first()

    if explanation:
        return {
            "screening_id": screening_id,
            "heatmap_url": explanation.heatmap_url,
            "explanation_text": explanation.explanation_text,
            "predicted_class": screening.predicted_class,
            "predicted_label": screening.predicted_label,
            "confidence": screening.confidence,
        }

    # Generate on-the-fly if no record exists
    pred_class = screening.predicted_class or 0
    confidence = screening.confidence or 0.0
    template = MOCK_EXPLANATION_TEMPLATES.get(pred_class, MOCK_EXPLANATION_TEMPLATES[0])
    text = template.format(confidence=confidence)

    return {
        "screening_id": screening_id,
        "heatmap_url": None,
        "explanation_text": text,
        "predicted_class": pred_class,
        "predicted_label": screening.predicted_label,
        "confidence": confidence,
    }


@router.post("/{screening_id}/generate", status_code=201)
def generate_explanation(
    screening_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate (or regenerate) a mock Grad-CAM explanation for a screening."""
    screening = db.query(Screening).filter(Screening.id == screening_id).first()
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")

    pred_class = screening.predicted_class or 0
    confidence = screening.confidence or 0.0
    template = MOCK_EXPLANATION_TEMPLATES.get(pred_class, MOCK_EXPLANATION_TEMPLATES[0])
    text = template.format(confidence=confidence)

    existing = db.query(Explanation).filter(Explanation.screening_id == screening_id).first()
    if existing:
        existing.explanation_text = text
        existing.heatmap_url = None  # Placeholder for real heatmap generation
        db.commit()
        db.refresh(existing)
        return {
            "screening_id": screening_id,
            "explanation_text": text,
            "heatmap_url": None,
            "message": "Explanation regenerated",
        }

    explanation = Explanation(
        screening_id=screening_id,
        heatmap_url=None,
        explanation_text=text,
    )
    db.add(explanation)
    db.commit()

    return {
        "screening_id": screening_id,
        "explanation_text": text,
        "heatmap_url": None,
        "message": "Explanation generated",
    }

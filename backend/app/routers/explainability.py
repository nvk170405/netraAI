"""NetraAI — Explainability Router (Grad-CAM + AI Explanations)

Provides explainability data for screenings, including AI-generated
Grad-CAM heatmaps and detailed textual explanations of predictions.
Supports both real model explanations and mock fallbacks.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import os
import logging

from ..database.db import get_db
from ..models.models import User, Screening, Explanation
from ..services.auth import get_current_user
from ..services.ai_service import generate_gradcam, get_model_status

logger = logging.getLogger(__name__)

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


def _generate_explanation_text(pred_class: int, confidence: float) -> str:
    """Generate explanation text from template."""
    template = MOCK_EXPLANATION_TEMPLATES.get(pred_class, MOCK_EXPLANATION_TEMPLATES[0])
    return template.format(confidence=confidence)


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
    text = _generate_explanation_text(pred_class, confidence)

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
    """Generate (or regenerate) explainability data for a screening.
    
    When a real model is available, this generates an actual Grad-CAM
    heatmap. Otherwise, generates detailed textual explanation.
    """
    screening = db.query(Screening).filter(Screening.id == screening_id).first()
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")

    pred_class = screening.predicted_class or 0
    confidence = screening.confidence or 0.0
    text = _generate_explanation_text(pred_class, confidence)
    heatmap_url = None

    # Try real Grad-CAM if model available and image exists
    model_status = get_model_status()
    if (model_status["inference_mode"] == "real" 
        and screening.image_url 
        and os.path.exists(screening.image_url.lstrip("/"))):
        
        try:
            image_path = screening.image_url.lstrip("/")
            gradcam_result = generate_gradcam(
                image_path=image_path,
                target_class=pred_class,
            )
            if gradcam_result.get("heatmap_url"):
                heatmap_url = gradcam_result["heatmap_url"]
                logger.info(f"[Explainability] Generated Grad-CAM for screening {screening_id}")
        except Exception as e:
            logger.warning(f"[Explainability] Grad-CAM failed for {screening_id}: {e}")

    # Update or create explanation record
    existing = db.query(Explanation).filter(Explanation.screening_id == screening_id).first()
    if existing:
        existing.explanation_text = text
        existing.heatmap_url = heatmap_url
        db.commit()
        db.refresh(existing)
        return {
            "screening_id": screening_id,
            "explanation_text": text,
            "heatmap_url": heatmap_url,
            "message": "Explanation regenerated",
            "used_real_model": model_status["inference_mode"] == "real",
        }

    explanation = Explanation(
        screening_id=screening_id,
        heatmap_url=heatmap_url,
        explanation_text=text,
    )
    db.add(explanation)
    db.commit()

    return {
        "screening_id": screening_id,
        "explanation_text": text,
        "heatmap_url": heatmap_url,
        "message": "Explanation generated",
        "used_real_model": model_status["inference_mode"] == "real",
    }


@router.get("/model/status")
def model_explainability_status(
    current_user: User = Depends(get_current_user),
):
    """Check if real AI explainability (Grad-CAM) is available."""
    status = get_model_status()
    return {
        "gradcam_available": status["inference_mode"] == "real",
        "model_name": status["model_name"],
        "inference_mode": status["inference_mode"],
    }

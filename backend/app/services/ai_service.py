"""NetraAI — AI Service (Real/Mock Hybrid)

This service provides a unified interface for DR prediction and image quality
assessment. It automatically detects whether a trained ML model is available
and falls back to mock predictions if not.

Set MOCK_AI=false in .env to enable real model inference.
"""
import random
import os
import sys
import logging
from pathlib import Path

import numpy as np

logger = logging.getLogger(__name__)

# ─── Add project root to path for ml module access ───────────────────
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# ─── Configuration ───────────────────────────────────────────────────
DR_LABELS = ["No DR", "Mild DR", "Moderate DR", "Severe DR", "Proliferative DR"]
DR_KEYS = ["no_dr", "mild", "moderate", "severe", "proliferative"]

RISK_MAP = {
    0: {"level": "low",      "label": "LOW RISK",          "referral": "none"},
    1: {"level": "low",      "label": "LOW-MODERATE RISK", "referral": "consider"},
    2: {"level": "moderate", "label": "MODERATE RISK",     "referral": "recommended"},
    3: {"level": "high",     "label": "HIGH RISK",         "referral": "urgent"},
    4: {"level": "high",     "label": "HIGH RISK",         "referral": "urgent"},
}

REFERRAL_TEXT = {
    0: "No significant DR detected by the screening model. Follow normal clinical follow-up protocols.",
    1: "Mild abnormalities detected. Consider ophthalmic evaluation according to clinical protocol.",
    2: "AI screening indicates potential diabetic retinopathy. Specialist evaluation recommended.",
    3: "Significant abnormalities detected. Priority specialist evaluation recommended.",
    4: "Significant abnormalities detected. Priority specialist evaluation recommended.",
}

DEMO_PREDICTIONS = {
    "no_dr": {
        "class": 0,
        "label": "No DR",
        "confidence": 0.94,
        "probabilities": {"no_dr": 0.94, "mild": 0.03, "moderate": 0.02, "severe": 0.01, "proliferative": 0.00}
    },
    "moderate": {
        "class": 2,
        "label": "Moderate DR",
        "confidence": 0.82,
        "probabilities": {"no_dr": 0.03, "mild": 0.07, "moderate": 0.82, "severe": 0.06, "proliferative": 0.02}
    },
    "severe": {
        "class": 3,
        "label": "Severe DR",
        "confidence": 0.89,
        "probabilities": {"no_dr": 0.01, "mild": 0.02, "moderate": 0.05, "severe": 0.89, "proliferative": 0.03}
    }
}

USE_MOCK = (os.getenv("MOCK_AI") or "true").strip().lower() != "false"
ML_MODEL_PATH = (os.getenv("ML_MODEL_PATH") or "").strip() or str(PROJECT_ROOT / "ml" / "models" / "efficientnet_dr.pth")

# ─── Lazy-load ML modules (only when needed) ─────────────────────────
_ml_available = None

def _check_ml_available() -> bool:
    """Check if the real ML inference engine is available and a model exists."""
    global _ml_available
    if _ml_available is not None:
        return _ml_available

    try:
        from ml.predict import is_model_available
        _ml_available = is_model_available(ML_MODEL_PATH)
        if _ml_available:
            logger.info(f"[AI] Real model found at: {ML_MODEL_PATH}")
        else:
            logger.info(f"[AI] No model at {ML_MODEL_PATH}, using mock predictions")
    except ImportError:
        _ml_available = False
        logger.info("[AI] ML module not importable, using mock predictions")

    return _ml_available


# ─── Mock Prediction ──────────────────────────────────────────────────
def mock_predict(image_path: str = None) -> dict:
    """Generate a weighted-random mock DR prediction."""
    weights = [0.55, 0.15, 0.15, 0.10, 0.05]
    predicted_class = random.choices(range(5), weights=weights, k=1)[0]

    probs = np.random.dirichlet(np.ones(5) * 0.5)
    probs[predicted_class] += 0.4
    probs = probs / probs.sum()

    confidence = float(probs[predicted_class])

    return {
        "prediction": DR_LABELS[predicted_class],
        "predicted_class": predicted_class,
        "confidence": round(confidence, 2),
        "probabilities": {
            "no_dr": round(float(probs[0]), 2),
            "mild": round(float(probs[1]), 2),
            "moderate": round(float(probs[2]), 2),
            "severe": round(float(probs[3]), 2),
            "proliferative": round(float(probs[4]), 2),
        },
        "risk_level": RISK_MAP[predicted_class]["level"],
        "referral_recommendation": REFERRAL_TEXT[predicted_class],
        "is_mock": True,
    }


# ─── Real Prediction ─────────────────────────────────────────────────
def real_predict(image_path: str) -> dict:
    """Run real EfficientNet inference on a fundus image."""
    try:
        from ml.predict import predict_image
        result = predict_image(image_path, model_path=ML_MODEL_PATH)
        return result
    except Exception as e:
        logger.error(f"[AI] Real prediction failed, falling back to mock: {e}")
        return mock_predict(image_path)


# ─── Unified Predict Interface ───────────────────────────────────────
def predict(image_path: str = None, demo_case: str = None) -> dict:
    """Run DR prediction — uses real model if available, mock otherwise.

    Args:
        image_path: Path to the uploaded fundus image
        demo_case: Optional preset case ('no_dr', 'moderate', 'severe')

    Returns:
        Dict with prediction, confidence, probabilities, risk, referral
    """
    # Demo case override
    if demo_case and demo_case in DEMO_PREDICTIONS:
        pred = DEMO_PREDICTIONS[demo_case]
        return {
            "prediction": pred["label"],
            "predicted_class": pred["class"],
            "confidence": pred["confidence"],
            "probabilities": pred["probabilities"],
            "risk_level": RISK_MAP[pred["class"]]["level"],
            "referral_recommendation": REFERRAL_TEXT[pred["class"]],
            "is_mock": True,
        }

    # Real model inference (if MOCK_AI=false and model exists)
    if not USE_MOCK and image_path and _check_ml_available():
        return real_predict(image_path)

    # Fallback to mock
    return mock_predict(image_path)


# ─── Image Quality Assessment ────────────────────────────────────────
def check_image_quality(image_path: str = None) -> dict:
    """Assess fundus image quality — uses real CV if available, mock otherwise.

    Returns:
        Dict with sharpness, brightness, retinal_area, visibility, overall
    """
    # Try real quality assessment
    if image_path and os.path.exists(image_path):
        try:
            from ml.preprocess import check_image_quality as real_quality_check
            return real_quality_check(image_path)
        except ImportError:
            pass
        except Exception as e:
            logger.warning(f"[AI] Quality check failed, using defaults: {e}")

    # Mock quality assessment
    return {
        "sharpness": True,
        "brightness": True,
        "retinal_area": True,
        "visibility": True,
        "overall": "good",
    }


# ─── Grad-CAM Heatmap Generation ─────────────────────────────────────
def generate_gradcam(image_path: str, target_class: int = None) -> dict:
    """Generate Grad-CAM heatmap for explainability.

    Args:
        image_path: Path to the fundus image
        target_class: Class to explain (None = predicted class)

    Returns:
        Dict with heatmap_path, heatmap_url, and prediction info
    """
    if not USE_MOCK and image_path and _check_ml_available():
        try:
            from ml.grad_cam import generate_heatmap
            return generate_heatmap(image_path, model_path=ML_MODEL_PATH, target_class=target_class)
        except Exception as e:
            logger.error(f"[AI] Grad-CAM failed: {e}")

    # Mock heatmap response
    return {
        "heatmap_path": None,
        "heatmap_url": None,
        "predicted_class": 0,
        "predicted_label": "No DR",
        "explained_class": target_class or 0,
        "explained_label": DR_LABELS[target_class or 0],
        "confidence": 0.0,
        "is_mock": True,
    }


# ─── Model Status ────────────────────────────────────────────────────
def get_model_status() -> dict:
    """Return the current status of the AI model for admin dashboard."""
    model_exists = os.path.isfile(ML_MODEL_PATH)
    return {
        "mock_mode": USE_MOCK,
        "model_path": ML_MODEL_PATH,
        "model_exists": model_exists,
        "inference_mode": "mock" if USE_MOCK or not model_exists else "real",
        "model_name": "EfficientNet-B3",
        "num_classes": 5,
        "class_labels": DR_LABELS,
    }

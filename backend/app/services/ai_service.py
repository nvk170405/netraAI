"""NetraAI — Mock AI Inference Service
This is a mock inference service for demonstration purposes.
It returns simulated but realistic DR predictions.
When a real model is available, replace the predict() function.
"""
import random
import numpy as np
import os


# DR classification labels
DR_LABELS = ["No DR", "Mild DR", "Moderate DR", "Severe DR", "Proliferative DR"]

# Risk mapping
RISK_MAP = {
    0: {"level": "low", "label": "LOW RISK", "referral": "none"},
    1: {"level": "low", "label": "LOW-MODERATE RISK", "referral": "consider"},
    2: {"level": "moderate", "label": "MODERATE RISK", "referral": "recommended"},
    3: {"level": "high", "label": "HIGH RISK", "referral": "urgent"},
    4: {"level": "high", "label": "HIGH RISK", "referral": "urgent"},
}

REFERRAL_TEXT = {
    0: "No significant DR detected by the screening model. Follow normal clinical follow-up protocols.",
    1: "Mild abnormalities detected. Consider ophthalmic evaluation according to clinical protocol.",
    2: "AI screening indicates potential diabetic retinopathy. Specialist evaluation recommended.",
    3: "Significant abnormalities detected. Priority specialist evaluation recommended.",
    4: "Significant abnormalities detected. Priority specialist evaluation recommended.",
}

# Predefined demo cases for reliable demonstration
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

USE_MOCK = os.getenv("MOCK_AI", "true").lower() == "true"


def mock_predict(image_path: str = None) -> dict:
    """
    Generate a simulated DR prediction.
    For the prototype, this returns realistic but simulated results.

    IMPORTANT: These are NOT real clinical predictions.
    """
    # Random but realistic prediction
    weights = [0.55, 0.15, 0.15, 0.10, 0.05]
    predicted_class = random.choices(range(5), weights=weights, k=1)[0]

    # Generate probabilities with the predicted class having highest
    probs = np.random.dirichlet(np.ones(5) * 0.5)
    # Boost the predicted class
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


def predict(image_path: str = None, demo_case: str = None) -> dict:
    """
    Main prediction function.
    If a demo_case name is provided, return the predefined demo result.
    Otherwise, use mock or real inference.
    """
    # Demo case shortcut
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

    if USE_MOCK:
        return mock_predict(image_path)

    # Real model inference would go here
    # from ..ml.inference import run_inference
    # return run_inference(image_path)
    return mock_predict(image_path)


def check_image_quality(image_path: str = None) -> dict:
    """
    Simulate image quality assessment.
    In production, this would use OpenCV-based metrics.
    """
    return {
        "sharpness": True,
        "brightness": True,
        "retinal_area": True,
        "visibility": True,
        "overall": "good",
    }

"""NetraAI ML Pipeline — Image Quality Assessment & Preprocessing

Provides automated quality checks for fundus images before AI inference,
including sharpness, brightness, and retinal area detection.
"""
import os
import sys
from pathlib import Path
from typing import Optional

import numpy as np
from PIL import Image

# Lazy-import cv2 to avoid hard dependency at module level
_cv2 = None

def _get_cv2():
    global _cv2
    if _cv2 is None:
        import cv2
        _cv2 = cv2
    return _cv2


def assess_sharpness(image: np.ndarray, threshold: float = 100.0) -> dict:
    """Assess image sharpness using Laplacian variance.
    
    Args:
        image: BGR numpy array
        threshold: Minimum variance to consider 'sharp'
    
    Returns:
        Dict with 'is_sharp', 'variance' score
    """
    cv2 = _get_cv2()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    variance = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    return {
        "is_sharp": variance >= threshold,
        "variance": round(variance, 2),
    }


def assess_brightness(image: np.ndarray, low: float = 40.0, high: float = 220.0) -> dict:
    """Assess image brightness using mean pixel intensity.
    
    Args:
        image: BGR numpy array
        low: Minimum mean brightness (below = too dark)
        high: Maximum mean brightness (above = too bright/washed out)
    
    Returns:
        Dict with 'is_ok', 'mean_brightness'
    """
    cv2 = _get_cv2()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    mean_val = float(gray.mean())
    return {
        "is_ok": low <= mean_val <= high,
        "mean_brightness": round(mean_val, 2),
    }


def assess_retinal_area(image: np.ndarray, min_ratio: float = 0.15) -> dict:
    """Detect the retinal area (circular region) in the fundus image.
    
    Uses thresholding to find the bright retinal region against
    the dark background typical of fundus photography.
    
    Args:
        image: BGR numpy array
        min_ratio: Minimum ratio of retinal pixels to total pixels
    
    Returns:
        Dict with 'has_retina', 'area_ratio'
    """
    cv2 = _get_cv2()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Threshold to find retinal region (bright area on dark background)
    _, binary = cv2.threshold(gray, 30, 255, cv2.THRESH_BINARY)
    
    # Find contours
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        return {"has_retina": False, "area_ratio": 0.0}
    
    # Get largest contour (should be the retinal area)
    largest = max(contours, key=cv2.contourArea)
    retinal_area = cv2.contourArea(largest)
    total_area = image.shape[0] * image.shape[1]
    ratio = retinal_area / total_area if total_area > 0 else 0
    
    return {
        "has_retina": ratio >= min_ratio,
        "area_ratio": round(float(ratio), 4),
    }


def assess_visibility(image: np.ndarray) -> dict:
    """Check if key retinal structures are potentially visible.
    
    Uses contrast and edge detection as a proxy for visibility
    of the optic disc and vasculature.
    """
    cv2 = _get_cv2()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Edge density as proxy for visible structures
    edges = cv2.Canny(gray, 50, 150)
    edge_density = float(edges.sum()) / (edges.shape[0] * edges.shape[1] * 255)
    
    # Contrast (standard deviation of intensity)
    contrast = float(gray.std())
    
    is_visible = edge_density > 0.01 and contrast > 20
    
    return {
        "is_visible": is_visible,
        "edge_density": round(edge_density, 4),
        "contrast": round(contrast, 2),
    }


def ben_graham_preprocess(image: np.ndarray, sigmaX: int = 10) -> np.ndarray:
    """Apply Ben Graham's circle-crop preprocessing for fundus images.
    
    This preprocessing was used in the winning solution of the
    Kaggle Diabetic Retinopathy Detection competition.
    
    Steps:
        1. Subtract local average color
        2. Map to 50% gray
        3. Crop to circular retinal area
    
    Args:
        image: BGR numpy array
        sigmaX: Gaussian blur sigma
    
    Returns:
        Preprocessed BGR numpy array
    """
    cv2 = _get_cv2()
    
    # Subtract local mean and normalize
    processed = cv2.addWeighted(
        image, 4,
        cv2.GaussianBlur(image, (0, 0), sigmaX), -4,
        128
    )
    
    # Create circular mask
    h, w = processed.shape[:2]
    center = (w // 2, h // 2)
    radius = min(h, w) // 2
    mask = np.zeros((h, w), dtype=np.uint8)
    cv2.circle(mask, center, int(radius * 0.9), 255, -1)
    
    # Apply mask
    processed = cv2.bitwise_and(processed, processed, mask=mask)
    
    return processed


def check_image_quality(image_path: Optional[str] = None, image: Optional[np.ndarray] = None) -> dict:
    """Run full quality assessment pipeline on a fundus image.
    
    Args:
        image_path: Path to the image file
        image: Pre-loaded BGR numpy array (used if image_path is None)
    
    Returns:
        Dict with quality assessment results:
            sharpness (bool), brightness (bool), retinal_area (bool),
            visibility (bool), overall ('good' | 'poor'),
            details (dict with raw metric values)
    """
    cv2 = _get_cv2()
    
    if image is None and image_path:
        if not os.path.exists(image_path):
            return {
                "sharpness": False,
                "brightness": False,
                "retinal_area": False,
                "visibility": False,
                "overall": "poor",
                "details": {"error": "Image file not found"},
            }
        image = cv2.imread(image_path)
    
    if image is None:
        return {
            "sharpness": True,
            "brightness": True,
            "retinal_area": True,
            "visibility": True,
            "overall": "good",
            "details": {"note": "No image provided, returning defaults"},
        }
    
    # Run all assessments
    sharpness = assess_sharpness(image)
    brightness = assess_brightness(image)
    retinal = assess_retinal_area(image)
    visibility = assess_visibility(image)
    
    # Overall quality
    checks = [sharpness["is_sharp"], brightness["is_ok"], retinal["has_retina"], visibility["is_visible"]]
    pass_count = sum(checks)
    overall = "good" if pass_count >= 3 else "poor"
    
    return {
        "sharpness": sharpness["is_sharp"],
        "brightness": brightness["is_ok"],
        "retinal_area": retinal["has_retina"],
        "visibility": visibility["is_visible"],
        "overall": overall,
        "details": {
            "sharpness_variance": sharpness["variance"],
            "mean_brightness": brightness["mean_brightness"],
            "retinal_area_ratio": retinal["area_ratio"],
            "edge_density": visibility["edge_density"],
            "contrast": visibility["contrast"],
            "checks_passed": f"{pass_count}/4",
        },
    }

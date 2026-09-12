"""NetraAI ML Pipeline — Inference Engine

Usage:
    python -m ml.predict --image path/to/fundus.jpg
    python -m ml.predict --image path/to/fundus.jpg --model ml/models/efficientnet_dr.pth
"""
import argparse
import os
import sys
from pathlib import Path
from typing import Optional

import numpy as np
import torch
from torchvision import transforms
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from ml.config import (
    IMAGE_SIZE, IMAGENET_MEAN, IMAGENET_STD, MODEL_PATH,
    CLASS_LABELS, CLASS_KEYS, NUM_CLASSES, RISK_MAP, REFERRAL_TEXT,
)
from ml.model import load_model


# ─── Singleton Model Cache ────────────────────────────────────────────
_model_cache = {"model": None, "device": None, "path": None}


def get_inference_transform() -> transforms.Compose:
    """Build the inference preprocessing pipeline."""
    return transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
    ])


def load_model_cached(model_path: Optional[str] = None) -> tuple:
    """Load model once and cache it for subsequent calls.
    
    Returns:
        Tuple of (model, device)
    """
    path = model_path or MODEL_PATH
    
    if _model_cache["model"] is not None and _model_cache["path"] == path:
        return _model_cache["model"], _model_cache["device"]
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = load_model(path, num_classes=NUM_CLASSES, device=str(device))
    
    _model_cache["model"] = model
    _model_cache["device"] = device
    _model_cache["path"] = path
    
    return model, device


def predict_image(image_path: str, model_path: Optional[str] = None) -> dict:
    """Run inference on a single fundus image.
    
    Args:
        image_path: Path to the fundus image
        model_path: Optional custom model checkpoint path
    
    Returns:
        Dict with prediction, confidence, probabilities, risk level, referral text
    """
    model, device = load_model_cached(model_path)
    transform = get_inference_transform()
    
    # Load and preprocess image
    image = Image.open(image_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(device)
    
    # Inference
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1).cpu().numpy()[0]
    
    predicted_class = int(np.argmax(probabilities))
    confidence = float(probabilities[predicted_class])
    
    # Build probability dict
    prob_dict = {}
    for i, key in enumerate(CLASS_KEYS):
        prob_dict[key] = round(float(probabilities[i]), 4)
    
    risk = RISK_MAP.get(predicted_class, RISK_MAP[0])
    referral = REFERRAL_TEXT.get(predicted_class, REFERRAL_TEXT[0])
    
    return {
        "prediction": CLASS_LABELS[predicted_class],
        "predicted_class": predicted_class,
        "confidence": round(confidence, 4),
        "probabilities": prob_dict,
        "risk_level": risk["level"],
        "risk_label": risk["label"],
        "referral_recommendation": referral,
        "is_mock": False,
    }


def predict_from_pil(image: Image.Image, model_path: Optional[str] = None) -> dict:
    """Run inference on a PIL Image object (for in-memory use)."""
    model, device = load_model_cached(model_path)
    transform = get_inference_transform()
    
    image = image.convert("RGB")
    input_tensor = transform(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1).cpu().numpy()[0]
    
    predicted_class = int(np.argmax(probabilities))
    confidence = float(probabilities[predicted_class])
    
    prob_dict = {key: round(float(probabilities[i]), 4) for i, key in enumerate(CLASS_KEYS)}
    risk = RISK_MAP.get(predicted_class, RISK_MAP[0])
    referral = REFERRAL_TEXT.get(predicted_class, REFERRAL_TEXT[0])
    
    return {
        "prediction": CLASS_LABELS[predicted_class],
        "predicted_class": predicted_class,
        "confidence": round(confidence, 4),
        "probabilities": prob_dict,
        "risk_level": risk["level"],
        "risk_label": risk["label"],
        "referral_recommendation": referral,
        "is_mock": False,
    }


def is_model_available(model_path: Optional[str] = None) -> bool:
    """Check if a trained model file exists."""
    path = model_path or MODEL_PATH
    return os.path.isfile(path)


def main():
    parser = argparse.ArgumentParser(description="NetraAI DR Prediction")
    parser.add_argument("--image", type=str, required=True, help="Path to fundus image")
    parser.add_argument("--model", type=str, default=None, help="Model checkpoint path")
    args = parser.parse_args()

    if not os.path.exists(args.image):
        print(f"[ERROR] Image not found: {args.image}")
        sys.exit(1)

    model_path = args.model or MODEL_PATH
    if not os.path.exists(model_path):
        print(f"[ERROR] Model not found: {model_path}")
        print("Train a model first: python -m ml.train --data_dir ml/data")
        sys.exit(1)

    print(f"[*] Running inference on: {args.image}")
    result = predict_image(args.image, model_path=args.model)

    print(f"\n{'='*50}")
    print(f"  Prediction:  {result['prediction']}")
    print(f"  Confidence:  {result['confidence']:.2%}")
    print(f"  Risk Level:  {result['risk_label']}")
    print(f"  Referral:    {result['referral_recommendation']}")
    print(f"\n  Class Probabilities:")
    for label, key in zip(CLASS_LABELS, CLASS_KEYS):
        prob = result["probabilities"][key]
        bar = "█" * int(prob * 40)
        print(f"    {label:20s} {prob:6.2%} {bar}")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()

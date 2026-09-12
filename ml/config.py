"""NetraAI ML Pipeline — Central Configuration"""
import os
from pathlib import Path

# ─── Paths ────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parent.parent
ML_DIR = Path(__file__).resolve().parent
MODELS_DIR = ML_DIR / "models"
DATA_DIR = ML_DIR / "data"
HEATMAPS_DIR = PROJECT_ROOT / "backend" / "uploads" / "heatmaps"

# Ensure directories exist
MODELS_DIR.mkdir(parents=True, exist_ok=True)
HEATMAPS_DIR.mkdir(parents=True, exist_ok=True)

# ─── Model Settings ──────────────────────────────────────────────────
MODEL_NAME = "efficientnet_b3"
NUM_CLASSES = 5
IMAGE_SIZE = 300  # EfficientNet-B3 default input size
MODEL_PATH = os.getenv("ML_MODEL_PATH", str(MODELS_DIR / "efficientnet_dr.pth"))

# ─── Class Labels ─────────────────────────────────────────────────────
CLASS_LABELS = ["No DR", "Mild DR", "Moderate DR", "Severe DR", "Proliferative DR"]
CLASS_KEYS = ["no_dr", "mild", "moderate", "severe", "proliferative"]

# ─── Risk Mapping ─────────────────────────────────────────────────────
RISK_MAP = {
    0: {"level": "low",      "label": "LOW RISK",          "referral": "none"},
    1: {"level": "low",      "label": "LOW-MODERATE RISK", "referral": "consider"},
    2: {"level": "moderate", "label": "MODERATE RISK",     "referral": "recommended"},
    3: {"level": "high",     "label": "HIGH RISK",         "referral": "urgent"},
    4: {"level": "high",     "label": "HIGH RISK",         "referral": "urgent"},
}

REFERRAL_TEXT = {
    0: "No significant DR detected. Follow normal clinical follow-up protocols.",
    1: "Mild abnormalities detected. Consider ophthalmic evaluation per clinical protocol.",
    2: "AI screening indicates potential DR. Specialist evaluation recommended.",
    3: "Significant abnormalities detected. Priority specialist evaluation recommended.",
    4: "Significant abnormalities detected. Priority specialist evaluation recommended.",
}

# ─── Training Hyperparameters ─────────────────────────────────────────
TRAIN_CONFIG = {
    "epochs": 30,
    "batch_size": 16,
    "learning_rate": 1e-4,
    "weight_decay": 1e-5,
    "lr_min": 1e-6,
    "warmup_epochs": 3,
    "num_workers": 4,
    "val_split": 0.2,
    "seed": 42,
    "use_amp": True,  # Automatic mixed precision
}

# ─── Class Weights (typical DR dataset imbalance) ─────────────────────
# Inverse frequency weights — adjust based on actual dataset distribution
CLASS_WEIGHTS = [1.0, 2.0, 2.0, 5.0, 5.0]

# ─── Augmentation Settings ────────────────────────────────────────────
AUGMENTATION = {
    "horizontal_flip_p": 0.5,
    "vertical_flip_p": 0.5,
    "rotation_limit": 30,
    "brightness_limit": 0.2,
    "contrast_limit": 0.2,
    "hue_shift_limit": 10,
    "sat_shift_limit": 20,
    "val_shift_limit": 20,
    "blur_limit": 3,
    "noise_var_limit": (10.0, 50.0),
}

# ─── ImageNet Normalization ───────────────────────────────────────────
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]

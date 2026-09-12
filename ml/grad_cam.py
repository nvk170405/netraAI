"""NetraAI ML Pipeline — Grad-CAM Explainability

Generates Class Activation Map heatmaps to explain which regions of the
fundus image the model focused on for its DR prediction.

Usage:
    python -m ml.grad_cam --image path/to/fundus.jpg --output heatmap.png
"""
import argparse
import os
import sys
from pathlib import Path
from typing import Optional
import uuid

import numpy as np
import torch
from torchvision import transforms
from PIL import Image
import cv2

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from ml.config import (
    IMAGE_SIZE, IMAGENET_MEAN, IMAGENET_STD, MODEL_PATH,
    NUM_CLASSES, CLASS_LABELS, HEATMAPS_DIR,
)
from ml.model import load_model
from ml.predict import load_model_cached, get_inference_transform


class GradCAM:
    """Grad-CAM (Gradient-weighted Class Activation Mapping).
    
    Produces a coarse localization map highlighting important regions
    in the image for predicting the target class.
    
    Reference: Selvaraju et al., "Grad-CAM: Visual Explanations from Deep
    Networks via Gradient-based Localization", ICCV 2017.
    """

    def __init__(self, model, target_layer):
        self.model = model
        self.target_layer = target_layer
        self.gradients = None
        self.activations = None
        
        # Register hooks
        self._forward_hook = target_layer.register_forward_hook(self._save_activation)
        self._backward_hook = target_layer.register_full_backward_hook(self._save_gradient)

    def _save_activation(self, module, input, output):
        self.activations = output.detach()

    def _save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0].detach()

    def generate(self, input_tensor: torch.Tensor, target_class: Optional[int] = None) -> np.ndarray:
        """Generate Grad-CAM heatmap.
        
        Args:
            input_tensor: Preprocessed image tensor (1, C, H, W)
            target_class: Class index to explain. If None, uses predicted class.
        
        Returns:
            Heatmap as numpy array (H, W) with values in [0, 1]
        """
        self.model.eval()
        
        # Forward pass
        output = self.model(input_tensor)
        
        if target_class is None:
            target_class = output.argmax(dim=1).item()
        
        # Backward pass for target class
        self.model.zero_grad()
        one_hot = torch.zeros_like(output)
        one_hot[0, target_class] = 1.0
        output.backward(gradient=one_hot, retain_graph=True)
        
        # Compute Grad-CAM
        gradients = self.gradients[0]  # (C, H, W)
        activations = self.activations[0]  # (C, H, W)
        
        # Global average pooling of gradients
        weights = gradients.mean(dim=(1, 2))  # (C,)
        
        # Weighted combination of activation maps
        cam = torch.zeros(activations.shape[1:], dtype=activations.dtype, device=activations.device)
        for i, w in enumerate(weights):
            cam += w * activations[i]
        
        # ReLU to keep only positive contributions
        cam = torch.relu(cam)
        
        # Normalize to [0, 1]
        cam = cam.cpu().numpy()
        if cam.max() > 0:
            cam = cam / cam.max()
        
        return cam

    def cleanup(self):
        """Remove hooks."""
        self._forward_hook.remove()
        self._backward_hook.remove()


def generate_heatmap(
    image_path: str,
    model_path: Optional[str] = None,
    target_class: Optional[int] = None,
    output_path: Optional[str] = None,
    alpha: float = 0.5,
) -> dict:
    """Generate a Grad-CAM heatmap overlay for a fundus image.
    
    Args:
        image_path: Path to the original fundus image
        model_path: Path to the model checkpoint
        target_class: Class to explain (None = predicted class)
        output_path: Where to save the heatmap image (auto-generated if None)
        alpha: Overlay transparency (0=original only, 1=heatmap only)
    
    Returns:
        Dict with heatmap_path, predicted_class, and metadata
    """
    # Load model
    model, device = load_model_cached(model_path)
    
    # Enable gradients for Grad-CAM
    model.eval()
    for param in model.parameters():
        param.requires_grad_(True)
    
    # Get target layer (last conv layer of EfficientNet)
    target_layer = model.get_features_layer()
    
    # Load and preprocess image
    original_image = Image.open(image_path).convert("RGB")
    transform = get_inference_transform()
    input_tensor = transform(original_image).unsqueeze(0).to(device)
    input_tensor.requires_grad_(True)
    
    # Generate Grad-CAM
    grad_cam = GradCAM(model, target_layer)
    try:
        cam = grad_cam.generate(input_tensor, target_class)
    finally:
        grad_cam.cleanup()
    
    # Get prediction info
    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.softmax(outputs, dim=1).cpu().numpy()[0]
    
    predicted_class = int(np.argmax(probs))
    explained_class = target_class if target_class is not None else predicted_class
    
    # Resize CAM to original image size
    original_np = np.array(original_image.resize((IMAGE_SIZE, IMAGE_SIZE)))
    cam_resized = cv2.resize(cam, (IMAGE_SIZE, IMAGE_SIZE))
    
    # Create heatmap overlay
    heatmap = cv2.applyColorMap(np.uint8(255 * cam_resized), cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
    
    # Blend with original image
    overlay = np.uint8(alpha * heatmap + (1 - alpha) * original_np)
    
    # Save
    if output_path is None:
        HEATMAPS_DIR.mkdir(parents=True, exist_ok=True)
        filename = f"gradcam_{uuid.uuid4().hex[:8]}.png"
        output_path = str(HEATMAPS_DIR / filename)
    
    overlay_image = Image.fromarray(overlay)
    overlay_image.save(output_path)
    
    # Build relative URL for API
    heatmap_url = None
    if "uploads" in output_path:
        # Extract path relative to uploads dir
        idx = output_path.replace("\\", "/").find("uploads/")
        if idx >= 0:
            heatmap_url = "/" + output_path.replace("\\", "/")[idx:]
    
    return {
        "heatmap_path": output_path,
        "heatmap_url": heatmap_url,
        "predicted_class": predicted_class,
        "predicted_label": CLASS_LABELS[predicted_class],
        "explained_class": explained_class,
        "explained_label": CLASS_LABELS[explained_class],
        "confidence": float(probs[predicted_class]),
    }


def main():
    parser = argparse.ArgumentParser(description="NetraAI Grad-CAM Heatmap Generator")
    parser.add_argument("--image", type=str, required=True, help="Path to fundus image")
    parser.add_argument("--model", type=str, default=None, help="Model checkpoint path")
    parser.add_argument("--output", type=str, default=None, help="Output heatmap path")
    parser.add_argument("--target_class", type=int, default=None, help="Class to explain (0-4)")
    parser.add_argument("--alpha", type=float, default=0.5, help="Heatmap overlay transparency")
    args = parser.parse_args()

    if not os.path.exists(args.image):
        print(f"[ERROR] Image not found: {args.image}")
        sys.exit(1)

    print(f"[*] Generating Grad-CAM heatmap for: {args.image}")
    result = generate_heatmap(
        image_path=args.image,
        model_path=args.model,
        target_class=args.target_class,
        output_path=args.output,
        alpha=args.alpha,
    )

    print(f"\n  Prediction:     {result['predicted_label']} ({result['confidence']:.2%})")
    print(f"  Explaining:     {result['explained_label']}")
    print(f"  Heatmap saved:  {result['heatmap_path']}")


if __name__ == "__main__":
    main()

"""NetraAI ML Pipeline — EfficientNet-B3 Model Definition"""
import torch
import torch.nn as nn
from torchvision import models


class DRClassifier(nn.Module):
    """EfficientNet-B3 based Diabetic Retinopathy classifier.
    
    Architecture:
        - EfficientNet-B3 backbone (pretrained on ImageNet)
        - Custom classifier head with dropout for 5-class DR grading
        - Supports feature extraction (frozen backbone) or fine-tuning
    """

    def __init__(self, num_classes: int = 5, pretrained: bool = True, dropout: float = 0.4):
        super().__init__()
        
        # Load EfficientNet-B3 backbone
        weights = models.EfficientNet_B3_Weights.IMAGENET1K_V1 if pretrained else None
        self.backbone = models.efficientnet_b3(weights=weights)
        
        # Get the number of features from the original classifier
        in_features = self.backbone.classifier[1].in_features
        
        # Replace classifier head
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=dropout, inplace=True),
            nn.Linear(in_features, 512),
            nn.ReLU(inplace=True),
            nn.BatchNorm1d(512),
            nn.Dropout(p=dropout / 2),
            nn.Linear(512, num_classes),
        )
        
        self.num_classes = num_classes

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.backbone(x)

    def freeze_backbone(self):
        """Freeze all backbone layers for feature extraction."""
        for param in self.backbone.features.parameters():
            param.requires_grad = False

    def unfreeze_backbone(self):
        """Unfreeze all backbone layers for fine-tuning."""
        for param in self.backbone.features.parameters():
            param.requires_grad = True

    def get_features_layer(self):
        """Return the last convolutional feature layer (for Grad-CAM)."""
        return self.backbone.features[-1]


def build_model(num_classes: int = 5, pretrained: bool = True, dropout: float = 0.4) -> DRClassifier:
    """Factory function to build the DR classifier model."""
    return DRClassifier(num_classes=num_classes, pretrained=pretrained, dropout=dropout)


def load_model(model_path: str, num_classes: int = 5, device: str = "cpu") -> DRClassifier:
    """Load a trained model from checkpoint.
    
    Args:
        model_path: Path to the .pth checkpoint file
        num_classes: Number of output classes
        device: Device to load model to ('cpu' or 'cuda')
    
    Returns:
        Loaded DRClassifier model in eval mode
    """
    model = DRClassifier(num_classes=num_classes, pretrained=False)
    
    checkpoint = torch.load(model_path, map_location=device, weights_only=False)
    
    # Handle both raw state_dict and checkpoint dict formats
    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        model.load_state_dict(checkpoint["model_state_dict"])
    else:
        model.load_state_dict(checkpoint)
    
    model = model.to(device)
    model.eval()
    return model


def save_model(model: DRClassifier, path: str, optimizer=None, epoch: int = 0, 
               best_kappa: float = 0.0, extra: dict = None):
    """Save model checkpoint with training metadata.
    
    Args:
        model: The DRClassifier model to save
        path: Destination file path
        optimizer: Optional optimizer state to save
        epoch: Current epoch number
        best_kappa: Best validation kappa score achieved
        extra: Additional metadata to save
    """
    checkpoint = {
        "model_state_dict": model.state_dict(),
        "num_classes": model.num_classes,
        "epoch": epoch,
        "best_kappa": best_kappa,
    }
    if optimizer is not None:
        checkpoint["optimizer_state_dict"] = optimizer.state_dict()
    if extra:
        checkpoint.update(extra)
    
    torch.save(checkpoint, path)

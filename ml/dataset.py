"""NetraAI ML Pipeline — PyTorch Dataset for Fundus Images"""
import os
import csv
import random
from pathlib import Path
from typing import Optional, Tuple, List

import torch
from torch.utils.data import Dataset, DataLoader, WeightedRandomSampler
from torchvision import transforms
from PIL import Image
import numpy as np

from .config import (
    IMAGE_SIZE, IMAGENET_MEAN, IMAGENET_STD,
    AUGMENTATION, TRAIN_CONFIG, NUM_CLASSES,
)


class DRDataset(Dataset):
    """Diabetic Retinopathy fundus image dataset.
    
    Expects data in one of these formats:
    
    1. **CSV format**: A CSV file with columns `image` (filename) and `level` (0-4)
       alongside a directory of images.
       
    2. **Folder format**: Subdirectories named 0/, 1/, 2/, 3/, 4/ each containing
       images of that DR grade.
    
    Args:
        data_dir: Root directory containing images
        csv_path: Optional CSV file path with labels
        transform: torchvision transforms to apply
        is_train: Whether this is a training dataset (affects augmentations)
    """

    def __init__(
        self,
        data_dir: str,
        csv_path: Optional[str] = None,
        transform: Optional[transforms.Compose] = None,
        is_train: bool = True,
    ):
        self.data_dir = Path(data_dir)
        self.transform = transform or self._default_transform(is_train)
        self.samples: List[Tuple[str, int]] = []
        
        if csv_path and os.path.exists(csv_path):
            self._load_from_csv(csv_path)
        else:
            self._load_from_folders()

    def _load_from_csv(self, csv_path: str):
        """Load image paths and labels from a CSV file."""
        with open(csv_path, "r") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Support common column names
                img_name = row.get("image") or row.get("id_code") or row.get("filename", "")
                label = int(row.get("level") or row.get("diagnosis") or row.get("label", 0))
                
                # Try common extensions
                img_path = None
                for ext in ["", ".png", ".jpg", ".jpeg", ".tiff"]:
                    candidate = self.data_dir / f"{img_name}{ext}"
                    if candidate.exists():
                        img_path = str(candidate)
                        break
                
                if img_path and 0 <= label < NUM_CLASSES:
                    self.samples.append((img_path, label))

    def _load_from_folders(self):
        """Load from subdirectories named 0/ through 4/."""
        for label in range(NUM_CLASSES):
            label_dir = self.data_dir / str(label)
            if not label_dir.is_dir():
                continue
            for img_file in sorted(label_dir.iterdir()):
                if img_file.suffix.lower() in {".png", ".jpg", ".jpeg", ".tiff", ".bmp"}:
                    self.samples.append((str(img_file), label))

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, int]:
        img_path, label = self.samples[idx]
        
        try:
            image = Image.open(img_path).convert("RGB")
        except Exception:
            # Return a black image on error (avoid crashing training)
            image = Image.new("RGB", (IMAGE_SIZE, IMAGE_SIZE), (0, 0, 0))
        
        if self.transform:
            image = self.transform(image)
        
        return image, label

    def get_class_distribution(self) -> dict:
        """Return count of samples per class."""
        dist = {i: 0 for i in range(NUM_CLASSES)}
        for _, label in self.samples:
            dist[label] += 1
        return dist

    @staticmethod
    def _default_transform(is_train: bool) -> transforms.Compose:
        """Build default transforms with augmentation for training."""
        aug = AUGMENTATION
        
        if is_train:
            return transforms.Compose([
                transforms.Resize((IMAGE_SIZE + 20, IMAGE_SIZE + 20)),
                transforms.RandomCrop(IMAGE_SIZE),
                transforms.RandomHorizontalFlip(p=aug["horizontal_flip_p"]),
                transforms.RandomVerticalFlip(p=aug["vertical_flip_p"]),
                transforms.RandomRotation(degrees=aug["rotation_limit"]),
                transforms.ColorJitter(
                    brightness=aug["brightness_limit"],
                    contrast=aug["contrast_limit"],
                    saturation=aug["sat_shift_limit"] / 100,
                    hue=aug["hue_shift_limit"] / 360,
                ),
                transforms.RandomGrayscale(p=0.05),
                transforms.GaussianBlur(kernel_size=aug["blur_limit"], sigma=(0.1, 2.0)),
                transforms.ToTensor(),
                transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
                transforms.RandomErasing(p=0.1, scale=(0.02, 0.1)),
            ])
        else:
            return transforms.Compose([
                transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
                transforms.ToTensor(),
                transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
            ])


def create_dataloaders(
    data_dir: str,
    csv_path: Optional[str] = None,
    batch_size: int = None,
    num_workers: int = None,
    val_split: float = None,
    seed: int = None,
) -> Tuple[DataLoader, DataLoader]:
    """Create train and validation DataLoaders with stratified split.
    
    Args:
        data_dir: Root directory containing images
        csv_path: Optional CSV with labels
        batch_size: Batch size (default from config)
        num_workers: Number of data loading workers
        val_split: Fraction for validation
        seed: Random seed for reproducibility
    
    Returns:
        Tuple of (train_loader, val_loader)
    """
    cfg = TRAIN_CONFIG
    batch_size = batch_size or cfg["batch_size"]
    num_workers = num_workers or cfg["num_workers"]
    val_split = val_split or cfg["val_split"]
    seed = seed or cfg["seed"]
    
    # Load full dataset (no augmentation for splitting)
    full_dataset = DRDataset(data_dir, csv_path, transform=None, is_train=True)
    
    if len(full_dataset) == 0:
        raise ValueError(f"No images found in {data_dir}. "
                         "Expected CSV with 'image','level' columns or subfolders 0/-4/.")
    
    # Stratified split
    random.seed(seed)
    np.random.seed(seed)
    
    indices_by_class = {i: [] for i in range(NUM_CLASSES)}
    for idx, (_, label) in enumerate(full_dataset.samples):
        indices_by_class[label].append(idx)
    
    train_indices, val_indices = [], []
    for cls_indices in indices_by_class.values():
        random.shuffle(cls_indices)
        n_val = max(1, int(len(cls_indices) * val_split))
        val_indices.extend(cls_indices[:n_val])
        train_indices.extend(cls_indices[n_val:])
    
    # Build separate datasets with proper transforms
    train_transform = DRDataset._default_transform(is_train=True)
    val_transform = DRDataset._default_transform(is_train=False)
    
    train_dataset = torch.utils.data.Subset(
        DRDataset(data_dir, csv_path, transform=train_transform, is_train=True),
        train_indices,
    )
    val_dataset = torch.utils.data.Subset(
        DRDataset(data_dir, csv_path, transform=val_transform, is_train=False),
        val_indices,
    )
    
    # Weighted sampler for class imbalance
    train_labels = [full_dataset.samples[i][1] for i in train_indices]
    class_counts = np.bincount(train_labels, minlength=NUM_CLASSES).astype(float)
    class_counts[class_counts == 0] = 1.0  # avoid division by zero
    sample_weights = 1.0 / class_counts[train_labels]
    sampler = WeightedRandomSampler(
        weights=sample_weights,
        num_samples=len(train_indices),
        replacement=True,
    )
    
    train_loader = DataLoader(
        train_dataset,
        batch_size=batch_size,
        sampler=sampler,
        num_workers=num_workers,
        pin_memory=True,
        drop_last=True,
    )
    val_loader = DataLoader(
        val_dataset,
        batch_size=batch_size,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=True,
    )
    
    return train_loader, val_loader

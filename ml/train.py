"""NetraAI ML Pipeline — Training Script

Usage:
    python -m ml.train --data_dir ml/data --epochs 30 --batch_size 16
    python -m ml.train --dry-run  # Verify pipeline without real data
"""
import argparse
import os
import sys
import time
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingWarmRestarts
from torch.cuda.amp import GradScaler, autocast

# Add project root to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from ml.config import (
    TRAIN_CONFIG, CLASS_WEIGHTS, NUM_CLASSES, CLASS_LABELS,
    MODELS_DIR, IMAGE_SIZE,
)
from ml.model import build_model, save_model
from ml.dataset import create_dataloaders, DRDataset


def compute_quadratic_weighted_kappa(y_true, y_pred, num_classes=5):
    """Compute Quadratic Weighted Kappa (QWK) — the primary DR competition metric."""
    from sklearn.metrics import cohen_kappa_score
    return cohen_kappa_score(y_true, y_pred, weights="quadratic")


def train_one_epoch(model, loader, criterion, optimizer, scaler, device, use_amp):
    """Train for one epoch. Returns average loss and accuracy."""
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for batch_idx, (images, labels) in enumerate(loader):
        images = images.to(device, non_blocking=True)
        labels = labels.to(device, non_blocking=True)

        optimizer.zero_grad(set_to_none=True)

        if use_amp and device.type == "cuda":
            with autocast():
                outputs = model(images)
                loss = criterion(outputs, labels)
            scaler.scale(loss).backward()
            scaler.unscale_(optimizer)
            nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            scaler.step(optimizer)
            scaler.update()
        else:
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()

        running_loss += loss.item() * images.size(0)
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()

    avg_loss = running_loss / total if total > 0 else 0
    accuracy = correct / total if total > 0 else 0
    return avg_loss, accuracy


@torch.no_grad()
def validate(model, loader, criterion, device):
    """Validate model. Returns loss, accuracy, kappa, and per-class metrics."""
    model.eval()
    running_loss = 0.0
    all_preds = []
    all_labels = []

    for images, labels in loader:
        images = images.to(device, non_blocking=True)
        labels = labels.to(device, non_blocking=True)

        outputs = model(images)
        loss = criterion(outputs, labels)

        running_loss += loss.item() * images.size(0)
        _, predicted = outputs.max(1)
        all_preds.extend(predicted.cpu().numpy())
        all_labels.extend(labels.cpu().numpy())

    total = len(all_labels)
    avg_loss = running_loss / total if total > 0 else 0
    accuracy = np.mean(np.array(all_preds) == np.array(all_labels)) if total > 0 else 0

    # Quadratic Weighted Kappa
    try:
        kappa = compute_quadratic_weighted_kappa(all_labels, all_preds, NUM_CLASSES)
    except Exception:
        kappa = 0.0

    # Per-class accuracy
    per_class = {}
    for cls in range(NUM_CLASSES):
        mask = np.array(all_labels) == cls
        if mask.sum() > 0:
            cls_acc = np.mean(np.array(all_preds)[mask] == cls)
            per_class[CLASS_LABELS[cls]] = round(float(cls_acc), 4)
        else:
            per_class[CLASS_LABELS[cls]] = None

    return avg_loss, accuracy, kappa, per_class


def create_dummy_data(data_dir: str, n_per_class: int = 10):
    """Create tiny synthetic dataset for dry-run / smoke testing."""
    from PIL import Image
    data_path = Path(data_dir)
    for cls in range(NUM_CLASSES):
        cls_dir = data_path / str(cls)
        cls_dir.mkdir(parents=True, exist_ok=True)
        for i in range(n_per_class):
            img = Image.fromarray(
                np.random.randint(0, 255, (IMAGE_SIZE, IMAGE_SIZE, 3), dtype=np.uint8)
            )
            img.save(cls_dir / f"dummy_{cls}_{i}.png")
    print(f"[OK] Created dummy dataset: {n_per_class * NUM_CLASSES} images in {data_dir}")


def main():
    parser = argparse.ArgumentParser(description="Train NetraAI DR Classifier")
    parser.add_argument("--data_dir", type=str, default="ml/data", help="Path to image data directory")
    parser.add_argument("--csv_path", type=str, default=None, help="Optional CSV file with labels")
    parser.add_argument("--epochs", type=int, default=TRAIN_CONFIG["epochs"])
    parser.add_argument("--batch_size", type=int, default=TRAIN_CONFIG["batch_size"])
    parser.add_argument("--lr", type=float, default=TRAIN_CONFIG["learning_rate"])
    parser.add_argument("--num_workers", type=int, default=TRAIN_CONFIG["num_workers"])
    parser.add_argument("--output", type=str, default=str(MODELS_DIR / "efficientnet_dr.pth"))
    parser.add_argument("--resume", type=str, default=None, help="Resume from checkpoint")
    parser.add_argument("--freeze_epochs", type=int, default=TRAIN_CONFIG["warmup_epochs"],
                        help="Number of initial epochs with frozen backbone")
    parser.add_argument("--dry-run", action="store_true", help="Run with dummy data for testing")
    parser.add_argument("--no-amp", action="store_true", help="Disable mixed precision")
    args = parser.parse_args()

    # ─── Device Setup ─────────────────────────────────────────────────
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    use_amp = TRAIN_CONFIG["use_amp"] and not args.no_amp and device.type == "cuda"
    
    print("=" * 60)
    print("  NetraAI - Diabetic Retinopathy Training Pipeline")
    print("=" * 60)
    print(f"  Device:          {device}")
    print(f"  Mixed Precision: {use_amp}")
    print(f"  Epochs:          {args.epochs}")
    print(f"  Batch Size:      {args.batch_size}")
    print(f"  Learning Rate:   {args.lr}")
    print(f"  Output:          {args.output}")
    print("=" * 60)

    # ─── Dry Run Setup ────────────────────────────────────────────────
    if args.dry_run:
        dry_dir = str(Path(args.data_dir) / "_dry_run")
        create_dummy_data(dry_dir, n_per_class=5)
        args.data_dir = dry_dir
        args.epochs = 2
        args.num_workers = 0
        print("[DRY RUN] Using synthetic data, 2 epochs, 0 workers")

    # ─── Data ─────────────────────────────────────────────────────────
    print("\n[1/4] Loading dataset...")
    try:
        train_loader, val_loader = create_dataloaders(
            data_dir=args.data_dir,
            csv_path=args.csv_path,
            batch_size=args.batch_size,
            num_workers=args.num_workers,
        )
    except ValueError as e:
        print(f"[ERROR] {e}")
        print("\nTo run a smoke test, use: python -m ml.train --dry-run")
        sys.exit(1)

    print(f"  Train samples: {len(train_loader.dataset)}")
    print(f"  Val samples:   {len(val_loader.dataset)}")

    # ─── Model ────────────────────────────────────────────────────────
    print("\n[2/4] Building model...")
    model = build_model(num_classes=NUM_CLASSES, pretrained=True)
    model = model.to(device)
    
    start_epoch = 0
    best_kappa = -1.0
    
    if args.resume and os.path.exists(args.resume):
        print(f"  Resuming from: {args.resume}")
        ckpt = torch.load(args.resume, map_location=device, weights_only=False)
        model.load_state_dict(ckpt["model_state_dict"])
        start_epoch = ckpt.get("epoch", 0)
        best_kappa = ckpt.get("best_kappa", -1.0)

    param_count = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"  Trainable params: {param_count:,}")

    # ─── Loss, Optimizer, Scheduler ───────────────────────────────────
    weights = torch.tensor(CLASS_WEIGHTS, dtype=torch.float32).to(device)
    criterion = nn.CrossEntropyLoss(weight=weights)
    
    optimizer = AdamW(
        model.parameters(),
        lr=args.lr,
        weight_decay=TRAIN_CONFIG["weight_decay"],
    )
    
    scheduler = CosineAnnealingWarmRestarts(
        optimizer,
        T_0=max(1, args.epochs // 3),
        T_mult=2,
        eta_min=TRAIN_CONFIG["lr_min"],
    )
    
    scaler = GradScaler(enabled=use_amp)

    # ─── Training Loop ────────────────────────────────────────────────
    print("\n[3/4] Training...")
    os.makedirs(os.path.dirname(args.output), exist_ok=True)
    
    for epoch in range(start_epoch, args.epochs):
        epoch_start = time.time()
        
        # Freeze/unfreeze backbone
        if epoch < args.freeze_epochs:
            model.freeze_backbone()
            phase = "WARMUP (backbone frozen)"
        else:
            model.unfreeze_backbone()
            phase = "FINE-TUNING"
        
        # Train
        train_loss, train_acc = train_one_epoch(
            model, train_loader, criterion, optimizer, scaler, device, use_amp
        )
        
        # Validate
        val_loss, val_acc, val_kappa, per_class = validate(
            model, val_loader, criterion, device
        )
        
        scheduler.step()
        elapsed = time.time() - epoch_start
        lr_now = optimizer.param_groups[0]["lr"]
        
        print(
            f"  Epoch {epoch+1:3d}/{args.epochs} ({phase}) "
            f"| Train Loss: {train_loss:.4f} Acc: {train_acc:.4f} "
            f"| Val Loss: {val_loss:.4f} Acc: {val_acc:.4f} Kappa: {val_kappa:.4f} "
            f"| LR: {lr_now:.2e} | {elapsed:.1f}s"
        )
        
        # Save best model
        if val_kappa > best_kappa:
            best_kappa = val_kappa
            save_model(
                model, args.output,
                optimizer=optimizer,
                epoch=epoch + 1,
                best_kappa=best_kappa,
                extra={"per_class_acc": per_class},
            )
            print(f"  [*] New best model saved (kappa={best_kappa:.4f})")

    # ─── Summary ──────────────────────────────────────────────────────
    print("\n[4/4] Training complete!")
    print(f"  Best Validation Kappa: {best_kappa:.4f}")
    print(f"  Model saved to: {args.output}")
    
    if args.dry_run:
        # Cleanup dummy data
        import shutil
        dry_dir = str(Path(args.data_dir))
        if os.path.exists(dry_dir):
            shutil.rmtree(dry_dir)
            print("  [DRY RUN] Cleaned up dummy data")

    return best_kappa


if __name__ == "__main__":
    main()

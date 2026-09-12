"""NetraAI — PDF Report Generation Router

Generates downloadable PDF reports for completed screenings,
including patient info, AI prediction details, probability charts,
and referral recommendations.
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session, joinedload
from datetime import datetime
import os
import uuid
import io

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, Image as RLImage,
)
from reportlab.graphics.shapes import Drawing, Rect
from reportlab.graphics.charts.barcharts import VerticalBarChart

from ..database.db import get_db
from ..models.models import User, Screening, Patient, Explanation
from ..services.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["Reports"])

REPORTS_DIR = os.getenv("REPORTS_DIR", "./uploads/reports")
os.makedirs(REPORTS_DIR, exist_ok=True)


def _build_probability_chart(probabilities: dict) -> Drawing:
    """Create a bar chart of class probabilities."""
    drawing = Drawing(400, 150)

    labels = ["No DR", "Mild", "Moderate", "Severe", "PDR"]
    values = [
        probabilities.get("no_dr", 0) or 0,
        probabilities.get("mild", 0) or 0,
        probabilities.get("moderate", 0) or 0,
        probabilities.get("severe", 0) or 0,
        probabilities.get("proliferative", 0) or 0,
    ]
    # Convert to percentages
    values = [v * 100 for v in values]

    bc = VerticalBarChart()
    bc.x = 50
    bc.y = 20
    bc.height = 110
    bc.width = 320
    bc.data = [values]
    bc.strokeColor = colors.transparent
    bc.valueAxis.valueMin = 0
    bc.valueAxis.valueMax = 100
    bc.valueAxis.valueStep = 25
    bc.categoryAxis.labels.boxAnchor = "ne"
    bc.categoryAxis.labels.dx = 8
    bc.categoryAxis.labels.dy = -2
    bc.categoryAxis.labels.angle = 0
    bc.categoryAxis.labels.fontSize = 8
    bc.categoryAxis.categoryNames = labels
    bc.bars[0].fillColor = colors.HexColor("#4F46E5")

    drawing.add(bc)
    return drawing


def _risk_color(risk_level: str) -> colors.Color:
    """Map risk level to a ReportLab color."""
    mapping = {
        "low": colors.HexColor("#10B981"),
        "moderate": colors.HexColor("#F59E0B"),
        "high": colors.HexColor("#EF4444"),
    }
    return mapping.get(risk_level, colors.gray)


@router.get("/screening/{screening_id}")
def generate_screening_report(
    screening_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Generate and return a PDF report for a screening.

    The PDF includes:
    - Patient demographics
    - AI prediction results with probability chart
    - Risk assessment and referral recommendation
    - Explainability text (if available)
    - Timestamp and screener information
    """
    screening = (
        db.query(Screening)
        .options(
            joinedload(Screening.patient),
            joinedload(Screening.explanation),
        )
        .filter(Screening.id == screening_id)
        .first()
    )
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")

    patient = screening.patient
    if not patient:
        raise HTTPException(status_code=404, detail="Patient data missing for this screening")

    # ── Build PDF ─────────────────────────────────────────────────────
    filename = f"netra_report_{screening_id}_{uuid.uuid4().hex[:6]}.pdf"
    filepath = os.path.join(REPORTS_DIR, filename)

    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        rightMargin=20 * mm,
        leftMargin=20 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontSize=18,
        spaceAfter=6,
        textColor=colors.HexColor("#1E1B4B"),
    )
    heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontSize=13,
        spaceBefore=14,
        spaceAfter=6,
        textColor=colors.HexColor("#4F46E5"),
    )
    normal = styles["Normal"]

    elements = []

    # ── Header ────────────────────────────────────────────────────────
    elements.append(Paragraph("NetraAI — Screening Report", title_style))
    elements.append(Paragraph(
        f"Generated: {datetime.now().strftime('%B %d, %Y at %I:%M %p')} &nbsp;|&nbsp; "
        f"Screening ID: S-{screening_id:03d}",
        normal,
    ))
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E5E7EB")))
    elements.append(Spacer(1, 10))

    # ── Patient Information ───────────────────────────────────────────
    elements.append(Paragraph("Patient Information", heading_style))

    patient_data = [
        ["Name", patient.name, "Patient Code", patient.patient_code],
        ["Age", str(patient.age or "N/A"), "Gender", patient.gender or "N/A"],
        ["Village", patient.village or "N/A", "Phone", patient.phone or "N/A"],
        ["Diabetes Duration", f"{patient.diabetes_duration} years" if patient.diabetes_duration else "N/A",
         "Previous Screening", "Yes" if patient.previous_screening else "No"],
    ]

    t = Table(patient_data, colWidths=[100, 140, 100, 140])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F3F4F6")),
        ("BACKGROUND", (2, 0), (2, -1), colors.HexColor("#F3F4F6")),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#374151")),
        ("TEXTCOLOR", (2, 0), (2, -1), colors.HexColor("#374151")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (2, 0), (2, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 8))

    # ── AI Prediction Results ─────────────────────────────────────────
    elements.append(Paragraph("AI Screening Results", heading_style))

    risk_level = screening.risk_level or "low"
    risk_col = _risk_color(risk_level)

    result_data = [
        ["Prediction", screening.predicted_label or "Pending"],
        ["Confidence", f"{(screening.confidence or 0) * 100:.1f}%"],
        ["Risk Level", (risk_level or "low").upper()],
        ["Referral Status", (screening.referral_status or "none").upper()],
        ["Image Quality", (screening.image_quality or "N/A").upper()],
        ["Screening Date", screening.created_at.strftime("%Y-%m-%d %H:%M") if screening.created_at else "N/A"],
    ]

    t2 = Table(result_data, colWidths=[120, 360])
    t2.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#F3F4F6")),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
        ("PADDING", (0, 0), (-1, -1), 6),
        ("TEXTCOLOR", (1, 2), (1, 2), risk_col),  # Risk level color
    ]))
    elements.append(t2)
    elements.append(Spacer(1, 8))

    # ── Probability Chart ─────────────────────────────────────────────
    elements.append(Paragraph("Class Probability Distribution", heading_style))

    probs = {
        "no_dr": screening.prob_no_dr,
        "mild": screening.prob_mild,
        "moderate": screening.prob_moderate,
        "severe": screening.prob_severe,
        "proliferative": screening.prob_proliferative,
    }

    chart = _build_probability_chart(probs)
    elements.append(chart)
    elements.append(Spacer(1, 8))

    # ── Probability Table ─────────────────────────────────────────────
    prob_rows = [["DR Grade", "Probability"]]
    labels = ["No DR", "Mild DR", "Moderate DR", "Severe DR", "Proliferative DR"]
    keys = ["no_dr", "mild", "moderate", "severe", "proliferative"]
    for label, key in zip(labels, keys):
        val = probs.get(key, 0) or 0
        prob_rows.append([label, f"{val * 100:.1f}%"])

    t3 = Table(prob_rows, colWidths=[200, 280])
    t3.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#4F46E5")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E5E7EB")),
        ("PADDING", (0, 0), (-1, -1), 6),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F9FAFB")]),
    ]))
    elements.append(t3)
    elements.append(Spacer(1, 10))

    # ── Referral Recommendation ───────────────────────────────────────
    elements.append(Paragraph("Referral Recommendation", heading_style))

    referral_text = ""
    if screening.explanation:
        referral_text = screening.explanation.explanation_text or ""
    if not referral_text:
        from ..services.ai_service import REFERRAL_TEXT as RT
        pred_class = screening.predicted_class or 0
        referral_text = RT.get(pred_class, RT[0])

    elements.append(Paragraph(referral_text, normal))
    elements.append(Spacer(1, 12))

    # ── Disclaimer ────────────────────────────────────────────────────
    elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#E5E7EB")))
    disclaimer_style = ParagraphStyle(
        "Disclaimer", parent=normal, fontSize=7, textColor=colors.gray,
    )
    elements.append(Paragraph(
        "<b>Disclaimer:</b> This report is generated by the NetraAI AI screening system "
        "and is intended to assist healthcare professionals. It does not constitute a "
        "medical diagnosis. Final clinical decisions should be made by qualified "
        "ophthalmologists based on comprehensive patient examination.",
        disclaimer_style,
    ))

    # ── Generate PDF ──────────────────────────────────────────────────
    doc.build(elements)

    return FileResponse(
        filepath,
        media_type="application/pdf",
        filename=f"NetraAI_Report_S{screening_id:03d}_{patient.patient_code}.pdf",
    )


@router.get("/screening/{screening_id}/summary")
def get_report_summary(
    screening_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a JSON summary of a screening report (for preview before download)."""
    screening = (
        db.query(Screening)
        .options(joinedload(Screening.patient), joinedload(Screening.explanation))
        .filter(Screening.id == screening_id)
        .first()
    )
    if not screening:
        raise HTTPException(status_code=404, detail="Screening not found")

    patient = screening.patient
    return {
        "screening_id": screening_id,
        "patient": {
            "name": patient.name if patient else "N/A",
            "code": patient.patient_code if patient else "N/A",
            "age": patient.age if patient else None,
            "village": patient.village if patient else "N/A",
        },
        "prediction": screening.predicted_label,
        "confidence": screening.confidence,
        "risk_level": screening.risk_level,
        "referral_status": screening.referral_status,
        "image_quality": screening.image_quality,
        "date": screening.created_at.strftime("%Y-%m-%d") if screening.created_at else None,
        "can_download": True,
    }

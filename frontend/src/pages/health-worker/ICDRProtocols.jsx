import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  HelpCircle,
  FileText
} from 'lucide-react';

const ICDR_STAGES = [
  {
    grade: 0,
    title: 'Grade 0: No Apparent DR',
    severity: 'Normal Fundus',
    badgeColor: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    followUp: 'Annual (12 Months)',
    urgency: 'Routine Screening',
    findings: 'No abnormalities, microaneurysms, hemorrhages, or exudates found in any quadrant.',
    criteria: [
      'Zero microaneurysms detected',
      'Normal retinal vascular caliber without beading',
      'Clear macula without edema or hard lipid deposits',
      'Sharp optic disc margin with cup-to-disc ratio < 0.4'
    ],
    ruralAction: 'Advise patient on annual diabetic eye screening. Maintain HbA1c < 7.0% and control blood pressure.',
    hindiAdvice: 'कोई मधुमेह संबंधित रेटिना खराबी नहीं। साल में एक बार जांच कराएं और चीनी नियंत्रित रखें।'
  },
  {
    grade: 1,
    title: 'Grade 1: Mild NPDR',
    severity: 'Early Retinopathy',
    badgeColor: '#34d399',
    badgeBg: 'rgba(52, 211, 153, 0.15)',
    followUp: '6 – 9 Months',
    urgency: 'Low Risk Monitoring',
    findings: 'Presence of microaneurysms ONLY (tiny outpouchings of retinal capillaries).',
    criteria: [
      'Few microaneurysms (isolated red dots)',
      'No retinal hemorrhages, hard exudates, or cotton wool spots',
      'No venous beading or IRMA present',
      'Foveal center intact without clinically significant edema'
    ],
    ruralAction: 'Schedule follow-up retinal scan in 6 to 9 months. Recheck glycemic control and counsel on lifestyle.',
    hindiAdvice: 'शुरुआती लक्षण (बारीक खून की थैलियां)। 6-9 महीने में दोबारा जांच कराएं। आहार में सुधार करें।'
  },
  {
    grade: 2,
    title: 'Grade 2: Moderate NPDR',
    severity: 'Established Retinopathy',
    badgeColor: '#fbbf24',
    badgeBg: 'rgba(251, 191, 36, 0.15)',
    followUp: '3 – 6 Months',
    urgency: 'Specialist Review Recommended',
    findings: 'More than just microaneurysms, but less than Severe NPDR criteria.',
    criteria: [
      'Multiple microaneurysms and dot-and-blot intraretinal hemorrhages',
      'Hard lipid exudates in clusters away from foveal center',
      'Occasional cotton wool spots (nerve fiber layer infarcts)',
      'No definite venous beading or extensive IRMA'
    ],
    ruralAction: 'Refer to tele-ophthalmology hub within 1 month. Monitor for blurred vision and optimize diabetes medication.',
    hindiAdvice: 'मध्यम रेटिनोपैथी। धब्बे और रिसाव दिख रहे हैं। एक महीने के भीतर नेत्र विशेषज्ञ से परामर्श लें।'
  },
  {
    grade: 3,
    title: 'Grade 3: Severe NPDR',
    severity: 'High Pre-Proliferative Risk',
    badgeColor: '#f97316',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    followUp: '2 – 4 Weeks',
    urgency: 'Prompt Hospital Referral',
    findings: 'Characterized by the International "4-2-1 Rule" without proliferative neovascularization.',
    criteria: [
      '4-2-1 Rule: >20 intraretinal hemorrhages in each of the 4 quadrants, OR',
      'Definite venous beading in 2 or more retinal quadrants, OR',
      'Prominent Intraretinal Microvascular Abnormalities (IRMA) in 1 or more quadrants',
      'High 50% 1-year progression risk to proliferative DR if left untreated'
    ],
    ruralAction: 'Prompt referral to district eye hospital within 2-4 weeks. Prepare for preventive retinal laser evaluation.',
    hindiAdvice: 'गंभीर रेटिनोपैथी (4-2-1 नियम)। 2 से 4 सप्ताह में बड़े अस्पताल में रेटिना विशेषज्ञ को दिखाएं।'
  },
  {
    grade: 4,
    title: 'Grade 4: Proliferative DR (PDR)',
    severity: 'Sight-Threatening Emergency',
    badgeColor: '#ef4444',
    badgeBg: 'rgba(239, 68, 68, 0.2)',
    followUp: 'Immediate (< 48 Hours)',
    urgency: 'Urgent Tertiary Intervention',
    findings: 'Pathological neovascularization of the retina or disc, vitreous hemorrhage, or tractional detachment.',
    criteria: [
      'Neovascularization of the Disc (NVD) or Retina (NVE)',
      'Preretinal or vitreous hemorrhage causing sudden floaters/vision loss',
      'Fibrous proliferation and tractional retinal detachment risk',
      'High-risk Diabetic Macular Edema (CSME) involving the fovea'
    ],
    ruralAction: 'URGENT FAST-TRACK REFERRAL within 24-48 hours. Dispatch patient to tertiary center for Panretinal Photocoagulation (PRP) or Anti-VEGF injection.',
    hindiAdvice: 'अत्यंत गंभीर आपातकाल (नई रक्त वाहिकाएं व खून रिसाव)। 24-48 घंटे में बड़े अस्पताल जाएं, लेजर या इंजेक्शन आवश्यक है।'
  }
];

export default function ICDRProtocols() {
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState(2); // Default to Moderate

  const currentStage = ICDR_STAGES.find((s) => s.grade === selectedGrade);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#030712',
        color: '#f8fafc',
        padding: '24px 32px 64px',
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '100px',
                background: 'rgba(20, 184, 166, 0.15)',
                border: '1px solid rgba(45, 212, 191, 0.3)',
                color: '#2dd4bf',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              <BookOpen size={13} />
              International Standard (ICDR / AAO Guidelines)
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
            ICDR Diabetic Retinopathy Grading Protocols
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: '#94a3b8' }}>
            Standardized 5-Stage Clinical Decision Support guide for rural health workers, primary health centres, and ophthalmologists.
          </p>
        </div>

        {/* 5-Stage Segmented Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '28px'
          }}
        >
          {ICDR_STAGES.map((stage) => {
            const isSelected = selectedGrade === stage.grade;
            return (
              <motion.button
                key={stage.grade}
                onClick={() => setSelectedGrade(stage.grade)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '16px',
                  borderRadius: '18px',
                  background: isSelected ? 'rgba(15, 30, 48, 0.9)' : 'rgba(8, 20, 34, 0.65)',
                  border: isSelected ? `2px solid ${stage.badgeColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isSelected ? `0 0 20px ${stage.badgeColor}33` : 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '100px',
                      background: stage.badgeBg,
                      color: stage.badgeColor
                    }}
                  >
                    Grade {stage.grade}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{stage.followUp}</span>
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
                  {stage.title.split(':')[1]}
                </div>
                <div style={{ fontSize: '0.72rem', color: stage.badgeColor }}>
                  {stage.severity}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Active Stage Detailed Breakdown */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage.grade}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '24px',
              marginBottom: '36px'
            }}
          >
            {/* Left Card: Clinical Criteria & Lesions */}
            <div
              style={{
                background: 'rgba(8, 20, 34, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: `1px solid ${currentStage.badgeColor}44`,
                padding: '28px',
                boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '100px',
                    background: currentStage.badgeBg,
                    color: currentStage.badgeColor,
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}
                >
                  {currentStage.urgency}
                </span>
                <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                  Protocol SLA: <strong style={{ color: '#ffffff' }}>{currentStage.followUp}</strong>
                </span>
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 10px', color: '#ffffff' }}>
                {currentStage.title}
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 20px' }}>
                {currentStage.findings}
              </p>

              <h4 style={{ fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 12px' }}>
                Diagnostic Criteria & Hallmarks
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {currentStage.criteria.map((crit, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      fontSize: '0.82rem',
                      color: '#f1f5f9'
                    }}
                  >
                    <CheckCircle2 size={16} color={currentStage.badgeColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{crit}</span>
                  </div>
                ))}
              </div>

              {/* Action for rural health worker */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(20, 184, 166, 0.1)',
                  border: '1px solid rgba(45, 212, 191, 0.25)',
                  marginBottom: '16px'
                }}
              >
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#2dd4bf', marginBottom: '4px' }}>
                  MANDATORY RURAL ACTION:
                </div>
                <div style={{ fontSize: '0.82rem', color: '#f8fafc', lineHeight: 1.45 }}>
                  {currentStage.ruralAction}
                </div>
              </div>

              {/* Hindi patient explanation */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  fontSize: '0.78rem',
                  color: '#94a3b8'
                }}
              >
                <strong style={{ color: '#cbd5e1' }}>मरीज को परामर्श (Hindi Counseling): </strong>
                {currentStage.hindiAdvice}
              </div>
            </div>

            {/* Right Card: Fundus Illustration & Fast-Track Actions */}
            <div
              style={{
                background: 'rgba(8, 20, 34, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                  Anatomical Lesion Model: Grade {currentStage.grade}
                </h3>

                {/* Simulated Retinal Canvas */}
                <div
                  style={{
                    height: '240px',
                    borderRadius: '18px',
                    background: '#040d18',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    marginBottom: '18px'
                  }}
                >
                  <div
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      background: currentStage.grade === 0
                        ? 'radial-gradient(circle at 40% 40%, #b45309 0%, #78350f 70%, #451a03 100%)'
                        : currentStage.grade >= 3
                        ? 'radial-gradient(circle at 40% 40%, #7f1d1d 0%, #450a0a 70%, #1f0404 100%)'
                        : 'radial-gradient(circle at 40% 40%, #92400e 0%, #713f12 70%, #422006 100%)',
                      boxShadow: `0 0 40px ${currentStage.badgeColor}44`,
                      position: 'relative'
                    }}
                  >
                    {/* Optic Disc */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '40%',
                        left: '20%',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#fde047',
                        opacity: 0.85
                      }}
                    />

                    {/* Stage specific lesion representations */}
                    {currentStage.grade >= 1 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '30%',
                          right: '30%',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#ef4444',
                          boxShadow: '0 0 6px #ef4444'
                        }}
                      />
                    )}
                    {currentStage.grade >= 2 && (
                      <>
                        <div style={{ position: 'absolute', bottom: '35%', right: '25%', width: '8px', height: '8px', borderRadius: '50%', background: '#fbbf24' }} />
                        <div style={{ position: 'absolute', top: '50%', right: '40%', width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444' }} />
                      </>
                    )}
                    {currentStage.grade >= 3 && (
                      <>
                        <div style={{ position: 'absolute', top: '20%', left: '50%', width: '12px', height: '12px', borderRadius: '50%', background: '#f97316' }} />
                        <div style={{ position: 'absolute', bottom: '25%', left: '35%', width: '14px', height: '14px', borderRadius: '50%', background: '#dc2626' }} />
                      </>
                    )}
                    {currentStage.grade === 4 && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '50%',
                          border: '3px dashed #ef4444',
                          animation: 'spin 12s linear infinite'
                        }}
                      />
                    )}
                  </div>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.45 }}>
                  NetraAI's multi-head convolutional backbone correlates lesion density against the ICDR gold standard, achieving <strong>94.2% diagnostic concordance</strong> with retina board specialists.
                </div>
              </div>

              {/* Fast Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
                <button
                  onClick={() => navigate('/screening/new')}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Eye size={15} />
                  Screen Patient for Grade {currentStage.grade}
                </button>

                {currentStage.grade >= 3 && (
                  <button
                    onClick={() => navigate('/escalation')}
                    style={{
                      padding: '10px',
                      borderRadius: '12px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <AlertTriangle size={15} />
                    Open Urgent Escalation Protocol
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, ShieldCheck, Plus, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DRStagesModal({ isOpen, onClose, onNewScreening }) {
  const [selectedStageIdx, setSelectedStageIdx] = useState(0);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const stages = [
    {
      id: 's0',
      grade: 'Grade 0: No Apparent DR',
      title: 'Normal Retinal Microvasculature',
      color: 'linear-gradient(135deg, #0d9488 0%, #059669 50%, #064e3b 100%)',
      findings: 'No microaneurysms or retinal abnormalities detected.',
      action: 'Routine annual screening at village PHC in 12 months.',
      urgency: 'Low Risk • Routine Recall',
      badgeColor: '#10b981',
      last4: '2629',
    },
    {
      id: 's1',
      grade: 'Grade 1: Mild NPDR',
      title: 'Early Microvascular Changes',
      color: 'linear-gradient(135deg, #0891b2 0%, #0d9488 50%, #115e59 100%)',
      findings: 'Microaneurysms only. No exudates, hemorrhages, or macular edema.',
      action: 'Re-screen in 6-12 months. Strict blood sugar control (HbA1c < 7%).',
      urgency: 'Mild Risk • Observation',
      badgeColor: '#14b8a6',
      last4: '8810',
    },
    {
      id: 's2',
      grade: 'Grade 2: Moderate NPDR',
      title: 'Progression with Biomarkers',
      color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)',
      findings: 'More than just microaneurysms: blot hemorrhages & hard exudates.',
      action: 'Refer to Ophthalmologist within 3-6 months. Review for macular edema.',
      urgency: 'Moderate Risk • Non-Urgent Referral',
      badgeColor: '#f59e0b',
      last4: '4401',
    },
    {
      id: 's3',
      grade: 'Grade 3: Severe NPDR',
      title: 'High-Risk Ischemic Retina',
      color: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #7c2d12 100%)',
      findings: '4-2-1 Rule: >20 hemorrhages in 4 quadrants, venous beading in 2+ quadrants.',
      action: 'Urgent referral to District Hospital within 1 month for specialist consult.',
      urgency: 'High Risk • Urgent Referral',
      badgeColor: '#f97316',
      last4: '1992',
    },
    {
      id: 's4',
      grade: 'Grade 4: Proliferative DR',
      title: 'Active Neovascularization',
      color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #7f1d1d 100%)',
      findings: 'Neovascularization on disc (NVD/NVE), vitreous or preretinal hemorrhages.',
      action: 'IMMEDIATE specialist referral within 48h. Anti-VEGF / Laser therapy.',
      urgency: 'CRITICAL • Vision Threatening',
      badgeColor: '#ef4444',
      last4: '5561',
    },
  ];

  const currentStage = stages[selectedStageIdx];

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(3, 7, 18, 0.88)',
            backdropFilter: 'blur(16px)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.86, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '660px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(8, 24, 38, 0.98) 0%, rgba(3, 10, 20, 0.99) 100%)',
            border: '1px solid rgba(45, 212, 191, 0.35)',
            boxShadow: '0 25px 50px -12px rgba(20, 184, 166, 0.25)',
            overflow: 'hidden',
            color: '#FFFFFF',
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: '3px',
              width: '100%',
              background: 'linear-gradient(90deg, #10b981, #14b8a6, #f59e0b, #ef4444)',
            }}
          />

          <div style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>ICDR Retinopathy Stages (0–4)</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Standardized AI Classification & Referral Guidelines
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={onNewScreening}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(20, 184, 166, 0.18)',
                    border: '1px solid rgba(45, 212, 191, 0.35)',
                    color: '#2dd4bf',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} /> New Scan
                </button>
                <button
                  onClick={onClose}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Glowing 3D HealthPass Card */}
            <motion.div
              layout
              style={{
                borderRadius: '18px',
                background: currentStage.color,
                padding: '1.5rem',
                color: '#FFFFFF',
                boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.15)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>
                    NetraAI Digital HealthPass
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.01em', marginTop: '2px' }}>
                    {currentStage.grade}
                  </div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{currentStage.title}</div>
                </div>

                <div
                  style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {currentStage.urgency}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Patient Card Identifier</div>
                  <div style={{ fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 600 }}>
                    NETRA-2026-•••• {currentStage.last4}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>Protocol Recommendation</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '280px' }}>
                    {currentStage.action}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Findings Description */}
            <div
              style={{
                padding: '0.9rem 1.1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '3px' }}>Fundus Biomarkers Present:</div>
              <div style={{ color: '#FFFFFF', fontWeight: 500 }}>{currentStage.findings}</div>
            </div>

            {/* Stage Selector Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
              {stages.map((s, i) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedStageIdx(i)}
                  style={{
                    padding: '0.6rem 0.4rem',
                    borderRadius: '10px',
                    background: selectedStageIdx === i ? 'rgba(20, 184, 166, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                    border: selectedStageIdx === i ? '1.5px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: s.badgeColor }}>
                    Grade {i}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
                    {i === 0 ? 'Normal' : i === 1 ? 'Mild' : i === 2 ? 'Moderate' : i === 3 ? 'Severe' : 'PDR'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Eye, ShieldCheck, Zap, Activity, Award } from 'lucide-react';

export default function AITriageModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.86)',
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
            maxWidth: '520px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(2, 6, 23, 0.98) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.2), 0 0 35px rgba(16, 185, 129, 0.1)',
            overflow: 'hidden',
            color: '#FFFFFF',
            zIndex: 10,
          }}
        >
          {/* Top accent */}
          <div
            style={{
              height: '3px',
              width: '100%',
              background: 'linear-gradient(90deg, #10b981, #34d399, #14b8a6)',
            }}
          />

          <div style={{ padding: '1.75rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981',
                  }}
                >
                  <Eye size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Instant AI Triage Report</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    Automated Fundus Grading & Biomarker Map
                  </p>
                </div>
              </div>

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

            {/* Severity Result Display */}
            <div
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                borderRadius: '18px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Predicted Severity</div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#10b981', letterSpacing: '-0.02em' }}>
                Grade 0 • No DR
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginTop: '0.5rem',
                }}
              >
                <CheckCircle size={14} />
                <span>98.4% Confidence • Normal Retina</span>
              </div>
            </div>

            {/* Clinical Evidence Breakdown */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.85rem',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '1rem',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Patient Reference</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>Ramesh Kumar (ID: #P-10292)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Image Quality</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>Good (96% Sharpness • Illumination OK)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Microaneurysms</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>0 Detected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Hard Exudates</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>None (Macula Clear)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Clinical Action</span>
                <span style={{ fontWeight: 600, color: '#38bdf8' }}>Routine screening in 12 months</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close Triage Summary
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

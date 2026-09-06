import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2, Clock, MapPin, User, Send, PhoneCall } from 'lucide-react';
import { useState } from 'react';

export default function UrgentReferralModal({ isOpen, onClose }) {
  const [isDispatched, setIsDispatched] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleDispatch = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDispatched(true);
    }, 1000);
  };

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
            maxWidth: '540px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(20, 15, 30, 0.96) 0%, rgba(9, 8, 20, 0.98) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.25), 0 0 35px rgba(239, 68, 68, 0.1)',
            overflow: 'hidden',
            color: '#FFFFFF',
            zIndex: 10,
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              height: '3px',
              width: '100%',
              background: 'linear-gradient(90deg, #ef4444, #f97316, #e11d48)',
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
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ef4444',
                  }}
                >
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>High-Risk Tele-Referral</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    Urgent Ophthalmology Specialist Escalation
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
                background: isDispatched ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: isDispatched ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.25)',
                marginBottom: '1.25rem',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                {isDispatched ? 'Referral Transmitted' : 'AI Diagnostic Flag'}
              </div>
              <div
                style={{
                  fontSize: '1.95rem',
                  fontWeight: 800,
                  color: isDispatched ? '#10b981' : '#ef4444',
                  letterSpacing: '-0.02em',
                }}
              >
                {isDispatched ? 'Dispatched to Doctor' : 'Severe PDR • High Risk'}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: isDispatched ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: isDispatched ? '#10b981' : '#f87171',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginTop: '0.5rem',
                }}
              >
                {isDispatched ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                <span>{isDispatched ? 'CASE ASSIGNED • SMS CONFIRMED' : 'REFERRAL WINDOW: < 48 HOURS'}</span>
              </div>
            </div>

            {/* Clinical Evidence & Facility Ledger */}
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
                <span style={{ color: '#94a3b8' }}>Patient</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>Anita Sharma (47F, ID: #P-10294)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Biomarkers</span>
                <span style={{ fontWeight: 600, color: '#f87171' }}>Neovascularization & Vitreous Hemorrhage</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Assigned Specialist</span>
                <span style={{ fontWeight: 600, color: '#38bdf8' }}>Dr. Sunita Rao (Vitreo-Retina)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Referral Hospital</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>District Civil Hospital Eye Dept</span>
              </div>
            </div>

            {/* Action Buttons */}
            {!isDispatched ? (
              <button
                onClick={handleDispatch}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: isProcessing ? 'wait' : 'pointer',
                  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.35)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Send size={16} />
                <span>{isProcessing ? 'Dispatching Tele-Referral Package...' : 'Dispatch Tele-Referral & Alert Doctor'}</span>
              </button>
            ) : (
              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '14px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#10b981',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Referral Logged in System • Close
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

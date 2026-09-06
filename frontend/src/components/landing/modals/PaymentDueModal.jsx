import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Calendar, AlertCircle, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function PaymentDueModal({ isOpen, onClose }) {
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
    }, 1200);
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
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(5, 8, 16, 0.82)',
            backdropFilter: 'blur(16px)',
          }}
        />

        {/* Modal Dialog Card */}
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
            background: 'linear-gradient(135deg, rgba(16, 20, 38, 0.96) 0%, rgba(9, 12, 24, 0.98) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(56, 189, 248, 0.2), 0 0 35px rgba(99, 102, 241, 0.15)',
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
              background: 'linear-gradient(90deg, #38bdf8, #818cf8, #c084fc)',
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
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                  }}
                >
                  <ArrowUpRight size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Payment Due Notice</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    Scheduled Protocol & Infrastructure Settlement
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

            {/* Main Value Display */}
            <div
              style={{
                textAlign: 'center',
                padding: '1.5rem',
                borderRadius: '18px',
                background: isPaid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(56, 189, 248, 0.06)',
                border: isPaid ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(56, 189, 248, 0.2)',
                marginBottom: '1.25rem',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                {isPaid ? 'Payment Cleared' : 'Amount Outstanding'}
              </div>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: isPaid ? '#10b981' : '#38bdf8',
                  letterSpacing: '-0.02em',
                }}
              >
                {isPaid ? '$0.00' : '-$120.00'}
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: isPaid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: isPaid ? '#10b981' : '#fbbf24',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginTop: '0.5rem',
                }}
              >
                {isPaid ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                <span>{isPaid ? 'PAID IN FULL' : 'Due in 3 Days (Sep 8, 2026)'}</span>
              </div>
            </div>

            {/* Breakdown Ledger */}
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
                <span style={{ color: '#94a3b8' }}>Service Item</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>AI Serverless Node Cluster & Tele-Ophth Bandwidth</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Billing Period</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>Aug 01 - Aug 31, 2026</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Payment Method</span>
                <span style={{ fontWeight: 600, color: '#38bdf8' }}>Auto-debit from Assets Wallet (•••• 2629)</span>
              </div>
            </div>

            {/* Pay Button / Completed */}
            {!isPaid ? (
              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #0284c7, #0ea5e9)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: isProcessing ? 'wait' : 'pointer',
                  boxShadow: '0 4px 20px rgba(14, 165, 233, 0.35)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                {isProcessing ? 'Processing Transaction on Chain...' : 'Pay $120.00 Instantly'}
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
                Payment Successful • Close
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

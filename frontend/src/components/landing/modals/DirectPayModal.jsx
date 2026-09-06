import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, ArrowDownLeft, Copy, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { useState } from 'react';

export default function DirectPayModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyTx = () => {
    navigator.clipboard?.writeText('0x7f9a2b8e4c1d63e99021a8f902dc31405e6b7891');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        {/* Pop-up Card with Framer Motion Spring */}
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
            background: 'linear-gradient(135deg, rgba(14, 25, 45, 0.96) 0%, rgba(8, 14, 26, 0.98) 100%)',
            border: '1px solid rgba(0, 240, 210, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 240, 210, 0.2), 0 0 35px rgba(0, 240, 210, 0.1)',
            overflow: 'hidden',
            color: '#FFFFFF',
            zIndex: 10,
          }}
        >
          {/* Glowing Top Accent Line */}
          <div
            style={{
              height: '3px',
              width: '100%',
              background: 'linear-gradient(90deg, #00d1b2, #0df2e6, #38bdf8)',
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
                    background: 'rgba(0, 240, 210, 0.15)',
                    border: '1px solid rgba(0, 240, 210, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00f0b5',
                  }}
                >
                  <ArrowDownLeft size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Direct Pay Settlement</h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                    Instant Peer-to-Peer Transfer Verified
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
                background: 'rgba(0, 240, 210, 0.06)',
                border: '1px solid rgba(0, 240, 210, 0.2)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Amount Received</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00f0b5', letterSpacing: '-0.02em' }}>
                +$124.32
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  marginTop: '0.5rem',
                }}
              >
                <CheckCircle size={14} />
                <span>CONFIRMED • Block #18,940,211</span>
              </div>
            </div>

            {/* Transaction Details Ledger */}
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
                <span style={{ color: '#94a3b8' }}>From Sender</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>0x9b42...81c9 (Asha Rural Health Hub)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Destination</span>
                <span style={{ fontWeight: 600, color: '#FFFFFF' }}>Primary Assets Wallet (**** 2629)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Network Fee</span>
                <span style={{ fontWeight: 600, color: '#00f0b5' }}>$0.00 (Subsidized by Protocol)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Speed</span>
                <span style={{ fontWeight: 600, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Zap size={13} /> 0.8 seconds (Sub-second finality)
                </span>
              </div>
            </div>

            {/* Transaction Hash with Copy */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.9rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.78rem',
                marginBottom: '1.25rem',
              }}
            >
              <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>Tx: 0x7f9a2b8e...31405e6b7891</span>
              <button
                onClick={copyTx}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copied ? '#00f0b5' : '#38bdf8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                }}
              >
                <Copy size={13} />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
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
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.18)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
            >
              Close Receipt
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';

export default function AddCardModal({ isOpen, onClose }) {
  const [cardName, setCardName] = useState('');
  const [cardType, setCardType] = useState('virtual');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1050,
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
            backgroundColor: 'rgba(5, 8, 16, 0.85)',
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
            maxWidth: '480px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(16, 24, 46, 0.98) 0%, rgba(9, 13, 26, 0.99) 100%)',
            border: '1px solid rgba(0, 240, 210, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 240, 210, 0.2)',
            overflow: 'hidden',
            color: '#FFFFFF',
            zIndex: 10,
            padding: '1.75rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'rgba(0, 240, 210, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00f0b5',
                }}
              >
                <Plus size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>Issue New Virtual Card</h3>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '30px',
                height: '30px',
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
              <X size={15} />
            </button>
          </div>

          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  color: '#10b981',
                }}
              >
                <Check size={28} />
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>Card Activated!</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                New digital asset card ready for instantaneous settlement.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Cardholder / Department Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PHC Primary Screening Unit"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Card Category
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { id: 'virtual', label: 'Quantum Virtual' },
                    { id: 'health', label: 'Health Screening Pass' },
                  ].map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setCardType(t.id)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: cardType === t.id ? '1px solid #00f0b5' : '1px solid rgba(255, 255, 255, 0.08)',
                        background: cardType === t.id ? 'rgba(0, 240, 210, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                        color: cardType === t.id ? '#00f0b5' : '#cbd5e1',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        textAlign: 'center',
                      }}
                    >
                      {t.label}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #00f0b5, #00b4d8)',
                  border: 'none',
                  color: '#050c18',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 240, 210, 0.3)',
                }}
              >
                Generate & Link Card
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

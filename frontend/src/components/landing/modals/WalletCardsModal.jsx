import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Unlock, Eye, EyeOff, Plus, Wifi, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function WalletCardsModal({ isOpen, onClose, onAddCard }) {
  const [selectedCardIdx, setSelectedCardIdx] = useState(0);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen) return null;

  const cards = [
    {
      id: 'c1',
      name: 'Zensman Quantum Platinum',
      last4: '2629',
      exp: '09/29',
      cvv: '884',
      balance: '$5,237.34',
      type: 'Primary Digital',
      color: 'linear-gradient(135deg, #00f0b5 0%, #0077b6 50%, #1e1b4b 100%)',
    },
    {
      id: 'c2',
      name: 'NetraAI Tele-Med HealthPass',
      last4: '8810',
      exp: '12/28',
      cvv: '419',
      balance: '$1,850.00',
      type: 'Clinical Subsidy',
      color: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #4338ca 100%)',
    },
    {
      id: 'c3',
      name: 'DeFi High-Yield Vault Card',
      last4: '4401',
      exp: '03/30',
      cvv: '127',
      balance: '$12,400.80',
      type: 'Staking Stash',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #312e81 100%)',
    },
    {
      id: 'c4',
      name: 'Rural PHC Screening Grant',
      last4: '1992',
      exp: '11/27',
      cvv: '652',
      balance: '$750.25',
      type: 'Government Health Mission',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #064e3b 100%)',
    },
    {
      id: 'c5',
      name: 'Direct Micro-Settlement Card',
      last4: '7723',
      exp: '08/29',
      cvv: '390',
      balance: '$420.50',
      type: 'Instant Mesh',
      color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #78350f 100%)',
    },
    {
      id: 'c6',
      name: 'Global Tele-Ophthalmology Card',
      last4: '5561',
      exp: '04/31',
      cvv: '903',
      balance: '$3,110.00',
      type: 'Specialist Escrow',
      color: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #2e1065 100%)',
    },
  ];

  const currentCard = cards[selectedCardIdx];

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
            maxWidth: '640px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(16, 24, 46, 0.96) 0%, rgba(9, 13, 26, 0.98) 100%)',
            border: '1px solid rgba(0, 240, 210, 0.25)',
            boxShadow: '0 25px 50px -12px rgba(0, 240, 210, 0.2)',
            overflow: 'hidden',
            color: '#FFFFFF',
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: '3px',
              width: '100%',
              background: 'linear-gradient(90deg, #00f0b5, #00b4d8, #6366f1)',
            }}
          />

          <div style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Active Assets & Digital Cards (6)</h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Manage multi-currency cards & screening grant credits
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={onAddCard}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(0, 240, 210, 0.15)',
                    border: '1px solid rgba(0, 240, 210, 0.3)',
                    color: '#00f0b5',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Plus size={14} /> Add Card
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

            {/* Glowing 3D Card Display */}
            <motion.div
              layout
              style={{
                borderRadius: '18px',
                background: currentCard.color,
                padding: '1.5rem',
                color: '#FFFFFF',
                boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.15)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Glass sheen overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 60%)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.85 }}>
                    {currentCard.type}
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
                    {currentCard.name}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wifi size={18} opacity={0.8} />
                  <div
                    style={{
                      width: '32px',
                      height: '24px',
                      borderRadius: '4px',
                      background: 'linear-gradient(135deg, #fcd34d, #d97706)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '2px' }}>Card Number</div>
                  <div style={{ fontSize: '1.25rem', fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.12em' }}>
                    {showDetails ? `4920 8190 2314 ${currentCard.last4}` : `•••• •••• •••• ${currentCard.last4}`}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Exp / CVV</div>
                  <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', fontWeight: 600 }}>
                    {currentCard.exp} {showDetails ? `• ${currentCard.cvv}` : '• ***'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card Controls Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#cbd5e1',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {showDetails ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{showDetails ? 'Hide Numbers' : 'Reveal Numbers'}</span>
                </button>

                <button
                  onClick={() => setIsFrozen(!isFrozen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: isFrozen ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: isFrozen ? '#ef4444' : '#cbd5e1',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  {isFrozen ? <Unlock size={14} /> : <Lock size={14} />}
                  <span>{isFrozen ? 'Card Frozen' : 'Freeze Card'}</span>
                </button>
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#00f0b5' }}>
                Balance: {currentCard.balance}
              </div>
            </div>

            {/* Card selector thumbnails */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {cards.map((c, i) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCardIdx(i)}
                  style={{
                    flex: '0 0 auto',
                    width: '74px',
                    height: '46px',
                    borderRadius: '8px',
                    background: c.color,
                    cursor: 'pointer',
                    border: selectedCardIdx === i ? '2px solid #00f0b5' : '1px solid rgba(255,255,255,0.2)',
                    boxShadow: selectedCardIdx === i ? '0 0 10px rgba(0, 240, 210, 0.5)' : 'none',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '4px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                  }}
                >
                  ••{c.last4}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

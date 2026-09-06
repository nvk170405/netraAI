import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Stethoscope, UserCheck, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StartTrialModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('sandbox');
  const navigate = useNavigate();

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
        {/* Backdrop blur with Framer Motion fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(5, 8, 16, 0.82)',
            backdropFilter: 'blur(16px)',
          }}
        />

        {/* Modal Dialog Card with Spring pop-up physics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '680px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(16, 26, 46, 0.94) 0%, rgba(9, 14, 28, 0.98) 100%)',
            border: '1px solid rgba(0, 240, 210, 0.25)',
            boxShadow: '0 25px 60px -15px rgba(0, 240, 210, 0.15), 0 0 40px rgba(0, 160, 255, 0.1)',
            overflow: 'hidden',
            color: '#FFFFFF',
            zIndex: 10,
          }}
        >
          {/* Glowing gradient header accent */}
          <div
            style={{
              height: '3px',
              width: '100%',
              background: 'linear-gradient(90deg, #00f0b5, #00b4d8, #1d4ed8)',
            }}
          />

          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.5rem 1.75rem 1rem 1.75rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(0, 240, 210, 0.2), rgba(0, 140, 255, 0.2))',
                  border: '1px solid rgba(0, 240, 210, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00f0b5',
                }}
              >
                <Sparkles size={18} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Start Free Trial & Live Demo
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Next-Era Digital Transfer & NetraAI Clinical Platform
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
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)')}
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              padding: '1rem 1.75rem 0.5rem 1.75rem',
            }}
          >
            {[
              { id: 'sandbox', label: '⚡ Instant Sandbox' },
              { id: 'clinical', label: '🩺 Clinical Portals' },
              { id: 'security', label: '🛡️ Security Specs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeTab === tab.id ? '1px solid #00f0b5' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: activeTab === tab.id ? 'rgba(0, 240, 210, 0.12)' : 'transparent',
                  color: activeTab === tab.id ? '#00f0b5' : '#94a3b8',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Body */}
          <div style={{ padding: '1.25rem 1.75rem 1.75rem 1.75rem' }}>
            {activeTab === 'sandbox' && (
              <div>
                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Demo Environment Wallet</span>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(0, 240, 210, 0.15)', color: '#00f0b5' }}>
                      Ready • Gasless
                    </span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                    $5,237.34 <span style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 500 }}>+42.5%</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    Connected Network: Zensman Mesh v4.8 & Tele-Med Gateway
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>Direct Pay Channel</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00f0b5' }}>+$124.32</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Instant 0.8s settlement</div>
                  </div>
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>AI Screening Engine</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>98.4% Confidence</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Grad-CAM heatmaps ready</div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '14px',
                    background: '#FFFFFF',
                    color: '#000000',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(255, 255, 255, 0.25)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 255, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.25)';
                  }}
                >
                  <span>Launch Interactive Experience</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {activeTab === 'clinical' && (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
                  Explore the NetraAI diabetic retinopathy screening and tele-ophthalmology workspaces:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    {
                      role: 'Health Worker',
                      desc: 'Capture fundus image, assess quality, run AI & generate local report',
                      route: '/login',
                      icon: <Stethoscope size={18} color="#00f0b5" />,
                    },
                    {
                      role: 'Doctor / Specialist',
                      desc: 'Review high-risk triage, analyze Grad-CAM heatmaps & confirm diagnosis',
                      route: '/login',
                      icon: <UserCheck size={18} color="#38bdf8" />,
                    },
                    {
                      role: 'Admin / Health Officer',
                      desc: 'Epidemiological stats, screening volume by village & clinical accuracy',
                      route: '/login',
                      icon: <BarChart3 size={18} color="#a78bfa" />,
                    },
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate(p.route)}
                      style={{
                        padding: '1rem',
                        borderRadius: '14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 240, 210, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(0, 240, 210, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {p.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#FFFFFF' }}>{p.role}</div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{p.desc}</div>
                        </div>
                      </div>
                      <ArrowRight size={16} color="#64748b" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {[
                    'End-to-end 256-bit AES cryptographic encryption for all retinal health data',
                    'Smart contract-driven audit trail with immutable screening timestamps',
                    'Zero-knowledge proof biometric verification for patient identity preservation',
                    'Offline-first synchronization protocol for remote rural PHCs with no network',
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '0.85rem',
                        color: '#cbd5e1',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <CheckCircle2 size={16} color="#00f0b5" style={{ flexShrink: 0 }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#64748b',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={14} color="#00f0b5" />
                  <span>Compliant with ISO/IEC 27001, HIPAA & ABDM Healthcare Standards</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

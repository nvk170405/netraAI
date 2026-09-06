import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Stethoscope, UserCheck, BarChart3, Eye, FileText } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ScreeningWorkflowModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('demo');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const demoCases = [
    {
      id: 'P-10291',
      name: 'Sunita Devi',
      age: 62,
      gender: 'F',
      village: 'Kalyanpur PHC',
      grade: 'Grade 2 • Moderate NPDR',
      confidence: '91.4%',
      risk: 'Moderate Risk',
      color: '#f59e0b',
      referral: 'Refer to Ophthalmologist within 3 months',
    },
    {
      id: 'P-10292',
      name: 'Ramesh Kumar',
      age: 58,
      gender: 'M',
      village: 'Rampur Sub-Centre',
      grade: 'Grade 0 • No DR (Normal)',
      confidence: '97.8%',
      risk: 'Low Risk',
      color: '#10b981',
      referral: 'Routine annual screening in 12 months',
    },
    {
      id: 'P-10293',
      name: 'Mohammed Rafi',
      age: 51,
      gender: 'M',
      village: 'Shivpur PHC',
      grade: 'Grade 3 • Severe NPDR',
      confidence: '89.6%',
      risk: 'High Risk',
      color: '#f97316',
      referral: 'Refer to District Hospital within 1 month',
    },
    {
      id: 'P-10294',
      name: 'Anita Sharma',
      age: 47,
      gender: 'F',
      village: 'Chandpur Health Post',
      grade: 'Grade 4 • Proliferative DR',
      confidence: '94.2%',
      risk: 'Urgent High Risk',
      color: '#ef4444',
      referral: 'URGENT: Tele-ophthalmology consult < 48h',
    },
  ];

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
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(3, 7, 18, 0.88)',
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
            maxWidth: '700px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(8, 24, 38, 0.98) 0%, rgba(3, 10, 20, 0.99) 100%)',
            border: '1px solid rgba(45, 212, 191, 0.35)',
            boxShadow: '0 25px 60px -15px rgba(20, 184, 166, 0.25), 0 0 40px rgba(6, 182, 212, 0.15)',
            overflow: 'hidden',
            color: '#FFFFFF',
            zIndex: 10,
          }}
        >
          {/* Hospital-themed bluish-green glowing header accent */}
          <div
            style={{
              height: '3px',
              width: '100%',
              background: 'linear-gradient(90deg, #10b981, #14b8a6, #06b6d4, #3b82f6)',
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
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: 'rgba(20, 184, 166, 0.18)',
                  border: '1px solid rgba(45, 212, 191, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2dd4bf',
                }}
              >
                <Eye size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                  NetraAI Patient Screening Suite
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  AI-Assisted Diabetic Retinopathy Screening for Rural India
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
              { id: 'demo', label: '🔬 Interactive Clinical Cases' },
              { id: 'portals', label: '🏥 Role Workspaces' },
              { id: 'standards', label: '📋 Clinical Protocol' },
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
                  border: activeTab === tab.id ? '1px solid #2dd4bf' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: activeTab === tab.id ? 'rgba(20, 184, 166, 0.18)' : 'transparent',
                  color: activeTab === tab.id ? '#5eead4' : '#94a3b8',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Body */}
          <div style={{ padding: '1.25rem 1.75rem 1.75rem 1.75rem' }}>
            {activeTab === 'demo' && (
              <div>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 1rem 0' }}>
                  Select a simulated rural screening case to inspect AI grading, Grad-CAM heatmap overlay, and referral advice:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {demoCases.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onClose();
                        navigate('/login');
                      }}
                      style={{
                        padding: '0.9rem',
                        borderRadius: '14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(20, 184, 166, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF' }}>{c.name}</span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{c.age}y • {c.gender}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: c.color, marginBottom: '2px' }}>
                        {c.grade} ({c.confidence})
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{c.village}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    onClose();
                    navigate('/login');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0d9488, #0891b2)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(20, 184, 166, 0.35)',
                    transition: 'all 0.2s',
                  }}
                >
                  <span>Start New Patient Screening</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {activeTab === 'portals' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  {
                    role: 'Health Worker / ASHA Worker',
                    desc: 'Patient registration, retinal capture, quality assessment, instant AI inference & bilingual patient handout',
                    route: '/login',
                    icon: <Stethoscope size={18} color="#2dd4bf" />,
                  },
                  {
                    role: 'Doctor / Vitreo-Retinal Specialist',
                    desc: 'Tele-consult triage, detailed Grad-CAM visual heatmaps, clinical verification & laser/injection referral',
                    route: '/login',
                    icon: <UserCheck size={18} color="#06b6d4" />,
                  },
                  {
                    role: 'Chief Medical Officer / Admin',
                    desc: 'Epidemiological DR prevalence charts, village-wise screening metrics & clinical AI accuracy audits',
                    route: '/login',
                    icon: <BarChart3 size={18} color="#38bdf8" />,
                  },
                ].map((p, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      onClose();
                      navigate(p.route);
                    }}
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
                      e.currentTarget.style.backgroundColor = 'rgba(20, 184, 166, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.35)';
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
            )}

            {activeTab === 'standards' && (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {[
                    'Adheres to International Clinical Diabetic Retinopathy (ICDR) 5-stage grading system',
                    'Explainable AI via Grad-CAM highlighting Microaneurysms, Hemorrhages & Hard Exudates',
                    'Offline-first IndexedDB storage ensuring screening continues during rural network outages',
                    'Decision-support tool designed to assist health workers — not replace certified ophthalmologists',
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
                      <CheckCircle2 size={16} color="#2dd4bf" style={{ flexShrink: 0 }} />
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
                  <ShieldCheck size={14} color="#2dd4bf" />
                  <span>Problem Statement 26038 • Smart India Hackathon 2026</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

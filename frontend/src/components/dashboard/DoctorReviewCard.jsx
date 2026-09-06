import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Video, PhoneCall, CheckCircle, Clock, ShieldCheck, Activity, Send } from 'lucide-react';

const TELE_SPECIALISTS = [
  {
    id: 'doc-1',
    name: 'Dr. Sunita Rao',
    qualification: 'MS, DNB (Retina & Vitreous)',
    hospital: 'AIIMS Bhopal • Tele-Ophthal Lead',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    queueTime: '< 12 mins SLA',
    activeCases: 2,
    rating: '4.9 ★',
    verified: true,
    waveform: [20, 35, 25, 60, 45, 80, 50, 65, 30, 75, 40, 20]
  },
  {
    id: 'doc-2',
    name: 'Dr. Amit Deshmukh',
    qualification: 'FRCS, Vitreo-Retinal Consultant',
    hospital: 'Indore Eye Care Regional Centre',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    status: 'reviewing',
    queueTime: '< 25 mins SLA',
    activeCases: 4,
    rating: '4.8 ★',
    verified: true,
    waveform: [15, 28, 45, 30, 70, 55, 40, 60, 75, 50, 35, 18]
  }
];

export default function DoctorReviewCard({ onConsultDoctor }) {
  const [selectedDoctor, setSelectedDoctor] = useState(TELE_SPECIALISTS[0].id);
  const [consultModal, setConsultModal] = useState(null);

  const handleStartConsult = (doctor) => {
    setConsultModal(doctor);
    if (onConsultDoctor) onConsultDoctor(doctor);
  };

  return (
    <div
      style={{
        background: 'rgba(8, 20, 34, 0.75)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(20, 184, 166, 0.2)',
        padding: '20px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(20, 184, 166, 0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle ambient cyan glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.25), rgba(6, 182, 212, 0.15))',
              border: '1px solid rgba(45, 212, 191, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2dd4bf'
            }}
          >
            <Stethoscope size={16} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.01em' }}>
              Tele-Retina Network
            </h4>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
              On-Call Specialists • AI Triaged SLA
            </p>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '100px',
            background: 'rgba(20, 184, 166, 0.12)',
            border: '1px solid rgba(45, 212, 191, 0.25)',
            fontSize: '0.68rem',
            fontWeight: 600,
            color: '#2dd4bf'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }}
          />
          Live Telemedicine
        </div>
      </div>

      {/* Specialist Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {TELE_SPECIALISTS.map((doc) => {
          const isSelected = selectedDoctor === doc.id;
          return (
            <motion.div
              key={doc.id}
              onClick={() => setSelectedDoctor(doc.id)}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                borderRadius: '16px',
                padding: '14px',
                background: isSelected ? 'rgba(15, 30, 48, 0.85)' : 'rgba(10, 22, 36, 0.45)',
                border: isSelected
                  ? '1px solid rgba(45, 212, 191, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.06)',
                boxShadow: isSelected ? '0 4px 20px rgba(20, 184, 166, 0.15)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {/* Doctor Avatar with status ring */}
                <div style={{ position: 'relative' }}>
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      objectFit: 'cover',
                      border: '1.5px solid rgba(45, 212, 191, 0.4)'
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: doc.status === 'online' ? '#10b981' : '#f59e0b',
                      border: '2px solid #081422',
                      boxShadow: doc.status === 'online' ? '0 0 6px #10b981' : 'none'
                    }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f1f5f9' }}>
                      {doc.name}
                    </span>
                    {doc.verified && (
                      <ShieldCheck size={14} style={{ color: '#2dd4bf', flexShrink: 0 }} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#67e8f9', marginTop: '2px' }}>
                    {doc.qualification}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '1px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {doc.hospital}
                  </div>

                  {/* Micro telemetry waveform */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '16px' }}>
                      {doc.waveform.map((val, idx) => (
                        <div
                          key={idx}
                          style={{
                            width: '2.5px',
                            height: `${val * 0.16}px`,
                            borderRadius: '1px',
                            backgroundColor: isSelected ? '#2dd4bf' : '#475569',
                            opacity: 0.85
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} color="#67e8f9" /> {doc.queueTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons if selected */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(45, 212, 191, 0.15)'
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartConsult(doc);
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #0d9488, #0891b2)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(13, 148, 136, 0.35)'
                    }}
                  >
                    <Video size={13} />
                    Consult Now
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Escalation request queued for ${doc.name}. The specialist has been paged.`);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Send size={12} />
                    Escalate
                  </button>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Consult Confirmation Modal */}
      <AnimatePresence>
        {consultModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setConsultModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '420px',
                background: '#0a192f',
                border: '1px solid rgba(45, 212, 191, 0.4)',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(20, 184, 166, 0.2)',
                color: '#f8fafc',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '20px',
                  background: 'rgba(20, 184, 166, 0.2)',
                  border: '1px solid rgba(45, 212, 191, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: '#2dd4bf'
                }}
              >
                <Video size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 6px' }}>
                Initiating Tele-Consult
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '0 0 20px', lineHeight: 1.5 }}>
                Connecting encrypted fundus telemetry session with <strong style={{ color: '#2dd4bf' }}>{consultModal.name}</strong> ({consultModal.qualification}).
              </p>

              <div
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '20px',
                  fontSize: '0.78rem',
                  color: '#cbd5e1',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Patient Context:</span>
                  <span style={{ fontWeight: 600, color: '#f1f5f9' }}>Sunita Devi (P-10291)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>AI Triage Finding:</span>
                  <span style={{ fontWeight: 600, color: '#f59e0b' }}>Moderate DR • High DME Risk</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Network Latency:</span>
                  <span style={{ fontWeight: 600, color: '#10b981' }}>28ms (4G Rural Mesh)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setConsultModal(null)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94a3b8',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`Connected! Video stream launched with ${consultModal.name}.`);
                    setConsultModal(null);
                  }}
                  style={{
                    flex: 2,
                    padding: '10px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)'
                  }}
                >
                  Join Call Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

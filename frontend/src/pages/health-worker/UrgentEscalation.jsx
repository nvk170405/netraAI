import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Rocket,
  AlertTriangle,
  Clock,
  MapPin,
  Ambulance,
  PhoneCall,
  Send,
  CheckCircle2,
  FileText,
  QrCode,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Stethoscope
} from 'lucide-react';

const HOSPITALS = [
  {
    id: 'hosp-1',
    name: 'AIIMS Bhopal — Advanced Vitreoretinal Center',
    distance: '142 km (Approx 2h 40m)',
    bedsAvailable: 4,
    laserAvailable: true,
    antiVEGF: true,
    helpline: '+91 755 267 8200',
    contactPerson: 'Dr. Sunita Rao (On-Call Lead)'
  },
  {
    id: 'hosp-2',
    name: 'Indore Regional Eye Care & Laser Institute',
    distance: '86 km (Approx 1h 35m)',
    bedsAvailable: 6,
    laserAvailable: true,
    antiVEGF: true,
    helpline: '+91 731 420 5500',
    contactPerson: 'Dr. Amit Deshmukh (Duty Consultant)'
  },
  {
    id: 'hosp-3',
    name: 'Ujjain District Civil Hospital (Stabilization Unit)',
    distance: '48 km (Approx 55m)',
    bedsAvailable: 2,
    laserAvailable: false,
    antiVEGF: true,
    helpline: '+91 734 251 1100',
    contactPerson: 'Emergency Eye Officer'
  }
];

export default function UrgentEscalation() {
  const navigate = useNavigate();

  const [selectedHospital, setSelectedHospital] = useState(HOSPITALS[1]); // Default to Indore
  const [patientId, setPatientId] = useState('P-10293');
  const [patientName, setPatientName] = useState('Arjun Singh');
  const [village, setVillage] = useState('Dewas');
  const [diagnosis, setDiagnosis] = useState('Grade 4 PDR with Neovascularization of Disc');
  const [transportRequested, setTransportRequested] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [dispatchConfirmed, setDispatchConfirmed] = useState(false);

  // Simulated 48-Hour SLA countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 41, minutes: 24, seconds: 50 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDispatchReferral = () => {
    setDispatchConfirmed(true);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#030712',
        color: '#f8fafc',
        padding: '24px 32px 64px',
        position: 'relative'
      }}
    >
      {/* Red ambient warning glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '25%',
          width: '500px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.12) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  background: 'rgba(239, 68, 68, 0.18)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: '#f87171',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}
              >
                <ShieldAlert size={13} />
                Critical Vision Salvage Protocol
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
              <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>
                48-Hour Tertiary Laser / Anti-VEGF Window
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Urgent PDR Escalation Station
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: '#94a3b8' }}>
              Fast-track tertiary referral dispatch for Proliferative Diabetic Retinopathy and center-involving macular edema.
            </p>
          </div>

          {/* 48-Hour Live Countdown Timer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              borderRadius: '20px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.25)'
            }}
          >
            <Clock size={22} color="#f87171" />
            <div>
              <div style={{ fontSize: '0.68rem', color: '#fca5a5', fontWeight: 700, textTransform: 'uppercase' }}>
                Intervention SLA Remaining
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.05em' }}>
                {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Banner */}
        <AnimatePresence>
          {dispatchConfirmed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                marginBottom: '24px',
                padding: '16px 24px',
                borderRadius: '16px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 600
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} />
                <span>
                  Emergency Referral Packet Dispatched to <strong>{selectedHospital.name}</strong>! Tertiary bed reserved & QR slip sent via WhatsApp to patient.
                </span>
              </div>
              <button
                onClick={() => setDispatchConfirmed(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6ee7b7',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid: Patient Context & Hospital Routing */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Left Column: Hospital Destination Selection */}
          <div
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                  Select Tertiary Eye Destination
                </h3>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8' }}>
                  Hospitals equipped with Panretinal Photocoagulation (PRP) Laser and Vitreoretinal Surgeons
                </p>
              </div>
              <MapPin size={18} color="#2dd4bf" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {HOSPITALS.map((hosp) => {
                const isSelected = selectedHospital.id === hosp.id;
                return (
                  <motion.div
                    key={hosp.id}
                    onClick={() => setSelectedHospital(hosp)}
                    whileHover={{ y: -2 }}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      background: isSelected ? 'rgba(239, 68, 68, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                      border: isSelected ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected ? '0 0 20px rgba(239, 68, 68, 0.2)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>
                          {hosp.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#67e8f9', marginTop: '3px' }}>
                          📍 {hosp.distance}
                        </div>
                      </div>

                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '100px',
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#34d399',
                          fontSize: '0.72rem',
                          fontWeight: 700
                        }}
                      >
                        {hosp.bedsAvailable} Beds Ready
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', fontSize: '0.72rem', color: '#94a3b8' }}>
                      <span>Laser: <strong style={{ color: hosp.laserAvailable ? '#34d399' : '#f87171' }}>{hosp.laserAvailable ? '✓ Ready' : '✗ N/A'}</strong></span>
                      <span>•</span>
                      <span>Anti-VEGF: <strong style={{ color: '#34d399' }}>✓ Stocked</strong></span>
                      <span>•</span>
                      <span>Lead: <strong style={{ color: '#f1f5f9' }}>{hosp.contactPerson}</strong></span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Transport Request */}
            <div
              style={{
                marginTop: '20px',
                padding: '16px',
                borderRadius: '16px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(20, 184, 166, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2dd4bf'
                  }}
                >
                  <Ambulance size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#ffffff' }}>
                    108 Emergency Rural Medical Transport
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Book state medical vehicle for high-risk patient transit to {selectedHospital.name.split('—')[0]}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setTransportRequested(!transportRequested);
                  if (!transportRequested) alert('108 Rural Ambulance unit dispatched to Dewas PHC camp.');
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  background: transportRequested ? 'rgba(16, 185, 129, 0.2)' : 'rgba(20, 184, 166, 0.2)',
                  border: transportRequested ? '1px solid #10b981' : '1px solid #2dd4bf',
                  color: transportRequested ? '#34d399' : '#2dd4bf',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {transportRequested ? '✓ Vehicle Dispatched' : 'Request Ambulance'}
              </button>
            </div>
          </div>

          {/* Right Column: Emergency Patient Slip & Quick Dispatch */}
          <div
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                  Emergency Referral Packet
                </h3>
                <QrCode size={20} color="#2dd4bf" />
              </div>

              {/* Patient Card */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '16px',
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Patient:</span>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>{patientName} ({patientId})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Origin Camp:</span>
                  <span style={{ fontWeight: 600, color: '#cbd5e1' }}>{village} Mobile Health Camp</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>AI Triage Finding:</span>
                  <span style={{ fontWeight: 700, color: '#ef4444' }}>Grade 4 PDR (89% Confidence)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Destination Center:</span>
                  <span style={{ fontWeight: 600, color: '#38bdf8' }}>{selectedHospital.name.split('—')[0]}</span>
                </div>
              </div>

              {/* Pre-Surgical Fast-Track Checklist */}
              <h4 style={{ margin: '0 0 10px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>
                Pre-Surgical Stabilization Checklist
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px', fontSize: '0.76rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#cbd5e1' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Random Blood Glucose recorded (&lt; 250 mg/dL target)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#cbd5e1' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Blood Pressure stabilized (&lt; 150/90 mmHg)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#cbd5e1' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Pupil dilation time and drops recorded on referral slip</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#cbd5e1' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Family informed of laser photocoagulation emergency procedure</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => {
                  setSmsSent(true);
                  alert('WhatsApp & SMS Referral Slip sent in Hindi & English to patient and emergency contact.');
                }}
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  background: smsSent ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  border: smsSent ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: smsSent ? '#34d399' : '#cbd5e1',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Send size={14} />
                {smsSent ? '✓ Bilingual SMS Slip Sent' : 'Send WhatsApp / SMS Slip to Patient'}
              </button>

              <button
                onClick={handleDispatchReferral}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)'
                }}
              >
                <Rocket size={16} />
                Confirm Urgent Referral Dispatch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

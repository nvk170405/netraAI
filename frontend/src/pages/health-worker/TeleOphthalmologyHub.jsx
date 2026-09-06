import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DOCTOR_CASES } from '../../data/mockData';
import { doctorApi, telehealthApi } from '../../services/api';
import {
  Stethoscope,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  ShieldCheck,
  Clock,
  Send,
  AlertTriangle,
  UserCheck,
  Activity,
  Maximize2,
  FileCheck,
  Share2,
  Layers,
  ChevronRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const SPECIALISTS = [
  {
    id: 'spec-1',
    name: 'Dr. Sunita Rao',
    qualification: 'MS, DNB (Retina & Vitreous)',
    hospital: 'AIIMS Bhopal • Tele-Ophthal Lead',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    queueTime: '< 12 mins SLA',
    activeCases: 2,
    rating: '4.9 ★',
    specialty: 'Proliferative DR & Laser Photocoagulation',
    phone: '+91 755 267 8000'
  },
  {
    id: 'spec-2',
    name: 'Dr. Amit Deshmukh',
    qualification: 'FRCS, Vitreo-Retinal Consultant',
    hospital: 'Indore Eye Care Regional Centre',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    queueTime: '< 18 mins SLA',
    activeCases: 4,
    rating: '4.8 ★',
    specialty: 'Diabetic Macular Edema & Anti-VEGF Injections',
    phone: '+91 731 420 5000'
  },
  {
    id: 'spec-3',
    name: 'Dr. Rajesh Verma',
    qualification: 'MD (Ophthalmology), Retina Fellow',
    hospital: 'Government Medical College, Sagar',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    status: 'reviewing',
    queueTime: '< 28 mins SLA',
    activeCases: 3,
    rating: '4.7 ★',
    specialty: 'Rural Mobile Tele-Screening Review',
    phone: '+91 7582 230 100'
  }
];

export default function TeleOphthalmologyHub() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedDoctor, setSelectedDoctor] = useState(SPECIALISTS[0]);
  const [inCall, setInCall] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [consultNotes, setConsultNotes] = useState('');
  const [consultSuccess, setConsultSuccess] = useState(false);
  const [cases, setCases] = useState(DOCTOR_CASES);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const live = await doctorApi.getCases();
        if (live && live.length > 0) setCases(live);
      } catch (e) {
        console.warn('Could not load telehealth cases:', e);
      }
    };
    fetchCases();
  }, []);

  const pendingQueue = cases.filter((c) => c.status === 'pending');

  const handleStartCall = (doc) => {
    setSelectedDoctor(doc);
    setInCall(true);
    setConsultSuccess(false);
  };

  const handleEndCall = async () => {
    setInCall(false);
    setConsultSuccess(true);
    try {
      await telehealthApi.createSession({
        doctor_id: selectedDoctor?.id || 'spec-1',
        patient_id: selectedCase?.patientId || 'P-10291',
        notes: consultNotes || 'Live second opinion completed.',
      });
    } catch (e) {
      console.warn('Session recording fallback:', e);
    }
    setTimeout(() => setConsultSuccess(false), 5000);
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
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: '15%',
          width: '450px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(20, 184, 166, 0.12) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  background: 'rgba(20, 184, 166, 0.15)',
                  border: '1px solid rgba(45, 212, 191, 0.3)',
                  color: '#2dd4bf',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}
              >
                <Stethoscope size={13} />
                Telemedicine Command Station
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
              <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                Encrypted Rural WebRTC Mesh
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
              Tele-Ophthalmology Hub & Specialist Review
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: '#94a3b8' }}>
              Connect rural health workers directly with tertiary vitreoretinal specialists for rapid second opinions and referral authorisations.
            </p>
          </div>

          {/* Quick SLA Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 20px',
              borderRadius: '20px',
              background: 'rgba(8, 20, 34, 0.8)',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Average Tele-SLA</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2dd4bf' }}>&lt; 14.8 Mins</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.1)' }} />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Active On-Call</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>3 Specialists</div>
            </div>
          </div>
        </div>

        {/* Success Alert if Consult finished */}
        <AnimatePresence>
          {consultSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                marginBottom: '20px',
                padding: '14px 20px',
                borderRadius: '16px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.86rem',
                fontWeight: 600
              }}
            >
              <CheckCircle2 size={20} />
              <span>Tele-Consultation successfully logged! Specialist assessment stamped with digital verification hash.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* INTERACTIVE VIDEO CONSULTATION STUDIO (WebRTC Simulation)    */}
        {/* ============================================================ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: inCall ? '1fr 340px' : '1.4fr 1fr',
            gap: '24px',
            marginBottom: '32px'
          }}
        >
          {/* Main Stage Viewport */}
          <div
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Viewport Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: inCall ? 'rgba(16, 185, 129, 0.2)' : 'rgba(20, 184, 166, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: inCall ? '#10b981' : '#2dd4bf'
                  }}
                >
                  <Video size={16} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                    {inCall ? `Active Tele-Session: ${selectedDoctor.name}` : 'Telemedicine Review Studio'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>
                    {inCall ? '4K Retinal Stream Sharing • Zero Latency Audio Mesh' : 'Select an on-call specialist below or start immediate triage'}
                  </p>
                </div>
              </div>

              {inCall && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: '100px',
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#f87171',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
                    REC • 08:42
                  </span>
                </div>
              )}
            </div>

            {/* Viewport Screen */}
            <div
              style={{
                flex: 1,
                minHeight: '380px',
                borderRadius: '18px',
                background: '#040d18',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative',
                display: 'flex',
                overflow: 'hidden'
              }}
            >
              {/* Shared Retinal Fundus View with Doctor Annotation overlays */}
              <div
                style={{
                  flex: 1,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'radial-gradient(circle at center, #13273e 0%, #040c16 80%)'
                }}
              >
                {/* Retinal Fundus Graphic */}
                <div
                  style={{
                    width: '280px',
                    height: '280px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 45% 45%, #92400e 0%, #451a03 70%, #1e0902 100%)',
                    boxShadow: '0 0 50px rgba(146, 64, 14, 0.4), inset 0 0 30px rgba(0,0,0,0.8)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Blood vessels */}
                  <svg width="100%" height="100%" viewBox="0 0 280 280" style={{ position: 'absolute', inset: 0 }}>
                    <path d="M 140 140 Q 180 80 220 50 Q 240 30 260 20" stroke="#b91c1c" strokeWidth="3" fill="none" opacity="0.8" />
                    <path d="M 140 140 Q 90 80 50 50 Q 30 30 10 20" stroke="#991b1b" strokeWidth="2.5" fill="none" opacity="0.8" />
                    <path d="M 140 140 Q 180 200 230 240" stroke="#7f1d1d" strokeWidth="2" fill="none" opacity="0.7" />
                    <path d="M 140 140 Q 80 190 40 230" stroke="#7f1d1d" strokeWidth="2" fill="none" opacity="0.7" />
                    {/* Optic Disc */}
                    <circle cx="90" cy="140" r="26" fill="#fef08a" opacity="0.85" filter="drop-shadow(0 0 8px #fde047)" />
                    {/* Fovea */}
                    <circle cx="170" cy="145" r="14" fill="#451a03" opacity="0.9" stroke="#b45309" strokeWidth="1.5" />
                  </svg>

                  {/* Doctor Marker 1: Microaneurysm Annotation */}
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                    style={{
                      position: 'absolute',
                      top: '70px',
                      right: '65px',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: '2px dashed #f59e0b',
                      boxShadow: '0 0 12px rgba(245, 158, 11, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => setActiveAnnotation('Cluster of 14 Microaneurysms marked by Dr. Sunita')}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                  </motion.div>

                  {/* Doctor Marker 2: Macular Edema Ring */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    style={{
                      position: 'absolute',
                      bottom: '80px',
                      left: '120px',
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      border: '2px solid #2dd4bf',
                      boxShadow: '0 0 15px rgba(45, 212, 191, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={() => setActiveAnnotation('Clinically Significant Macular Edema (CSME) zone')}
                  />
                </div>

                {/* Patient Context HUD Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    background: 'rgba(10, 20, 32, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.74rem'
                  }}
                >
                  <div style={{ color: '#94a3b8' }}>Patient Stream</div>
                  <div style={{ fontWeight: 700, color: '#f1f5f9' }}>Sunita Devi (P-10291) • Age 62</div>
                  <div style={{ color: '#f59e0b', fontWeight: 600, marginTop: '2px' }}>AI Grade: Moderate NPDR (82% Conf)</div>
                </div>

                {/* Annotation Popup message */}
                <AnimatePresence>
                  {activeAnnotation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      style={{
                        position: 'absolute',
                        bottom: '20px',
                        padding: '8px 16px',
                        borderRadius: '100px',
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: '1px solid #2dd4bf',
                        color: '#5eead4',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
                      }}
                    >
                      ✏️ Specialist Markup: {activeAnnotation}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Doctor Video PiP Stream */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  width: '130px',
                  height: '160px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: inCall ? '2px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                  background: '#0f172a'
                }}
              >
                <img
                  src={selectedDoctor.avatar}
                  alt={selectedDoctor.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '4px 6px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    fontSize: '0.64rem',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontWeight: 600
                  }}
                >
                  {selectedDoctor.name}
                </div>
              </div>
            </div>

            {/* Video Controls Toolbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '16px',
                padding: '10px 16px',
                borderRadius: '16px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setMicActive(!micActive)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: micActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: micActive ? '#cbd5e1' : '#f87171',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {micActive ? <Mic size={16} /> : <MicOff size={16} />}
                </button>

                <button
                  onClick={() => setVideoActive(!videoActive)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: videoActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: videoActive ? '#cbd5e1' : '#f87171',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  {videoActive ? <Video size={16} /> : <VideoOff size={16} />}
                </button>

                <button
                  onClick={() => setActiveAnnotation(null)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '100px',
                    background: 'rgba(20, 184, 166, 0.15)',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    color: '#2dd4bf',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Clear Annotations
                </button>
              </div>

              <div>
                {inCall ? (
                  <button
                    onClick={handleEndCall}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 18px',
                      borderRadius: '100px',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
                    }}
                  >
                    <PhoneOff size={15} />
                    End Consult & Authorize
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartCall(selectedDoctor)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 20px',
                      borderRadius: '100px',
                      background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(20, 184, 166, 0.4)'
                    }}
                  >
                    <PhoneCall size={15} />
                    Launch Tele-Session
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Specialist Profile & Digital Referral Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Selected Specialist Info */}
            <div
              style={{
                background: 'rgba(8, 20, 34, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                padding: '20px'
              }}
            >
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, marginBottom: '12px' }}>
                ASSIGNED RETINA SPECIALIST
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={selectedDoctor.avatar}
                  alt={selectedDoctor.name}
                  style={{ width: '54px', height: '54px', borderRadius: '16px', objectFit: 'cover', border: '2px solid #2dd4bf' }}
                />
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {selectedDoctor.name}
                    <ShieldCheck size={16} color="#2dd4bf" />
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#67e8f9' }}>{selectedDoctor.qualification}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{selectedDoctor.hospital}</div>
                </div>
              </div>

              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.74rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Sub-Specialty:</span>
                  <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{selectedDoctor.specialty}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Consult SLA:</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>{selectedDoctor.queueTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Direct Helpline:</span>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>{selectedDoctor.phone}</span>
                </div>
              </div>
            </div>

            {/* Quick Digital Referral Slip Generator */}
            <div
              style={{
                background: 'rgba(8, 20, 34, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                padding: '20px'
              }}
            >
              <h4 style={{ margin: '0 0 10px', fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                Digital Specialist Authorization
              </h4>
              <p style={{ margin: '0 0 12px', fontSize: '0.74rem', color: '#94a3b8' }}>
                Enter clinical impressions and dispatch the signed referral packet to the rural district hospital.
              </p>

              <textarea
                value={consultNotes}
                onChange={(e) => setConsultNotes(e.target.value)}
                placeholder="Doctor's clinical remarks, laser timing, or anti-VEGF recommendation..."
                style={{
                  width: '100%',
                  height: '80px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  padding: '10px',
                  fontSize: '0.78rem',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '12px'
                }}
              />

              <button
                onClick={() => {
                  alert('Authorized! Digital Referral Slip generated with specialist signature stamp.');
                  setConsultNotes('');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <FileCheck size={15} />
                Generate Signed Referral Slip
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SPECIALIST ON-CALL ROSTER & PENDING TRIAGE QUEUE             */}
        {/* ============================================================ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* On-Call Specialists List */}
          <div
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              padding: '24px'
            }}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              On-Call Vitreoretinal Panel
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SPECIALISTS.map((doc) => {
                const isSelected = selectedDoctor.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      background: isSelected ? 'rgba(20, 184, 166, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                      border: isSelected ? '1px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={doc.avatar}
                        alt={doc.name}
                        style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f8fafc' }}>{doc.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#67e8f9' }}>{doc.qualification}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{doc.hospital}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: doc.status === 'online' ? '#34d399' : '#fbbf24',
                          display: 'inline-block',
                          marginBottom: '4px'
                        }}
                      >
                        ● {doc.status === 'online' ? 'Available' : 'In Review'}
                      </span>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{doc.queueTime}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pending Triage Cases Queue */}
          <div
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                Pending Rural Triage Escalations
              </h3>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: '100px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#f87171',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}
              >
                {pendingQueue.length} Awaiting Doctor Sign-Off
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingQueue.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#f1f5f9' }}>
                      {c.patientName} ({c.patientId})
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {c.village} • Diabetes {c.diabetesDuration}y
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '100px',
                        background: c.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: c.priority === 'HIGH' ? '#f87171' : '#fbbf24',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}
                    >
                      {c.result}
                    </span>

                    <button
                      onClick={() => handleStartCall(selectedDoctor)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'rgba(20, 184, 166, 0.15)',
                        border: '1px solid rgba(45, 212, 191, 0.3)',
                        color: '#2dd4bf',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Triage Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

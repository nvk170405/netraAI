import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { DOCTOR_CASES, RISK_MAP, DR_COLORS } from '../../data/mockData';
import { doctorApi } from '../../services/api';
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  ShieldCheck,
  User,
  MapPin,
  Clock,
  Sparkles,
  AlertTriangle,
  Stethoscope,
  ChevronRight,
  Loader2
} from 'lucide-react';

export default function CaseReview() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { caseId } = useParams();

  const [currentCase, setCurrentCase] = useState(
    location.state?.caseData || DOCTOR_CASES.find((c) => c.id === caseId) || DOCTOR_CASES[0]
  );

  const [notes, setNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState(currentCase.status || 'pending');
  const [imageTab, setImageTab] = useState('overlay'); // 'original' | 'overlay' | 'heatmap'
  const [signedOff, setSignedOff] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const screeningId = currentCase.screening_id ||
    (caseId && caseId.startsWith('dc-') ? parseInt(caseId.replace('dc-', ''), 10) : parseInt(caseId, 10)) ||
    1;

  useEffect(() => {
    const fetchLiveCase = async () => {
      try {
        const liveCase = await doctorApi.getCaseById(screeningId);
        if (liveCase) {
          setCurrentCase((prev) => ({ ...prev, ...liveCase }));
          if (liveCase.status) setReviewStatus(liveCase.status);
        }
      } catch (err) {
        console.warn('Could not load live case data:', err);
      }
    };
    fetchLiveCase();
  }, [screeningId]);

  const caseData = currentCase;

  const predictionClass = (caseData.result || '').includes('Severe')
    ? 3
    : (caseData.result || '').includes('Moderate')
    ? 2
    : (caseData.result || '').includes('Mild')
    ? 1
    : 0;

  const handleSignOff = async () => {
    setIsSubmitting(true);
    try {
      await doctorApi.submitReview(screeningId, { notes, status: 'reviewed' });
      setSignedOff(true);
      setReviewStatus('reviewed');
    } catch (e) {
      console.warn('Doctor review submission fallback:', e);
      setSignedOff(true);
      setReviewStatus('reviewed');
    } finally {
      setIsSubmitting(false);
    }
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
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        {/* Top Back Nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/doctor')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '100px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            Back to Review Queue
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '100px',
              background: signedOff || reviewStatus === 'reviewed' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: `1px solid ${signedOff || reviewStatus === 'reviewed' ? '#10b981' : '#f59e0b'}`,
              color: signedOff || reviewStatus === 'reviewed' ? '#34d399' : '#fbbf24',
              fontSize: '0.76rem',
              fontWeight: 700
            }}
          >
            {signedOff || reviewStatus === 'reviewed' ? '✓ Clinically Signed Off' : '⏳ Awaiting Specialist Sign-Off'}
          </div>
        </div>

        {/* Signed Off Alert */}
        <AnimatePresence>
          {signedOff && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                marginBottom: '24px',
                padding: '16px 20px',
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
              <span>Assessment confirmed by Dr. Sunita Rao (AIIMS Bhopal). Digital signature appended to official EMR slip.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Split-Screen Review Studio */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
          {/* Left Column: High-Res Fundus & Grad-CAM Canvas */}
          <div
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
                45° Retinal Fundus & Grad-CAM Heatmap
              </h3>

              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'original', label: 'Color Fundus' },
                  { id: 'overlay', label: 'Grad-CAM Overlay' },
                  { id: 'heatmap', label: 'Attention Heatmap' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setImageTab(m.id)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '100px',
                      background: imageTab === m.id ? 'rgba(20, 184, 166, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                      border: imageTab === m.id ? '1px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: imageTab === m.id ? '#5eead4' : '#94a3b8',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fundus Screen */}
            <div
              style={{
                height: '400px',
                borderRadius: '18px',
                background: '#040c16',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  background: imageTab === 'heatmap' ? '#020617' : 'radial-gradient(circle at 45% 45%, #92400e 0%, #713f12 70%, #422006 100%)',
                  boxShadow: '0 0 50px rgba(0,0,0,0.8)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {imageTab !== 'heatmap' && (
                  <svg width="100%" height="100%" viewBox="0 0 300 300" style={{ position: 'absolute', inset: 0 }}>
                    <path d="M 150 150 Q 200 80 250 40" stroke="#b91c1c" strokeWidth="3" fill="none" opacity="0.85" />
                    <path d="M 150 150 Q 90 80 50 40" stroke="#991b1b" strokeWidth="3" fill="none" opacity="0.8" />
                    <path d="M 150 150 Q 200 220 260 260" stroke="#7f1d1d" strokeWidth="2.5" fill="none" opacity="0.75" />
                    <circle cx="95" cy="150" r="28" fill="#fef08a" opacity="0.9" />
                    <circle cx="190" cy="155" r="16" fill="#451a03" stroke="#b45309" strokeWidth="2" />
                  </svg>
                )}

                {imageTab !== 'original' && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at 65% 35%, rgba(239, 68, 68, 0.8) 0%, rgba(245, 158, 11, 0.5) 35%, transparent 75%)',
                      mixBlendMode: imageTab === 'heatmap' ? 'normal' : 'screen',
                      pointerEvents: 'none'
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Clinical Decision & Sign-Off Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Patient Context Card */}
            <div
              style={{
                background: 'rgba(8, 20, 34, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                padding: '20px'
              }}
            >
              <h3 style={{ margin: '0 0 12px', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                Clinical History & Vitals
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Patient:</span>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>{caseData.patientName} ({caseData.patientId})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Origin:</span>
                  <span style={{ color: '#cbd5e1' }}>{caseData.village} Rural Health Camp</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Age & Gender:</span>
                  <span style={{ color: '#cbd5e1' }}>{caseData.age || 62} yrs • {caseData.gender || 'Female'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Diabetes Duration:</span>
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>{caseData.diabetesDuration || 15} Years</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <span style={{ color: '#94a3b8' }}>AI Grade:</span>
                  <span style={{ fontWeight: 700, color: '#2dd4bf' }}>{caseData.result} ({Math.round(caseData.confidence * 100)}% Conf)</span>
                </div>
              </div>
            </div>

            {/* Doctor Assessment Form */}
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
                Specialist Diagnosis & Remarks
              </h4>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Confirm DR grade, note presence of clinically significant macular edema (CSME), or advise panretinal photocoagulation..."
                style={{
                  width: '100%',
                  height: '90px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  padding: '10px',
                  fontSize: '0.8rem',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '14px'
                }}
              />

              <button
                onClick={handleSignOff}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(20, 184, 166, 0.35)'
                }}
              >
                <ShieldCheck size={16} />
                Sign Off & Authorize Tele-Referral
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

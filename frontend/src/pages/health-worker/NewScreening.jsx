import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { DEMO_CASES } from '../../data/mockData';
import {
  Camera,
  UploadCloud,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  User,
  Activity,
  Layers,
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

const SAMPLE_FUNDUS_IMAGES = [
  {
    id: 'sample-0',
    title: 'Normal Retina (Grade 0)',
    stage: 'No DR',
    risk: 'low',
    fundusColor: 'radial-gradient(circle at 45% 45%, #b45309 0%, #78350f 70%, #451a03 100%)',
    vessels: 'normal',
    demoRef: DEMO_CASES[0]
  },
  {
    id: 'sample-1',
    title: 'Mild NPDR (Grade 1)',
    stage: 'Mild DR',
    risk: 'low',
    fundusColor: 'radial-gradient(circle at 45% 45%, #92400e 0%, #713f12 70%, #422006 100%)',
    vessels: 'few_microaneurysms',
    demoRef: {
      id: 'demo-mild',
      patientId: 'P-10288',
      patientName: 'Meera Joshi',
      age: 47,
      gender: 'Female',
      village: 'Indore',
      diabetesDuration: 6,
      date: '2026-09-06',
      imageQuality: { sharpness: true, brightness: true, retinalArea: true, visibility: true, overall: 'good' },
      prediction: {
        class: 1,
        label: 'Mild DR',
        confidence: 0.76,
        probabilities: { no_dr: 0.18, mild: 0.76, moderate: 0.04, severe: 0.02, proliferative: 0.00 }
      },
      riskLevel: 'low',
      referralStatus: 'none',
      status: 'complete'
    }
  },
  {
    id: 'sample-2',
    title: 'Moderate NPDR (Grade 2)',
    stage: 'Moderate DR',
    risk: 'moderate',
    fundusColor: 'radial-gradient(circle at 45% 45%, #854d0e 0%, #5b21b6 70%, #2e1065 100%)',
    vessels: 'exudates_hemorrhages',
    demoRef: DEMO_CASES[1]
  },
  {
    id: 'sample-3',
    title: 'Severe PDR (Grade 4)',
    stage: 'Proliferative DR',
    risk: 'high',
    fundusColor: 'radial-gradient(circle at 45% 45%, #7f1d1d 0%, #450a0a 70%, #1f0404 100%)',
    vessels: 'neovascularization',
    demoRef: DEMO_CASES[2]
  }
];

export default function NewScreening() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('viewfinder'); // 'viewfinder' | 'samples' | 'upload'
  const [selectedSample, setSelectedSample] = useState(SAMPLE_FUNDUS_IMAGES[2]); // Moderate default
  const [patientName, setPatientName] = useState('Sunita Devi');
  const [patientId, setPatientId] = useState('P-10291');
  const [village, setVillage] = useState('Khandwa');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [captured, setCaptured] = useState(true);

  const triggerInference = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);

    const step1 = setTimeout(() => setAnalysisProgress(45), 400);
    const step2 = setTimeout(() => setAnalysisProgress(75), 800);
    const step3 = setTimeout(() => {
      setAnalysisProgress(100);
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate('/screening/results', {
          state: {
            screening: selectedSample.demoRef,
            isDemo: true
          }
        });
      }, 300);
    }, 1200);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
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
      {/* Background ambient medical glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '30%',
          width: '500px',
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
                <Camera size={13} />
                45° Non-Mydriatic Fundus Capture
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                Automated Optical Pre-Quality Check Active
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
              New Retinal Capture & AI Analysis Studio
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: '#94a3b8' }}>
              Acquire pupil-centered retinal fundus images with real-time blur/glare detection and trigger multi-class DR grading.
            </p>
          </div>

          <button
            onClick={() => navigate('/screening/register')}
            style={{
              padding: '10px 20px',
              borderRadius: '100px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#2dd4bf',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <User size={15} />
            Register New Patient First
          </button>
        </div>

        {/* Capture Mode Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('viewfinder')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '100px',
              background: activeTab === 'viewfinder' ? 'rgba(20, 184, 166, 0.25)' : 'rgba(15, 23, 42, 0.6)',
              border: activeTab === 'viewfinder' ? '1.5px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.08)',
              color: activeTab === 'viewfinder' ? '#5eead4' : '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Camera size={16} />
            Live Viewfinder Reticle
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '100px',
              background: activeTab === 'samples' ? 'rgba(20, 184, 166, 0.25)' : 'rgba(15, 23, 42, 0.6)',
              border: activeTab === 'samples' ? '1.5px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.08)',
              color: activeTab === 'samples' ? '#5eead4' : '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Sparkles size={16} />
            Pre-Loaded Clinical Test Cases
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '100px',
              background: activeTab === 'upload' ? 'rgba(20, 184, 166, 0.25)' : 'rgba(15, 23, 42, 0.6)',
              border: activeTab === 'upload' ? '1.5px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.08)',
              color: activeTab === 'upload' ? '#5eead4' : '#94a3b8',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <UploadCloud size={16} />
            Upload DICOM / JPEG Fundus
          </button>
        </div>

        {/* Main Stage: Viewfinder & Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Left Viewport Stage */}
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
              position: 'relative'
            }}
          >
            {/* Viewport Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                  Camera Optical Sensor Stream (USB-C 4K Non-Mydriatic)
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '100px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  Pupil: 3.6mm (Good)
                </span>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '100px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  Exposure: Optimal
                </span>
              </div>
            </div>

            {/* Simulated 45-degree Fundus Reticle Screen */}
            <div
              style={{
                height: '420px',
                borderRadius: '20px',
                background: '#040c16',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {/* Circular Retinal Field */}
              <motion.div
                animate={{ scale: [1, 1.01, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                style={{
                  width: '320px',
                  height: '320px',
                  borderRadius: '50%',
                  background: selectedSample.fundusColor,
                  boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.9)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* Simulated Retinal Anatomy SVG */}
                <svg width="100%" height="100%" viewBox="0 0 320 320" style={{ position: 'absolute', inset: 0 }}>
                  {/* Blood Vessels */}
                  <path d="M 160 160 Q 210 90 260 50" stroke="#b91c1c" strokeWidth="3.5" fill="none" opacity="0.85" />
                  <path d="M 160 160 Q 100 90 60 50" stroke="#991b1b" strokeWidth="3" fill="none" opacity="0.8" />
                  <path d="M 160 160 Q 210 230 270 270" stroke="#7f1d1d" strokeWidth="2.5" fill="none" opacity="0.75" />
                  <path d="M 160 160 Q 90 220 40 260" stroke="#7f1d1d" strokeWidth="2.5" fill="none" opacity="0.75" />
                  {/* Optic Disc */}
                  <circle cx="105" cy="160" r="30" fill="#fef08a" opacity="0.9" filter="drop-shadow(0 0 10px #fde047)" />
                  {/* Fovea Centralis */}
                  <circle cx="200" cy="165" r="16" fill="#451a03" opacity="0.95" stroke="#b45309" strokeWidth="2" />
                </svg>

                {/* Live Targeting Crosshair Reticle */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '20px',
                    borderRadius: '50%',
                    border: '1.5px dashed rgba(45, 212, 191, 0.4)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Centering Dot */}
                <div
                  style={{
                    position: 'absolute',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#2dd4bf',
                    boxShadow: '0 0 12px #2dd4bf',
                    pointerEvents: 'none'
                  }}
                />

                {/* Laser Alignment Rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    width: '280px',
                    height: '280px',
                    borderRadius: '50%',
                    border: '1px solid rgba(45, 212, 191, 0.15)',
                    borderTopColor: '#2dd4bf',
                    pointerEvents: 'none'
                  }}
                />
              </motion.div>

              {/* HUD Quality Gauge Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  padding: '10px 16px',
                  borderRadius: '14px',
                  background: 'rgba(8, 20, 32, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.74rem'
                }}
              >
                <div style={{ color: '#94a3b8', marginBottom: '2px' }}>AI Quality Score</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>98.2% Optimal</div>
                <div style={{ color: '#cbd5e1', fontSize: '0.7rem' }}>Sharpness: 9.8 • Illumination: 9.9</div>
              </div>

              {/* Shutter Trigger Indicator */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => {
                    setCaptured(true);
                    alert('High-resolution 45° fundus frame locked for inference.');
                  }}
                  style={{
                    padding: '8px 24px',
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
                  📸 Capture Frame
                </motion.button>
              </div>
            </div>
          </div>

          {/* Right Column: Pre-Loaded Samples & Patient Info */}
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
              <h3 style={{ margin: '0 0 12px', fontSize: '0.96rem', fontWeight: 700, color: '#ffffff' }}>
                Active Patient Profile
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Patient Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Patient ID</label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      color: '#ffffff',
                      fontSize: '0.82rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Village / Mobile Camp</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Clinical Sample Selectors */}
            <div
              style={{
                background: 'rgba(8, 20, 34, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  Select Sample Fundus to Test
                </h4>
                <span style={{ fontSize: '0.68rem', color: '#2dd4bf' }}>4 Benchmarked Cases</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {SAMPLE_FUNDUS_IMAGES.map((sample) => {
                  const isSelected = selectedSample.id === sample.id;
                  return (
                    <div
                      key={sample.id}
                      onClick={() => {
                        setSelectedSample(sample);
                        setPatientName(sample.demoRef.patientName);
                        setPatientId(sample.demoRef.patientId);
                        setVillage(sample.demoRef.village);
                      }}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: isSelected ? 'rgba(20, 184, 166, 0.2)' : 'rgba(15, 23, 42, 0.5)',
                        border: isSelected ? '1.5px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: sample.fundusColor,
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}
                        />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
                          {sample.title}
                        </span>
                      </div>

                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: sample.risk === 'high' ? '#f87171' : sample.risk === 'moderate' ? '#fbbf24' : '#34d399'
                        }}
                      >
                        {sample.stage}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Run AI Analysis CTA */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.25), rgba(6, 182, 212, 0.15))',
                borderRadius: '24px',
                border: '1.5px solid rgba(45, 212, 191, 0.4)',
                padding: '20px',
                boxShadow: '0 8px 24px rgba(20, 184, 166, 0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Zap size={16} color="#5eead4" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5eead4' }}>
                  DIABETIC RETINOPATHY DR-5 MODEL
                </span>
              </div>
              <p style={{ margin: '0 0 16px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                Evaluates microaneurysms, hemorrhages, and exudates in &lt;1.2 seconds with Grad-CAM explainability.
              </p>

              {isAnalyzing ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#5eead4', marginBottom: '6px' }}>
                    <span>Running Neural Inference...</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '100px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', background: 'linear-gradient(90deg, #14b8a6, #2dd4bf)', width: `${analysisProgress}%` }}
                      animate={{ width: `${analysisProgress}%` }}
                      transition={{ ease: 'easeOut', duration: 0.3 }}
                    />
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={triggerInference}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 20px rgba(20, 184, 166, 0.4)'
                  }}
                >
                  <Play size={16} fill="white" />
                  Run DR-5 AI Analysis
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { DEMO_CASES, RISK_MAP } from '../../data/mockData';
import { explainabilityApi } from '../../services/api';
import {
  Eye,
  ArrowLeft,
  Shield,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Video,
  Info,
  ChevronRight
} from 'lucide-react';

export default function ExplainabilityPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const screening = location.state?.screening || DEMO_CASES[1]; // Default to Moderate DR
  const [layerMode, setLayerMode] = useState('overlay'); // 'original' | 'heatmap' | 'overlay' | 'vessels'
  const [heatmapOpacity, setHeatmapOpacity] = useState(70);
  const [activeBiomarker, setActiveBiomarker] = useState('microaneurysms');
  const [liveExplanation, setLiveExplanation] = useState(null);

  const screeningId = screening.id?.startsWith('s-')
    ? parseInt(screening.id.replace('s-', ''), 10)
    : (parseInt(screening.id, 10) || 1);

  useEffect(() => {
    const fetchExplanation = async () => {
      try {
        const data = await explainabilityApi.getExplanation(screeningId);
        if (data) setLiveExplanation(data);
      } catch (e) {
        console.warn('Could not load live explanation:', e);
      }
    };
    fetchExplanation();
  }, [screeningId]);

  const prediction = screening.prediction || {
    class: 2,
    label: 'Moderate DR',
    confidence: 0.82,
    probabilities: { no_dr: 0.03, mild: 0.07, moderate: 0.82, severe: 0.06, proliferative: 0.02 }
  };

  const probMap = prediction.probabilities || {
    no_dr: 0.03,
    mild: 0.07,
    moderate: 0.82,
    severe: 0.06,
    proliferative: 0.02
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
        {/* Top Back Nav & Patient Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <button
            onClick={() => navigate(-1)}
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
            Back to Clinical Dashboard
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 16px',
              borderRadius: '100px',
              background: 'rgba(20, 184, 166, 0.15)',
              border: '1px solid rgba(45, 212, 191, 0.3)',
              fontSize: '0.78rem'
            }}
          >
            <span style={{ color: '#94a3b8' }}>Patient:</span>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>{screening.patientName || 'Sunita Devi'}</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span style={{ color: '#2dd4bf', fontWeight: 600 }}>{screening.patientId || 'P-10291'}</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>{prediction.label}</span>
          </div>
        </div>

        {/* Title Header */}
        <div style={{ marginBottom: '28px' }}>
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
              <Sparkles size={13} />
              Explainable AI (XAI) Grad-CAM Visualizer
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
            Why Did AI Diagnose {prediction.label}?
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: '#94a3b8' }}>
            Gradient-weighted Class Activation Mapping (Grad-CAM) highlights exact retinal regions, microaneurysm clusters, and vascular changes influencing the neural diagnosis.
          </p>
        </div>

        {/* Main Explainability Stage */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Left Canvas Viewport */}
          <div
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(20, 184, 166, 0.25)',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Layer Controls Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'original', label: 'Color Fundus' },
                  { id: 'overlay', label: 'Grad-CAM Overlay' },
                  { id: 'heatmap', label: 'Pure Heatmap' },
                  { id: 'vessels', label: 'Vessel Caliber' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setLayerMode(m.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '100px',
                      background: layerMode === m.id ? 'rgba(20, 184, 166, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                      border: layerMode === m.id ? '1px solid #2dd4bf' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: layerMode === m.id ? '#5eead4' : '#94a3b8',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Opacity Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: '#cbd5e1' }}>
                <Sliders size={13} color="#2dd4bf" />
                <span>Heatmap Opacity:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={heatmapOpacity}
                  onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                  style={{ width: '80px', accentColor: '#2dd4bf' }}
                />
                <span style={{ color: '#2dd4bf', fontWeight: 700 }}>{heatmapOpacity}%</span>
              </div>
            </div>

            {/* Simulated Fundus & Grad-CAM Canvas */}
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
              {/* Circular Fundus */}
              <div
                style={{
                  width: '320px',
                  height: '320px',
                  borderRadius: '50%',
                  background: layerMode === 'heatmap' ? '#020617' : 'radial-gradient(circle at 45% 45%, #92400e 0%, #713f12 70%, #422006 100%)',
                  boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.9)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* SVG Anatomy */}
                {layerMode !== 'heatmap' && (
                  <svg width="100%" height="100%" viewBox="0 0 320 320" style={{ position: 'absolute', inset: 0 }}>
                    <path d="M 160 160 Q 210 90 260 50" stroke="#b91c1c" strokeWidth="3" fill="none" opacity="0.85" />
                    <path d="M 160 160 Q 100 90 60 50" stroke="#991b1b" strokeWidth="3" fill="none" opacity="0.8" />
                    <path d="M 160 160 Q 210 230 270 270" stroke="#7f1d1d" strokeWidth="2.5" fill="none" opacity="0.75" />
                    <path d="M 160 160 Q 90 220 40 260" stroke="#7f1d1d" strokeWidth="2.5" fill="none" opacity="0.75" />
                    <circle cx="105" cy="160" r="30" fill="#fef08a" opacity="0.9" />
                    <circle cx="200" cy="165" r="16" fill="#451a03" opacity="0.95" stroke="#b45309" strokeWidth="2" />
                  </svg>
                )}

                {/* Grad-CAM Heatmap Overlay */}
                {(layerMode === 'overlay' || layerMode === 'heatmap') && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: heatmapOpacity / 100,
                      background: 'radial-gradient(circle at 65% 35%, rgba(239, 68, 68, 0.8) 0%, rgba(245, 158, 11, 0.5) 35%, rgba(16, 185, 129, 0.2) 65%, transparent 85%)',
                      mixBlendMode: layerMode === 'heatmap' ? 'normal' : 'screen',
                      pointerEvents: 'none'
                    }}
                  />
                )}

                {/* Hotspot 1: Microaneurysm Cluster Marker */}
                <div
                  onClick={() => setActiveBiomarker('microaneurysms')}
                  style={{
                    position: 'absolute',
                    top: '80px',
                    right: '80px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '2px dashed #f87171',
                    boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                </div>

                {/* Hotspot 2: Macular Edema Zone Marker */}
                <div
                  onClick={() => setActiveBiomarker('fovea')}
                  style={{
                    position: 'absolute',
                    bottom: '100px',
                    left: '130px',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    border: '2px solid #2dd4bf',
                    boxShadow: '0 0 15px rgba(45, 212, 191, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Biomarker Floating HUD Box */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  padding: '10px 16px',
                  borderRadius: '14px',
                  background: 'rgba(8, 20, 34, 0.85)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.74rem'
                }}
              >
                <div style={{ color: '#94a3b8' }}>Active Biomarker:</div>
                <div style={{ fontWeight: 700, color: '#5eead4' }}>
                  {activeBiomarker === 'microaneurysms'
                    ? '14 Microaneurysms • Inferior Arcade'
                    : 'Center Fovea • 12% Low DME Risk'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Probabilities & Clinical Attribution */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Multi-Class Probability Radar */}
            <div
              style={{
                background: 'rgba(8, 20, 34, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                padding: '20px'
              }}
            >
              <h3 style={{ margin: '0 0 14px', fontSize: '0.96rem', fontWeight: 700, color: '#ffffff' }}>
                Multi-Class DR Prediction Probabilities
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Grade 0: No DR', val: probMap.no_dr || 0.03, color: '#10b981' },
                  { label: 'Grade 1: Mild NPDR', val: probMap.mild || 0.07, color: '#34d399' },
                  { label: 'Grade 2: Moderate NPDR', val: probMap.moderate || 0.82, color: '#fbbf24', active: true },
                  { label: 'Grade 3: Severe NPDR', val: probMap.severe || 0.06, color: '#f97316' },
                  { label: 'Grade 4: Proliferative PDR', val: probMap.proliferative || 0.02, color: '#ef4444' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                      <span style={{ color: item.active ? '#ffffff' : '#94a3b8', fontWeight: item.active ? 700 : 500 }}>
                        {item.label}
                      </span>
                      <span style={{ color: item.color, fontWeight: 700 }}>
                        {Math.round(item.val * 100)}%
                      </span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '100px', background: 'rgba(255, 255, 255, 0.06)', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${item.val * 100}%`,
                          height: '100%',
                          background: item.color,
                          borderRadius: '100px',
                          boxShadow: item.active ? `0 0 8px ${item.color}` : 'none'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bilingual Plain-Language XAI Explanation */}
            <div
              style={{
                background: 'rgba(8, 20, 34, 0.75)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                padding: '20px'
              }}
            >
              <h4 style={{ margin: '0 0 8px', fontSize: '0.86rem', fontWeight: 700, color: '#2dd4bf' }}>
                Clinical Attribution Reasoning (English)
              </h4>
              <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                The deep vision network assigned 82% confidence to <strong>Moderate NPDR</strong> based on prominent microaneurysm outpouchings localized along the inferior temporal vascular arcade and minor blot hemorrhages, with no neovascular fronds observed.
              </p>

              <h4 style={{ margin: '0 0 8px', fontSize: '0.86rem', fontWeight: 700, color: '#38bdf8' }}>
                मरीज व स्वास्थ्य कार्यकर्ता हेतु व्याख्या (Hindi)
              </h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
                नेत्रा-एआई ने पर्दे के निचले हिस्से में खून की बारीक थैलियां और रिसाव पाया है। आंख का मुख्य केंद्र (मैक्युला) अभी सुरक्षित है, इसलिए 1 से 3 माह में विशेषज्ञ को दिखाना आवश्यक है।
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => navigate('/screening/report', { state: { screening } })}
                style={{
                  flex: 1,
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
                <FileText size={15} />
                Generate Report
              </button>

              <button
                onClick={() => navigate('/tele-ophthalmology')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#2dd4bf',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Video size={15} />
                Tele-Consult
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Sparkles, 
  Activity, 
  Layers, 
  Maximize2, 
  Focus, 
  CheckCircle2, 
  AlertTriangle, 
  Droplet,
  Heart
} from 'lucide-react';

/**
 * RetinaAnatomyViewer component (directly inspired by Image 1)
 * Central anatomical organ inspection hub tailored for Retinal Fundus diagnostics.
 * Features 3 clinical layer switchers, base glowing pedestal, left focus arc gauge,
 * and 4 floating frosted-glass callout cards tethered to anatomical landmarks.
 */
export function RetinaAnatomyViewer({ onSelectLandmark, className = '' }) {
  const [activeLayer, setActiveLayer] = useState('heatmap'); // 'color' | 'heatmap' | 'vessels'
  const [selectedCallout, setSelectedCallout] = useState('macula');

  const callouts = [
    {
      id: 'disc',
      title: 'Optic Nerve Disc',
      value: '98.2% Focus',
      sub: 'Sharp Margins • C/D Ratio 0.3',
      color: '#10b981',
      badge: 'Normal Margin',
      coords: { x: 38, y: 35 }, // Percent from center
      calloutPosition: { top: '12%', left: '8%' },
      anchorPoint: { cx: 240, cy: 190 },
    },
    {
      id: 'macula',
      title: 'Macular Center / Fovea',
      value: '12% Risk',
      sub: 'Clinically Significant DME: Low',
      color: '#2dd4bf',
      badge: 'Low Edema',
      coords: { x: 58, y: 48 },
      calloutPosition: { top: '16%', right: '8%' },
      anchorPoint: { cx: 340, cy: 230 },
    },
    {
      id: 'microaneurysm',
      title: 'Microaneurysm Clusters',
      value: '14 Detected',
      sub: 'Localized in Inferior Arc',
      color: '#f59e0b',
      badge: 'Grade 2 NPDR',
      coords: { x: 44, y: 64 },
      calloutPosition: { bottom: '14%', left: '8%' },
      anchorPoint: { cx: 270, cy: 290 },
    },
    {
      id: 'vessels',
      title: 'Vascular Caliber & HbA1c',
      value: '142 mg/dL',
      sub: 'HbA1c 7.8% • A/V Ratio 2:3',
      color: '#38bdf8',
      badge: 'Stable Caliber',
      coords: { x: 62, y: 68 },
      calloutPosition: { bottom: '12%', right: '8%' },
      anchorPoint: { cx: 350, cy: 300 },
    },
  ];

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        position: 'relative',
        borderRadius: '28px',
        background: 'linear-gradient(135deg, rgba(8, 22, 36, 0.75) 0%, rgba(4, 12, 22, 0.85) 100%)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(45, 212, 191, 0.25)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(20, 184, 166, 0.08)',
        padding: '1.75rem',
        overflow: 'hidden',
        minHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── TOP CONTROLS & LAYER SWITCHER (Image 1 style) ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          zIndex: 10,
          marginBottom: '0.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#2dd4bf',
                boxShadow: '0 0 10px #2dd4bf',
              }}
            />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Anatomical Retinal Diagnostic Hub
            </h3>
          </div>
          <p style={{ margin: '4px 0 0 16px', fontSize: '0.78rem', color: '#94a3b8' }}>
            45° Non-Mydriatic Fundus Field • Live AI Feature Triage
          </p>
        </div>

        {/* Layer Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '999px',
            padding: '3px',
            gap: '3px',
          }}
        >
          {[
            { id: 'color', label: 'Color Fundus', icon: <Eye size={13} /> },
            { id: 'heatmap', label: 'Grad-CAM AI', icon: <Sparkles size={13} /> },
            { id: 'vessels', label: 'Vessel Caliber', icon: <Activity size={13} /> },
          ].map((layer) => {
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayer(layer.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94a3b8',
                  fontSize: '0.74rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 10px rgba(20, 184, 166, 0.35)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {layer.icon}
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CENTRAL VISUALIZATION WORKSPACE ── */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '380px',
        }}
      >
        {/* 🌟 LEFT ARC GAUGE (Directly from Image 1: 76%, 87%, 98%) 🌟 */}
        <div
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 10,
          }}
        >
          <div style={{ position: 'relative', height: '220px', width: '32px' }}>
            {/* SVG Arc Tickmarks */}
            <svg width="32" height="220" viewBox="0 0 32 220" style={{ overflow: 'visible' }}>
              <path
                d="M 28 10 A 180 180 0 0 0 28 210"
                fill="none"
                stroke="rgba(45, 212, 191, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="2 4"
              />
              {/* Active pointer tick at 87% */}
              <line x1="8" y1="110" x2="28" y2="110" stroke="#2dd4bf" strokeWidth="2.5" />
              <circle cx="28" cy="110" r="3.5" fill="#2dd4bf" filter="drop-shadow(0 0 6px #2dd4bf)" />
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '170px', fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
            <span>98%</span>
            <span style={{ color: '#2dd4bf', fontWeight: 800, fontSize: '0.8rem', background: 'rgba(20, 184, 166, 0.15)', padding: '2px 6px', borderRadius: '6px' }}>
              87%
            </span>
            <span>76%</span>
          </div>
        </div>

        {/* 🌟 CENTRAL RETINAL FUNDUS EYE GLOBE 🌟 */}
        <div
          style={{
            position: 'relative',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Base Pedestal Glowing Oval (Image 1 style) */}
          <div
            style={{
              position: 'absolute',
              bottom: '-28px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '280px',
              height: '40px',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(45, 212, 191, 0.45) 0%, rgba(20, 184, 166, 0.15) 50%, transparent 70%)',
              filter: 'blur(8px)',
              pointerEvents: 'none',
            }}
          />

          {/* Glowing Pedestal Ring */}
          <svg
            width="340"
            height="50"
            viewBox="0 0 340 50"
            style={{ position: 'absolute', bottom: '-26px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }}
          >
            <ellipse cx="170" cy="25" rx="140" ry="18" fill="none" stroke="rgba(45, 212, 191, 0.35)" strokeWidth="1.5" strokeDasharray="5 5" />
          </svg>

          {/* Outer Retinal Sphere with Dynamic Clinical Rendering */}
          <motion.div
            animate={{ scale: [1, 1.015, 1] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
            style={{
              position: 'relative',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 0 50px rgba(20, 184, 166, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.85)',
              border: '2px solid rgba(45, 212, 191, 0.4)',
              cursor: 'crosshair',
            }}
          >
            {/* Base Color Fundus Background (Natural 45° Retinal View) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 45% 45%, #7a1c1c 0%, #4a0f12 55%, #1f0507 90%)',
              }}
            />

            {/* Optic Disc (Nasal side, bright golden-white) */}
            <div
              style={{
                position: 'absolute',
                left: '26%',
                top: '40%',
                width: '38px',
                height: '46px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #fde68a 0%, #f59e0b 60%, rgba(180, 83, 9, 0.4) 100%)',
                boxShadow: '0 0 16px rgba(251, 191, 36, 0.6)',
                filter: 'blur(1px)',
              }}
            />

            {/* Fovea / Macula (Central dark reddish-brown depression) */}
            <div
              style={{
                position: 'absolute',
                left: '56%',
                top: '48%',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #2d0608 30%, #5c0f13 70%, transparent 100%)',
                border: '1px dashed rgba(245, 158, 11, 0.4)',
              }}
            />

            {/* Retinal Blood Vessels (SVG Vascular Tree) */}
            <svg
              viewBox="0 0 280 280"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            >
              {/* Superior Temporal Arcade */}
              <path
                d="M 100 130 Q 120 70 170 65 T 240 85"
                fill="none"
                stroke={activeLayer === 'vessels' ? '#2dd4bf' : '#b91c1c'}
                strokeWidth={activeLayer === 'vessels' ? '3' : '2.5'}
                filter={activeLayer === 'vessels' ? 'drop-shadow(0 0 4px #2dd4bf)' : 'none'}
              />
              {/* Inferior Temporal Arcade */}
              <path
                d="M 100 145 Q 130 200 180 215 T 250 200"
                fill="none"
                stroke={activeLayer === 'vessels' ? '#06b6d4' : '#991b1b'}
                strokeWidth={activeLayer === 'vessels' ? '3.2' : '2.8'}
                filter={activeLayer === 'vessels' ? 'drop-shadow(0 0 4px #06b6d4)' : 'none'}
              />
              {/* Nasal Arcades */}
              <path
                d="M 90 135 Q 60 90 40 80 M 90 140 Q 55 180 35 200"
                fill="none"
                stroke={activeLayer === 'vessels' ? '#38bdf8' : '#7f1d1d'}
                strokeWidth="2"
              />

              {/* Pathological Hotspots (Microaneurysms & Blot Hemorrhages) */}
              <circle cx="165" cy="180" r="3.5" fill="#ef4444" filter="drop-shadow(0 0 3px #ef4444)" />
              <circle cx="185" cy="165" r="2.5" fill="#f87171" />
              <circle cx="145" cy="195" r="3" fill="#dc2626" />
              <circle cx="210" cy="140" r="2" fill="#ef4444" />
            </svg>

            {/* 🌟 GRAD-CAM HEATMAP SUPERPOSITION LAYER 🌟 */}
            <AnimatePresence>
              {activeLayer === 'heatmap' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    mixBlendMode: 'screen',
                    background: `
                      radial-gradient(circle at 58% 62%, rgba(239, 68, 68, 0.75) 0%, rgba(245, 158, 11, 0.5) 25%, rgba(16, 185, 129, 0.25) 45%, transparent 65%),
                      radial-gradient(circle at 35% 42%, rgba(56, 189, 248, 0.4) 0%, transparent 40%)
                    `,
                  }}
                />
              )}
            </AnimatePresence>

            {/* Landmark Anchor Pulsing Dots */}
            {callouts.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.4 }}
                onClick={() => setSelectedCallout(item.id)}
                style={{
                  position: 'absolute',
                  left: `${item.coords.x}%`,
                  top: `${item.coords.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: item.color,
                  border: '2px solid #FFFFFF',
                  boxShadow: `0 0 12px ${item.color}`,
                  cursor: 'pointer',
                  zIndex: 20,
                }}
              >
                <motion.div
                  animate={{ scale: [1, 2.2, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '50%',
                    border: `2px solid ${item.color}`,
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 🌟 4 FLOATING FROSTED GLASS CALLOUT CARDS (Directly inspired by Image 1) 🌟 */}
        {callouts.map((card) => {
          const isSelected = selectedCallout === card.id;

          return (
            <motion.div
              key={card.id}
              whileHover={{ scale: 1.05, y: -3 }}
              onClick={() => setSelectedCallout(card.id)}
              style={{
                position: 'absolute',
                ...card.calloutPosition,
                width: '180px',
                borderRadius: '16px',
                background: isSelected ? 'rgba(8, 28, 44, 0.95)' : 'rgba(6, 18, 30, 0.85)',
                backdropFilter: 'blur(16px)',
                border: isSelected ? `1.5px solid ${card.color}` : '1px solid rgba(45, 212, 191, 0.25)',
                boxShadow: isSelected
                  ? `0 10px 30px rgba(0,0,0,0.6), 0 0 20px ${card.color}40`
                  : '0 8px 25px rgba(0,0,0,0.5)',
                padding: '12px 14px',
                cursor: 'pointer',
                zIndex: isSelected ? 25 : 15,
                transition: 'all 0.25s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{card.title}</span>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: card.color,
                    boxShadow: `0 0 6px ${card.color}`,
                  }}
                />
              </div>

              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                {card.value}
              </div>

              <div style={{ fontSize: '0.66rem', color: '#cbd5e1', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {card.sub}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default RetinaAnatomyViewer;

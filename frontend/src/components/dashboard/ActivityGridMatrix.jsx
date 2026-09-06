import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Signal, Zap, MapPin, Layers } from 'lucide-react';

const DAYS = ['M', 'T', 'W', 'T', 'F'];
const VILLAGES = ['Khandwa', 'Dewas', 'Barwani', 'Ujjain', 'Indore'];

// 5x5 activity levels (0: none, 1: low, 2: medium, 3: high, 4: peak)
const ACTIVITY_DATA = [
  [3, 4, 2, 4, 3], // Khandwa
  [2, 3, 4, 3, 2], // Dewas
  [1, 2, 3, 4, 4], // Barwani
  [4, 3, 2, 1, 3], // Ujjain
  [2, 4, 3, 4, 4], // Indore
];

const INTENSITY_COLORS = [
  'rgba(255, 255, 255, 0.05)',       // Level 0
  'rgba(20, 184, 166, 0.25)',        // Level 1
  'rgba(20, 184, 166, 0.55)',        // Level 2
  'rgba(45, 212, 191, 0.85)',        // Level 3
  '#2dd4bf'                          // Level 4 (peak glowing)
];

export default function ActivityGridMatrix() {
  const [hoveredCell, setHoveredCell] = useState(null);

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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(20, 184, 166, 0.2)',
              border: '1px solid rgba(45, 212, 191, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2dd4bf'
            }}
          >
            <Layers size={14} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
              Camp Activity Heatmap
            </h4>
            <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>
              5-Day Screening Matrix Across Hubs
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.68rem', color: '#67e8f9', fontWeight: 600 }}>98.4% Sync</span>
          <Signal size={13} color="#2dd4bf" />
        </div>
      </div>

      {/* 5x5 Grid Container */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
        {/* Village Labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '62px' }}>
          {VILLAGES.map((v, i) => (
            <div
              key={i}
              style={{
                fontSize: '0.68rem',
                color: '#94a3b8',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {v}
            </div>
          ))}
        </div>

        {/* The Matrix */}
        <div style={{ flex: 1 }}>
          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '6px' }}>
            {DAYS.map((d, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  fontSize: '0.66rem',
                  color: '#64748b',
                  fontWeight: 600
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {ACTIVITY_DATA.map((row, rIdx) => (
              <div key={rIdx} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {row.map((level, cIdx) => {
                  const isHovered = hoveredCell && hoveredCell.r === rIdx && hoveredCell.c === cIdx;
                  return (
                    <motion.div
                      key={cIdx}
                      onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx, val: level * 8 + 12 })}
                      onMouseLeave={() => setHoveredCell(null)}
                      whileHover={{ scale: 1.15, zIndex: 10 }}
                      style={{
                        height: '22px',
                        borderRadius: '6px',
                        backgroundColor: INTENSITY_COLORS[level],
                        border: level === 4 ? '1px solid #5eead4' : '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: level >= 3 ? '0 0 10px rgba(45, 212, 191, 0.4)' : 'none',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s ease, border-color 0.2s ease'
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Info Tip or Default Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderRadius: '10px',
          background: 'rgba(15, 23, 42, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '0.7rem'
        }}
      >
        {hoveredCell ? (
          <span style={{ color: '#2dd4bf', fontWeight: 600 }}>
            {VILLAGES[hoveredCell.r]} • {DAYS[hoveredCell.c]}: {hoveredCell.val} Screenings Uploaded
          </span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
            <span>Intensity:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {INTENSITY_COLORS.map((c, i) => (
                <span
                  key={i}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    backgroundColor: c,
                    display: 'inline-block'
                  }}
                />
              ))}
            </div>
            <span style={{ color: '#2dd4bf', fontWeight: 600 }}>Peak Load</span>
          </div>
        )}

        <span style={{ color: '#67e8f9', fontWeight: 600, fontSize: '0.68rem' }}>
          Camp Total: 142
        </span>
      </div>

      {/* Real-time Optical Sensor Telemetry Waveform */}
      <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(20, 184, 166, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Activity size={13} color="#2dd4bf" /> Optical Alignment Pulse
          </span>
          <span style={{ fontSize: '0.68rem', color: '#2dd4bf', fontWeight: 600 }}>
            42ms • Optimal
          </span>
        </div>

        {/* SVG animated waveform */}
        <div style={{ height: '36px', width: '100%', position: 'relative', overflow: 'hidden' }}>
          <svg width="100%" height="100%" viewBox="0 0 300 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0891b2" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#2dd4bf" stopOpacity="1" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            {/* Background grid lines */}
            <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="3 3" />
            <line x1="0" y1="10" x2="300" y2="10" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" />
            <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="3 3" />

            {/* Pulsing telemetry path */}
            <path
              d="M 0 20 L 40 20 L 50 8 L 60 32 L 70 12 L 80 26 L 90 20 L 150 20 L 160 5 L 170 35 L 180 14 L 190 24 L 200 20 L 260 20 L 270 9 L 280 29 L 290 20 L 300 20"
              fill="none"
              stroke="url(#waveGlow)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Scanner pulse overlay dot */}
          <motion.div
            animate={{ x: [0, 280, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: '16px',
              left: 0,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#5eead4',
              boxShadow: '0 0 10px #5eead4, 0 0 20px #2dd4bf',
              pointerEvents: 'none'
            }}
          />
        </div>
      </div>
    </div>
  );
}

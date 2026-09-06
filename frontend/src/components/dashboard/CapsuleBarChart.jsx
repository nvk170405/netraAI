import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, ChevronDown, Activity, Sparkles } from 'lucide-react';

/**
 * CapsuleBarChart component (directly inspired by Image 2 & Bklit UI)
 * Signature dual-tone vertical capsule bars with sliding indicator dots,
 * floating percentage bubbles, and interactive day-by-day statistics.
 */
export function CapsuleBarChart({ className = '' }) {
  const [hoveredIdx, setHoveredIdx] = useState(4); // Default to 1 Jul (active in Image 2)
  const [selectedYear, setSelectedYear] = useState('2026');

  const daysData = [
    { day: '27 Jun', operations: 82, inferences: 45, percentage: 82, highlight: false },
    { day: '28 Jun', operations: 58, inferences: 30, percentage: 58, highlight: false },
    { day: '29 Jun', operations: 75, inferences: 25, percentage: 75, highlight: false },
    { day: '30 Jun', operations: 0, inferences: 0, percentage: 0, ghost: true, targetDot: 92 },
    { day: '1 Jul', operations: 87, inferences: 32, percentage: 87, subPercentage: 32, highlight: true },
    { day: '2 Jul', operations: 0, inferences: 0, percentage: 0, ghost: true, targetDot: 88 },
    { day: '3 Jul', operations: 64, inferences: 48, percentage: 64, highlight: false },
    { day: '4 Jul', operations: 55, inferences: 42, percentage: 55, highlight: false },
  ];

  return (
    <div
      className={`select-none ${className}`}
      style={{
        borderRadius: '28px',
        background: 'linear-gradient(135deg, rgba(8, 22, 36, 0.75) 0%, rgba(4, 12, 22, 0.85) 100%)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(45, 212, 191, 0.25)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── HEADER ROW (Title, Legend & Year Dropdown from Image 2) ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(20, 184, 166, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2dd4bf',
            }}
          >
            <BarChart3 size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Screening Statistics
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px', fontSize: '0.74rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#cbd5e1' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0f293d' }} />
                <span>Operations (Total Scans)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2dd4bf' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2dd4bf' }} />
                <span>AI Inferences (Grad-CAM)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Year Dropdown Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <span>{selectedYear}</span>
          <ChevronDown size={14} color="#94a3b8" />
        </div>
      </div>

      {/* ── DUAL CAPSULE SLIDER BARS AREA (Directly from Image 2) ── */}
      <div
        style={{
          position: 'relative',
          height: '240px',
          width: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '0 1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '12px',
        }}
      >
        {/* Background Grid Lines (0.1 to 1.0 from Image 2) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: '12px',
            zIndex: 0,
          }}
        >
          {[1.0, 0.8, 0.6, 0.4, 0.2, 0.0].map((val) => (
            <div key={val} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <span style={{ fontSize: '0.66rem', color: '#475569', width: '22px' }}>{val.toFixed(1)}</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.04)' }} />
            </div>
          ))}
        </div>

        {/* 8 Vertical Capsule Bars */}
        {daysData.map((d, index) => {
          const isHovered = hoveredIdx === index;
          const barHeight = d.ghost ? 180 : (d.operations / 100) * 190;
          const subHeight = (d.inferences / 100) * 190;

          return (
            <div
              key={d.day}
              onMouseEnter={() => setHoveredIdx(index)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 5,
                cursor: 'pointer',
              }}
            >
              {/* Floating Percentage Tag (e.g. 87% black bubble from Image 2) */}
              {d.percentage > 0 && isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    position: 'absolute',
                    bottom: `${barHeight + 14}px`,
                    background: '#040d18',
                    border: '1px solid #2dd4bf',
                    borderRadius: '999px',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#2dd4bf',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    whiteSpace: 'nowrap',
                    zIndex: 20,
                  }}
                >
                  {d.percentage}%
                </motion.div>
              )}

              {/* Sub-percentage tag (e.g. 32% yellow bubble from Image 2) */}
              {d.subPercentage && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: `${subHeight + 6}px`,
                    left: '-32px',
                    background: 'rgba(20, 184, 166, 0.25)',
                    border: '1px solid rgba(45, 212, 191, 0.5)',
                    borderRadius: '999px',
                    padding: '2px 6px',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: '#5eead4',
                    whiteSpace: 'nowrap',
                    zIndex: 20,
                  }}
                >
                  {d.subPercentage}%
                </div>
              )}

              {/* The Capsule Bar Shape */}
              <div
                style={{
                  width: '28px',
                  height: `${barHeight}px`,
                  borderRadius: '999px',
                  background: d.ghost
                    ? 'transparent'
                    : 'linear-gradient(180deg, #091f32 0%, #051422 45%, #2dd4bf 100%)',
                  border: d.ghost
                    ? '1.5px dashed rgba(255, 255, 255, 0.15)'
                    : isHovered
                    ? '2px solid #5eead4'
                    : '1px solid rgba(45, 212, 191, 0.3)',
                  boxShadow: isHovered && !d.ghost
                    ? '0 0 16px rgba(45, 212, 191, 0.4)'
                    : 'none',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                }}
              >
                {/* Luminous Inner Inference Fill */}
                {!d.ghost && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${subHeight}px` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(180deg, #2dd4bf 0%, #14b8a6 100%)',
                      borderRadius: '999px',
                    }}
                  />
                )}

                {/* Sliding Dot Indicator inside Capsule (from Image 2) */}
                {!d.ghost && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      boxShadow: '0 0 6px #FFFFFF',
                    }}
                  />
                )}

                {/* Ghost Bar target dot */}
                {d.ghost && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '18px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.3)',
                    }}
                  />
                )}
              </div>

              {/* Day Label */}
              <span
                style={{
                  marginTop: '10px',
                  fontSize: '0.72rem',
                  fontWeight: isHovered ? 700 : 500,
                  color: isHovered ? '#2dd4bf' : '#94a3b8',
                  transition: 'color 0.2s',
                }}
              >
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CapsuleBarChart;

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Activity, RefreshCw, Cpu, Stethoscope, Building2 } from 'lucide-react';

/**
 * StateLoader — Reusable clinical state loading indicator
 * Supports variants:
 * - "card": Centered inside a card or widget
 * - "table": Shimmering retinal skeleton rows for tables
 * - "inline": Compact spinner with text
 * - "radar": Holographic radar scan animation
 */
export function StateLoader({
  variant = 'card',
  title = 'Loading Clinical Records...',
  subtitle = 'Retrieving encrypted patient data from edge database',
  portal = 'health_worker',
  rows = 5,
  className = '',
}) {
  const portalColors = {
    health_worker: { primary: '#2dd4bf', rgb: '45, 212, 191' },
    doctor: { primary: '#38bdf8', rgb: '56, 189, 248' },
    admin: { primary: '#fbbf24', rgb: '245, 158, 11' },
  };

  const theme = portalColors[portal] || portalColors.health_worker;

  // 1. TABLE SKELETON SHIMMER VARIANT
  if (variant === 'table') {
    return (
      <div className={className} style={{ width: '100%', padding: '16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: theme.primary, fontSize: '0.8rem', fontWeight: 600 }}>
          <RefreshCw size={14} className="animate-spin" style={{ animationDuration: '1.5s' }} />
          <span>{title}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
          {Array.from({ length: rows }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
              style={{
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                gap: '16px',
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `rgba(${theme.rgb}, 0.15)` }} />
              <div style={{ width: '120px', height: '12px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)' }} />
              <div style={{ width: '80px', height: '12px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)' }} />
              <div style={{ flex: 1 }} />
              <div style={{ width: '90px', height: '20px', borderRadius: '100px', background: `rgba(${theme.rgb}, 0.12)` }} />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // 2. INLINE SPINNER VARIANT
  if (variant === 'inline') {
    return (
      <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: theme.primary, fontSize: '0.82rem', fontWeight: 600 }}>
        <RefreshCw size={15} style={{ animation: 'spin 1.2s linear infinite' }} />
        <span>{title}</span>
      </div>
    );
  }

  // 3. RADAR SCAN VARIANT
  if (variant === 'radar') {
    return (
      <div className={className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{ position: 'relative', width: '64px', height: '64px', marginBottom: '16px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `1.5px dashed rgba(${theme.rgb}, 0.5)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '6px',
              borderRadius: '50%',
              background: `radial-gradient(circle, rgba(${theme.rgb}, 0.2) 0%, transparent 70%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.primary,
            }}
          >
            <Eye size={22} />
          </div>
        </div>
        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>{title}</div>
        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{subtitle}</div>
      </div>
    );
  }

  // 4. DEFAULT CARD VARIANT
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '18px',
          background: `rgba(${theme.rgb}, 0.12)`,
          border: `1px solid rgba(${theme.rgb}, 0.3)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.primary,
          marginBottom: '16px',
          boxShadow: `0 0 20px rgba(${theme.rgb}, 0.25)`,
        }}
      >
        <Activity size={24} style={{ animation: 'pulse 1.8s ease-in-out infinite' }} />
      </div>

      <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>
        {title}
      </h4>

      <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: 0, maxWidth: '340px', lineHeight: 1.5 }}>
        {subtitle}
      </p>
    </div>
  );
}

export default StateLoader;

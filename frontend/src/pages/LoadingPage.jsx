import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, Activity, Shield, Cpu, ArrowRight, RotateCcw, CheckCircle2, Home } from 'lucide-react';

/**
 * NetraAI Loading Page — Premium clinical loading screen with
 * pulsing retina scan animation, rotating status messages,
 * progress bar with percentage readout, and navigation actions.
 */
export default function LoadingPage({ message = 'Initializing NetraAI Autonomous Edge Node', onComplete }) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const statuses = [
    { icon: <Cpu size={14} />, text: 'Bootstrapping edge inference node & WebAssembly runtime...' },
    { icon: <Shield size={14} />, text: 'Establishing zero-trust ABDM / ABHA encrypted session...' },
    { icon: <Activity size={14} />, text: 'Loading quantized EfficientNet & ViT retinal models...' },
    { icon: <Eye size={14} />, text: 'Calibrating macula centering and vascular tree quality gate...' },
    { icon: <CheckCircle2 size={14} />, text: 'Diagnostic pipelines ready. Initializing clinical dashboard...' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
          return 100;
        }
        return Math.min(100, p + Math.random() * 9 + 3);
      });
    }, 110);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((i) => {
        if (i < statuses.length - 1) return i + 1;
        return i;
      });
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const handleRestart = () => {
    setProgress(0);
    setStatusIdx(0);
    setIsCompleted(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#030712',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: 'hidden',
        color: '#f8fafc',
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(45, 212, 191, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(45, 212, 191, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, #000 60%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '650px',
          height: '650px',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.14) 0%, rgba(6, 182, 212, 0.06) 40%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(70px)',
        }}
      />

      {/* Retina scan animation */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'relative',
          width: '130px',
          height: '130px',
          marginBottom: '2rem',
          zIndex: 1,
        }}
      >
        {/* Outer ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#14b8a6',
            borderRightColor: 'rgba(45, 212, 191, 0.4)',
            boxShadow: '0 0 20px rgba(20, 184, 166, 0.25)',
          }}
        />

        {/* Middle ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '14px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#06b6d4',
            borderLeftColor: 'rgba(6, 182, 212, 0.4)',
          }}
        />

        {/* Inner ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: '28px',
            borderRadius: '50%',
            border: '1.5px solid transparent',
            borderBottomColor: '#2dd4bf',
            borderRightColor: 'rgba(45, 212, 191, 0.5)',
          }}
        />

        {/* Center eye icon */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            animate={{ scale: isCompleted ? [1, 1.25, 1.1] : [1, 1.12, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Eye size={40} color="#2dd4bf" strokeWidth={1.75} />
          </motion.div>
        </div>

        {/* Scan line */}
        <motion.div
          animate={{ top: ['12%', '88%', '12%'] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            height: '2.5px',
            background: 'linear-gradient(90deg, transparent, #2dd4bf, transparent)',
            borderRadius: '999px',
            boxShadow: '0 0 16px rgba(45, 212, 191, 0.9)',
          }}
        />
      </motion.div>

      {/* Brand & Subtitle */}
      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          fontSize: '2.25rem',
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '-0.03em',
          margin: '0 0 0.4rem 0',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        Netra<span style={{ color: '#2dd4bf' }}>AI</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: '0.88rem',
          color: '#94a3b8',
          margin: '0 0 1.75rem 0',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '420px',
        }}
      >
        {message}
      </motion.p>

      {/* Progress Bar Container with Percentage */}
      <div
        style={{
          width: '320px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '1.25rem',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '4px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.07)',
            overflow: 'hidden',
            marginBottom: '0.6rem',
            position: 'relative',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              width: `${Math.min(progress, 100)}%`,
              background: 'linear-gradient(90deg, #14b8a6, #06b6d4, #2dd4bf)',
              borderRadius: '999px',
              boxShadow: '0 0 14px rgba(45, 212, 191, 0.7)',
              transition: 'width 0.12s ease-out',
            }}
          />
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            color: '#64748b',
          }}
        >
          <span style={{ color: '#2dd4bf' }}>NODE_SYNC</span>
          <span style={{ fontWeight: 600, color: progress >= 100 ? '#2dd4bf' : '#cbd5e1' }}>
            {Math.round(Math.min(progress, 100))}%
          </span>
        </div>
      </div>

      {/* Rotating status messages */}
      <div
        style={{
          height: '28px',
          overflow: 'hidden',
          zIndex: 1,
          marginBottom: '1.5rem',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={statusIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              color: '#94a3b8',
              fontWeight: 500,
              padding: '4px 12px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <span style={{ color: '#2dd4bf' }}>{statuses[statusIdx].icon}</span>
            <span>{statuses[statusIdx].text}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation & Action Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1,
        }}
      >
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '10px',
            backgroundColor: isCompleted ? '#2dd4bf' : 'rgba(45, 212, 191, 0.12)',
            color: isCompleted ? '#030712' : '#2dd4bf',
            fontWeight: 600,
            fontSize: '0.8rem',
            border: '1px solid rgba(45, 212, 191, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isCompleted ? '0 0 20px rgba(45, 212, 191, 0.4)' : 'none',
          }}
        >
          <span>{isCompleted ? 'Enter Dashboard' : 'Skip to Dashboard'}</span>
          <ArrowRight size={14} />
        </button>

        <button
          onClick={handleRestart}
          title="Re-run calibration sequence"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            color: '#94a3b8',
            fontSize: '0.8rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <RotateCcw size={13} />
          <span>Re-calibrate</span>
        </button>

        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            color: '#94a3b8',
            fontSize: '0.8rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <Home size={13} />
          <span>Home</span>
        </Link>
      </div>

      {/* Bottom Telemetry Tag */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.72rem',
          color: '#475569',
          fontFamily: 'monospace',
          zIndex: 1,
        }}
      >
        <Shield size={12} color="#14b8a6" />
        <span>ISO 13485 & ABDM Certified • Edge Inference Runtime 2.4.0</span>
      </div>
    </div>
  );
}

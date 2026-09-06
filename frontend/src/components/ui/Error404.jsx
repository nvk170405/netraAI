import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  ArrowLeft,
  Home,
  Compass,
  Activity,
  ShieldAlert,
  Eye,
  FileText,
  Stethoscope,
  Terminal,
  Volume2,
  VolumeX,
  RefreshCw,
  ChevronRight,
  Radar,
  Radio,
  ExternalLink
} from 'lucide-react';

/**
 * Error404 Component (React Bits Pro @reactbits-pro/404-7)
 * Radar-sweep 404 with sweep-synced contact pings, outline-mix numeral,
 * terminal diagnostic readout, live recovery routes, and inline search.
 * Styled with native CSS & inline design tokens for the NetraAI theme.
 */
export function Error404({ className = '' }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeContact, setActiveContact] = useState(null);
  const [currentDegree, setCurrentDegree] = useState(0);
  const searchInputRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Available clinical recovery routes in NetraAI
  const recoveryRoutes = [
    {
      path: '/dashboard',
      label: 'Primary Clinical Dashboard',
      category: 'Core',
      badge: 'Main',
      description: 'Active screenings, clinical triage queue, and daily metrics',
      icon: Home,
      accent: '#2dd4bf',
    },
    {
      path: '/screening/new',
      label: 'New Retinal Screening',
      category: 'Clinical',
      badge: 'Fast Track',
      description: 'Patient onboarding, bilateral fundus capture, and inference',
      icon: Eye,
      accent: '#06b6d4',
    },
    {
      path: '/screening/explain',
      label: 'Grad-CAM Explainability Hub',
      category: 'AI Diagnostics',
      badge: 'Vision AI',
      description: 'Visual saliency heatmaps highlighting microaneurysms and exudates',
      icon: Activity,
      accent: '#14b8a6',
    },
    {
      path: '/tele-ophthalmology',
      label: 'Tele-Ophthalmology Network',
      category: 'Telehealth',
      badge: 'Live Mesh',
      description: 'Direct specialist consults, second opinions, and referral tracking',
      icon: Stethoscope,
      accent: '#38bdf8',
    },
    {
      path: '/protocols',
      label: 'ICDR Grading Protocols',
      category: 'Guidelines',
      badge: 'Standard',
      description: 'International Clinical Diabetic Retinopathy 5-stage rules',
      icon: FileText,
      accent: '#818cf8',
    },
    {
      path: '/escalation',
      label: 'Urgent PDR Escalation Matrix',
      category: 'Emergency',
      badge: 'Urgent',
      description: 'High-risk proliferative retinopathy emergency protocols',
      icon: ShieldAlert,
      accent: '#f43f5e',
    },
    {
      path: '/assistant',
      label: 'AI Screening Assistant',
      category: 'Intelligence',
      badge: 'Copilot',
      description: 'Interactive clinical guidance and differential diagnostics',
      icon: Terminal,
      accent: '#10b981',
    },
    {
      path: '/doctor',
      label: 'Doctor Review Cockpit',
      category: 'Physician',
      badge: 'Doctor Only',
      description: 'Multi-patient verification and diagnostic sign-off',
      icon: Stethoscope,
      accent: '#c084fc',
    },
    {
      path: '/admin',
      label: 'System & Cluster Intelligence',
      category: 'Administration',
      badge: 'Admin',
      description: 'Node health, telemetry, model drift, and audit logs',
      icon: Compass,
      accent: '#fbbf24',
    },
    {
      path: '/loading',
      label: 'System Bootstrapping Node',
      category: 'System',
      badge: 'Telemetry',
      description: 'Clinical pipeline calibration and edge node monitor',
      icon: RefreshCw,
      accent: '#2dd4bf',
    },
  ];

  // Radar contact coordinates [angle in deg (0-360), distance % (25-85), label, severity]
  const radarContacts = [
    { id: 1, angle: 42, dist: 68, label: 'MISSING_ROUTE://404', status: 'CRITICAL', color: '#f43f5e' },
    { id: 2, angle: 135, dist: 45, label: 'GATEWAY_NODE://MIA', status: 'TIMEOUT', color: '#f59e0b' },
    { id: 3, angle: 220, dist: 78, label: 'RETINAL_SECTOR_07', status: 'UNREACHABLE', color: '#f43f5e' },
    { id: 4, angle: 305, dist: 35, label: 'HEALTH_MESH_PEER', status: 'STANDBY', color: '#2dd4bf' },
  ];

  // Radar rotation animation loop (5s per cycle)
  useEffect(() => {
    let animFrame;
    let startTime = performance.now();
    const duration = 5000;

    const tick = (now) => {
      const elapsed = now - startTime;
      const deg = ((elapsed % duration) / duration) * 360;
      setCurrentDegree(deg);
      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  // Web Audio synthesizer for radar beep / ping
  const playRadarPing = (freq = 880) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      console.warn('Audio ping error:', e);
    }
  };

  // Keyboard shortcut: '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter routes based on user query
  const filteredRoutes = useMemo(() => {
    if (!searchQuery.trim()) return recoveryRoutes.slice(0, 6);
    const q = searchQuery.toLowerCase();
    return recoveryRoutes.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.path.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div
      className={className}
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#030712',
        color: '#f8fafc',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: '4rem',
        overflowX: 'hidden',
      }}
    >
      {/* Background Matrix Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(45, 212, 191, 0.035) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(45, 212, 191, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 65% at 50% 40%, #000 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Atmospheric Glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '750px',
          height: '750px',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, rgba(6, 182, 212, 0.05) 45%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Bar */}
      <header
        style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
              padding: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(20, 184, 166, 0.3)',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#070e1e',
                borderRadius: '9px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Eye size={20} color="#2dd4bf" />
            </div>
          </div>
          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Netra<span style={{ color: '#2dd4bf' }}>AI</span>
            </span>
            <span
              style={{
                marginLeft: '8px',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.65rem',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(20, 184, 166, 0.12)',
                color: '#2dd4bf',
                border: '1px solid rgba(45, 212, 191, 0.25)',
              }}
            >
              Telemetry Node
            </span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Audio Synthesizer Ping Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playRadarPing(920);
            }}
            title={soundEnabled ? 'Mute Radar Ping' : 'Enable Radar Ping Synthesizer'}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: soundEnabled ? '1px solid rgba(45, 212, 191, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: soundEnabled ? 'rgba(20, 184, 166, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: soundEnabled ? '#2dd4bf' : '#94a3b8',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'monospace',
            }}
          >
            {soundEnabled ? <Volume2 size={14} color="#2dd4bf" /> : <VolumeX size={14} />}
            <span>AUDIO: {soundEnabled ? 'ONLINE' : 'MUTED'}</span>
          </button>

          {/* Quick Dashboard Button */}
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(45, 212, 191, 0.35)',
              backgroundColor: 'rgba(20, 184, 166, 0.12)',
              color: '#2dd4bf',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Home size={14} />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          width: '100%',
          maxWidth: '900px',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {/* ====================================================
            RADAR SCOPE + OUTLINE-MIX 404 NUMERAL HERO DISPLAY
            ==================================================== */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '440px',
            height: '440px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0.5rem 0 1.5rem 0',
            userSelect: 'none',
          }}
        >
          {/* Circular Radar Scope Chassis */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '1.5px solid rgba(45, 212, 191, 0.25)',
              overflow: 'hidden',
              backgroundColor: 'rgba(5, 13, 31, 0.85)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 0 50px -10px rgba(20, 184, 166, 0.25), inset 0 0 40px rgba(6, 182, 212, 0.08)',
            }}
          >
            {/* Concentric Distance Rings */}
            <div style={{ position: 'absolute', inset: '15%', borderRadius: '50%', border: '1px solid rgba(45, 212, 191, 0.15)' }} />
            <div style={{ position: 'absolute', inset: '30%', borderRadius: '50%', border: '1px dashed rgba(45, 212, 191, 0.2)' }} />
            <div style={{ position: 'absolute', inset: '45%', borderRadius: '50%', border: '1px solid rgba(45, 212, 191, 0.15)' }} />
            <div style={{ position: 'absolute', inset: '60%', borderRadius: '50%', border: '1px solid rgba(45, 212, 191, 0.2)' }} />
            <div style={{ position: 'absolute', inset: '75%', borderRadius: '50%', border: '1px solid rgba(45, 212, 191, 0.25)' }} />

            {/* Azimuth / Cardinal Crosshairs */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                width: '1px',
                background: 'linear-gradient(to bottom, rgba(45, 212, 191, 0.4), rgba(45, 212, 191, 0.1), rgba(45, 212, 191, 0.4))',
                transform: 'translateX(-50%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                height: '1px',
                background: 'linear-gradient(to right, rgba(45, 212, 191, 0.4), rgba(45, 212, 191, 0.1), rgba(45, 212, 191, 0.4))',
                transform: 'translateY(-50%)',
              }}
            />

            {/* 45 Degree Diagonal Rays */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                width: '1px',
                background: 'rgba(45, 212, 191, 0.08)',
                transform: 'translateX(-50%) rotate(45deg)',
                transformOrigin: 'center',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                width: '1px',
                background: 'rgba(45, 212, 191, 0.08)',
                transform: 'translateX(-50%) rotate(-45deg)',
                transformOrigin: 'center',
              }}
            />

            {/* Cardinal Degree Labels */}
            <span style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', fontFamily: 'monospace', color: 'rgba(45, 212, 191, 0.7)', letterSpacing: '0.1em' }}>000° N</span>
            <span style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', fontFamily: 'monospace', color: 'rgba(45, 212, 191, 0.7)', letterSpacing: '0.1em' }}>180° S</span>
            <span style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '9px', fontFamily: 'monospace', color: 'rgba(45, 212, 191, 0.7)', letterSpacing: '0.1em' }}>090° E</span>
            <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '9px', fontFamily: 'monospace', color: 'rgba(45, 212, 191, 0.7)', letterSpacing: '0.1em' }}>270° W</span>

            {/* Rotating Conic Radar Sweep Beam */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformOrigin: 'center',
                transform: `rotate(${currentDegree}deg)`,
                background: 'conic-gradient(from 0deg at 50% 50%, rgba(45, 212, 191, 0.32) 0deg, rgba(20, 184, 166, 0.08) 50deg, transparent 90deg, transparent 360deg)',
                pointerEvents: 'none',
              }}
            />

            {/* Leading Edge Glow Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: '50%',
                left: '50%',
                width: '2px',
                transformOrigin: 'bottom center',
                transform: `translateX(-50%) rotate(${currentDegree}deg)`,
                background: 'linear-gradient(to top, rgba(255, 255, 255, 0.95), #2dd4bf 60%, transparent)',
                boxShadow: '0 0 14px #2dd4bf, 0 0 28px rgba(45, 212, 191, 0.7)',
                pointerEvents: 'none',
              }}
            />

            {/* Sweep-Synced Contact Pings (Radar Blips) */}
            {radarContacts.map((contact) => {
              const angleDiff = (currentDegree - contact.angle + 360) % 360;
              const isBeingSwept = angleDiff >= 0 && angleDiff <= 40;
              const opacity = isBeingSwept ? 1 : Math.max(0.2, 1 - angleDiff / 160);

              const rad = (contact.angle - 90) * (Math.PI / 180);
              const r = contact.dist * 0.5;
              const x = 50 + r * Math.cos(rad);
              const y = 50 + r * Math.sin(rad);

              return (
                <div
                  key={contact.id}
                  onClick={() => {
                    setActiveContact(contact);
                    playRadarPing(contact.status === 'CRITICAL' ? 1200 : 720);
                  }}
                  title={`${contact.status}: ${contact.label}`}
                  style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: 25,
                  }}
                >
                  {/* Ripple pulse on sweep */}
                  {isBeingSwept && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 1 }}
                      animate={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: `1.5px solid ${contact.color}`,
                      }}
                    />
                  )}

                  {/* Core blip dot */}
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: contact.color,
                      opacity: opacity,
                      boxShadow: isBeingSwept
                        ? `0 0 16px ${contact.color}, 0 0 26px ${contact.color}`
                        : `0 0 6px ${contact.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ====================================================
              OUTLINE-MIX 404 NUMERAL OVERLAY
              ==================================================== */}
          <div
            style={{
              position: 'relative',
              zIndex: 15,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(5.5rem, 16vw, 9.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.05em',
                lineHeight: 1,
                margin: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {/* Digit 4 (Solid Cyan Gradient) */}
              <span
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #a5f3fc 45%, #2dd4bf 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 35px rgba(45, 212, 191, 0.55))',
                }}
              >
                4
              </span>

              {/* Digit 0 (Outline-Mix with Reticle Target) */}
              <span
                style={{
                  position: 'relative',
                  margin: '0 4px',
                  display: 'inline-block',
                  WebkitTextStroke: '4px #2dd4bf',
                  color: 'transparent',
                  filter: 'drop-shadow(0 0 30px rgba(45, 212, 191, 0.6))',
                }}
              >
                0
                {/* Center Reticle Point in 0 */}
                <span
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: '2px solid #2dd4bf',
                      boxShadow: '0 0 10px #2dd4bf',
                    }}
                  />
                </span>
              </span>

              {/* Digit 4 (Solid Teal to Cyan Sheen) */}
              <span
                style={{
                  background: 'linear-gradient(180deg, #99f6e4 0%, #2dd4bf 50%, #0891b2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 35px rgba(6, 182, 212, 0.55))',
                }}
              >
                4
              </span>
            </h1>
          </div>
        </div>

        {/* ====================================================
            TERMINAL DIAGNOSTIC READOUT
            ==================================================== */}
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            backgroundColor: 'rgba(8, 16, 32, 0.85)',
            border: '1px solid rgba(45, 212, 191, 0.25)',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(20, 184, 166, 0.08)',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Header with status lights */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.75rem',
              marginBottom: '0.75rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f43f5e', display: 'inline-block', boxShadow: '0 0 8px #f43f5e' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b', display: 'inline-block' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0', marginLeft: '6px' }}>
                NETRA_RADAR_DIAGNOSTICS
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: '#2dd4bf', opacity: 0.8 }}>
              LAT 28.6139° N / LON 77.2090° E
            </span>
          </div>

          {/* Diagnostic Log Lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#2dd4bf' }}>❯</span>
              <span style={{ color: '#64748b' }}>TELEMETRY:</span>
              <span style={{ color: '#fb7185', fontWeight: 600 }}>SIGNAL_LOST_IN_SECTOR_404</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: '#2dd4bf' }}>❯</span>
              <span style={{ color: '#64748b' }}>DIAGNOSIS:</span>
              <span>The requested clinical route or patient fundus record does not exist on this node.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#5eead4' }}>
              <span style={{ color: '#2dd4bf' }}>❯</span>
              <span style={{ color: '#64748b' }}>STATUS:</span>
              <span>LIVE_RECOVERY_ROUTING_ACTIVE</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '14px',
                  backgroundColor: '#2dd4bf',
                  marginLeft: '2px',
                }}
              />
            </div>
          </div>
        </div>

        {/* ====================================================
            INLINE ROUTE SEARCH BAR
            ==================================================== */}
        <div style={{ width: '100%', maxWidth: '680px', marginBottom: '1.75rem' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '14px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Search size={16} color="#2dd4bf" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clinical routes, patients, screening tools (Press '/' to focus)..."
              style={{
                width: '100%',
                padding: '12px 90px 12px 42px',
                backgroundColor: 'rgba(10, 19, 38, 0.9)',
                border: '1px solid rgba(45, 212, 191, 0.35)',
                borderRadius: '12px',
                fontSize: '0.88rem',
                color: '#ffffff',
                outline: 'none',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
              }}
            />

            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '12px',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '2px',
                  }}
                >
                  ✕
                </button>
              )}
              <kbd
                style={{
                  padding: '2px 8px',
                  borderRadius: '5px',
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  color: '#2dd4bf',
                  backgroundColor: 'rgba(20, 184, 166, 0.15)',
                  border: '1px solid rgba(45, 212, 191, 0.3)',
                }}
              >
                /
              </kbd>
            </div>
          </div>
        </div>

        {/* ====================================================
            LIVE RECOVERY ROUTES GRID
            ==================================================== */}
        <div style={{ width: '100%', maxWidth: '680px', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
              padding: '0 4px',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#cbd5e1',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Compass size={14} color="#2dd4bf" />
              Live Recovery Channels
            </span>
            <span style={{ fontSize: '0.72rem', color: '#2dd4bf', fontFamily: 'monospace' }}>
              {filteredRoutes.length} available
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '10px',
            }}
          >
            {filteredRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <div
                  key={route.path}
                  onClick={() => navigate(route.path)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(20, 184, 166, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.4)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        backgroundColor: `${route.accent}18`,
                        color: route.accent,
                        border: `1px solid ${route.accent}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2px',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
                          {route.label}
                        </span>
                        <span
                          style={{
                            padding: '1px 6px',
                            borderRadius: '4px',
                            fontSize: '0.62rem',
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            backgroundColor: `${route.accent}20`,
                            color: route.accent,
                          }}
                        >
                          {route.badge}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: '3px 0 0 0',
                          fontSize: '0.74rem',
                          color: '#94a3b8',
                          lineHeight: 1.4,
                        }}
                      >
                        {route.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={14} color="#64748b" style={{ marginTop: '6px', flexShrink: 0 }} />
                </div>
              );
            })}
          </div>

          {filteredRoutes.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                backgroundColor: 'rgba(255, 255, 255, 0.01)',
              }}
            >
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 8px 0' }}>
                No matching clinical routes found for &ldquo;<span style={{ color: '#2dd4bf' }}>{searchQuery}</span>&rdquo;
              </p>
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2dd4bf',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear query & show all routes
              </button>
            </div>
          )}
        </div>

        {/* ====================================================
            PRIMARY RECOVERY ACTIONS (BUTTONS)
            ==================================================== */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              fontSize: '0.8rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <ArrowLeft size={14} />
            <span>Previous Station</span>
          </button>

          <button
            onClick={() => navigate('/screening/new')}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(90deg, #14b8a6, #06b6d4)',
              border: 'none',
              color: '#020617',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(20, 184, 166, 0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            <Eye size={15} />
            <span>Launch Retinal Screening</span>
          </button>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              fontSize: '0.8rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <RefreshCw size={13} />
            <span>Re-calibrate Radar</span>
          </button>
        </div>

        {/* ====================================================
            ACTIVE CONTACT MODAL / DETAILS DRAWER IF CLICKED
            ==================================================== */}
        <AnimatePresence>
          {activeContact && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                maxWidth: '340px',
                width: '100%',
                padding: '14px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(45, 212, 191, 0.4)',
                backgroundColor: 'rgba(7, 15, 32, 0.95)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.8)',
                zIndex: 50,
                fontSize: '0.75rem',
                fontFamily: 'monospace',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '8px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontWeight: 700 }}>
                  <Radar size={14} color="#2dd4bf" />
                  CONTACT_ANALYSIS
                </span>
                <button
                  onClick={() => setActiveContact(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ margin: '10px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>IDENTIFIER:</span>
                  <span style={{ color: '#2dd4bf' }}>{activeContact.label}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>BEARING:</span>
                  <span>{activeContact.angle}° AZIMUTH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>RANGE:</span>
                  <span>{activeContact.dist}% APERTURE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>HEALTH_STATE:</span>
                  <span style={{ color: activeContact.color, fontWeight: 700 }}>{activeContact.status}</span>
                </div>
              </div>

              <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setActiveContact(null);
                    navigate('/dashboard');
                  }}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(20, 184, 166, 0.2)',
                    color: '#2dd4bf',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                  }}
                >
                  Engage Recovery
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Telemetry */}
      <footer
        style={{
          width: '100%',
          padding: '1.5rem 0',
          marginTop: 'auto',
          textAlign: 'center',
          fontSize: '0.72rem',
          color: '#475569',
          fontFamily: 'monospace',
          zIndex: 10,
        }}
      >
        NetraAI Autonomous Clinical Grid • ICDR Tele-Triage Node • Error Code: 0x404_ROUTE_UNDEFINED
      </footer>
    </div>
  );
}

export default Error404;

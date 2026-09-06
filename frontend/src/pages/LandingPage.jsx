import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Sparkles,
  ArrowRight,
  MoreVertical,
  Plus,
  ChevronDown,
  Globe,
  Heart,
  Activity,
  CheckCircle2,
  Shield,
  Zap,
  CreditCard,
  ChevronRight,
  Stethoscope,
  FileText,
  AlertTriangle,
  WifiOff,
  UserCheck,
  Cpu,
  BarChart2,
} from 'lucide-react';

import HeroBackground from '../components/landing/HeroBackground';
import ConnectorLines from '../components/landing/ConnectorLines';
import ShinyButton from '../components/ui/ShinyButton';
import CenterFlow from '../components/ui/CenterFlow';
import SimpleGraph from '../components/ui/SimpleGraph';
import Faq9 from '../components/ui/Faq9';
import Footer4 from '../components/ui/Footer4';

import ScreeningWorkflowModal from '../components/landing/modals/ScreeningWorkflowModal';
import AITriageModal from '../components/landing/modals/AITriageModal';
import UrgentReferralModal from '../components/landing/modals/UrgentReferralModal';
import DRStagesModal from '../components/landing/modals/DRStagesModal';
import NewPatientModal from '../components/landing/modals/NewPatientModal';
import LiveToastNotifications from '../components/landing/modals/LiveToastNotifications';

export default function LandingPage() {
  const navigate = useNavigate();

  // Modal states for pop-up animations
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showStagesModal, setShowStagesModal] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState('Eng');

  // GSAP animation refs
  const headerRef = useRef(null);
  const badgeRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const centerCardRef = useRef(null);
  const leftPillRef = useRef(null);
  const rightPillRef = useRef(null);
  const balanceValRef = useRef(null);

  // Digital HealthPass 3D tilt
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });

  // Initialize Lenis for smooth momentum scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // GSAP Entrance Timeline & Number Counter
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Header drop down
      if (headerRef.current) {
        tl.from(headerRef.current, { y: -25, opacity: 0, duration: 0.8 });
      }

      // Safe and easy tools badge
      if (badgeRef.current) {
        tl.from(badgeRef.current, { scale: 0.7, opacity: 0, duration: 0.6 }, '-=0.4');
      }

      // Headline reveal
      if (title1Ref.current && title2Ref.current) {
        tl.from([title1Ref.current, title2Ref.current], {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: 'power4.out',
        }, '-=0.3');
      }

      // Subtitle
      if (subtitleRef.current) {
        tl.from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.7 }, '-=0.5');
      }

      // CTA Button pop in
      if (ctaRef.current) {
        tl.from(ctaRef.current, { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.8)' }, '-=0.4');
      }

      // Bottom cards emergence
      if (centerCardRef.current) {
        tl.from(centerCardRef.current, { y: 60, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.3');
      }

      if (leftPillRef.current && rightPillRef.current) {
        tl.from([leftPillRef.current, rightPillRef.current], {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
        }, '-=0.6');
      }

      // Animated Number Counter for 5,237 Scans Screened
      const counterObj = { val: 0 };
      if (balanceValRef.current) {
        tl.to(
          counterObj,
          {
            val: 5237,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              if (balanceValRef.current) {
                balanceValRef.current.textContent = `${Math.floor(counterObj.val).toLocaleString()} Scans`;
              }
            },
          },
          '-=0.8'
        );
      }

      // Subtle continuous idle float on the center card
      if (centerCardRef.current) {
        gsap.to(centerCardRef.current, {
          y: '-=6',
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Idle float for left & right pill
      if (leftPillRef.current) {
        gsap.to(leftPillRef.current, {
          y: '+=5',
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.5,
        });
      }
      if (rightPillRef.current) {
        gsap.to(rightPillRef.current, {
          y: '+=5',
          duration: 3.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.8,
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // HealthPass Mouse Tilt Effect
  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCardTilt({ x: x * 15, y: -y * 15 });
  };

  const handleCardMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  return (
    <div
      style={{
        backgroundColor: '#030712',
        color: '#FFFFFF',
        minHeight: '100vh',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── TOP PRESENTATION BAR (SIH 2026 / Tekathon 5.0 Header) ── */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.25rem 2.5rem 0.5rem 2.5rem',
          fontSize: '0.8rem',
          letterSpacing: '0.06em',
          fontWeight: 600,
          color: '#94a3b8',
          maxWidth: '1440px',
          margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '12px',
              height: '14px',
              background: '#14b8a6',
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)',
            }}
          />
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2dd4bf' }}>
            PROBLEM STATEMENT 26038
          </span>
          <span style={{ color: '#334155' }}>|</span>
          <span style={{ color: '#cbd5e1' }}>MEDTECH • SMART INDIA HACKATHON 2026</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(20, 184, 166, 0.12)',
              padding: '4px 12px',
              borderRadius: '999px',
              border: '1px solid rgba(45, 212, 191, 0.28)',
              color: '#5eead4',
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            <span>DECISION SUPPORT TOOL • NON-CLINICAL REPLACEMENT</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>NETRA-AI</span>
            <Heart size={14} fill="#14b8a6" color="#14b8a6" />
          </div>
        </div>
      </header>

      {/* ── MAIN SHOWCASE CONTAINER (Hero Window Frame with Grid + Bluish-Green Glow Background) ── */}
      <main
        style={{
          maxWidth: '1360px',
          margin: '0 auto 4rem auto',
          padding: '0 1.25rem',
        }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: '28px',
            background: '#040914',
            border: '1px solid rgba(45, 212, 191, 0.22)',
            boxShadow: '0 30px 80px -20px rgba(0, 0, 0, 0.9), 0 0 50px rgba(20, 184, 166, 0.08)',
            overflow: 'hidden',
            minHeight: '820px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Hospital-themed Bluish-Green Radial Spotlight + Technical Grid + Noise Canvas */}
          <HeroBackground />

          {/* ── INNER APP HEADER / NAVBAR ── */}
          <div
            ref={headerRef}
            style={{
              position: 'relative',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.75rem 2.5rem',
            }}
          >
            {/* Brand Logo */}
            <div
              onClick={() => navigate('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.35), rgba(6, 182, 212, 0.15))',
                  border: '1px solid rgba(45, 212, 191, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2dd4bf',
                  filter: 'drop-shadow(0 0 10px rgba(20, 184, 166, 0.6))',
                }}
              >
                <Eye size={18} />
              </div>
              <div>
                <span
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                  }}
                >
                  Netra<span style={{ color: '#2dd4bf' }}>AI</span>
                </span>
              </div>
            </div>

            {/* Central Navigation Pills */}
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.4rem',
                padding: '0.45rem 1.4rem',
                borderRadius: '999px',
                background: 'rgba(8, 20, 32, 0.55)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(45, 212, 191, 0.15)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              {[
                { label: 'Screening', id: 'workflow' },
                { label: 'Architecture', id: 'architecture' },
                { label: 'Accuracy Graph', id: 'accuracy' },
                { label: 'Tele-Ophthalmology', id: 'tele' },
                { label: 'Reports', id: 'reports' },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={`#${item.id}`}
                  style={{
                    color: idx === 0 ? '#FFFFFF' : '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#2dd4bf')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = idx === 0 ? '#FFFFFF' : '#94a3b8')}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right Action Items */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Language Selector Pill */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '999px',
                    background: 'rgba(8, 20, 32, 0.6)',
                    border: '1px solid rgba(45, 212, 191, 0.2)',
                    color: '#cbd5e1',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.5)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.2)')}
                >
                  <Globe size={13} color="#2dd4bf" />
                  <span>{currentLang}</span>
                  <ChevronDown size={13} />
                </button>

                {showLangMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: 'rgba(8, 24, 38, 0.96)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(45, 212, 191, 0.25)',
                      borderRadius: '12px',
                      padding: '4px',
                      minWidth: '120px',
                      zIndex: 50,
                      boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
                    }}
                  >
                    {[
                      { code: 'Eng', name: 'English' },
                      { code: 'हिंदी', name: 'Hindi' },
                      { code: 'தமிழ்', name: 'Tamil' },
                      { code: 'తెలుగు', name: 'Telugu' },
                      { code: 'বাংলা', name: 'Bengali' },
                    ].map((lang) => (
                      <div
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code);
                          setShowLangMenu(false);
                        }}
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.8rem',
                          color: currentLang === lang.code ? '#2dd4bf' : '#cbd5e1',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          backgroundColor: currentLang === lang.code ? 'rgba(20, 184, 166, 0.15)' : 'transparent',
                        }}
                      >
                        {lang.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* New Screening / Launch App Button */}
              <motion.button
                whileHover={{ scale: 1.04, borderColor: 'rgba(45, 212, 191, 0.6)' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowWorkflowModal(true)}
                style={{
                  padding: '0.45rem 1.15rem',
                  borderRadius: '999px',
                  background: 'rgba(20, 184, 166, 0.15)',
                  border: '1px solid rgba(45, 212, 191, 0.4)',
                  color: '#2dd4bf',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s, box-shadow 0.2s',
                  boxShadow: '0 2px 12px rgba(20, 184, 166, 0.15)',
                }}
              >
                Launch NetraAI
              </motion.button>
            </div>
          </div>

          {/* ── HERO CONTENT ── */}
          <div
            style={{
              position: 'relative',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '2.25rem 1.5rem 0 1.5rem',
              flex: 1,
            }}
          >
            {/* Pill Tag: "AI Decision Support • Rural Healthcare Platform" */}
            <div
              ref={badgeRef}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.4rem 1.15rem',
                borderRadius: '999px',
                background: 'rgba(20, 184, 166, 0.12)',
                border: '1px solid rgba(45, 212, 191, 0.35)',
                boxShadow: '0 0 25px rgba(20, 184, 166, 0.2)',
                color: '#5eead4',
                fontSize: '0.82rem',
                fontWeight: 600,
                marginBottom: '1.75rem',
                cursor: 'pointer',
              }}
              onClick={() => setShowWorkflowModal(true)}
            >
              <Sparkles size={14} color="#2dd4bf" />
              <span>AI Decision Support • Rural Healthcare Platform</span>
            </div>

            {/* Massive Display Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.75rem, 5.5vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                margin: '0 0 1.25rem 0',
                color: '#FFFFFF',
                maxWidth: '920px',
              }}
            >
              <div ref={title1Ref}>The Next Era of</div>
              <div ref={title2Ref} style={{ color: '#FFFFFF' }}>
                Retinal AI Screening
              </div>
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.6,
                color: '#cbd5e1',
                maxWidth: '620px',
                margin: '0 0 2rem 0',
                fontWeight: 400,
              }}
            >
              Early detection of diabetic retinopathy in rural India. Instant fundus image analysis,
              localized Grad-CAM heatmaps, bilingual reports, and seamless tele-ophthalmology referral.
            </p>

            {/* 🌟 SHINY CTA BUTTON ("Start Patient Screening") */}
            <div ref={ctaRef}>
              <ShinyButton onClick={() => setShowWorkflowModal(true)}>
                <span>Start Patient Screening</span>
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#14b8a6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                  }}
                >
                  <ArrowRight size={14} strokeWidth={2.5} />
                </div>
              </ShinyButton>
            </div>

            {/* ── HERO BOTTOM INTERACTIVE CARDS & CONNECTORS ── */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '1080px',
                marginTop: '3.5rem',
                paddingBottom: '2.5rem',
                minHeight: '260px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}
            >
              {/* Dynamic SVG Neon Connector Lines */}
              <ConnectorLines />

              {/* ── LEFT FLOATING PILL: Instant AI Triage ── */}
              <motion.div
                ref={leftPillRef}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowTriageModal(true)}
                style={{
                  position: 'absolute',
                  left: '2%',
                  bottom: '52px',
                  zIndex: 15,
                  padding: '0.75rem 1.25rem',
                  borderRadius: '16px',
                  background: 'rgba(8, 24, 38, 0.88)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(45, 212, 191, 0.35)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(20, 184, 166, 0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  userSelect: 'none',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        display: 'inline-block',
                      }}
                    />
                    <span>Instant AI Triage</span>
                  </div>
                  <div
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      marginTop: '2px',
                    }}
                  >
                    Grade 0 • 98.4%
                  </div>
                </div>

                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: '#10b981',
                  }}
                >
                  <CheckCircle2 size={15} />
                </div>
              </motion.div>

              {/* ── CENTER MAIN GLASSMORPHIC CARD: Retinal Screening Terminal ── */}
              <motion.div
                ref={centerCardRef}
                style={{
                  position: 'relative',
                  zIndex: 12,
                  width: '100%',
                  maxWidth: '540px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(8, 24, 38, 0.94) 0%, rgba(4, 14, 24, 0.96) 100%)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(45, 212, 191, 0.28)',
                  boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 40px rgba(20, 184, 166, 0.14)',
                  padding: '1.5rem 1.75rem',
                  textAlign: 'left',
                }}
              >
                {/* Center Card Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                  }}
                >
                  <h3
                    onClick={() => setShowStagesModal(true)}
                    style={{
                      margin: 0,
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      letterSpacing: '-0.01em',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Retinal Screening Terminal</span>
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {/* 5 DR Stages pill */}
                    <button
                      onClick={() => setShowStagesModal(true)}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: 'rgba(20, 184, 166, 0.15)',
                        border: '1px solid rgba(45, 212, 191, 0.35)',
                        color: '#5eead4',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      5 DR Stages
                    </button>

                    {/* + Add Patient button */}
                    <button
                      onClick={() => setShowNewPatientModal(true)}
                      title="New Patient Registration"
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(20, 184, 166, 0.35)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')}
                    >
                      <Plus size={14} />
                    </button>

                    {/* More options button */}
                    <button
                      onClick={() => setShowStagesModal(true)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <MoreVertical size={14} />
                    </button>
                  </div>
                </div>

                {/* Center Card Body: Metrics on left, Digital HealthPass on right */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: '1.25rem',
                    alignItems: 'center',
                  }}
                >
                  {/* Left: Screening Volume & Accuracy */}
                  <div>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <span>Clinical Triage Volume</span>
                      <span style={{ color: '#2dd4bf', fontWeight: 600 }}>98.4% AUROC</span>
                    </div>

                    <div
                      ref={balanceValRef}
                      style={{
                        fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        color: '#FFFFFF',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      5,237 Scans
                    </div>
                  </div>

                  {/* Right: Glowing 3D Digital HealthPass */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowStagesModal(true)}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    style={{
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #0369a1 100%)',
                      padding: '1rem',
                      color: '#FFFFFF',
                      boxShadow: '0 12px 25px -4px rgba(20, 184, 166, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      transform: `perspective(600px) rotateY(${cardTilt.x}deg) rotateX(${cardTilt.y}deg)`,
                      transition: 'transform 0.15s ease-out',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                    }}
                  >
                    {/* Glass sheen overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '-30%',
                        left: '-30%',
                        width: '160%',
                        height: '160%',
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, transparent 65%)',
                        pointerEvents: 'none',
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.95 }}>
                        Digital HealthPass
                      </span>
                      {/* Microchip icon */}
                      <div
                        style={{
                          width: '18px',
                          height: '14px',
                          borderRadius: '3px',
                          background: 'linear-gradient(135deg, #fcd34d, #d97706)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        opacity: 0.9,
                      }}
                    >
                      •••• 2629 • Grade 0
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* ── RIGHT FLOATING PILL: Urgent Referral ── */}
              <motion.div
                ref={rightPillRef}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowReferralModal(true)}
                style={{
                  position: 'absolute',
                  right: '2%',
                  bottom: '52px',
                  zIndex: 15,
                  padding: '0.75rem 1.25rem',
                  borderRadius: '16px',
                  background: 'rgba(24, 16, 26, 0.88)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(239, 68, 68, 0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  userSelect: 'none',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#ef4444',
                        display: 'inline-block',
                      }}
                    />
                    <span>Urgent Referral</span>
                  </div>
                  <div
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      marginTop: '2px',
                    }}
                  >
                    Severe PDR • 48h
                  </div>
                </div>

                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: '#ef4444',
                  }}
                >
                  <AlertTriangle size={14} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* ── FEATURES SECTION WITH CENTER-FLOW & SIMPLE-GRAPH ── */}
      {/* ── FEATURES SECTION WITH CENTER-FLOW & SIMPLE-GRAPH ── */}
      <section
        id="architecture"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '5rem 2rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 14px',
              borderRadius: '999px',
              background: 'rgba(20, 184, 166, 0.12)',
              color: '#2dd4bf',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            ARCHITECTURE & CLINICAL BENCHMARKS
          </div>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              margin: '0 0 1rem 0',
              color: '#FFFFFF',
            }}
          >
            "See the risk. Understand the reason. Take action."
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
            Powered by a radial multi-task deep learning pipeline and validated across 5,237 rural fundus scans.
          </p>
        </div>

        {/* 🌟 REACT BITS VERTICALLY STACKED EXPANDED SHOWCASE (Borderless & Full Width) 🌟 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6rem',
            width: '100%',
            marginBottom: '6rem',
          }}
        >
          {/* Section 1: CenterFlow Radial Multi-Task Pipeline */}
          <div
            id="centerflow-architecture"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              padding: '0',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: 'rgba(20, 184, 166, 0.12)',
                  color: '#2dd4bf',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.5rem',
                }}
              >
                Radial Pipeline
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.85rem', fontWeight: 800, color: '#FFFFFF' }}>
                Center-Flow Multi-Task Architecture
              </h3>
              <p style={{ margin: '0 auto', fontSize: '0.95rem', color: '#94a3b8', maxWidth: '620px', lineHeight: 1.6 }}>
                A centralized Vision Transformer and EfficientNet-B0 core orchestrating real-time telemetry across 6 specialized clinical channels.
              </p>
            </div>

            {/* Expansive Center Flow Component */}
            <CenterFlow
              centerLabel="NetraAI Vision Core"
              centerSub="EfficientNet-B0 + ViT"
              glowColor="#14b8a6"
            />
          </div>

          {/* Section 2: SimpleGraph Diagnostic Sensitivity (Much Smaller & Compact) */}
          <div
            id="accuracy"
            style={{
              width: '100%',
              maxWidth: '680px',
              margin: '0 auto',
              background: 'transparent',
              border: 'none',
              boxShadow: 'none',
              padding: '0',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: 'rgba(20, 184, 166, 0.12)',
                    color: '#2dd4bf',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '0.35rem',
                  }}
                >
                  Clinical Validation
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Simple-Graph Diagnostic Sensitivity Matrix
                </h3>
              </div>

              <div
                style={{
                  padding: '5px 12px',
                  borderRadius: '999px',
                  background: 'rgba(20, 184, 166, 0.15)',
                  border: '1px solid rgba(45, 212, 191, 0.35)',
                  color: '#5eead4',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Activity size={14} />
                <span>Overall AUROC: 0.984</span>
              </div>
            </div>

            {/* Much Smaller Compact Simple Graph Component */}
            <SimpleGraph
              lineColor="#2dd4bf"
              fillColor="#14b8a6"
            />

            {/* Summary Statistics Mini-Row (4 Compact Columns) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem',
                marginTop: '1.25rem',
                textAlign: 'center',
              }}
            >
              <div style={{ padding: '0.65rem 0.5rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '2px' }}>Cohort Size</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>5,237</div>
              </div>
              <div style={{ padding: '0.65rem 0.5rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '2px' }}>PDR Recall</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>99.6%</div>
              </div>
              <div style={{ padding: '0.65rem 0.5rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '2px' }}>False Neg.</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#2dd4bf' }}>&lt; 0.8%</div>
              </div>
              <div style={{ padding: '0.65rem 0.5rem', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '2px' }}>Latency</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>1.4s</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Column Pillar Feature Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4rem',
          }}
        >
          {[
            {
              icon: <Eye size={22} color="#2dd4bf" />,
              title: 'Grad-CAM Visual Heatmaps',
              desc: 'Explains AI severity by highlighting exact pathological regions: Microaneurysms, Hemorrhages, and Hard Exudates on the fundus image.',
              badge: 'Transparent & Explainable',
            },
            {
              icon: <WifiOff size={22} color="#06b6d4" />,
              title: 'Rural Offline-First Capability',
              desc: 'Full on-device screening with IndexedDB caching when mobile connectivity drops. Automatically synchronizes when back online.',
              badge: 'Zero Network Required',
            },
            {
              icon: <UserCheck size={22} color="#38bdf8" />,
              title: 'Tele-Ophthalmology Triage',
              desc: 'Instantly routes high-risk cases (Severe NPDR & PDR) to district hospital eye specialists with structured clinical findings.',
              badge: 'Specialist Escalation',
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, borderColor: 'rgba(45, 212, 191, 0.45)' }}
              style={{
                borderRadius: '20px',
                background: 'rgba(8, 20, 34, 0.65)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(45, 212, 191, 0.15)',
                padding: '2rem',
                transition: 'all 0.25s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: 'rgba(20, 184, 166, 0.12)',
                    color: '#2dd4bf',
                  }}
                >
                  {card.badge}
                </span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>{card.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── QUICK PORTAL DIRECT ACCESS BANNER ── */}
        <div
          style={{
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.14) 0%, rgba(6, 182, 212, 0.18) 100%)',
            border: '1px solid rgba(45, 212, 191, 0.35)',
            padding: '2.5rem 3rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 800 }}>
              Launch NetraAI Interactive Prototype
            </h3>
            <p style={{ margin: 0, color: '#cbd5e1', maxWidth: '520px', fontSize: '0.92rem' }}>
              Experience the complete screening pipeline: Health Worker capture, Doctor specialist
              verification with Grad-CAM heatmap, and Chief Medical Officer analytics.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/login')}
              style={{
                padding: '0.85rem 1.6rem',
                borderRadius: '12px',
                background: '#FFFFFF',
                color: '#030712',
                fontWeight: 700,
                fontSize: '0.92rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 15px rgba(255, 255, 255, 0.25)',
              }}
            >
              <span>Enter Clinical Workspace</span>
              <ChevronRight size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowWorkflowModal(true)}
              style={{
                padding: '0.85rem 1.6rem',
                borderRadius: '12px',
                background: 'rgba(20, 184, 166, 0.15)',
                border: '1px solid rgba(45, 212, 191, 0.35)',
                color: '#5eead4',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: 'pointer',
              }}
            >
              Explore Demo Cases
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── REACT BITS PRO FAQ-9 COMPONENT (Below Features Section) ── */}
      <Faq9 onOpenReferralModal={() => setShowReferralModal(true)} />

      {/* ── REACT BITS PRO FOOTER-4 COMPONENT ── */}
      <Footer4 onOpenModal={() => setShowWorkflowModal(true)} />

      {/* ── CLINICAL POP-UP MODALS (Framer Motion spring pop-up animations) ── */}
      <ScreeningWorkflowModal
        isOpen={showWorkflowModal}
        onClose={() => setShowWorkflowModal(false)}
      />
      <AITriageModal
        isOpen={showTriageModal}
        onClose={() => setShowTriageModal(false)}
      />
      <UrgentReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
      />
      <DRStagesModal
        isOpen={showStagesModal}
        onClose={() => setShowStagesModal(false)}
        onNewScreening={() => {
          setShowStagesModal(false);
          setShowNewPatientModal(true);
        }}
      />
      <NewPatientModal
        isOpen={showNewPatientModal}
        onClose={() => setShowNewPatientModal(false)}
      />

      {/* Real-time clinical pop-up notifications */}
      <LiveToastNotifications />
    </div>
  );
}

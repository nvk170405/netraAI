import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { RECENT_SCREENINGS } from '../../data/mockData';
import { screeningsApi, checkBackendHealth } from '../../services/api';

// Dashboard Components
import PillBatteryMeter from '../../components/dashboard/PillBatteryMeter';
import RetinaAnatomyViewer from '../../components/dashboard/RetinaAnatomyViewer';
import CapsuleBarChart from '../../components/dashboard/CapsuleBarChart';
import DoctorReviewCard from '../../components/dashboard/DoctorReviewCard';
import ActivityGridMatrix from '../../components/dashboard/ActivityGridMatrix';

// Icons
import {
  Plus,
  Eye,
  Sparkles,
  Search,
  ArrowUpRight,
  ChevronRight,
  Radio,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wifi,
  WifiOff,
  Flame,
  Filter,
  BarChart3,
  Layers,
  Zap
} from 'lucide-react';

const FILTER_TABS = [
  { id: 'all', label: 'All Screenings', count: '2,482' },
  { id: 'camps', label: 'Field Camps', count: '142' },
  { id: 'grade0', label: 'Grade 0 Normal', count: '1,641' },
  { id: 'grade1', label: 'Grade 1 Mild', count: '392' },
  { id: 'grade2', label: 'Grade 2 Mod', count: '298' },
  { id: 'grade3', label: 'Grade 3 Severe', count: '117' },
  { id: 'grade4', label: 'Grade 4 PDR', count: '34' },
  { id: 'urgent', label: 'Urgent Referrals', count: '18', urgent: true },
  { id: 'offline', label: 'Offline Queue', count: '3' }
];

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');
  const [mainView, setMainView] = useState('anatomy'); // 'anatomy' | 'chart'
  const [searchQuery, setSearchQuery] = useState('');
  const [screenings, setScreenings] = useState(RECENT_SCREENINGS);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch live screenings from SQLite backend
  const loadScreenings = async () => {
    setIsLoading(true);
    try {
      const data = await screeningsApi.getRecent(30);
      if (data && data.length > 0) {
        setScreenings(data);
      }
      const healthy = await checkBackendHealth();
      setIsDbConnected(healthy);
    } catch (e) {
      console.warn('Could not load live screenings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadScreenings();
  }, []);

  // Filter screenings based on tab and search
  const filteredScreenings = screenings.filter((item) => {
    const matchesSearch =
      (item.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.patientId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.result || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'grade0') return item.result.includes('No DR');
    if (activeTab === 'grade1') return item.result.includes('Mild');
    if (activeTab === 'grade2') return item.result.includes('Moderate');
    if (activeTab === 'grade3') return item.result.includes('Severe');
    if (activeTab === 'urgent') return item.status === 'referral' || item.riskLevel === 'high';
    if (activeTab === 'offline') return item.status === 'review';
    return true;
  });

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
      case 'moderate':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      case 'high':
      case 'urgent':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' };
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
      {/* Background ambient medical glows */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          width: '500px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(20, 184, 166, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '300px',
          right: '5%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.10) 0%, transparent 70%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1440px', margin: '0 auto' }}>
        {/* ============================================================ */}
        {/* 1. EXPRESSIVE HEADER (Inspired by Image 2)                    */}
        {/* ============================================================ */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '28px'
          }}
        >
          <div>
            {/* Title with inline icon badges */}
            <motion.h1
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <span>Screening</span>

              {/* Eye lens inline badge */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.25), rgba(6, 182, 212, 0.15))',
                  border: '1.5px solid rgba(45, 212, 191, 0.45)',
                  boxShadow: '0 0 15px rgba(20, 184, 166, 0.3)',
                  fontSize: '0.65em',
                  verticalAlign: 'middle'
                }}
              >
                <Eye size={18} color="#2dd4bf" />
                <span style={{ color: '#5eead4', fontWeight: 700 }}>DR-5 AI</span>
              </span>

              <span>Rural Field Camps &</span>

              {/* Sparkles inline badge */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(14, 165, 233, 0.15))',
                  border: '1.5px solid rgba(56, 189, 248, 0.45)',
                  boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)',
                  fontSize: '0.65em',
                  verticalAlign: 'middle'
                }}
              >
                <Sparkles size={18} color="#38bdf8" />
                <span style={{ color: '#7dd3fc', fontWeight: 700 }}>Grad-CAM Triage</span>
              </span>
            </motion.h1>

            {/* Subtitle with live pulse */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '10px',
                fontSize: '0.88rem',
                color: '#94a3b8'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 10px #10b981'
                  }}
                />
                <span style={{ color: '#2dd4bf', fontWeight: 600 }}>Active Camp Session:</span>
                <span>Barwani & Khandwa Mobile Triage Hub</span>
              </div>
              <span style={{ color: '#475569' }}>•</span>
              <span>Logged in as <strong>{user?.name || 'Anjali Sharma'}</strong></span>
              <span style={{ color: '#475569' }}>•</span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '100px',
                  background: isDbConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  border: isDbConnected ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
                  color: isDbConnected ? '#34d399' : '#fbbf24',
                  fontSize: '0.72rem',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: isDbConnected ? '#10b981' : '#f59e0b',
                    boxShadow: isDbConnected ? '0 0 8px #10b981' : 'none',
                  }}
                />
                {isDbConnected ? 'SQLite Live (:8000)' : 'Local Fallback'}
              </span>
            </motion.div>
          </div>

          {/* Quick Actions & Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  color: '#64748b',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient ID, name, or village..."
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(20, 184, 166, 0.25)',
                  borderRadius: '100px',
                  padding: '10px 16px 10px 38px',
                  fontSize: '0.82rem',
                  color: '#f8fafc',
                  outline: 'none',
                  width: '260px',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2dd4bf';
                  e.target.style.boxShadow = '0 0 15px rgba(45, 212, 191, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(20, 184, 166, 0.25)';
                  e.target.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.4)';
                }}
              />
            </div>

            {/* Sync Database Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadScreenings}
              title="Sync with SQLite Database"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                borderRadius: '100px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Zap size={14} color={isDbConnected ? '#34d399' : '#f59e0b'} />
              <span>Sync DB</span>
            </motion.button>

            {/* + New Retinal Scan CTA Button */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(20, 184, 166, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/screening/new')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '100px',
                background: 'linear-gradient(135deg, #14b8a6, #0891b2)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(20, 184, 166, 0.35)'
              }}
            >
              <Plus size={16} strokeWidth={3} />
              + New Retinal Scan
            </motion.button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. SEGMENTED FILTER PILL BAR (Image 2 style)                 */}
        {/* ============================================================ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '24px',
            scrollbarWidth: 'none'
          }}
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '100px',
                  background: isActive ? 'rgba(20, 184, 166, 0.2)' : 'rgba(15, 23, 42, 0.5)',
                  border: isActive
                    ? '1.5px solid #2dd4bf'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isActive ? '0 0 15px rgba(45, 212, 191, 0.25)' : 'none',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '100px',
                    background: tab.urgent
                      ? 'rgba(239, 68, 68, 0.25)'
                      : isActive
                      ? 'rgba(45, 212, 191, 0.3)'
                      : 'rgba(255, 255, 255, 0.06)',
                    color: tab.urgent ? '#f87171' : isActive ? '#5eead4' : '#64748b',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  {tab.count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* 3. TOP 3 METRIC CARDS (Image 2 style with PillBatteryMeter) */}
        {/* ============================================================ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            marginBottom: '28px'
          }}
        >
          {/* Card 1: Camp Screening Operations */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(20, 184, 166, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>
                  Camp Operations Target
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontWeight: 600
                  }}
                >
                  +18.4% this week
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  780
                </span>
                <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 600 }}>/ 1,000 Scans</span>
              </div>

              <p style={{ margin: '8px 0 0', fontSize: '0.76rem', color: '#5eead4', fontWeight: 500 }}>
                ✓ 82% of rural monthly quota achieved
              </p>
            </div>

            {/* Vertical 8-Segment Pill Battery (Image 2 style) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <PillBatteryMeter filled={7} total={8} activeColor="#2dd4bf" />
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Target</span>
            </div>
          </motion.div>

          {/* Card 2: Rural Mesh Data Sync & Bandwidth */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{
              background: 'rgba(8, 20, 34, 0.75)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(20, 184, 166, 0.2)',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(20, 184, 166, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>
                  Rural Mesh Data Sync
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    color: '#22d3ee',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    fontWeight: 600
                  }}
                >
                  98.6% Sync SLA
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  163
                </span>
                <span style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 600 }}>/ 512 MB</span>
              </div>

              <p style={{ margin: '8px 0 0', fontSize: '0.76rem', color: '#38bdf8', fontWeight: 500 }}>
                ⚡ 3 offline telemetry packets queued
              </p>
            </div>

            {/* Vertical 8-Segment Pill Battery */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <PillBatteryMeter filled={4} total={8} activeColor="#06b6d4" />
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>Sync</span>
            </div>
          </motion.div>

          {/* Card 3: Spotlight Promo Card (Image 2 style) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.35) 0%, rgba(8, 145, 178, 0.25) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1.5px solid rgba(45, 212, 191, 0.4)',
              padding: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4), 0 0 25px rgba(20, 184, 166, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Ambient eye graphic behind */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(94, 234, 212, 0.2) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Zap size={15} color="#5eead4" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#5eead4', letterSpacing: '0.05em' }}>
                  Real-time Inference
                </span>
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Automated DR Triaging
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                Grad-CAM highlights microaneurysms, hemorrhages, and hard exudates in &lt;1.2 seconds.
              </p>
            </div>

            <div style={{ marginTop: '16px' }}>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/screening/new')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: '100px',
                  background: '#ffffff',
                  border: 'none',
                  color: '#042f2e',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
              >
                <span>Launch Fundus AI</span>
                <ArrowUpRight size={14} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ============================================================ */}
        {/* 4. MAIN INTERACTIVE STAGE                                    */}
        {/*    Left (62%): RetinaAnatomyViewer OR CapsuleBarChart        */}
        {/*    Right (38%): DoctorReviewCard + ActivityGridMatrix        */}
        {/* ============================================================ */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.6fr) minmax(340px, 1fr)',
            gap: '24px',
            marginBottom: '32px'
          }}
        >
          {/* Left Column: Interactive Centerpiece with Switcher */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* View Switcher Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 14px',
                borderRadius: '16px',
                background: 'rgba(8, 20, 34, 0.75)',
                border: '1px solid rgba(20, 184, 166, 0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>Active View:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setMainView('anatomy')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '100px',
                      background: mainView === 'anatomy' ? 'rgba(20, 184, 166, 0.25)' : 'transparent',
                      border: mainView === 'anatomy' ? '1px solid #2dd4bf' : '1px solid transparent',
                      color: mainView === 'anatomy' ? '#5eead4' : '#94a3b8',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Eye size={13} />
                    3D Anatomical Fundus Viewer (Image 1)
                  </button>

                  <button
                    onClick={() => setMainView('chart')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 14px',
                      borderRadius: '100px',
                      background: mainView === 'chart' ? 'rgba(20, 184, 166, 0.25)' : 'transparent',
                      border: mainView === 'chart' ? '1px solid #2dd4bf' : '1px solid transparent',
                      color: mainView === 'chart' ? '#5eead4' : '#94a3b8',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <BarChart3 size={13} />
                    Fluid Telemetry Slider (Image 2)
                  </button>
                </div>
              </div>

              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Bklit Fluid Engine v2.4
              </span>
            </div>

            {/* Active Component */}
            <AnimatePresence mode="wait">
              {mainView === 'anatomy' ? (
                <motion.div
                  key="anatomy"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <RetinaAnatomyViewer />
                </motion.div>
              ) : (
                <motion.div
                  key="chart"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <CapsuleBarChart />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Doctor Telemedicine Roster & Activity Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Tele-Ophthalmology Card */}
            <DoctorReviewCard onConsultDoctor={(doc) => console.log('Consult', doc)} />

            {/* 5x5 Camp Activity Heatmap & Telemetry Waveform */}
            <ActivityGridMatrix />
          </div>
        </div>

        {/* ============================================================ */}
        {/* 5. RECENT SCREENINGS & AI DIAGNOSES TABLE (Dark Glass)        */}
        {/* ============================================================ */}
        <div
          style={{
            background: 'rgba(8, 20, 34, 0.75)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(20, 184, 166, 0.2)',
            padding: '24px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(20, 184, 166, 0.15)'
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                Recent Rural Screenings & AI Diagnoses
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                Real-time retinal captures with multi-language report generation & telemedicine sync
              </p>
            </div>

            <button
              onClick={() => navigate('/screenings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '100px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#2dd4bf',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              View Full Archive
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Patient Info
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    AI Severity Result
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Model Confidence
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Referral / Review
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Date
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredScreenings.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#64748b', fontSize: '0.84rem' }}>
                      No screening records found matching "{searchQuery}" in tab "{activeTab}".
                    </td>
                  </tr>
                ) : (
                  filteredScreenings.slice(0, 7).map((s) => {
                    const riskStyle = getRiskColor(s.riskLevel);
                    return (
                      <motion.tr
                        key={s.id}
                        whileHover={{ backgroundColor: 'rgba(15, 30, 48, 0.6)' }}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                        onClick={() => navigate('/screening/results', { state: { screening: s } })}
                      >
                        {/* Patient ID & Name */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.86rem' }}>
                            {s.patientName}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            {s.patientId} • Khandwa Camp
                          </div>
                        </td>

                        {/* Result Badge */}
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '100px',
                              background: riskStyle.bg,
                              color: riskStyle.text,
                              border: `1px solid ${riskStyle.border}`,
                              fontSize: '0.74rem',
                              fontWeight: 700
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: riskStyle.text
                              }}
                            />
                            {s.result}
                          </span>
                        </td>

                        {/* Confidence */}
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                width: '70px',
                                height: '6px',
                                borderRadius: '100px',
                                background: 'rgba(255, 255, 255, 0.08)',
                                overflow: 'hidden'
                              }}
                            >
                              <div
                                style={{
                                  width: `${s.confidence * 100}%`,
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #14b8a6, #2dd4bf)',
                                  borderRadius: '100px'
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '0.76rem', color: '#cbd5e1', fontWeight: 600 }}>
                              {Math.round(s.confidence * 100)}%
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              fontSize: '0.74rem',
                              color: s.status === 'referral' ? '#f87171' : s.status === 'review' ? '#fbbf24' : '#34d399',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {s.status === 'referral' && <AlertTriangle size={12} />}
                            {s.status === 'review' && <Clock size={12} />}
                            {s.status === 'complete' && <CheckCircle2 size={12} />}
                            {s.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td style={{ padding: '14px 16px', fontSize: '0.76rem', color: '#64748b' }}>
                          {s.date}
                        </td>

                        {/* Action Buttons */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/screening/explain', { state: { screening: s } });
                              }}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '8px',
                                background: 'rgba(20, 184, 166, 0.15)',
                                border: '1px solid rgba(45, 212, 191, 0.3)',
                                color: '#2dd4bf',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Grad-CAM
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/screening/report', { state: { screening: s } });
                              }}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '8px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: '#cbd5e1',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              Report
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

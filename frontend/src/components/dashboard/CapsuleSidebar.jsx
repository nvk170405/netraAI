import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { 
  Plus, 
  LayoutDashboard, 
  Camera, 
  Stethoscope, 
  Eye, 
  Wifi, 
  WifiOff, 
  ClipboardList, 
  BookOpen, 
  Rocket, 
  HelpCircle, 
  LogOut,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Video,
  BarChart3,
  Building2,
  MapPin,
  TrendingUp,
  Users,
  Layers,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

/**
 * CapsuleSidebar component
 * Dynamically switches navigation icons, color themes, quick actions,
 * and profile context based on the active portal:
 * - Health Worker Portal: Teal theme, retinal capture & frontline triage
 * - Doctor Portal: Sky Blue theme, clinical review cockpit & tele-ophthalmology
 * - Admin Portal: Amber/Gold theme, epidemiological surveillance & district analytics
 */
export function CapsuleSidebar({ portal, onQuickAction, onOpenProtocol, onOpenEmergency }) {
  const { user, logout, switchRole } = useAuth();
  const { isOnline } = useOffline();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [hoveredTab, setHoveredTab] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Auto-detect portal if not explicitly passed
  const activePortal = portal || (
    location.pathname.startsWith('/doctor') ? 'doctor' :
    location.pathname.startsWith('/admin') ? 'admin' :
    'health_worker'
  );

  // Portal-specific visual configurations
  const portalThemes = {
    health_worker: {
      accentColor: '#2dd4bf',
      primaryRgb: '20, 184, 166',
      borderColor: 'rgba(45, 212, 191, 0.25)',
      glowColor: 'rgba(20, 184, 166, 0.15)',
      topGradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
      topIcon: <Plus size={22} strokeWidth={2.5} />,
      topTitle: 'Start New Retinal Capture',
      topAction: () => (onQuickAction ? onQuickAction() : navigate('/screening/new')),
      avatar: '👩‍⚕️',
      roleLabel: 'ASHA Health Worker',
      roleSub: 'Frontline Triage',
      clusterLabel: user?.location || 'PHC Bahadurpur Cluster',
      statusDotColor: isOnline ? '#10b981' : '#f59e0b',
      statusText: isOnline ? 'Online Mesh Active' : 'Offline Cache Mode',
    },
    doctor: {
      accentColor: '#38bdf8',
      primaryRgb: '56, 189, 248',
      borderColor: 'rgba(56, 189, 248, 0.3)',
      glowColor: 'rgba(14, 165, 233, 0.2)',
      topGradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      topIcon: <Stethoscope size={21} strokeWidth={2.2} />,
      topTitle: 'Review Urgent Triage Queue',
      topAction: () => navigate('/doctor?filter=high'),
      avatar: '👨‍⚕️',
      roleLabel: user?.name || 'Dr. Sunita Rao',
      roleSub: 'Chief Retinal Consultant',
      clusterLabel: 'AIIMS Bhopal • Tele-Specialist',
      statusDotColor: '#38bdf8',
      statusText: 'Digital Signature Ready',
    },
    admin: {
      accentColor: '#fbbf24',
      primaryRgb: '245, 158, 11',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      glowColor: 'rgba(245, 158, 11, 0.18)',
      topGradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      topIcon: <BarChart3 size={21} strokeWidth={2.2} />,
      topTitle: 'State Epidemiological Intelligence',
      topAction: () => {
        if (location.pathname === '/admin') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          navigate('/admin');
        }
      },
      avatar: '🧑‍💼',
      roleLabel: user?.name || 'Dr. Navin Kumar',
      roleSub: 'State Health Mission Director',
      clusterLabel: 'SIH Informatics Center',
      statusDotColor: '#fbbf24',
      statusText: 'Surveillance Gateway Active',
    },
  };

  const currentTheme = portalThemes[activePortal] || portalThemes.health_worker;

  // 1. Navigation items for Health Worker Portal
  const workerNavItems = [
    { id: 'dashboard', label: 'Clinical Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { id: 'new-screening', label: 'New Retinal Capture', icon: <Camera size={20} />, path: '/screening/new' },
    { id: 'screenings', label: 'Patient Screenings Directory', icon: <ClipboardList size={20} />, path: '/screenings' },
    { id: 'explain', label: 'Grad-CAM AI Explainability', icon: <Eye size={20} />, path: '/screening/explain' },
    { id: 'tele-hub', label: 'Tele-Ophthalmology Hub', icon: <Activity size={20} />, path: '/tele-ophthalmology' },
  ];

  // 2. Navigation items for Doctor Portal (Ophthalmologist)
  const doctorNavItems = [
    { 
      id: 'doc-overview', 
      label: 'Doctor Review Cockpit', 
      icon: <Stethoscope size={20} />, 
      path: '/doctor',
      isActive: location.pathname === '/doctor' && !searchParams.get('filter')
    },
    { 
      id: 'doc-urgent', 
      label: 'Urgent Triage Queue (High Risk)', 
      icon: <AlertTriangle size={20} />, 
      path: '/doctor?filter=high',
      isActive: location.pathname === '/doctor' && searchParams.get('filter') === 'high',
      badge: 'Urgent'
    },
    { 
      id: 'doc-pending', 
      label: 'Pending Cases Awaiting Sign-Off', 
      icon: <Clock size={20} />, 
      path: '/doctor?filter=pending',
      isActive: location.pathname === '/doctor' && searchParams.get('filter') === 'pending'
    },
    { 
      id: 'doc-reviewed', 
      label: 'Signed-Off Clinical Records', 
      icon: <CheckCircle2 size={20} />, 
      path: '/doctor?filter=reviewed',
      isActive: location.pathname === '/doctor' && searchParams.get('filter') === 'reviewed'
    },
    { 
      id: 'doc-explain', 
      label: 'Grad-CAM Diagnostic Heatmap', 
      icon: <Eye size={20} />, 
      path: '/screening/explain',
      isActive: location.pathname.startsWith('/screening/explain')
    },
    { 
      id: 'doc-tele', 
      label: 'Live Tele-Consultation Hub', 
      icon: <Video size={20} />, 
      path: '/tele-ophthalmology',
      isActive: location.pathname.startsWith('/tele-ophthalmology')
    },
  ];

  // 3. Navigation items for Admin Portal (District CMO / Health Ministry)
  const adminNavItems = [
    { 
      id: 'admin-overview', 
      label: 'State Surveillance Intelligence', 
      icon: <Building2 size={20} />, 
      path: '/admin',
      isActive: location.pathname === '/admin' && !location.hash,
      action: () => {
        if (location.pathname === '/admin') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          navigate('/admin');
        }
      }
    },
    { 
      id: 'admin-clusters', 
      label: 'Village Cluster Screening Hotspots', 
      icon: <MapPin size={20} />, 
      path: '/admin#clusters',
      isActive: location.hash === '#clusters',
      action: () => {
        navigate('/admin#clusters');
        const el = document.getElementById('clusters');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    { 
      id: 'admin-metrics', 
      label: 'Screening Velocity & PDR Metrics', 
      icon: <TrendingUp size={20} />, 
      path: '/admin#metrics',
      isActive: location.hash === '#metrics',
      action: () => {
        navigate('/admin#metrics');
        const el = document.getElementById('metrics');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    { 
      id: 'admin-breakdown', 
      label: 'ICDR Severity Distribution', 
      icon: <Layers size={20} />, 
      path: '/admin#breakdown',
      isActive: location.hash === '#breakdown',
      action: () => {
        navigate('/admin#breakdown');
        const el = document.getElementById('breakdown');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    { 
      id: 'admin-protocols', 
      label: 'National Blindness Control Protocols', 
      icon: <ShieldCheck size={20} />, 
      path: '/protocols',
      isActive: location.pathname === '/protocols'
    },
  ];

  // Pick the nav items based on portal
  const navItems = 
    activePortal === 'doctor' ? doctorNavItems :
    activePortal === 'admin' ? adminNavItems :
    workerNavItems;

  // Bottom utility items based on portal
  const workerBottomItems = [
    { 
      id: 'protocol', 
      label: 'ICDR Grading Protocols', 
      icon: <BookOpen size={19} />, 
      path: '/protocols',
      action: () => navigate('/protocols') 
    },
    { 
      id: 'emergency', 
      label: 'Urgent PDR Escalation', 
      icon: <Rocket size={19} />, 
      path: '/escalation',
      action: () => navigate('/escalation') 
    },
    { 
      id: 'help', 
      label: 'AI Screening Assistant', 
      icon: <HelpCircle size={19} />, 
      path: '/assistant',
      action: () => navigate('/assistant') 
    },
  ];

  const doctorBottomItems = [
    { 
      id: 'doc-proto', 
      label: 'ICDR Clinical Grading Standards', 
      icon: <BookOpen size={19} />, 
      path: '/protocols',
      action: () => navigate('/protocols') 
    },
    { 
      id: 'doc-escala', 
      label: 'Emergency PDR Rapid Escalation', 
      icon: <ShieldAlert size={19} />, 
      path: '/escalation',
      action: () => navigate('/escalation') 
    },
    { 
      id: 'doc-ai', 
      label: 'Diagnostic AI Copilot', 
      icon: <Sparkles size={19} />, 
      path: '/assistant',
      action: () => navigate('/assistant') 
    },
  ];

  const adminBottomItems = [
    { 
      id: 'admin-export-csv', 
      label: 'Export Anonymized CSV Dataset', 
      icon: <FileSpreadsheet size={19} />, 
      action: () => alert('Exporting anonymized clinical CSV dataset for SIH 2026 epidemiological review...')
    },
    { 
      id: 'admin-export-pdf', 
      label: 'Generate NPCB Compliance Report', 
      icon: <FileText size={19} />, 
      action: () => alert('Generating National Programme for Control of Blindness (NPCB) compliance PDF report...')
    },
    { 
      id: 'admin-ai-forecast', 
      label: 'Epidemiological AI Forecaster', 
      icon: <Sparkles size={19} />, 
      path: '/assistant',
      action: () => navigate('/assistant') 
    },
  ];

  const bottomItems = 
    activePortal === 'doctor' ? doctorBottomItems :
    activePortal === 'admin' ? adminBottomItems :
    workerBottomItems;

  return (
    <aside
      style={{
        position: 'fixed',
        left: '16px',
        top: '16px',
        bottom: '16px',
        width: '74px',
        borderRadius: '30px',
        background: 'linear-gradient(180deg, rgba(8, 20, 32, 0.96) 0%, rgba(3, 10, 18, 0.98) 100%)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${currentTheme.borderColor}`,
        boxShadow: `0 20px 40px rgba(0, 0, 0, 0.75), 0 0 25px ${currentTheme.glowColor}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0',
        zIndex: 50,
        userSelect: 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      {/* 🌟 TOP PORTAL-SPECIFIC QUICK ACTION BUTTON 🌟 */}
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: `0 0 20px rgba(${currentTheme.primaryRgb}, 0.6)` }}
        whileTap={{ scale: 0.92 }}
        onClick={currentTheme.topAction}
        title={currentTheme.topTitle}
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: currentTheme.topGradient,
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: `0 4px 15px rgba(${currentTheme.primaryRgb}, 0.45)`,
          marginBottom: '18px',
          flexShrink: 0,
          transition: 'all 0.3s ease',
        }}
      >
        {currentTheme.topIcon}
      </motion.button>

      {/* 🌟 MAIN PORTAL NAVIGATION ICON STACK 🌟 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        {navItems.map((item) => {
          const isActive = item.isActive !== undefined ? item.isActive : (
            location.pathname === item.path || 
            (item.path !== '/dashboard' && item.path !== '/doctor' && item.path !== '/admin' && location.pathname.startsWith(item.path))
          );

          const handleClick = (e) => {
            if (item.action) {
              e.preventDefault();
              item.action();
            }
          };

          return (
            <div key={item.id} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <NavLink
                to={item.path}
                onClick={handleClick}
                onMouseEnter={() => setHoveredTab(item.id)}
                onMouseLeave={() => setHoveredTab(null)}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textDecoration: 'none',
                  position: 'relative',
                  background: isActive ? `rgba(${currentTheme.primaryRgb}, 0.2)` : 'transparent',
                  color: isActive ? currentTheme.accentColor : '#94a3b8',
                  border: isActive ? `1px solid rgba(${currentTheme.primaryRgb}, 0.45)` : '1px solid transparent',
                  boxShadow: isActive ? `0 0 16px rgba(${currentTheme.primaryRgb}, 0.25)` : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {item.icon}

                {/* Left Active Glow Indicator */}
                {isActive && (
                  <motion.div
                    layoutId={`activeIndicator-${activePortal}`}
                    style={{
                      position: 'absolute',
                      left: '-8px',
                      width: '4px',
                      height: '20px',
                      borderRadius: '4px',
                      background: currentTheme.accentColor,
                      boxShadow: `0 0 10px ${currentTheme.accentColor}`,
                    }}
                  />
                )}
              </NavLink>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredTab === item.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      left: '68px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(6, 20, 32, 0.97)',
                      border: `1px solid rgba(${currentTheme.primaryRgb}, 0.4)`,
                      borderRadius: '8px',
                      padding: '5px 10px',
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      zIndex: 100,
                      boxShadow: '0 4px 18px rgba(0,0,0,0.6)',
                    }}
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 🌟 DIVIDER 🌟 */}
      <div
        style={{
          width: '32px',
          height: '1px',
          background: 'rgba(255, 255, 255, 0.1)',
          margin: 'auto 0 14px 0',
        }}
      />

      {/* 🌟 LOWER UTILITY ICON GROUP 🌟 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%', marginBottom: '14px' }}>
        {bottomItems.map((item) => {
          const isActive = item.path && location.pathname === item.path;

          return (
            <div key={item.id} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.1, color: currentTheme.accentColor, background: 'rgba(255, 255, 255, 0.05)' }}
                whileTap={{ scale: 0.92 }}
                onClick={item.action}
                onMouseEnter={() => setHoveredTab(item.id)}
                onMouseLeave={() => setHoveredTab(null)}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '13px',
                  background: isActive ? `rgba(${currentTheme.primaryRgb}, 0.18)` : 'transparent',
                  border: isActive ? `1px solid rgba(${currentTheme.primaryRgb}, 0.4)` : '1px solid transparent',
                  color: isActive ? currentTheme.accentColor : '#94a3b8',
                  boxShadow: isActive ? `0 0 12px rgba(${currentTheme.primaryRgb}, 0.3)` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {item.icon}
              </motion.button>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredTab === item.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      left: '68px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(6, 20, 32, 0.97)',
                      border: `1px solid rgba(${currentTheme.primaryRgb}, 0.4)`,
                      borderRadius: '8px',
                      padding: '5px 10px',
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      zIndex: 100,
                      boxShadow: '0 4px 18px rgba(0,0,0,0.6)',
                    }}
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 🌟 BOTTOM USER PROFILE AVATAR WITH PORTAL STATUS 🌟 */}
      <div style={{ position: 'relative' }}>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          title={`${currentTheme.roleLabel} Profile & Switcher`}
          style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: `2px solid rgba(${currentTheme.primaryRgb}, 0.5)`,
            cursor: 'pointer',
            padding: 0,
            overflow: 'visible',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          <span style={{ fontSize: '1.15rem' }}>{currentTheme.avatar}</span>

          {/* Online / Portal Status Indicator */}
          <span
            style={{
              position: 'absolute',
              bottom: '-1px',
              right: '-1px',
              width: '11px',
              height: '11px',
              borderRadius: '50%',
              background: currentTheme.statusDotColor,
              border: '2px solid #040d18',
              boxShadow: `0 0 8px ${currentTheme.statusDotColor}`,
            }}
          />
        </motion.button>

        {/* Profile & Role Switcher Menu */}
        <AnimatePresence>
          {showProfileMenu && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.95 }}
              style={{
                position: 'absolute',
                left: '58px',
                bottom: '0',
                width: '230px',
                borderRadius: '16px',
                background: 'rgba(8, 24, 38, 0.98)',
                backdropFilter: 'blur(20px)',
                border: `1px solid rgba(${currentTheme.primaryRgb}, 0.4)`,
                padding: '12px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.7)',
                zIndex: 100,
              }}
            >
              <div style={{ paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '8px' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF' }}>{currentTheme.roleLabel}</div>
                <div style={{ fontSize: '0.7rem', color: currentTheme.accentColor }}>{currentTheme.clusterLabel}</div>
                <div style={{ fontSize: '0.68rem', color: currentTheme.statusDotColor, marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentTheme.statusDotColor }} />
                  <span>{currentTheme.statusText}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {activePortal !== 'health_worker' && (
                  <button
                    type="button"
                    onClick={() => { switchRole('health_worker'); setShowProfileMenu(false); navigate('/dashboard'); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#cbd5e1',
                      fontSize: '0.74rem',
                      padding: '6px 8px',
                      borderRadius: '8px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <Activity size={13} color="#2dd4bf" />
                    <span>Switch to Health Worker Portal</span>
                  </button>
                )}

                {activePortal !== 'doctor' && (
                  <button
                    type="button"
                    onClick={() => { switchRole('doctor'); setShowProfileMenu(false); navigate('/doctor'); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#cbd5e1',
                      fontSize: '0.74rem',
                      padding: '6px 8px',
                      borderRadius: '8px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <Stethoscope size={13} color="#38bdf8" />
                    <span>Switch to Doctor Portal</span>
                  </button>
                )}

                {activePortal !== 'admin' && (
                  <button
                    type="button"
                    onClick={() => { switchRole('admin'); setShowProfileMenu(false); navigate('/admin'); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#cbd5e1',
                      fontSize: '0.74rem',
                      padding: '6px 8px',
                      borderRadius: '8px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <BarChart3 size={13} color="#f59e0b" />
                    <span>Switch to Admin Portal</span>
                  </button>
                )}

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

                <button
                  type="button"
                  onClick={() => { logout(); navigate('/login'); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f87171',
                    fontSize: '0.74rem',
                    padding: '6px 8px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}

export default CapsuleSidebar;

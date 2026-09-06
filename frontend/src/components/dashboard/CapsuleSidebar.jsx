import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  ShieldAlert
} from 'lucide-react';

/**
 * CapsuleSidebar component (directly modeled after Image 2 left sidebar)
 * Floating dark capsule dock with top (+) button, vertical icon stack, active pill container,
 * divider, bottom utility icons, and doctor/worker avatar with presence indicator.
 */
export function CapsuleSidebar({ onQuickAction, onOpenProtocol, onOpenEmergency }) {
  const { user, logout, switchRole } = useAuth();
  const { isOnline } = useOffline();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredTab, setHoveredTab] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Clinical Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { id: 'new-screening', label: 'New Retinal Capture', icon: <Camera size={20} />, path: '/screening/new' },
    { id: 'screenings', label: 'Patient Screenings', icon: <ClipboardList size={20} />, path: '/screenings' },
    { id: 'explain', label: 'Grad-CAM Explainability', icon: <Eye size={20} />, path: '/screening/explain' },
    { id: 'tele-hub', label: 'Tele-Ophthalmology Hub', icon: <Stethoscope size={20} />, path: '/tele-ophthalmology' },
  ];

  const bottomItems = [
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

  return (
    <aside
      style={{
        position: 'fixed',
        left: '16px',
        top: '16px',
        bottom: '16px',
        width: '74px',
        borderRadius: '30px',
        background: 'linear-gradient(180deg, rgba(8, 20, 32, 0.95) 0%, rgba(4, 12, 20, 0.98) 100%)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(45, 212, 191, 0.22)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(20, 184, 166, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0',
        zIndex: 50,
        userSelect: 'none',
      }}
    >
      {/* 🌟 TOP (+) QUICK ACTION BUTTON (from Image 2) 🌟 */}
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(45, 212, 191, 0.6)' }}
        whileTap={{ scale: 0.92 }}
        onClick={() => (onQuickAction ? onQuickAction() : navigate('/screening/new'))}
        title="Start New Screening"
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(20, 184, 166, 0.45)',
          marginBottom: '20px',
          flexShrink: 0,
        }}
      >
        <Plus size={22} strokeWidth={2.5} />
      </motion.button>

      {/* 🌟 MAIN NAVIGATION ICON STACK 🌟 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

          return (
            <div key={item.id} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <NavLink
                to={item.path}
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
                  background: isActive ? 'rgba(20, 184, 166, 0.18)' : 'transparent',
                  color: isActive ? '#2dd4bf' : '#94a3b8',
                  border: isActive ? '1px solid rgba(45, 212, 191, 0.45)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 16px rgba(20, 184, 166, 0.25)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {item.icon}

                {/* Left Active Glow Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={{
                      position: 'absolute',
                      left: '-8px',
                      width: '4px',
                      height: '20px',
                      borderRadius: '4px',
                      background: '#2dd4bf',
                      boxShadow: '0 0 10px #2dd4bf',
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
                      background: 'rgba(6, 20, 32, 0.96)',
                      border: '1px solid rgba(45, 212, 191, 0.35)',
                      borderRadius: '8px',
                      padding: '5px 10px',
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                      zIndex: 100,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
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
          margin: 'auto 0 16px 0',
        }}
      />

      {/* 🌟 LOWER UTILITY ICON GROUP (from Image 2) 🌟 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%', marginBottom: '16px' }}>
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.id} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.1, color: '#2dd4bf', background: 'rgba(255, 255, 255, 0.05)' }}
                whileTap={{ scale: 0.92 }}
                onClick={item.action}
                onMouseEnter={() => setHoveredTab(item.id)}
                onMouseLeave={() => setHoveredTab(null)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: isActive ? 'rgba(20, 184, 166, 0.18)' : 'transparent',
                  border: isActive ? '1px solid rgba(45, 212, 191, 0.4)' : '1px solid transparent',
                  color: isActive ? '#2dd4bf' : '#94a3b8',
                  boxShadow: isActive ? '0 0 12px rgba(20, 184, 166, 0.3)' : 'none',
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
                    background: 'rgba(6, 20, 32, 0.96)',
                    border: '1px solid rgba(45, 212, 191, 0.35)',
                    borderRadius: '8px',
                    padding: '5px 10px',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 100,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
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

      {/* 🌟 BOTTOM USER PROFILE AVATAR WITH STATUS DOT (from Image 2) 🌟 */}
      <div style={{ position: 'relative' }}>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{
            position: 'relative',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '2px solid rgba(45, 212, 191, 0.4)',
            cursor: 'pointer',
            padding: 0,
            overflow: 'visible',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>👩‍⚕️</span>

          {/* Online/Offline Status Dot */}
          <span
            style={{
              position: 'absolute',
              bottom: '-1px',
              right: '-1px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: isOnline ? '#10b981' : '#f59e0b',
              border: '2px solid #040d18',
              boxShadow: isOnline ? '0 0 8px #10b981' : 'none',
            }}
          />
        </motion.button>

        {/* Profile Dropdown Menu */}
        <AnimatePresence>
          {showProfileMenu && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.95 }}
              style={{
                position: 'absolute',
                left: '60px',
                bottom: '0',
                width: '210px',
                borderRadius: '16px',
                background: 'rgba(8, 24, 38, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(45, 212, 191, 0.3)',
                padding: '12px',
                boxShadow: '0 15px 35px rgba(0,0,0,0.7)',
                zIndex: 100,
              }}
            >
              <div style={{ paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '8px' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF' }}>{user?.name || 'ASHA Worker'}</div>
                <div style={{ fontSize: '0.7rem', color: '#2dd4bf' }}>{user?.location || 'PHC Bahadurpur Cluster'}</div>
                <div style={{ fontSize: '0.68rem', color: isOnline ? '#10b981' : '#f59e0b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
                  <span>{isOnline ? 'Online Mesh Active' : 'Offline Cache Mode'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                  <span>Switch to Doctor View</span>
                </button>

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
                  <LayoutDashboard size={13} color="#f59e0b" />
                  <span>Switch to Admin View</span>
                </button>

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
                  <span>Logout</span>
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

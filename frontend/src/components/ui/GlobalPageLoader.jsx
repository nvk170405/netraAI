import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../../context/LoadingContext';
import { 
  Eye, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Stethoscope, 
  Building2, 
  Sparkles,
  Radio
} from 'lucide-react';

export function GlobalPageLoader() {
  const { isLoading, loadingConfig, isNavigating, navProgress, portalSwitchInfo } = useLoading();

  // Color schemes for different portals
  const portalColors = {
    health_worker: { primary: '#2dd4bf', rgb: '45, 212, 191', label: 'Health Worker', icon: <Activity size={18} /> },
    doctor: { primary: '#38bdf8', rgb: '56, 189, 248', label: 'Ophthalmologist', icon: <Stethoscope size={18} /> },
    admin: { primary: '#fbbf24', rgb: '245, 158, 11', label: 'District CMO', icon: <Building2 size={18} /> },
  };

  const currentPortalConfig = portalColors[loadingConfig.portal] || portalColors.health_worker;

  return (
    <>
      {/* 🌟 1. TOP LASER ROUTE TRANSITION BAR 🌟 */}
      {isNavigating && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '3px',
            zIndex: 99999,
            pointerEvents: 'none',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${navProgress}%` }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #14b8a6 0%, #2dd4bf 50%, #38bdf8 100%)',
              boxShadow: '0 0 10px #2dd4bf, 0 0 20px rgba(45, 212, 191, 0.8)',
              position: 'relative',
            }}
          >
            {/* Blazing tip glow */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '-2px',
                width: '8px',
                height: '7px',
                borderRadius: '50%',
                background: '#FFFFFF',
                boxShadow: '0 0 12px #FFFFFF, 0 0 20px #38bdf8',
              }}
            />
          </motion.div>
        </div>
      )}

      {/* 🌟 1B. NAVIGATION AMBIENT PULSE PILL 🌟 */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed',
              top: '14px',
              right: '24px',
              zIndex: 99997,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(8, 20, 34, 0.94)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(45, 212, 191, 0.4)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(20, 184, 166, 0.25)',
              pointerEvents: 'none',
            }}
          >
            <Radio size={13} color="#2dd4bf" className="animate-spin" style={{ animationDuration: '1.2s' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.02em' }}>
              Loading Clinical Workspace...
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 2. PORTAL SWITCH HANDOVER MICRO-OVERLAY 🌟 */}
      <AnimatePresence>
        {portalSwitchInfo && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 99998,
              padding: '10px 22px',
              borderRadius: '999px',
              background: 'rgba(8, 24, 38, 0.92)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${
                portalSwitchInfo.to === 'doctor' ? 'rgba(56, 189, 248, 0.4)' :
                portalSwitchInfo.to === 'admin' ? 'rgba(245, 158, 11, 0.4)' :
                'rgba(45, 212, 191, 0.4)'
              }`,
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(20, 184, 166, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background:
                  portalSwitchInfo.to === 'doctor' ? 'rgba(56, 189, 248, 0.2)' :
                  portalSwitchInfo.to === 'admin' ? 'rgba(245, 158, 11, 0.2)' :
                  'rgba(20, 184, 166, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color:
                  portalSwitchInfo.to === 'doctor' ? '#38bdf8' :
                  portalSwitchInfo.to === 'admin' ? '#fbbf24' :
                  '#2dd4bf',
              }}
            >
              <Radio size={14} className="animate-pulse" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Switching to {portalSwitchInfo.targetName}</span>
                <Sparkles size={13} color="#5eead4" />
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                Synchronizing clinical permissions & encrypted edge session...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 3. FULLSCREEN ASYNC STATE LOADING OVERLAY 🌟 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99990,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(3, 7, 18, 0.88)',
              backdropFilter: 'blur(24px)',
              padding: '1.5rem',
            }}
          >
            {/* Ambient Optical Glow behind card */}
            <div
              style={{
                position: 'absolute',
                width: '480px',
                height: '480px',
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(${currentPortalConfig.rgb}, 0.25) 0%, rgba(${currentPortalConfig.rgb}, 0.08) 45%, transparent 70%)`,
                filter: 'blur(60px)',
                pointerEvents: 'none',
              }}
            />

            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '440px',
                borderRadius: '24px',
                background: 'linear-gradient(145deg, rgba(8, 22, 36, 0.95) 0%, rgba(4, 12, 22, 0.98) 100%)',
                border: `1px solid rgba(${currentPortalConfig.rgb}, 0.35)`,
                boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px rgba(${currentPortalConfig.rgb}, 0.15)`,
                padding: '2.25rem 2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Holographic Concentric Retina Scanner */}
              <div
                style={{
                  position: 'relative',
                  width: '90px',
                  height: '90px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Outer Rotating Radar Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: `1.5px dashed rgba(${currentPortalConfig.rgb}, 0.5)`,
                  }}
                />

                {/* Middle Pulse Ring */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    inset: '8px',
                    borderRadius: '50%',
                    border: `2px solid rgba(${currentPortalConfig.rgb}, 0.35)`,
                  }}
                />

                {/* Center Core Scanner with Eye */}
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, rgba(${currentPortalConfig.rgb}, 0.3) 0%, rgba(${currentPortalConfig.rgb}, 0.1) 100%)`,
                    border: `1px solid ${currentPortalConfig.primary}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: currentPortalConfig.primary,
                    boxShadow: `0 0 20px rgba(${currentPortalConfig.rgb}, 0.4)`,
                  }}
                >
                  <Eye size={26} />
                </div>
              </div>

              {/* Status Title */}
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  margin: '0 0 0.4rem 0',
                }}
              >
                {loadingConfig.title}
              </h3>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  margin: '0 0 1.25rem 0',
                  maxWidth: '360px',
                }}
              >
                {loadingConfig.subtitle}
              </p>

              {/* Linear Progress Bar (if percentage given, or continuous pulse) */}
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '1.25rem',
                }}
              >
                {loadingConfig.progress !== null ? (
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${loadingConfig.progress}%` }}
                    transition={{ duration: 0.2 }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, #14b8a6, ${currentPortalConfig.primary})`,
                      boxShadow: `0 0 10px ${currentPortalConfig.primary}`,
                      borderRadius: '999px',
                    }}
                  />
                ) : (
                  <motion.div
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    style={{
                      width: '50%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, ${currentPortalConfig.primary}, transparent)`,
                      boxShadow: `0 0 12px ${currentPortalConfig.primary}`,
                    }}
                  />
                )}
              </div>

              {/* Micro Clinical Tags */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.7rem',
                  color: '#64748b',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Cpu size={12} color={currentPortalConfig.primary} />
                  <span>Edge AI Inference</span>
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} color="#10b981" />
                  <span>Zero-Trust Session</span>
                </span>
                <span>•</span>
                <span>ICDR 2026</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default GlobalPageLoader;

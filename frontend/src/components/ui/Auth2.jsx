import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Stethoscope, 
  Building2, 
  Sparkles, 
  ChevronLeft, 
  AlertCircle, 
  Fingerprint
} from 'lucide-react';

/**
 * Auth2 component (React Bits Pro @reactbits-pro/auth-2)
 * Features a centered card-style authentication block with glowing hospital-cyan accents,
 * floating brand section, quick clinical role switcher, and ABHA SSO integration.
 */
export function Auth2({ className = '' }) {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('health_worker');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const roleConfigs = {
    health_worker: {
      id: 'health_worker',
      label: 'Health Worker',
      sub: 'ASHA / PHC Clinic',
      icon: <Activity size={16} />,
      badge: 'Frontline Triage',
      creds: { user: 'health001', pass: 'netra123' },
      targetRoute: '/dashboard',
    },
    doctor: {
      id: 'doctor',
      label: 'Ophthalmologist',
      sub: 'District Tele-Specialist',
      icon: <Stethoscope size={16} />,
      badge: 'Clinical Review',
      creds: { user: 'doctor001', pass: 'netra123' },
      targetRoute: '/doctor',
    },
    admin: {
      id: 'admin',
      label: 'District CMO',
      sub: 'Chief Medical Officer',
      icon: <Building2 size={16} />,
      badge: 'Program Analytics',
      creds: { user: 'admin001', pass: 'netra123' },
      targetRoute: '/admin',
    },
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setError('');
    const config = roleConfigs[roleKey];
    setEmployeeId(config.creds.user);
    setPassword(config.creds.pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(employeeId || roleConfigs[selectedRole].creds.user, password || roleConfigs[selectedRole].creds.pass);
      setIsLoading(false);

      if (result.success) {
        const routes = { health_worker: '/dashboard', doctor: '/doctor', admin: '/admin' };
        navigate(routes[result.user.role] || '/dashboard');
      } else {
        setError(result.error || 'Invalid credentials. Please verify your Clinical ID.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Connection error. Please try again.');
    }
  };

  const handleQuickLogin = async (roleKey) => {
    handleRoleSelect(roleKey);
    setIsLoading(true);
    try {
      const config = roleConfigs[roleKey];
      const result = await login(config.creds.user, config.creds.pass);
      setIsLoading(false);
      if (result.success) {
        navigate(config.targetRoute);
      }
    } catch (err) {
      setIsLoading(false);
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center min-h-screen select-none ${className}`}
      style={{
        backgroundColor: '#030712',
        color: '#FFFFFF',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '2rem 1rem',
        overflow: 'hidden',
      }}
    >
      {/* Hospital Bluish-Green Radial Spotlight Glows */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '720px',
          height: '540px',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.18) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />

      {/* Grid Pattern Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(45, 212, 191, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(45, 212, 191, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 45%, #000 70%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Back to Public Portal Button */}
      <motion.button
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '1.75rem',
          left: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#94a3b8',
          fontSize: '0.82rem',
          fontWeight: 600,
          cursor: 'pointer',
          zIndex: 10,
          backdropFilter: 'blur(10px)',
        }}
      >
        <ChevronLeft size={16} />
        <span>Back to Public Portal</span>
      </motion.button>

      {/* SIH 2026 Problem Statement Badge (Top Right) */}
      <div
        style={{
          position: 'absolute',
          top: '1.75rem',
          right: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '999px',
          background: 'rgba(20, 184, 166, 0.1)',
          border: '1px solid rgba(45, 212, 191, 0.25)',
          color: '#2dd4bf',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          zIndex: 10,
        }}
      >
        <Sparkles size={13} />
        <span>SIH 2026 • PS 26038</span>
      </div>

      {/* 🌟 REACT BITS PRO AUTH-2 CARD CONTAINER 🌟 */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '480px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(8, 24, 38, 0.88) 0%, rgba(4, 14, 24, 0.94) 100%)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(45, 212, 191, 0.3)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(20, 184, 166, 0.15)',
          padding: '2.5rem 2.25rem',
        }}
      >
        {/* Floating Brand Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: '0 0 25px rgba(20, 184, 166, 0.5)',
            }}
          >
            <Eye size={30} color="#FFFFFF" />
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 0.4rem 0' }}>
            Netra<span style={{ color: '#2dd4bf' }}>AI</span> Workspace
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            Diabetic Retinopathy Screening & Clinical Decision Support
          </p>
        </div>

        {/* Role Selector Tabs (auth-2 style segmented bar) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '4px',
            borderRadius: '14px',
            marginBottom: '1.75rem',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {Object.values(roleConfigs).map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleSelect(role.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '8px 6px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isSelected ? 'rgba(20, 184, 166, 0.25)' : 'transparent',
                  color: isSelected ? '#5eead4' : '#94a3b8',
                  boxShadow: isSelected ? '0 2px 10px rgba(20, 184, 166, 0.2)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                  {role.icon}
                  <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>{role.label}</span>
                </div>
                <span style={{ fontSize: '0.62rem', opacity: isSelected ? 0.9 : 0.6 }}>{role.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5',
                fontSize: '0.82rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label
              htmlFor="employeeId"
              style={{
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#cbd5e1',
                marginBottom: '6px',
                letterSpacing: '0.02em',
              }}
            >
              CLINICAL ID / EMPLOYEE ID
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <User size={17} />
              </div>
              <input
                id="employeeId"
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder={roleConfigs[selectedRole].creds.user}
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '11px 14px 11px 42px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2dd4bf')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label
                htmlFor="password"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#cbd5e1',
                  letterSpacing: '0.02em',
                }}
              >
                SECURITY PIN / PASSWORD
              </label>
              <button
                type="button"
                onClick={() => {
                  setEmployeeId(roleConfigs[selectedRole].creds.user);
                  setPassword(roleConfigs[selectedRole].creds.pass);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2dd4bf',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Auto-fill Demo PIN
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Lock size={17} />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '11px 42px 11px 42px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2dd4bf')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: '#94a3b8' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#14b8a6', width: '15px', height: '15px' }}
              />
              <span>Keep session cached offline</span>
            </label>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Default: netra123</span>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.94rem',
              border: 'none',
              cursor: isLoading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(20, 184, 166, 0.4)',
              marginBottom: '1.25rem',
            }}
          >
            {isLoading ? (
              <span>Authenticating Edge Node...</span>
            ) : (
              <>
                <span>Sign In as {roleConfigs[selectedRole].label}</span>
                <ArrowRight size={17} />
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
            <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Or 1-Click Role Direct Login
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          {/* Quick 1-Click Role Access Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.5rem' }}>
            {Object.entries(roleConfigs).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleQuickLogin(key)}
                style={{
                  padding: '8px 4px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(20, 184, 166, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                {config.icon}
                <span>{config.label}</span>
              </button>
            ))}
          </div>

          {/* ABHA / ABDM SSO Secondary Action (auth-2 OAuth slot) */}
          <button
            type="button"
            onClick={() => handleQuickLogin('health_worker')}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(45, 212, 191, 0.25)',
              color: '#5eead4',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
          >
            <Fingerprint size={17} color="#2dd4bf" />
            <span>Verify via ABHA / Hospital SSO</span>
          </button>
        </form>

        {/* Offline Safety Assurance Footer */}
        <div
          style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.74rem',
            color: '#64748b',
          }}
        >
          <ShieldCheck size={14} color="#10b981" />
          <span>Local IndexedDB cache enabled for offline PHC shifts</span>
        </div>
      </motion.div>
    </div>
  );
}

export default Auth2;

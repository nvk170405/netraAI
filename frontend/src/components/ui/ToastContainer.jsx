import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

const ICON_MAP = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLOR_MAP = {
  success: {
    border: 'rgba(16, 185, 129, 0.5)',
    bg: 'rgba(16, 185, 129, 0.08)',
    icon: '#34d399',
    glow: 'rgba(16, 185, 129, 0.35)',
    progress: '#10b981',
  },
  error: {
    border: 'rgba(239, 68, 68, 0.5)',
    bg: 'rgba(239, 68, 68, 0.08)',
    icon: '#f87171',
    glow: 'rgba(239, 68, 68, 0.35)',
    progress: '#ef4444',
  },
  warning: {
    border: 'rgba(245, 158, 11, 0.5)',
    bg: 'rgba(245, 158, 11, 0.08)',
    icon: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.35)',
    progress: '#f59e0b',
  },
  info: {
    border: 'rgba(56, 189, 248, 0.5)',
    bg: 'rgba(56, 189, 248, 0.08)',
    icon: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.35)',
    progress: '#0ea5e9',
  },
};

/**
 * Animated toast notification stack — renders at top-right of viewport.
 * Uses Framer Motion for smooth enter/exit animations.
 */
export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      id="toast-container"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '420px',
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = ICON_MAP[toast.type] || Info;
          const colors = COLOR_MAP[toast.type] || COLOR_MAP.info;

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              style={{
                pointerEvents: 'auto',
                background: 'rgba(10, 22, 40, 0.92)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                padding: '14px 16px',
                boxShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px ${colors.glow}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onClick={() => removeToast(toast.id)}
            >
              {/* Subtle background glow */}
              <div
                style={{
                  position: 'absolute',
                  top: '-30px',
                  left: '-30px',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${colors.bg} 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />

              {/* Icon */}
              <div
                style={{
                  flexShrink: 0,
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: colors.bg,
                  border: `1px solid ${colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={18} color={colors.icon} />
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {toast.title && (
                  <p
                    style={{
                      margin: '0 0 2px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#f8fafc',
                      lineHeight: 1.3,
                    }}
                  >
                    {toast.title}
                  </p>
                )}
                {toast.message && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.78rem',
                      color: '#94a3b8',
                      lineHeight: 1.4,
                    }}
                  >
                    {toast.message}
                  </p>
                )}
                {toast.action && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.action.onClick();
                      removeToast(toast.id);
                    }}
                    style={{
                      marginTop: '8px',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      background: colors.bg,
                      border: `1px solid ${colors.border}`,
                      color: colors.icon,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeToast(toast.id);
                }}
                style={{
                  flexShrink: 0,
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: '#64748b',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
              >
                <X size={14} />
              </button>

              {/* Auto-dismiss progress bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{
                  duration: toast.type === 'error' ? 8 : toast.type === 'warning' ? 6 : 5,
                  ease: 'linear',
                }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${colors.progress}, ${colors.icon})`,
                  transformOrigin: 'left',
                  borderRadius: '0 0 16px 16px',
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

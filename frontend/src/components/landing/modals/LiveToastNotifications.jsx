import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Eye, ShieldCheck, Sparkles, X, Stethoscope, Wifi } from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'Screening Processed',
    desc: 'Patient P-10292 • Grade 0 (Normal) • 97.8%',
    icon: <Eye size={16} color="#10b981" />,
    border: 'rgba(16, 185, 129, 0.4)',
  },
  {
    id: 2,
    title: 'Grad-CAM Heatmap Generated',
    desc: 'Microaneurysms localized in macula • 91.4%',
    icon: <Sparkles size={16} color="#f97316" />,
    border: 'rgba(249, 115, 22, 0.4)',
  },
  {
    id: 3,
    title: 'Tele-Referral Assigned',
    desc: 'Dr. Sunita Rao received high-risk PDR case',
    icon: <Stethoscope size={16} color="#38bdf8" />,
    border: 'rgba(56, 189, 248, 0.4)',
  },
  {
    id: 4,
    title: 'Rural Offline Sync',
    desc: '4 screening records synced to district database',
    icon: <Wifi size={16} color="#14b8a6" />,
    border: 'rgba(20, 184, 166, 0.4)',
  },
];

export default function LiveToastNotifications() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % NOTIFICATIONS.length);
        setVisible(true);
      }, 500);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  const notif = NOTIFICATIONS[currentIdx];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 900,
        pointerEvents: 'auto',
      }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '16px',
              background: 'rgba(15, 23, 42, 0.94)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${notif.border}`,
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(249, 115, 22, 0.12)',
              color: '#FFFFFF',
              maxWidth: '360px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {notif.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF' }}>{notif.title}</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {notif.desc}
              </div>
            </div>

            <button
              onClick={() => setVisible(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

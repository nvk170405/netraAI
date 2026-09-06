import React from 'react';
import { motion } from 'framer-motion';

/**
 * PillBatteryMeter component (inspired by Image 2)
 * Renders a row of vertical capsule pills that illuminate based on target completion percentage.
 */
export function PillBatteryMeter({
  percent = 82,
  totalSegments = 8,
  activeColor = '#2dd4bf',
  activeGlow = 'rgba(45, 212, 191, 0.45)',
  inactiveColor = 'rgba(255, 255, 255, 0.08)',
  className = '',
}) {
  const activeCount = Math.round((percent / 100) * totalSegments);

  return (
    <div
      className={`flex items-center gap-1.5 select-none ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: '0.75rem',
      }}
    >
      {Array.from({ length: totalSegments }).map((_, index) => {
        const isActive = index < activeCount;
        return (
          <motion.div
            key={index}
            initial={{ scaleY: 0.6, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            style={{
              width: '12px',
              height: '24px',
              borderRadius: '999px',
              background: isActive ? activeColor : inactiveColor,
              border: isActive ? 'none' : '1px dashed rgba(255, 255, 255, 0.16)',
              boxShadow: isActive ? `0 0 10px ${activeGlow}` : 'none',
              transition: 'all 0.3s ease',
            }}
          />
        );
      })}
    </div>
  );
}

export default PillBatteryMeter;

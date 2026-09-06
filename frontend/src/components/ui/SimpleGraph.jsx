import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * SimpleGraph component (React Bits style @reactbits-starter/simple-graph-tw)
 * Displays an expansive animated curved line graph with data points, gradient area, and hover tooltips.
 */
export function SimpleGraph({
  data = [
    { label: 'Grade 0 (No DR)', value: 99.2, cases: '2,840 cases' },
    { label: 'Grade 1 (Mild NPDR)', value: 94.8, cases: '1,120 cases' },
    { label: 'Grade 2 (Moderate NPDR)', value: 96.5, cases: '780 cases' },
    { label: 'Grade 3 (Severe NPDR)', value: 98.4, cases: '340 cases' },
    { label: 'Grade 4 (Proliferative PDR)', value: 99.6, cases: '157 cases' },
  ],
  lineColor = '#2dd4bf',
  fillColor = '#14b8a6',
  className = '',
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const width = 560;
  const height = 180;
  const paddingX = 52;
  const paddingTop = 22;
  const paddingBottom = 38;

  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingTop - paddingBottom;

  const minVal = 90;
  const maxVal = 100;

  // Calculate coordinates
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * graphWidth;
    const y = paddingTop + graphHeight - ((d.value - minVal) / (maxVal - minVal)) * graphHeight;
    return { ...d, x, y };
  });

  // Construct smooth bezier curve path
  const createSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) * 0.45;
      const cpY1 = p0.y;
      const cpX2 = p1.x - (p1.x - p0.x) * 0.45;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const linePath = createSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

  return (
    <div
      className={`select-none ${className}`}
      style={{
        position: 'relative',
        background: 'transparent',
        border: 'none',
        width: '100%',
        maxWidth: '640px',
        margin: '0 auto',
      }}
    >
      <div style={{ position: 'relative', width: '100%', overflow: 'visible' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            {/* Area gradient */}
            <linearGradient id="simpleGraphAreaGradWide" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={fillColor} stopOpacity="0.35" />
              <stop offset="60%" stopColor={fillColor} stopOpacity="0.06" />
              <stop offset="100%" stopColor={fillColor} stopOpacity="0.0" />
            </linearGradient>

            {/* Line glow filter */}
            <filter id="simpleGraphGlowWide" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Horizontal Grid lines */}
          {[92, 94, 96, 98, 100].map((val) => {
            const y = paddingTop + graphHeight - ((val - minVal) / (maxVal - minVal)) * graphHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3.5}
                  fill="#64748b"
                  fontSize="9"
                  textAnchor="end"
                  fontFamily="sans-serif"
                >
                  {val}%
                </text>
              </g>
            );
          })}

          {/* Gradient fill under curve */}
          <path d={areaPath} fill="url(#simpleGraphAreaGradWide)" />

          {/* Animated Curve line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            filter="url(#simpleGraphGlowWide)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredPoint === idx;

            return (
              <g key={idx}>
                {/* Vertical hover guide */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={height - paddingBottom}
                    stroke="rgba(45, 212, 191, 0.45)"
                    strokeDasharray="2 2"
                    strokeWidth="1.2"
                  />
                )}

                {/* Outer halo */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 7 : 4.5}
                  fill={isHovered ? '#5eead4' : lineColor}
                  fillOpacity={isHovered ? 0.45 : 0.25}
                  filter="url(#simpleGraphGlowWide)"
                  style={{ transition: 'all 0.2s' }}
                />

                {/* Inner point */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 4.5 : 3}
                  fill="#FFFFFF"
                  stroke={lineColor}
                  strokeWidth="2"
                  cursor="pointer"
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* X-axis labels */}
                <text
                  x={pt.x}
                  y={height - paddingBottom + 16}
                  fill={isHovered ? '#2dd4bf' : '#94a3b8'}
                  fontSize="10"
                  fontWeight={isHovered ? '700' : '500'}
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  {`Grade ${idx}`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint !== null && (
          <div
            style={{
              position: 'absolute',
              left: `${(points[hoveredPoint].x / width) * 100}%`,
              top: `${(points[hoveredPoint].y / height) * 100}%`,
              transform: 'translate(-50%, -125%)',
              background: 'rgba(8, 28, 44, 0.95)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(45, 212, 191, 0.45)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#FFFFFF',
              boxShadow: '0 8px 25px rgba(0,0,0,0.6), 0 0 15px rgba(20,184,166,0.3)',
              pointerEvents: 'none',
              zIndex: 20,
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '2px' }}>
              {points[hoveredPoint].label}
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#2dd4bf' }}>
              {points[hoveredPoint].value}% Sensitivity
            </div>
            <div style={{ fontSize: '0.66rem', color: '#cbd5e1' }}>{points[hoveredPoint].cases}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleGraph;

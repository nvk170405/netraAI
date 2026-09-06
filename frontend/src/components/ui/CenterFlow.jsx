import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ShieldCheck, Stethoscope, WifiOff, FileText, Sparkles, Activity } from 'lucide-react';

/**
 * CenterFlow component (React Bits style @reactbits-starter/center-flow-tw)
 * Creates an expansive radial flowing animated system connecting a central core to orbiting nodes.
 */
export function CenterFlow({
  centerLabel = 'NetraAI Vision Core',
  centerSub = 'EfficientNet-B0 + ViT',
  glowColor = '#14b8a6',
  className = '',
}) {
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    {
      id: 'gradcam',
      label: 'Grad-CAM Heatmap',
      sub: 'Microaneurysms & Exudates',
      icon: <Sparkles size={17} color="#2dd4bf" />,
      angle: -90, // Top
      color: '#2dd4bf',
    },
    {
      id: 'quality',
      label: 'Quality Gate',
      sub: '96% Sharpness Check',
      icon: <Eye size={17} color="#06b6d4" />,
      angle: -30, // Top-right
      color: '#06b6d4',
    },
    {
      id: 'tele',
      label: 'Tele-Consult Dispatch',
      sub: 'District Specialist < 48h',
      icon: <Stethoscope size={17} color="#38bdf8" />,
      angle: 30, // Bottom-right
      color: '#38bdf8',
    },
    {
      id: 'offline',
      label: 'Offline Sync Mesh',
      sub: 'IndexedDB Rural Cache',
      icon: <WifiOff size={17} color="#10b981" />,
      angle: 90, // Bottom
      color: '#10b981',
    },
    {
      id: 'reports',
      label: 'Bilingual Reports',
      sub: 'Patient Handout (PDF)',
      icon: <FileText size={17} color="#f59e0b" />,
      angle: 150, // Bottom-left
      color: '#f59e0b',
    },
    {
      id: 'standards',
      label: 'ICDR Classification',
      sub: 'Grades 0 to 4 Triage',
      icon: <Activity size={17} color="#a78bfa" />,
      angle: 210, // Top-left
      color: '#a78bfa',
    },
  ];

  const viewBoxWidth = 760;
  const viewBoxHeight = 540;
  const radius = 185;
  const centerX = viewBoxWidth / 2; // 380
  const centerY = viewBoxHeight / 2; // 270

  return (
    <div
      className={`select-none ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '760px',
        aspectRatio: '760 / 540',
        margin: '1rem auto 0 auto',
      }}
    >
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
          display: 'block',
        }}
      >
        <defs>
          {/* Radial Center Glow */}
          <radialGradient id="centerFlowCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#0d9488" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#040914" stopOpacity="0" />
          </radialGradient>

          {/* Glowing filter */}
          <filter id="flowGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ambient background orbital rings */}
        <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="rgba(45, 212, 191, 0.16)" strokeWidth="1" strokeDasharray="4 5" />
        <circle cx={centerX} cy={centerY} r={radius * 0.62} fill="none" stroke="rgba(20, 184, 166, 0.09)" strokeWidth="1" strokeDasharray="3 4" />
        <circle cx={centerX} cy={centerY} r={105} fill="url(#centerFlowCoreGlow)" />

        {/* Connecting Beams from Center to Orbiting Nodes */}
        {nodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const targetX = centerX + radius * Math.cos(rad);
          const targetY = centerY + radius * Math.sin(rad);

          return (
            <g key={node.id}>
              {/* Static faint path line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={targetX}
                y2={targetY}
                stroke={node.color}
                strokeOpacity="0.28"
                strokeWidth="1.5"
              />

              {/* Flowing animated pulse along line */}
              <line
                x1={centerX}
                y1={centerY}
                x2={targetX}
                y2={targetY}
                stroke={node.color}
                strokeOpacity="0.85"
                strokeWidth="2"
                strokeDasharray="16 60"
                filter="url(#flowGlow)"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="76; 0"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </line>

              {/* Pulsing travel photon particle */}
              <circle r="3.5" fill={node.color} filter="url(#flowGlow)">
                <animateMotion
                  path={`M ${centerX} ${centerY} L ${targetX} ${targetY}`}
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Orbiting Satellite Node Buttons (Wrapped in stable translate container to prevent framer-motion transform conflict) */}
      {nodes.map((node) => {
        const rad = (node.angle * Math.PI) / 180;
        const targetX = centerX + radius * Math.cos(rad);
        const targetY = centerY + radius * Math.sin(rad);

        const isHovered = activeNode === node.id;

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: `${(targetX / viewBoxWidth) * 100}%`,
              top: `${(targetY / viewBoxHeight) * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              pointerEvents: 'auto',
            }}
          >
            <motion.div
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
              whileHover={{ scale: 1.08 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 14px',
                borderRadius: '999px',
                background: isHovered ? 'rgba(8, 28, 44, 0.96)' : 'rgba(6, 18, 30, 0.90)',
                backdropFilter: 'blur(12px)',
                border: isHovered ? `1.5px solid ${node.color}` : '1px solid rgba(45, 212, 191, 0.3)',
                boxShadow: isHovered
                  ? `0 0 25px ${node.color}40, 0 8px 20px rgba(0,0,0,0.5)`
                  : '0 4px 15px rgba(0,0,0,0.4)',
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {node.icon}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {node.label}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{node.sub}</div>
              </div>
            </motion.div>
          </div>
        );
      })}

      {/* Central Hub Node (Wrapped in stable translate container) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 15,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            width: '128px',
            height: '128px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.92) 0%, rgba(8, 51, 68, 0.96) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(45, 212, 191, 0.55)',
            boxShadow: '0 0 40px rgba(20, 184, 166, 0.45), inset 0 0 20px rgba(255, 255, 255, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '10px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              marginBottom: '3px',
            }}
          >
            <Activity size={17} />
          </div>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
            {centerLabel}
          </div>
          <div style={{ fontSize: '0.66rem', color: '#5eead4', marginTop: '2px' }}>{centerSub}</div>
        </motion.div>
      </div>
    </div>
  );
}

export default CenterFlow;

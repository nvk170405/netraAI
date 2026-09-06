export default function ConnectorLines() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        style={{ overflow: 'visible', width: '100%', height: '100%' }}
      >
        <defs>
          {/* Gradient for left connector: Emerald to Hospital Teal */}
          <linearGradient id="lineGradLeft" x1="0%" y1="100%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#14b8a6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
          </linearGradient>

          {/* Gradient for right connector: Hospital Teal to Sky Blue to Coral alert */}
          <linearGradient id="lineGradRight" x1="0%" y1="50%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left Curved Connector: From left floating pill (x: 270, y: 310) to center card (x: 430, y: 255) */}
        <path
          d="M 270 310 C 330 310, 360 255, 430 255"
          fill="none"
          stroke="url(#lineGradLeft)"
          strokeWidth="1.6"
          filter="url(#neonGlow)"
          strokeDasharray="4 2"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0; -24"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Pulsing travel dot on left line */}
        <circle r="3" fill="#2dd4bf" filter="url(#neonGlow)">
          <animateMotion
            path="M 270 310 C 330 310, 360 255, 430 255"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Right Curved Connector: From center card (x: 770, y: 255) to right floating pill (x: 930, y: 310) */}
        <path
          d="M 770 255 C 840 255, 870 310, 930 310"
          fill="none"
          stroke="url(#lineGradRight)"
          strokeWidth="1.6"
          filter="url(#neonGlow)"
          strokeDasharray="4 2"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0; 24"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Pulsing travel dot on right line */}
        <circle r="3" fill="#38bdf8" filter="url(#neonGlow)">
          <animateMotion
            path="M 770 255 C 840 255, 870 310, 930 310"
            dur="4.5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}

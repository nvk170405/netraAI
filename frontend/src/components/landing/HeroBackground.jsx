import { useRef, useEffect } from 'react';

/** Inline Noise overlay (no external imports) */
export function Noise({
  patternRefreshInterval = 2,
  patternAlpha = 16,
}) {
  const grainRef = useRef(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let frame = 0;
    let animationId = 0;
    const canvasSize = 1024;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) drawGrain();
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    window.addEventListener('resize', resize);
    resize();
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      ref={grainRef}
      className="pointer-events-none absolute inset-0"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        imageRendering: 'pixelated',
        width: '100%',
        height: '100%',
        zIndex: 3,
      }}
    />
  );
}

/**
 * Hospital-themed Bluish-Green Gradient + Technical Grid + Grain Noise Overlay
 * Exactly matches the reference image with central bluish-green glow and fine grid pattern.
 */
export default function HeroBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#050a12', // Deep clinical dark navy
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* 1. Base dark background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 30%, #081624 0%, #050b14 60%, #03060a 100%)',
          zIndex: 0,
        }}
      />

      {/* 2. Central Hospital-Themed Bluish-Green Radial Spotlight (like in uploaded image) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle 620px at 50% 320px, rgba(20, 184, 166, 0.38) 0%, rgba(6, 182, 212, 0.22) 40%, rgba(13, 148, 136, 0.08) 65%, transparent 78%),
            radial-gradient(circle 380px at 50% 300px, rgba(45, 212, 191, 0.28) 0%, rgba(14, 165, 233, 0.15) 50%, transparent 80%)
          `,
          zIndex: 1,
        }}
      />

      {/* 3. Technical Hospital Medical Grid Pattern (as seen in the uploaded image) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(45, 212, 191, 0.13) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(45, 212, 191, 0.13) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px',
          backgroundPosition: 'center center',
          // Mask the grid so it fades away gently toward the bottom and periphery
          maskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 45%, rgba(0,0,0,0.4) 75%, transparent 92%)',
          WebkitMaskImage: 'radial-gradient(ellipse 75% 65% at 50% 35%, black 45%, rgba(0,0,0,0.4) 75%, transparent 92%)',
          zIndex: 2,
        }}
      />

      {/* 4. Subtle secondary wider grid for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(14, 165, 233, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '144px 144px',
          backgroundPosition: 'center center',
          maskImage: 'radial-gradient(circle 700px at 50% 35%, black 20%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(circle 700px at 50% 35%, black 20%, transparent 85%)',
          zIndex: 2,
        }}
      />

      {/* 5. Fine Film Grain Noise Overlay */}
      <Noise patternRefreshInterval={2} patternAlpha={16} />
    </div>
  );
}

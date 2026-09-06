import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeAuroraBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 25;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Custom Shader for the vertical luminous aurora light beams
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      varying vec2 vUv;
      varying vec3 vPosition;

      // Pseudo-random noise
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      void main() {
        vec2 uv = vUv;
        
        // Vertical beam coordinates with subtle wave distortion
        float wave = sin(uv.x * 12.0 + uTime * 0.8) * 0.05 
                   + cos(uv.x * 24.0 - uTime * 1.2) * 0.025;
        
        // Distance from bottom horizon
        float yDist = uv.y;
        
        // Beam pattern (repeated vertical columns)
        float beamCoord = uv.x * 36.0 + wave * 15.0 + sin(uTime * 0.4) * 2.0;
        float beamIntensity = pow(abs(sin(beamCoord)), 14.0) * 1.6;
        beamIntensity += pow(abs(sin(beamCoord * 0.5 + 1.2)), 8.0) * 0.8;
        beamIntensity += pow(abs(cos(beamCoord * 0.33 - 0.8)), 6.0) * 0.5;

        // Mouse influence
        float mouseDist = length(vec2(uv.x, uv.y * 0.7) - vec2(uMouse.x, (1.0 - uMouse.y) * 0.7));
        float mouseGlow = max(0.0, 1.0 - mouseDist * 1.8) * 0.6;

        // Vertical fade - brightest in lower middle, tapering upwards smoothly
        float verticalGaze = smoothstep(0.0, 0.35, yDist) * smoothstep(1.0, 0.3, yDist);
        
        // Color palette matching the reference image:
        // Deep teal, radiant cyan, bright turquoise, electric azure, deep cobalt
        vec3 deepBg = vec3(0.027, 0.043, 0.078);      // #070b14
        vec3 darkTeal = vec3(0.0, 0.35, 0.32);        // #005952
        vec3 brightTeal = vec3(0.0, 0.82, 0.70);      // #00d1b2
        vec3 vibrantCyan = vec3(0.05, 0.95, 0.90);     // #0df2e6
        vec3 skyBlue = vec3(0.12, 0.55, 1.0);         // #1f8cff
        vec3 royalBlue = vec3(0.08, 0.22, 0.85);      // #1438d9

        // Horizontal gradient interpolation
        float colorPos = uv.x;
        vec3 beamColor;
        if (colorPos < 0.3) {
          beamColor = mix(darkTeal, brightTeal, colorPos / 0.3);
        } else if (colorPos < 0.5) {
          beamColor = mix(brightTeal, vibrantCyan, (colorPos - 0.3) / 0.2);
        } else if (colorPos < 0.75) {
          beamColor = mix(vibrantCyan, skyBlue, (colorPos - 0.5) / 0.25);
        } else {
          beamColor = mix(skyBlue, royalBlue, (colorPos - 0.75) / 0.25);
        }

        // Center bottom bright flare
        float centerGlow = exp(-length(vec2((uv.x - 0.5) * 1.8, (uv.y - 0.15) * 2.2)) * 3.2) * 1.4;

        // Composite brightness
        float finalAlpha = (beamIntensity * 0.75 + 0.35) * verticalGaze + centerGlow * 0.8 + mouseGlow;
        finalAlpha = clamp(finalAlpha, 0.0, 1.0);

        vec3 finalColor = mix(deepBg, beamColor, finalAlpha * 0.95);
        finalColor += vec3(0.3, 0.85, 1.0) * centerGlow * 0.6;
        finalColor += vec3(0.0, 0.9, 0.8) * mouseGlow * 0.4;

        // Micro noise texture for organic film grain
        float n = noise(uv * 180.0 + uTime * 0.1) * 0.04;
        finalColor += n;

        gl_FragColor = vec4(finalColor, min(finalAlpha * 0.92, 0.95));
      }
    `;

    // Plane geometry covering the entire view frustum
    const planeGeo = new THREE.PlaneGeometry(60, 36, 64, 64);
    const planeMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      },
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const auroraMesh = new THREE.Mesh(planeGeo, planeMat);
    auroraMesh.position.y = 1;
    scene.add(auroraMesh);

    // Add floating ambient particle field (luminous stardust in the beams)
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 + 2;

      scales[i] = Math.random() * 2.2 + 0.8;
      opacities[i] = Math.random() * 0.7 + 0.3;

      velocities[i * 3] = (Math.random() - 0.5) * 0.006;
      velocities[i * 3 + 1] = Math.random() * 0.015 + 0.005; // float upward
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(100, 240, 230, 0.8)');
    grad.addColorStop(0.6, 'rgba(30, 140, 255, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const particleTexture = new THREE.CanvasTexture(canvas);
    const particleMat = new THREE.PointsMaterial({
      size: 0.8,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.65,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Tracking
    const mouseTarget = new THREE.Vector2(0.5, 0.5);
    const mouseCurrent = new THREE.Vector2(0.5, 0.5);

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseTarget.set(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      planeMat.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseCurrent.lerp(mouseTarget, 0.05);

      // Camera subtle parallax
      camera.position.x = (mouseCurrent.x - 0.5) * 2.5;
      camera.position.y = 2 + (0.5 - mouseCurrent.y) * 1.5;
      camera.lookAt(0, 1, 0);

      // Update shader uniforms
      planeMat.uniforms.uTime.value = elapsedTime;
      planeMat.uniforms.uMouse.value.copy(mouseCurrent);

      // Animate particles
      const posArray = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i * 3];
        posArray[i * 3 + 1] += velocities[i * 3 + 1];
        posArray[i * 3 + 2] += velocities[i * 3 + 2];

        // Reset if too high
        if (posArray[i * 3 + 1] > 14) {
          posArray[i * 3 + 1] = -14;
          posArray[i * 3] = (Math.random() - 0.5) * 45;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      planeGeo.dispose();
      planeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        userSelect: 'none',
        zIndex: 0,
        filter: 'contrast(1.08) brightness(1.02)',
      }}
    />
  );
}

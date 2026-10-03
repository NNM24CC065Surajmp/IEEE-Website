import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Geometry, Program, Mesh } from 'ogl';

const vertex = `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uIsDark;

  // Ashima Arts 3D Simplex Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  // Fractal Brownian Motion (4 octaves)
  float fbm(vec3 x) {
    float v = 0.0;
    float a = 0.5;
    vec3 shift = vec3(100.0);
    for (int i = 0; i < 4; ++i) {
      v += a * snoise(x);
      x = x * 2.0 + shift;
      a *= 0.5;
    }
    return v * 0.5 + 0.5; // Normalize [-1, 1] to [0, 1]
  }

  void main() {
    vec2 st = vUv;
    
    // Scale up the UVs significantly so the noise has fine detail 
    // rather than looking like one giant stretched blob.
    st *= 4.0;
    
    // Domain warping (flowing/drifting motion)
    // Increased speed multipliers so motion is actually perceptible over a 10s window
    vec3 q = vec3(0.0);
    q.x = fbm(vec3(st * 1.5, uTime * 0.15));
    q.y = fbm(vec3(st * 1.5 + vec2(1.0), uTime * 0.15));

    vec3 r = vec3(0.0);
    r.x = fbm(vec3(st * 2.5 + q.xy * 2.0, uTime * 0.2));
    r.y = fbm(vec3(st * 2.5 + q.xy * 2.0 + vec2(8.3), uTime * 0.2));

    float f = fbm(vec3(st * 2.0 + r.xy * 3.0, uTime * 0.25));

    vec3 color;
    
    if (uIsDark > 0.5) {
      // DARK MODE: Goal is "near-black with barely-perceptible motion".
      // Palette: #000000 (black) -> #0e0f12 (extreme dark) -> #22242a (dark charcoal highlight).
      // Relaxed thresholds slightly so the charcoal shimmer is actually visible without being dominant.
      float mix1 = smoothstep(0.2, 0.9, f); 
      float mix2 = smoothstep(0.5, 0.9, r.x); 
      
      color = mix(uColor1, uColor2, mix1);
      color = mix(color, uColor3, mix2);
      
      // Vignette effect: broadens the fade so the corners aren't completely crushed, but edges stay dark
      vec2 center = st / 4.0 - 0.5; 
      float dist = length(center);
      float vignette = smoothstep(0.85, 0.3, dist); 
      
      // Bumped intensity down to 0.65 for barely-perceptible dark mode
      float darkIntensity = 0.65; 
      gl_FragColor = vec4(color * darkIntensity * vignette, 1.0);
    } else {
      // LIGHT MODE: Unchanged blending logic. Uses (#f4f5f7 -> #6b7280).
      color = mix(uColor1, uColor2, clamp(f * 1.2, 0.0, 1.0));
      color = mix(color, uColor3, clamp(r.x * 1.5, 0.0, 1.0));
      
      // Increased intensity back to 0.18 for better visibility
      float lightIntensity = 0.45; 
      vec3 pageBg = vec3(0.976, 0.984, 0.992); // Matches tailwind slate-50
      vec3 finalColor = mix(pageBg, color, lightIntensity);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  }
`;

export default function ShaderAurora({ isDarkMode }) {
  const containerRef = useRef(null);
  const [hasWebGLFailed, setHasWebGLFailed] = useState(false);

  useEffect(() => {
    if (hasWebGLFailed) return;

    let renderer;
    try {
      renderer = new Renderer({ alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio, 1.5) });
      // Initialize size immediately
      renderer.setSize(window.innerWidth, window.innerHeight);
    } catch (err) {
      console.warn("ShaderAurora: WebGL context creation failed. Falling back gracefully.");
      setHasWebGLFailed(true);
      return;
    }

    const gl = renderer.gl;
    if (!gl) {
      console.warn("ShaderAurora: WebGL context creation failed. Falling back gracefully.");
      setHasWebGLFailed(true);
      return;
    }

    containerRef.current.appendChild(gl.canvas);
    gl.canvas.style.opacity = '0';
    gl.canvas.style.transition = 'opacity 1.5s ease-in-out';
    
    // Fade in after a brief delay to avoid flash
    setTimeout(() => {
      if (gl.canvas) gl.canvas.style.opacity = '1';
    }, 100);

    // Single full-screen triangle is more efficient than a quad
    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uIsDark: { value: isDarkMode ? 1.0 : 0.0 },
        // Dark Mode (#000000, #0e0f12, #22242a), Light Mode (#f4f5f7, #aeb4bf, #6b7280)
        uColor1: { value: isDarkMode ? [0.0, 0.0, 0.0] : [0.957, 0.961, 0.969] },
        uColor2: { value: isDarkMode ? [0.055, 0.059, 0.071] : [0.682, 0.706, 0.749] },
        uColor3: { value: isDarkMode ? [0.133, 0.141, 0.165] : [0.420, 0.447, 0.502] },
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    // Handle Resize
    let resizeTimeout;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100);
    };
    window.addEventListener('resize', resize, false);
    resize();

    // Render loop
    let rafId;
    let isVisible = true;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const update = (t) => {
      // 0.001 multiplier keeps the animation drifty and organic
      if (isVisible) {
        program.uniforms.uTime.value = t * 0.001;
        renderer.render({ scene: mesh });
      }

      if (isReducedMotion) {
        // Render exactly one frame then freeze
        renderer.render({ scene: mesh });
        return; 
      }

      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(rafId);
      
      if (containerRef.current && gl.canvas.parentNode === containerRef.current) {
        containerRef.current.removeChild(gl.canvas);
      }
      
      // ogl handles gl.getExtension('WEBGL_lose_context') internally on GC, but we can explicitly destroy
      // if we created custom buffers. Mesh/Program don't strictly require manual destroy in ogl for a single canvas,
      // but it's safe to let JS garbage collection handle the lost DOM node.
    };
  }, [hasWebGLFailed, isDarkMode]);

  if (hasWebGLFailed) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 bg-slate-50 dark:bg-[#0a0a0a]"
      aria-hidden="true"
    />
  );
}


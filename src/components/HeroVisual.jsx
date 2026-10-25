import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

export default function HeroVisual() {
  const containerRef = useRef(null);
  const logoWrapRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    
    // Hyper-clean, cinematic entrance
    // No bouncing, no chaotic 3D tilting. Just absolute precision.
    gsap.fromTo(logoWrapRef.current, 
      { autoAlpha: 0, y: 40, filter: 'blur(10px)' },
      { 
        autoAlpha: 1, 
        y: 0, 
        filter: 'blur(0px)', 
        duration: 1.6, 
        ease: 'expo.out', 
        delay: 0.3 
      }
    );
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[350px] lg:h-[500px] flex items-center justify-center"
    >
      {/* 
        STUDIO LIGHTING
        Instead of messy, colorful "AI glowing blobs", we use a highly controlled, 
        ultra-subtle elliptical gradient. It acts as a sheer studio spotlight hitting 
        a backdrop just enough to make the black text legible in dark mode, 
        without muddying the colors.
      */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[120%] h-[60%] bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.05)_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08)_0%,_transparent_70%)]" />
      </div>

      {/* 
        PRISTINE LOGO PRESENTATION
        Rendered flawlessly in pure IEEE Blue via CSS mask, matching the screenshot perfectly.
      */}
      <div 
        ref={logoWrapRef}
        className="relative z-10 w-full max-w-sm lg:max-w-lg px-8 transition-transform duration-700 hover:scale-[1.03] cursor-default flex items-center justify-center"
      >
        <div 
          className="w-full aspect-[2/1] bg-[#00629B]"
          style={{
            maskImage: 'url(/ieee-logo.svg)',
            WebkitMaskImage: 'url(/ieee-logo.svg)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
            filter: 'drop-shadow(0 24px 48px rgba(0,98,155,0.15))' 
          }}
        />
      </div>
    </div>
  );
}

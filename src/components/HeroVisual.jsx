import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

export default function HeroVisual() {
  const visualRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // Gentle infinite float
    gsap.to(visualRef.current, {
      y: -10,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

    // Chip core glowing pulse
    gsap.to('.core-glow', {
      scale: 1.15,
      opacity: 0.6,
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
      transformOrigin: 'center center'
    });

    // Trace circuit path pulses
    gsap.fromTo('.trace-path', 
      { strokeDashoffset: 200 },
      { 
        strokeDashoffset: -200, 
        duration: 3, 
        repeat: -1, 
        ease: 'power1.inOut',
        stagger: 1.5
      }
    );
  }, { scope: visualRef });

  return (
    <div ref={visualRef} className="relative w-full max-w-[360px] md:max-w-[420px] lg:max-w-[520px] mx-auto">
      <div className="absolute inset-0 bg-ieee-teal/20 rounded-full blur-[80px] -z-10" />
      <svg viewBox="0 0 480 480" fill="none" className="w-full h-auto drop-shadow-2xl" aria-hidden="true">
        <path d="M240 180 L240 80 L140 80" stroke="currentColor" strokeWidth="3" className="text-ieee-border" />
        <path d="M240 300 L240 400 L340 400" stroke="currentColor" strokeWidth="3" className="text-ieee-border" />
        <path d="M180 240 L80 240 L80 140" stroke="currentColor" strokeWidth="3" className="text-ieee-border" />
        <path d="M300 240 L400 240 L400 340" stroke="currentColor" strokeWidth="3" className="text-ieee-border" />
        
        {/* Animated Traces */}
        <path strokeDasharray="60 140" d="M240 180 L240 80 L140 80" stroke="currentColor" strokeWidth="3" className="trace-path text-ieee-teal" />
        <path strokeDasharray="60 140" d="M240 300 L240 400 L340 400" stroke="currentColor" strokeWidth="3" className="trace-path text-ieee-teal" />

        <rect x="180" y="180" width="120" height="120" rx="24" fill="currentColor" className="text-ieee-card stroke-ieee-blue" strokeWidth="4" />
        <rect x="210" y="210" width="60" height="60" rx="12" fill="currentColor" className="text-ieee-teal/20 stroke-ieee-teal" strokeWidth="2" />
        
        <circle cx="240" cy="240" r="16" fill="currentColor" className="core-glow text-ieee-teal" />

        <circle cx="140" cy="80" r="8" fill="currentColor" className="text-ieee-blue" />
        <circle cx="340" cy="400" r="8" fill="currentColor" className="text-ieee-blue" />
        <circle cx="80" cy="140" r="8" fill="currentColor" className="text-ieee-blue" />
        <circle cx="400" cy="340" r="8" fill="currentColor" className="text-ieee-blue" />

        <circle cx="240" cy="180" r="6" fill="currentColor" className="text-ieee-teal" />
        <circle cx="240" cy="300" r="6" fill="currentColor" className="text-ieee-teal" />
        <circle cx="180" cy="240" r="6" fill="currentColor" className="text-ieee-teal" />
        <circle cx="300" cy="240" r="6" fill="currentColor" className="text-ieee-teal" />
      </svg>
    </div>
  );
}

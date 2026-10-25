import React, { useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

export default function HeroParticles() {
  const containerRef = useRef(null);
  
  // Seed random positions once on mount so they don't jump on re-render
  const [particles] = useState(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      top: Math.random() * 100,
      size: Math.random() * 4 + 2, // 2px to 6px
      opacity: Math.random() * 0.25 + 0.15,
      // We also prepare random animation params
      duration: Math.random() * 7 + 8, // 8s to 15s
      xOffset: (Math.random() - 0.5) * 60, // ±30px
      yOffset: (Math.random() - 0.5) * 60,
      delay: Math.random() * -15 // Start at different points in their loop
    }));
  });

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    const elements = gsap.utils.toArray('.hero-particle');
    
    elements.forEach((el, i) => {
      const p = particles[i];
      gsap.to(el, {
        x: p.xOffset,
        y: p.yOffset,
        duration: p.duration,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: p.delay
      });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="hero-particle absolute rounded-full bg-ieee-blue dark:bg-ieee-accent"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            // Use hardware acceleration baseline
            willChange: prefersReducedMotion() ? 'auto' : 'transform'
          }}
        />
      ))}
    </div>
  );
}

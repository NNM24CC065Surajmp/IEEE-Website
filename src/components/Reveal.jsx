import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

export default function Reveal({ children, delay = 0, className = '' }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(containerRef.current, { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      containerRef.current,
      { autoAlpha: 0, y: 24 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        delay: delay / 1000,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, { scope: containerRef });

  // Use autoAlpha for better performance/accessibility than raw opacity
  // Initially hide it to prevent FOUC, GSAP will handle showing it
  return (
    <div ref={containerRef} className={className} style={{ visibility: 'hidden' }}>
      {children}
    </div>
  );
}

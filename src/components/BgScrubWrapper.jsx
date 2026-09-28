import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

export default function BgScrubWrapper({ children }) {
  const wrapperRef = useRef(null);
  
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    
    // We animate a CSS variable so it works automatically across light/dark modes
    gsap.to(document.documentElement, {
      '--bg-shift': '1',
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });

    return () => {
      gsap.set(document.documentElement, { '--bg-shift': '0' });
    };
  }, []);

  return (
    <div 
      ref={wrapperRef} 
      className="w-full min-h-screen transition-none relative z-10 "
      style={{
        backgroundColor: 'var(--scroll-bg, transparent)'
      }}
    >
      {children}
    </div>
  );
}

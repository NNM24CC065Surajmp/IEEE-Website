import React, { useState, useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

// Determine intro eligibility synchronously when file is parsed.
// This guarantees that child components (like Hero) know exactly
// if they should wait for the intro to finish before animating.
let isEligible = false;
try {
  isEligible = !prefersReducedMotion() && !sessionStorage.getItem('ieee-intro-seen');
} catch (e) {}

// Exported so other components can check it if needed, though we also set it on window.
window.ieeeIntroActive = isEligible;

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(isEligible);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const ringRef = useRef(null);
  const sequenceDone = useRef(false);

  useEffect(() => {
    if (!isVisible) return;

    // Lock scrolling while intro plays
    document.body.style.overflow = 'hidden';

    // Mark as seen immediately so reloads during intro don't replay it
    try {
      sessionStorage.setItem('ieee-intro-seen', 'true');
    } catch (e) {}

    const markDone = () => {
      if (sequenceDone.current) return;
      sequenceDone.current = true;
      document.body.style.overflow = 'auto';
      window.ieeeIntroActive = false;
      window.dispatchEvent(new CustomEvent('ieee-intro-complete'));
      setIsVisible(false);
    };

    // Hard fallback timeout just in case GSAP stalls
    const fallback = setTimeout(markDone, 4000);

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(fallback);
        markDone();
      }
    });

    // BEAT 1: Logo Entrance (0 to 0.8s)
    tl.fromTo(logoRef.current, 
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    // Subtle glowing underline reveals alongside logo
    tl.fromTo(ringRef.current,
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '<'
    );

    // BEAT 2: Brief Hold (Let it breathe)
    tl.to(logoRef.current, { duration: 0.35 });

    // BEAT 3: Expand and Reveal
    // We use a CSS variable to animate a radial mask that acts as a "wipe"
    const maxRadius = Math.max(window.innerWidth, window.innerHeight) * 1.5;
    
    // Setting initial state of the mask radius
    gsap.set(containerRef.current, { '--reveal-r': '0px' });
    
    tl.addLabel('expand');
    
    // The logo itself slightly scales up and fades out as we "zoom through" it
    tl.to([logoRef.current, ringRef.current], {
      scale: 1.5,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.inOut'
    }, 'expand');

    // Simultaneously, the mask expands outward uncovering the page underneath
    let proxy = { r: 0 };
    tl.to(proxy, {
      r: maxRadius,
      duration: 1.0, // Slower for premium feel (1.0s)
      ease: 'power3.inOut',
      onUpdate: () => {
        if (containerRef.current) {
          containerRef.current.style.setProperty('--reveal-r', `${proxy.r}px`);
        }
      }
    }, 'expand');

    return () => clearTimeout(fallback);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto"
      role="status"
      style={{
        backgroundColor: '#05060A', // Matching the dark theme base
        // The mask creates a transparent circle that grows, cutting a hole through the solid background
        WebkitMaskImage: 'radial-gradient(circle at center, transparent var(--reveal-r), black calc(var(--reveal-r) + 1px))',
        maskImage: 'radial-gradient(circle at center, transparent var(--reveal-r), black calc(var(--reveal-r) + 1px))'
      }}
    >
      <span className="sr-only">Loading IEEE NMAMIT</span>
      
      {/* Centered Premium Logo */}
      <div ref={logoRef} className="flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center font-mono font-bold text-[28px] bg-ieee-blue text-white shadow-[0_0_40px_rgba(0,98,155,0.4)]">
          IE
        </div>
        <span className="text-3xl md:text-4xl font-bold tracking-tight text-white font-heading">
          IEEE NMAMIT
        </span>
        {/* Subtle glowing underline */}
        <div 
          ref={ringRef} 
          className="w-full max-w-[120px] h-[1px] bg-ieee-teal shadow-[0_0_15px_rgba(0,150,214,0.8)] mt-2" 
        />
      </div>
    </div>
  );
}

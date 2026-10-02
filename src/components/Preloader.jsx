import React, { useState, useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

let isEligible = false;
try {
  isEligible = !prefersReducedMotion() && !sessionStorage.getItem('ieee-intro-seen');
} catch (e) {}

window.ieeeIntroActive = isEligible;

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(isEligible);
  const bgRef = useRef(null);
  const logoRef = useRef(null);
  const sequenceDone = useRef(false);

  useEffect(() => {
    if (!isVisible) return;
    document.body.style.overflow = 'hidden';
    try { sessionStorage.setItem('ieee-intro-seen', 'true'); } catch (e) {}

    const markDone = () => {
      if (sequenceDone.current) return;
      sequenceDone.current = true;
      document.body.style.overflow = 'auto';
      window.ieeeIntroActive = false;
      window.dispatchEvent(new CustomEvent('ieee-intro-complete'));
      setIsVisible(false);
    };

    const fallback = setTimeout(markDone, 6000);

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(fallback);
        markDone();
      }
    });

    // BEAT 1: Cinematic Logo Entrance
    tl.fromTo(logoRef.current, 
      { scale: 0.85, opacity: 0, filter: 'blur(20px)' },
      { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.8, ease: 'power2.out' }
    );

    // BEAT 2: The Breathe (Hold)
    tl.to(logoRef.current, { 
      scale: 1.05, 
      duration: 1.0, 
      ease: 'sine.inOut' 
    });

    // BEAT 3: The "Depth of Field" Dissolve
    // This is the absolute pinnacle of luxury UI animation (Apple style).
    // No splitting, no grids. Just an incredibly sophisticated rack-focus effect.
    tl.addLabel('defocus');

    // The logo gracefully swells and dissolves into a soft light burst
    tl.to(logoRef.current, {
      scale: 1.4,
      opacity: 0,
      filter: 'blur(30px)',
      duration: 1.6,
      ease: 'power2.inOut'
    }, 'defocus');

    // The solid black background fades into transparency, revealing the heavily blurred homepage
    tl.to(bgRef.current, {
      backgroundColor: 'rgba(5, 6, 10, 0)',
      duration: 1.4,
      ease: 'power2.inOut'
    }, 'defocus');

    // Simultaneously, the frosted glass un-blurs, bringing the homepage into razor-sharp focus
    let proxy = { blur: 40 };
    tl.to(proxy, {
      blur: 0,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (bgRef.current) {
          bgRef.current.style.backdropFilter = `blur(${proxy.blur}px)`;
          bgRef.current.style.WebkitBackdropFilter = `blur(${proxy.blur}px)`;
        }
      }
    }, 'defocus');

    return () => clearTimeout(fallback);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] pointer-events-auto flex items-center justify-center overflow-hidden"
      role="status"
    >
      <span className="sr-only">Loading IEEE NMAMIT</span>

      {/* 
        The Cinematic Glass Pane
        Starts completely solid black. 
        Transitions into a clearing frosted glass window over the homepage.
      */}
      <div 
        ref={bgRef}
        className="absolute inset-0"
        style={{ 
          backgroundColor: 'rgba(5, 6, 10, 1)', 
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)'
        }} 
      >
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      </div>

      {/* Official IEEE Logo colored in IEEE Blue via CSS Mask */}
      <div 
        ref={logoRef} 
        className="relative z-10 w-full max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg aspect-[2/1] bg-[#00629B]"
        style={{
          maskImage: 'url(/ieee-logo.svg)',
          WebkitMaskImage: 'url(/ieee-logo.svg)',
          maskSize: 'contain',
          WebkitMaskSize: 'contain',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
          filter: 'drop-shadow(0 0 40px rgba(0,98,155,0.4))'
        }}
      />
      
    </div>
  );
}

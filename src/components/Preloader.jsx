import React, { useState, useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if the user has already seen the video this session
    let hasSeen = false;
    try {
      hasSeen = sessionStorage.getItem('ieee-video-intro');
    } catch (e) {}

    // If they've seen it or prefer reduced motion, skip the intro immediately
    if (prefersReducedMotion() || hasSeen) {
      setIsVisible(false);
      return;
    }

    // Otherwise, mark it as seen so it doesn't play again on refresh
    try {
      sessionStorage.setItem('ieee-video-intro', 'true');
    } catch (e) {}

    // Force the video to attempt playback when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        console.warn("Video autoplay blocked by browser:", e);
      });
    }
  }, []);

  const finishIntro = () => {
    if (!containerRef.current) return;
    
    // Beautiful subtle transition: scale up slightly and fade out
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 1.2,
      ease: 'power3.inOut',
      onComplete: () => setIsVisible(false)
    });
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={finishIntro}
      role="status"
    >
      <span className="sr-only">Playing Intro Video...</span>
      
      {/* 
        Using object-cover to ensure the video fills the entire screen
      */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={finishIntro}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/ieee.mp4" type="video/mp4" />
      </video>

      {/* Subtle Skip Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-xs font-mono tracking-widest uppercase pointer-events-none mix-blend-difference">
        Click anywhere to skip
      </div>
    </div>
  );
}

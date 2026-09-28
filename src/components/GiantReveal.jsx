import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

export default function GiantReveal() {
  const containerRef = useRef(null);
  const text = "Empowering student innovators to build, connect, and lead the future.";
  const words = text.split(" ");

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    
    gsap.fromTo('.reveal-word', 
      { opacity: 0.1, y: 30, filter: 'blur(8px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'bottom 50%',
          scrub: 1
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center section-padding z-30 bg-white dark:bg-[#05070a]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ieee-blue/5 to-transparent pointer-events-none" />
      <h2 className="text-[clamp(2.5rem,8vw,6rem)] font-heading font-black leading-[1.1] max-w-7xl mx-auto text-center relative z-10">
        {words.map((word, i) => (
          <span key={i} className="reveal-word inline-block mx-[0.5vw] text-slate-900 dark:text-white">
            {word}
          </span>
        ))}
      </h2>
    </section>
  );
}

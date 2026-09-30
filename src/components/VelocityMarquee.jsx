import React, { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

export default function VelocityMarquee({ 
  words = ["INNOVATE", "BUILD", "CONNECT"], 
  baseSpeed = 0.05, 
  className = "" 
}) {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    let xPercent = 0;
    let speed = baseSpeed;
    let targetSpeed = baseSpeed;
    let direction = -1; // -1 = scrolling down (move left), 1 = scrolling up (move right)

    // Listen to window scroll velocity
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const v = self.getVelocity();
        // Only flip direction on meaningful scroll to avoid jitter
        if (Math.abs(v) > 20) {
          direction = v > 0 ? -1 : 1;
        }
        
        // Map raw velocity (px/sec) to an added speed multiplier
        const addedSpeed = gsap.utils.clamp(0, 1.5, Math.abs(v) / 1000);
        targetSpeed = baseSpeed + addedSpeed;
      }
    });

    const ticker = () => {
      // 1. Decay target speed back down to baseSpeed when not scrolling
      targetSpeed += (baseSpeed - targetSpeed) * 0.1;
      
      // 2. Smoothly ease actual speed toward targetSpeed
      speed += (targetSpeed - speed) * 0.1;

      // 3. Calculate dynamic skew based purely on the excess speed above base
      let skew = (speed - baseSpeed) * 15 * direction;
      skew = gsap.utils.clamp(-12, 12, skew);

      // 4. Update position
      xPercent += speed * direction;
      
      // 5. Seamless infinite loop boundaries
      if (xPercent <= -100) xPercent += 100;
      if (xPercent > 0) xPercent -= 100;

      // Apply updates to both marquee parts
      gsap.set('.marquee-part', { 
        xPercent: xPercent, 
        skewX: skew 
      });
    };

    gsap.ticker.add(ticker);

    return () => {
      gsap.ticker.remove(ticker);
      st.kill();
    };
  }, { scope: containerRef });

  const renderPhraseGroup = (repIndex) => {
    return (
      <div key={repIndex} className="flex items-center">
        {words.map((word, wordIndex) => (
          <React.Fragment key={wordIndex}>
            <span className="font-heading text-5xl md:text-7xl lg:text-[7rem] font-extrabold uppercase tracking-tight leading-none bg-gradient-to-r from-ieee-blue to-ieee-teal bg-clip-text text-transparent opacity-90">
              {word}
            </span>
            <span className="text-ieee-teal/70 dark:text-ieee-teal/50 px-6 md:px-10 text-3xl md:text-4xl lg:text-5xl flex items-center justify-center">
              •
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <section 
      className={`relative w-full py-10 md:py-16 select-none border-y border-slate-200/50 dark:border-white/5 bg-gradient-to-b from-transparent via-slate-100/50 to-transparent dark:via-white/[0.02] my-8 ${className}`}
      aria-label="Scrolling Highlights"
    >
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden flex"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <div className="marquee-part flex items-center whitespace-nowrap shrink-0">
          {[0, 1, 2, 3].map(i => renderPhraseGroup(i))}
        </div>
        
        <div className="marquee-part flex items-center whitespace-nowrap shrink-0" aria-hidden="true">
          {[4, 5, 6, 7].map(i => renderPhraseGroup(i))}
        </div>
      </div>
    </section>
  );
}

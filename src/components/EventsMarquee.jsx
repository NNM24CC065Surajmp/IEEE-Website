import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';
import { EVENTS_DATA as events } from '../data/events';

export default function EventsMarquee() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  
  // Duplicate events array to create a seamless infinite loop
  const marqueeEvents = events && events.length > 0 
    ? [...events, ...events, ...events].slice(0, 8) 
    : [];

  useGSAP(() => {
    if (prefersReducedMotion() || marqueeEvents.length === 0) return;

    // Calculate duration based on width for constant speed (approx 50px/sec)
    // 100% of the duplicate set width
    const animation = gsap.to(trackRef.current, {
      xPercent: -50,
      repeat: -1,
      ease: 'none',
      duration: 20 
    });

    // Pause on hover
    const container = containerRef.current;
    const pause = () => animation.pause();
    const play = () => animation.play();

    container.addEventListener('mouseenter', pause);
    container.addEventListener('mouseleave', play);
    container.addEventListener('focusin', pause);
    container.addEventListener('focusout', play);

    return () => {
      container.removeEventListener('mouseenter', pause);
      container.removeEventListener('mouseleave', play);
      container.removeEventListener('focusin', pause);
      container.removeEventListener('focusout', play);
      animation.kill();
    };
  }, { scope: containerRef });

  if (marqueeEvents.length === 0) return null;

  return (
    <section ref={containerRef} className="py-12 overflow-hidden bg-slate-100 dark:bg-[#080a11] border-y border-slate-200 dark:border-zinc-800/50">
      <div className="flex flex-col items-center mb-10">
        <span className="text-xs font-mono uppercase tracking-widest text-ieee-blue dark:text-ieee-teal font-bold mb-2">
          Gallery
        </span>
        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Past Highlights</h2>
      </div>

      <div className="relative w-full overflow-hidden flex" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
        <div 
          ref={trackRef} 
          className="flex gap-6 px-3"
          style={{ width: 'max-content' }}
        >
          {marqueeEvents.map((event, i) => (
            <div 
              // Using index in key since items are duplicated
              key={`${event.id}-${i}`} 
              className="relative w-[280px] sm:w-[320px] aspect-video rounded-xl overflow-hidden group shrink-0 bg-slate-900 border border-slate-200 dark:border-ieee-border shadow-sm"
            >
              {event.image ? (
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-ieee-blue/30 to-slate-900 flex items-center justify-center">
                  <span className="text-white/20 font-heading font-bold text-xl">IEEE</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                <span className="text-white font-heading font-bold text-sm leading-snug transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {event.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

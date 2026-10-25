import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

const features = [
  {
    id: '01',
    title: 'Hands-on Workshops',
    description: 'Master industry-relevant skills in AI, Web Dev, and Hardware through interactive weekend sprints.'
  },
  {
    id: '02',
    title: 'Global Network',
    description: 'Connect with a worldwide community of engineering professionals, alumni, and researchers.'
  },
  {
    id: '03',
    title: 'Hackathons & Competitions',
    description: 'Form elite teams to compete in national-level hackathons and build portfolio-ready projects.'
  }
];

export default function WhyJoin() {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    
    gsap.from('.feature-card', {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="section-container section-padding">
      <div className="flex flex-col items-center text-center mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-ieee-blue dark:text-ieee-teal font-bold mb-2">
          Benefits
        </span>
        <h2 className="section-title mb-3 text-slate-900 dark:text-white">Why Join IEEE</h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl">
          We bridge the gap between academic theory and real-world engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {features.map((feat) => (
          <div key={feat.id} className="feature-card card relative overflow-hidden group">
            {/* Massive faded number behind the content */}
            <div 
              className="absolute -right-4 -top-8 text-[120px] font-heading font-black opacity-[0.03] dark:opacity-[0.02] text-slate-900 dark:text-white select-none pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:-translate-x-2"
              aria-hidden="true"
            >
              {feat.id}
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <span className="text-sm font-mono font-bold text-ieee-blue dark:text-ieee-teal mb-4">
                {feat.id}
              </span>
              <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-3">
                {feat.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mt-auto">
                {feat.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

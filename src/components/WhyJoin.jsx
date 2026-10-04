import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

const features = [
  {
    id: '01',
    title: 'Hands-on Workshops',
    description: 'Master industry-relevant skills in AI, Web Dev, and Hardware through interactive weekend sprints led by experts.'
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
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="section-container py-24 md:py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-ieee-blue dark:text-ieee-teal font-semibold mb-3 block">
            The Advantage
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight max-w-xl">
            Why Join IEEE
          </h2>
        </div>
        <p className="text-base text-slate-600 dark:text-zinc-400 max-w-sm md:text-right font-medium">
          We bridge the gap between academic theory and real-world engineering.
        </p>
      </div>

      {/* Asymmetrical Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Card 1: Large Featured Card */}
        <div className="feature-card lg:col-span-2 relative p-8 sm:p-12 rounded-[2rem] bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 overflow-hidden group">
          {/* Subtle gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-ieee-blue/5 to-transparent dark:from-ieee-teal/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="absolute -right-8 -bottom-12 text-[180px] font-heading font-black opacity-[0.03] dark:opacity-[0.02] text-slate-900 dark:text-white select-none pointer-events-none transition-transform duration-700 group-hover:scale-105 group-hover:-translate-x-4">
            {features[0].id}
          </div>
          
          <div className="relative z-10 flex flex-col h-full md:w-2/3">
            <span className="inline-block px-3 py-1 bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-full text-xs font-bold mb-6 w-fit">
              {features[0].id}
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 dark:text-white mb-4">
              {features[0].title}
            </h3>
            <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mt-auto">
              {features[0].description}
            </p>
          </div>
        </div>

        {/* Card 2 & 3: Stacked or Side-by-Side */}
        <div className="flex flex-col gap-6 lg:gap-8 lg:col-span-1">
          {[features[1], features[2]].map((feat) => (
            <div key={feat.id} className="feature-card flex-1 relative p-8 rounded-[1.5rem] bg-white dark:bg-[#101321] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none overflow-hidden group hover:border-slate-300 dark:hover:border-white/10 transition-colors">
              <div className="absolute -right-4 -bottom-6 text-[100px] font-heading font-black opacity-[0.02] dark:opacity-[0.015] text-slate-900 dark:text-white select-none pointer-events-none transition-transform duration-700 group-hover:scale-105 group-hover:-translate-x-2">
                {feat.id}
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <span className="text-xs font-mono font-bold text-slate-400 dark:text-zinc-500 mb-4">
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

      </div>
    </section>
  );
}

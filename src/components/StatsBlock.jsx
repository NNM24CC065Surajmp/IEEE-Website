import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

const statsData = [
  { id: 1, target: 36, label: 'Hour Hackathons', suffix: 'h' },
  { id: 2, target: 60, label: 'Elite Teams', suffix: '+' },
  { id: 3, target: 15, label: 'Events Hosted', suffix: '+' }
];

export default function StatsBlock() {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // Stagger fade up for the containers
    gsap.from('.stat-container', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="section-container pb-16 md:pb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-y border-slate-200 dark:border-ieee-border bg-slate-50/50 dark:bg-ieee-surface/50 rounded-3xl">
        {statsData.map((stat, index) => (
          <div key={stat.id} className="stat-container">
            <StatCounter stat={stat} parentRef={containerRef} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

function StatCounter({ stat, parentRef, index }) {
  const numRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion() || !numRef.current) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: stat.target,
      duration: 2.5,
      ease: 'power2.out',
      delay: index * 0.2,
      onUpdate: () => {
        if (numRef.current) {
          numRef.current.textContent = Math.floor(obj.val);
        }
      },
      scrollTrigger: {
        trigger: parentRef.current,
        start: 'top 85%',
        once: true
      }
    });
  }, { scope: parentRef });

  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      <div className="flex items-baseline gap-1 text-slate-900 dark:text-white mb-2">
        <span 
          ref={numRef} 
          className="font-heading text-5xl md:text-6xl font-black tabular-nums"
        >
          {prefersReducedMotion() ? stat.target : "0"}
        </span>
        {stat.suffix && (
          <span className="font-heading text-2xl md:text-3xl font-bold text-ieee-blue dark:text-ieee-teal">
            {stat.suffix}
          </span>
        )}
      </div>
      <span className="text-sm font-mono uppercase tracking-wider text-slate-600 dark:text-zinc-400 font-semibold">
        {stat.label}
      </span>
    </div>
  );
}

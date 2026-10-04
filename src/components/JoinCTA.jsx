import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

export default function JoinCTA() {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from('.cta-heading', { 
      y: 30, 
      opacity: 0, 
      duration: 0.8, 
      ease: 'power3.out', 
      scrollTrigger: { trigger: containerRef.current, start: 'top 85%' } 
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="cta-container section-container py-24 md:py-32">
      <Reveal>
        <div className="relative group">
          {/* Asymmetrical backdrop shadows */}
          <div className="absolute inset-0 bg-ieee-blue/5 dark:bg-ieee-teal/5 rounded-[2rem] rounded-tr-[6rem] sm:rounded-tr-[8rem] transform translate-y-4 translate-x-2 sm:translate-x-4 transition-transform duration-500 group-hover:translate-y-6 group-hover:translate-x-6" />
          
          {/* Main Card */}
          <div className="relative overflow-hidden rounded-[2rem] rounded-tr-[6rem] sm:rounded-tr-[8rem] border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-8 sm:p-12 md:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)]">
            
            {/* Glows */}
            <div aria-hidden="true" className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-ieee-blue/10 dark:bg-ieee-teal/10 blur-[100px] pointer-events-none" />
            <div aria-hidden="true" className="absolute -bottom-24 -left-24 w-[300px] h-[300px] rounded-full bg-slate-200/50 dark:bg-zinc-800/50 blur-[80px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl flex flex-col md:flex-row gap-12 items-start md:items-center justify-between">
              
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800 mb-8">
                  Become a Member
                </div>
                <h2 className="cta-heading font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-6">
                  Ready to build <br/> the future?
                </h2>
              </div>

              <div className="flex-1 w-full max-w-md">
                <p className="text-base text-slate-600 dark:text-zinc-300 leading-relaxed mb-8 font-medium">
                  Join IEEE NMAMIT Student Branch to gain hands-on technical experience, collaborate on national hackathon teams, and connect with a worldwide professional network.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Link
                    to="/join"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-sm font-bold transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 dark:focus-visible:ring-white"
                  >
                    <span>Join Our Chapter</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

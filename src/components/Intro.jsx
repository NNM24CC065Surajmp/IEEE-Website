import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { site } from '../data/site';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

export default function Intro() {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    
    gsap.from('.intro-elem', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative section-container py-24 md:py-36 overflow-hidden">
      {/* Intentional deep space background blur to break flatness */}
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-ieee-blue/10 dark:bg-ieee-teal/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 relative z-10">
        
        {/* Left Column: Bold Typography, breaking the grid slightly */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="intro-elem flex items-center gap-4 mb-8">
            <div className="w-12 h-[2px] bg-ieee-blue dark:bg-ieee-teal/70" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400 font-semibold">
              IEEE NMAMIT
            </span>
          </div>
          <h2 className="intro-elem font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            Engineering <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ieee-blue to-[#0096D6] dark:from-white dark:to-zinc-500">The Future.</span>
          </h2>
        </div>

        {/* Right Column: Glassmorphic panel for body text */}
        <div className="lg:col-span-7 lg:pl-12">
          <div className="intro-elem relative p-8 sm:p-10 rounded-[2rem] rounded-tl-none border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
            <p className="text-lg sm:text-xl text-slate-700 dark:text-zinc-300 leading-relaxed mb-8 font-medium">
              {site.shortIntro}
            </p>
            <Link
              to="/about"
              className="group inline-flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white transition-colors"
            >
              <span className="border-b-2 border-transparent group-hover:border-ieee-blue dark:group-hover:border-ieee-teal pb-0.5 transition-colors">
                Discover Our Story
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-ieee-blue group-hover:text-white dark:group-hover:bg-ieee-teal dark:group-hover:text-zinc-900 transition-colors">
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none" />
              </div>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

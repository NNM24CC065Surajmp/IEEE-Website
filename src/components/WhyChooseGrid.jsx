import React, { useRef } from 'react';
import { Terminal, Users, Award, Globe } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

const PERKS = [
  {
    icon: Terminal,
    title: 'Technical Workshops & Bootcamps',
    desc: 'Get exclusive access to hands-on sessions in AI/ML, Embedded Systems, IoT, Web3, and Cloud computing.',
    categoryColor: 'text-[#0096D6]',
    iconBg: 'bg-[#0096D6]/10 dark:bg-[#0096D6]/20',
    borderHover: 'hover:border-[#0096D6]/60',
    glowColor: 'rgba(0,150,214,0.12)',
    circuitAccent: '#0096D6',
  },
  {
    icon: Users,
    title: 'Flagship Hackathons & Competitions',
    desc: 'Form teams for 36-hour national hackathons with mentorship from experienced seniors and industry alumni.',
    categoryColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    borderHover: 'hover:border-emerald-500/60',
    glowColor: 'rgba(16,185,129,0.12)',
    circuitAccent: '#10B981',
  },
  {
    icon: Award,
    title: 'Leadership & Project Opportunities',
    desc: 'Organize campus-wide symposiums, lead society initiatives, and showcase projects on your verified member profile.',
    categoryColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    borderHover: 'hover:border-amber-500/60',
    glowColor: 'rgba(245,158,11,0.12)',
    circuitAccent: '#F59E0B',
  },
  {
    icon: Globe,
    title: 'Global IEEE Network & Xplore',
    desc: 'Access thousands of peer-reviewed research papers and connect with researchers across IEEE Region 10.',
    categoryColor: 'text-purple-500',
    iconBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    borderHover: 'hover:border-purple-500/60',
    glowColor: 'rgba(168,85,247,0.12)',
    circuitAccent: '#A855F7',
  },
];

export default function WhyChooseGrid() {
  const gridRef = useRef(null);
  const isReduced = prefersReducedMotion();

  useGSAP(() => {
    if (isReduced) {
      gsap.set('.why-choose-card', { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      '.why-choose-card',
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, { scope: gridRef });

  return (
    <div ref={gridRef} className="relative">
      <div className="text-center mb-12">
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
          Why Engineers Choose IEEE NMAMIT
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PERKS.map((perk, index) => {
          const Icon = perk.icon;
          return (
            <div
              key={perk.title}
              className={`why-choose-card relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-[#090C14]/70 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-start shadow-[0_10px_30px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] ${perk.borderHover} ${
                isReduced ? '' : 'transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]'
              }`}
              style={{
                visibility: isReduced ? 'visible' : 'hidden',
              }}
            >
              {/* Circuit Trace Background Texture Detail at Low Opacity */}
              <svg
                className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.12] pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,40 L60,40 L90,70 L150,70 L170,90 L200,90 M80,200 L80,140 L110,110 L160,110 L190,140 L200,140 M0,160 L40,160 L70,130 L70,90"
                  fill="none"
                  stroke={perk.circuitAccent}
                  strokeWidth="1.5"
                />
                <circle cx="60" cy="40" r="3" fill={perk.circuitAccent} />
                <circle cx="150" cy="70" r="3" fill={perk.circuitAccent} />
                <circle cx="110" cy="110" r="3" fill={perk.circuitAccent} />
                <circle cx="70" cy="130" r="3" fill={perk.circuitAccent} />
              </svg>

              {/* Ambient Category Glow at Corner */}
              <div 
                className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl pointer-events-none"
                style={{ backgroundColor: perk.glowColor }}
              />

              {/* Differentiated Category Icon Container */}
              <div className="relative z-10 flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl ${perk.iconBg} border border-black/5 dark:border-white/10 flex items-center justify-center ${perk.categoryColor} shadow-inner`}>
                  <Icon size={22} strokeWidth={1.8} />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-600">
                  0{index + 1}
                </span>
              </div>

              {/* Card Title & Content */}
              <div className="relative z-10">
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-2.5 leading-snug">
                  {perk.title}
                </h3>
                <p className="text-slate-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed font-normal">
                  {perk.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

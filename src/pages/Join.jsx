import React from 'react';
import { Sparkles } from 'lucide-react';
import Reveal from '../components/Reveal';
import JoinStepCards from '../components/JoinStepCards';
import WhyChooseGrid from '../components/WhyChooseGrid';

export default function Join({ onNavigate, onOpenAuth, authUser }) {
  return (
    <div className="relative min-h-screen pt-36 sm:pt-44 pb-24 overflow-hidden selection:bg-[#00629B]/20 isolate z-10">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#00629B]/15 via-[#0096D6]/10 to-transparent blur-[140px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest text-[#00629B] dark:text-[#0096D6] bg-[#00629B]/10 dark:bg-[#0096D6]/10 border border-[#00629B]/20 dark:border-[#0096D6]/20 mb-6">
              <Sparkles size={14} />
              <span>Membership Drive 2026–2027</span>
            </div>
            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white uppercase tracking-tight mb-5">
              BUILD YOUR FUTURE WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00629B] to-[#0096D6]">IEEE NMAMIT</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">
              Step into the world&apos;s largest technical society. Join our student branch to innovate, publish research, collaborate on hackathons, and accelerate your engineering career.
            </p>
          </div>
        </Reveal>

        {/* Elevated 2-Step Journey Cards with Conductive Spine */}
        <JoinStepCards
          onNavigate={onNavigate}
          onOpenAuth={onOpenAuth}
          authUser={authUser}
        />

        {/* Differentiated 'Why Engineers Choose IEEE NMAMIT' 4-Card Grid */}
        <WhyChooseGrid />
      </div>
    </div>
  );
}

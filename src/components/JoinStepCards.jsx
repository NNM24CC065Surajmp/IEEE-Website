import React from 'react';
import { UserPlus, ArrowRight, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { prefersReducedMotion } from '../lib/motion';

export default function JoinStepCards({ onNavigate, onOpenAuth, authUser }) {
  const isReduced = prefersReducedMotion();

  return (
    <div className="relative mb-24">
      {/* 
        CONNECTING JOURNEY SPINE (Affiliation-Ladder Visual Language from AboutPage)
        In desktop (md+): horizontal conductive trace with central junction node.
        In mobile: vertical conductive trace connecting step 1 to step 2.
      */}
      <div 
        aria-hidden="true" 
        className="hidden md:flex absolute top-1/2 left-1/4 right-1/4 -translate-y-1/2 items-center justify-center pointer-events-none z-0"
      >
        {/* Continuous conductive trace */}
        <div className="w-full h-[2px] bg-gradient-to-r from-[#00629B]/40 via-[#0096D6] to-emerald-500/40 dark:from-[#4DA3D9]/30 dark:via-[#00F2FE]/80 dark:to-emerald-400/30" />
        
        {/* Central Signal Junction Node */}
        <div className="absolute flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 dark:bg-[#07090E] border-2 border-[#0096D6] shadow-[0_0_15px_rgba(0,150,214,0.4)]">
          <Sparkles size={14} className="text-[#0096D6] animate-pulse" />
        </div>
      </div>

      {/* Mobile Vertical Connecting Spine between cards */}
      <div 
        aria-hidden="true"
        className="md:hidden flex justify-center my-4 pointer-events-none"
      >
        <div className="flex flex-col items-center">
          <div className="w-[2px] h-8 bg-gradient-to-b from-[#00629B] to-[#0096D6]" />
          <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-[#07090E] border-2 border-[#0096D6] flex items-center justify-center shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#0096D6]" />
          </div>
          <div className="w-[2px] h-8 bg-gradient-to-b from-[#0096D6] to-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
        {/* =========================================================
            STEP 01: Create Branch Account (Campus Tier)
        ========================================================= */}
        <div className={`relative rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/85 dark:bg-[#080B12]/85 backdrop-blur-2xl p-7 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1),_0_0_25px_rgba(0,98,155,0.06)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6),_0_0_30px_rgba(0,150,214,0.1)] group hover:border-[#00629B]/60 dark:hover:border-[#0096D6]/60 ${
          isReduced ? '' : 'transition-all duration-500 hover:-translate-y-1.5'
        }`}>
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#00629B]/15 via-transparent to-transparent rounded-tr-3xl pointer-events-none" />

          <div>
            {/* Step Marker Badge with Junction Indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#00629B] dark:text-[#0096D6] bg-[#00629B]/10 dark:bg-[#0096D6]/15 border border-[#00629B]/20 dark:border-[#0096D6]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00629B] dark:bg-[#0096D6]" />
                <span>Step 01 · NMAMIT Students</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-zinc-600">01 / 02</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
              Create Branch Account
            </h2>
            
            <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 font-normal">
              Sign up with your official <code>@nmamit.in</code> college Google account to activate your student branch portal, track registered events, and manage your member profile.
            </p>

            <ul className="space-y-3 mb-8 text-xs font-mono text-slate-700 dark:text-zinc-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-[#00629B] dark:text-[#0096D6] shrink-0" />
                <span>Auto USN, batch & branch detection</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-[#00629B] dark:text-[#0096D6] shrink-0" />
                <span>Access member-only hackathons & sessions</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-[#00629B] dark:text-[#0096D6] shrink-0" />
                <span>Receive certificate & achievement records</span>
              </li>
            </ul>
          </div>

          <div>
            {authUser ? (
              <button
                type="button"
                onClick={() => onNavigate?.('profile')}
                className={`group/btn relative w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#00629B] via-[#0077b6] to-[#0096D6] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#00629B]/25 hover:shadow-[#0096D6]/40 cursor-pointer overflow-hidden ${
                  isReduced ? '' : 'transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                <span>View Your Profile</span>
                <ArrowRight size={15} className={isReduced ? '' : 'transition-transform duration-300 group-hover/btn:translate-x-1'} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth?.('register')}
                className={`group/btn relative w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#00629B] via-[#0077b6] to-[#0096D6] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#00629B]/25 hover:shadow-[#0096D6]/40 cursor-pointer overflow-hidden ${
                  isReduced ? '' : 'transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0'
                }`}
              >
                <UserPlus size={16} className={isReduced ? '' : 'transition-transform duration-300 group-hover/btn:scale-110'} />
                <span>Sign Up for Student Branch</span>
                <ArrowRight size={15} className={isReduced ? '' : 'transition-transform duration-300 group-hover/btn:translate-x-1'} />
              </button>
            )}
          </div>
        </div>

        {/* =========================================================
            STEP 02: IEEE Global Membership (International Tier)
        ========================================================= */}
        <div className={`relative rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/85 dark:bg-[#080B12]/85 backdrop-blur-2xl p-7 sm:p-10 flex flex-col justify-between shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1),_0_0_25px_rgba(16,185,129,0.06)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6),_0_0_30px_rgba(16,185,129,0.1)] group hover:border-emerald-500/60 dark:hover:border-emerald-400/60 ${
          isReduced ? '' : 'transition-all duration-500 hover:-translate-y-1.5'
        }`}>
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-500/15 via-transparent to-transparent rounded-tr-3xl pointer-events-none" />

          <div>
            {/* Step Marker Badge with Junction Indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 dark:border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                <span>Step 02 · Global Credential</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-zinc-600">02 / 02</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
              IEEE Global Membership
            </h2>
            
            <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 font-normal">
              Join the international IEEE organization to receive your official 8-digit IEEE Member ID, discounts on IEEE conferences worldwide, and full access to IEEE Spectrum & Xplore.
            </p>

            <ul className="space-y-3 mb-8 text-xs font-mono text-slate-700 dark:text-zinc-300">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>Official 8-digit IEEE Member Number</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>IEEE @ieee.org Google alias email</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                <span>Discounted conference & publication fees</span>
              </li>
            </ul>
          </div>

          <div>
            <a
              href="https://www.ieee.org/membership/join/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className={`group/btn relative w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-100/80 dark:bg-zinc-900/90 text-slate-800 dark:text-zinc-200 font-mono font-bold text-xs uppercase tracking-wider hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] cursor-pointer overflow-hidden ${
                isReduced ? '' : 'transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              <Globe size={15} className={isReduced ? '' : 'transition-transform duration-300 group-hover/btn:scale-110'} />
              <span>Join IEEE International</span>
              <ArrowRight size={15} className={isReduced ? '' : 'transition-transform duration-300 group-hover/btn:translate-x-1'} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

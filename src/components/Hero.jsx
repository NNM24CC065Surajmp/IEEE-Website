import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import HeroVisual from './HeroVisual';

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden flex items-center pt-24 pb-16 z-0">
      {/* Background Decor */}
      <div className="absolute inset-0 z-[-1] opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-ieee-blue/20 rounded-full blur-[120px] z-[-1] pointer-events-none motion-reduce:hidden" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-ieee-teal/20 rounded-full blur-[120px] z-[-1] pointer-events-none motion-reduce:hidden" />

      <div className="section-container w-full relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column (Text) */}
          <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left w-full">
            
            <div className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ieee-teal/30 bg-ieee-teal/10 text-ieee-teal text-xs font-semibold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 rounded-full bg-ieee-teal animate-pulse-glow motion-reduce:animate-none" />
              Student Branch
            </div>
            
            <h1 className="animate-fade-up font-heading font-bold flex flex-col mb-6 w-full" style={{ animationDelay: '100ms' }}>
              <span className="text-4xl sm:text-5xl lg:text-7xl text-slate-100 mb-2 leading-tight">
                IEEE <span 
                  className="bg-gradient-to-r from-ieee-blue to-ieee-teal bg-clip-text text-transparent pb-1"
                  style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 150, 214, 0.3))' }}
                >NMAMIT</span>
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl text-slate-400 font-medium">
                Student Branch
              </span>
            </h1>

            {/* TAGLINE OPTIONS:
                Option 1: Empowering student innovators to build, connect, and lead.
                Option 2: Hardware, code, and community. We engineer the future.
                Option 3: Real engineering starts here. Open source to edge computing.
            */}
            <p className="animate-fade-up text-lg md:text-xl text-slate-300 max-w-lg mb-6" style={{ animationDelay: '200ms' }}>
              Empowering student innovators to build, connect, and lead.
            </p>

            <p className="animate-fade-up text-sm sm:text-base text-slate-400 max-w-md mb-10" style={{ animationDelay: '300ms' }}>
              {/* // TODO: confirm final copy */}
              Join our hands-on workshops, open-source sprints, and industry network designed for aspiring engineers.
            </p>

            <div className="animate-fade-up flex flex-wrap justify-center lg:justify-start gap-4" style={{ animationDelay: '400ms' }}>
              <Link to="/events" className="btn-primary group">
                Explore Events
                <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
              </Link>
              <Link to="/join" className="btn-outline">
                Join IEEE
              </Link>
            </div>
          </div>

          {/* Right Column (Visual) */}
          <div className="lg:col-span-5 w-full">
            <HeroVisual />
          </div>

        </div>
      </div>

      {/* Scroll Down Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex text-slate-500 animate-bounce motion-reduce:animate-none" aria-hidden="true">
        <ChevronDown size={28} />
      </div>
    </section>
  );
}

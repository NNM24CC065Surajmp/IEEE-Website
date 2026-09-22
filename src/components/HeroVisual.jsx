import React from 'react';

export default function HeroVisual() {
  return (
    <div className="relative w-full max-w-[360px] md:max-w-[420px] lg:max-w-[520px] mx-auto animate-fade-up motion-reduce:transition-none" style={{ animationDelay: '200ms' }}>
      <div className="animate-float motion-reduce:animate-none">
        {/* Soft radial glow behind SVG */}
        <div className="absolute inset-0 bg-ieee-teal/20 rounded-full blur-[80px] -z-10" />
        
        <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl" aria-hidden="true">
          {/* Base Traces */}
          <path d="M240 180 L240 80 L140 80" stroke="currentColor" strokeWidth="3" className="text-ieee-border" />
          <path d="M240 300 L240 400 L340 400" stroke="currentColor" strokeWidth="3" className="text-ieee-border" />
          <path d="M180 240 L80 240 L80 140" stroke="currentColor" strokeWidth="3" className="text-ieee-border" />
          <path d="M300 240 L400 240 L400 340" stroke="currentColor" strokeWidth="3" className="text-ieee-border" />

          {/* Animated Traces (Pulse traveling) */}
          <path d="M240 180 L240 80 L140 80" stroke="currentColor" strokeWidth="3" className="text-ieee-teal svg-trace-anim" />
          <path d="M240 300 L240 400 L340 400" stroke="currentColor" strokeWidth="3" className="text-ieee-teal svg-trace-anim" style={{ animationDelay: '1.5s' }} />

          {/* Core Chip */}
          <rect x="180" y="180" width="120" height="120" rx="24" fill="currentColor" className="text-ieee-card stroke-ieee-blue" strokeWidth="4" />
          <rect x="210" y="210" width="60" height="60" rx="12" fill="currentColor" className="text-ieee-teal/20 stroke-ieee-teal" strokeWidth="2" />
          
          {/* Core Glowing Center */}
          <circle cx="240" cy="240" r="16" fill="currentColor" className="text-ieee-teal animate-pulse-glow motion-reduce:animate-none" />

          {/* Outer Nodes */}
          <circle cx="140" cy="80" r="8" fill="currentColor" className="text-ieee-blue" />
          <circle cx="340" cy="400" r="8" fill="currentColor" className="text-ieee-blue" />
          <circle cx="80" cy="140" r="8" fill="currentColor" className="text-ieee-blue" />
          <circle cx="400" cy="340" r="8" fill="currentColor" className="text-ieee-blue" />

          {/* Inner Nodes */}
          <circle cx="240" cy="180" r="6" fill="currentColor" className="text-ieee-teal" />
          <circle cx="240" cy="300" r="6" fill="currentColor" className="text-ieee-teal" />
          <circle cx="180" cy="240" r="6" fill="currentColor" className="text-ieee-teal" />
          <circle cx="300" cy="240" r="6" fill="currentColor" className="text-ieee-teal" />
        </svg>
      </div>
    </div>
  );
}

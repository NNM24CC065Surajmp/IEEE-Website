import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Reveal from './Reveal';

export default function JoinCTA() {
  return (
    <section className="section-container py-16 md:py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-ieee-border bg-gradient-to-br from-ieee-surface via-[#101321] to-[#00629B]/20 p-8 sm:p-12 md:p-16 shadow-2xl">
          {/* Subtle blue accent blur / glow in top right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#00629B]/20 dark:bg-[#22D3EE]/10 blur-3xl"
          />

          <div className="relative z-10 max-w-2xl">
            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider text-[#22D3EE] bg-[#00629B]/20 border border-[#22D3EE]/30 mb-6">
              <Sparkles size={13} className="text-[#22D3EE]" />
              <span>Become a Member</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-5 leading-tight">
              Ready to innovate, build, and lead?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 dark:text-zinc-300 leading-relaxed mb-8 max-w-xl font-normal">
              Join IEEE NMAMIT Student Branch to gain hands-on technical experience, collaborate on national hackathon teams, publish research papers, and connect with a worldwide professional network.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/join"
                className="btn-primary group gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
              >
                <span>Join Our Chapter</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
                />
              </Link>
              <Link
                to="/about"
                className="btn-outline text-xs font-mono uppercase tracking-wider py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B]"
              >
                <span>Explore Initiatives</span>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

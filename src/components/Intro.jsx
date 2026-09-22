import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import { site } from '../data/site';

export default function Intro() {
  return (
    <section className="relative section-container section-padding overflow-hidden">
      {/* Subtle decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -left-12 w-64 h-64 bg-[ieee-blue]/10 dark:bg-[ieee-teal]/10 rounded-full blur-3xl"
      />

      <Reveal>
        <div className="relative z-10 max-w-[65ch]">
          {/* Subtle decorative accent line */}
          <div className="w-12 h-1 bg-[ieee-teal] rounded-full mb-6" />

          {/* Eyebrow label */}
          <span className="text-xs font-mono uppercase tracking-widest text-[ieee-blue] dark:text-[ieee-teal] font-bold block mb-3">
            About The Branch
          </span>

          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
            Who We Are
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed mb-8">
            {site.shortIntro}
          </p>

          <div>
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[ieee-blue] dark:text-[ieee-teal] hover:text-[#0077b6] dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[ieee-blue] dark:focus-visible:ring-[ieee-teal] rounded px-1 py-0.5 transition-colors"
            >
              <span>Learn More</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

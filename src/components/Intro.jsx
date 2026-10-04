import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { site } from '../data/site';

const STATS = {
  members: 53,
  alumni: 29,
  events: 3,
};

const ROWS = [
  { key: 'members', label: 'MEMBERS', value: STATS.members, duration: 1400 },
  { key: 'alumni', label: 'ALUMNI', value: STATS.alumni, duration: 1400 },
  { key: 'events', label: 'EVENTS THIS YEAR', value: STATS.events, duration: 800 },
];

function StatsPanel() {
  const containerRef = useRef(null);
  const numRefs = useRef([]);
  const dividerRefs = useRef([]);
  const barRef = useRef(null);
  const labelsRef = useRef(null);

  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (isReducedMotion) {
      dividerRefs.current.forEach((el) => {
        if (el) el.style.transform = 'scaleX(1)';
      });
      numRefs.current.forEach((el, idx) => {
        if (el) el.textContent = String(ROWS[idx].value);
      });
      if (barRef.current) barRef.current.style.transform = 'scaleX(1)';
      if (labelsRef.current) labelsRef.current.style.opacity = '1';
      return;
    }

    let hasTriggered = false;
    const timeouts = [];
    const rafIds = [];

    const startAnimation = () => {
      if (hasTriggered) return;
      hasTriggered = true;

      // 1. Each hairline divider draws in left to right just before its row's number starts
      // Dividers start at 0ms, 120ms, 240ms (and closing line at 240ms)
      const dividerDelays = [0, 120, 240, 240];
      dividerRefs.current.forEach((dividerEl, idx) => {
        if (!dividerEl) return;
        const delay = dividerDelays[idx] ?? 240;
        const t = setTimeout(() => {
          dividerEl.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          dividerEl.style.transform = 'scaleX(1)';
        }, delay);
        timeouts.push(t);
      });

      // 2. Numbers count up from 0 to their value with ease-out cubic, staggered 120ms apart
      // Members: starts at 120ms, takes ~1.4s (finishes at 1520ms)
      // Alumni: starts at 240ms, takes ~1.4s (finishes at 1640ms)
      // Events: starts at 360ms, takes ~0.8s (finishes at 1160ms)
      ROWS.forEach((row, idx) => {
        const numEl = numRefs.current[idx];
        if (!numEl) return;
        const startDelay = 120 + idx * 120;
        const duration = row.duration;
        const target = row.value;

        const t = setTimeout(() => {
          let startTime = null;
          const step = (now) => {
            if (!startTime) startTime = now;
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic: 1 - (1 - progress)^3
            const eased = 1 - Math.pow(1 - progress, 3);
            numEl.textContent = String(Math.round(eased * target));
            if (progress < 1) {
              const raf = requestAnimationFrame(step);
              rafIds.push(raf);
            } else {
              numEl.textContent = String(target);
            }
          };
          const raf = requestAnimationFrame(step);
          rafIds.push(raf);
        }, startDelay);
        timeouts.push(t);
      });

      // 3. Proportion bar fills from left to right over ~1.4s, starting after the ledger finishes (1640ms)
      const barStartDelay = 1650;
      const barDuration = 1400;
      const barTimeout = setTimeout(() => {
        if (barRef.current) {
          barRef.current.style.transition = 'transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)';
          barRef.current.style.transform = 'scaleX(1)';
        }
      }, barStartDelay);
      timeouts.push(barTimeout);

      // 4. Labels beneath fade in when the bar animation completes (1650 + 1400 = 3050ms)
      const labelsTimeout = setTimeout(() => {
        if (labelsRef.current) {
          labelsRef.current.style.transition = 'opacity 0.4s ease-out';
          labelsRef.current.style.opacity = '1';
        }
      }, barStartDelay + barDuration);
      timeouts.push(labelsTimeout);
    };

    const targetEl = containerRef.current;
    if (!targetEl) return;

    // IntersectionObserver with threshold ~0.35, runs once
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            startAnimation();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(targetEl);

    // Initial check: if already in view on load, run animation once on load
    const rect = targetEl.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
    const ratio = rect.height > 0 ? visibleHeight / rect.height : 0;
    if (ratio >= 0.35) {
      startAnimation();
      observer.disconnect();
    }

    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
      rafIds.forEach(cancelAnimationFrame);
    };
  }, [isReducedMotion]);

  const totalMembersAlumni = STATS.members + STATS.alumni;
  const membersRatio = (STATS.members / totalMembersAlumni) * 100;
  const alumniRatio = (STATS.alumni / totalMembersAlumni) * 100;

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[460px]"
    >
      {/* Ledger of 3 rows separated by 1px hairline dividers */}
      <div>
        {ROWS.map((row, idx) => (
          <div key={row.key}>
            {/* Hairline divider above row */}
            <div
              ref={(el) => (dividerRefs.current[idx] = el)}
              style={{
                height: '1px',
                transformOrigin: 'left',
                transform: isReducedMotion ? 'scaleX(1)' : 'scaleX(0)',
                willChange: 'transform',
              }}
              className="bg-[rgba(15,23,42,0.18)] dark:bg-white/20 w-full"
            />
            {/* Row: Large number on the left, small uppercase label on the right */}
            <div className="flex items-baseline justify-between py-4 sm:py-5">
              <span
                ref={(el) => (numRefs.current[idx] = el)}
                style={{
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontVariantNumeric: 'tabular-nums',
                  fontFeatureSettings: '"tnum"',
                  lineHeight: 1,
                }}
                className="text-[56px] sm:text-[64px] md:text-[68px] font-bold text-[#334155] dark:text-slate-100"
              >
                {isReducedMotion ? row.value : 0}
              </span>
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
                }}
                className="text-[13px] uppercase tracking-[0.14em] font-medium text-[#334155] dark:text-slate-300"
              >
                {row.label}
              </span>
            </div>
          </div>
        ))}
        {/* Closing hairline divider below last row */}
        <div
          ref={(el) => (dividerRefs.current[3] = el)}
          style={{
            height: '1px',
            transformOrigin: 'left',
            transform: isReducedMotion ? 'scaleX(1)' : 'scaleX(0)',
            willChange: 'transform',
          }}
          className="bg-[rgba(15,23,42,0.18)] dark:bg-white/20 w-full"
        />
      </div>

      {/* 6px-tall horizontal proportion bar split into Members and Alumni */}
      <div
        ref={barRef}
        style={{
          height: '6px',
          transformOrigin: 'left',
          transform: isReducedMotion ? 'scaleX(1)' : 'scaleX(0)',
          willChange: 'transform',
        }}
        className="mt-7 w-full flex overflow-hidden"
      >
        <div
          style={{
            width: `${membersRatio}%`,
            backgroundColor: '#00629B',
            height: '100%',
          }}
        />
        <div
          style={{
            width: `${alumniRatio}%`,
            height: '100%',
          }}
          className="bg-slate-400 dark:bg-slate-500"
        />
      </div>

      {/* Small mono labels underneath each segment */}
      <div
        ref={labelsRef}
        style={{
          display: 'flex',
          marginTop: '8px',
          opacity: isReducedMotion ? 1 : 0,
          willChange: 'opacity',
          fontFamily: "'IBM Plex Mono', 'JetBrains Mono', monospace",
          fontSize: '11px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
        className="text-[#334155] dark:text-slate-400 font-medium"
      >
        <div style={{ width: `${membersRatio}%` }}>
          MEMBERS {STATS.members}
        </div>
        <div style={{ width: `${alumniRatio}%` }}>
          ALUMNI {STATS.alumni}
        </div>
      </div>
    </div>
  );
}

export default function Intro() {
  return (
    <section className="relative section-container section-padding overflow-hidden">
      {/* Subtle decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -left-12 w-64 h-64 bg-ieee-blue/10 dark:bg-ieee-teal/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left column: text */}
        <div className="max-w-[65ch]">
          {/* Subtle decorative accent line */}
          <div className="w-12 h-1 bg-ieee-teal rounded-full mb-6" />

          {/* Eyebrow label */}
          <span className="text-xs font-mono uppercase tracking-widest text-ieee-blue dark:text-ieee-teal font-bold block mb-3">
            About The Branch
          </span>

          <h2 className="font-heading text-[clamp(40px,5vw,64px)] leading-[1.05] font-bold tracking-tight text-slate-900 dark:text-white mb-6 whitespace-nowrap">
            Who We Are
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-300 leading-relaxed mb-8">
            {site.shortIntro}
          </p>

          <div>
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-ieee-blue dark:text-ieee-teal hover:text-[#0077b6] dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue dark:focus-visible:ring-ieee-teal rounded px-1 py-0.5 transition-colors"
            >
              <span>Learn More</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
              />
            </Link>
          </div>
        </div>

        {/* Right column: Stats Panel */}
        <div className="w-full flex justify-start md:justify-end">
          <StatsPanel />
        </div>
      </div>
    </section>
  );
}

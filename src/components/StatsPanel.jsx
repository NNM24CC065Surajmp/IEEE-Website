import React, { useRef, useEffect } from 'react';
import { stats } from '../data/stats.js';

export default function StatsPanel() {
  const containerRef = useRef(null);
  const numRefs = useRef([]);
  const dividerRefs = useRef([]);

  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ROWS = [
    {
      key: 'members',
      label: 'IEEE members worldwide',
      caption: `In more than ${stats.countries} countries`,
      value: stats.ieeeMembers,
      finalDisplay: `${stats.ieeeMembers.toLocaleString('en-US')}+`,
      duration: 1400,
      format: (val) => `${val.toLocaleString('en-US')}+`,
    },
    {
      key: 'societies',
      label: 'Technical societies',
      caption: null,
      value: stats.societies,
      finalDisplay: String(stats.societies),
      duration: 1000,
      format: (val) => String(val),
    },
    {
      key: 'events',
      label: 'Events this year',
      caption: null,
      value: 3,
      finalDisplay: '3',
      duration: 800,
      format: (val) => String(val),
    },
  ];

  useEffect(() => {
    if (isReducedMotion) {
      dividerRefs.current.forEach((el) => {
        if (el) el.style.transform = 'scaleX(1)';
      });
      numRefs.current.forEach((el, idx) => {
        if (el) el.textContent = ROWS[idx].finalDisplay;
      });
      return;
    }

    let hasTriggered = false;
    const timeouts = [];
    const rafIds = [];

    const startAnimation = () => {
      if (hasTriggered) return;
      hasTriggered = true;

      // Hairline dividers draw in left to right
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

      // Numbers count up from 0 to target with ease-out cubic
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
            const currentVal = Math.round(eased * target);
            numEl.textContent = row.format ? row.format(currentVal) : String(currentVal);
            if (progress < 1) {
              const raf = requestAnimationFrame(step);
              rafIds.push(raf);
            } else {
              numEl.textContent = row.finalDisplay;
            }
          };
          const raf = requestAnimationFrame(step);
          rafIds.push(raf);
        }, startDelay);
        timeouts.push(t);
      });
    };

    const targetEl = containerRef.current;
    if (!targetEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            startAnimation();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(targetEl);

    // Initial check: if already in view on load, run animation once
    const rect = targetEl.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
    const ratio = rect.height > 0 ? visibleHeight / rect.height : 0;
    if (ratio >= 0.25) {
      startAnimation();
      observer.disconnect();
    }

    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
      rafIds.forEach(cancelAnimationFrame);
    };
  }, [isReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[420px] p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-gradient-to-b from-white/90 via-slate-50/80 to-white/90 dark:from-zinc-900/85 dark:via-zinc-950/90 dark:to-[#080a10]/95 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(0,98,155,0.12),0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_30px_rgba(0,98,155,0.18)] ring-1 ring-black/[0.04] dark:ring-white/[0.06] overflow-hidden"
    >
      {/* Subtle top edge glow */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00629B] dark:via-[#0096D6] to-transparent opacity-70 pointer-events-none" />

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
              className="bg-slate-200/80 dark:bg-zinc-800/80 w-full"
            />
            {/* Two-column row: number on left, label right-aligned on right with distinguishing IEEE Blue left accent */}
            <div className="grid grid-cols-[1fr_160px] items-center py-4 sm:py-5 gap-4 pl-3.5 border-l-2 border-[#00629B] dark:border-[#0096D6]">
              {/* Left Cell: overlay phantom reserving final width + animated value on top */}
              <div className="relative grid grid-cols-1 grid-rows-1 items-center min-w-0 overflow-hidden">
                {/* Invisible phantom with final value to lock width and prevent any shift */}
                <span
                  className="invisible select-none [grid-area:1/1] font-heading font-extrabold text-3xl sm:text-4xl lg:text-[42px] tracking-tight tabular-nums whitespace-nowrap leading-none"
                  aria-hidden="true"
                >
                  {row.finalDisplay}
                </span>

                {/* Visible animated number */}
                <span
                  ref={(el) => (numRefs.current[idx] = el)}
                  className="[grid-area:1/1] font-heading font-extrabold text-3xl sm:text-4xl lg:text-[42px] tracking-tight tabular-nums whitespace-nowrap leading-none text-slate-900 dark:text-white"
                >
                  {isReducedMotion ? row.finalDisplay : '0'}
                </span>
              </div>

              {/* Right Cell: 160px fixed right-aligned label */}
              <div className="w-[160px] text-right shrink-0">
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-zinc-300 block leading-snug">
                  {row.label}
                </span>
                {row.caption && (
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 font-normal block mt-1 leading-snug">
                    {row.caption}
                  </span>
                )}
              </div>
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
          className="bg-slate-200/80 dark:bg-zinc-800/80 w-full"
        />
      </div>
    </div>
  );
}

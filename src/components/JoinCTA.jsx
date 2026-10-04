import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';
import Reveal from './Reveal';

export default function JoinCTA() {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from('.cta-heading', {
      scale: 0.95,
      opacity: 0,
      duration: 0.7,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="cta-container section-container pb-16 md:pb-24 pt-4 md:pt-8">
      <Reveal>
        <div className="relative rounded-2xl border border-slate-200 dark:border-ieee-border bg-white dark:bg-zinc-900 py-[96px] px-6 sm:px-12 md:px-16 text-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            <h2 className="cta-heading font-heading font-extrabold text-[#0F172A] dark:text-white text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[-0.02em] text-center mb-[20px] whitespace-normal sm:whitespace-nowrap">
              Become a member
            </h2>

            <p className="text-[17px] leading-[1.6] text-[#475569] dark:text-zinc-300 max-w-[560px] mx-auto text-center mb-[32px]">
              Join IEEE NMAMIT Student Branch to gain hands-on technical experience, collaborate on national hackathon teams, publish research papers, and connect with a worldwide professional network.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px] w-full">
              <Link
                to="/join"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#00629B] text-white text-base font-medium rounded-[6px] hover:bg-[#004f7c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B]"
              >
                Join our chapter
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center py-2 px-1 text-base font-normal text-[#00629B] dark:text-[#38bdf8] underline underline-offset-4 decoration-1 hover:text-[#004f7c] dark:hover:text-cyan-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B]"
                style={{ textUnderlineOffset: '4px', textDecorationThickness: '1px' }}
              >
                Explore initiatives
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  X,
  ExternalLink,
  Info,
} from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';
import StatsPanel from '../components/StatsPanel.jsx';

const AFFILIATIONS = [
  {
    id: 'ieee',
    name: 'IEEE',
    tier: 'Level 01',
    scope: 'Global Organization',
    logo: '/logos/ieee-blue.png',
    url: 'https://www.ieee.org/',
    intro:
      'IEEE is the world’s largest technical professional organization dedicated to advancing technology for the benefit of humanity.',
  },
  {
    id: 'region10',
    name: 'IEEE Region 10',
    tier: 'Level 02',
    scope: 'Asia-Pacific Region',
    logo: '/logos/region10.png',
    url: 'https://www.ieeer10.org/',
    intro:
      'IEEE Region 10 represents the Asia-Pacific area and connects IEEE members, sections, subsections, and student communities across the region.',
  },
  {
    id: 'india-council',
    name: 'IEEE India Council',
    tier: 'Level 03',
    scope: 'National Council',
    logo: '/logos/india-council.png',
    url: 'https://ieeeindiacouncil.org/',
    intro:
      'IEEE India Council coordinates IEEE activities and fosters technical excellence across India’s sections and student communities.',
  },
  {
    id: 'bangalore',
    name: 'IEEE Bangalore Section',
    tier: 'Level 04',
    scope: 'Section Jurisdiction',
    logo: '/logos/bangalore.png',
    url: 'https://ieeebangalore.org/',
    intro:
      'IEEE Bangalore Section is one of the largest and most active IEEE sections globally, driving innovation and technical leadership.',
  },
  {
    id: 'mangalore',
    name: 'IEEE Mangalore Subsection',
    tier: 'Level 05',
    scope: 'Local Subsection',
    logo: '/logos/mangalore.png',
    url: 'https://ieee-mangalore.org/',
    intro:
      'IEEE Mangalore Subsection connects IEEE members and student branches across the region through technical, educational, and professional activities.',
  },
  {
    id: 'nmamit',
    name: 'IEEE NMAMIT Student Branch',
    tier: 'Level 06',
    scope: 'Campus Student Branch',
    logo: '/logos/nmamit-ieee-student-branch.png',
    url: null,
    intro:
      'IEEE NMAMIT Student Branch (STB34551) empowers students through practical engineering, workshops, hackathons, and technical innovation.',
  },
];

const CHAPTERS = [
  {
    id: 'pes',
    name: 'IEEE Power & Energy Society',
    shortName: 'Power & Energy',
    logo: '/societies/pes.png',
    description:
      'The Power & Energy Society focuses on electric power and energy systems, supporting innovation, research, education, and practical engineering in the energy sector.',
    brief:
      'Advancing innovation and practical solutions in electric power and energy systems.',
    links: [
      {
        label: 'PES website',
        url: 'https://ieee-pes.org/',
      },
    ],
  },
  {
    id: 'grss',
    name: 'IEEE Geoscience and Remote Sensing Society',
    shortName: 'Geoscience & Remote Sensing',
    logo: '/societies/grss.png',
    description:
      'The Geoscience and Remote Sensing Society advances science and technology related to sensing, imaging, and understanding Earth and its environment.',
    brief:
      'Exploring sensing, imaging, and technologies for understanding Earth and its environment.',
    links: [
      {
        label: 'GRSS website',
        url: 'https://www.grss-ieee.org/',
      },
    ],
  },
  {
    id: 'aps-mtts',
    name: 'IEEE AP-S / MTT-S',
    shortName: 'Antennas, Propagation & Microwave Technology',
    logo: '/societies/aps.jpg',
    secondaryLogo: '/societies/mtts.png',
    description:
      'A combined presentation of the Antennas and Propagation Society and Microwave Theory and Technology Society, covering antennas, propagation, microwave engineering, and related technologies.',
    brief:
      'Advancing antennas, propagation, microwave engineering, and related technologies.',
    links: [
      {
        label: 'AP-S website',
        url: 'https://ieeeaps.org/',
      },
      {
        label: 'MTT-S website',
        url: 'https://mtt.org/',
      },
    ],
  },
];

export default function AboutPage({ onNavigate }) {
  const [selectedAffiliation, setSelectedAffiliation] = useState(null);

  const heroRef = useRef(null);
  const charterRowRef = useRef(null);
  const ladderRef = useRef(null);
  const missionSectionRef = useRef(null);
  const missionListRef = useRef(null);

  useEffect(() => {
    if (!selectedAffiliation) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedAffiliation(null);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedAffiliation]);

  useEffect(() => {
    if (!selectedAffiliation) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedAffiliation]);

  // GSAP ScrollTrigger animation pass (respects prefersReducedMotion)
  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // 1. Charter spec-sheet row items reveal
    if (charterRowRef.current) {
      gsap.from('.charter-spec-col', {
        y: 18,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: charterRowRef.current,
          start: 'top 90%',
          once: true,
        },
      });
    }

    // 2. Affiliation ladder circuit nodes sequential reveal
    if (ladderRef.current) {
      const steps = ladderRef.current.querySelectorAll('.ladder-step-node');
      if (steps.length) {
        gsap.from(steps, {
          y: 28,
          opacity: 0,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ladderRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }
    }

    // 3. 35+ Years milestone callout reveal
    if (missionSectionRef.current) {
      gsap.from('.milestone-callout-anim', {
        x: -24,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: missionSectionRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    }

    // 4. Mission feature list staggered entrance
    if (missionListRef.current) {
      gsap.from('.mission-feature-item', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: missionListRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    }
  }, []);

  return (
    <div className="pt-28 sm:pt-36">

      {/* Punched ticket charter tag styles */}
      <style>{`
        .charter-tag {
          --tag-bg: #00629B;
          background:
            radial-gradient(circle 4px at 0 50%, transparent 4px, var(--tag-bg) 4.5px) left / 51% 100% no-repeat,
            radial-gradient(circle 4px at 100% 50%, transparent 4px, var(--tag-bg) 4.5px) right / 51% 100% no-repeat;
          -webkit-mask:
            radial-gradient(circle 4px at 0 50%, transparent 4px, #000 4.5px) left / 51% 100% no-repeat,
            radial-gradient(circle 4px at 100% 50%, transparent 4px, #000 4.5px) right / 51% 100% no-repeat;
          mask:
            radial-gradient(circle 4px at 0 50%, transparent 4px, #000 4.5px) left / 51% 100% no-repeat,
            radial-gradient(circle 4px at 100% 50%, transparent 4px, #000 4.5px) right / 51% 100% no-repeat;
        }
        .dark .charter-tag {
          --tag-bg: #4DA3D9;
        }
      `}</style>

      {/* =========================================================
          1. HERO
      ========================================================= */}
      <section ref={heroRef} className="relative max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-20 border-b border-slate-200 dark:border-zinc-800/80 overflow-hidden">
        {/* Soft Ambient Background Glow */}
        <div className="absolute top-10 -left-20 w-80 h-80 bg-ieee-blue/10 dark:bg-ieee-blue/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-ieee-teal/10 dark:bg-ieee-teal/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Top Grid: Heading column + fixed 420px elevated StatsPanel */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] items-center gap-10 lg:gap-12">
          <div className="w-full">
            {/* Small label above the heading */}
            <div className="flex flex-wrap items-center gap-[12px] mb-6">
              {/* Short horizontal rule: 36px wide, 3px thick, IEEE blue (hides below 480px) */}
              <span
                className="hidden min-[480px]:block w-[36px] h-[3px] rounded-full bg-[#00629B] dark:bg-[#4DA3D9] shrink-0"
                aria-hidden="true"
              />

              {/* Text label: body font, semibold, 15px, sentence case, normal text color */}
              <span className="font-body font-semibold text-[15px] tracking-[0.01em] text-slate-900 dark:text-white shrink-0">
                IEEE Student Branch
              </span>

              {/* Thin vertical hairline divider: 18px tall */}
              <span
                className="hidden min-[360px]:block w-px h-[18px] bg-slate-300 dark:bg-zinc-700 shrink-0"
                aria-hidden="true"
              />

              {/* Small rectangular charter tag with punched ticket semicircular notches */}
              <span
                className="charter-tag inline-flex items-center justify-center font-body font-semibold text-[13px] text-white tracking-normal rounded-[4px] px-[10px] py-[4px] shrink-0 select-text"
              >
                STB 34551
              </span>
            </div>

            <h1
              style={{ textWrap: 'balance' }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.15] cursor-default select-text"
            >
              <span>Rooted at NMAMIT Nitte.</span>{' '}
              <span className="block sm:inline">
                Connected to the world&apos;s premier technical society.
              </span>
            </h1>
          </div>

          {/* StatsPanel: elevated layered-shadow/glass container with left-accent IEEE Blue borders */}
          <div className="w-full flex justify-center lg:justify-end">
            <StatsPanel />
          </div>
        </div>

        {/* 
            CHARTER INFO ROW:
            Differentiated as a clean, minimal technical spec-sheet / data-table strip with top hairline dividers,
            breaking the repeated flat box pattern seen across the page.
        */}
        <div ref={charterRowRef} className="relative z-10 w-full max-w-[960px] mx-auto mt-12 sm:mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-5 px-4 sm:px-6 rounded-2xl border-y border-slate-200/90 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/30 backdrop-blur-sm">
            {/* Charter ID */}
            <div className="charter-spec-col flex flex-col border-t-2 border-[#00629B] dark:border-[#0096D6] pt-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold mb-1">
                Charter ID
              </span>
              <div>
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                  STB 34551
                </div>
              </div>
            </div>

            {/* Established */}
            <div className="charter-spec-col flex flex-col border-t-2 border-slate-300 dark:border-zinc-700 pt-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold mb-1">
                Established
              </span>
              <div>
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight font-mono">
                  2009
                </div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-normal mt-0.5">
                  15+ years
                </div>
              </div>
            </div>

            {/* Jurisdiction */}
            <div className="charter-spec-col flex flex-col border-t-2 border-slate-300 dark:border-zinc-700 pt-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold mb-1">
                Jurisdiction
              </span>
              <div>
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Region 10
                </div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-normal mt-0.5 font-mono">
                  APAC
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="charter-spec-col flex flex-col border-t-2 border-emerald-500/70 dark:border-emerald-400/70 pt-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold mb-1">
                Status
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. IEEE NMAMIT GLOBAL VIEW (REDESIGNED CIRCUIT-TRACE AFFILIATION LADDER)
      ========================================================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 border-b border-slate-200 dark:border-zinc-800/80">
        {/* Centered Heading with Left-Aligned Reading Paragraph */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white text-center leading-tight">
            IEEE NMAMIT global view
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-left text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
            The IEEE NMAMIT Student Branch is part of the IEEE Bangalore
            Section. The IEEE Bangalore Section is governed by the IEEE
            India Council, which falls under Region 10 of the IEEE Global
            Organization. IEEE NMAMIT is further connected through the
            IEEE Mangalore Subsection.
          </p>
        </div>

        {/* 
            CIRCUIT-TRACE ORGANIZATIONAL HIERARCHY VISUAL (Option b):
            Replaces generic vertical dotted line with engineering circuit trace language,
            conductive signal junction nodes, hierarchy tier markers, and ScrollTrigger staggered reveal.
        */}
        <div ref={ladderRef} className="mt-14 sm:mt-18 max-w-3xl mx-auto">
          <div className="relative pl-6 sm:pl-10">
            {/* Continuous SVG Circuit Spine with glowing conductive pulse */}
            <div
              className="absolute left-[13px] sm:left-[21px] top-4 bottom-8 w-[2px] bg-gradient-to-b from-[#00629B] via-[#0096D6] to-[#00629B]/30 dark:from-[#4DA3D9] dark:via-[#00F2FE]/80 dark:to-[#4DA3D9]/20"
              aria-hidden="true"
            />

            <div className="space-y-6 sm:space-y-8">
              {AFFILIATIONS.map((item, idx) => (
                <div
                  key={item.id}
                  className="ladder-step-node relative flex items-center gap-4 sm:gap-6 group"
                >
                  {/* Circuit Junction Node on the spine */}
                  <div className="absolute -left-[23px] sm:-left-[31px] z-10 flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-50 dark:bg-[#07090e] border-2 border-[#00629B]/50 dark:border-[#4DA3D9]/50 ring-4 ring-slate-100 dark:ring-black shadow-md group-hover:scale-110 group-hover:border-[#00629B] dark:group-hover:border-[#00F2FE] transition-all duration-300">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#00629B] dark:bg-[#4DA3D9] group-hover:bg-[#0096D6] dark:group-hover:bg-[#00F2FE] shadow-[0_0_8px_rgba(0,150,214,0.6)] transition-colors" />
                  </div>

                  {/* Horizontal conductive trace branch connecting spine to card */}
                  <div
                    className="w-4 sm:w-6 h-[2px] bg-[#00629B]/40 dark:bg-[#4DA3D9]/40 group-hover:bg-[#00629B] dark:group-hover:bg-[#4DA3D9] shrink-0 transition-colors"
                    aria-hidden="true"
                  />

                  {/* High-Finish Interactive Hierarchy Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedAffiliation(item)}
                    aria-label={`Open details for ${item.name}`}
                    className="flex-1 text-left p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-[#00629B]/40 dark:hover:border-[#0096D6]/40 transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      {/* Technical hierarchy scope badge */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-ieee-blue dark:text-ieee-teal font-bold px-2 py-0.5 rounded-md bg-ieee-blue/10 dark:bg-ieee-blue/20 shrink-0">
                          {item.tier}
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold">
                          {item.scope}
                        </span>
                      </div>
                      <span className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-ieee-blue dark:group-hover:text-ieee-teal transition-colors">
                        {item.name}
                      </span>
                    </div>

                    {/* Official IEEE Hierarchy Logo Lockup */}
                    <div className="flex items-center justify-start sm:justify-end shrink-0 sm:pl-4">
                      {item.logoDark ? (
                        <>
                          <img
                            src={item.logo}
                            alt={`${item.name} logo`}
                            className="dark:hidden w-36 sm:w-48 h-auto max-h-12 sm:max-h-14 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
                          />
                          <img
                            src={item.logoDark}
                            alt={`${item.name} logo`}
                            className="hidden dark:block w-36 sm:w-48 h-auto max-h-12 sm:max-h-14 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
                          />
                        </>
                      ) : (
                        <img
                          src={item.logo}
                          alt={`${item.name} logo`}
                          className="w-36 sm:w-48 h-auto max-h-12 sm:max-h-14 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
                        />
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. CAMPUS CONTEXT & MISSION (ENGINEERING RIGOR)
      ========================================================= */}
      <section ref={missionSectionRef} className="max-w-6xl mx-auto px-5 sm:px-8 py-20 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-ieee-blue/20 bg-ieee-blue/5 text-ieee-blue dark:text-ieee-teal text-xs font-medium mb-3">
              Institution and mission
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
              Building on 35+ years of engineering rigor at Nitte.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-6 font-normal text-left">
              NMAM Institute of Technology was founded in 1986 in Nitte, Udupi
              District, Karnataka. Today it is a premier autonomous institute
              under Nitte (Deemed to be University).
            </p>

            {/* 
                35+ YEARS LEGACY HIGHLIGHT:
                Replaced flat generic box with a distinct commemorative milestone banner with an IEEE-Blue accent bar.
            */}
            <div className="milestone-callout-anim relative overflow-hidden rounded-2xl border-y border-r border-slate-200/90 dark:border-zinc-800/90 border-l-4 border-l-[#00629B] dark:border-l-[#0096D6] bg-gradient-to-r from-slate-100/90 via-white/80 to-slate-50/50 dark:from-zinc-900/85 dark:via-zinc-900/40 dark:to-zinc-950/20 backdrop-blur-md p-4 sm:p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-ieee-blue/10 dark:bg-ieee-blue/20 flex items-center justify-center text-[#00629B] dark:text-[#38bdf8] shrink-0 font-heading">
                <span className="text-xl sm:text-2xl font-black">35+</span>
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  Years of engineering excellence
                </div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">
                  Pioneering technical education since 1986
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-normal text-left">
            <p>
              The primary purpose of IEEE Student Branch NMAMIT is to eliminate
              the gap between textbook syllabi and industry engineering
              practice. We run technical sessions, workshops, and competitive
              activities where students can turn ideas into practical systems.
            </p>

            <p>
              Through the IEEE network, our student members gain access to a
              global technical community, professional resources, conferences,
              research opportunities, and mentorship from engineers and
              researchers across different fields.
            </p>

            {/* 
                MISSION FEATURE CHECKMARKS:
                Treated as a clean 2x2 checklist with generous spacing, checkmark icon with subtle accent,
                and no heavy box containers, breaking the repeated flat box pattern.
            */}
            <div ref={missionListRef} className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-zinc-300">
              <div className="mission-feature-item group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100/80 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-[#00629B]/10 dark:bg-[#0096D6]/20 flex items-center justify-center text-[#00629B] dark:text-[#38bdf8] shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </div>
                <span className="font-medium text-slate-800 dark:text-zinc-200">
                  Peer-to-peer technical bootcamps
                </span>
              </div>

              <div className="mission-feature-item group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100/80 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-[#00629B]/10 dark:bg-[#0096D6]/20 flex items-center justify-center text-[#00629B] dark:text-[#38bdf8] shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </div>
                <span className="font-medium text-slate-800 dark:text-zinc-200">
                  National hackathons & competitions
                </span>
              </div>

              <div className="mission-feature-item group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100/80 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-[#00629B]/10 dark:bg-[#0096D6]/20 flex items-center justify-center text-[#00629B] dark:text-[#38bdf8] shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </div>
                <span className="font-medium text-slate-800 dark:text-zinc-200">
                  Undergrad research & paper guidance
                </span>
              </div>

              <div className="mission-feature-item group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100/80 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-[#00629B]/10 dark:bg-[#0096D6]/20 flex items-center justify-center text-[#00629B] dark:text-[#38bdf8] shrink-0 group-hover:scale-110 transition-transform">
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </div>
                <span className="font-medium text-slate-800 dark:text-zinc-200">
                  Global IEEE technical community
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. SOCIETIES (3 IN ONE HORIZONTAL ROW WITH CIRCULAR LOGOS)
      ========================================================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 border-b border-slate-200 dark:border-zinc-800/80">
        {/* Title with line next to it & subtle vertical top line */}
        <div className="text-center mb-14 sm:mb-16">
          <div className="w-px h-8 bg-slate-300 dark:bg-zinc-700 mx-auto mb-4" />
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <div className="h-[2px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-ieee-blue" />
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Societies
            </h2>
            <div className="h-[2px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-ieee-blue" />
          </div>
          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal text-left">
            Specialized technical chapters empowering students through domain expertise, workshops, projects, and global IEEE conferences.
          </p>
        </div>

        {/* All three societies in ONE horizontal line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CHAPTERS.map((society) => (
            <div
              key={society.id}
              className="group relative rounded-2xl border border-slate-200 dark:border-zinc-800/90 bg-white dark:bg-[#0c1220] p-6 sm:p-8 flex flex-col items-center text-center hover:border-ieee-blue/50 dark:hover:border-ieee-teal/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Circular Logo Container */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center p-3.5 shadow-md mb-6 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={society.logo}
                  alt={`${society.name} logo`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug mb-3 group-hover:text-ieee-blue dark:group-hover:text-ieee-teal transition-colors">
                {society.name}
              </h3>

              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-6 flex-1 font-normal text-left">
                {society.description}
              </p>

              {/* Action Link Button */}
              {society.links && society.links[0] && (
                <a
                  href={society.links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-ieee-blue dark:text-ieee-teal hover:underline pt-4 border-t border-slate-100 dark:border-zinc-800/70 w-full justify-center transition-colors"
                >
                  <span>{society.links[0].label}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          5. TEAM CTA
      ========================================================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <div className="p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-gradient-to-r from-slate-100 via-ieee-blue/10 to-slate-100 dark:from-zinc-900/60 dark:via-ieee-blue/10 dark:to-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="text-xs font-medium text-ieee-blue dark:text-ieee-teal mb-2">
              Student leadership
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
              Driven by student engineers.
            </h3>

            <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-lg leading-relaxed font-normal text-left">
              Explore our core executive committee, chapter leads, and faculty
              advisors.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('team')}
            className="
              shrink-0
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-lg
              bg-ieee-blue
              hover:bg-[#0077b6]
              text-white
              text-sm
              font-medium
              transition-colors
              shadow-lg
              shadow-ieee-blue/25
              cursor-pointer
            "
          >
            <span>Meet the team</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* =========================================================
          6. AFFILIATION MODAL (PORTALED TO BODY FOR PERFECT CENTERING)
      ========================================================= */}
      {selectedAffiliation &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedAffiliation(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="affiliation-modal-title"
          >
            {/* Modal Card */}
            <div
              className="relative w-full max-w-md rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0c101a] shadow-2xl p-6 sm:p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* X Close button */}
              <button
                type="button"
                onClick={() => setSelectedAffiliation(null)}
                aria-label="Close modal"
                className="absolute right-4 top-4 w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800/80 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Logo display */}
              <div className="flex items-center justify-center min-h-[5rem] sm:min-h-[6rem] py-2 mt-2 mb-5">
                {selectedAffiliation.logoDark ? (
                  <>
                    <img
                      src={selectedAffiliation.logo}
                      alt={`${selectedAffiliation.name} logo`}
                      className="dark:hidden h-auto max-h-24 sm:max-h-28 w-auto max-w-[240px] sm:max-w-[280px] object-contain drop-shadow-sm"
                    />
                    <img
                      src={selectedAffiliation.logoDark}
                      alt={`${selectedAffiliation.name} logo`}
                      className="hidden dark:block h-auto max-h-24 sm:max-h-28 w-auto max-w-[240px] sm:max-w-[280px] object-contain drop-shadow-sm"
                    />
                  </>
                ) : (
                  <img
                    src={selectedAffiliation.logo}
                    alt={`${selectedAffiliation.name} logo`}
                    className="h-auto max-h-24 sm:max-h-28 w-auto max-w-[240px] sm:max-w-[280px] object-contain drop-shadow-sm"
                  />
                )}
              </div>

              {/* Title */}
              <h3
                id="affiliation-modal-title"
                className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug"
              >
                {selectedAffiliation.name}
              </h3>

              {/* Brief introduction in one line */}
              <p className="mt-3 text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-sm mx-auto font-normal text-left">
                {selectedAffiliation.intro}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAffiliation(null)}
                  className="flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 text-sm font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Close
                </button>

                {/* Visit Site Button: ONLY for first five (url !== null) */}
                {selectedAffiliation.url && (
                  <a
                    href={selectedAffiliation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-ieee-blue hover:bg-[#005180] text-white text-sm font-medium transition-colors shadow-md shadow-ieee-blue/20 cursor-pointer"
                  >
                    <span>Visit site</span>
                    <ExternalLink size={15} />
                  </a>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
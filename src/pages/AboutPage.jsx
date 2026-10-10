import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

const AFFILIATIONS = [
  {
    id: 'ieee',
    name: 'IEEE',
    logo: '/logos/ieee-blue.png',
    url: 'https://www.ieee.org/',
    intro:
      'IEEE is the world’s largest technical professional organization dedicated to advancing technology for the benefit of humanity.',
  },
  {
    id: 'region10',
    name: 'IEEE Region 10',
    logo: '/logos/region10.png',
    url: 'https://www.ieeer10.org/',
    intro:
      'IEEE Region 10 represents the Asia-Pacific area and connects IEEE members, sections, subsections, and student communities across the region.',
  },
  {
    id: 'india-council',
    name: 'IEEE India Council',
    logo: '/logos/india-council.png',
    url: 'https://ieeeindiacouncil.org/',
    intro:
      'IEEE India Council coordinates IEEE activities and fosters technical excellence across India’s sections and student communities.',
  },
  {
    id: 'bangalore',
    name: 'IEEE Bangalore Section',
    logo: '/logos/bangalore.png',
    url: 'https://ieeebangalore.org/',
    intro:
      'IEEE Bangalore Section is one of the largest and most active IEEE sections globally, driving innovation and technical leadership.',
  },
  {
    id: 'mangalore',
    name: 'IEEE Mangalore Subsection',
    logo: '/logos/mangalore.png',
    url: 'https://ieee-mangalore.org/',
    intro:
      'IEEE Mangalore Subsection connects IEEE members and student branches across the region through technical, educational, and professional activities.',
  },
  {
    id: 'nmamit',
    name: 'IEEE NMAMIT Student Branch',
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

  return (
    <div className="pt-28 sm:pt-36">

      {/* =========================================================
          1. HERO
      ========================================================= */}
      <section className="relative max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-20 border-b border-slate-200 dark:border-zinc-800/80 overflow-hidden">
        {/* Soft Ambient Background Glow */}
        <div className="absolute top-10 -left-20 w-80 h-80 bg-ieee-blue/10 dark:bg-ieee-blue/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-ieee-teal/10 dark:bg-ieee-teal/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-300 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-sm text-slate-700 dark:text-zinc-300 text-xs font-medium tracking-wide mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>IEEE Student Branch · STB 34551</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6 cursor-default select-text">
            <span>Rooted at NMAMIT Nitte.</span>{' '}
            <span className="block sm:inline">
              Connected to the world&apos;s premier technical society.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-2xl font-normal text-left">
            Empowering global innovators from our NMAMIT campus &mdash; bridging local engineering rigor with IEEE&apos;s worldwide technical excellence.
          </p>

          {/* Metric & Badge Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm hover:border-ieee-blue/40 transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">
                Charter ID
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                STB 34551
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm hover:border-ieee-blue/40 transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">
                Established
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                2009 (15+ years)
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm hover:border-ieee-blue/40 transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">
                Jurisdiction
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Region 10 (APAC)
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm hover:border-ieee-blue/40 transition-colors">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 block mb-1">
                Status
              </span>
              <div className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active branch
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. IEEE NMAMIT GLOBAL VIEW
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

        {/* IEEE NITK Style Stepper */}

        <div className="mt-12 sm:mt-16 flex justify-center">

          <div className="relative flex flex-col">

            {/* Continuous vertical spine line connecting all dots */}

            <div
              className="absolute left-[15px] sm:left-[19px] top-6 bottom-6 w-[2px] bg-slate-300 dark:bg-zinc-700"
              aria-hidden="true"
            />

            {AFFILIATIONS.map((item) => (
              <div
                key={item.id}
                className="relative flex items-center gap-4 sm:gap-8 py-4 sm:py-5"
              >

                {/* Step dot on vertical line */}

                <div className="relative z-10 flex items-center justify-center w-8 sm:w-10 shrink-0">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-800 dark:bg-ieee-blue text-white ring-4 ring-slate-50 dark:ring-[#05060A] flex items-center justify-center shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>

                {/* Clickable Logo */}

                <button
                  type="button"
                  onClick={() => setSelectedAffiliation(item)}
                  aria-label={`Open details for ${item.name}`}
                  className="group p-2 bg-transparent hover:scale-105 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue rounded-lg cursor-pointer"
                >
                  {item.logoDark ? (
                    <>
                      <img
                        src={item.logo}
                        alt={`${item.name} logo`}
                        className="dark:hidden w-40 sm:w-52 md:w-60 h-auto max-h-16 sm:max-h-20 md:max-h-24 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
                      />
                      <img
                        src={item.logoDark}
                        alt={`${item.name} logo`}
                        className="hidden dark:block w-40 sm:w-52 md:w-60 h-auto max-h-16 sm:max-h-20 md:max-h-24 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
                      />
                    </>
                  ) : (
                    <img
                      src={item.logo}
                      alt={`${item.name} logo`}
                      className="w-40 sm:w-52 md:w-60 h-auto max-h-16 sm:max-h-20 md:max-h-24 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
                    />
                  )}
                </button>

              </div>
            ))}

          </div>
        </div>
      </section>
      {/* =========================================================
          3. CAMPUS CONTEXT & MISSION (ENGINEERING RIGOR)
      ========================================================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 border-b border-slate-200 dark:border-zinc-800/80">
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

            {/* 35+ Years Legacy Highlight Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-gradient-to-br from-slate-50 to-white dark:from-zinc-900/60 dark:to-zinc-900/20 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-ieee-blue/10 dark:bg-ieee-blue/20 flex items-center justify-center text-ieee-blue dark:text-ieee-teal shrink-0">
                <span className="text-xl font-bold">35+</span>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Years of engineering excellence</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Pioneering technical education since 1986</div>
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

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 dark:text-zinc-300">
              <div className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/40 hover:border-ieee-blue/40 hover:shadow-md transition-all">
                <CheckCircle2
                  size={16}
                  className="text-ieee-blue dark:text-ieee-teal shrink-0 group-hover:scale-110 transition-transform"
                />
                <span className="font-medium text-slate-800 dark:text-zinc-200">Peer-to-peer technical bootcamps</span>
              </div>

              <div className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/40 hover:border-ieee-blue/40 hover:shadow-md transition-all">
                <CheckCircle2
                  size={16}
                  className="text-ieee-blue dark:text-ieee-teal shrink-0 group-hover:scale-110 transition-transform"
                />
                <span className="font-medium text-slate-800 dark:text-zinc-200">National hackathons & competitions</span>
              </div>

              <div className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/40 hover:border-ieee-blue/40 hover:shadow-md transition-all">
                <CheckCircle2
                  size={16}
                  className="text-ieee-blue dark:text-ieee-teal shrink-0 group-hover:scale-110 transition-transform"
                />
                <span className="font-medium text-slate-800 dark:text-zinc-200">Undergrad research & paper guidance</span>
              </div>

              <div className="group flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/40 hover:border-ieee-blue/40 hover:shadow-md transition-all">
                <CheckCircle2
                  size={16}
                  className="text-ieee-blue dark:text-ieee-teal shrink-0 group-hover:scale-110 transition-transform"
                />
                <span className="font-medium text-slate-800 dark:text-zinc-200">Global IEEE technical community</span>
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
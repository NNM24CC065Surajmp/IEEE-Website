import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Code2,
  BookOpen,
  Users2,
  Calendar,
  Users,
} from 'lucide-react';

const BRANCH_STATS = [
  { value: '350+', label: 'Active Members', note: 'across 8 engineering depts' },
  { value: '40+', label: 'Annual Events', note: 'hands-on labs & hackathons' },
  { value: '15+', label: 'Years of Legacy', note: 'chartered 2009 at NMAMIT' },
  { value: '04', label: 'Societies & SIGs', note: 'CS, RAS, WIE, ComSoc' },
];

const PILLARS = [
  {
    number: '01',
    title: 'Hands-on Technical Labs',
    icon: Cpu,
    label: 'SYSTEMS & CODE',
    description:
      'Weekend deep-dives into edge computing, computer vision, containerization, and modern systems architecture. No passive webinars — purely build-first.',
    topics: ['Edge AI / TinyML', 'Distributed Systems', 'Rust & Go', 'RISC-V'],
  },
  {
    number: '02',
    title: 'Hackathons & Sprint Challenges',
    icon: Code2,
    label: 'PROTOTYPING',
    description:
      'From 24-hour sprint hackathons to local algorithmic battles. We curate competitive arenas where student teams transform ideas into validated demos.',
    topics: ['HackNMAMIT', 'IEEEXtreme 24h', 'Open Source Sprints', 'AlgoBattles'],
  },
  {
    number: '03',
    title: 'Undergraduate Research & Papers',
    icon: BookOpen,
    label: 'PUBLICATIONS',
    description:
      'Structured paper writing mentorship from senior researchers and alumni. We guide student authors toward submissions in IEEE Xplore indexed conferences.',
    topics: ['IEEE Xplore Mentorship', 'Literature Reviews', 'Patent Drafting', 'Peer Reviews'],
  },
  {
    number: '04',
    title: 'Global IEEE Network & Chapters',
    icon: Users2,
    label: 'ECOSYSTEM',
    description:
      'Direct connection with the IEEE Mangalore Sub-Section, Bangalore Section, and global student congresses. Connect with visiting engineers and active alumni.',
    topics: ['Distinguished Talks', 'Alumni Mentorship', 'Section Congress', 'WIE Summits'],
  },
];

export default function HomePage({ onNavigate }) {
  return (
    <div className="pt-28 sm:pt-36">
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20 sm:pb-24 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0096D6]" />
            IEEE · NMAMIT · Student Branch
          </div>

          {/* Bold headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-6">
            Advancing Technology.{' '}
            <span className="text-slate-500 dark:text-zinc-400 font-semibold block sm:inline">
              Empowering Students.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-slate-700 dark:text-zinc-300 font-normal leading-relaxed mb-8 max-w-2xl">
            The official technical student branch of NMAM Institute of Technology, Nitte. We bridge academic theory with real engineering — open hardware, competitive code, peer research, and a direct link to the global IEEE society.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => onNavigate('events')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#00629B] hover:bg-[#0077b6] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors shadow-lg shadow-[#00629B]/20 cursor-pointer"
            >
              <span>Explore Events</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-slate-300 dark:border-zinc-700 hover:border-slate-400 dark:hover:border-zinc-500 bg-white dark:bg-zinc-900/40 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>About Chapter</span>
              <ArrowUpRight size={14} className="text-slate-500 dark:text-zinc-500" />
            </button>
          </div>

          {/* Affiliation strip */}
          <div className="mt-12 flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-mono text-slate-600 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400 dark:text-zinc-600">Region:</span> IEEE Region 10 (Asia-Pacific)
            </span>
            <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">/</span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400 dark:text-zinc-600">Section:</span> Bangalore Section
            </span>
            <span className="text-slate-300 dark:text-zinc-700 hidden sm:inline">/</span>
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400 dark:text-zinc-600">Sub-Section:</span> Mangalore
            </span>
          </div>
        </div>
      </section>

      {/* 2. STATS STRIP */}
      <section className="border-b border-slate-200 dark:border-zinc-800/80 bg-slate-100/70 dark:bg-[#08090e]/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {BRANCH_STATS.map((stat, i) => (
              <div key={i} className="flex flex-col border-l border-slate-300 dark:border-zinc-800 pl-4 sm:pl-6 first:border-l-0">
                <div className="text-2xl sm:text-4xl font-bold font-mono text-slate-900 dark:text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-zinc-200 mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 mt-0.5">
                  {stat.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE PILLARS — WHAT WE DO */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#0096D6] mb-1.5 font-bold">
              [ 01 ] CORE INITIATIVES
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              What we build, research, and run.
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-600 dark:text-zinc-400 max-w-sm">
            Hands-on engineering tracks designed to turn students from consumers of tech into contributors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {PILLARS.map((pillar) => {
            const IconComp = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="group relative rounded-xl border border-slate-200 dark:border-zinc-800/90 hover:border-[#00629B] dark:hover:border-[#00629B] bg-white dark:bg-zinc-900/30 hover:bg-slate-50 dark:hover:bg-zinc-900/60 p-6 sm:p-7 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-slate-400 dark:text-zinc-500 group-hover:text-[#0096D6] transition-colors">
                        {pillar.number}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 dark:text-zinc-400 px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950">
                        {pillar.label}
                      </span>
                    </div>
                    <div className="text-slate-400 dark:text-zinc-500 group-hover:text-[#00629B] dark:group-hover:text-zinc-200 transition-colors">
                      <IconComp size={18} />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight mb-2.5">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-6 font-normal">
                    {pillar.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-200 dark:border-zinc-800/80">
                  {pillar.topics.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-mono text-slate-600 dark:text-zinc-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. DISCOVER MORE TEASERS */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card to Events */}
          <div className="p-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-white to-slate-100 dark:from-zinc-900/40 dark:to-[#00629B]/10 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-[#00629B] dark:text-[#0096D6] mb-4">
                <Calendar size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Upcoming Hackathons & Labs
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-6">
                Discover HackNMAMIT 2026, hands-on TinyML workshops, and the InnovateX student research expo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('events')}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00629B] dark:text-[#0096D6] hover:text-[#0077b6] dark:hover:text-white transition-colors font-semibold cursor-pointer"
            >
              <span>Explore All Events</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card to Team */}
          <div className="p-8 rounded-xl border border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-white to-slate-100 dark:from-zinc-900/40 dark:to-zinc-900/10 flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-[#00629B] dark:text-[#5db4e8] mb-4">
                <Users size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Executive Team 2025–2026
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-6">
                Meet the 25 student leaders and faculty counselors driving innovation at IEEE NMAMIT across engineering branches.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('team')}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00629B] dark:text-[#5db4e8] hover:text-[#0077b6] dark:hover:text-white transition-colors font-semibold cursor-pointer"
            >
              <span>View Team Directory</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import {
  ShieldCheck,
  Globe2,
  Users2,
  Cpu,
  Code2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const CHAPTERS = [
  {
    name: 'IEEE Computer Society (CS)',
    code: 'NMAMIT CS SBC',
    icon: Code2,
    description:
      'The computing nerve-center of our branch. Hosts hands-on masterclasses in cloud infrastructure, container orchestration, systems engineering, and algorithmic coding sprints like IEEEXtreme.',
    focus: ['Distributed Systems', 'Cloud DevOps', 'IEEEXtreme 24h', 'Open Source'],
  },
  {
    name: 'IEEE Robotics & Automation Society (RAS)',
    code: 'NMAMIT RAS SBC',
    icon: Cpu,
    description:
      'Dedicated to mechatronics, embedded firmware, and autonomous robotics. Student squads build custom rovers, microcontrollers, ROS2 nodes, and compete in national hardware hackathons.',
    focus: ['ROS2 & Gazebo', 'Custom PCB Fabrication', 'ESP32 / ARM', 'Drone Tech'],
  },
  {
    name: 'IEEE Women in Engineering (WIE)',
    code: 'NMAMIT WIE AG',
    icon: Users2,
    description:
      'A global affinity group fostering gender balance in engineering disciplines. Coordinates high-school STEM outreach, women-led developer bootcamps, and executive leadership forums.',
    focus: ['STEM Advocacy', 'Women in Tech Labs', 'Peer Mentorship', 'Leadership Summits'],
  },
  {
    name: 'IEEE Communication Society (ComSoc)',
    code: 'NMAMIT ComSoc SBC',
    icon: Globe2,
    description:
      'Focusing on telecommunications, IoT wireless protocols, satellite communications, and RF engineering. Bridges academic hardware theory with telecom industry standards.',
    focus: ['Wireless Sensor Nets', '5G / Edge Comms', 'SDR & Signal Labs', 'IoT Architectures'],
  },
];

export default function AboutPage({ onNavigate }) {
  return (
    <div className="pt-28 sm:pt-36">
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-20 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0096D6]" />
            ABOUT · IEEE NMAMIT
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            Rooted at NMAMIT Nitte.{' '}
            <span className="text-slate-500 dark:text-zinc-400 block sm:inline">
              Connected to the world’s premier technical society.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-zinc-300 font-normal leading-relaxed mb-6 max-w-2xl">
            Chartered in 2009 at NMAM Institute of Technology, our IEEE Student Branch functions as an engineering incubator. We bring together developers, researchers, and creators across computer science, electronics, and mechanical engineering.
          </p>

          {/* Affiliation Hierarchy Card */}
          <div className="mt-8 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#08090e]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-slate-700 dark:text-zinc-300 shadow-sm">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-[#00629B] dark:text-[#0096D6] shrink-0" />
              <div>
                <span className="text-slate-400 dark:text-zinc-500 block text-[10px] uppercase">AFFILIATION HIERARCHY</span>
                <span>IEEE Global → Region 10 → Bangalore Section → Mangalore Sub-Section</span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded w-fit font-bold">
              STB 65421 · Active
            </span>
          </div>
        </div>
      </section>

      {/* 2. CAMPUS CONTEXT & MISSION */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="text-xs font-mono uppercase tracking-widest text-[#0096D6] mb-2 font-bold">
              [ 01 ] INSTITUTION & MISSION
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
              Building on 35+ years of engineering rigor at Nitte.
            </h2>
            <p className="text-xs font-mono text-slate-600 dark:text-zinc-400 leading-relaxed">
              NMAM Institute of Technology was founded in 1986 in Nitte, Udupi District, Karnataka. Today it is a premier autonomous institute under Nitte (Deemed to be University).
            </p>
          </div>

          <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-slate-700 dark:text-zinc-300 font-normal leading-relaxed">
            <p>
              The primary purpose of IEEE Student Branch NMAMIT is to eliminate the gap between textbook syllabi and industry engineering practice. We run weekly code labs, hardware workshops, and competitive hackathons where students deploy real systems on actual hardware.
            </p>
            <p className="text-slate-600 dark:text-zinc-400 text-sm">
              Through the IEEE network, our student members receive access to the 5-million-document IEEE Xplore digital library, travel grants for international student congresses, and direct mentorship from industry leaders and alumni working at top tech firms.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-700 dark:text-zinc-300">
              <div className="flex items-center gap-2 p-3 rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-sm">
                <CheckCircle2 size={15} className="text-[#00629B] dark:text-[#0096D6] shrink-0" />
                <span>Peer-to-peer technical bootcamps</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-sm">
                <CheckCircle2 size={15} className="text-[#00629B] dark:text-[#0096D6] shrink-0" />
                <span>National 24-hour hackathons</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-sm">
                <CheckCircle2 size={15} className="text-[#00629B] dark:text-[#0096D6] shrink-0" />
                <span>Undergrad research & paper guides</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 shadow-sm">
                <CheckCircle2 size={15} className="text-[#00629B] dark:text-[#0096D6] shrink-0" />
                <span>Global IEEE society congresses</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SOCIETIES & SPECIAL INTEREST GROUPS */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#0096D6] mb-1.5 font-bold">
              [ 02 ] TECHNICAL CHAPTERS
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Specialized Societies & Affinity Groups
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-600 dark:text-zinc-400 max-w-sm">
            Our branch hosts active student chapters under IEEE worldwide technical societies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CHAPTERS.map((ch) => {
            const IconComponent = ch.icon;
            return (
              <div
                key={ch.code}
                className="p-6 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-[#00629B] dark:hover:border-[#00629B] bg-white dark:bg-zinc-900/30 transition-all duration-200 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-[#00629B] dark:text-[#0096D6] px-2 py-0.5 rounded border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 font-semibold">
                      {ch.code}
                    </span>
                    <IconComponent size={18} className="text-slate-400 dark:text-zinc-400" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {ch.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-6 font-normal">
                    {ch.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-200 dark:border-zinc-800/80">
                  {ch.focus.map((item) => (
                    <span
                      key={item}
                      className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MEET THE TEAM CTA */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <div className="p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-gradient-to-r from-slate-100 via-[#00629B]/10 to-slate-100 dark:from-zinc-900/60 dark:via-[#00629B]/10 dark:to-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#00629B] dark:text-[#5db4e8] mb-2 font-bold">
              STUDENT LEADERSHIP
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Driven by 25 core student engineers.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-lg">
              Explore our core executive committee, chapter leads, and faculty advisors in the interactive 3D team directory.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('team')}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#00629B] hover:bg-[#0077b6] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors shadow-lg shadow-[#00629B]/25 cursor-pointer"
          >
            <span>Meet The Team</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}

import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  ArrowRight,
  Trophy,
} from 'lucide-react';

const EVENTS_DATA = [
  {
    id: 'hacknmamit-2026',
    title: 'HackNMAMIT 2026: 24h National Flagship Hackathon',
    month: 'MAR',
    day: '28',
    dates: 'March 28–29, 2026',
    time: 'Starts 09:00 AM IST',
    venue: 'Centre for High Performance Computing, NMAMIT',
    category: 'Hackathons',
    badge: 'Registrations Open',
    badgeType: 'emerald',
    description:
      'Our signature annual national hackathon bringing together 60+ curated student teams from across India to engineer real-world solutions in Healthcare, Decentralized Systems, and Smart Mobility.',
    prizes: '₹1,00,000+ Prize Pool + Internship Fast-tracks',
  },
  {
    id: 'edge-ai-workshop',
    title: 'Edge AI & Quantized Models on Microcontrollers',
    month: 'APR',
    day: '11',
    dates: 'April 11, 2026',
    time: '10:00 AM – 04:30 PM IST',
    venue: 'MCA Seminar Hall, Ground Floor',
    category: 'Workshops',
    badge: 'Limited to 50 Seats',
    badgeType: 'amber',
    description:
      'An intensive hardware-software bootcamp: take custom PyTorch neural networks, prune weights with TFLite-Micro and TensorRT, and flash them onto ESP32-S3 and ARM Cortex-M hardware kits provided during the lab.',
    prizes: 'Hardware Kit Access + Verified IEEE Certificate',
  },
  {
    id: 'innovatex-2026',
    title: 'InnovateX: Student Project & Research Colloquium',
    month: 'MAY',
    day: '02',
    dates: 'May 02, 2026',
    time: '09:30 AM – 05:00 PM IST',
    venue: 'Sambhram Auditorium & Exhibition Quad',
    category: 'Symposiums',
    badge: 'Call for Abstracts',
    badgeType: 'blue',
    description:
      'Peer-reviewed technical project exposition and conference paper track evaluated by distinguished IEEE Senior Members, academicians, and startup founders. Best papers receive IEEE Xplore submission support.',
    prizes: 'Best Paper Awards + Mentorship Grants',
  },
  {
    id: 'ieeextreme-prep',
    title: 'IEEEXtreme 24h: Algorithmic Sprint Camp',
    month: 'JUL',
    day: '18',
    dates: 'July 18, 2026',
    time: '02:00 PM – 07:00 PM IST',
    venue: 'MCA Tech Lab 4, NMAMIT',
    category: 'Workshops',
    badge: 'Internal Sprint',
    badgeType: 'blue',
    description:
      'Prep camp for the worldwide IEEEXtreme 24-hour virtual programming challenge. Focuses on advanced graph algorithms, dynamic programming on trees, and high-speed team problem solving.',
    prizes: 'Rank Badges + Branch Squad Selection',
  },
];

const PAST_HIGHLIGHTS = [
  {
    title: 'IEEEXtreme 19.0 Global Contest',
    stat: 'Top 50 in India',
    desc: '32 NMAMIT student squads competed non-stop for 24 hours solving collegiate algorithmic problems.',
  },
  {
    title: 'HackNMAMIT 2025 Edition',
    stat: '450+ Applicants',
    desc: 'Welcomed students from 25+ universities with industry judges from top MNCs and high-growth startups.',
  },
  {
    title: 'IEEE Day Global Celebrations',
    stat: '3-Day Tech Fest',
    desc: 'Keynotes from IEEE Bangalore Section delegates, hardware project expos, and campus technical quizzes.',
  },
];

export default function EventsPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Hackathons', 'Workshops', 'Symposiums'];

  const filteredEvents =
    selectedCategory === 'All'
      ? EVENTS_DATA
      : EVENTS_DATA.filter((e) => e.category === selectedCategory);

  return (
    <div className="pt-28 sm:pt-36">
      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-16 sm:pb-20 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0096D6]" />
            EVENTS & HACKATHONS · IEEE NMAMIT
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            Where student engineers build, sprint, and demo.
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-zinc-300 font-normal leading-relaxed mb-8 max-w-2xl">
            From national 24-hour hackathons in our high-performance labs to deep-dive micro-workshops in embedded systems and AI, our calendar is packed with hands-on initiatives.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#00629B] text-white font-bold shadow-md shadow-[#00629B]/30'
                    : 'bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. UPCOMING EVENTS LIST */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#0096D6] mb-1 font-bold">
              [ UPCOMING CALENDAR ]
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Scheduled Sessions & Contests
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-zinc-500">
            Showing {filteredEvents.length} events
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-xl border border-slate-200 dark:border-zinc-800/90 hover:border-[#00629B] dark:hover:border-[#00629B] bg-white dark:bg-zinc-900/30 p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 group shadow-sm"
            >
              <div>
                {/* Date & Category Top Row */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 flex flex-col items-center justify-center font-mono leading-none">
                      <span className="text-[10px] text-[#00629B] dark:text-[#0096D6] uppercase font-bold tracking-wider">
                        {event.month}
                      </span>
                      <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                        {event.day}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-mono text-slate-700 dark:text-zinc-300 block">
                        {event.dates}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded border whitespace-nowrap font-semibold ${
                      event.badgeType === 'emerald'
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40'
                        : event.badgeType === 'amber'
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40'
                        : 'text-[#00629B] dark:text-[#5db4e8] bg-[#00629B]/10 dark:bg-[#00629B]/20 border-[#00629B]/30 dark:border-[#00629B]/40'
                    }`}
                  >
                    {event.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#00629B] dark:group-hover:text-[#0096D6] transition-colors leading-snug mb-3">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-5 font-normal">
                  {event.description}
                </p>

                {/* Perks / Prizes note */}
                <div className="p-2.5 rounded bg-slate-100/80 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800/70 mb-5 flex items-center gap-2 text-[11px] font-mono text-slate-700 dark:text-zinc-300">
                  <Trophy size={13} className="text-amber-500 dark:text-amber-400 shrink-0" />
                  <span>{event.prizes}</span>
                </div>
              </div>

              {/* Venue, Time & Action */}
              <div className="pt-4 border-t border-slate-200 dark:border-zinc-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-zinc-400">
                  <MapPin size={13} className="text-slate-400 dark:text-zinc-500 shrink-0" />
                  <span className="truncate">{event.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-zinc-400">
                  <Clock size={13} className="text-slate-400 dark:text-zinc-500 shrink-0" />
                  <span>{event.time}</span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full py-2.5 rounded border border-slate-300 dark:border-zinc-700 hover:border-[#00629B] bg-slate-100 hover:bg-[#00629B] dark:bg-zinc-900 dark:hover:bg-[#00629B] hover:text-white text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-zinc-200 transition-colors text-center font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>RSVP & Event Guidelines</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PAST HIGHLIGHTS */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <div className="mb-10">
          <div className="text-xs font-mono uppercase tracking-widest text-[#0096D6] mb-1 font-bold">
            [ TRACK RECORD ]
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Past Flagship Achievements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PAST_HIGHLIGHTS.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#07090e] flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white block mb-1">
                  {item.stat}
                </span>
                <h3 className="text-sm font-semibold text-[#00629B] dark:text-[#5db4e8] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Terminal,
  Cpu,
  Code2,
  BookOpen,
  Users2,
  Github,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  CheckCircle2,
} from 'lucide-react';

// Headline alternatives:
// 1. "Advancing Technology. Empowering Students." (Default)
// 2. "Engineering Tomorrow's Pioneers. Inspiring Innovation."
// 3. "Innovate. Collaborate. Lead the Global Tech Frontier."

// Placeholder metrics — update with official annual report data
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

// Placeholder event data — plug into campus CMS or Google Calendar API
const UPCOMING_EVENTS = [
  {
    id: 'hacknmamit',
    title: 'HackNMAMIT 2026: 24h Flagship Hackathon',
    month: 'MAR',
    day: '28',
    dates: 'March 28–29, 2026',
    time: 'Starts 09:00 AM IST',
    venue: 'Centre for High Performance Computing, NMAMIT',
    category: 'Flagship Hackathon',
    badge: 'Registration Open',
    summary:
      'Our annual national-tier sprint. 60+ selected teams, 24 hours of non-stop engineering, and industry evaluation across Smart Cities, Decentralized Tech, and Healthcare.',
    link: '#events',
  },
  {
    id: 'edge-ai-lab',
    title: 'Edge AI & Quantized Models on Microcontrollers',
    month: 'APR',
    day: '11',
    dates: 'April 11, 2026',
    time: '10:00 AM – 04:30 PM IST',
    venue: 'MCA Seminar Hall, Ground Floor',
    category: 'Technical Workshop',
    badge: 'Limited Seats',
    summary:
      'Hands-on lab taking custom neural networks, pruning weights with TensorRT/TFLite-Micro, and flashing them directly to ESP32-S3 and ARM Cortex-M microcontrollers.',
    link: '#events',
  },
  {
    id: 'innovatex-symposium',
    title: 'InnovateX: Student Project & Research Colloquium',
    month: 'MAY',
    day: '02',
    dates: 'May 02, 2026',
    time: '09:30 AM – 05:00 PM IST',
    venue: 'Sambhram Auditorium & Exhibition Quad',
    category: 'Paper Presentation',
    badge: 'Call for Abstracts',
    summary:
      'Peer-reviewed exhibition where NMAMIT student innovators showcase capstone projects and research drafts to an evaluation jury of IEEE Senior Members.',
    link: '#events',
  },
];

export default function IEEEHomepage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const eventsScrollRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleEventsScroll = (direction) => {
    if (eventsScrollRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      eventsScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#06070a] text-zinc-100 font-sans selection:bg-[#00629B] selection:text-white antialiased">
      {/* Background: Fine architectural grid and deep vignette */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00629B]/[0.08] via-transparent to-transparent" />

      {/* 1. NAVBAR */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
          navScrolled
            ? 'bg-[#06070a]/90 backdrop-blur-md border-b border-zinc-800/80 py-3.5'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
          {/* Logo Placeholder */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded border border-zinc-700 bg-zinc-900/80 flex items-center justify-center text-[#0096D6] font-mono font-bold text-xs group-hover:border-[#00629B] transition-colors">
              IE
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-white transition-colors">
                IEEE NMAMIT
              </span>
              <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase">
                Student Branch · STB 65421
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono uppercase tracking-wider text-zinc-400">
            <a href="#" className="text-zinc-100 hover:text-[#0096D6] transition-colors">
              // home
            </a>
            <a href="#what-we-do" className="hover:text-zinc-100 transition-colors">
              initiatives
            </a>
            <a href="#events" className="hover:text-zinc-100 transition-colors">
              events
            </a>
            <a href="#about" className="hover:text-zinc-100 transition-colors">
              about
            </a>
            <a href="#footer" className="hover:text-zinc-100 transition-colors">
              contact
            </a>
          </nav>

          {/* CTA & Status */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-[11px] font-mono text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Nitte, KA</span>
            </div>
            <a
              href="#about"
              className="text-xs font-mono tracking-wide uppercase px-3.5 py-1.5 rounded border border-[#00629B]/80 bg-[#00629B]/20 text-[#0096D6] hover:bg-[#00629B] hover:text-white transition-all"
            >
              Join Branch
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden border-b border-zinc-800 bg-[#090b10] px-6 py-5 mt-2 space-y-3 font-mono text-xs uppercase tracking-wider">
            <a
              href="#"
              onClick={() => setMenuOpen(false)}
              className="block text-zinc-200 hover:text-[#0096D6] py-1"
            >
              // 01 Home
            </a>
            <a
              href="#what-we-do"
              onClick={() => setMenuOpen(false)}
              className="block text-zinc-400 hover:text-white py-1"
            >
              // 02 What We Do
            </a>
            <a
              href="#events"
              onClick={() => setMenuOpen(false)}
              className="block text-zinc-400 hover:text-white py-1"
            >
              // 03 Events
            </a>
            <a
              href="#about"
              onClick={() => setMenuOpen(false)}
              className="block text-zinc-400 hover:text-white py-1"
            >
              // 04 About Branch
            </a>
            <div className="pt-3 border-t border-zinc-800/80 flex gap-3">
              <a
                href="#events"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 rounded border border-zinc-700 bg-zinc-800/60 text-zinc-200"
              >
                View Events
              </a>
              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center py-2 rounded bg-[#00629B] text-white font-medium"
              >
                Join IEEE
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10 pt-32 sm:pt-40">
        {/* 2. HERO */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20 sm:pb-24 border-b border-zinc-800/80">
          <div className="max-w-3xl">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900/60 text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0096D6]" />
              IEEE · NMAMIT · Student Branch
            </div>

            {/* Bold headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
              Advancing Technology.{' '}
              <span className="text-zinc-400 font-semibold block sm:inline">
                Empowering Students.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed mb-8 max-w-2xl">
              The official technical student branch of NMAM Institute of Technology, Nitte. We bridge academic theory with real engineering — open hardware, competitive code, peer research, and a direct link to the global IEEE society.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5">
              <a
                href="#events"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#00629B] hover:bg-[#0077b6] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
              >
                <span>Explore Events</span>
                <ArrowRight size={14} />
              </a>

              <a
                href="#about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-zinc-700 hover:border-zinc-500 bg-zinc-900/40 text-zinc-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
              >
                <span>Join Student Branch</span>
                <ArrowUpRight size={14} className="text-zinc-500" />
              </a>
            </div>

            {/* Quick affiliation strip */}
            <div className="mt-12 flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="text-zinc-600">Region:</span> IEEE Region 10 (Asia-Pacific)
              </span>
              <span className="text-zinc-700 hidden sm:inline">/</span>
              <span className="flex items-center gap-1.5">
                <span className="text-zinc-600">Section:</span> Bangalore Section
              </span>
              <span className="text-zinc-700 hidden sm:inline">/</span>
              <span className="flex items-center gap-1.5">
                <span className="text-zinc-600">Sub-Section:</span> Mangalore
              </span>
            </div>
          </div>
        </section>

        {/* 3. STATS STRIP */}
        <section id="stats" className="border-b border-zinc-800/80 bg-[#08090e]/60">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {BRANCH_STATS.map((stat, i) => (
                <div key={i} className="flex flex-col border-l border-zinc-800 pl-4 sm:pl-6 first:border-l-0">
                  <div className="text-2xl sm:text-4xl font-bold font-mono text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-zinc-200 mt-1">
                    {stat.label}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    {stat.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. WHAT WE DO — NUMBERED FEATURE CARDS */}
        <section id="what-we-do" className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24 border-b border-zinc-800/80">
          {/* Eyebrow & Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#0096D6] mb-1.5">
                [ 01 ] CORE INITIATIVES
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                What we build, research, and run.
              </h2>
            </div>
            <p className="text-xs font-mono text-zinc-400 max-w-sm">
              Hands-on engineering tracks designed to turn students from consumers of tech into contributors.
            </p>
          </div>

          {/* Cards 01-04 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {PILLARS.map((pillar) => {
              const IconComp = pillar.icon;
              return (
                <div
                  key={pillar.number}
                  className="group relative rounded border border-zinc-800/90 hover:border-[#00629B] bg-zinc-900/30 hover:bg-zinc-900/60 p-6 sm:p-7 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Number & Monospace Tag */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-bold text-zinc-500 group-hover:text-[#0096D6] transition-colors">
                          {pillar.number}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2 py-0.5 rounded border border-zinc-800 bg-zinc-950">
                          {pillar.label}
                        </span>
                      </div>
                      <div className="text-zinc-500 group-hover:text-zinc-200 transition-colors">
                        <IconComp size={18} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white tracking-tight mb-2.5">
                      {pillar.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Micro tags */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-zinc-800/80">
                    {pillar.topics.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800/70"
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

        {/* 5. UPCOMING EVENTS PREVIEW */}
        <section id="events" className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24 border-b border-zinc-800/80">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#0096D6] mb-1.5">
                [ 02 ] OUR EVENTS
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Upcoming workshops & hackathons.
              </h2>
            </div>

            {/* Horizontal scroll triggers */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleEventsScroll('left')}
                  className="p-2 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Previous events"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleEventsScroll('right')}
                  className="p-2 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Next events"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <a
                href="#events"
                className="text-xs font-mono uppercase tracking-wider text-[#0096D6] hover:text-cyan-300 inline-flex items-center gap-1 transition-colors"
              >
                <span>View all events</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

          {/* Horizontally scrolling events strip */}
          <div
            ref={eventsScrollRef}
            className="flex gap-5 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory -mx-5 px-5 sm:mx-0 sm:px-0"
          >
            {UPCOMING_EVENTS.map((event) => (
              <div
                key={event.id}
                className="flex-none w-[300px] sm:w-[350px] snap-start rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/30 p-5 flex flex-col justify-between group transition-colors"
              >
                <div>
                  {/* Event card top bar with date badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-11 h-11 rounded border border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center font-mono leading-none">
                        <span className="text-[10px] text-[#0096D6] uppercase font-bold tracking-wider">
                          {event.month}
                        </span>
                        <span className="text-sm font-bold text-white mt-0.5">
                          {event.day}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-mono text-zinc-300">
                          {event.dates}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {event.category}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded whitespace-nowrap">
                      {event.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-white group-hover:text-[#0096D6] transition-colors leading-snug mb-2.5">
                    {event.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-4 font-normal">
                    {event.summary}
                  </p>
                </div>

                {/* Venue & Metadata */}
                <div className="pt-3.5 border-t border-zinc-800/70 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                    <MapPin size={12} className="text-zinc-500 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                    <Clock size={12} className="text-zinc-500 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <button
                    type="button"
                    className="mt-2 w-full py-2 px-3 rounded border border-zinc-800 hover:border-[#00629B] bg-zinc-900/60 hover:bg-[#00629B] hover:text-white text-[11px] font-mono uppercase tracking-wider text-zinc-300 transition-colors text-center font-medium"
                  >
                    Event Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. ABOUT TEASER */}
        <section id="about" className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24 border-b border-zinc-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Heading & Context */}
            <div className="lg:col-span-5">
              <div className="text-xs font-mono uppercase tracking-widest text-[#0096D6] mb-2">
                [ 03 ] WHO WE ARE
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mb-4">
                Chartered at NMAMIT Nitte to advance technology for humanity.
              </h2>
              <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                NMAM Institute of Technology, established 1986, is an autonomous constituent engineering college under Nitte (Deemed to be University).
              </p>
            </div>

            {/* Right Column: Mission blurb & facts */}
            <div className="lg:col-span-7 space-y-5">
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                The IEEE Student Branch at NMAMIT operates as an engineering hub for undergraduates across computer science, electronics, and mechanical disciplines. We cultivate a culture of pragmatic learning through technical talks, project showcases, and competition squads.
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Our active chapters include the IEEE Computer Society, Robotics & Automation Society (RAS), and Women in Engineering (WIE) Affinity Group. Members collaborate with peers across Karnataka via the IEEE Mangalore Sub-Section and Bangalore Section.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded border border-zinc-700 hover:border-zinc-500 bg-zinc-900 text-zinc-200 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  <span>Learn more about us</span>
                  <ArrowRight size={13} />
                </a>

                <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>Officially recognized student branch</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. FOOTER */}
      <footer id="footer" className="bg-[#040507] py-14 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Col 1: Wordmark & Tagline */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 rounded border border-zinc-800 bg-zinc-900 flex items-center justify-center text-[#0096D6] font-mono font-bold text-[10px]">
                  IE
                </div>
                <span className="font-bold text-sm text-white tracking-tight">
                  IEEE Student Branch NMAMIT
                </span>
              </div>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed mb-5 font-normal">
                Advancing Technology for Humanity. Empowering student engineers and researchers at NMAM Institute of Technology, Nitte.
              </p>
              
              {/* Social icons */}
              <div className="flex items-center gap-2.5">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={14} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={14} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded border border-zinc-800 hover:border-zinc-600 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={14} />
                </a>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-3">
                Index
              </div>
              <ul className="space-y-2 text-xs font-mono text-zinc-400">
                <li><a href="#" className="hover:text-zinc-200 transition-colors">Home</a></li>
                <li><a href="#what-we-do" className="hover:text-zinc-200 transition-colors">What We Do</a></li>
                <li><a href="#events" className="hover:text-zinc-200 transition-colors">Events & Labs</a></li>
                <li><a href="#about" className="hover:text-zinc-200 transition-colors">About Branch</a></li>
              </ul>
            </div>

            {/* Col 3: Contact & Address */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-3">
                Campus Location
              </div>
              <div className="space-y-2.5 text-xs text-zinc-400 font-normal">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-[#0096D6] shrink-0" />
                  <a href="mailto:ieee@nmamit.in" className="hover:text-zinc-200 font-mono">
                    ieee@nmamit.in
                  </a>
                </div>
                <div className="flex items-start gap-2 text-[11px] leading-relaxed text-zinc-400">
                  <MapPin size={13} className="text-[#0096D6] shrink-0 mt-0.5" />
                  <span>
                    NMAM Institute of Technology, Nitte, Karkala Taluk, Udupi, Karnataka, India — 574110
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom line */}
          <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-zinc-400">
            <p>© {new Date().getFullYear()} IEEE Student Branch NMAMIT. All rights reserved.</p>
            <p className="text-zinc-400">
              Affiliated with IEEE Bangalore Section & Mangalore Sub-Section
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

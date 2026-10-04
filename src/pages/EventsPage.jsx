import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Trophy,
  Tag as TagIcon,
  Cpu,
  Terminal,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';
import { EVENTS_DATA } from '../data/events.js';
import Reveal from '../components/Reveal';
import ShaderAurora from '../components/ShaderAurora';

// Format ISO date string into readable calendar parts
const formatEventDate = (isoString) => {
  const d = new Date(isoString);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return {
    month: months[d.getMonth()],
    fullMonth: fullMonths[d.getMonth()],
    day: String(d.getDate()).padStart(2, '0'),
    year: d.getFullYear(),
    displayDate: `${fullMonths[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
    time: d.getTime(),
  };
};

// Map categories to visual abstract styles
const getCategoryVisuals = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('workshop')) {
    return { icon: Cpu, from: 'from-[#00629B]/40', via: 'via-slate-900', to: 'to-[#002844]', text: 'text-[#0096D6]/60' };
  } else if (cat.includes('hackathon')) {
    return { icon: Terminal, from: 'from-emerald-500/40', via: 'via-slate-900', to: 'to-emerald-950', text: 'text-emerald-400/60' };
  } else if (cat.includes('flagship')) {
    return { icon: Trophy, from: 'from-amber-500/40', via: 'via-slate-900', to: 'to-amber-950', text: 'text-amber-400/60' };
  } else {
    return { icon: Activity, from: 'from-purple-500/40', via: 'via-slate-900', to: 'to-purple-950', text: 'text-purple-400/60' };
  }
};

const matchesCategory = (event, categoryFilter) => {
  if (categoryFilter === 'All') return true;
  if (categoryFilter === 'Flagship') return event.isFlagship || event.category === 'Flagship';
  if (categoryFilter === 'Workshops') return event.category?.includes('Workshop');
  if (categoryFilter === 'Hackathons') return event.category?.includes('Hackathon');
  if (categoryFilter === 'Competitions') return event.category?.includes('Competition');
  return event.category?.toLowerCase() === categoryFilter.toLowerCase();
};

export default function EventsPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Workshops', 'Hackathons', 'Flagship', 'Competitions'];
  const filterWrapperRef = useRef(null);
  const activePillRef = useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const now = new Date().getTime();

  // Split & Sort Events
  const allEvents = useMemo(() => {
    return EVENTS_DATA.map(e => ({ ...e, parsedDate: new Date(e.date) }));
  }, []);

  const upcomingEvents = allEvents
    .filter((e) => e.parsedDate >= today && matchesCategory(e, selectedCategory))
    .sort((a, b) => a.parsedDate - b.parsedDate);

  const pastEvents = allEvents
    .filter((e) => e.parsedDate < today && matchesCategory(e, selectedCategory))
    .sort((a, b) => b.parsedDate - a.parsedDate);

  const flagshipEvents = allEvents.filter((e) => e.isFlagship);

  // Sliding Indicator Logic (reused from Navbar)
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0, left: 0, width: 0 });
  
  const updateIndicator = () => {
    if (activePillRef.current && filterWrapperRef.current) {
      const parentRect = filterWrapperRef.current.getBoundingClientRect();
      const childRect = activePillRef.current.getBoundingClientRect();
      setIndicatorStyle({
        opacity: 1,
        left: childRect.left - parentRect.left,
        width: childRect.width,
      });
    }
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [selectedCategory]);

  // Hero GSAP Animations
  const heroRef = useRef(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    
    // Split text simulation for headline (word by word)
    const words = heroRef.current.querySelectorAll('.word-reveal');
    gsap.fromTo(words, 
      { y: 60, opacity: 0, rotateX: 45 },
      { y: 0, opacity: 1, rotateX: 0, stagger: 0.1, duration: 1.2, ease: "expo.out", delay: 0.2 }
    );
    
    gsap.fromTo('.hero-fade-up',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 1, ease: "power3.out", delay: 0.8 }
    );
  }, { scope: heroRef });

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-zinc-950 selection:bg-ieee-blue selection:text-white pb-32">
      
      {/* Dimensional Background */}
      <div className="absolute inset-0 pointer-events-none z-0 h-[80vh] opacity-30 dark:opacity-50 mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)">
        <ShaderAurora colorStart="#00629B" colorEnd="#0096D6" />
      </div>

      <div className="relative z-10 pt-32 sm:pt-40">
        
        {/* 1. HERO SECTION */}
        <section ref={heroRef} className="max-w-7xl mx-auto px-6 sm:px-12 mb-20 sm:mb-32 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <div className="flex-1">
            <div className="hero-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-ieee-blue dark:text-ieee-teal border border-ieee-blue/20 dark:border-ieee-teal/20 mb-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ieee-blue dark:bg-ieee-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ieee-blue dark:bg-ieee-teal"></span>
              </span>
              <span>Live Event Calendar</span>
            </div>

            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-8 uppercase [perspective:1000px]">
              <span className="inline-block overflow-hidden"><span className="word-reveal inline-block origin-bottom">Where</span></span>{' '}
              <span className="inline-block overflow-hidden"><span className="word-reveal inline-block origin-bottom">students</span></span>{' '}
              <span className="inline-block overflow-hidden"><span className="word-reveal inline-block origin-bottom text-transparent bg-clip-text bg-gradient-to-r from-ieee-blue to-[#0096D6]">build</span></span>{' '}
              <br/>
              <span className="inline-block overflow-hidden"><span className="word-reveal inline-block origin-bottom">the</span></span>{' '}
              <span className="inline-block overflow-hidden"><span className="word-reveal inline-block origin-bottom">future.</span></span>
            </h1>

            <p className="hero-fade-up text-lg sm:text-xl text-slate-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">
              From global 36-hour hackathons to deep-dive micro-workshops in embedded AI. Track, register, and archive the engineering journey.
            </p>
          </div>

          {/* Live Countdown to Next Event */}
          {upcomingEvents.length > 0 && (
            <div className="hero-fade-up w-full lg:w-auto shrink-0">
              <CountdownCard event={upcomingEvents[0]} />
            </div>
          )}
        </section>

        {/* Sticky Sliding Filter */}
        <div className="sticky top-[72px] z-40 bg-slate-50/80 dark:bg-zinc-950/80 backdrop-blur-xl border-y border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3 flex items-center overflow-x-auto no-scrollbar" ref={filterWrapperRef}>
            
            {/* Sliding Indicator */}
            <div 
              className="absolute h-8 bg-white dark:bg-zinc-800 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-black/50 border border-slate-200 dark:border-white/5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                opacity: indicatorStyle.opacity,
                transform: 'translateY(-50%)',
                top: '50%'
              }}
            />

            <div className="relative flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  ref={selectedCategory === cat ? activePillRef : null}
                  onClick={() => setSelectedCategory(cat)}
                  className={`relative z-10 px-5 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-colors duration-300 whitespace-nowrap ${
                    selectedCategory === cat 
                      ? 'text-ieee-blue dark:text-white' 
                      : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. UPCOMING EVENTS (Hierarchical) */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 py-24 sm:py-32 border-b border-slate-200 dark:border-white/5">
          <Reveal>
            <div className="mb-12">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-ieee-blue dark:text-ieee-teal font-bold mb-3 block">
                Happening Soon
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Upcoming Events
              </h2>
            </div>
          </Reveal>

          {upcomingEvents.length === 0 ? (
            <div className="w-full rounded-[2rem] border border-dashed border-slate-300 dark:border-white/10 p-16 flex flex-col items-center justify-center bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm">
              <Calendar size={48} className="text-slate-300 dark:text-zinc-700 mb-4" />
              <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">No active events in this category</p>
              <button onClick={() => setSelectedCategory('All')} className="text-sm font-mono text-ieee-blue hover:underline uppercase tracking-wider font-bold">View All</button>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Featured / Soonest Event */}
              <Reveal delay={0.1}>
                <FeaturedUpcomingCard event={upcomingEvents[0]} />
              </Reveal>

              {/* Secondary Grid */}
              {upcomingEvents.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-4">
                  {upcomingEvents.slice(1).map((event, idx) => (
                    <Reveal key={event.id} delay={0.1 * (idx % 3)}>
                      <StandardEventCard event={event} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* 3. FLAGSHIP EXPERIENCES */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 py-24 sm:py-32 border-b border-slate-200 dark:border-white/5">
          <Reveal>
            <div className="mb-16 md:flex justify-between items-end">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-500 font-bold mb-3 block flex items-center gap-2">
                  <Trophy size={14} /> Signature Experiences
                </span>
                <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Flagship Events
                </h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm mt-4 md:mt-0 font-medium">
                Our pinnacle annual hackathons and hardware challenges designed to elevate collegiate innovation.
              </p>
            </div>
          </Reveal>

          <div className="flex flex-col gap-12">
            {flagshipEvents.map((flagship, idx) => (
              <Reveal key={flagship.id} delay={0.1}>
                <FlagshipShowcaseCard event={flagship} index={idx} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* 4. PAST EVENTS ARCHIVE (Dense Grid) */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 py-24 sm:py-32">
          <Reveal>
            <div className="mb-16">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500 font-bold mb-3 block">
                The Archive
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Past Events
              </h2>
            </div>
          </Reveal>

          {pastEvents.length === 0 ? (
             <div className="py-12 text-zinc-500 font-mono text-sm">No archives found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {pastEvents.map((event, idx) => (
                <Reveal key={event.id} delay={0.05 * (idx % 4)}>
                  <PastArchiveCard event={event} />
                </Reveal>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/* Sub-Components (Usually broken out, kept here for single-file artifact)      */
/* -------------------------------------------------------------------------- */

// 1. Live Countdown Card for Hero
const CountdownCard = ({ event }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const eventTime = event.parsedDate.getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventTime - now;
      if (distance < 0) return clearInterval(timer);
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [eventTime]);

  return (
    <div className="relative p-8 rounded-[2rem] bg-white/60 dark:bg-[#0A0A0A]/80 backdrop-blur-2xl border border-slate-200 dark:border-white/5 shadow-2xl min-w-[300px]">
      <div className="absolute inset-0 bg-gradient-to-br from-ieee-blue/5 to-transparent rounded-[2rem] pointer-events-none" />
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-zinc-500 mb-6 block">
        Next Event Starts In
      </span>
      <div className="flex gap-4 sm:gap-6 mb-8">
        <TimeUnit value={timeLeft.days} label="Days" />
        <span className="text-3xl text-slate-300 dark:text-zinc-800 font-light mt-1">:</span>
        <TimeUnit value={timeLeft.hours} label="Hrs" />
        <span className="text-3xl text-slate-300 dark:text-zinc-800 font-light mt-1">:</span>
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <span className="text-3xl text-slate-300 dark:text-zinc-800 font-light mt-1">:</span>
        <TimeUnit value={timeLeft.seconds} label="Sec" className="text-ieee-blue dark:text-ieee-teal" />
      </div>
      <div className="pt-6 border-t border-slate-200 dark:border-white/10">
        <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white truncate">{event.title}</h3>
        <p className="text-xs font-mono text-slate-500 mt-2">{formatEventDate(event.date).displayDate}</p>
      </div>
    </div>
  );
};

const TimeUnit = ({ value, label, className }) => (
  <div className="flex flex-col items-center">
    <span className={`text-4xl sm:text-5xl font-heading font-black text-slate-900 dark:text-white tabular-nums tracking-tighter ${className || ''}`}>
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-2">{label}</span>
  </div>
);

// 2. Featured Upcoming Card (Massive Layout)
const FeaturedUpcomingCard = ({ event }) => {
  const dateInfo = formatEventDate(event.date);
  const visuals = getCategoryVisuals(event.category);
  const posterUrl = event.posterImage || event.poster;
  const Icon = visuals.icon;

  return (
    <article className="group relative w-full flex flex-col lg:flex-row bg-white dark:bg-zinc-900/40 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-200/80 dark:border-white/5 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none hover:border-ieee-blue/50 dark:hover:border-ieee-blue/30 transition-colors">
      {/* Abstract Poster or Real Image */}
      <div className="relative w-full lg:w-1/2 aspect-[4/3] lg:aspect-auto overflow-hidden bg-slate-900 shrink-0">
        {posterUrl && posterUrl !== 'null' ? (
          <img src={posterUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${visuals.from} ${visuals.via} ${visuals.to} flex items-center justify-center transition-transform duration-700 group-hover:scale-105`}>
            <Icon size={80} className={visuals.text} />
          </div>
        )}
        <div className="absolute top-6 left-6 flex gap-2">
          <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-white text-slate-900 shadow-sm">
            {event.category}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-ieee-blue text-white shadow-sm gap-1 animate-pulse">
             Happening Soon
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-8 sm:p-12 lg:p-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center">
             <span className="text-[10px] font-mono uppercase font-bold text-ieee-blue">{dateInfo.month}</span>
             <span className="text-xl font-heading font-black text-slate-900 dark:text-white leading-none mt-1">{dateInfo.day}</span>
          </div>
          <div>
            <span className="text-sm font-mono text-slate-500 block mb-1">{dateInfo.displayDate}</span>
            <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1"><Clock size={12}/> {event.time}</span>
          </div>
        </div>

        <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-[1.1] group-hover:text-ieee-blue transition-colors">
          {event.title}
        </h3>
        
        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed mb-10 font-medium">
          {event.description}
        </p>

        <div className="mt-auto flex flex-col sm:flex-row items-center gap-6 pt-8 border-t border-slate-200 dark:border-white/10">
          <a href={event.registrationLink || '#'} className="w-full sm:w-auto px-8 py-4 rounded-full bg-ieee-blue hover:bg-[#0077be] text-white font-bold text-sm uppercase tracking-wider transition-transform hover:scale-105 inline-flex items-center justify-center gap-2">
            <span>Register Now</span> <ArrowRight size={16} />
          </a>
          <div className="flex items-center gap-2 text-sm font-mono text-slate-500 font-medium">
            <MapPin size={16} className="text-ieee-blue" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

// 3. Standard Upcoming Grid Card
const StandardEventCard = ({ event }) => {
  const dateInfo = formatEventDate(event.date);
  const visuals = getCategoryVisuals(event.category);
  const posterUrl = event.posterImage || event.poster;
  const Icon = visuals.icon;

  return (
    <article className="group relative flex flex-col h-full bg-white dark:bg-zinc-900/40 rounded-[1.5rem] border border-slate-200/80 dark:border-white/5 overflow-hidden transition-all duration-300 hover:border-ieee-blue/40 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/50">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0">
        {posterUrl && posterUrl !== 'null' ? (
           <img src={posterUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
           <div className={`w-full h-full bg-gradient-to-br ${visuals.from} ${visuals.via} ${visuals.to} flex items-center justify-center transition-transform duration-700 group-hover:scale-105`}>
             <Icon size={48} className={visuals.text} />
           </div>
        )}
        <div className="absolute top-4 left-4 inline-flex px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider font-bold bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-sm">
          {event.category}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xl font-heading font-black text-ieee-blue">{dateInfo.day} {dateInfo.month}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
          <span className="text-xs font-mono text-slate-500">{event.time.split(' ')[0]} {event.time.split(' ')[1]}</span>
        </div>
        <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-ieee-blue transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-2 mb-6">
          {event.description}
        </p>
        <div className="mt-auto border-t border-slate-100 dark:border-white/5 pt-5">
           <span className="text-xs font-mono text-slate-500 flex items-center gap-2 truncate"><MapPin size={12}/> {event.venue}</span>
        </div>
      </div>
      <a href={event.registrationLink || '#'} className="absolute inset-0 z-10"><span className="sr-only">View</span></a>
    </article>
  );
};

// 4. Flagship Showcase (Horizontal, Amber Accent, Magnetic Hover simulation)
const FlagshipShowcaseCard = ({ event, index }) => {
  const dateInfo = formatEventDate(event.date);
  const posterUrl = event.posterImage || event.poster;
  const isReversed = index % 2 !== 0;

  return (
    <div className={`group relative flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center p-6 sm:p-10 rounded-[2rem] lg:rounded-[3rem] bg-white dark:bg-[#0A0C10] border border-amber-500/20 dark:border-amber-500/10 hover:border-amber-500/40 transition-colors shadow-2xl shadow-amber-500/5`}>
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Image Showcase */}
      <div className="relative w-full lg:w-3/5 aspect-[4/3] rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden bg-slate-900 shrink-0 border border-slate-200 dark:border-white/10 z-10">
        {posterUrl && posterUrl !== 'null' ? (
           <img src={posterUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        ) : (
           <div className="w-full h-full bg-gradient-to-br from-amber-500/40 via-slate-900 to-amber-950 flex items-center justify-center transition-transform duration-1000 group-hover:scale-110">
             <Trophy size={80} className="text-amber-400/60" />
           </div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
      </div>

      {/* Editorial Content */}
      <div className="flex flex-col flex-1 z-10">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 mb-6 self-start">
          <Sparkles size={12} /> {formatEventDate(event.date).year} Edition
        </span>
        
        <h3 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight">
          {event.title}
        </h3>
        
        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed mb-8 font-medium">
          {event.description}
        </p>
        
        <div className="flex items-center gap-6 mb-10 text-sm font-mono text-slate-500">
           <div className="flex flex-col gap-1">
             <span className="uppercase text-[10px] tracking-widest text-slate-400">Date</span>
             <span className="font-bold text-slate-700 dark:text-zinc-300">{dateInfo.displayDate}</span>
           </div>
           <div className="w-px h-8 bg-slate-200 dark:bg-zinc-800" />
           <div className="flex flex-col gap-1">
             <span className="uppercase text-[10px] tracking-widest text-slate-400">Venue</span>
             <span className="font-bold text-slate-700 dark:text-zinc-300 truncate max-w-[150px]">{event.venue.split(',')[0]}</span>
           </div>
        </div>

        <a href={event.registrationLink || '#'} className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white hover:text-amber-500 transition-colors self-start group/link">
          <span className="relative">
            Explore Experience
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover/link:w-full"></span>
          </span>
          <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

// 5. Past Events Archive Card (Desaturated, dense grid)
const PastArchiveCard = ({ event }) => {
  const dateInfo = formatEventDate(event.date);
  const visuals = getCategoryVisuals(event.category);
  const posterUrl = event.posterImage || event.poster;
  const Icon = visuals.icon;

  return (
    <article className="group cursor-pointer flex flex-col h-full bg-white dark:bg-zinc-900/20 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden hover:bg-slate-50 dark:hover:bg-zinc-900/60 transition-colors">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        {posterUrl && posterUrl !== 'null' ? (
           <img src={posterUrl} alt={event.title} className="w-full h-full object-cover grayscale opacity-70 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" />
        ) : (
           <div className={`w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}>
             <Icon size={32} className="text-slate-600" />
           </div>
        )}
        <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-white px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded">
          {dateInfo.year}
        </div>
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 mb-2">{event.category}</span>
        <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-zinc-200 group-hover:text-ieee-blue transition-colors line-clamp-2 leading-snug">
          {event.title}
        </h3>
      </div>
    </article>
  );
};

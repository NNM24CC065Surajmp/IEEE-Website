import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Trophy,
  Activity,
  Cpu,
  Terminal
} from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';
import { EVENTS_DATA } from '../data/events.js';
import Reveal from '../components/Reveal';
import FilterTabs from '../components/FilterTabs';

// --------------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------------

const formatEventDate = (isoString) => {
  const d = new Date(isoString);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return {
    month: months[d.getMonth()],
    fullMonth: fullMonths[d.getMonth()],
    day: String(d.getDate()).padStart(2, '0'),
    year: String(d.getFullYear()),
    displayDate: `${fullMonths[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
    time: d.getTime(),
  };
};

const getCategoryVisuals = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('workshop')) return { icon: Cpu, baseColor: 'text-[#0096D6]', bg: 'bg-[#0096D6]/10' };
  if (cat.includes('hackathon')) return { icon: Terminal, baseColor: 'text-emerald-500', bg: 'bg-emerald-500/10' };
  if (cat.includes('flagship')) return { icon: Trophy, baseColor: 'text-amber-500', bg: 'bg-amber-500/10' };
  return { icon: Activity, baseColor: 'text-purple-500', bg: 'bg-purple-500/10' };
};

// --------------------------------------------------------------------------
// Sub-Components
// --------------------------------------------------------------------------

// Abstract Circuit Pattern Fallback Background
const AbstractFallback = ({ category }) => {
  const visuals = getCategoryVisuals(category);
  const Icon = visuals.icon;
  return (
    <div className={`w-full h-full relative overflow-hidden flex items-center justify-center ${visuals.bg} transition-transform duration-700 group-hover:scale-105`}>
      {/* Circuit Pattern SVG Background */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px', color: 'white' }}>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/40" />
      <Icon size={64} className={`${visuals.baseColor} drop-shadow-2xl relative z-10 opacity-80 group-hover:opacity-100 transition-opacity`} />
    </div>
  );
};

// Flip Countdown Unit
const FlipUnit = ({ value, label, className }) => {
  const prevValueRef = useRef(value);
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      }, 150); // half of flip duration
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  const strVal = String(displayValue).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden h-[3.5rem] sm:h-[4.5rem]">
        <span className={`block text-4xl sm:text-5xl font-heading font-black text-slate-900 dark:text-white tabular-nums tracking-tighter ${className || ''} transition-transform duration-300 ${isFlipping ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
          {strVal}
        </span>
      </div>
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-1">{label}</span>
    </div>
  );
};

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
    <div className="relative p-8 rounded-[2rem] bg-white/60 dark:bg-[#0A0A0A]/60 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl min-w-[300px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ieee-blue/5 to-transparent pointer-events-none" />
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-zinc-400 mb-6 block relative z-10">
        Next Event Starts In
      </span>
      <div className="flex gap-4 sm:gap-6 mb-8 relative z-10">
        <FlipUnit value={timeLeft.days} label="Days" />
        <span className="text-3xl text-slate-300 dark:text-zinc-800 font-light mt-1">:</span>
        <FlipUnit value={timeLeft.hours} label="Hrs" />
        <span className="text-3xl text-slate-300 dark:text-zinc-800 font-light mt-1">:</span>
        <FlipUnit value={timeLeft.minutes} label="Min" />
        <span className="text-3xl text-slate-300 dark:text-zinc-800 font-light mt-1">:</span>
        <FlipUnit value={timeLeft.seconds} label="Sec" className="text-ieee-blue dark:text-ieee-teal" />
      </div>
      <div className="pt-6 border-t border-slate-200 dark:border-white/10 relative z-10">
        <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white truncate">{event.title}</h3>
        <p className="text-xs font-mono text-slate-500 mt-2">{formatEventDate(event.date).displayDate}</p>
      </div>
    </div>
  );
};

// Flagship Showcase Card with Magnetic Hover
const FlagshipShowcaseCard = ({ event, index }) => {
  const dateInfo = formatEventDate(event.date);
  const imageUrl = event.image || event.poster || event.posterImage;
  const isReversed = index % 2 !== 0;
  
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  
  // Magnetic / Tilt effect for Flagship cards
  useGSAP(() => {
    if (prefersReducedMotion() || !cardRef.current) return;
    
    const xTo = gsap.quickTo(imageRef.current, "rotationY", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(imageRef.current, "rotationX", { duration: 0.5, ease: "power3" });

    const handleMouseMove = (e) => {
      const rect = cardRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      xTo((relX - 0.5) * 10);
      yTo((relY - 0.5) * -10);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    cardRef.current.addEventListener('mousemove', handleMouseMove);
    cardRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mousemove', handleMouseMove);
        cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, { scope: cardRef });

  return (
    <div ref={cardRef} className={`group relative flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center p-6 sm:p-10 rounded-[2rem] lg:rounded-[3rem] bg-white/50 dark:bg-zinc-900/40 backdrop-blur-sm border border-amber-500/20 hover:border-amber-500/40 transition-colors shadow-2xl shadow-amber-500/5`}>
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative w-full lg:w-3/5 aspect-[4/3] rounded-[1.5rem] lg:rounded-[2rem] bg-slate-900 shrink-0 border border-slate-200 dark:border-white/10 z-10 [perspective:1000px]">
        <div ref={imageRef} className="w-full h-full transform-style-3d">
          {imageUrl && imageUrl !== 'null' ? (
             <img src={imageUrl} alt={event.title} className="w-full h-full object-cover rounded-[1.5rem] lg:rounded-[2rem]" />
          ) : (
             <AbstractFallback category={event.category} />
          )}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 rounded-[1.5rem] lg:rounded-[2rem]" />
        </div>
      </div>

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
          <span className="relative overflow-hidden block">
            <span className="block transition-transform duration-300 group-hover/link:-translate-y-full">Explore Experience</span>
            <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-300 group-hover/link:translate-y-0 text-amber-500">Explore Experience</span>
          </span>
          <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

// Standard Upcoming Event Card (Featured & Regular)
const EventCardVariant = ({ event, featured = false }) => {
  const dateInfo = formatEventDate(event.date);
  const imageUrl = event.image || event.poster || event.posterImage;

  if (featured) {
    return (
      <article className="group relative w-full flex flex-col lg:flex-row bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm rounded-[2rem] lg:rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden shadow-lg hover:border-ieee-blue/50 transition-colors">
        <div className="relative w-full lg:w-1/2 aspect-[4/3] lg:aspect-auto overflow-hidden bg-slate-900 shrink-0">
          {imageUrl && imageUrl !== 'null' ? (
            <img src={imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <AbstractFallback category={event.category} />
          )}
          <div className="absolute top-6 left-6 flex gap-2">
            <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-white/90 text-slate-900 shadow-sm backdrop-blur-sm">
              {event.category}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-ieee-blue text-white shadow-sm animate-pulse">
               Happening Soon
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-1 p-8 sm:p-12 lg:p-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center shadow-sm">
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
            <a href={event.registrationLink || '#'} className="w-full sm:w-auto px-8 py-4 rounded-full bg-ieee-blue hover:bg-[#0077be] text-white font-bold text-sm uppercase tracking-wider transition-transform hover:scale-105 inline-flex items-center justify-center gap-2 shadow-lg shadow-ieee-blue/20">
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
  }

  return (
    <article className="group relative flex flex-col h-full bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm rounded-[1.5rem] border border-slate-200 dark:border-white/5 overflow-hidden transition-all duration-300 hover:border-ieee-blue/40 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-black/50">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0">
        {imageUrl && imageUrl !== 'null' ? (
           <img src={imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
           <AbstractFallback category={event.category} />
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
        <div className="mt-auto border-t border-slate-200 dark:border-white/5 pt-5">
           <span className="text-xs font-mono text-slate-500 flex items-center gap-2 truncate"><MapPin size={12}/> {event.venue}</span>
        </div>
      </div>
      <a href={event.registrationLink || '#'} className="absolute inset-0 z-10"><span className="sr-only">View</span></a>
    </article>
  );
};

// Past Archive Card
const PastArchiveCard = ({ event }) => {
  const dateInfo = formatEventDate(event.date);
  const imageUrl = event.image || event.poster || event.posterImage;

  return (
    <article className="group cursor-pointer flex flex-col h-full bg-white/40 dark:bg-zinc-900/20 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden hover:bg-white/80 dark:hover:bg-zinc-900/60 transition-colors shadow-sm hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        {imageUrl && imageUrl !== 'null' ? (
           <img src={imageUrl} alt={event.title} className="w-full h-full object-cover grayscale opacity-70 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105" />
        ) : (
           <AbstractFallback category={event.category} />
        )}
        <div className="absolute top-3 right-3 text-[10px] font-mono font-bold text-white px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded border border-white/10">
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


// --------------------------------------------------------------------------
// Main Page Component
// --------------------------------------------------------------------------

export default function EventsPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  
  const categories = ['All', 'Workshops', 'Hackathons', 'Flagship', 'Competitions'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse events once
  const allEvents = useMemo(() => {
    return EVENTS_DATA.map(e => ({ ...e, parsedDate: new Date(e.date), year: String(new Date(e.date).getFullYear()) }));
  }, []);

  // Derive available years
  const availableYears = useMemo(() => {
    const years = new Set(allEvents.map(e => e.year));
    return ['All', ...Array.from(years).sort((a, b) => b - a)];
  }, [allEvents]);

  // Combined Filters
  const matchesFilters = (event) => {
    const catMatch = matchesCategory(event, selectedCategory);
    const yearMatch = selectedYear === 'All' || event.year === selectedYear;
    return catMatch && yearMatch;
  };

  const upcomingEvents = allEvents
    .filter((e) => e.parsedDate >= today && matchesFilters(e))
    .sort((a, b) => a.parsedDate - b.parsedDate);

  const pastEvents = allEvents
    .filter((e) => e.parsedDate < today && matchesFilters(e))
    .sort((a, b) => b.parsedDate - a.parsedDate);

  const flagshipEvents = allEvents
    .filter((e) => e.isFlagship && matchesFilters(e));

  // GSAP List Transition Reflow
  const listWrapperRef = useRef(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const cards = listWrapperRef.current.querySelectorAll('.event-card-anim');
    gsap.fromTo(cards, 
      { opacity: 0, y: 20, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out', overwrite: true }
    );
  }, { dependencies: [selectedCategory, selectedYear], scope: listWrapperRef });

  // Hero Reveal Animation
  const heroRef = useRef(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
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
    <div className="relative pt-32 sm:pt-40 pb-32 selection:bg-ieee-blue selection:text-white">
      
      {/* Note: ShaderAurora is mounted globally in App.jsx. No local ShaderAurora here! */}

      <div className="relative z-10">
        
        {/* HERO SECTION */}
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

          {/* Live Countdown */}
          {upcomingEvents.length > 0 && (
            <div className="hero-fade-up w-full lg:w-auto shrink-0">
              <CountdownCard event={upcomingEvents[0]} />
            </div>
          )}
        </section>

        {/* STICKY FILTER BAR */}
        <div className="sticky top-[72px] z-40 bg-slate-50/90 dark:bg-zinc-950/90 backdrop-blur-xl border-y border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500 font-bold shrink-0">Category</span>
              <FilterTabs options={categories} selected={selectedCategory} onChange={setSelectedCategory} ariaLabel="Filter by category" />
            </div>

            <div className="flex items-center gap-4 md:border-l md:border-slate-300 md:dark:border-white/10 md:pl-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500 font-bold shrink-0">Year</span>
              <FilterTabs options={availableYears} selected={selectedYear} onChange={setSelectedYear} ariaLabel="Filter by year" />
            </div>
            
          </div>
        </div>

        {/* LISTINGS WRAPPER (GSAP Transition Boundary) */}
        <div ref={listWrapperRef}>
          
          {/* UPCOMING EVENTS */}
          {upcomingEvents.length > 0 && (
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

              <div className="flex flex-col gap-8">
                <div className="event-card-anim">
                  <EventCardVariant event={upcomingEvents[0]} featured={true} />
                </div>
                {upcomingEvents.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-4">
                    {upcomingEvents.slice(1).map((event) => (
                      <div key={event.id} className="event-card-anim">
                        <EventCardVariant event={event} featured={false} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* FLAGSHIP EXPERIENCES */}
          {flagshipEvents.length > 0 && (
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
                </div>
              </Reveal>
              <div className="flex flex-col gap-12">
                {flagshipEvents.map((flagship, idx) => (
                  <div key={flagship.id} className="event-card-anim">
                    <FlagshipShowcaseCard event={flagship} index={idx} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PAST EVENTS ARCHIVE */}
          {pastEvents.length > 0 && (
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {pastEvents.map((event) => (
                  <div key={event.id} className="event-card-anim">
                    <PastArchiveCard event={event} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* EMPTY STATE */}
          {upcomingEvents.length === 0 && flagshipEvents.length === 0 && pastEvents.length === 0 && (
            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-32 flex flex-col items-center justify-center text-center event-card-anim">
              <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-zinc-900 flex items-center justify-center text-slate-400 dark:text-zinc-600 mb-6">
                <Calendar size={32} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">No events found</h3>
              <p className="text-slate-500 dark:text-zinc-400 mb-6">There are no events matching your selected category and year.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSelectedYear('All'); }}
                className="text-sm font-mono font-bold text-ieee-blue hover:underline uppercase tracking-widest"
              >
                Clear Filters
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

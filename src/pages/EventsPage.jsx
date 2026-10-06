import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
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
  Terminal,
  CheckCircle2
} from 'lucide-react';
import { gsap } from '../lib/gsap';
import { useGSAP } from '@gsap/react';
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
  if (cat.includes('workshop')) return { icon: Cpu, baseColor: 'text-[#0096D6]', bg: 'bg-[#0096D6]/10', name: 'WORKSHOP' };
  if (cat.includes('hackathon')) return { icon: Terminal, baseColor: 'text-emerald-500', bg: 'bg-emerald-500/10', name: 'HACKATHON' };
  if (cat.includes('flagship')) return { icon: Trophy, baseColor: 'text-amber-500', bg: 'bg-amber-500/10', name: 'FLAGSHIP' };
  return { icon: Activity, baseColor: 'text-purple-500', bg: 'bg-purple-500/10', name: 'EVENT' };
};

// --------------------------------------------------------------------------
// Sub-Components
// --------------------------------------------------------------------------

// Rebuilt AbstractFallback: No empty centered icons!
const AbstractFallback = ({ category, variant = 'standard' }) => {
  const visuals = getCategoryVisuals(category);
  const Icon = visuals.icon;
  
  if (variant === 'flagship') {
    return (
      <div className="absolute inset-0 w-full h-full bg-slate-900 dark:bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-slate-900 to-amber-900/40 opacity-60" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-20 mix-blend-overlay" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[80px]" />
        
        {/* Ghost Typography */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <span className="text-[140px] font-heading font-black text-transparent whitespace-nowrap transform -rotate-12 opacity-[0.03] dark:opacity-[0.05]" style={{ WebkitTextStroke: '2px currentColor', color: 'rgb(245, 158, 11)' }}>
            {visuals.name}
          </span>
        </div>
        
        {/* Repositioned Icon */}
        <div className="absolute bottom-6 right-6 opacity-30 text-amber-500 transform rotate-12">
          <Icon size={120} strokeWidth={1} />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full bg-slate-100 dark:bg-zinc-900 overflow-hidden">
      {/* Dot Grid */}
      <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px', color: 'currentColor' }} />
      
      {/* Abstract Shape / Blob */}
      <div className={`absolute -top-20 -left-20 w-72 h-72 rounded-full blur-[60px] opacity-30 ${visuals.baseColor.replace('text-', 'bg-')}`} />
      
      {/* Ghost Typography */}
      <div className="absolute inset-0 flex items-end justify-start p-4 overflow-hidden pointer-events-none">
        <span className="text-[100px] leading-none font-heading font-black text-transparent whitespace-nowrap opacity-[0.04] dark:opacity-[0.06] -ml-4" style={{ WebkitTextStroke: '1px currentColor', color: 'currentColor' }}>
          {visuals.name}
        </span>
      </div>
      
      {/* Off-center Icon bleeding off edge */}
      <div className={`absolute -bottom-4 -right-4 opacity-20 ${visuals.baseColor}`}>
        <Icon size={140} strokeWidth={0.5} />
      </div>
    </div>
  );
};

// Rebuilt EventCardVariant (Upcoming)
const EventCardVariant = ({ event, featured = false }) => {
  const dateInfo = formatEventDate(event.date);
  const imageUrl = event.image || event.poster || event.posterImage;
  const isReduced = prefersReducedMotion();

  return (
    <div className={`group relative bg-white dark:bg-zinc-900 rounded-[1.5rem] border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col h-full ${isReduced ? '' : 'transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:border-slate-300 dark:hover:border-white/10'}`}>
      
      <div className={`relative w-full overflow-hidden shrink-0 ${featured ? 'aspect-[21/9] sm:aspect-[2.5/1]' : 'aspect-video'}`}>
        {imageUrl && imageUrl !== 'null' ? (
          <>
            <img src={imageUrl} alt={event.title} className={`w-full h-full object-cover ${isReduced ? '' : 'transition-transform duration-700 group-hover:scale-105'}`} />
            {/* Dark gradient overlay for text legibility */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </>
        ) : (
          <AbstractFallback category={event.category} />
        )}
        
        {/* Category Tag overlaying image */}
        <div className="absolute top-4 left-4 z-10">
           <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md text-white border border-white/10`}>
              {event.category}
           </div>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col relative z-10 bg-white dark:bg-zinc-900">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex flex-col items-center justify-center w-12 shrink-0 border border-slate-200 dark:border-white/10 rounded-lg py-1.5 bg-slate-50 dark:bg-zinc-950">
            <span className="text-[10px] font-mono text-ieee-blue dark:text-ieee-teal uppercase font-bold">{dateInfo.month}</span>
            <span className="text-xl font-heading font-bold text-slate-900 dark:text-white leading-none mt-1">{dateInfo.day}</span>
          </div>
          <div>
            <h3 className={`font-heading font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 ${featured ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
              {event.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400 line-clamp-2">{event.description || event.shortDescription}</p>
          </div>
        </div>
        
        <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400">
             <Clock size={12} />
             <span>{event.time || 'TBA'}</span>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-widest hover:bg-ieee-blue dark:hover:bg-ieee-teal transition-colors group/btn">
              <span>Register</span>
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </div>
      </div>
    </div>
  );
};

// Rebuilt PastArchiveCard
const PastArchiveCard = ({ event }) => {
  const dateInfo = formatEventDate(event.date);
  const imageUrl = event.image || event.poster || event.posterImage;
  const isReduced = prefersReducedMotion();

  return (
    <div className={`group relative bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col h-full ${isReduced ? '' : 'transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20'}`}>
      <div className="relative w-full aspect-video overflow-hidden shrink-0">
        {imageUrl && imageUrl !== 'null' ? (
          <>
            {/* Desaturated by default, full color on hover */}
            <img src={imageUrl} alt={event.title} className={`w-full h-full object-cover grayscale-[70%] group-hover:grayscale-0 ${isReduced ? '' : 'transition-all duration-500'}`} />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </>
        ) : (
          <AbstractFallback category={event.category} />
        )}
        
        {/* Archive Marker */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10">
          <CheckCircle2 size={10} className="text-slate-300" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-300">Archived</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col bg-white dark:bg-zinc-900">
        <h3 className="font-heading font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-2 group-hover:text-ieee-blue dark:group-hover:text-ieee-teal transition-colors">{event.title}</h3>
        <div className="mt-auto flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>{dateInfo.displayDate}</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity"><ExternalLink size={12}/></span>
        </div>
      </div>
    </div>
  );
};

// Rebuilt FlagshipShowcaseCard (Magnetic/Parallax)
const FlagshipShowcaseCard = ({ event, index }) => {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const bgRef = useRef(null);
  const dateInfo = formatEventDate(event.date);
  const imageUrl = event.image || event.poster || event.posterImage;
  const isReduced = prefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (isReduced || !cardRef.current || !contentRef.current || !bgRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt calculation
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    gsap.to(cardRef.current, { rotateX, rotateY, duration: 0.5, ease: 'power2.out', transformPerspective: 1000 });
    // Parallax foreground
    gsap.to(contentRef.current, { x: (x - centerX) * 0.05, y: (y - centerY) * 0.05, duration: 0.5, ease: 'power2.out' });
    // Parallax background (inverse)
    gsap.to(bgRef.current, { x: (x - centerX) * -0.02, y: (y - centerY) * -0.02, duration: 0.5, ease: 'power2.out' });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isReduced || !cardRef.current) return;
    gsap.to([cardRef.current, contentRef.current, bgRef.current], { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
  };

  return (
    <div 
      className="relative [perspective:1200px] w-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={cardRef} 
        className="relative bg-slate-900 rounded-[2rem] border border-amber-500/20 shadow-2xl overflow-hidden flex flex-col md:flex-row group transform-style-3d"
      >
        {/* Plaque / Engraved Metal Base Texture */}
        <div ref={bgRef} className="absolute inset-0 z-0 scale-110">
           <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black" />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-10 mix-blend-overlay" />
           {/* Glow that follows hover conceptually, static for now */}
           <div className={`absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-transparent transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        {/* Image Side */}
        <div className="relative w-full md:w-2/5 aspect-[4/3] md:aspect-auto overflow-hidden shrink-0 z-10 border-r border-amber-500/10">
          {imageUrl && imageUrl !== 'null' ? (
            <>
              {/* Gold-tinted duotone overlay */}
              <div className="absolute inset-0 bg-amber-500 mix-blend-color opacity-30 z-10 pointer-events-none group-hover:opacity-10 transition-opacity duration-700" />
              <img src={imageUrl} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/90 pointer-events-none z-20" />
            </>
          ) : (
            <AbstractFallback category="Flagship" variant="flagship" />
          )}
        </div>

        {/* Content Side */}
        <div ref={contentRef} className="p-8 sm:p-12 md:w-3/5 flex flex-col justify-center relative z-20">
          <div className="flex items-center gap-3 mb-6">
            <Trophy size={20} className="text-amber-500" />
            <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-amber-500" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Signature Event</span>
          </div>
          <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-[1.1] tracking-tight" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            {event.title}
          </h3>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-xl">
            {event.description}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-slate-400">
            <div className="flex items-center gap-2"><Calendar size={16} className="text-amber-500/70" /> {dateInfo.displayDate}</div>
            <div className="flex items-center gap-2"><MapPin size={16} className="text-amber-500/70" /> {event.location || 'Main Campus'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Rebuilt CountdownCard (Hero-scale card)
const CountdownCard = ({ event }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const eventTime = event.parsedDate.getTime();
  const imageUrl = event.image || event.poster || event.posterImage;

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

  const FlipUnit = ({ value, label, className = "" }) => (
    <div className="flex flex-col items-center">
      <span className={`text-4xl sm:text-5xl font-heading font-black tracking-tighter text-slate-900 dark:text-white ${className}`}>
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 mt-1 font-bold">{label}</span>
    </div>
  );

  return (
    <div className="relative rounded-[2rem] bg-white/60 dark:bg-[#0A0A0A]/60 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-2xl min-w-[300px] sm:min-w-[400px] overflow-hidden flex flex-col group">
      <div className="absolute inset-0 bg-gradient-to-br from-ieee-blue/5 to-transparent pointer-events-none z-0" />
      
      {/* Event Image Banner */}
      <div className="w-full h-40 sm:h-48 relative overflow-hidden bg-slate-900 border-b border-white/5 z-10 shrink-0">
        {imageUrl && imageUrl !== 'null' ? (
          <img src={imageUrl} alt={event.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
        ) : (
          <AbstractFallback category={event.category} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 to-transparent pointer-events-none" />
      </div>

      <div className="p-8 relative z-10 text-left">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-zinc-400 mb-6 block">
          Next Event Starts In
        </span>
        <div className="flex justify-between gap-4 sm:gap-6 mb-8">
          <FlipUnit value={timeLeft.days} label="Days" />
          <span className="text-3xl text-slate-300 dark:text-zinc-800 font-light mt-1">:</span>
          <FlipUnit value={timeLeft.hours} label="Hrs" />
          <span className="text-3xl text-slate-300 dark:text-zinc-800 font-light mt-1">:</span>
          <FlipUnit value={timeLeft.minutes} label="Min" />
          <span className="text-3xl text-slate-300 dark:text-zinc-800 font-light mt-1">:</span>
          <FlipUnit value={timeLeft.seconds} label="Sec" className="text-ieee-blue dark:text-ieee-teal" />
        </div>
        <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="min-w-0 pr-4">
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white truncate">{event.title}</h3>
              <p className="text-xs font-mono text-slate-500 mt-2">{formatEventDate(event.date).displayDate}</p>
            </div>
            <button className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-widest hover:bg-ieee-blue dark:hover:bg-ieee-teal transition-colors group/btn">
              <span>Register</span>
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
      </div>
    </div>
  );
};
// --------------------------------------------------------------------------
// Main Page Component
// --------------------------------------------------------------------------

export default function EventsPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const listWrapperRef = useRef(null);
  const isReduced = prefersReducedMotion();

  // Parse events once

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);
  const expandedScrollYRef = useRef(0);
  const isManuallyExpandedRef = useRef(isManuallyExpanded);

  useEffect(() => {
    isManuallyExpandedRef.current = isManuallyExpanded;
  }, [isManuallyExpanded]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > 80) {
            setIsCollapsed(true);
          } else if (currentScrollY < 40) {
            setIsCollapsed(false);
            setIsManuallyExpanded(false);
          }

          if (isManuallyExpandedRef.current) {
            if (Math.abs(currentScrollY - expandedScrollYRef.current) > 100) {
              setIsManuallyExpanded(false);
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showCollapsed = isCollapsed && !isManuallyExpanded;

  const allEvents = useMemo(() => {
    return EVENTS_DATA.map(e => ({ ...e, parsedDate: new Date(e.date), year: String(new Date(e.date).getFullYear()) }));
  }, []);

  const categories = ['All', 'Workshops', 'Hackathons', 'Flagship', 'Competitions'];
  
  const availableYears = useMemo(() => {
    const years = new Set(allEvents.map(e => e.year));
    return ['All', ...Array.from(years).sort((a, b) => b - a)];
  }, [allEvents]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Combined Filters
  const matchesFilters = (event) => {
    const catMatch = selectedCategory === 'All' || (event.category && event.category.toLowerCase().replace(/s$/, '') === selectedCategory.toLowerCase().replace(/s$/, '')) || (selectedCategory === 'Flagship' && event.isFlagship);
    const yearMatch = selectedYear === 'All' || event.year === selectedYear;
    return catMatch && yearMatch;
  };

  const upcomingEvents = allEvents.filter((e) => e.parsedDate >= today && matchesFilters(e)).sort((a, b) => a.parsedDate - b.parsedDate);
  const pastEvents = allEvents.filter((e) => e.parsedDate < today && matchesFilters(e)).sort((a, b) => b.parsedDate - a.parsedDate);
  const flagshipEvents = allEvents.filter((e) => e.isFlagship && matchesFilters(e));


  return (
    <div className="relative min-h-screen overflow-hidden transition-colors duration-500 selection:bg-ieee-blue/20">
      
      <div className="relative z-10 pt-[72px]">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 mb-16 sm:mb-24 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-ieee-blue/10 via-transparent to-ieee-teal/10 blur-[100px] pointer-events-none -z-10 rounded-full" />
          
          <div className="flex-1 w-full text-center lg:text-left flex flex-col items-center lg:items-start">
            
            <h1 className="font-heading font-black text-6xl sm:text-7xl lg:text-8xl text-slate-900 dark:text-slate-100 leading-[0.95] mb-6 uppercase tracking-tighter">
              WHERE<br/>STUDENTS<br/>
              <span className="text-ieee-blue dark:text-[#0096D6]">BUILD</span><br/>
              THE<br/>FUTURE.
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 font-medium leading-relaxed max-w-md">
              From global 36-hour hackathons to deep-dive micro-workshops in embedded AI. Track, register, and archive the engineering journey.
            </p>
          </div>

          {/* Live Countdown */}
          {upcomingEvents.length > 0 && (
            <div className="w-full lg:w-auto shrink-0 mt-8 lg:mt-0 relative z-10">
              <CountdownCard event={upcomingEvents[0]} />
            </div>
          )}
        </section>

        {/* FLOATING COMMAND CENTER (Always Visible Filter via Portal to escape animation context) */}
        {typeof document !== 'undefined' && createPortal(
          <div className={`fixed transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-[60] pointer-events-none ${showCollapsed ? 'bottom-6 right-6 sm:bottom-auto sm:top-[24px] sm:right-[40px] translate-x-0' : 'bottom-6 lg:bottom-10 left-1/2 -translate-x-1/2 w-[95%] sm:w-auto max-w-max'}`}>
            <div className="relative group pointer-events-auto">
              
              {/* Island Body */}
              <div 
                onClick={() => { if(showCollapsed) { setIsManuallyExpanded(true); expandedScrollYRef.current = window.scrollY; } }}
                className={`relative flex flex-row items-center justify-center bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-3xl border border-slate-200/50 dark:border-white/10 rounded-full shadow-[0_16px_40px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${showCollapsed ? 'cursor-pointer px-4 py-2 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:scale-105' : 'px-5 sm:px-8 py-3 sm:py-4 gap-3 sm:gap-6 cursor-default'}`}
              >
                
                <div className={`flex items-center gap-3 transition-all duration-500 ${showCollapsed ? '' : 'pr-5 border-r border-slate-200 dark:border-white/10'}`}>
                  <div className={`rounded-full bg-ieee-blue/10 flex items-center justify-center text-ieee-blue transition-all duration-500 ${showCollapsed ? 'w-8 h-8' : 'w-8 h-8'}`}>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 4H3"></path><path d="M21 12H3"></path><path d="M21 20H3"></path><path d="M14 2v4"></path><path d="M10 10v4"></path><path d="M18 18v4"></path></svg>
                  </div>
                  <span className={`font-mono uppercase tracking-[0.25em] font-bold shrink-0 transition-all duration-500 ${showCollapsed ? 'text-[10px] text-ieee-blue dark:text-ieee-teal pr-2' : 'hidden sm:block text-[10px] text-slate-500 dark:text-zinc-400'}`}>
                    {showCollapsed ? 'Filters' : 'Filter'}
                  </span>
                </div>

                <div className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-6 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${showCollapsed ? 'max-w-0 opacity-0' : 'max-w-[800px] opacity-100'}`}>
                  <div className="w-full sm:w-auto overflow-x-auto no-scrollbar">
                    <FilterTabs options={categories} selected={selectedCategory} onChange={setSelectedCategory} />
                  </div>
                  
                  <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 shrink-0"></div>
                  
                  <div className="w-full sm:w-auto overflow-x-auto no-scrollbar">
                    <FilterTabs options={availableYears} selected={selectedYear} onChange={setSelectedYear} />
                  </div>
                </div>

              </div>
            </div>
          </div>,
          document.body
        )}

        {/* LISTINGS WRAPPER */}
        <div ref={listWrapperRef} className="pb-32">
          
          {/* UPCOMING EVENTS */}
          {upcomingEvents.length > 0 && (
            <section className="upcoming-section max-w-7xl mx-auto px-6 sm:px-12 py-24 sm:py-32 border-b border-slate-200 dark:border-white/5">
              <Reveal>
                <div className="mb-12">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-ieee-blue dark:text-ieee-teal font-bold mb-3 block">
                    Happening Soon
                  </span>
                  <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    Upcoming
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
            <section className="flagship-section max-w-7xl mx-auto px-6 sm:px-12 py-24 sm:py-32 border-b border-slate-200 dark:border-white/5">
              <Reveal>
                <div className="mb-16 md:flex justify-between items-end">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-500 font-bold mb-3 block flex items-center gap-2">
                      <Trophy size={14} /> Signature Experiences
                    </span>
                    <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                      Flagship
                    </h2>
                  </div>
                </div>
              </Reveal>
              <div className="flex flex-col gap-16">
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
            <section className="past-section max-w-7xl mx-auto px-6 sm:px-12 py-24 sm:py-32">
              <Reveal>
                <div className="mb-16 flex items-center gap-4">
                  <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    Archive
                  </h2>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                </div>
              </Reveal>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
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
              <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-zinc-900 flex items-center justify-center text-slate-400 dark:text-zinc-600 mb-6">
                <Calendar size={40} strokeWidth={1} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">No events found</h3>
              <p className="text-slate-500 dark:text-zinc-400 mb-6">Adjust your category or timeline filters to see more results.</p>
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

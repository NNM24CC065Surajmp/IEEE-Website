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
  Terminal,
  ArrowUpRight
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
  if (cat.includes('workshop')) return { icon: Cpu, baseColor: 'text-[#0096D6]', bg: 'bg-[#0096D6]', gradient: 'from-[#00629B] to-[#0096D6]' };
  if (cat.includes('hackathon')) return { icon: Terminal, baseColor: 'text-emerald-500', bg: 'bg-emerald-600', gradient: 'from-emerald-800 to-emerald-500' };
  if (cat.includes('flagship')) return { icon: Trophy, baseColor: 'text-amber-500', bg: 'bg-amber-600', gradient: 'from-amber-700 to-amber-500' };
  return { icon: Activity, baseColor: 'text-purple-500', bg: 'bg-purple-600', gradient: 'from-purple-800 to-purple-500' };
};

// --------------------------------------------------------------------------
// Sub-Components
// --------------------------------------------------------------------------

// 1. Abstract Circuit Pattern Fallback Background (Rich Corner Pattern)
const AbstractFallback = ({ category, isFlagship = false }) => {
  const visuals = getCategoryVisuals(category);
  const Icon = visuals.icon;
  
  if (isFlagship) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-zinc-950 transition-transform duration-700 group-hover:scale-105">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/30 via-purple-900/40 to-black/90"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
        <div className="absolute top-6 left-6 w-12 h-12 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] z-10">
          <Icon className="w-6 h-6 text-amber-400" />
        </div>
        <Icon className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.07] text-amber-500 animate-[spin_60s_linear_infinite]" />
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative overflow-hidden ${visuals.bg} transition-transform duration-700 group-hover:scale-105`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${visuals.gradient} opacity-90`}></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)]"></div>
      <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center z-10 shadow-lg animate-[bounce_5s_ease-in-out_infinite]">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <Icon className="absolute -bottom-8 -right-8 w-48 h-48 opacity-[0.08] text-white animate-[spin_60s_linear_infinite]" />
    </div>
  );
};

// 2. Full-Bleed Flip Unit Countdown (Hero Moment)
const FlipUnit = ({ value, label }) => {
  const [prev, setPrev] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrev(value);
        setIsFlipping(false);
      }, 400); // match flip animation duration
      return () => clearTimeout(timer);
    }
  }, [value, prev]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-20 sm:w-24 sm:h-28 md:w-32 md:h-36 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg [perspective:1000px]">
        {/* Top Half (Static) */}
        <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-slate-50 dark:bg-zinc-800 rounded-t-xl sm:rounded-t-2xl flex items-end justify-center border-b border-black/10 dark:border-black/30">
          <span className="text-4xl sm:text-6xl md:text-7xl font-heading font-black text-slate-900 dark:text-white translate-y-[50%]">{value}</span>
        </div>
        {/* Bottom Half (Static) */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-white dark:bg-zinc-900 rounded-b-xl sm:rounded-b-2xl flex items-start justify-center">
          <span className="text-4xl sm:text-6xl md:text-7xl font-heading font-black text-slate-900 dark:text-white -translate-y-[50%]">{prev}</span>
        </div>
        {/* Flap (Animated) */}
        <div 
          className={`absolute inset-x-0 top-0 h-1/2 origin-bottom bg-slate-50 dark:bg-zinc-800 rounded-t-xl sm:rounded-t-2xl overflow-hidden flex items-end justify-center shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-in-out ${isFlipping ? '[transform:rotateX(-180deg)]' : '[transform:rotateX(0deg)]'}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-4xl sm:text-6xl md:text-7xl font-heading font-black text-slate-900 dark:text-white translate-y-[50%]">{prev}</span>
        </div>
        
        {/* Back of Flap */}
        <div 
          className={`absolute inset-x-0 top-0 h-1/2 origin-bottom bg-white dark:bg-zinc-900 rounded-t-xl sm:rounded-t-2xl overflow-hidden flex items-start justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-in-out ${isFlipping ? '[transform:rotateX(0deg)]' : '[transform:rotateX(180deg)]'}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-4xl sm:text-6xl md:text-7xl font-heading font-black text-slate-900 dark:text-white -translate-y-[50%] [transform:rotateZ(180deg)_rotateY(180deg)]">{value}</span>
        </div>
        
        {/* Center Divider Line */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/20 dark:bg-black/40 z-10 -translate-y-1/2"></div>
      </div>
      <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-500 font-bold">{label}</span>
    </div>
  );
};

const HeroCountdown = ({ event }) => {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    if (!event) return;
    const eventTime = event.parsedDate.getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = eventTime - now;

      if (distance < 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      setTimeLeft({
        days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hours: String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
        minutes: String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
        seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0')
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [event]);

  if (!event) return null;

  return (
    <div className="w-full bg-slate-100 dark:bg-zinc-950 border-y border-slate-200 dark:border-white/5 py-12 sm:py-16 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,150,214,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(0,150,214,0.1)_0%,transparent_70%)]"></div>
      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-ieee-blue dark:text-ieee-teal border border-ieee-blue/20 dark:border-ieee-teal/20 mb-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ieee-blue dark:bg-ieee-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ieee-blue dark:bg-ieee-teal"></span>
            </span>
            <span>Next Event Starts In</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white mb-2">{event.title}</h2>
          <p className="text-sm font-mono text-slate-500 flex items-center justify-center lg:justify-start gap-3">
            <span className="flex items-center gap-1"><Calendar size={14}/> {formatEventDate(event.date).displayDate}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
            <span className="flex items-center gap-1"><MapPin size={14}/> {event.venue.split(',')[0]}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <FlipUnit value={timeLeft.days} label="Days" />
          <div className="text-2xl sm:text-4xl font-black text-slate-300 dark:text-zinc-800 pb-6">:</div>
          <FlipUnit value={timeLeft.hours} label="Hrs" />
          <div className="text-2xl sm:text-4xl font-black text-slate-300 dark:text-zinc-800 pb-6">:</div>
          <FlipUnit value={timeLeft.minutes} label="Min" />
          <div className="text-2xl sm:text-4xl font-black text-slate-300 dark:text-zinc-800 pb-6">:</div>
          <FlipUnit value={timeLeft.seconds} label="Sec" />
        </div>
      </div>
    </div>
  );
};

// 3. Flagship Showcase Card (Visually Rich)
const FlagshipShowcaseCard = ({ event, index }) => {
  const dateInfo = formatEventDate(event.date);
  const imageUrl = event.image || event.poster || event.posterImage;
  const isReversed = index % 2 !== 0;
  
  const cardRef = useRef(null);
  const contentRef = useRef(null);

  // Magnetic hover effect (Subtle 3D tilt)
  useGSAP(() => {
    if (prefersReducedMotion() || !cardRef.current || !contentRef.current) return;
    
    const card = cardRef.current;
    const content = contentRef.current;
    
    const xTo = gsap.quickTo(content, "rotationY", { ease: "power3", duration: 0.5 });
    const yTo = gsap.quickTo(content, "rotationX", { ease: "power3", duration: 0.5 });

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const multiplier = 8;
      xTo((x - 0.5) * multiplier);
      yTo((y - 0.5) * -multiplier);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, { scope: cardRef });

  return (
    <div ref={cardRef} className="group [perspective:1200px] block w-full cursor-pointer">
      <div 
        ref={contentRef} 
        className="relative flex flex-col md:flex-row bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden shadow-xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:shadow-2xl dark:hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)] transition-shadow duration-500"
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* Image/Visual Side */}
        <div className={`w-full md:w-1/2 lg:w-[55%] h-72 md:h-auto min-h-[400px] relative overflow-hidden ${isReversed ? 'md:order-2' : ''}`}>
          {imageUrl ? (
            <img src={imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          ) : (
            <AbstractFallback category={event.category} isFlagship={true} />
          )}
          {/* Overlay gradient for dark mode */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:hidden"></div>
          {/* Tag */}
          <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10" style={{ transform: 'translateZ(20px)' }}>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-bold bg-amber-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)] backdrop-blur-md">
              <Sparkles size={14} /> Signature Experience
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className={`w-full md:w-1/2 lg:w-[45%] p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative ${isReversed ? 'md:order-1' : ''}`}>
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_80%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_80%)] pointer-events-none"></div>

          <div className="flex items-center gap-6 mb-8 text-sm font-mono text-slate-500" style={{ transform: 'translateZ(30px)' }}>
             <div className="flex flex-col gap-1"><span className="uppercase text-[10px] tracking-widest text-slate-400">Date</span><span className="font-bold text-slate-700 dark:text-zinc-300">{dateInfo.displayDate}</span></div>
             <div className="w-px h-8 bg-slate-200 dark:bg-zinc-800" />
             <div className="flex flex-col gap-1"><span className="uppercase text-[10px] tracking-widest text-slate-400">Venue</span><span className="font-bold text-slate-700 dark:text-zinc-300 truncate max-w-[150px]">{event.venue.split(',')[0]}</span></div>
          </div>
          
          <h3 className="font-heading text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors" style={{ transform: 'translateZ(40px)' }}>
            {event.title}
          </h3>
          
          <p className="text-slate-600 dark:text-zinc-400 text-lg leading-relaxed mb-12" style={{ transform: 'translateZ(20px)' }}>
            {event.description}
          </p>

          <div className="mt-auto" style={{ transform: 'translateZ(30px)' }}>
            <button className="group/btn inline-flex items-center gap-4 text-sm font-bold font-heading uppercase tracking-widest text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-500 transition-colors bg-transparent border-none p-0 cursor-pointer">
              Explore Event
              <span className="w-10 h-10 rounded-full border border-slate-300 dark:border-zinc-700 flex items-center justify-center group-hover/btn:bg-amber-500 group-hover/btn:border-amber-500 group-hover/btn:text-white transition-all duration-300 transform group-hover/btn:scale-110 group-hover/btn:shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <ArrowRight size={16} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// 4. Standard Upcoming Card (Clean, modern)
const EventCardVariant = ({ event }) => {
  const dateInfo = formatEventDate(event.date);
  const visuals = getCategoryVisuals(event.category);
  const imageUrl = event.image || event.poster || event.posterImage;
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group h-full flex flex-col bg-white dark:bg-[#0f111a] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-500 hover:-translate-y-1 relative"
    >
      {/* Spotlight Effect (Dark Mode Only) */}
      <div 
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden dark:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`
        }}
      />
      
      {/* Image Area */}
      <div className="relative h-56 shrink-0 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <AbstractFallback category={event.category} />
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-white/90 backdrop-blur-md text-slate-900 shadow-sm border border-white/20">
            {event.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest text-white shadow-sm border border-white/20 ${visuals.bg}`}>
            Upcoming
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 flex flex-col flex-1 relative z-10">
        <div className="flex items-center gap-3 mb-5">
          <span className={`text-2xl font-heading font-black ${visuals.baseColor}`}>{dateInfo.day} {dateInfo.month}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
          <span className="text-xs font-mono tracking-widest font-bold text-slate-500 dark:text-zinc-400">{event.time.split(' ')[0]} {event.time.split(' ')[1]}</span>
        </div>
        
        <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 dark:text-white leading-tight mb-3 group-hover:text-ieee-blue dark:group-hover:text-ieee-teal transition-colors line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-3 mb-8 leading-relaxed">
          {event.description}
        </p>

        <div className="mt-auto pt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between group-hover:border-slate-200 dark:group-hover:border-white/10 transition-colors">
          <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[180px] flex items-center gap-1.5">
            <MapPin size={12}/> {event.venue.split(',')[0]}
          </span>
          <span className="w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center text-slate-400 group-hover:bg-ieee-blue group-hover:text-white transition-all transform group-hover:translate-x-1">
             <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};
// 5. Past Event Row (Archival List View)
const PastEventRow = ({ event }) => {
  const dateInfo = formatEventDate(event.date);
  const imageUrl = event.image || event.poster || event.posterImage;
  
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 py-5 border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-xl cursor-pointer">
      <div className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 w-24 shrink-0 uppercase tracking-widest hidden sm:block">
        {dateInfo.year}<br/>{dateInfo.month} {dateInfo.day}
      </div>
      <div className="w-20 h-14 rounded-lg bg-slate-200 dark:bg-zinc-800 overflow-hidden shrink-0 relative grayscale group-hover:grayscale-0 transition-all duration-300">
        {imageUrl ? (
          <img src={imageUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <AbstractFallback category={event.category} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="sm:hidden text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
          {dateInfo.displayDate}
        </div>
        <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-300 group-hover:text-ieee-blue dark:group-hover:text-white transition-colors truncate">
          {event.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-zinc-500 truncate hidden md:block">
          {event.description}
        </p>
      </div>
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700 flex items-center justify-center bg-white dark:bg-zinc-800">
          <ArrowUpRight className="w-4 h-4 text-slate-600 dark:text-zinc-300" />
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
    const catMatch = selectedCategory === 'All' || event.category === selectedCategory || (selectedCategory === 'Flagship' && event.isFlagship);
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
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', overwrite: true }
    );
  }, { dependencies: [selectedCategory, selectedYear], scope: listWrapperRef });

  // Hero Reveal Animation
  const heroRef = useRef(null);
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const words = heroRef.current.querySelectorAll('.word-reveal');
    gsap.fromTo(words, 
      { y: 80, opacity: 0, rotateX: 30 },
      { y: 0, opacity: 1, rotateX: 0, stagger: 0.1, duration: 1.2, ease: "expo.out", delay: 0.2 }
    );
    gsap.fromTo('.hero-fade-up',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 1, ease: "power2.out", delay: 0.8 }
    );
  }, { scope: heroRef });

  return (
    <div className="relative pt-32 sm:pt-40 pb-32 selection:bg-ieee-blue selection:text-white">
      
      {/* Note: ShaderAurora is mounted globally in App.jsx */}

      <div className="relative z-10">
        
        {/* HERO SECTION */}
        <section ref={heroRef} className="max-w-7xl mx-auto px-6 sm:px-12 mb-16 sm:mb-24">
          <div className="max-w-4xl">
            <h1 className="font-heading text-6xl sm:text-7xl lg:text-[100px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[0.95] mb-8 uppercase [perspective:1000px]">
              <span className="inline-block overflow-hidden"><span className="word-reveal inline-block origin-bottom">Where</span></span>{' '}
              <span className="inline-block overflow-hidden"><span className="word-reveal inline-block origin-bottom">students</span></span>{' '}
              <br/>
              <span className="inline-block overflow-hidden"><span className="word-reveal inline-block origin-bottom text-transparent bg-clip-text bg-gradient-to-r from-ieee-blue to-[#0096D6]">build</span></span>{' '}
              <span className="inline-block overflow-hidden"><span className="word-reveal inline-block origin-bottom">the</span></span>{' '}
              <br className="hidden sm:block"/>
              <span className="inline-block overflow-hidden"><span className="word-reveal inline-block origin-bottom">future.</span></span>
            </h1>

            <p className="hero-fade-up text-lg sm:text-xl text-slate-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">
              From global 36-hour hackathons to deep-dive micro-workshops in embedded AI. Track, register, and archive the engineering journey.
            </p>
          </div>
        </section>

        {/* FULL-BLEED COUNTDOWN HERO MOMENT */}
        {upcomingEvents.length > 0 && (
          <HeroCountdown event={upcomingEvents[0]} />
        )}

        {/* STICKY FILTER BAR */}
        <div className={`sticky ${upcomingEvents.length > 0 ? 'top-[72px]' : 'top-[72px] mt-20'} z-40 bg-slate-50/90 dark:bg-zinc-950/90 backdrop-blur-xl border-y border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-300`}>
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4 overflow-hidden">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500 font-bold shrink-0">Category</span>
              <FilterTabs options={categories} selected={selectedCategory} onChange={setSelectedCategory} ariaLabel="Filter by category" />
            </div>

            <div className="flex items-center gap-4 md:border-l md:border-slate-300 md:dark:border-white/10 md:pl-6 overflow-hidden">
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="event-card-anim">
                    <EventCardVariant event={event} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FLAGSHIP EXPERIENCES */}
          {flagshipEvents.length > 0 && (
            <section className="max-w-7xl mx-auto px-6 sm:px-12 py-24 sm:py-32 border-b border-slate-200 dark:border-white/5">
              <Reveal>
                <div className="mb-16 md:text-center">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500 font-bold mb-3 block">
                    The Pinnacles
                  </span>
                  <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Signature Experiences
                  </h2>
                </div>
              </Reveal>

              <div className="flex flex-col gap-12 sm:gap-20">
                {flagshipEvents.map((flagship, idx) => (
                  <div key={flagship.id} className="event-card-anim">
                    <FlagshipShowcaseCard event={flagship} index={idx} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PAST EVENTS (ARCHIVAL) */}
          {pastEvents.length > 0 && (
            <section className="max-w-4xl mx-auto px-6 sm:px-12 py-24 sm:py-32">
              <Reveal>
                <div className="mb-12">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold mb-3 block">
                    The Archive
                  </span>
                  <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Past Events
                  </h2>
                </div>
              </Reveal>

              <div className="flex flex-col">
                {pastEvents.map((event) => (
                  <div key={event.id} className="event-card-anim">
                    <PastEventRow event={event} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* NO RESULTS FALLBACK */}
          {upcomingEvents.length === 0 && flagshipEvents.length === 0 && pastEvents.length === 0 && (
            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-32 text-center">
              <div className="inline-flex w-16 h-16 rounded-full bg-slate-100 dark:bg-zinc-900 items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-slate-400 dark:text-zinc-600" />
              </div>
              <h3 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-2">No events found</h3>
              <p className="text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
                There are no events matching your selected category and year filters. Try adjusting your filters to see more.
              </p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSelectedYear('All'); }}
                className="mt-8 px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-105 transition-transform"
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

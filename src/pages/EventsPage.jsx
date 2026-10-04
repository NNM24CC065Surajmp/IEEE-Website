import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';
import { EVENTS_DATA } from '../data/events.js';

const formatEventDate = (isoString) => {
  const d = new Date(isoString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    month: months[d.getMonth()],
    day: String(d.getDate()).padStart(2, '0'),
    year: d.getFullYear(),
  };
};

export default function EventsPage({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [hoveredEvent, setHoveredEvent] = useState(null);
  
  const categories = ['All', 'Workshops', 'Hackathons', 'Flagship', 'Competitions'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredEvents = EVENTS_DATA.filter((e) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Flagship') return e.isFlagship || e.category === 'Flagship';
    return e.category?.toLowerCase().includes(activeFilter.toLowerCase());
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort newest first

  const containerRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from('.reveal-row', {
      y: 30,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-zinc-300 pt-32 pb-24 font-sans selection:bg-ieee-blue selection:text-white">
      
      {/* Sleek Minimalist Hero */}
      <header className="max-w-7xl mx-auto px-6 md:px-12 mb-16 md:mb-24">
        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 uppercase">
          Events.
        </h1>
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl font-light tracking-wide">
          A chronological archive of our hackathons, workshops, and flagship engineering challenges.
        </p>
      </header>

      {/* Sticky Minimalist Filter */}
      <div className="sticky top-20 z-40 bg-[#050505]/80 backdrop-blur-xl border-y border-white/5 mb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex gap-6 md:gap-10 overflow-x-auto no-scrollbar py-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`text-sm md:text-base font-medium uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === cat 
                  ? 'text-white' 
                  : 'text-zinc-600 hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brutalist / Linear Style Event List */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        {filteredEvents.length === 0 ? (
          <div className="py-20 text-center text-zinc-600 font-mono text-sm uppercase tracking-widest">
            No events found.
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredEvents.map((event) => {
              const dateInfo = formatEventDate(event.date);
              const isPast = new Date(event.date) < today;
              
              return (
                <div 
                  key={event.id}
                  className="reveal-row group relative border-b border-white/5 py-8 md:py-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-12 transition-colors hover:bg-white/[0.02]"
                  onMouseEnter={() => setHoveredEvent(event.id)}
                  onMouseLeave={() => setHoveredEvent(null)}
                >
                  {/* Left: Date */}
                  <div className="md:w-32 shrink-0">
                    <span className="block text-2xl md:text-3xl font-light text-white tracking-tight">{dateInfo.day}</span>
                    <span className="block text-sm font-mono uppercase tracking-widest text-zinc-500 mt-1">{dateInfo.month} {dateInfo.year}</span>
                  </div>

                  {/* Middle: Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-ieee-blue border border-ieee-blue/30 px-2 py-0.5 rounded">
                        {event.category}
                      </span>
                      {isPast && (
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                          Archived
                        </span>
                      )}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 group-hover:text-ieee-blue transition-colors">
                      {event.title}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm font-mono text-zinc-500">
                      <span>{event.venue}</span>
                      <span className="hidden md:inline">&bull;</span>
                      <span>{event.time}</span>
                    </div>
                  </div>

                  {/* Right: Action or Poster Thumbnail */}
                  <div className="md:w-64 shrink-0 flex flex-col md:items-end justify-center">
                    {/* The image is hidden on mobile, but reveals smoothly on desktop hover */}
                    <div className="hidden md:block w-48 h-32 overflow-hidden rounded-lg border border-white/10 opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-105 group-hover:-rotate-2 group-hover:border-ieee-blue/50 bg-zinc-900">
                      <img 
                        src={event.posterImage || event.poster} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Mobile visible action button */}
                    <div className="md:hidden mt-6">
                      <a href={event.registrationLink || '#'} className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-white hover:text-ieee-blue">
                        {isPast ? 'View Details' : 'Register'}
                        <ArrowUpRight size={16} />
                      </a>
                    </div>
                  </div>
                  
                  {/* Absolute link wrapper for whole row */}
                  <a href={event.registrationLink || '#'} className="absolute inset-0 z-10">
                    <span className="sr-only">View {event.title}</span>
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </section>
      
    </div>
  );
}

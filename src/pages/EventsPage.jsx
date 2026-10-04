import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Trophy,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Tag
} from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';
import { EVENTS_DATA } from '../data/events.js';
import Reveal from '../components/Reveal';

// Format ISO date string into readable calendar parts
const formatEventDate = (isoString) => {
  const d = new Date(isoString);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const fullMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return {
    month: months[d.getMonth()],
    fullMonth: fullMonths[d.getMonth()],
    day: String(d.getDate()).padStart(2, '0'),
    year: d.getFullYear(),
    displayDate: `${fullMonths[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
  };
};

// Category filter matcher
const matchesCategory = (event, categoryFilter) => {
  if (categoryFilter === 'All') return true;
  if (categoryFilter === 'Flagship') {
    return event.isFlagship === true || event.category === 'Flagship';
  }
  if (categoryFilter === 'Workshops') {
    return event.category === 'Workshop' || event.category === 'Workshops';
  }
  if (categoryFilter === 'Hackathons') {
    return event.category === 'Hackathon' || event.category === 'Hackathons';
  }
  if (categoryFilter === 'Competitions') {
    return event.category === 'Competition' || event.category === 'Competitions';
  }
  return event.category?.toLowerCase() === categoryFilter.toLowerCase();
};

export default function EventsPage({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [galleryEvent, setGalleryEvent] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const categories = ['All', 'Workshops', 'Hackathons', 'Flagship', 'Competitions'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = EVENTS_DATA
    .filter((e) => new Date(e.date) >= today && matchesCategory(e, selectedCategory))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastEvents = EVENTS_DATA
    .filter((e) => new Date(e.date) < today && matchesCategory(e, selectedCategory))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const matchingFlagships = EVENTS_DATA.filter(
    (e) => e.isFlagship && matchesCategory(e, selectedCategory)
  );
  const flagshipEvents = matchingFlagships.length > 0
    ? matchingFlagships
    : EVENTS_DATA.filter((e) => e.isFlagship);

  useEffect(() => {
    if (!galleryEvent) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setGalleryEvent(null);
      else if (e.key === 'ArrowRight') setActivePhotoIdx((prev) => (prev + 1) % modalPhotos.length);
      else if (e.key === 'ArrowLeft') setActivePhotoIdx((prev) => (prev - 1 + modalPhotos.length) % modalPhotos.length);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [galleryEvent, activePhotoIdx]);

  const openGalleryModal = (eventObj) => {
    setGalleryEvent(eventObj);
    setActivePhotoIdx(0);
  };

  const closeGalleryModal = () => {
    setGalleryEvent(null);
  };

  const modalPhotos = galleryEvent
    ? galleryEvent.gallery && galleryEvent.gallery.length > 0
      ? galleryEvent.gallery
      : [galleryEvent.posterImage || galleryEvent.poster]
    : [];

  const containerRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from('.event-page-elem', {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="pt-28 sm:pt-36 pb-24 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ieee-blue/10 dark:bg-ieee-teal/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />

      {/* 1. HERO SECTION */}
      <section className="section-container relative z-10 pb-16 border-b border-slate-200 dark:border-white/5">
        <div className="max-w-4xl">
          <div className="event-page-elem inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-ieee-blue dark:text-ieee-teal border border-ieee-blue/30 dark:border-ieee-teal/30 mb-8 bg-ieee-blue/5 dark:bg-ieee-teal/5">
            <Sparkles size={12} />
            <span>Event Calendar</span>
          </div>

          <h1 className="event-page-elem font-heading text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-8">
            Where students build <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ieee-blue to-[#0096D6] dark:from-white dark:to-zinc-500">the future.</span>
          </h1>

          <p className="event-page-elem text-lg sm:text-xl text-slate-600 dark:text-zinc-300 font-medium leading-relaxed mb-12 max-w-2xl">
            From national 24-36h hackathons to deep-dive micro-workshops in embedded systems, AI, and geospatial intelligence.
          </p>

          {/* Filter Tabs */}
          <div className="event-page-elem">
            <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-slate-400 dark:text-zinc-500 mb-4 flex items-center gap-1.5 font-bold">
              <Tag size={12} />
              <span>Filter by Category</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-ieee-blue text-white shadow-lg shadow-ieee-blue/30 dark:bg-white dark:text-zinc-950 dark:shadow-white/20'
                        : 'bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. UPCOMING EVENTS SECTION */}
      <section className="section-container py-24 border-b border-slate-200 dark:border-white/5 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <Reveal>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-ieee-blue dark:text-ieee-teal font-semibold mb-3 block">
                Up Next
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Upcoming Events
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="text-sm font-mono text-slate-500 dark:text-zinc-400 font-medium">
              {upcomingEvents.length} {upcomingEvents.length === 1 ? 'event scheduled' : 'events scheduled'}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </div>
          </Reveal>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 dark:border-white/10 p-12 sm:p-20 text-center bg-slate-50/50 dark:bg-zinc-900/30 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-ieee-blue/10 dark:bg-ieee-teal/10 text-ieee-blue dark:text-ieee-teal flex items-center justify-center mb-6">
              <Calendar size={28} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 font-heading">
              No upcoming events in "{selectedCategory}"
            </h3>
            <p className="text-base text-slate-600 dark:text-zinc-400 max-w-md mx-auto mb-8 font-medium">
              We are finalizing dates and curriculum for new sessions. Check back soon or switch categories.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-sm transition-transform hover:scale-105"
            >
              <span>View All Events</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {upcomingEvents.map((event) => {
              const dateInfo = formatEventDate(event.date);
              const posterUrl = event.posterImage || event.poster;

              return (
                <article key={event.id} className="group relative flex flex-col h-full bg-slate-50 dark:bg-zinc-900/40 rounded-[2rem] border border-slate-200/60 dark:border-white/5 overflow-hidden transition-colors hover:bg-slate-100 dark:hover:bg-zinc-900/80">
                  {/* Top Image Section */}
                  <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden bg-slate-200 dark:bg-zinc-800">
                    {posterUrl ? (
                      <img src={posterUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                        <Calendar size={48} className="text-slate-400 dark:text-zinc-700" />
                      </div>
                    )}
                    
                    {/* Floating Date Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-xl p-2 text-center min-w-[3rem] shadow-sm border border-black/5 dark:border-white/10">
                      <span className="block text-lg font-bold text-slate-900 dark:text-white leading-none">{dateInfo.day}</span>
                      <span className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-zinc-400 mt-1">{dateInfo.month}</span>
                    </div>

                    {/* Left Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-ieee-blue text-white shadow-sm">
                        {event.category}
                      </span>
                      {event.isFlagship && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-amber-500 text-slate-950 shadow-sm">
                          <Sparkles size={11} /> FLAGSHIP
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Content Section */}
                  <div className="flex flex-col flex-1 p-6 sm:p-8">
                    <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-ieee-blue dark:group-hover:text-ieee-teal transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-6 font-medium">
                      {event.description}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto pt-6 border-t border-slate-200 dark:border-white/5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400 font-medium">
                          <MapPin size={13} className="shrink-0" />
                          <span className="truncate max-w-[200px]">{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400 font-medium">
                          <Clock size={13} className="shrink-0" />
                          <span>{event.time}</span>
                        </div>
                      </div>

                      {event.registrationLink ? (
                        <a
                          href={event.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 px-5 py-2.5 rounded-xl bg-ieee-blue hover:bg-[#0077be] text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
                        >
                          <span>Register</span>
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => alert('Registration opening soon!')}
                          className="shrink-0 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-transparent text-slate-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-2"
                        >
                          <span>Soon</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. FLAGSHIP EVENTS STRIP */}
      <section className="section-container py-24 border-b border-slate-200 dark:border-white/5 relative z-10">
        <div className="mb-16">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-500 font-semibold mb-3 block flex items-center gap-1.5">
            <Trophy size={13} /> Signature Experiences
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Flagship Events
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {flagshipEvents.map((flagship) => {
            const dateInfo = formatEventDate(flagship.date);
            const isFuture = new Date(flagship.date) >= today;
            const posterUrl = flagship.posterImage || flagship.poster;

            return (
              <div key={flagship.id} className="group relative overflow-hidden rounded-[2rem] border border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-zinc-900/40 p-2 sm:p-3 flex flex-col sm:flex-row gap-6 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-900/80">
                <div className="relative w-full sm:w-2/5 aspect-[4/3] sm:aspect-auto sm:h-full rounded-[1.5rem] overflow-hidden shrink-0">
                  <img src={posterUrl} alt={flagship.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {!isFuture && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-mono uppercase font-bold text-white">
                      Archived
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col flex-1 py-4 pr-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-ieee-blue/10 dark:bg-ieee-teal/10 text-ieee-blue dark:text-ieee-teal">
                      {flagship.category}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-500">
                      {dateInfo.month} {dateInfo.year}
                    </span>
                  </div>
                  
                  <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                    {flagship.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-2 mb-6 font-medium">
                    {flagship.description}
                  </p>
                  
                  <button
                    onClick={() => openGalleryModal(flagship)}
                    className="mt-auto self-start inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors"
                  >
                    <span>View Gallery</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PAST EVENTS ARCHIVE */}
      <section className="section-container py-24 relative z-10">
        <div className="mb-16">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500 font-semibold mb-3 block">
            Archive
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
            Past Events
          </h2>
        </div>

        {pastEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-medium">
            No past events found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastEvents.map((event) => {
              const posterUrl = event.posterImage || event.poster;
              return (
                <div key={event.id} className="group cursor-pointer rounded-2xl border border-slate-200/60 dark:border-white/5 bg-slate-50 dark:bg-zinc-900/40 overflow-hidden transition-colors hover:bg-slate-100 dark:hover:bg-zinc-900/80" onClick={() => openGalleryModal(event)}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img src={posterUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center shadow-xl">
                        <ImageIcon size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[10px] font-mono uppercase font-bold text-slate-500 mb-2">
                      <span>{event.category}</span>
                      <span>&bull;</span>
                      <span>{formatEventDate(event.date).year}</span>
                    </div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white truncate">
                      {event.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* GALLERY MODAL */}
      {galleryEvent && (
        <div data-lenis-prevent="true" className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/90 backdrop-blur-xl">
          <div className="relative w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-zinc-900/50">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1">
                  {formatEventDate(galleryEvent.date).displayDate}
                </div>
                <h3 className="text-lg font-bold text-white font-heading">
                  {galleryEvent.title}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-zinc-500 hidden sm:block">
                  {activePhotoIdx + 1} / {modalPhotos.length}
                </span>
                <button onClick={closeGalleryModal} className="w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 text-zinc-300 hover:text-red-500 transition-colors flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Stage */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[500px]">
              {modalPhotos.length > 0 ? (
                <img src={modalPhotos[activePhotoIdx]} alt="Gallery" className="max-h-full w-auto max-w-full object-contain mx-auto" />
              ) : (
                <div className="text-zinc-600 font-mono text-sm">No photos available</div>
              )}

              {modalPhotos.length > 1 && (
                <>
                  <button onClick={() => setActivePhotoIdx((prev) => (prev - 1 + modalPhotos.length) % modalPhotos.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-105">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={() => setActivePhotoIdx((prev) => (prev + 1) % modalPhotos.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center backdrop-blur-md transition-transform hover:scale-105">
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer / Thumbnails */}
            {modalPhotos.length > 1 && (
              <div className="p-4 bg-zinc-900/50 border-t border-white/10 overflow-x-auto no-scrollbar flex items-center gap-3">
                {modalPhotos.map((photo, idx) => (
                  <button key={idx} onClick={() => setActivePhotoIdx(idx)} className={`relative h-16 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activePhotoIdx === idx ? 'border-ieee-blue ring-2 ring-ieee-blue/40 scale-105' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

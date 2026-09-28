import React, { useState, useEffect } from 'react';
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
  Tag,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { EVENTS_DATA } from '../data/events.js';

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

// Category filter matcher supporting singular & plural conventions
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

  // Start of today (midnight) for automatic upcoming/past calculation
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Split events dynamically into Upcoming and Past by comparing dates to today
  const upcomingEvents = EVENTS_DATA
    .filter((e) => new Date(e.date) >= today && matchesCategory(e, selectedCategory))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastEvents = EVENTS_DATA
    .filter((e) => new Date(e.date) < today && matchesCategory(e, selectedCategory))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Flagship events strip: prioritize category match, or fallback to all flagship events
  const matchingFlagships = EVENTS_DATA.filter(
    (e) => e.isFlagship && matchesCategory(e, selectedCategory)
  );
  const flagshipEvents = matchingFlagships.length > 0
    ? matchingFlagships
    : EVENTS_DATA.filter((e) => e.isFlagship);

  // Modal keyboard listeners and body scroll lock
  useEffect(() => {
    if (!galleryEvent) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setGalleryEvent(null);
      } else if (e.key === 'ArrowRight') {
        const photos = galleryEvent.gallery && galleryEvent.gallery.length > 0
          ? galleryEvent.gallery
          : [galleryEvent.posterImage || galleryEvent.poster];
        setActivePhotoIdx((prev) => (prev + 1) % photos.length);
      } else if (e.key === 'ArrowLeft') {
        const photos = galleryEvent.gallery && galleryEvent.gallery.length > 0
          ? galleryEvent.gallery
          : [galleryEvent.posterImage || galleryEvent.poster];
        setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [galleryEvent]);

  const openGalleryModal = (event, initialIndex = 0) => {
    setGalleryEvent(event);
    setActivePhotoIdx(initialIndex);
  };

  const closeGalleryModal = () => {
    setGalleryEvent(null);
    setActivePhotoIdx(0);
  };

  // Safe gallery photos list for active event in modal
  const modalPhotos = galleryEvent
    ? galleryEvent.gallery && galleryEvent.gallery.length > 0
      ? galleryEvent.gallery
      : [galleryEvent.posterImage || galleryEvent.poster]
    : [];

  return (
    <div className="pt-28 sm:pt-36 pb-24">
      {/* 1. HERO SECTION & CATEGORY FILTER TABS */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-12 sm:pb-16 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0096D6]" />
            EVENTS & WORKSHOPS · IEEE NMAMIT
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
            Where student engineers build, sprint, and demo.
          </h1>

          <p className="text-base sm:text-lg text-slate-700 dark:text-zinc-300 font-normal leading-relaxed mb-8 max-w-2xl">
            From national 24-36h hackathons in our high-performance labs to deep-dive micro-workshops in embedded systems, AI, and geospatial intelligence, explore our active event calendar.
          </p>

          {/* Filter Tabs */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
              <Tag size={13} className="text-[#0096D6]" />
              <span>Filter by Category:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#00629B] text-white font-bold shadow-md shadow-[#00629B]/30'
                        : 'bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-zinc-700'
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
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#0096D6] mb-1.5 font-bold flex items-center gap-1.5">
              <Calendar size={13} />
              <span>[ UPCOMING CALENDAR ]</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Upcoming Events
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-zinc-400">
            {upcomingEvents.length} {upcomingEvents.length === 1 ? 'event scheduled' : 'events scheduled'}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </div>
        </div>

        {/* Empty State or Event Cards */}
        {upcomingEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-zinc-800 p-10 sm:p-14 text-center bg-white/50 dark:bg-zinc-900/20 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-[#00629B]/10 dark:bg-[#0096D6]/10 text-[#00629B] dark:text-[#0096D6] mx-auto flex items-center justify-center mb-4">
              <Calendar size={22} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              No upcoming events found in "{selectedCategory}"
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
              We are finalizing dates and curriculum for new sessions. Check back soon or switch categories to explore other initiatives.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="px-4 py-2 rounded-lg bg-[#00629B] hover:bg-[#0077be] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-200 inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>View All Categories</span>
              <ArrowRight size={13} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
            {upcomingEvents.map((event) => {
              const dateInfo = formatEventDate(event.date);
              const posterUrl = event.posterImage || event.poster;

              return (
                <div
                  key={event.id}
                  className="rounded-xl border border-slate-200 dark:border-zinc-800/90 hover:border-[#00629B] dark:hover:border-[#00629B] bg-white dark:bg-zinc-900/30 overflow-hidden flex flex-col justify-between transition-all duration-200 group shadow-sm hover:shadow-lg dark:hover:shadow-black/50"
                >
                  <div>
                    {/* Poster Thumbnail Header */}
                    {posterUrl && (
                      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800/80">
                        <img
                          src={posterUrl}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded uppercase tracking-wider font-bold bg-[#00629B] text-white shadow-sm">
                            {event.category}
                          </span>
                          {event.isFlagship && (
                            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded uppercase tracking-wider font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
                              <Sparkles size={11} />
                              FLAGSHIP
                            </span>
                          )}
                        </div>

                        {/* Date overlay in image header */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-2.5 text-white">
                          <div className="w-10 h-10 rounded bg-black/60 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center font-mono leading-none">
                            <span className="text-[9px] text-[#5db4e8] uppercase font-bold tracking-wider">
                              {dateInfo.month}
                            </span>
                            <span className="text-sm font-bold mt-0.5">
                              {dateInfo.day}
                            </span>
                          </div>
                          <div className="text-xs font-mono drop-shadow">
                            <span className="block font-medium">{dateInfo.displayDate}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-6 sm:p-7">
                      {!posterUrl && (
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-950 flex flex-col items-center justify-center font-mono leading-none">
                              <span className="text-[10px] text-[#00629B] dark:text-[#0096D6] uppercase font-bold tracking-wider">
                                {dateInfo.month}
                              </span>
                              <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                                {dateInfo.day}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs font-mono text-slate-700 dark:text-zinc-300 block">
                                {dateInfo.displayDate}
                              </span>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                                {event.category}
                              </span>
                            </div>
                          </div>
                          {event.isFlagship && (
                            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded uppercase tracking-wider font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-sm">
                              <Sparkles size={11} />
                              FLAGSHIP
                            </span>
                          )}
                        </div>
                      )}

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#00629B] dark:group-hover:text-[#0096D6] transition-colors leading-snug mb-3">
                        {event.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-6 font-normal">
                        {event.description}
                      </p>

                      <div className="space-y-2 border-t border-slate-100 dark:border-zinc-800/80 pt-4">
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-zinc-400">
                          <MapPin size={13} className="text-slate-400 dark:text-zinc-500 shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-zinc-400">
                          <Clock size={13} className="text-slate-400 dark:text-zinc-500 shrink-0" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Register Button Action */}
                  <div className="px-6 pb-6 pt-2">
                    {event.registrationLink ? (
                      <a
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-lg bg-[#00629B] hover:bg-[#0077be] text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Register Now</span>
                        <ExternalLink size={13} />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => alert(`Registration for "${event.title}" will open soon! Check our socials for announcements.`)}
                        className="w-full py-2.5 px-4 rounded-lg border border-slate-300 dark:border-zinc-700 hover:border-[#00629B] dark:hover:border-[#00629B] bg-slate-100 hover:bg-[#00629B] dark:bg-zinc-800/80 dark:hover:bg-[#00629B] text-slate-700 hover:text-white dark:text-zinc-200 dark:hover:text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Register · Opening Soon</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. FLAGSHIP EVENTS HIGHLIGHT STRIP */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 border-b border-slate-200 dark:border-zinc-800/80">
        <div className="mb-10">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-1.5 font-bold flex items-center gap-1.5">
            <Trophy size={13} />
            <span>[ SIGNATURE EXPERIENCES ]</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Flagship Events
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 max-w-xl">
                Our pinnacle annual hackathons and hardware challenges designed to elevate collegiate innovation.
              </p>
            </div>
            {selectedCategory !== 'All' && selectedCategory !== 'Flagship' && (
              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">
                Displaying IEEE Flagship Series
              </span>
            )}
          </div>
        </div>

        {/* Flagship Cards Showcase Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {flagshipEvents.map((flagship) => {
            const dateInfo = formatEventDate(flagship.date);
            const isFuture = new Date(flagship.date) >= today;
            const posterUrl = flagship.posterImage || flagship.poster;

            return (
              <div
                key={flagship.id}
                className="relative rounded-2xl border border-amber-500/30 dark:border-amber-500/20 hover:border-amber-500/60 dark:hover:border-amber-500/40 bg-gradient-to-br from-amber-500/[0.03] via-white to-[#00629B]/[0.04] dark:from-amber-500/[0.05] dark:via-zinc-900/60 dark:to-[#00629B]/[0.08] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 group shadow-md hover:shadow-xl dark:hover:shadow-black/60"
              >
                <div>
                  {/* Top Badge & Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      <Sparkles size={11} />
                      FLAGSHIP SHOWCASE
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        isFuture
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      {isFuture ? 'Upcoming Edition' : 'Past Edition'}
                    </span>
                  </div>

                  {/* Poster Banner */}
                  {posterUrl && (
                    <div className="relative h-44 sm:h-52 w-full rounded-lg overflow-hidden mb-5 border border-slate-200 dark:border-zinc-800">
                      <img
                        src={posterUrl}
                        alt={flagship.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white font-mono text-xs drop-shadow">
                        <span className="font-bold text-amber-400">{dateInfo.displayDate}</span>
                      </div>
                    </div>
                  )}

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#00629B] dark:group-hover:text-[#0096D6] transition-colors leading-snug mb-3">
                    {flagship.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mb-6 font-normal">
                    {flagship.description}
                  </p>

                  {/* Metadata */}
                  <div className="space-y-2 pb-5 border-b border-slate-200/80 dark:border-zinc-800/80 text-xs font-mono text-slate-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-amber-500 shrink-0" />
                      <span className="truncate">{flagship.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} className="text-amber-500 shrink-0" />
                      <span>{flagship.time}</span>
                    </div>
                  </div>
                </div>

                {/* Action button based on upcoming vs past */}
                <div className="pt-5">
                  {isFuture ? (
                    flagship.registrationLink ? (
                      <a
                        href={flagship.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#00629B] to-[#0096D6] hover:opacity-95 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <span>Register for Flagship</span>
                        <ExternalLink size={13} />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => alert(`Flagship registration for "${flagship.title}" will open soon!`)}
                        className="w-full py-2.5 px-4 rounded-lg bg-[#00629B] hover:bg-[#0077be] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span>Register · Opening Soon</span>
                        <ArrowRight size={13} />
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => openGalleryModal(flagship)}
                      className="w-full py-2.5 px-4 rounded-lg border border-amber-500/40 hover:border-amber-500 bg-amber-500/10 hover:bg-amber-500/20 text-slate-800 dark:text-amber-300 font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ImageIcon size={13} />
                      <span>View Flagship Gallery ({flagship.gallery ? flagship.gallery.length : 1} Photos)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PAST EVENTS GRID SECTION */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#0096D6] mb-1.5 font-bold flex items-center gap-1.5">
              <ImageIcon size={13} />
              <span>[ ARCHIVES & GALLERY ]</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Past Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Click any event card to browse photos and highlights from previous editions.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 dark:text-zinc-400">
            {pastEvents.length} {pastEvents.length === 1 ? 'archived event' : 'archived events'}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </div>
        </div>

        {/* Empty State or Past Event Cards Grid */}
        {pastEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 dark:border-zinc-800 p-10 sm:p-14 text-center bg-white/50 dark:bg-zinc-900/20 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 mx-auto flex items-center justify-center mb-4">
              <ImageIcon size={22} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
              No past events recorded in "{selectedCategory}"
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-md mx-auto mb-6 leading-relaxed">
              Try switching back to All categories to view our full history of workshops, hackathons, and competitions.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="px-4 py-2 rounded-lg bg-[#00629B] hover:bg-[#0077be] text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>View All Past Events</span>
              <ArrowRight size={13} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event) => {
              const dateInfo = formatEventDate(event.date);
              const posterUrl = event.posterImage || event.poster;
              const photoCount = event.gallery ? event.gallery.length : 1;

              return (
                <div
                  key={event.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openGalleryModal(event)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openGalleryModal(event);
                    }
                  }}
                  className="rounded-xl border border-slate-200 dark:border-zinc-800/90 hover:border-[#00629B] dark:hover:border-[#0096D6] bg-white dark:bg-[#07090e] overflow-hidden flex flex-col justify-between transition-all duration-200 group cursor-pointer shadow-sm hover:shadow-lg dark:hover:shadow-black/60 focus:outline-none focus:ring-2 focus:ring-[#0096D6]"
                >
                  <div>
                    {/* Poster Thumbnail */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800/80">
                      <img
                        src={posterUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Photo count pill */}
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-white flex items-center gap-1.5 shadow-sm">
                        <ImageIcon size={11} className="text-[#5db4e8]" />
                        <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                      </div>

                      {/* Category tag */}
                      <div className="absolute top-3 left-3 bg-[#00629B] text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm">
                        {event.category}
                      </div>

                      {/* Date indicator */}
                      <div className="absolute bottom-3 left-3 font-mono text-xs text-white drop-shadow">
                        <span className="font-semibold">{dateInfo.displayDate}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono text-[#00629B] dark:text-[#5db4e8] uppercase tracking-wider font-semibold">
                          COMPLETED
                        </span>
                        {event.isFlagship && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
                            FLAGSHIP
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#00629B] dark:group-hover:text-[#0096D6] transition-colors leading-snug mb-2.5">
                        {event.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-4 font-normal">
                        {event.description}
                      </p>

                      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 space-y-1.5 text-xs font-mono text-slate-500 dark:text-zinc-400">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-slate-400 shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gallery CTA button */}
                  <div className="p-5 sm:p-6 pt-0">
                    <div className="w-full py-2.5 rounded-lg border border-slate-300 dark:border-zinc-800 bg-slate-50 group-hover:bg-[#00629B] dark:bg-zinc-900 dark:group-hover:bg-[#00629B] text-slate-700 dark:text-zinc-300 group-hover:text-white dark:group-hover:text-white text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-2 shadow-sm">
                      <ImageIcon size={13} />
                      <span>View Photo Gallery</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. PHOTO GALLERY MODAL */}
      {galleryEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={closeGalleryModal}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo Gallery for ${galleryEvent.title}`}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-[#0a0d14] rounded-2xl border border-slate-300 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-4 bg-slate-50/80 dark:bg-zinc-900/60">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00629B] dark:text-[#0096D6] uppercase tracking-wider font-bold mb-0.5">
                  <span>PHOTO GALLERY</span>
                  <span>·</span>
                  <span>{formatEventDate(galleryEvent.date).displayDate}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  {galleryEvent.title}
                </h3>
              </div>

              {/* Counter & Close Button */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono text-slate-500 dark:text-zinc-400 hidden sm:inline-block">
                  {activePhotoIdx + 1} / {modalPhotos.length}
                </span>
                <button
                  type="button"
                  onClick={closeGalleryModal}
                  className="w-9 h-9 rounded-lg border border-slate-300 dark:border-zinc-700 hover:border-red-500 bg-white dark:bg-zinc-800 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 text-slate-600 dark:text-zinc-300 transition-colors flex items-center justify-center cursor-pointer focus:outline-none"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Main Image Stage */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[420px] max-h-[58vh]">
              {modalPhotos.length > 0 ? (
                <img
                  src={modalPhotos[activePhotoIdx]}
                  alt={`${galleryEvent.title} photo ${activePhotoIdx + 1}`}
                  className="max-h-[58vh] w-auto max-w-full object-contain mx-auto transition-opacity duration-300 select-none"
                />
              ) : (
                <div className="text-slate-400 font-mono text-xs">No photos available</div>
              )}

              {/* Left / Right Arrow Navigation */}
              {modalPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActivePhotoIdx((prev) => (prev - 1 + modalPhotos.length) % modalPhotos.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 focus:outline-none"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePhotoIdx((prev) => (prev + 1) % modalPhotos.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 focus:outline-none"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer: Caption & Thumbnail Strip */}
            <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#0096D6] shrink-0" />
                  <span className="truncate">{galleryEvent.venue}</span>
                </div>
                <div className="sm:hidden text-right text-[11px] text-slate-500">
                  {activePhotoIdx + 1} of {modalPhotos.length}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {modalPhotos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {modalPhotos.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative h-14 w-20 shrink-0 rounded-md overflow-hidden border-2 transition-all cursor-pointer focus:outline-none ${
                        activePhotoIdx === idx
                          ? 'border-[#0096D6] ring-2 ring-[#0096D6]/40 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

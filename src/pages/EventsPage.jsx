import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Share2,
  ChevronDown,
} from 'lucide-react';
import {
  events,
  getStatus,
  isRegistrationOpen,
  sortedEvents,
  getSpotlight,
  getDefaultPanelEvent,
  batches,
  categories,
} from '../data/events.js';

// Format batch label with en-dash with spaces: "2025-26" -> "2025 – 26"
export const formatBatch = (batchStr) => {
  if (!batchStr) return '';
  return String(batchStr).replace(/-/g, ' – ');
};

// Format ISO date string into "22 Mar 2025" in Asia/Kolkata (IST)
export const formatDateIST = (dateStr) => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    }).format(d);
  } catch (err) {
    return null;
  }
};

// Format time in IST like "09:00 AM"
export const formatTimeIST = (dateStr) => {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    }).format(d);
  } catch (err) {
    return null;
  }
};

// Format multi-day or single-day ranges in IST: "14 – 15 Nov 2026", "22 Mar 2025"
export const formatEventDateRangeIST = (startDate, endDate) => {
  if (!startDate && !endDate) return null;
  if (!startDate && endDate) {
    const end = formatDateIST(endDate);
    return end ? `Deadline: ${end}` : null;
  }
  if (startDate && !endDate) {
    return formatDateIST(startDate);
  }

  try {
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      return formatDateIST(startDate) || formatDateIST(endDate);
    }

    const sParts = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    }).formatToParts(s);

    const eParts = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    }).formatToParts(e);

    const sDay = sParts.find((p) => p.type === 'day')?.value;
    const sMonth = sParts.find((p) => p.type === 'month')?.value;
    const sYear = sParts.find((p) => p.type === 'year')?.value;

    const eDay = eParts.find((p) => p.type === 'day')?.value;
    const eMonth = eParts.find((p) => p.type === 'month')?.value;
    const eYear = eParts.find((p) => p.type === 'year')?.value;

    if (sDay === eDay && sMonth === eMonth && sYear === eYear) {
      return `${sDay} ${sMonth} ${sYear}`;
    }
    if (sMonth === eMonth && sYear === eYear) {
      return `${sDay} – ${eDay} ${sMonth} ${sYear}`;
    }
    if (sYear === eYear) {
      return `${sDay} ${sMonth} – ${eDay} ${eMonth} ${sYear}`;
    }
    return `${sDay} ${sMonth} ${sYear} – ${eDay} ${eMonth} ${eYear}`;
  } catch (err) {
    return formatDateIST(startDate);
  }
};

// Display date string for grid tiles
export const getTileDate = (event) => {
  if (!event) return 'Date TBA';
  if (!event.startDate && event.endDate) {
    const end = formatDateIST(event.endDate);
    return end ? `Deadline: ${end}` : 'Date TBA';
  }
  if (event.startDate && event.endDate) {
    return formatEventDateRangeIST(event.startDate, event.endDate) || 'Date TBA';
  }
  if (event.startDate) {
    return formatDateIST(event.startDate) || 'Date TBA';
  }
  return 'Date TBA';
};

// Detailed WHEN string for the Details Panel
export const getPanelWhen = (event) => {
  if (!event) return null;
  const { startDate, endDate } = event;
  const startD = formatDateIST(startDate);
  const endD = formatDateIST(endDate);
  const startT = formatTimeIST(startDate);
  const endT = formatTimeIST(endDate);

  if (!startD && endD) {
    return endT ? `Deadline: ${endD} at ${endT} IST` : `Deadline: ${endD}`;
  }
  if (startD && endD) {
    if (startD === endD) {
      if (startT && endT && startT !== endT) {
        return `${startD} (${startT} – ${endT} IST)`;
      }
      if (startT) {
        return `${startD} at ${startT} IST`;
      }
      return startD;
    }
    const range = formatEventDateRangeIST(startDate, endDate);
    if (startT && endT) {
      return `${range} (${startT} – ${endT} IST)`;
    }
    return range;
  }
  if (startD) {
    return startT ? `${startD} at ${startT} IST` : startD;
  }
  return null;
};

// Fallback poster if image is missing
function FallbackPoster({ title, category, className = '' }) {
  return (
    <div
      className={`relative w-full h-full bg-[#00629B] text-white flex flex-col justify-between p-4 sm:p-5 select-none overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-2">
        <span className="font-mono font-bold text-[10px] tracking-wider uppercase text-white/90">
          IEEE SB NMAMIT
        </span>
        {category && (
          <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/20 text-white font-semibold">
            {category}
          </span>
        )}
      </div>

      <div className="my-auto py-3">
        <h3 className="font-extrabold text-base sm:text-lg leading-tight uppercase tracking-tight text-white line-clamp-4 font-sans">
          {title}
        </h3>
      </div>

      <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[10px] font-mono text-white/70">
        <span>STB-94821</span>
        <span>NITTE</span>
      </div>
    </div>
  );
}

// Single Event Tile in Grid
function EventTile({ event, isSelected, onSelect }) {
  const status = getStatus(event);
  const dateDisplay = getTileDate(event);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(event)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(event);
        }
      }}
      className={`group cursor-pointer flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B] rounded-[14px] p-2 transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-[#00629B] bg-white dark:bg-white/5 shadow-md'
          : 'hover:bg-white/60 dark:hover:bg-white/5'
      }`}
      aria-label={`View details for ${event.title}`}
    >
      {/* 3:4 portrait poster with 12px radius, soft shadow, lazy loading */}
      <div className="relative w-full aspect-[3/4] rounded-[12px] overflow-hidden shadow-sm group-hover:shadow-md transition-shadow bg-slate-100 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
        {event.poster ? (
          <img
            src={event.poster}
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <FallbackPoster title={event.title} category={event.category} />
        )}

        {/* Navy overlay on hover with "View details" and arrow */}
        <div className="absolute inset-0 bg-[#0B1F3A]/85 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 text-white p-3 text-center">
          <span className="text-xs font-semibold tracking-wide">View details</span>
          <span className="text-base font-bold">→</span>
        </div>
      </div>

      {/* Category and Batch in clean sans */}
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-zinc-400 font-sans uppercase tracking-wider font-semibold mt-2.5 truncate">
        <span className="font-mono">{event.category || 'EVENT'}</span>
        {event.batch && (
          <>
            <span className="text-slate-300 dark:text-zinc-600">·</span>
            <span className="font-sans">{formatBatch(event.batch)}</span>
          </>
        )}
      </div>

      {/* Title wraps to two lines, no truncation unless longer than two lines */}
      <h4
        className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 mt-0.5 leading-snug group-hover:text-[#00629B] transition-colors"
        title={event.title}
      >
        {event.title}
      </h4>

      {/* Date on its own line: never truncated */}
      <div className="mt-1.5 text-[11px] font-sans text-slate-600 dark:text-zinc-400 font-medium">
        {dateDisplay}
      </div>

      {/* Status Pill below the date */}
      <div className="mt-1 flex items-center">
        <span
          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-semibold tracking-wider ${
            status === 'live'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
              : status === 'upcoming'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400'
              : status === 'open'
              ? 'bg-[#00629B]/15 text-[#00629B] dark:text-[#38BDF8] border border-[#00629B]/30'
              : 'bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
          }`}
        >
          {status === 'live'
            ? 'LIVE'
            : status === 'upcoming'
            ? 'UPCOMING'
            : status === 'open'
            ? 'OPEN'
            : 'ENDED'}
        </span>
      </div>
    </div>
  );
}

// Event Panel Content (Shared between desktop permanent right panel and mobile bottom sheet)
function EventPanelContent({ event, onShare, showCloseButton = false, onClose }) {
  if (!event) return null;

  const regOpen = isRegistrationOpen(event);
  const regLabel = event.registrationLabel || 'Register';

  const rows = [
    { label: 'WHEN', value: getPanelWhen(event) },
    { label: 'WHERE', value: event.venue },
    { label: 'FORMAT', value: event.format },
    { label: 'ORGANIZER', value: event.organizer },
  ].filter((r) => Boolean(r.value));

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="p-6">
        {/* Header with Close X on mobile only */}
        {showCloseButton && (
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              EVENT DETAILS
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close event details"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Full poster (object-fit contain) */}
        <div className="w-full bg-white dark:bg-[#071324] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden flex items-center justify-center p-2 mb-4 shadow-sm">
          {event.poster ? (
            <img
              src={event.poster}
              alt={event.title}
              className="w-full max-h-[320px] object-contain rounded-lg"
            />
          ) : (
            <div className="w-full aspect-[3/4] max-h-[280px] rounded-lg overflow-hidden">
              <FallbackPoster title={event.title} category={event.category} />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
          {event.title}
        </h2>

        {/* Category and batch labels in proportional sans */}
        <div className="text-xs font-sans uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-semibold mt-1">
          {event.category} · {formatBatch(event.batch)}
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed mt-3.5 font-normal">
          {event.description}
        </p>

        {/* Rows WHEN / WHERE / FORMAT / ORGANIZER with thin dividers (hide null rows) */}
        {rows.length > 0 && (
          <div className="mt-5 border-b border-slate-200 dark:border-white/10">
            {rows.map((row) => (
              <div
                key={row.label}
                className="border-t border-slate-200 dark:border-white/10 py-2.5"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-semibold">
                  {row.label}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white mt-0.5">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Share button */}
        <button
          type="button"
          onClick={(e) => onShare(e, event)}
          className="mt-5 w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-white/10 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Share2 size={14} />
          <span>Share Event</span>
        </button>
      </div>

      {/* Bottom Button */}
      <div className="p-6 pt-3 border-t border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#071324]/50">
        {regOpen ? (
          <a
            href={event.registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-[#00629B] hover:bg-[#0077BE] text-white font-semibold text-center block transition-colors shadow-md text-sm cursor-pointer"
          >
            {regLabel}
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="w-full py-3 px-4 rounded-xl bg-slate-300 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-semibold text-center cursor-not-allowed text-sm"
          >
            Registration closed
          </button>
        )}
      </div>
    </div>
  );
}

export default function EventsPage({ onNavigate }) {
  // Batches are sorted newest first; select the newest batch by default
  const [selectedBatch, setSelectedBatch] = useState(() => batches[0] || '2026-27');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Hero Spotlight computation from events.js helper
  const { event: spotlightEvent, mode: spotlightMode } = useMemo(() => {
    return getSpotlight();
  }, []);

  // Panel event state (default to getDefaultPanelEvent())
  const [panelEvent, setPanelEvent] = useState(() => getDefaultPanelEvent());
  // Mobile drawer open state (< 1280px)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Auto-clear toast feedback
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(''), 2800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Keyboard navigation & body scroll lock for mobile drawer (< 1280px)
  useEffect(() => {
    if (!isMobileDrawerOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const isMobileView = window.innerWidth < 1280;
    const originalOverflow = document.body.style.overflow;
    if (isMobileView) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileDrawerOpen]);

  // Live countdown state for Hero (ticks every second and stops at zero without errors)
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!spotlightEvent || (spotlightMode !== 'upcoming' && spotlightMode !== 'live')) {
      return;
    }
    const targetIso = spotlightEvent.startDate || spotlightEvent.endDate;
    if (!targetIso) return;
    const targetTimestamp = new Date(targetIso).getTime();

    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, targetTimestamp - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [spotlightEvent, spotlightMode]);

  // Select event handler (updates permanent panel, and opens bottom sheet on mobile)
  const handleSelectEvent = (event) => {
    setPanelEvent(event);
    if (window.innerWidth < 1280) {
      setIsMobileDrawerOpen(true);
    }
  };

  // Share action (Web Share API, fallback copy link)
  const handleShare = async (e, ev = null) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const target = ev || spotlightEvent;
    const title = target?.title ? `${target.title} | IEEE NMAMIT` : 'IEEE NMAMIT Events';
    const text = target?.description || 'Explore events from IEEE NMAMIT Student Branch!';
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        // Fallback to clipboard if dismissed or unpermitted
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setToastMessage('Link copied to clipboard!');
    } catch (err) {
      setToastMessage('Could not copy link');
    }
  };

  // Filter events inside the currently selected batch
  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return sortedEvents.filter((ev) => {
      // Must match selected batch
      if (ev.batch !== selectedBatch) {
        return false;
      }
      // Must match category if not 'All'
      if (selectedCategory !== 'All' && ev.category !== selectedCategory) {
        return false;
      }
      // Must match search query inside this batch
      if (q) {
        const title = (ev.title || '').toLowerCase();
        const cat = (ev.category || '').toLowerCase();
        const org = (ev.organizer || '').toLowerCase();
        const desc = (ev.description || '').toLowerCase();
        if (!title.includes(q) && !cat.includes(q) && !org.includes(q) && !desc.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [selectedBatch, selectedCategory, searchQuery]);

  // Resets category and search, keeps selected batch
  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const spotlightWhen = spotlightEvent
    ? spotlightEvent.startDate
      ? formatEventDateRangeIST(spotlightEvent.startDate, spotlightEvent.endDate)
      : spotlightEvent.endDate
      ? `Deadline: ${formatDateIST(spotlightEvent.endDate)}`
      : null
    : null;

  const spotlightRegOpen = spotlightEvent ? isRegistrationOpen(spotlightEvent) : false;
  const spotlightRegLabel = spotlightEvent?.registrationLabel || 'Register Now';

  return (
    <div className="relative min-h-screen bg-[#F7F8FA] dark:bg-[#05070a] text-slate-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1F3A] text-white text-xs font-mono px-4 py-2.5 rounded-lg shadow-xl border border-white/20 animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}

      {/* ========================================================
          Strip above the permanent right-side panel behind navbar
          Navy (#0B1F3A) in dark mode, off-white (#F7F8FA) in light mode
      ======================================================== */}
      <div
        className="hidden xl:block fixed top-0 right-0 w-[380px] h-[60px] sm:h-[68px] bg-[#F7F8FA] dark:bg-[#0B1F3A] border-l border-slate-200 dark:border-white/10 z-30 pointer-events-none transition-colors duration-200"
        aria-hidden="true"
      />

      {/* ========================================================
          PERMANENT RIGHT SIDE PANEL (Screens >= 1280px)
          Fixed on the right, about 380px wide, below navbar,
          its own scroll, no close button, never empty.
      ======================================================== */}
      <aside
        className="hidden xl:block fixed top-[60px] sm:top-[68px] bottom-0 right-0 w-[380px] bg-[#F7F8FA] dark:bg-[#0B1F3A] border-l border-slate-200 dark:border-white/10 z-30 overflow-y-auto shadow-sm transition-colors duration-200"
        aria-label="Event Details Panel"
      >
        <EventPanelContent
          event={panelEvent}
          onShare={handleShare}
          showCloseButton={false}
        />
      </aside>

      {/* ========================================================
          MOBILE BOTTOM SHEET / DRAWER (Screens < 1280px)
          Closed by default, slides in on tile or hero click.
      ======================================================== */}
      {isMobileDrawerOpen && (
        <div className="xl:hidden fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div
              role="dialog"
              aria-modal="true"
              aria-label={panelEvent?.title || 'Event Details'}
              className="w-screen max-w-full sm:max-w-md md:max-w-lg bg-[#F7F8FA] dark:bg-[#0B1F3A] shadow-2xl flex flex-col justify-between overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out"
            >
              <EventPanelContent
                event={panelEvent}
                onShare={handleShare}
                showCloseButton={true}
                onClose={() => setIsMobileDrawerOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN CONTENT WRAPPER
          Shifted left on xl: (xl:mr-[380px]) so nothing sits
          under the permanent right panel!
      ======================================================== */}
      <div className="xl:mr-[380px] transition-all duration-200">
        {/* ========================================================
            HERO SECTION
            Navy background #0B1F3A, NO pattern
            Uses getSpotlight()
        ======================================================== */}
        {spotlightEvent && (
          <section className="relative bg-[#0B1F3A] text-white pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Spotlight Info */}
                <div className="lg:col-span-8">
                  {/* Badge */}
                  {spotlightMode === 'upcoming' || spotlightMode === 'live' ? (
                    <span className="inline-block px-3 py-1 rounded bg-[#F5A524] text-slate-950 font-mono text-xs uppercase tracking-wider font-bold mb-4">
                      {spotlightMode === 'live' ? 'LIVE NOW' : 'UPCOMING EVENT'}
                    </span>
                  ) : spotlightMode === 'open' ? (
                    <span className="inline-block px-3 py-1 rounded bg-[#00629B] text-white font-mono text-xs uppercase tracking-wider font-bold mb-4">
                      OPEN
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded bg-slate-700 text-slate-200 font-mono text-xs uppercase tracking-wider font-bold mb-4">
                      LATEST EVENT
                    </span>
                  )}

                  {/* Large white title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
                    {spotlightEvent.title}
                  </h1>

                  {/* One-line subtitle */}
                  <p className="text-slate-300 text-sm sm:text-base font-normal max-w-2xl line-clamp-1 mb-6">
                    {spotlightEvent.description}
                  </p>

                  {/* WHEN / WHERE / FORMAT row separated by hairlines */}
                  <div className="flex flex-wrap items-center border-y border-white/15 py-3 mb-6 gap-y-3">
                    {spotlightWhen && (
                      <div className="pr-6 sm:pr-8 border-r border-white/20">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                          {spotlightMode === 'open' ? 'DEADLINE' : 'WHEN'}
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-white">
                          {spotlightWhen}
                        </div>
                      </div>
                    )}

                    {spotlightEvent.venue && (
                      <div className="px-6 sm:px-8 border-r border-white/20">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                          WHERE
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-white">
                          {spotlightEvent.venue}
                        </div>
                      </div>
                    )}

                    {spotlightEvent.format && (
                      <div className="pl-6 sm:pl-8">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
                          FORMAT
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-white">
                          {spotlightEvent.format}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Live Countdown (days, hours, minutes, seconds) in four boxes (if upcoming/live) */}
                  {(spotlightMode === 'upcoming' || spotlightMode === 'live') && (
                    <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-[280px] sm:max-w-xs mb-7">
                      {[
                        { label: 'DAYS', val: countdown.days },
                        { label: 'HRS', val: countdown.hours },
                        { label: 'MIN', val: countdown.minutes },
                        { label: 'SEC', val: countdown.seconds },
                      ].map((b) => (
                        <div
                          key={b.label}
                          className="border border-white/20 bg-white/5 rounded-lg py-2 px-1 text-center"
                        >
                          <div className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight leading-none">
                            {String(b.val).padStart(2, '0')}
                          </div>
                          <div className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-semibold mt-1">
                            {b.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    {spotlightMode === 'latest' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSelectEvent(spotlightEvent)}
                          className="px-6 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-[#0B1F3A] font-semibold text-sm transition-colors shadow-sm cursor-pointer"
                        >
                          View details
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleShare(e, spotlightEvent)}
                          className="px-5 py-2.5 rounded-lg border border-white/30 hover:border-white/60 text-white font-semibold text-sm transition-colors cursor-pointer"
                        >
                          Share
                        </button>
                      </>
                    ) : (
                      <>
                        {spotlightRegOpen ? (
                          <a
                            href={spotlightEvent.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-[#0B1F3A] font-semibold text-sm transition-colors shadow-sm cursor-pointer"
                          >
                            {spotlightRegLabel}
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="px-6 py-2.5 rounded-lg bg-white/20 text-white/60 font-semibold text-sm cursor-not-allowed"
                          >
                            Registration closed
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => handleShare(e, spotlightEvent)}
                          className="px-5 py-2.5 rounded-lg border border-white/30 hover:border-white/60 text-white font-semibold text-sm transition-colors cursor-pointer"
                        >
                          Share
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Column: Tilted portrait poster card */}
                <div className="lg:col-span-4 flex justify-center lg:justify-end">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectEvent(spotlightEvent)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectEvent(spotlightEvent);
                      }
                    }}
                    className="relative group cursor-pointer focus:outline-none"
                    aria-label={`View details for ${spotlightEvent.title}`}
                  >
                    <div
                      className="relative w-52 sm:w-60 aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-white transition-transform duration-300 group-hover:scale-[1.02]"
                      style={{ transform: 'rotate(2deg)' }}
                    >
                      {spotlightEvent.poster ? (
                        <img
                          src={spotlightEvent.poster}
                          alt={spotlightEvent.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FallbackPoster
                          title={spotlightEvent.title}
                          category={spotlightEvent.category}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            FILTER BAR (sticky)
            Tabs: batches only (newest first, selected by default)
            Count badge, Category dropdown, and Search box
        ======================================================== */}
        <section className="sticky top-[60px] sm:top-[68px] z-20 bg-white dark:bg-[#070a12] border-b border-slate-200 dark:border-white/10 shadow-sm transition-colors duration-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-3 sm:py-3.5">
              {/* Batch Tabs only: formatted with formatBatch(), newest first */}
              <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto no-scrollbar border-b border-transparent">
                {batches.map((batch) => (
                  <button
                    key={batch}
                    type="button"
                    onClick={() => setSelectedBatch(batch)}
                    className={`pb-2.5 text-xs sm:text-sm font-sans transition-colors relative cursor-pointer shrink-0 ${
                      selectedBatch === batch
                        ? 'text-slate-900 dark:text-white font-bold'
                        : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white font-medium'
                    }`}
                  >
                    <span>{formatBatch(batch)}</span>
                    {selectedBatch === batch && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00629B]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Right side controls: Count badge, Category dropdown & Search box */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                {/* Dynamic event count in current view */}
                <span className="text-xs font-mono text-slate-600 dark:text-zinc-400 font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shrink-0">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                </span>

                {/* Category dropdown */}
                <div className="relative shrink-0">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    aria-label="Filter by category"
                    className="appearance-none bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-lg pl-3 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm font-sans font-medium focus:outline-none focus:border-[#00629B] transition-colors cursor-pointer"
                  >
                    <option value="All">All categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>

                {/* Search box (matches title, category, organizer, description) */}
                <div className="relative w-full sm:w-48 lg:w-56">
                  <input
                    type="text"
                    placeholder="Search in batch..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search events in batch"
                    className="w-full pl-3 pr-8 py-1.5 sm:py-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 rounded-lg text-xs sm:text-sm font-sans focus:outline-none focus:border-[#00629B] transition-colors"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  ) : (
                    <Search
                      size={14}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            POSTER GRID
            Shows only selected batch's events (newest first).
            No group divider rows.
        ======================================================== */}
        <section className="py-8 sm:py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredEvents.length === 0 ? (
              /* Empty state: Clear filters resets category and search, keeps current batch */
              <div className="py-16 text-center border-2 border-dashed border-slate-300 dark:border-zinc-800 rounded-2xl bg-white/50 dark:bg-zinc-900/30 p-8 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 mx-auto flex items-center justify-center mb-3">
                  <Search size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 font-sans">
                  No events found in {formatBatch(selectedBatch)}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mb-5 leading-relaxed font-sans">
                  No events match your search or category filter in this batch.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg bg-[#00629B] hover:bg-[#0077BE] text-white text-xs font-semibold uppercase tracking-wider font-mono transition-colors shadow-sm cursor-pointer"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5 sm:gap-5">
                {filteredEvents.map((event) => (
                  <EventTile
                    key={event.id}
                    event={event}
                    isSelected={panelEvent?.id === event.id}
                    onSelect={handleSelectEvent}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

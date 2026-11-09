import React, { useEffect, useRef } from 'react';
import { X, MapPin, Clock, Calendar, ArrowRight } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getLenis } from '../lib/smoothScroll.js';

function formatEventDate(dateString) {
  if (!dateString) return { day: '00', month: 'MMM', year: '0000', full: '' };
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return { day: '00', month: 'MMM', year: '0000', full: dateString };
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear().toString();
  const full = d.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  return { day, month, year, full };
}

export default function EventModal({ event, onClose }) {
  if (!event) return null;

  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const dateInfo = formatEventDate(event.date);
  const imageUrl = event.image || event.poster || event.posterImage;
  const isUpcoming = (event.parsedDate ?? new Date(event.date || 0)) >= new Date();
  const hasLink = Boolean(event.registrationLink && event.registrationLink.trim() !== '');

  // 1. Lock standard body scroll and pause Lenis to prevent scroll hijacking
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const lenis = getLenis();
    lenis?.stop();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      lenis?.start();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 cursor-pointer backdrop-blur-md"
      style={{ 
        perspective: '1500px',
        animation: 'backdropFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' 
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
        className="cursor-default relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] overflow-hidden overscroll-contain"
        style={{ 
          animation: 'modalEntry3D 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-50 p-2 rounded-full border border-slate-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-600 transition-colors shadow-sm"
          style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.5s', opacity: 0 }}
          aria-label="Close modal"
        >
          <X size={20} className="pointer-events-none" />
        </button>

        {/* LEFT COLUMN: Photo (Full Bleed) */}
        <div className="w-full md:w-[45%] relative shrink-0 h-[220px] sm:h-[280px] md:h-auto overflow-hidden bg-slate-100 dark:bg-zinc-800">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-contain md:object-cover object-center bg-zinc-900"
              style={{ animation: 'imageReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.1s', opacity: 0 }}
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-ieee-blue/40 via-slate-900 to-[#0A1224] flex items-center justify-center">
               <Calendar size={44} className="text-ieee-teal/60" />
            </div>
          )}
          {/* Gradient Overlay for bottom depth */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" />
          
          <div className="absolute bottom-4 left-4 z-20">
             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md text-white border border-white/10" style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.2s', opacity: 0 }}>
                {event.category || 'Event'}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Content (Effortless internal scroll area with clean custom scrollbar) */}
        <div
          ref={scrollContainerRef}
          data-lenis-prevent="true"
          tabIndex={0}
          className="w-full md:w-[55%] p-5 sm:p-6 md:p-8 flex flex-col relative z-20 flex-1 overflow-y-auto overscroll-contain modal-custom-scroll focus:outline-none"
        >
          {/* Header section */}
          <div className="mb-5 sm:mb-6" style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.2s', opacity: 0 }}>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-2 font-heading pr-8">
              {event.title}
            </h2>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-zinc-300 mb-5 sm:mb-6 font-medium" style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.3s', opacity: 0 }}>
            {event.date && (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 shrink-0">
                  <Calendar size={14} className="text-ieee-blue dark:text-ieee-teal" />
                </div>
                <span>{dateInfo.full}</span>
              </div>
            )}
            
            {(event.time || event.date) && (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 shrink-0">
                  <Clock size={14} className="text-ieee-blue dark:text-ieee-teal" />
                </div>
                <span>{event.time || 'TBA'}</span>
              </div>
            )}

            {event.venue && (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 shrink-0">
                  <MapPin size={14} className="text-ieee-blue dark:text-ieee-teal" />
                </div>
                <span>{event.venue}</span>
              </div>
            )}
          </div>

          {/* Bio / Description section */}
          <div className="mb-6 max-w-prose flex-1" style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.4s', opacity: 0 }}>
            <h4 className="text-xs font-mono uppercase tracking-widest text-ieee-blue dark:text-ieee-teal font-bold mb-2 flex items-center gap-2">
              About the Event
            </h4>
            <p className="text-sm sm:text-[0.95rem] text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {event.description || event.shortDescription || 'More details coming soon.'}
            </p>
          </div>

          {/* Registration / Footer Action Pane */}
          <div className="mt-auto pt-5 border-t border-slate-100 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3" style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.5s', opacity: 0 }}>
            {isUpcoming || hasLink ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {isUpcoming ? 'Registrations Active' : 'Official Record'}
                  </span>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    onClose?.();
                    navigate(`/events/${event.id}/register`);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-ieee-blue dark:bg-ieee-teal text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:bg-[#005a8f] dark:hover:bg-teal-400 transition-colors group shadow-md cursor-pointer"
                >
                  <span>Register Now</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            ) : (
              <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400 dark:text-zinc-500">
                <span className="uppercase tracking-wider">Archived Event Record</span>
                <span>Concluded</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

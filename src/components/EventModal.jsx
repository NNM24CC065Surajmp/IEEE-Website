import React from 'react';
import { X, MapPin, Clock, Calendar, ArrowRight } from 'lucide-react';
import { createPortal } from 'react-dom';

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

  const dateInfo = formatEventDate(event.date);
  const imageUrl = event.image || event.poster || event.posterImage;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 cursor-pointer backdrop-blur-md"
      style={{ 
        perspective: '1500px',
        animation: 'backdropFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' 
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="cursor-default relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-2xl overflow-y-auto overflow-x-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
        style={{ 
          animation: 'modalEntry3D 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-50 p-2 rounded-full border border-slate-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-600 transition-colors shadow-sm"
          style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.5s', opacity: 0 }}
          aria-label="Close modal"
        >
          <X size={20} className="pointer-events-none" />
        </button>

        {/* LEFT COLUMN: Photo (Full Bleed) */}
        <div className="w-full md:w-[45%] relative shrink-0 h-[280px] sm:h-[350px] md:h-auto overflow-hidden bg-slate-100 dark:bg-zinc-800">
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

        {/* RIGHT COLUMN: Content */}
        <div className="w-full md:w-[55%] p-5 md:p-8 flex flex-col relative z-20">
          
          {/* Header section */}
          <div className="mb-6" style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.2s', opacity: 0 }}>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-2 font-heading">
              {event.title}
            </h2>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3 text-sm text-slate-600 dark:text-zinc-300 mb-6 font-medium" style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.3s', opacity: 0 }}>
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
            <h4 className="text-[0.65rem] uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-bold mb-2 flex items-center gap-2">
              About the Event
            </h4>
            <p className="text-sm sm:text-[0.95rem] text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {event.description || event.shortDescription || 'More details coming soon.'}
            </p>
          </div>

          {/* Registration / Link */}
          {event.registrationLink && (
            <div className="mt-auto pt-4 flex items-center" style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.5s', opacity: 0 }}>
              <a 
                href={event.registrationLink.startsWith('http') ? event.registrationLink : '#'} 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-ieee-blue dark:bg-ieee-teal text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:bg-[#005a8f] dark:hover:bg-teal-400 transition-colors group"
              >
                <span>{event.registrationLink.startsWith('http') ? 'Register Now' : event.registrationLink}</span>
                {event.registrationLink.startsWith('http') && (
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                )}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

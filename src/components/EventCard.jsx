import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Cpu, Users, MapPin, ArrowRight } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

function getTagIcon(tag) {
  switch (tag?.toLowerCase()) {
    case 'workshop': return Cpu;
    case 'competition': return Calendar;
    case 'talk': return Users;
    default: return Calendar;
  }
}

function formatDate(dateString) {
  if (!dateString) return { day: '', month: '' };
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return {
    day: new Intl.DateTimeFormat('en-GB', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date)
  };
}

export default function EventCard({ event, index = 0 }) {
  const cardRef = useRef(null);
  const imgWrapperRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion() || !imgWrapperRef.current) return;

    gsap.fromTo(imgWrapperRef.current,
      { clipPath: 'inset(0 0 100% 0)' },
      { 
        clipPath: 'inset(0 0 0% 0)', 
        duration: 1, 
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
        }
      }
    );
  }, { scope: cardRef });

  if (!event) return null;
  const TagIcon = getTagIcon(event.tag);
  const dateObj = formatDate(event.date);

  return (
    <article ref={cardRef} className="group relative flex flex-col h-full bg-slate-50 dark:bg-zinc-900/40 rounded-[2rem] border border-slate-200/60 dark:border-white/5 overflow-hidden transition-colors hover:bg-slate-100 dark:hover:bg-zinc-900/80">
      
      {/* Top Image Section */}
      <div ref={imgWrapperRef} className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden bg-slate-200 dark:bg-zinc-800">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
            <TagIcon size={48} className="text-slate-400 dark:text-zinc-700" />
          </div>
        )}
        
        {/* Floating Date Badge */}
        {event.date && (
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-xl p-2 text-center min-w-[3rem] shadow-sm border border-black/5 dark:border-white/10">
            <span className="block text-lg font-bold text-slate-900 dark:text-white leading-none">{dateObj.day}</span>
            <span className="block text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-zinc-400 mt-1">{dateObj.month}</span>
          </div>
        )}
      </div>

      {/* Bottom Content Section */}
      <div className="flex flex-col flex-1 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          {event.tag && (
            <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-ieee-blue/10 dark:bg-ieee-teal/10 text-ieee-blue dark:text-ieee-teal">
              {event.tag}
            </span>
          )}
          {event.venue && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-zinc-400">
              <MapPin size={12} />
              <span className="truncate max-w-[120px]">{event.venue}</span>
            </div>
          )}
        </div>

        <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-ieee-blue dark:group-hover:text-ieee-teal transition-colors">
          {event.title}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-6 font-medium">
          {event.description}
        </p>

        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-white/5">
          <Link
            to={event.link || '/events'}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue"
          >
            <span>Event Details</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

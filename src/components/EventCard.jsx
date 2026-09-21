import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Cpu, Users, MapPin, ArrowRight } from 'lucide-react';

function getTagIcon(tag) {
  switch (tag?.toLowerCase()) {
    case 'workshop':
      return Cpu;
    case 'competition':
      return Calendar;
    case 'talk':
      return Users;
    default:
      return Calendar;
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function EventCard({ event }) {
  if (!event) return null;

  const TagIcon = getTagIcon(event.tag);
  const formattedDate = formatDate(event.date);

  return (
    <article className="card h-full flex flex-col justify-between group transition-all duration-300 hover:border-[#00629B] dark:hover:border-[#22D3EE]/50 hover:shadow-xl hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">
      <div>
        {/* Top Image Container (Fixed 16:9 aspect ratio) */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-5 bg-slate-900">
          {event.image ? (
            // TODO: replace placeholder with actual event image
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
            />
          ) : (
            // TODO: replace null image with real event banner image
            <div className="w-full h-full bg-gradient-to-br from-[#00629B]/40 via-slate-900 to-[#0A1224] flex items-center justify-center">
              <TagIcon size={44} className="text-[#22D3EE]/60" />
            </div>
          )}

          {/* Event Tag Chip */}
          {event.tag && (
            <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-black/70 backdrop-blur-md text-[#22D3EE] border border-[#22D3EE]/30 shadow-sm">
              {event.tag}
            </span>
          )}
        </div>

        {/* Date & Venue Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400 mb-2.5">
          {formattedDate && (
            <time dateTime={event.date} className="font-semibold text-slate-700 dark:text-zinc-300">
              {formattedDate}
            </time>
          )}
          {event.venue && (
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-slate-400 dark:text-zinc-500 shrink-0" />
              <span className="truncate max-w-[140px]">{event.venue}</span>
            </div>
          )}
        </div>

        {/* Title (clamped to 2 lines) */}
        <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug line-clamp-2 group-hover:text-[#00629B] dark:group-hover:text-[#22D3EE] transition-colors">
          {event.title}
        </h3>

        {/* Description (clamped to 2 lines) */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-2 mb-4">
          {event.description}
        </p>
      </div>

      {/* Details Link */}
      <div className="pt-4 border-t border-slate-200 dark:border-zinc-800/80 mt-auto">
        <Link
          to={event.link || '/events'}
          className="inline-flex items-center justify-between w-full text-xs font-mono uppercase tracking-wider font-semibold text-[#00629B] dark:text-[#22D3EE] hover:text-[#0077b6] dark:hover:text-cyan-300 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B] dark:focus-visible:ring-[#22D3EE] rounded transition-colors"
        >
          <span>Details</span>
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
          />
        </Link>
      </div>
    </article>
  );
}

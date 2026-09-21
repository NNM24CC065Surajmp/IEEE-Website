import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import EventCard from './EventCard';
import { events } from '../data/events';

export default function FeaturedEvents() {
  const featuredEvents = events
    ? events.filter((event) => event.featured).slice(0, 3)
    : [];

  return (
    <section className="section-container section-padding">
      <Reveal>
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00629B] dark:text-[#22D3EE] font-bold mb-2">
            Flagship Initiatives
          </span>
          <h2 className="section-title mb-3">Featured Events</h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl">
            Explore our upcoming flagship hackathons, technical workshops, and expert speaker sessions.
          </p>
        </div>
      </Reveal>

      {featuredEvents.length === 0 ? (
        <Reveal>
          <div className="text-center py-12">
            <p className="text-slate-500 italic text-base">New events coming soon</p>
          </div>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {featuredEvents.map((event, index) => (
            <Reveal key={event.id} delay={index * 100} className="h-full">
              <EventCard event={event} />
            </Reveal>
          ))}
        </div>
      )}

      <Reveal delay={300}>
        <div className="flex justify-center mt-12">
          <Link
            to="/events"
            className="btn-outline group gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B]"
          >
            <span>View All Events</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
            />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

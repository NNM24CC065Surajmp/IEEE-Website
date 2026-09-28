import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import EventCard from './EventCard';
import { events } from '../data/events';

export default function FeaturedEvents() {
  const gridRef = useRef(null);
  
  useGSAP(() => {
    if (prefersReducedMotion() || !gridRef.current) return;
    
    gsap.fromTo('.event-card-item', 
      { opacity: 0, scale: 0.9, y: 30 },
      {
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'back.out(1.2)', 
        stagger: 0.15,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          once: true
        }
      }
    );

  }, { scope: gridRef });

  const featuredEvents = events
    ? events.filter((event) => event.featured).slice(0, 3)
    : [];

  return (
    <section className="section-container pt-16 md:pt-24 pb-8 md:pb-12">
      <Reveal>
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-ieee-blue dark:text-ieee-teal font-bold mb-2">
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
        <div ref={gridRef} className="events-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {featuredEvents.map((event, index) => (
            <div key={event.id} className="event-card-item h-full">
              <EventCard event={event} index={index} />
            </div>
          ))}
        </div>
      )}

      <Reveal delay={300}>
        <div className="flex justify-center mt-8">
          <Link
            to="/events"
            className="btn-outline group gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue"
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

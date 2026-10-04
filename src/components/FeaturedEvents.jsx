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
      { opacity: 0, y: 40 },
      {
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'power3.out', 
        stagger: 0.15,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          once: true
        }
      }
    );

  }, { scope: gridRef });

  const featuredEvents = events
    .filter(event => event.status === 'upcoming')
    .slice(0, 2); // Show only top 2 to keep layout asymmetrical or premium

  if (featuredEvents.length === 0) return null;

  return (
    <section className="section-container py-24 md:py-32 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent via-slate-200 dark:via-zinc-800 to-transparent" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 relative z-10">
        <Reveal>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400 font-semibold mb-3 block">
              What's Next
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Upcoming <span className="text-ieee-blue dark:text-ieee-teal font-serif italic font-medium">Events</span>
            </h2>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <Link
            to="/events"
            className="group inline-flex items-center gap-3 text-sm font-bold text-slate-900 dark:text-white transition-colors"
          >
            <span className="border-b-2 border-transparent group-hover:border-ieee-blue dark:group-hover:border-ieee-teal pb-0.5 transition-colors">
              View Complete Calendar
            </span>
            <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-zinc-700 flex items-center justify-center group-hover:bg-ieee-blue group-hover:text-white dark:group-hover:bg-ieee-teal dark:group-hover:text-zinc-900 transition-colors">
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none" />
            </div>
          </Link>
        </Reveal>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
        {featuredEvents.map((event, index) => (
          <div key={event.id} className="event-card-item h-full">
            <EventCard event={event} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

const societies = [
  { id: 'cs', name: 'Computer Society', logo: '/societies/cs.png', url: 'https://www.computer.org/' },
  { id: 'cis', name: 'Computational Intelligence Society', logo: '/societies/cis.png', url: 'https://cis.ieee.org/' },
  { id: 'ras', name: 'Robotics & Automation Society', logo: '/societies/ras.png', url: 'https://www.ieee-ras.org/' },
  { id: 'sps', name: 'Signal Processing Society', logo: '/societies/sps.png', url: 'https://signalprocessingsociety.org/' },
  { id: 'grss', name: 'Geoscience and Remote Sensing Society', logo: '/societies/grss.png', url: 'https://www.grss-ieee.org/' },
  { id: 'aess', name: 'Aerospace and Electronic Systems Society', logo: '/societies/aess.png', url: 'https://ieee-aess.org/' },
  { id: 'wie', name: 'Women in Engineering', logo: '/societies/wie.png', url: 'https://wie.ieee.org/' },
  { id: 'sight', name: 'SIGHT', logo: '/societies/sight.png', url: 'https://sight.ieee.org/' },
  { id: 'photonics', name: 'Photonics Society', logo: '/societies/photonics.png', url: 'https://www.photonicssociety.org/' },
  { id: 'cas', name: 'Circuits and Systems Society', logo: '/societies/cas.png', url: 'https://ieee-cas.org/' },
  { id: 'ias', name: 'Industry Applications Society', logo: '/societies/ias.png', url: 'https://ias.ieee.org/' }
];

export default function Societies() {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    
    gsap.from(containerRef.current, {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-16 md:py-24 border-t border-slate-200 dark:border-ieee-border overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
      
      <div className="section-container flex flex-col items-center text-center mb-12 md:mb-16">
        <span className="text-xs font-mono uppercase tracking-widest text-ieee-blue dark:text-ieee-teal font-bold mb-2">
          Our Chapters
        </span>
        <h2 className="section-title mb-3">Societies & Affinity Groups</h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl">
          Explore our specialized technical chapters and affinity groups dedicated to advancing specific fields of engineering and technology.
        </p>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden flex select-none">
        {/* Gradient Masks for smooth fading edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-slate-50 dark:from-[#05060A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-slate-50 dark:from-[#05060A] to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-marquee min-w-max gap-8 md:gap-12 px-4 md:px-6">
          {/* We duplicate the array to create a seamless infinite loop. 
              The CSS translates it by -50%, perfectly wrapping it. */}
          {[...societies, ...societies].map((soc, index) => (
            <a 
              key={`${soc.id}-${index}`} 
              href={soc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group flex-shrink-0 flex items-center justify-center p-6 w-40 h-40 md:w-48 md:h-48 bg-white dark:bg-[#0a0d14] rounded-2xl border border-slate-200 dark:border-ieee-border hover:border-ieee-blue dark:hover:border-ieee-teal transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue"
            >
              <img 
                src={soc.logo} 
                alt={soc.name} 
                title={soc.name}
                className="w-full h-full object-contain filter dark:brightness-110 transition-transform duration-300 group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

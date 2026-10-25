import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import HeroParticles from './HeroParticles';
import HeroVisual from './HeroVisual';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';

export default function Hero() {
  const containerRef = useRef(null);
  const btnIconRef = useRef(null);

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set('.hero-anim', { autoAlpha: 1, y: 0 });
      return;
    }

    const playAnim = () => {
      // Initial Stagger Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.fromTo('.hero-anim', 
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }
      );
    };

    // Coordinate with Preloader if it's active on this session
    if (window.ieeeIntroActive) {
      window.addEventListener('ieee-intro-complete', playAnim, { once: true });
    } else {
      playAnim();
    }

    // Parallax effect on scroll
    gsap.to('.hero-visual-container', {
      y: 40,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-[100svh] overflow-hidden flex items-center pt-24 pb-16 z-0">
      <div className="absolute inset-0 z-[-1] opacity-[0.03] dark:opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <HeroParticles />

      <div className="section-container w-full relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-10 gap-12 lg:gap-4 justify-between max-w-6xl mx-auto items-center">
          
          <div className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left w-full">
            
            
            <h1 className="hero-anim invisible font-heading font-bold flex flex-col mb-6 w-full">
              <span className="text-4xl sm:text-5xl lg:text-7xl text-slate-900 dark:text-slate-100 mb-2 leading-tight">
                IEEE <span className="bg-gradient-to-r from-ieee-blue to-ieee-teal bg-clip-text text-transparent pb-1">NMAMIT</span>
              </span>
              <span className="text-2xl sm:text-3xl lg:text-4xl text-slate-600 dark:text-slate-400 font-medium">
                Student Branch
              </span>
            </h1>

            <p className="hero-anim invisible text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-lg mb-6">
              Empowering student innovators to build, connect, and lead.
            </p>

            <p className="hero-anim invisible text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mb-6">
              Join our hands-on workshops, open-source sprints, and industry network designed for aspiring engineers.
            </p>

            <div className="hero-anim invisible flex flex-wrap justify-center lg:justify-start gap-4">
              <Link 
                to="/events" 
                className="btn-primary group !py-3 !px-8 text-[15px] shadow-lg shadow-ieee-blue/20"
              >
                <span>Explore Events</span>
                <svg 
                  className="w-[28px] ml-3 transition-transform duration-300 ease-in-out group-hover:translate-x-2"
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 74 74" 
                  height={28} 
                  width={28}
                >
                  <circle strokeWidth={3} stroke="currentColor" r="35.5" cy={37} cx={37} />
                  <path fill="currentColor" d="M25 35.5C24.1716 35.5 23.5 36.1716 23.5 37C23.5 37.8284 24.1716 38.5 25 38.5V35.5ZM49.0607 38.0607C49.6464 37.4749 49.6464 36.5251 49.0607 35.9393L39.5147 26.3934C38.9289 25.8076 37.9792 25.8076 37.3934 26.3934C36.8076 26.9792 36.8076 27.9289 37.3934 28.5147L45.8787 37L37.3934 45.4853C36.8076 46.0711 36.8076 47.0208 37.3934 47.6066C37.9792 48.1924 38.9289 48.1924 39.5147 47.6066L49.0607 38.0607ZM25 38.5L48 38.5V35.5L25 35.5V38.5Z" />
                </svg>
              </Link>
              <Link to="/join" className="btn-outline">Join IEEE</Link>
            </div>
          </div>

          <div className="hero-visual-container lg:col-span-5 w-full max-md:hidden">
            <HeroVisual />
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex text-slate-400 dark:text-slate-500 animate-bounce motion-reduce:animate-none" aria-hidden="true">
        <ChevronDown size={28} />
      </div>
    </section>
  );
}


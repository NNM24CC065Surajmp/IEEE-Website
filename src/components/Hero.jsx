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

    // Initial Stagger Timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.fromTo('.hero-anim', 
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }
    );

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

  const handleBtnHover = (isHover) => {
    if (prefersReducedMotion()) return;
    gsap.to(btnIconRef.current, {
      x: isHover ? 4 : 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <section ref={containerRef} className="relative min-h-[100svh] overflow-hidden flex items-center pt-24 pb-16 z-0">
      <div className="absolute inset-0 z-[-1] opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      <HeroParticles />
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-ieee-blue/20 rounded-full blur-[120px] z-[-1] pointer-events-none motion-reduce:hidden" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-ieee-teal/20 rounded-full blur-[120px] z-[-1] pointer-events-none motion-reduce:hidden" />

      <div className="section-container w-full relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left w-full">
            <div className="hero-anim invisible inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ieee-teal/30 bg-ieee-teal/10 text-ieee-teal text-xs font-semibold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 rounded-full bg-ieee-teal" />
              Student Branch
            </div>
            
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
                className="btn-primary"
                onMouseEnter={() => handleBtnHover(true)}
                onMouseLeave={() => handleBtnHover(false)}
              >
                Explore Events
                <div ref={btnIconRef}><ArrowRight size={18} className="ml-2" /></div>
              </Link>
              <Link to="/join" className="btn-outline">Join IEEE</Link>
            </div>
          </div>

          <div className="hero-visual-container lg:col-span-5 w-full">
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

import React, { useState, useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({ activePage, onNavigate, theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  
  const navRef = useRef(null);
  const indicatorRef = useRef(null);
  const linkRefs = useRef([]);
  const isFirstRender = useRef(true);

  const isLight = theme === 'light';

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from('.nav-anim-item', {
      y: -20, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out', delay: 0.1
    });
  }, { scope: navRef });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'events', label: 'Events' },
    { id: 'team', label: 'Team' },
  ];

  const handleLinkClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  // Sliding indicator effect
  useEffect(() => {
    const targetId = hoveredLink || activePage;
    const isHover = hoveredLink && hoveredLink !== activePage;
    const targetIndex = navItems.findIndex(item => item.id === targetId);
    const targetEl = linkRefs.current[targetIndex];

    if (targetEl && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = targetEl;
      if (isFirstRender.current || prefersReducedMotion()) {
        gsap.set(indicatorRef.current, { x: offsetLeft, width: offsetWidth, opacity: 1 });
        isFirstRender.current = false;
      } else {
        gsap.to(indicatorRef.current, {
          x: offsetLeft,
          width: offsetWidth,
          opacity: 1,
          duration: 0.35,
          ease: 'expo.out', // Ultra-premium snappy easing
          overwrite: 'auto'
        });
      }
    }
  }, [activePage, hoveredLink]);

  // Handle Resize for Indicator
  useEffect(() => {
    const handleResize = () => {
      const targetId = hoveredLink || activePage;
      const targetIndex = navItems.findIndex(item => item.id === targetId);
      const targetEl = linkRefs.current[targetIndex];
      if (targetEl && indicatorRef.current) {
         gsap.set(indicatorRef.current, { x: targetEl.offsetLeft, width: targetEl.offsetWidth });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hoveredLink, activePage]);

  return (
    <header ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-out motion-reduce:transition-none flex justify-center px-4 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      {/* 
        PREMIUM UNIFIED ISLAND LAYOUT
        Instead of 4 clunky separate pills, we fuse them into one breathtaking glassmorphic capsule.
        This completely eliminates vertical misalignment and creates a high-end SaaS aesthetic.
      */}
      <div 
        className={`nav-anim-item relative flex items-center justify-between w-full max-w-4xl p-1.5 rounded-full border backdrop-blur-xl transition-all duration-500 shadow-2xl ${
          isLight 
            ? 'bg-slate-100/90 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]' 
            : 'bg-[#0f1322]/80 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
        }`}
      >
        
        {/* Left: Logo */}
        <div className="flex items-center pl-2 pr-4 shrink-0">
          <button
            type="button"
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className={`relative w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-[11px] transition-all duration-300 overflow-hidden ${
              isLight
                ? 'bg-ieee-blue text-white group-hover:shadow-[0_0_12px_rgba(0,98,155,0.3)]'
                : 'bg-ieee-teal text-[#05060A] group-hover:shadow-[0_0_12px_rgba(0,150,214,0.4)]'
            }`}>
              <span className="relative z-10 tracking-tighter">IE</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className={`text-[14px] font-bold tracking-tight transition-colors leading-none flex items-center ${
                isLight ? 'text-slate-900 group-hover:text-ieee-blue' : 'text-slate-100 group-hover:text-white'
              }`}>
                IEEE NMAMIT
              </span>
            </div>
          </button>
        </div>

        {/* Center: Nav Links */}
        <nav className="hidden md:flex relative items-center gap-1 shrink-0" onMouseLeave={() => setHoveredLink(null)}>
          {/* Shared Sliding Indicator */}
          <div
            ref={indicatorRef}
            className={`absolute top-0 bottom-0 left-0 rounded-full pointer-events-none z-0 transition-opacity duration-300 ${
              isLight 
                ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white' 
                : 'bg-white/10 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-md'
            }`}
            style={{ opacity: 0 }}
          />

          {navItems.map((item, idx) => {
            const isActive = activePage === item.id;
            const isHovered = hoveredLink === item.id;
            const hasIndicator = hoveredLink ? isHovered : isActive;
            
            return (
              <button
                key={item.id}
                ref={(el) => (linkRefs.current[idx] = el)}
                type="button"
                onMouseEnter={() => setHoveredLink(item.id)}
                onClick={() => handleLinkClick(item.id)}
                className={`relative z-10 px-5 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-colors duration-300 flex items-center gap-1.5 cursor-pointer focus:outline-none ${
                  hasIndicator
                    ? isLight ? 'text-ieee-blue' : 'text-white'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    isLight ? 'bg-ieee-blue' : 'bg-ieee-teal'
                  }`} />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-4 pr-1 pl-4 shrink-0 border-l border-slate-200/80 dark:border-white/10 ml-2">
          
          <button 
            type="button" 
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className={`magic-theme-btn shrink-0 transition-all hover:scale-105 rounded-full ${
              isLight 
                ? 'bg-white text-amber-500 border border-white shadow-sm' 
                : 'is-dark bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
            }`}
            style={{ 
              /* Match the background of the button to make the cutout seamless */
              '--moon-cutout-bg': isLight ? '#ffffff' : '#1e293b' 
            }}
          >
            <div className="sun-rays" />
            <div className="main-circle" />
          </button>

          <button
            type="button"
            onClick={() => handleLinkClick('join')}
            className="btn-join-us shadow-lg shadow-ieee-blue/20 hover:shadow-ieee-blue/40 transition-shadow"
          >
            <div className="original">Join Us</div>
            <div className="letters">
              <span>J</span>
              <span>O</span>
              <span>I</span>
              <span>N</span>
              <span>&nbsp;</span>
              <span>U</span>
              <span>S</span>
            </div>
          </button>
        </div>

        {/* Mobile Action Controls */}
        <div className="md:hidden flex items-center gap-2 pr-1">
          <button
            type="button"
            onClick={(e) => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (!prefersReducedMotion()) {
                  gsap.fromTo(e.currentTarget, { scale: 0.8, rotation: mobileMenuOpen ? 90 : -90 }, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.5)' });
                }
              }}
            className={`w-9 h-9 rounded-full transition-colors flex items-center justify-center ${
              isLight
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-slate-200 hover:bg-white/10'
            }`}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-4 right-4 mt-2 rounded-2xl border backdrop-blur-2xl px-5 py-4 space-y-2 font-mono text-xs uppercase tracking-wider shadow-2xl animate-in slide-in-from-top-4 duration-300 ${
          isLight
            ? 'border-slate-200 bg-white/95'
            : 'border-slate-700/50 bg-[#0f1322]/95'
        }`}>
          {navItems.map((item, idx) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                className={`w-full text-left py-3 px-4 rounded-xl flex items-center justify-between transition-all duration-200 ${
                  isActive
                    ? isLight
                      ? 'bg-ieee-blue/10 border border-ieee-blue/30 text-ieee-blue font-bold shadow-sm'
                      : 'bg-ieee-blue/30 border border-ieee-teal/50 text-white font-bold shadow-[0_0_12px_rgba(0,150,214,0.2)]'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? (isLight ? 'bg-ieee-blue' : 'bg-ieee-teal') : (isLight ? 'bg-slate-300' : 'bg-slate-600')}`} />
                  <span>{item.label}</span>
                </div>
                <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>0{idx + 1}</span>
              </button>
            );
          })}
          
          {/* Mobile Theme Toggle */}
          <div className={`mt-4 pt-4 border-t flex items-center justify-between px-2 ${
            isLight ? 'border-slate-200' : 'border-slate-700/50'
          }`}>
             <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Theme</span>
             <button 
               type="button" 
               onClick={onToggleTheme}
               aria-label="Toggle Theme"
               className={`magic-theme-btn shrink-0 mx-1 rounded-full ${
                 isLight 
                   ? 'bg-slate-100 text-amber-500 border border-slate-200' 
                   : 'is-dark bg-slate-800 text-sky-400 border border-slate-700'
               }`}
               style={{ '--moon-cutout-bg': isLight ? '#f1f5f9' : '#1e293b' }}
             >
               <div className="sun-rays" />
               <div className="main-circle" />
             </button>
          </div>
          
          {/* Mobile Join Us */}
          <div className="pt-2 mt-2">
            <button
              onClick={() => handleLinkClick('join')}
              className="w-full btn-primary !rounded-xl !py-3 text-xs uppercase tracking-wider font-mono"
            >
              Join Us
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .magic-theme-btn {
          background-color: transparent;
          border-radius: 10px;
          --dimensions: 28px;
          width: var(--dimensions);
          height: var(--dimensions);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
          cursor: pointer;
          position: relative;
        }
        .magic-theme-btn .main-circle {
          --dimensions: 14px;
          width: var(--dimensions);
          height: var(--dimensions);
          background-color: currentColor;
          border-radius: 50%;
          position: absolute;
          transition: transform 0.4s ease 0.2s;
        }
        .magic-theme-btn .main-circle::after {
          content: "";
          background-color: var(--moon-cutout-bg);
          border-radius: 50%;
          --dimensions: 11px;
          width: var(--dimensions);
          height: var(--dimensions);
          position: absolute;
          top: 0px;
          right: -1px;
          transform-origin: right top;
          transform: scale(0);
          transition: transform 0.4s ease 0.2s;
        }
        .magic-theme-btn .sun-rays {
          display: grid;
          place-items: center;
          transition: transform 0.4s ease 0.2s;
        }
        .magic-theme-btn .sun-rays,
        .magic-theme-btn .sun-rays::after,
        .magic-theme-btn .sun-rays::before {
          --width: 2.5px;
          --height: 5px;
          width: var(--width);
          height: var(--height);
          background-color: currentColor;
          position: absolute;
          box-shadow: 0 11px 0 currentColor, 0 -11px 0 currentColor;
        }
        .magic-theme-btn .sun-rays::after {
          content: "";
          transform: rotate(120deg);
        }
        .magic-theme-btn .sun-rays::before {
          content: "";
          transform: rotate(240deg);
        }
        .magic-theme-btn.is-dark .main-circle {
          transform: scale(1.2);
        }
        .magic-theme-btn.is-dark .main-circle::after {
          transform: scale(1);
        }
        .magic-theme-btn.is-dark .sun-rays {
          transition: transform 0.4s;
          transform: scale(0);
        }

        /* Custom Join Us Button */
        .btn-join-us {
          border: none;
          border-radius: 999px;
          box-sizing: border-box;
          font-weight: 800;
          overflow: hidden;
          padding: 0 1.5rem;
          height: 36px;
          position: relative;
          text-transform: uppercase;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          letter-spacing: 0.05em;
          background-color: #05070a; /* Dark background for revealed letters */
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn-join-us .original {
          background: linear-gradient(to right, #00629B, #0096D6);
          color: #fff;
          display: grid;
          inset: 0;
          place-content: center;
          position: absolute;
          transition: transform 0.3s cubic-bezier(0.87, 0, 0.13, 1);
          border-radius: 999px;
          width: 100%;
          height: 100%;
        }

        .btn-join-us:hover .original {
          transform: translateY(100%);
        }

        .btn-join-us .letters {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-join-us span {
          opacity: 0;
          transform: translateY(-15px);
          transition: transform 0.3s cubic-bezier(0.87, 0, 0.13, 1), opacity 0.3s;
        }

        .btn-join-us span:nth-child(2n) {
          transform: translateY(15px);
        }

        .btn-join-us:hover span {
          opacity: 1;
          transform: translateY(0);
        }
        
        .btn-join-us:hover span:nth-child(2) { transition-delay: 0.03s; }
        .btn-join-us:hover span:nth-child(3) { transition-delay: 0.06s; }
        .btn-join-us:hover span:nth-child(4) { transition-delay: 0.09s; }
        .btn-join-us:hover span:nth-child(5) { transition-delay: 0.12s; }
        .btn-join-us:hover span:nth-child(6) { transition-delay: 0.15s; }
        .btn-join-us:hover span:nth-child(7) { transition-delay: 0.18s; }
      `}} />
    </header>
  );
}

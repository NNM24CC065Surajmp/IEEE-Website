import React, { useState, useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({
  activePage,
  onNavigate,
  theme,
  onToggleTheme,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isManuallyExpanded, setIsManuallyExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const navRef = useRef(null);
  const innerBarRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const rightElementsWrapperRef = useRef(null);
  const rightElementsRef = useRef(null);
  const indicatorRef = useRef(null);
  const linkRefs = useRef([]);
  const isFirstRender = useRef(true);

  // Refs for scroll listener stability
  const isManuallyExpandedRef = useRef(isManuallyExpanded);
  const expandedScrollYRef = useRef(0);

  useEffect(() => {
    isManuallyExpandedRef.current = isManuallyExpanded;
  }, [isManuallyExpanded]);

  const isLight = theme === 'light';

  // Track mobile state to prevent layout collapse on mobile devices
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showCollapsedState = isCollapsed && !isMobile && !isManuallyExpanded;

  // Navbar entrance animation
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from('.nav-anim-item', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 0.1,
      });
    },
    { scope: navRef }
  );

    // Scroll detection with hysteresis and auto-collapse (RAF batched)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrolled(currentScrollY > 20);

          if (currentScrollY > 80) {
            setIsCollapsed(true);
          } else if (currentScrollY < 40) {
            setIsCollapsed(false);
            setIsManuallyExpanded(false); 
          }

          if (isManuallyExpandedRef.current) {
            if (Math.abs(currentScrollY - expandedScrollYRef.current) > 100) {
              setIsManuallyExpanded(false);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

      // Coordinated GSAP Timeline for Collapse/Expand
  const tl = useRef(null);

  useGSAP(() => {
    const header = navRef.current;
    const pill = innerBarRef.current;
    const rightWrapperEl = rightElementsWrapperRef.current;
    const rightEl = rightElementsRef.current;

    if (!header || !pill || !rightWrapperEl || !rightEl) return;

    if (isMobile) {
      gsap.set([header, pill, rightWrapperEl, rightEl], { clearProps: 'all' });
      return;
    }

    if (prefersReducedMotion()) {
      if (showCollapsedState) {
        gsap.set(header, { paddingTop: '0.75rem', paddingBottom: '0.75rem' }); // py-3 equivalent
        gsap.set(rightWrapperEl, { display: 'none', width: 0 });
        gsap.set(rightEl, { autoAlpha: 0 });
      } else {
        gsap.set(header, { paddingTop: '1.25rem', paddingBottom: '1.25rem' }); // py-5 equivalent
        gsap.set(rightWrapperEl, { display: 'flex', width: 'auto' });
        gsap.set(rightEl, { autoAlpha: 1 });
      }
      return;
    }

    // Kill existing timeline to prevent conflicts on rapid scroll
    if (tl.current) {
      tl.current.kill();
    }
    
    tl.current = gsap.timeline();

    // 1. Measure exact pixel width to avoid 'auto' resolution jank
    // Briefly force flex/auto to measure true intrinsic width safely
    gsap.set(rightWrapperEl, { display: 'flex', width: 'auto' });
    const targetWidth = rightWrapperEl.scrollWidth;

    if (showCollapsedState) {
      // Reset to exact start positions before animating
      gsap.set(rightWrapperEl, { width: targetWidth });
      gsap.set(rightEl, { opacity: 1 });
      
      tl.current
        // A. Fade out nav items quickly
        .to(rightEl, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out',
        })
        // B. Shrink width and padding simultaneously with fade (starts same time, takes longer)
        .to(rightWrapperEl, {
          width: 0,
          duration: 0.45,
          ease: 'power3.inOut',
        }, '<')
        .to(header, {
          paddingTop: '0.75rem',
          paddingBottom: '0.75rem',
          duration: 0.45,
          ease: 'power3.inOut',
        }, '<')
        // C. Apply display none only after width shrink completes
        .set(rightWrapperEl, { display: 'none' });

    } else {
      // Reset to exact start positions before animating
      gsap.set(rightWrapperEl, { width: 0, display: 'flex' });
      gsap.set(rightEl, { opacity: 0 });
      
      tl.current
        // A. Grow width and padding immediately
        .to(rightWrapperEl, {
          width: targetWidth,
          duration: 0.45,
          ease: 'power3.inOut',
        })
        .to(header, {
          paddingTop: '1.25rem',
          paddingBottom: '1.25rem',
          duration: 0.45,
          ease: 'power3.inOut',
        }, '<')
        // B. Fade in opacity starting partway through width growth
        .to(rightEl, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        }, '-=0.25')
        // C. Cleanup width to auto so it reflows naturally on window resize
        .set(rightWrapperEl, { width: 'auto' });
    }

  }, [showCollapsedState, isMobile]);

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'events', label: 'Events' },
    { id: 'team', label: 'Team' },
    { id: 'profile', label: 'Profile' },
  ];

  const handleLinkClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setIsManuallyExpanded(false);
  };

  const handleLogoClick = () => {
    if (showCollapsedState) {
      setIsManuallyExpanded(true);
      expandedScrollYRef.current = window.scrollY;
    } else {
      handleLinkClick('home');
    }
  };

  // Sliding indicator
  useEffect(() => {
    if (showCollapsedState) return; // Skip updating while collapsed

    const targetId = hoveredLink || activePage;
    const targetIndex = navItems.findIndex((item) => item.id === targetId);
    const targetEl = linkRefs.current[targetIndex];

    if (targetEl && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = targetEl;

      if (isFirstRender.current || prefersReducedMotion()) {
        gsap.set(indicatorRef.current, {
          x: offsetLeft,
          width: offsetWidth,
          opacity: 1,
        });
        
        if (!hoveredLink) {
          isFirstRender.current = false;
        }
      } else {
        gsap.to(indicatorRef.current, {
          x: offsetLeft,
          width: offsetWidth,
          opacity: 1,
          duration: 0.35,
          ease: 'expo.out',
          overwrite: 'auto',
        });
      }
    }
  }, [activePage, hoveredLink, showCollapsedState]);

  // Recalculate indicator on resize
  useEffect(() => {
    const handleResize = () => {
      if (showCollapsedState) return;
      const targetId = hoveredLink || activePage;
      const targetIndex = navItems.findIndex((item) => item.id === targetId);
      const targetEl = linkRefs.current[targetIndex];

      if (targetEl && indicatorRef.current) {
        gsap.set(indicatorRef.current, {
          x: targetEl.offsetLeft,
          width: targetEl.offsetWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hoveredLink, activePage, showCollapsedState]);

  return (
        <header
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 w-full motion-reduce:transition-none flex justify-center px-4 py-5"
    >
      {/* Premium unified navbar */}
      <div
        ref={innerBarRef}
        className={`nav-anim-item relative flex items-center w-fit max-w-full p-1.5 rounded-full border backdrop-blur-xl transition-colors duration-500 shadow-2xl overflow-hidden ${
          isLight
            ? 'bg-slate-100/90 border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
            : 'bg-zinc-950/80 border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
        } ${showCollapsedState ? 'bg-opacity-100 backdrop-blur-3xl' : ''}`}
      >
        {/* Logo Container */}
        <div ref={logoWrapperRef} className="flex items-center shrink-0 z-10 px-2">
          <button
              type="button"
              onClick={handleLogoClick}
              className="relative bg-white rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-105 shadow-[0_2px_10px_rgba(0,0,0,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue overflow-hidden w-[140px] h-[40px] cursor-pointer shrink-0"
              aria-label={showCollapsedState ? "Expand navigation" : "IEEE NMAMIT home"}
            >
              <img 
                src="/images/ieee-nmamit-logo-lockup.png" 
                alt="IEEE NMAMIT Student Branch Logo" 
                className="pointer-events-none w-full h-full object-contain p-1.5"
              />
            </button>
        </div>

        {/* Right side wrapper animates width to smoothly collapse the parent w-fit container */}
        <div ref={rightElementsWrapperRef} className="flex overflow-hidden">
          {/* Right side container (Nav Links + Actions + Mobile Controls) */}
          <div ref={rightElementsRef} className="flex items-center shrink-0 pl-8 pr-2">
          
          {/* Desktop navigation */}
          <nav
            className="hidden md:flex relative items-center gap-1 shrink-0"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {/* Sliding indicator */}
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
                  ref={(el) => { linkRefs.current[idx] = el; }}
                  type="button"
                  tabIndex={showCollapsedState ? -1 : undefined}
                  onMouseEnter={() => setHoveredLink(item.id)}
                  onClick={() => handleLinkClick(item.id)}
                  className={`relative z-10 px-5 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-colors duration-300 flex items-center gap-1.5 cursor-pointer focus:outline-none ${
                    hasIndicator
                      ? isLight
                        ? 'text-ieee-blue'
                        : 'text-white'
                      : isLight
                        ? 'text-slate-600 hover:text-slate-900'
                        : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4 pr-1 pl-4 shrink-0 border-l border-slate-200/80 dark:border-white/10 ml-2">
            {/* Theme button */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle Theme"
              tabIndex={showCollapsedState ? -1 : undefined}
              className={`magic-theme-btn shrink-0 transition-all hover:scale-105 rounded-full ${
                isLight
                  ? 'bg-white text-amber-500 border border-white shadow-sm'
                  : 'is-dark bg-slate-800 text-sky-400 border border-slate-700 shadow-sm'
              }`}
              style={{
                '--moon-cutout-bg': isLight ? '#ffffff' : '#1e293b',
              }}
            >
              <div className="sun-rays" />
              <div className="main-circle" />
            </button>

            {/* Join Us */}
            <button
              type="button"
              onClick={() => handleLinkClick('join')}
              tabIndex={showCollapsedState ? -1 : undefined}
              className="btn-join-us shadow-lg shadow-ieee-blue/20 hover:shadow-ieee-blue/40 transition-shadow"
            >
              <div className="original">Join Us</div>
              <div className="letters">
                <span>J</span><span>O</span><span>I</span><span>N</span>
                <span>&nbsp;</span>
                <span>U</span><span>S</span>
              </div>
            </button>
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2 pr-1">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle Light and Dark Theme"
              className={`p-2 rounded-lg border transition-colors ${
                isLight
                  ? 'border-slate-300 bg-slate-100 text-amber-500'
                  : 'border-zinc-800 bg-zinc-900/80 text-sky-400'
              }`}
            >
              {isLight ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
              className={`p-2 rounded-lg border transition-colors ${
                isLight
                  ? 'border-slate-300 bg-slate-100 text-slate-700 hover:text-slate-900'
                  : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white'
              }`}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
        </div>
      </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden absolute top-full left-4 right-4 mt-2 rounded-2xl border backdrop-blur-2xl px-5 py-4 space-y-2 font-mono text-xs uppercase tracking-wider shadow-2xl ${
            isLight
              ? 'border-slate-200 bg-white/95'
              : 'border-slate-700/50 bg-zinc-950/95'
          }`}
        >
          {navItems.map((item, idx) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                className={`mobile-menu-item w-full text-left py-3 px-4 rounded-xl flex items-center justify-between transition-all duration-200 ${
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
                  <span>{item.label}</span>
                </div>
                <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  0{idx + 1}
                </span>
              </button>
            );
          })}

          {/* Mobile theme */}
          <div className={`mobile-menu-item mt-4 pt-4 border-t flex items-center justify-between px-2 ${isLight ? 'border-slate-200' : 'border-slate-700/50'}`}>
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
              style={{
                '--moon-cutout-bg': isLight ? '#f1f5f9' : '#1e293b',
              }}
            >
              <div className="sun-rays" />
              <div className="main-circle" />
            </button>
          </div>

          {/* Mobile Join */}
          <div className="mobile-menu-item pt-2 mt-2">
            <button
              type="button"
              onClick={() => handleLinkClick('join')}
              className="w-full btn-primary !rounded-xl !py-3 text-xs uppercase tracking-wider font-mono"
            >
              Join Us
            </button>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes staggerSlideIn {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .mobile-menu-item {
              animation: staggerSlideIn 0.3s ease-out forwards;
              opacity: 0;
            }
            .mobile-menu-item:nth-child(1) { animation-delay: 0.05s; }
            .mobile-menu-item:nth-child(2) { animation-delay: 0.10s; }
            .mobile-menu-item:nth-child(3) { animation-delay: 0.15s; }
            .mobile-menu-item:nth-child(4) { animation-delay: 0.20s; }
            .mobile-menu-item:nth-child(5) { animation-delay: 0.25s; }
            .mobile-menu-item:nth-child(6) { animation-delay: 0.30s; }
            .mobile-menu-item:nth-child(7) { animation-delay: 0.35s; }
            .mobile-menu-item:nth-child(8) { animation-delay: 0.40s; }

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
              box-shadow:
                0 11px 0 currentColor,
                0 -11px 0 currentColor;
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
              background-color: #05070a;
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .btn-join-us .original {
              background: linear-gradient(
                to right,
                #00629B,
                #0096D6
              );
              color: #fff;
              display: grid;
              inset: 0;
              place-content: center;
              position: absolute;
              transition: transform 0.3s
                cubic-bezier(0.87, 0, 0.13, 1);
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
              transition:
                transform 0.3s
                  cubic-bezier(0.87, 0, 0.13, 1),
                opacity 0.3s;
            }

            .btn-join-us span:nth-child(2n) {
              transform: translateY(15px);
            }

            .btn-join-us:hover span {
              opacity: 1;
              transform: translateY(0);
            }

            .btn-join-us:hover span:nth-child(2) {
              transition-delay: 0.03s;
            }

            .btn-join-us:hover span:nth-child(3) {
              transition-delay: 0.06s;
            }

            .btn-join-us:hover span:nth-child(4) {
              transition-delay: 0.09s;
            }

            .btn-join-us:hover span:nth-child(5) {
              transition-delay: 0.12s;
            }

            .btn-join-us:hover span:nth-child(6) {
              transition-delay: 0.15s;
            }

            .btn-join-us:hover span:nth-child(7) {
              transition-delay: 0.18s;
            }
          `,
        }}
      />
    </header>
  );
}









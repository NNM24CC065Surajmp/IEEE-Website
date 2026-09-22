import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const buttonRef = useRef(null);
  const firstLinkRef = useRef(null);

  // Handle scroll state for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 10);
    };
    
    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle closing mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle body scroll lock and focus management when mobile menu opens
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Slight delay to allow render before focus
      setTimeout(() => {
        firstLinkRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle Escape key to close menu and click outside
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    const handleClickOutside = (e) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Team / Profile', path: '/team' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-16 ${
        isScrolled
          ? 'bg-ieee-black/80 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent border-transparent shadow-none'
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between"
      >
        {/* Logo and Wordmark */}
        <Link to="/" className="flex items-center gap-3 z-50 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ieee-blue">
          {/* // TODO: replace with real logo file */}
          <img
            src="/images/ieee-nmamit-logo.png"
            alt="IEEE NMAMIT Student Branch logo"
            className="w-10 h-10 object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="font-heading font-bold text-xl tracking-tight text-white">
            IEEE NMAMIT
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 font-body">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `group relative py-2 font-medium transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue focus-visible:ring-offset-4 focus-visible:ring-offset-transparent ${
                  isActive ? 'text-ieee-teal active' : 'text-slate-300 hover:text-ieee-teal'
                }`
              }
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-ieee-teal origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-[.active]:scale-x-100 motion-reduce:transition-none" />
            </NavLink>
          ))}
          <NavLink
            to="/join"
            className={({ isActive }) =>
              `btn-primary text-sm px-5 py-2 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-ieee-black ${
                isActive ? 'ring-2 ring-ieee-teal ring-offset-4 ring-offset-ieee-black' : ''
              }`
            }
          >
            Join Us
          </NavLink>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 z-50 text-slate-100 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ieee-blue rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} stroke="currentColor" /> : <Menu size={24} stroke="currentColor" />}
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className={`md:hidden absolute top-16 left-0 w-full bg-ieee-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 ease-out origin-top motion-reduce:transition-none ${
          isMobileMenuOpen ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col font-body">
          {navLinks.map((link, index) => (
            <NavLink
              key={link.path}
              to={link.path}
              ref={index === 0 ? firstLinkRef : null}
              className={({ isActive }) =>
                `block px-4 py-3 min-h-[44px] text-base font-medium rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ieee-blue ${
                  isActive
                    ? 'bg-ieee-blue/10 text-ieee-teal'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <div className="pt-4 pb-2 px-2">
            <NavLink
              to="/join"
              className={({ isActive }) =>
                `btn-primary w-full min-h-[44px] text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ieee-blue ${
                  isActive ? 'ring-2 ring-ieee-teal ring-offset-4 ring-offset-ieee-black' : ''
                }`
              }
            >
              Join Us
            </NavLink>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Backdrop (allows clicking outside below the panel) */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 top-16 bg-black/40 z-[-1] motion-reduce:transition-none"
          aria-hidden="true"
        />
      )}
    </header>
  );
}

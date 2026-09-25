import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({ activePage, onNavigate, theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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

  const isLight = theme === 'light';

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? isLight
            ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/80 py-3 shadow-lg shadow-slate-200/50'
            : 'bg-[#05070a]/90 backdrop-blur-xl border-b border-zinc-800/80 py-3 shadow-2xl shadow-black/50'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className={`relative w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 overflow-hidden ${
            isLight
              ? 'border-slate-300 bg-white text-ieee-blue group-hover:border-ieee-blue group-hover:shadow-[0_0_15px_rgba(0,98,155,0.2)]'
              : 'border-zinc-700/80 bg-zinc-900/90 text-ieee-teal group-hover:border-ieee-teal group-hover:shadow-[0_0_15px_rgba(0,150,214,0.4)]'
          }`}>
            <span className="relative z-10">IE</span>
            <div className="absolute inset-0 bg-gradient-to-tr from-ieee-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-bold tracking-tight transition-colors flex items-center gap-1.5 ${
              isLight ? 'text-slate-900 group-hover:text-ieee-blue' : 'text-zinc-100 group-hover:text-white'
            }`}>
              IEEE NMAMIT
              <span className="w-1.5 h-1.5 rounded-full bg-ieee-teal animate-pulse" />
            </span>
            <span className={`text-[10px] font-mono tracking-wider uppercase transition-colors ${
              isLight ? 'text-slate-500 group-hover:text-slate-700' : 'text-zinc-400 group-hover:text-zinc-300'
            }`}>
              Student Branch
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <nav className={`flex items-center gap-1.5 p-1 rounded-full border backdrop-blur-md shadow-inner transition-colors duration-300 ${
            isLight
              ? 'border-slate-200 bg-slate-100/90'
              : 'border-zinc-800/80 bg-zinc-900/70'
          }`}>
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleLinkClick(item.id)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer focus:outline-none ${
                    isActive
                      ? isLight
                        ? 'text-white font-bold bg-ieee-blue border border-ieee-blue shadow-md shadow-ieee-blue/25'
                        : 'text-white font-bold bg-ieee-blue/80 border border-ieee-teal/60 shadow-[0_0_15px_rgba(0,150,214,0.35)]'
                      : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Light and Dark Theme"
            className={`p-2 rounded-full border transition-all duration-300 flex items-center justify-center cursor-pointer focus:outline-none ${
              isLight
                ? 'border-slate-300 bg-slate-100 text-amber-500 hover:bg-amber-50 hover:border-amber-400 hover:shadow-md'
                : 'border-zinc-800 bg-zinc-900 text-sky-400 hover:bg-zinc-800 hover:border-sky-500 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]'
            }`}
          >
            {isLight ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>

        {/* Mobile Action Controls */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Theme Toggle */}
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

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg border transition-colors ${
              isLight
                ? 'border-slate-300 bg-slate-100 text-slate-700 hover:text-slate-900'
                : 'border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white'
            }`}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b backdrop-blur-2xl px-6 py-5 mt-2 space-y-2 font-mono text-xs uppercase tracking-wider shadow-2xl animate-in slide-in-from-top-3 duration-200 ${
          isLight
            ? 'border-slate-200 bg-white/95'
            : 'border-zinc-800/80 bg-[#07090e]/95'
        }`}>
          {navItems.map((item, idx) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                className={`w-full text-left py-2.5 px-3 rounded-lg flex items-center justify-between transition-all duration-200 ${
                  isActive
                    ? isLight
                      ? 'bg-ieee-blue/10 border border-ieee-blue/30 text-ieee-blue font-bold shadow-sm'
                      : 'bg-ieee-blue/30 border border-ieee-teal/50 text-white font-bold shadow-[0_0_12px_rgba(0,150,214,0.2)]'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? (isLight ? 'bg-ieee-blue' : 'bg-ieee-teal') : (isLight ? 'bg-slate-300' : 'bg-zinc-600')}`} />
                  <span>{item.label}</span>
                </div>
                <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>0{idx + 1}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

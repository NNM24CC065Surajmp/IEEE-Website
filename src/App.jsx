import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import TeamPage from './pages/TeamPage.jsx';

export default function App() {
  // Read initial page from URL hash if available (e.g. #about, #events, #team)
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (['home', 'about', 'events', 'team'].includes(hash)) {
      return hash;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  // Theme state: 'dark' (default) or 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('ieee_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
    localStorage.setItem('ieee_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Sync state with browser hash changes (back / forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['home', 'about', 'events', 'team'].includes(hash)) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigate handler that updates URL hash and scrolls smoothly to top
  const navigateTo = (pageId) => {
    setCurrentPage(pageId);
    window.location.hash = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage onNavigate={navigateTo} />;
      case 'events':
        return <EventsPage onNavigate={navigateTo} />;
      case 'team':
        return <TeamPage onNavigate={navigateTo} />;
      case 'home':
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className={`relative min-h-screen font-sans selection:bg-[#00629B] selection:text-white overflow-hidden flex flex-col justify-between antialiased transition-colors duration-300 ${
      theme === 'light'
        ? 'bg-slate-50 text-slate-900'
        : 'bg-[#05070a] text-zinc-100'
    }`}>
      {/* Background Architectural Grid & Subtle Radial Glow */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          opacity: theme === 'light' ? 0.06 : 0.035,
          backgroundImage: theme === 'light'
            ? `linear-gradient(to right, rgba(0,98,155,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,98,155,0.4) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />
      <div className={`fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] transition-opacity duration-300 z-0 ${
        theme === 'light'
          ? 'from-[#00629B]/[0.08] via-transparent to-transparent'
          : 'from-[#00629B]/[0.10] via-transparent to-transparent'
      }`} />

      {/* Unified Sticky Navbar */}
      <Navbar activePage={currentPage} onNavigate={navigateTo} theme={theme} onToggleTheme={toggleTheme} />

      {/* Dynamic Page Content with Smooth Transition */}
      <main key={currentPage} className="animate-page-fade relative z-10 flex-1">
        {renderPage()}
      </main>

      {/* Unified Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

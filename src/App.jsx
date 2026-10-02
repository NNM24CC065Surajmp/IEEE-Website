import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AuthModal from './components/AuthModal.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import { subscribeToAuthChanges, logoutUser } from './lib/firebase.js';

export default function App() {
  // Read initial page from URL hash if available (e.g. #about, #events, #team)
  const getInitialPage = () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (['home', 'about', 'events', 'team', 'profile'].includes(hash)) {
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

  // ─── Auth state ──────────────────────────────────────────────────
  const [authUser, setAuthUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  // Only auto-prompt the login modal once, the first time we learn
  // there's no signed-in user — not on every re-render.
  const hasAutoPrompted = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setAuthUser(user);
      setAuthChecked(true);

      if (user) {
        // Signed in — make sure the modal isn't left open.
        setAuthModalOpen(false);
      } else if (!hasAutoPrompted.current) {
        setAuthModalOpen(true);
        hasAutoPrompted.current = true;
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    hasAutoPrompted.current = false; // allow the prompt again on next logged-out state
  };

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
      if (['home', 'about', 'events', 'team', 'profile'].includes(hash)) {
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
      case 'profile':
        return <ProfilePage onNavigate={navigateTo} authUser={authUser} />;
      case 'home':
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  // While we haven't heard back from Firebase yet, show a minimal splash
  // instead of flashing the homepage before we know the auth state.
  if (!authChecked) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-slate-50' : 'bg-[#05070a]'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#00629B] border-t-transparent animate-spin" />
          <p className={`text-[10px] font-mono uppercase tracking-wider ${theme === 'light' ? 'text-slate-400' : 'text-zinc-600'}`}>
            IEEE NMAMIT
          </p>
        </div>
      </div>
    );
  }

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
      <Navbar
        activePage={currentPage}
        onNavigate={navigateTo}
        theme={theme}
        onToggleTheme={toggleTheme}
        authUser={authUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Dynamic Page Content with Smooth Transition */}
      <main key={currentPage} className="animate-page-fade relative z-10 flex-1">
        {renderPage()}
      </main>

      {/* Unified Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Auth Modal — auto-opens once if no one is signed in, reopens via the Navbar's Sign In button */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        theme={theme}
      />
    </div>
  );
}
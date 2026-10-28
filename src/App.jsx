import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import ShaderAurora from './components/ShaderAurora.jsx';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import AuthModal from './components/AuthModal.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { initSmoothScroll, destroySmoothScroll } from './lib/smoothScroll.js';
import { subscribeToAuthChanges, logoutUser } from './lib/firebase.js';

import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import Join from './pages/Join.jsx';
import NotFound from './pages/NotFound.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function AppContent({ theme, toggleTheme, authUser, onOpenAuth, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active page from URL
  const activePage =
    location.pathname === '/'
      ? 'home'
      : location.pathname.substring(1);

  // Navigation handler
  const navigateTo = (pageId) => {
    navigate(pageId === 'home' ? '/' : `/${pageId}`);
  };

  // If user accesses /login or /register directly, open the overlay on the current page
  useEffect(() => {
    if (location.pathname === '/login') {
      onOpenAuth('login');
      navigate('/', { replace: true });
    } else if (location.pathname === '/register') {
      onOpenAuth('register');
      navigate('/', { replace: true });
    }
  }, [location.pathname, onOpenAuth, navigate]);

  return (
    <div
      className={`relative min-h-screen font-sans
        selection:bg-[#00629B]
        selection:text-white
        overflow-x-hidden
        flex flex-col
        justify-between
        antialiased
        transition-colors
        duration-300
        text-slate-900 dark:text-zinc-100`}
    >
      <ShaderAurora isDarkMode={theme === 'dark'} />

      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-[#00629B] focus:text-white focus:rounded-lg"
      >
        Skip to content
      </a>

      {/* Radial Blue Glow */}
      <div
        className={`fixed inset-0 pointer-events-none
          transition-opacity duration-300
          z-0
          bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
          ${
            theme === 'light'
              ? 'from-[#00629B]/[0.08] via-transparent to-transparent'
              : 'from-[#00629B]/[0.10] via-transparent to-transparent'
          }`}
      />

      {/* Preloader */}
      <Preloader />

      {/* Navbar */}
      <Navbar
        activePage={activePage}
        onNavigate={navigateTo}
        theme={theme}
        onToggleTheme={toggleTheme}
        authUser={authUser}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main
        id="main"
        key={location.pathname}
        className="animate-page-fade relative z-10 flex-1"
      >
        <ErrorBoundary resetKey={location.pathname} onNavigateHome={() => navigateTo('home')}>
          <Routes>
            {/* Home */}
            <Route
              path="/"
              element={<HomePage onNavigate={navigateTo} />}
            />

            {/* About */}
            <Route
              path="/about"
              element={<AboutPage onNavigate={navigateTo} />}
            />

            {/* Events */}
            <Route
              path="/events"
              element={<EventsPage onNavigate={navigateTo} />}
            />

            {/* Team */}
            <Route
              path="/team"
              element={<TeamPage onNavigate={navigateTo} />}
            />

            {/* Join */}
            <Route
              path="/join"
              element={<Join onNavigate={navigateTo} onOpenAuth={onOpenAuth} authUser={authUser} />}
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={
                <ProfilePage
                  onNavigate={navigateTo}
                  authUser={authUser}
                  onOpenAuth={onOpenAuth}
                />
              }
            />

            {/* 404 */}
            <Route
              path="*"
              element={<NotFound onNavigate={navigateTo} />}
            />
          </Routes>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, []);

  // Theme state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('ieee_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return 'dark';
  });

  const [authUser, setAuthUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  useEffect(() => {
    // Check if there is an active QR session in sessionStorage
    const savedQrUser = sessionStorage.getItem('ieee_qr_user');
    if (savedQrUser && !authUser) {
      try {
        setAuthUser(JSON.parse(savedQrUser));
      } catch {
        sessionStorage.removeItem('ieee_qr_user');
      }
    }

    const unsubscribe = subscribeToAuthChanges((user) => {
      setAuthUser(user);
      if (user) {
        setAuthModalOpen(false);
      }
    });

    const handleQrAuth = (e) => {
      if (e.detail) {
        setAuthUser(e.detail);
        sessionStorage.setItem('ieee_qr_user', JSON.stringify(e.detail));
        setAuthModalOpen(false);
      }
    };
    window.addEventListener('ieee:qr-auth', handleQrAuth);

    return () => {
      unsubscribe();
      window.removeEventListener('ieee:qr-auth', handleQrAuth);
    };
  }, []);

  const handleLogout = async () => {
    sessionStorage.removeItem('ieee_qr_user');
    await logoutUser();
  };

  // Apply theme
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

  // Toggle theme
  const toggleTheme = () => {
    setTheme((previousTheme) =>
      previousTheme === 'dark' ? 'light' : 'dark'
    );
  };

  return (
    <BrowserRouter>
      {/* Scroll to top whenever route changes */}
      <ScrollToTop />

      {/* Application Content */}
      <AppContent
        theme={theme}
        toggleTheme={toggleTheme}
        authUser={authUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Refined Authentication Card Overlay */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        theme={theme}
        initialMode={authModalMode}
      />
    </BrowserRouter>
  );
}

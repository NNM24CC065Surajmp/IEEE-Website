import React, { useState, useEffect, lazy, Suspense } from 'react';
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

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const EventsPage = lazy(() => import('./pages/EventsPage.jsx'));
const TeamPage = lazy(() => import('./pages/TeamPage.jsx'));
const Join = lazy(() => import('./pages/Join.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'));
const EventRegisterPage = lazy(() => import('./pages/EventRegisterPage.jsx'));

function AppContent({ theme, toggleTheme, authUser, onOpenAuth, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active page from URL
  const activePage =
    location.pathname === '/'
      ? 'home'
      : location.pathname.startsWith('/events')
      ? 'events'
      : location.pathname.substring(1);

  // Navigation handler
  const navigateTo = (pageId) => {
    if (pageId.startsWith('/')) {
      navigate(pageId);
    } else {
      navigate(pageId === 'home' ? '/' : `/${pageId}`);
    }
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
          <Suspense
            fallback={
              <div className="min-h-[50vh] flex items-center justify-center">
                <div
                  className="w-8 h-8 rounded-full border-2 border-[#00629B] border-t-transparent animate-spin"
                  role="status"
                  aria-label="Loading content..."
                />
              </div>
            }
          >
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
              <Route
                path="/events/:eventId/register"
                element={<EventRegisterPage onNavigate={navigateTo} authUser={authUser} />}
              />
              <Route
                path="/events/register/:eventId"
                element={<EventRegisterPage onNavigate={navigateTo} authUser={authUser} />}
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
          </Suspense>
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

  // Authenticated user state: Validated strictly by Firebase or backend session (never unverified localStorage)
  const [authUser, setAuthUser] = useState(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  useEffect(() => {
    // 1. Check verified backend session cookie (/api/auth/me)
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && data.user) {
          setAuthUser(data.user);
        }
      })
      .catch(() => {
        // Backend not mounted or offline; fall back to Firebase client auth
      });

    // 2. Subscribe to verified Firebase Auth state
    const unsubscribe = subscribeToAuthChanges((user) => {
      if (user) {
        setAuthUser(user);
        setAuthModalOpen(false);
      } else {
        setAuthUser((prev) => (prev && prev.uid && !prev.isAnonymous ? prev : null));
      }
    });

    // 3. Handle verified QR pass presentation event for the active session
    const handleQrAuth = (e) => {
      if (e.detail && e.detail.isQrVerified) {
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
    localStorage.removeItem('ieee_member_profile');
    setAuthUser(null);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Ignore network errors on logout
    }
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

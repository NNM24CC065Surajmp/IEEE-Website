import React, { useEffect, useRef, useState } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import Preloader from './components/Preloader';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import AuthModal from './components/AuthModal.jsx';

import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import Join from './pages/Join.jsx';
import NotFound from './pages/NotFound.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

import {
  subscribeToAuthChanges,
  logoutUser,
} from './lib/firebase.js';


function AppContent({
  theme,
  toggleTheme,
  authUser,
  onOpenAuth,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const activePage =
    location.pathname === '/'
      ? 'home'
      : location.pathname.substring(1);

  const navigateTo = (pageId) => {
    navigate(pageId === 'home' ? '/' : `/${pageId}`);
  };

  return (
    <div
      className={`relative min-h-screen font-sans
        selection:bg-[#00629B]
        selection:text-white
        overflow-hidden
        flex flex-col
        justify-between
        antialiased
        transition-colors
        duration-300
        ${
          theme === 'light'
            ? 'bg-slate-50 text-slate-900'
            : 'bg-[#05060A] text-zinc-100'
        }`}
    >

      {/* Skip to content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-[#00629B] focus:text-white focus:rounded-lg"
      >
        Skip to content
      </a>

      {/* Background Grid */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          opacity: theme === 'light' ? 0.06 : 0.035,

          backgroundImage:
            theme === 'light'
              ? `
                linear-gradient(
                  to right,
                  rgba(0,98,155,0.4) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  to bottom,
                  rgba(0,98,155,0.4) 1px,
                  transparent 1px
                )
              `
              : `
                linear-gradient(
                  to right,
                  rgba(255,255,255,0.6) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  to bottom,
                  rgba(255,255,255,0.6) 1px,
                  transparent 1px
                )
              `,

          backgroundSize: '36px 36px',
        }}
      />

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

      <Preloader />

      <Navbar
        activePage={activePage}
        onNavigate={navigateTo}
        theme={theme}
        onToggleTheme={toggleTheme}
        authUser={authUser}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
      />

      <main
        id="main"
        key={location.pathname}
        className="animate-page-fade relative z-10 flex-1"
      >
        <Routes>

          <Route
            path="/"
            element={<HomePage onNavigate={navigateTo} />}
          />

          <Route
            path="/about"
            element={<AboutPage onNavigate={navigateTo} />}
          />

          <Route
            path="/events"
            element={<EventsPage onNavigate={navigateTo} />}
          />

          <Route
            path="/team"
            element={<TeamPage onNavigate={navigateTo} />}
          />

          <Route
            path="/join"
            element={<Join onNavigate={navigateTo} />}
          />

          <Route
            path="/profile"
            element={
              <ProfilePage
                onNavigate={navigateTo}
                authUser={authUser}
              />
            }
          />

          <Route
            path="*"
            element={<NotFound onNavigate={navigateTo} />}
          />

        </Routes>
      </main>

      <Footer onNavigate={navigateTo} />

    </div>
  );
}


export default function App() {

  /* ---------------- THEME ---------------- */

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('ieee_theme');

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return 'dark';
  });


  /* ---------------- AUTH ---------------- */

  const [authUser, setAuthUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const hasAutoPrompted = useRef(false);


  useEffect(() => {

    const unsubscribe = subscribeToAuthChanges((user) => {

      setAuthUser(user);
      setAuthChecked(true);

      if (user) {

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

    hasAutoPrompted.current = false;

  };


  /* ---------------- THEME EFFECT ---------------- */

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

    setTheme((previousTheme) =>
      previousTheme === 'dark'
        ? 'light'
        : 'dark'
    );

  };


  /* ---------------- AUTH LOADING ---------------- */

  if (!authChecked) {

    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === 'light'
            ? 'bg-slate-50'
            : 'bg-[#05070a]'
        }`}
      >

        <div className="flex flex-col items-center gap-3">

          <div className="w-8 h-8 rounded-full border-2 border-[#00629B] border-t-transparent animate-spin" />

          <p
            className={`text-[10px] font-mono uppercase tracking-wider ${
              theme === 'light'
                ? 'text-slate-400'
                : 'text-zinc-600'
            }`}
          >
            IEEE NMAMIT
          </p>

        </div>

      </div>
    );

  }


  /* ---------------- APP ---------------- */

  return (

    <BrowserRouter>

      <ScrollToTop />

      <AppContent
        theme={theme}
        toggleTheme={toggleTheme}
        authUser={authUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        theme={theme}
      />

    </BrowserRouter>

  );
}
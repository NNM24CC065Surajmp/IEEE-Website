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

import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import Join from './pages/Join.jsx';
import NotFound from './pages/NotFound.jsx';
import ProfilePage from './pages/ProfilePage.jsx';


function AppContent({ theme, toggleTheme }) {
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
      />


      {/* Main Content */}
      <main
        id="main"
        key={location.pathname}
        className="animate-page-fade relative z-10 flex-1"
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

          {/* Team */}
          <Route
            path="/team"
            element={<TeamPage onNavigate={navigateTo} />}
          />

          {/* Join */}
          <Route
            path="/join"
            element={<Join onNavigate={navigateTo} />}
          />

          {/* Profile */}
          <Route
            path="/profile"
            element={<ProfilePage onNavigate={navigateTo} />}
          />

          {/* 404 */}
          <Route
            path="*"
            element={<NotFound onNavigate={navigateTo} />}
          />

        </Routes>
      </main>


      {/* Footer */}
      <Footer onNavigate={navigateTo} />

    </div>
  );
}


export default function App() {

  // Theme state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('ieee_theme');

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return 'dark';
  });


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

      {/* Application */}
      <AppContent
        theme={theme}
        toggleTheme={toggleTheme}
      />

    </BrowserRouter>
  );
}
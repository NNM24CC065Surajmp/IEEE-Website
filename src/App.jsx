import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import TeamPage from './pages/TeamPage.jsx';
import Join from './pages/Join.jsx';
import NotFound from './pages/NotFound.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

function AppContent({ theme, toggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname === '/' ? 'home' : location.pathname.substring(1);

  // Bridges the existing components' API to use React Router under the hood
  const navigateTo = (pageId) => {
    navigate(pageId === 'home' ? '/' : `/${pageId}`);
  };

  return (
    <div className={`relative min-h-screen font-sans selection:bg-[#00629B] selection:text-white overflow-hidden flex flex-col justify-between antialiased transition-colors duration-300 ${
      theme === 'light'
        ? 'bg-slate-50 text-slate-900'
        : 'bg-[#05060A] text-zinc-100'
    }`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-ieee-blue focus:text-white focus:rounded-lg">
        Skip to content
      </a>

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

      <Navbar activePage={activePage} onNavigate={navigateTo} theme={theme} onToggleTheme={toggleTheme} />

      <main id="main" key={location.pathname} className="animate-page-fade relative z-10 flex-1">
        <Routes>
          <Route path="/" element={<HomePage onNavigate={navigateTo} />} />
          <Route path="/about" element={<AboutPage onNavigate={navigateTo} />} />
          <Route path="/events" element={<EventsPage onNavigate={navigateTo} />} />
          <Route path="/team" element={<TeamPage onNavigate={navigateTo} />} />
          <Route path="/join" element={<Join />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default function App() {
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

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent theme={theme} toggleTheme={toggleTheme} />
    </BrowserRouter>
  );
}

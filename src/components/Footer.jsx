import React from 'react';
import { Link } from 'react-router-dom';
import {
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Mail,
  ArrowUpRight,
} from 'lucide-react';
import { site } from '../data/site';

const SOCIAL_ICON_MAP = {
  Instagram,
  Linkedin,
  Github,
  Twitter,
};

export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  const handleNav = (id) => {
    onNavigate(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative pt-24 pb-8 overflow-hidden bg-white dark:bg-zinc-950">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-zinc-800 to-transparent" />
      
      <div className="section-container relative z-10">
        
        {/* Main Footer Content */}
        <div className="bg-slate-50 dark:bg-zinc-900/40 rounded-[2rem] border border-slate-200/60 dark:border-white/5 p-8 sm:p-12 md:p-16 mb-8 flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Brand Column */}
          <div className="flex-1 max-w-sm">
            <Link 
              to="/" 
              onClick={() => handleNav('home')}
              className="inline-block mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue rounded-full"
            >
              <div className="bg-white dark:bg-white rounded-full px-4 py-2 shadow-sm border border-slate-100 dark:border-transparent inline-flex items-center">
                <img 
                  src="/images/ieee-nmamit-logo-lockup.png" 
                  alt="IEEE NMAMIT" 
                  className="h-[20px] sm:h-[24px] object-contain" 
                />
              </div>
            </Link>
            <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-8 font-medium">
              Empowering students to innovate, build, and lead. We bridge the gap between academic theory and real-world engineering excellence.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {site.socials.map((social) => {
                const Icon = SOCIAL_ICON_MAP[social.name] || Github;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow on ${social.name}`}
                    className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/5 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-ieee-blue dark:hover:text-ieee-teal hover:border-ieee-blue/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue group"
                  >
                    <Icon size={16} className="group-hover:scale-110 transition-transform" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex-[2] grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-slate-900 dark:text-white mb-6">Explore</h4>
              <ul className="space-y-4">
                <li><Link to="/" onClick={() => handleNav('home')} className="text-sm text-slate-600 dark:text-zinc-400 hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors">Home</Link></li>
                <li><Link to="/about" onClick={() => handleNav('about')} className="text-sm text-slate-600 dark:text-zinc-400 hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors">About Us</Link></li>
                <li><Link to="/events" onClick={() => handleNav('events')} className="text-sm text-slate-600 dark:text-zinc-400 hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors">Events</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-slate-900 dark:text-white mb-6">Connect</h4>
              <ul className="space-y-4">
                <li><Link to="/team" onClick={() => handleNav('team')} className="text-sm text-slate-600 dark:text-zinc-400 hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors">Core Team</Link></li>
                <li><Link to="/join" onClick={() => handleNav('join')} className="text-sm text-slate-600 dark:text-zinc-400 hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors">Join Chapter</Link></li>
                <li>
                  <a href="mailto:ieee@nmamit.in" className="text-sm text-slate-600 dark:text-zinc-400 hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors inline-flex items-center gap-1 group">
                    Contact <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-slate-900 dark:text-white mb-6">Location</h4>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
                NMAM Institute of Technology<br/>
                Nitte, Karkala Taluk<br/>
                Udupi District, Karnataka<br/>
                India - 574110
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 text-xs font-medium text-slate-500 dark:text-zinc-500">
          <p>© {currentYear} IEEE NMAMIT Student Branch. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-800 dark:hover:text-zinc-300 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-800 dark:hover:text-zinc-300 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
}


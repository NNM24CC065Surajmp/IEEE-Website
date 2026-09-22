import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { site } from '../data/site';

const SOCIAL_ICON_MAP = {
  Instagram,
  Linkedin,
  Github,
  Twitter,
};

export default function Footer({ onNavigate }) {
  const currentYear = new Date().getFullYear();

  const handleNav = (target) => {
    if (onNavigate) {
      onNavigate(target);
    }
  };

  return (
    <footer className="bg-slate-100 dark:bg-ieee-surface py-14 border-t border-slate-200 dark:border-ieee-border relative z-10 transition-colors duration-300">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-[ieee-blue] dark:text-[ieee-teal] font-mono font-bold text-xs">
                IE
              </div>
              <span className="font-heading font-bold text-base text-slate-900 dark:text-white tracking-tight">
                {site.name}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-sm leading-relaxed mb-5 font-normal">
              {site.tagline}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5">
              {site.socials.map((social) => {
                const IconComp = SOCIAL_ICON_MAP[social.icon] || Github;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg border border-slate-300 dark:border-zinc-800 hover:border-[ieee-blue] dark:hover:border-[ieee-teal] bg-white dark:bg-zinc-900/60 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-[ieee-blue] dark:hover:text-[ieee-teal] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[ieee-blue]"
                    aria-label={social.label}
                  >
                    <IconComp size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-zinc-300 font-bold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-mono text-slate-600 dark:text-zinc-400">
              <li>
                <Link
                  to="/"
                  onClick={() => handleNav('home')}
                  className="hover:text-[ieee-blue] dark:hover:text-[ieee-teal] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[ieee-blue] rounded"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => handleNav('about')}
                  className="hover:text-[ieee-blue] dark:hover:text-[ieee-teal] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[ieee-blue] rounded"
                >
                  About Chapter
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  onClick={() => handleNav('events')}
                  className="hover:text-[ieee-blue] dark:hover:text-[ieee-teal] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[ieee-blue] rounded"
                >
                  Events & Labs
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  onClick={() => handleNav('team')}
                  className="hover:text-[ieee-blue] dark:hover:text-[ieee-teal] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[ieee-blue] rounded"
                >
                  Core Team
                </Link>
              </li>
              <li>
                <Link
                  to="/join"
                  onClick={() => handleNav('join')}
                  className="hover:text-[ieee-blue] dark:hover:text-[ieee-teal] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[ieee-blue] rounded"
                >
                  Join Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-zinc-300 font-bold mb-4">
              Contact Us
            </h4>
            <div className="space-y-2.5 text-xs font-mono text-slate-600 dark:text-zinc-400 leading-relaxed">
              {site.contact.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-slate-400 dark:text-zinc-500 shrink-0 mt-0.5" />
                  <span>{site.contact.address}</span>
                </div>
              )}
              {site.contact.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[ieee-blue] dark:text-[ieee-teal] shrink-0" />
                  <a
                    href={`mailto:${site.contact.email}`}
                    className="hover:text-[ieee-blue] dark:hover:text-[ieee-teal] transition-colors"
                  >
                    {site.contact.email}
                  </a>
                </div>
              )}
              {site.contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[ieee-blue] dark:text-[ieee-teal] shrink-0" />
                  <a
                    href={`tel:${site.contact.phone}`}
                    className="hover:text-[ieee-blue] dark:hover:text-[ieee-teal] transition-colors"
                  >
                    {site.contact.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500 dark:text-zinc-500">
          <p>© {currentYear} {site.name}. All rights reserved.</p>
          <p>Advancing Technology for Humanity.</p>
        </div>
      </div>
    </footer>
  );
}

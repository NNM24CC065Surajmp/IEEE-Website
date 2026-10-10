import React from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { prefersReducedMotion } from '../lib/motion';
import {
  Github,
  Linkedin,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
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

  const handleSocialHover = (e, isHover) => {
    if (window.matchMedia('(hover: none)').matches) return;

    if (!prefersReducedMotion()) {
      gsap.to(e.currentTarget, {
        scale: isHover ? 1.15 : 1,
        duration: 0.3,
        ease: 'back.out(2)',
      });
    }
  };

  const handleNav = (target) => {
    if (onNavigate) {
      onNavigate(target);
    }
  };

  return (
    <footer className="bg-slate-100 dark:bg-zinc-950 py-14 border-t border-slate-200 dark:border-white/5 relative z-10 transition-colors duration-300">
      <div className="section-container">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-12">

          {/* Column 1: Brand & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="bg-white rounded-full flex items-center justify-center w-[130px] h-[40px] shadow-sm"><img src="/images/ieee-nmamit-logo-lockup.png" alt="IEEE NMAMIT" className="h-[24px] w-auto object-contain" /></div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-sm leading-relaxed mb-5 font-normal">
              {site.tagline ||
                'Advancing Technology for Humanity. Empowering student engineers, coders, and researchers at NMAM Institute of Technology, Nitte.'}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5">
              {site.socials?.map((social) => {
                const IconComp =
                  SOCIAL_ICON_MAP[social.icon] || Github;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full active:scale-95 border border-slate-300 dark:border-zinc-800 hover:border-ieee-blue dark:hover:border-ieee-teal bg-white dark:bg-zinc-900/60 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ieee-blue"
                    aria-label={social.label}
                    onMouseEnter={(e) =>
                      handleSocialHover(e, true)
                    }
                    onMouseLeave={(e) =>
                      handleSocialHover(e, false)
                    }
                  >
                    <IconComp size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-zinc-300 font-bold mb-4">
              Navigation
            </h4>

            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-zinc-400">

              <li>
                <Link
                  to="/"
                  onClick={() => handleNav('home')}
                  className="hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ieee-blue rounded"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  onClick={() => handleNav('about')}
                  className="hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ieee-blue rounded"
                >
                  About Chapter
                </Link>
              </li>

              <li>
                <Link
                  to="/events"
                  onClick={() => handleNav('events')}
                  className="hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ieee-blue rounded"
                >
                  Events & Labs
                </Link>
              </li>

              <li>
                <Link
                  to="/team"
                  onClick={() => handleNav('team')}
                  className="hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ieee-blue rounded"
                >
                  Core Team
                </Link>
              </li>

              <li>
                <Link
                  to="/join"
                  onClick={() => handleNav('join')}
                  className="hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ieee-blue rounded"
                >
                  Join Us
                </Link>
              </li>

              <li>
                <Link
                  to="/profile"
                  onClick={() => handleNav('profile')}
                  className="hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ieee-blue rounded"
                >
                  Profile
                </Link>
              </li>

            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h4 className="text-sm font-semibold tracking-wide text-slate-900 dark:text-zinc-300 font-bold mb-4">
              Contact Us
            </h4>

            <div className="space-y-2.5 text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">

              {site.contact?.address && (
                <div className="flex items-start gap-2">
                  <MapPin
                    size={14}
                    className="text-slate-400 dark:text-zinc-500 shrink-0 mt-0.5"
                  />

                  <span>{site.contact.address}</span>
                </div>
              )}

              {site.contact?.email && (
                <div className="flex items-center gap-2">
                  <Mail
                    size={14}
                    className="text-ieee-blue dark:text-ieee-teal shrink-0"
                  />

                  <a
                    href={`mailto:${site.contact.email}`}
                    className="hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors"
                  >
                    {site.contact.email}
                  </a>
                </div>
              )}

              {site.contact?.phone && (
                <div className="flex items-center gap-2">
                  <Phone
                    size={14}
                    className="text-ieee-blue dark:text-ieee-teal shrink-0"
                  />

                  <a
                    href={`tel:${site.contact.phone}`}
                    className="hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors"
                  >
                    {site.contact.phone}
                  </a>
                </div>
              )}

              {/* Fallback contact information */}
              {!site.contact?.address &&
                !site.contact?.email &&
                !site.contact?.phone && (
                  <>
                    <p>NMAM Institute of Technology</p>
                    <p>Nitte, Karkala Taluk, Udupi - 574110</p>

                    <p className="text-[#00629B] dark:text-[#0096D6] font-semibold pt-1">
                      ieee@nmamit.in
                    </p>
                  </>
                )}

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-zinc-500">
          <p>
            © {currentYear}{' '}
            {site.name || 'IEEE NMAMIT Student Branch'}. All rights reserved.
          </p>

          <p>Advancing Technology for Humanity.</p>
        </div>

      </div>
    </footer>
  );
}






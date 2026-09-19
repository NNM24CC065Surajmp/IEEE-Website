import React from 'react';
import { Github, Linkedin, Instagram, Twitter } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-100 dark:bg-[#040507] py-14 border-t border-slate-200 dark:border-zinc-900 relative z-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-[#0096D6] font-mono font-bold text-[10px]">
                IE
              </div>
              <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                IEEE Student Branch NMAMIT
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 max-w-sm leading-relaxed mb-5 font-normal">
              Advancing Technology for Humanity. Empowering student engineers, coders, and researchers at NMAM Institute of Technology, Nitte.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5">
              
              <a
                href="https://www.linkedin.com/company/ieee-nmamit"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded border border-slate-300 dark:border-zinc-800 hover:border-[#00629B] dark:hover:border-zinc-600 bg-white dark:bg-zinc-900/60 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-[#00629B] dark:hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={14} />
              </a>
              <a
                href="https://www.instagram.com/ieee.nmamit?stkn=MWJkYXVwZDR6dDRrbQ=="
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded border border-slate-300 dark:border-zinc-800 hover:border-[#00629B] dark:hover:border-zinc-600 bg-white dark:bg-zinc-900/60 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-[#00629B] dark:hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={14} />
              </a>
              
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-zinc-300 font-bold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-mono text-slate-600 dark:text-zinc-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#00629B] dark:hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#00629B] dark:hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('events')}
                  className="hover:text-[#00629B] dark:hover:text-white transition-colors"
                >
                  Events & Labs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('team')}
                  className="hover:text-[#00629B] dark:hover:text-white transition-colors"
                >
                  Core Team
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-zinc-300 font-bold mb-4">
              Location & Contact
            </h4>
            <div className="space-y-2.5 text-xs font-mono text-slate-600 dark:text-zinc-400 leading-relaxed">
              <p>NMAM Institute of Technology</p>
              <p>Nitte, Karkala Taluk, Udupi - 574110</p>
              <p className="text-[#00629B] dark:text-[#0096D6] font-semibold pt-1">
                ieee@nmamit.in
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} IEEE NMAMIT Student Branch. STB-94821.</p>
          <p>Built for Engineers & Innovators.</p>
        </div>
      </div>
    </footer>
  );
}

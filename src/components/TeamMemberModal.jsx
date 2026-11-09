import React, { useEffect, useRef } from 'react';
import { X, Briefcase, Building2, Calendar, Mail, Quote } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { getLenis } from '../lib/smoothScroll.js';

const SocialButton = ({ icon: Icon, href, label }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 hover:text-[#00629B] dark:hover:text-[#38bdf8] hover:border-[#00629B]/30 dark:hover:border-[#38bdf8]/30 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group"
    >
      <Icon size={18} className="group-hover:scale-110 transition-transform duration-200" />
    </a>
  );
};

export default function TeamMemberModal({ 
  member, 
  theme, 
  imageUrl, 
  formattedDeptYear,
  linkedinUrl,
  githubUrl,
  emailUrl,
  onClose 
}) {
  const scrollContainerRef = useRef(null);

  // Lock body scroll, pause Lenis smooth scroll, and bind Escape key
  useEffect(() => {
    if (!member) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const lenis = getLenis();
    lenis?.stop();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      lenis?.start();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [member, onClose]);

  if (!member) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 cursor-pointer backdrop-blur-md"
      style={{ 
        perspective: '1500px',
        animation: 'backdropFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' 
      }}
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
        className="cursor-default relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),_0_0_30px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col md:flex-row max-h-[92vh] md:max-h-[85vh] overscroll-contain"
        style={{ 
          animation: 'modalEntry3D 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-50 p-2 rounded-full border border-slate-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-zinc-600 transition-colors shadow-sm"
          style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.5s', opacity: 0 }}
          aria-label="Close profile modal"
        >
          <X size={20} className="pointer-events-none" />
        </button>

        {/* LEFT COLUMN: Photo (Full Bleed) */}
        <div className="w-full md:w-[42%] relative shrink-0 h-[240px] sm:h-[300px] md:h-auto overflow-hidden bg-slate-100 dark:bg-zinc-800">
          <img
            src={imageUrl}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ animation: 'imageReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.1s', opacity: 0 }}
          />
          {/* Gradient Overlay for bottom depth */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-10" />
        </div>

        {/* RIGHT COLUMN: Content (Isolated scroll area) */}
        <div
          ref={scrollContainerRef}
          data-lenis-prevent="true"
          tabIndex={0}
          className="w-full md:w-[58%] p-5 sm:p-6 md:p-8 flex flex-col relative z-20 flex-1 overflow-y-auto overscroll-contain modal-custom-scroll focus:outline-none"
        >
          
          {/* Header section */}
          <div className="mb-4" style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.2s', opacity: 0 }}>
            <span className="block text-xs font-mono uppercase tracking-widest text-ieee-blue dark:text-ieee-teal font-bold mb-1">
              {member.division}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-2 font-heading">
              {member.name}
            </h2>
            <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 ${theme?.roleText || 'text-[#00629B] dark:text-[#38bdf8]'} shadow-sm`}>
              <Briefcase size={13} />
              <span>{member.role}</span>
            </div>
          </div>

          {/* Department & Year */}
          <div className="flex flex-col gap-1.5 text-[0.8rem] text-slate-600 dark:text-zinc-300 mb-4 font-medium" style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.3s', opacity: 0 }}>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                <Building2 size={13} className="text-slate-400 dark:text-zinc-500" />
              </div>
              <span>{member.dept}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                <Calendar size={13} className="text-slate-400 dark:text-zinc-500" />
              </div>
              <span>{member.year}</span>
            </div>
          </div>

          {/* Bio section */}
          <div className="mb-4 max-w-prose" style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.4s', opacity: 0 }}>
            <h4 className="text-xs font-mono uppercase tracking-widest text-ieee-blue dark:text-ieee-teal font-bold mb-1.5 flex items-center gap-2">
              Executive Overview &amp; Focus
            </h4>
            <p className="text-[0.8rem] text-slate-700 dark:text-zinc-300 leading-relaxed">
              {member.bio}
            </p>
          </div>

          {/* Quote Pull-out */}
          {member.quote && member.quote.trim() !== '' && member.quote.trim().toLowerCase() !== 'nothing' && (
            <div className="mb-4 relative pl-3 sm:pl-4 max-w-prose" style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.5s', opacity: 0 }}>
              <div className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full bg-[#00629B] dark:bg-[#38bdf8] opacity-80" />
              <Quote size={16} className="absolute -left-1.5 -top-1.5 text-[#00629B] dark:text-[#38bdf8] opacity-10" />
              <p className="text-[0.85rem] font-medium text-slate-800 dark:text-zinc-200 leading-snug">
                "{member.quote}"
              </p>
            </div>
          )}

          {/* Socials Row */}
          <div className="mt-auto pt-2 flex items-center gap-2" style={{ animation: 'textCascade 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards 0.6s', opacity: 0 }}>
            <SocialButton icon={FaLinkedin} href={linkedinUrl} label="LinkedIn" />
            <SocialButton icon={FaGithub} href={githubUrl} label="GitHub" />
            <SocialButton icon={Mail} href={emailUrl} label="Email" />
          </div>

        </div>
      </div>
    </div>
  );
}



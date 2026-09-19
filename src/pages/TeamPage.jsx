import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Linkedin,
  Github,
  Instagram,
  Mail,
  ExternalLink,
  Award,
  ArrowRight,
  ShieldCheck,
  Building2,
  BookOpen,
} from 'lucide-react';

const CORE_TEAM_MEMBERS = [
  {
    id: 'adithya-rao',
    name: 'Adithya Rao',
    role: 'President',
    division: 'Executive Committee',
    dept: 'Computer Science & Engineering',
    year: 'Final Year',
    memberId: 'IEEE STB-94821',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    bio: 'Oversees branch operations, strategic collaborations with IEEE Bangalore Section, and annual flagship conferences. Passionate about systems architecture and distributed computing.',
    skills: ['Strategic Planning', 'Distributed Systems', 'Team Leadership', 'Community Building'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'president.ieee@nmamit.in',
    },
  },
  {
    id: 'sneha-shenoy',
    name: 'Sneha Shenoy',
    role: 'Vice President',
    division: 'Executive Committee',
    dept: 'Information Science & Engineering',
    year: 'Final Year',
    memberId: 'IEEE STB-94822',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    bio: 'Directs society integration across CS, RAS, and WIE chapters. Focused on industry sponsorship and student research symposiums.',
    skills: ['Operations', 'Industry Outreach', 'Full Stack', 'Symposium Lead'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'vp.ieee@nmamit.in',
    },
  },
  {
    id: 'rohan-kulkarni',
    name: 'Rohan Kulkarni',
    role: 'Secretary',
    division: 'Executive Committee',
    dept: 'Electronics & Communication',
    year: '3rd Year',
    memberId: 'IEEE STB-94823',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Maintains official branch documentations, Section communications, and compliance with IEEE vTools reporting guidelines.',
    skills: ['Documentation', 'vTools Reporting', 'Embedded C', 'Operations'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'secretary.ieee@nmamit.in',
    },
  },
  {
    id: 'pooja-hegde',
    name: 'Pooja Hegde',
    role: 'Treasurer',
    division: 'Executive Committee',
    dept: 'Computer Science & Engineering',
    year: '3rd Year',
    memberId: 'IEEE STB-94824',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    bio: 'Manages financial auditing, annual grant disbursements from IEEE HQ, and workshop budget management for student activities.',
    skills: ['Budgeting', 'Grant Writing', 'Auditing', 'Financial Planning'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'treasurer.ieee@nmamit.in',
    },
  },
  {
    id: 'varun-nayak',
    name: 'Varun Nayak',
    role: 'Joint Secretary',
    division: 'Executive Committee',
    dept: 'Information Science & Engineering',
    year: '3rd Year',
    memberId: 'IEEE STB-94825',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    bio: 'Assists with intra-college committee alignment, venue logistics, and coordinating member recruitment drives.',
    skills: ['Logistics', 'Event Coordination', 'Student Engagement', 'Python'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'jointsec.ieee@nmamit.in',
    },
  },
  {
    id: 'ananya-bhat',
    name: 'Ananya Bhat',
    role: 'Computer Society Chair',
    division: 'Computer Society Chapter',
    dept: 'Computer Science & Engineering',
    year: 'Final Year',
    memberId: 'IEEE STB-94826',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    bio: 'Leads weekly algorithmic problem-solving labs, open-source sprints, and coordinates team entries for global coding competitions.',
    skills: ['Algorithms', 'C++', 'System Design', 'Hackathon Lead'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'cs.chair@nmamit.in',
    },
  },
  {
    id: 'karthik-pai',
    name: 'Karthik Pai',
    role: 'Robotics Society Chair',
    division: 'Robotics & Automation Chapter',
    dept: 'Mechanical Engineering',
    year: 'Final Year',
    memberId: 'IEEE STB-94827',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    bio: 'Drives hands-on autonomous robotics labs, ROS simulation workshops, and CAD/hardware fabrication sessions.',
    skills: ['ROS2', 'SolidWorks', 'Mechatronics', 'Microcontrollers'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'ras.chair@nmamit.in',
    },
  },
  {
    id: 'divya-shetty',
    name: 'Divya Shetty',
    role: 'WIE Affinity Chair',
    division: 'Women in Engineering Group',
    dept: 'Artificial Intelligence & Data Science',
    year: '3rd Year',
    memberId: 'IEEE STB-94828',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    bio: 'Organizes school STEM outreach drives, women leadership symposiums, and data science bootcamps for undergraduate students.',
    skills: ['Data Science', 'PyTorch', 'Outreach Lead', 'Mentorship'],
    socials: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      instagram: 'https://instagram.com',
      email: 'wie.chair@nmamit.in',
    },
  },
];

export default function TeamPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  const touchStartRef = useRef(null);
  const wheelAccumulator = useRef(0);
  const wheelTimeout = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, CORE_TEAM_MEMBERS.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToIndex = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedMember) {
        if (e.key === 'Escape') {
          setSelectedMember(null);
        }
        return;
      }
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, selectedMember]);

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStartRef.current - touchEnd;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartRef.current = null;
  };

  useEffect(() => {
    if (selectedMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedMember]);

  const handleWheel = (e) => {
    if (selectedMember) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 15) {
      wheelAccumulator.current += e.deltaX;

      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);

      if (Math.abs(wheelAccumulator.current) > 50) {
        if (wheelAccumulator.current > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        wheelAccumulator.current = 0;
      }

      wheelTimeout.current = setTimeout(() => {
        wheelAccumulator.current = 0;
      }, 150);
    }
  };

  const handleCardClick = (member, index) => {
    setCurrentIndex(index);
    setSelectedMember(member);
  };

  const activeMember = CORE_TEAM_MEMBERS[currentIndex];

  return (
    <div className="pt-28 sm:pt-36 pb-20 select-none">
      {/* Page Header */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-4 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0096D6]" />
          EXECUTIVE COMMITTEE & LEADS · 2025–2026
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          The Engineers Behind IEEE NMAMIT
        </h1>
      </section>

      {/* 3D Barrel Carousel Stage */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className="relative w-full max-w-6xl mx-auto h-[320px] sm:h-[360px] flex items-center justify-center my-4"
        style={{ perspective: isMobile ? '850px' : '1200px' }}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute left-4 sm:left-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
            currentIndex === 0
              ? 'border-slate-300/50 dark:border-zinc-800/50 bg-slate-200/30 dark:bg-zinc-900/30 text-slate-400 dark:text-zinc-600 cursor-not-allowed'
              : 'border-slate-300 dark:border-zinc-700/80 bg-white/90 dark:bg-zinc-900/90 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:border-[#00629B] hover:shadow-[0_0_20px_rgba(0,98,155,0.4)] active:scale-95'
          }`}
          aria-label="Previous member"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentIndex === CORE_TEAM_MEMBERS.length - 1}
          className={`absolute right-4 sm:right-8 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer ${
            currentIndex === CORE_TEAM_MEMBERS.length - 1
              ? 'border-slate-300/50 dark:border-zinc-800/50 bg-slate-200/30 dark:bg-zinc-900/30 text-slate-400 dark:text-zinc-600 cursor-not-allowed'
              : 'border-slate-300 dark:border-zinc-700/80 bg-white/90 dark:bg-zinc-900/90 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:border-[#00629B] hover:shadow-[0_0_20px_rgba(0,98,155,0.4)] active:scale-95'
          }`}
          aria-label="Next member"
        >
          <ChevronRight size={22} />
        </button>

        {/* 3D Drum Container */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {CORE_TEAM_MEMBERS.map((member, index) => {
            const offset = index - currentIndex;

            if (Math.abs(offset) > 4) return null;

            const angleStep = isMobile ? 22 : 18;
            const spacingStep = isMobile ? 180 : 255;
            const depthStep = isMobile ? 65 : 85;
            const scaleStep = isMobile ? 0.08 : 0.06;

            const rotateY = -offset * angleStep;
            const translateX = offset * spacingStep;
            const translateZ = -Math.abs(offset) * depthStep;
            const scale = Math.max(0.7, 1 - Math.abs(offset) * scaleStep);
            const opacity = Math.max(0.2, 1 - Math.abs(offset) * 0.22);
            const isCenter = offset === 0;

            return (
              <div
                key={member.id}
                onClick={() => handleCardClick(member, index)}
                className={`absolute cursor-pointer transition-all duration-300 ease-out will-change-transform ${
                  isCenter ? 'z-30' : 'z-10'
                }`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  transformOrigin: 'center center',
                  opacity: opacity,
                }}
              >
                {/* The Profile Card */}
                <div
                  className={`relative w-[310px] sm:w-[380px] h-[195px] sm:h-[230px] rounded-xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg ${
                    isCenter
                      ? 'bg-white dark:bg-[#0a0d16] border-2 border-[#00629B] shadow-[0_0_35px_rgba(0,98,155,0.25)] ring-1 ring-[#00629B]/30'
                      : 'bg-slate-100/90 dark:bg-[#080a11]/90 border border-slate-300 dark:border-zinc-800/90 hover:border-slate-400 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="absolute right-[-10px] bottom-[-10px] text-slate-300/40 dark:text-zinc-800/15 pointer-events-none">
                    <ShieldCheck size={120} />
                  </div>

                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={member.image}
                          alt={member.name}
                          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border transition-colors ${
                            isCenter
                              ? 'border-[#00629B] shadow-sm shadow-[#00629B]/50'
                              : 'border-slate-300 dark:border-zinc-700'
                          }`}
                          loading="lazy"
                        />
                        {isCenter && (
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00629B] border-2 border-white dark:border-[#0a0d16] flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0096D6]" />
                          </span>
                        )}
                      </div>

                      <div>
                        <h3
                          className={`font-bold tracking-tight text-base sm:text-lg transition-colors leading-tight ${
                            isCenter ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-zinc-200'
                          }`}
                        >
                          {member.name}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 mt-0.5 truncate max-w-[170px]">
                          {member.dept}
                        </p>
                        <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                          {member.year}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border whitespace-nowrap font-semibold ${
                        isCenter
                          ? 'border-[#00629B]/70 bg-[#00629B]/15 text-[#00629B] dark:text-[#5db4e8]'
                          : 'border-slate-300 dark:border-zinc-800 bg-slate-200/60 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400'
                      }`}
                    >
                      {member.division}
                    </span>
                  </div>

                  <div className="relative z-10 pt-3 border-t border-slate-200 dark:border-zinc-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Award
                        size={14}
                        className={isCenter ? 'text-[#00629B] dark:text-[#5db4e8]' : 'text-slate-400 dark:text-zinc-500'}
                      />
                      <span
                        className={`text-xs font-semibold tracking-wide ${
                          isCenter ? 'text-slate-900 dark:text-zinc-100' : 'text-slate-600 dark:text-zinc-400'
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-zinc-200">
                      <span>Details</span>
                      <ArrowRight size={11} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Position Indicator Below Barrel */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-slate-500 dark:text-zinc-400">INDEX</span>
          <span className="text-slate-900 dark:text-white font-bold tracking-wider px-2.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 shadow-sm">
            {String(currentIndex + 1).padStart(2, '0')} / {String(CORE_TEAM_MEMBERS.length).padStart(2, '0')}
          </span>
          <span className="text-slate-400 dark:text-zinc-400 hidden sm:inline">·</span>
          <span className="text-[#00629B] dark:text-[#5db4e8] font-semibold hidden sm:inline">
            {activeMember?.role}
          </span>
        </div>

        <div className="flex items-center gap-1.5 max-w-[85vw] overflow-x-auto py-1 px-2 no-scrollbar">
          {CORE_TEAM_MEMBERS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToIndex(i)}
              aria-label={`Jump to ${CORE_TEAM_MEMBERS[i].name}`}
              className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                i === currentIndex
                  ? 'w-6 bg-[#00629B] dark:bg-[#5db4e8]'
                  : 'w-1.5 bg-slate-300 dark:bg-zinc-800 hover:bg-slate-400 dark:hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Modal Profile Zoom */}
      {selectedMember && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-slate-900/60 dark:bg-black/85 animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#0a0d16] border border-slate-300 dark:border-zinc-700/80 p-6 sm:p-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#00629B]/15 rounded-full blur-3xl pointer-events-none" />

            <button
              type="button"
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 p-2 rounded-lg border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900/80 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-zinc-600 transition-colors cursor-pointer"
              aria-label="Close profile modal"
            >
              <X size={18} />
            </button>

            <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative shrink-0">
                <img
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl object-cover border-2 border-[#00629B] shadow-lg shadow-[#00629B]/30"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 whitespace-nowrap font-bold">
                  {selectedMember.memberId}
                </span>
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#00629B] dark:text-[#5db4e8] uppercase mb-1 font-bold">
                  <span>{selectedMember.division}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {selectedMember.name}
                </h2>
                <div className="text-sm font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5 mt-0.5">
                  <Award size={15} className="text-[#00629B] dark:text-[#5db4e8]" />
                  <span>{selectedMember.role}</span>
                </div>

                <div className="mt-2 text-xs font-mono text-slate-600 dark:text-zinc-400 space-y-0.5">
                  <p className="flex items-center gap-1.5">
                    <Building2 size={12} className="text-slate-400 dark:text-zinc-500" />
                    <span>{selectedMember.dept}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <BookOpen size={12} className="text-slate-400 dark:text-zinc-500" />
                    <span>{selectedMember.year}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-5 border-t border-slate-200 dark:border-zinc-800/80">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 font-bold">
                Executive Overview & Focus
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-normal">
                {selectedMember.bio}
              </p>
            </div>

            <div className="relative z-10 mt-5">
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2 font-bold">
                Focus Areas & Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedMember.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-5 border-t border-slate-200 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <a
                  href={selectedMember.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 hover:bg-[#00629B] hover:border-transparent flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={15} />
                </a>
                <a
                  href={selectedMember.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 hover:bg-[#00629B] hover:border-transparent flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={15} />
                </a>
                <a
                  href={selectedMember.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 hover:bg-[#00629B] hover:border-transparent flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={15} />
                </a>
                <a
                  href={`mailto:${selectedMember.socials.email}`}
                  className="w-9 h-9 rounded-lg border border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 hover:bg-[#00629B] hover:border-transparent flex items-center justify-center text-slate-600 dark:text-zinc-300 hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <Mail size={15} />
                </a>
              </div>

              <a
                href={`mailto:${selectedMember.socials.email}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#00629B] hover:bg-[#0077b6] text-white text-xs font-mono uppercase tracking-wider font-semibold transition-colors shadow-md"
              >
                <span>Connect via Email</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

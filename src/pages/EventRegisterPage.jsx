import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
  Ticket,
  Printer,
  Share2,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { EVENTS_DATA } from '../data/events.js';
import { parseNmamitUsn, BRANCH_CODES } from '../lib/nmamitId.js';
import Reveal from '../components/Reveal';

const BRANCH_OPTIONS = [
  'Computer Science and Engineering (CSE)',
  'Information Science and Engineering (ISE)',
  'Artificial Intelligence and Machine Learning (AIML)',
  'Artificial Intelligence and Data Science (AIDS)',
  'Electronics and Communication Engineering (ECE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CIVIL)',
  'Biotechnology Engineering (BT)',
  'Robotics and Artificial Intelligence (RAI)',
  'Computer and Communication Engineering (CCE)',
  'Cyber Security (CY)',
  'Master of Computer Applications (MCA)',
  'Other Engineering / Science'
];

const YEAR_OPTIONS = [
  '1st Year (First Year / BE)',
  '2nd Year (Sophomore / BE)',
  '3rd Year (Pre-Final / BE)',
  '4th Year (Final Year / BE)',
  'Post-Graduate (M.Tech / MCA / PhD)'
];

function formatDisplayDate(dateString) {
  if (!dateString) return 'Date TBA';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function EventRegisterPage({ onNavigate, authUser }) {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Find the event by id
  const event = useMemo(() => {
    return EVENTS_DATA.find(
      (e) => String(e.id).toLowerCase() === String(eventId).toLowerCase()
    );
  }, [eventId]);

  // Form State
  const [formData, setFormData] = useState({
    name: authUser?.displayName || authUser?.name || '',
    usn: authUser?.usn || '',
    year: authUser?.year || '',
    branch: authUser?.branch || '',
    email: authUser?.email || '',
    phone: '',
    isIeeeMember: Boolean(authUser?.membershipId),
    membershipId: authUser?.membershipId || ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);

  // Check if previously registered for this event in localStorage
  useEffect(() => {
    if (!eventId) return;
    try {
      const stored = localStorage.getItem('ieee_registered_events');
      if (stored) {
        const registrations = JSON.parse(stored);
        const existing = registrations.find(
          (r) => String(r.eventId).toLowerCase() === String(eventId).toLowerCase()
        );
        if (existing) {
          setTicketDetails(existing);
          setIsSuccess(true);
        }
      }
    } catch {
      // ignore
    }
  }, [eventId]);

  // Auto-detect branch and year from USN when typed
  const handleUsnChange = (val) => {
    const uppercaseVal = val.toUpperCase().trim();
    setFormData((prev) => {
      const next = { ...prev, usn: uppercaseVal };
      const parsed = parseNmamitUsn(uppercaseVal);
      if (parsed) {
        if (!prev.year && parsed.yearLabel) {
          // Map to dropdown value
          const matchedYear = YEAR_OPTIONS.find((y) =>
            y.toLowerCase().includes(parsed.yearLabel.toLowerCase().replace(/[^a-z0-9]/g, ''))
          );
          if (matchedYear) next.year = matchedYear;
        }
        if (!prev.branch && parsed.branchName) {
          const matchedBranch = BRANCH_OPTIONS.find((b) =>
            b.toLowerCase().includes(parsed.branchName.toLowerCase()) ||
            b.toLowerCase().includes(parsed.branchCode.toLowerCase())
          );
          if (matchedBranch) next.branch = matchedBranch;
        }
      }
      return next;
    });

    if (errors.usn) {
      validateField('usn', uppercaseVal);
    }
  };

  // Field validation logic
  const validateField = (field, value) => {
    let err = '';
    const trimmed = typeof value === 'string' ? value.trim() : value;

    switch (field) {
      case 'name':
        if (!trimmed) {
          err = 'Full name is required';
        } else if (trimmed.length < 2) {
          err = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) {
          err = 'Name should only contain letters and standard characters';
        }
        break;

      case 'usn':
        if (!trimmed) {
          err = 'USN (University Seat Number) is required';
        } else {
          const usnClean = trimmed.replace(/\s+/g, '').toUpperCase();
          // College format check: 4NM, NN, NNM or standard 10-char USN
          const isValidCollegeUsn = /^(?:4NM|NNM|NN)\d{2}[A-Z]{2,5}\d{2,4}$/i.test(usnClean);
          const isGenericUsn = /^[0-9A-Z]{8,12}$/i.test(usnClean);
          if (!isValidCollegeUsn && !isGenericUsn) {
            err = 'Enter a valid USN (e.g., 4NM22CS001, NN25CSE021)';
          }
        }
        break;

      case 'year':
        if (!trimmed) {
          err = 'Please select your current year of study';
        }
        break;

      case 'branch':
        if (!trimmed) {
          err = 'Please select your branch / department';
        }
        break;

      case 'email':
        if (!trimmed) {
          err = 'College or primary email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          err = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (trimmed && !/^\d{10}$/.test(trimmed.replace(/\D/g, ''))) {
          err = 'Phone number must be 10 digits';
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: err }));
    return err;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      validateField(field, value);
    }
  };

  // Validate entire form
  const validateForm = () => {
    const fieldsToValidate = ['name', 'usn', 'year', 'branch', 'email'];
    const newErrors = {};
    fieldsToValidate.forEach((f) => {
      const err = validateField(f, formData[f]);
      if (err) newErrors[f] = err;
    });

    if (formData.phone) {
      const phoneErr = validateField('phone', formData.phone);
      if (phoneErr) newErrors.phone = phoneErr;
    }

    setTouched({
      name: true,
      usn: true,
      year: true,
      branch: true,
      email: true,
      phone: true
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const ticketId = `IEEE-${event?.category?.toUpperCase().slice(0, 3) || 'EVT'}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const registrationRecord = {
      ticketId,
      eventId: event?.id || eventId,
      eventTitle: event?.title || 'IEEE Event',
      eventDate: event?.date || new Date().toISOString(),
      eventVenue: event?.venue || 'NMAMIT Campus',
      eventTime: event?.time || 'TBA',
      eventCategory: event?.category || 'Workshop',
      name: formData.name.trim(),
      usn: formData.usn.trim().toUpperCase(),
      year: formData.year,
      branch: formData.branch,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      isIeeeMember: formData.isIeeeMember,
      membershipId: formData.membershipId.trim(),
      registeredAt: new Date().toISOString()
    };

    try {
      // Optional: Post to backend server if reachable
      try {
        await fetch(`/api/events/${eventId}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationRecord)
        });
      } catch {
        // Safe fallback for local/offline execution
      }

      // Persist in localStorage
      let existingList = [];
      try {
        const stored = localStorage.getItem('ieee_registered_events');
        if (stored) existingList = JSON.parse(stored);
      } catch {
        // ignore
      }

      const updated = [registrationRecord, ...existingList.filter((r) => r.eventId !== eventId)];
      localStorage.setItem('ieee_registered_events', JSON.stringify(updated));

      // Simulate network response latency for smooth UX
      await new Promise((resolve) => setTimeout(resolve, 600));

      setTicketDetails(registrationRecord);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: 'Failed to complete registration. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // If event not found
  if (!event) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
          Event Not Found
        </h1>
        <p className="text-slate-600 dark:text-zinc-400 max-w-md mb-8">
          The event requested could not be identified or might have been relocated in the active catalog.
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ieee-blue dark:bg-ieee-teal text-white dark:text-black font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          <ArrowLeft size={16} />
          <span>Return to Events Directory</span>
        </Link>
      </div>
    );
  }

  const imageUrl = event.image || event.poster || event.posterImage;

  return (
    <div className="relative min-h-screen pt-28 sm:pt-36 pb-24 overflow-hidden selection:bg-ieee-blue/20 isolate z-10">
      {/* Background glow effects */}
      <div className="absolute top-20 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-ieee-blue/15 via-[#0096D6]/10 to-transparent blur-[140px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute bottom-20 right-1/4 translate-x-1/2 w-[450px] h-[450px] bg-gradient-to-br from-ieee-teal/15 via-transparent to-transparent blur-[130px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 hover:text-ieee-blue dark:hover:text-ieee-teal transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Events</span>
          </Link>
        </div>

        {/* =========================================================================
            SUCCESS SCREEN (Successfully Registered)
           ========================================================================= */}
        {isSuccess && ticketDetails ? (
          <Reveal>
            <div className="max-w-3xl mx-auto">
              {/* Confirmed Banner */}
              <div className="relative rounded-3xl bg-white/80 dark:bg-zinc-900/90 backdrop-blur-2xl border border-emerald-500/30 dark:border-emerald-500/20 shadow-2xl overflow-hidden p-6 sm:p-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mb-6 mx-auto">
                  <CheckCircle2 size={36} className="animate-pulse" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
                  <Sparkles size={12} />
                  <span>Registration Confirmed</span>
                </div>

                <h1 className="font-heading font-black text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight mb-3">
                  Successfully Registered!
                </h1>
                <p className="text-slate-600 dark:text-zinc-300 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
                  Your seat for <strong className="text-slate-900 dark:text-white font-semibold">{ticketDetails.eventTitle}</strong> has been secured. Your digital entry pass is generated below.
                </p>

                {/* Digital Ticket Pass Card */}
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white rounded-2xl border border-amber-500/30 p-6 sm:p-8 text-left shadow-2xl overflow-hidden mb-8">
                  {/* Decorative circuit pattern overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(#00629B_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
                  
                  {/* Ticket Header */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ieee-teal block mb-1">
                        IEEE Student Branch NMAMIT · Pass #{ticketDetails.ticketId.slice(-6)}
                      </span>
                      <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
                        {ticketDetails.eventTitle}
                      </h3>
                    </div>
                    <div className="shrink-0 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                      Confirmed Entry
                    </div>
                  </div>

                  {/* Ticket Body / Student Credentials */}
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-5 py-6 border-b border-white/10 text-xs font-mono">
                    <div>
                      <span className="text-slate-400 uppercase tracking-wider block text-[10px] mb-1">Participant Name</span>
                      <span className="text-white font-bold text-sm">{ticketDetails.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase tracking-wider block text-[10px] mb-1">University Seat Number (USN)</span>
                      <span className="text-ieee-teal font-bold text-sm">{ticketDetails.usn}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase tracking-wider block text-[10px] mb-1">Department / Branch</span>
                      <span className="text-slate-200">{ticketDetails.branch}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 uppercase tracking-wider block text-[10px] mb-1">Academic Year</span>
                      <span className="text-slate-200">{ticketDetails.year}</span>
                    </div>
                  </div>

                  {/* Ticket Event Schedule */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-6 text-xs text-slate-300 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-ieee-teal" />
                      <span>{formatDisplayDate(ticketDetails.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-ieee-teal" />
                      <span>{ticketDetails.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-ieee-teal" />
                      <span>{ticketDetails.eventVenue}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-widest hover:bg-ieee-blue dark:hover:bg-ieee-teal transition-colors shadow-md"
                  >
                    <Printer size={14} />
                    <span>Print / Save Pass</span>
                  </button>

                  <Link
                    to="/events"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors border border-slate-200 dark:border-zinc-700"
                  >
                    <span>Browse More Events</span>
                  </Link>

                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-transparent text-ieee-blue dark:text-ieee-teal font-bold text-xs uppercase tracking-widest hover:underline"
                  >
                    <span>Go to Profile</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        ) : (
          /* =========================================================================
              EVENT DETAILS & REGISTRATION FORM TWO-COLUMN LAYOUT
             ========================================================================= */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN: Detailed Event Info */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <Reveal>
                <div className="relative rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl">
                  {/* Event Visual / Poster */}
                  <div className="relative w-full aspect-[16/10] bg-slate-900 overflow-hidden">
                    {imageUrl && imageUrl !== 'null' ? (
                      <img
                        src={imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-ieee-blue/40 via-slate-900 to-[#0A1224] flex items-center justify-center p-6 text-center">
                        <Calendar size={48} className="text-ieee-teal/60 mb-2" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Category Badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {event.category || 'Workshop'}
                      </span>
                    </div>
                  </div>

                  {/* Event Details Content */}
                  <div className="p-6 sm:p-8">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] font-bold text-ieee-blue dark:text-ieee-teal block mb-2">
                      Event Overview
                    </span>
                    <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight mb-4">
                      {event.title}
                    </h2>

                    {/* Meta list */}
                    <div className="flex flex-col gap-3 py-4 border-y border-slate-100 dark:border-white/5 text-xs text-slate-600 dark:text-zinc-300 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-ieee-blue dark:text-ieee-teal">
                          <Calendar size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-400 block">Date</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{formatDisplayDate(event.date)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-ieee-blue dark:text-ieee-teal">
                          <Clock size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-400 block">Time</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{event.time || '10:00 AM IST'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-ieee-blue dark:text-ieee-teal">
                          <MapPin size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-400 block">Venue</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{event.venue || 'NMAMIT Campus'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-5">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold mb-2">
                        About This Event
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                        {event.description || event.shortDescription || 'Join us for this IEEE NMAMIT technical session and hands-on experience.'}
                      </p>
                    </div>

                    {/* Benefits Checklist */}
                    <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block mb-3">
                        What Attendees Receive
                      </span>
                      <ul className="space-y-2 text-xs text-slate-600 dark:text-zinc-300">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          <span>Official IEEE Student Branch Participation Certificate</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          <span>Interactive practical hands-on session & mentoring</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          <span>Activity points eligible for college accreditation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* RIGHT COLUMN: Registration Form */}
            <div className="lg:col-span-7">
              <Reveal delay={150}>
                <div className="rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-6 sm:p-10 shadow-2xl">
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-ieee-blue/10 dark:bg-ieee-teal/10 text-ieee-blue dark:text-ieee-teal border border-ieee-blue/20 dark:border-ieee-teal/20 mb-3">
                      <Ticket size={12} />
                      <span>Registration Portal</span>
                    </div>
                    <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
                      Attendee Registration
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
                      Please enter your student details accurately to reserve your seat and generate your entry slip.
                    </p>
                  </div>

                  {errors.submit && (
                    <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{errors.submit}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* 1. Full Name */}
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider font-bold text-slate-700 dark:text-zinc-300 mb-2">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleChange('name', e.target.value)}
                          onBlur={() => handleBlur('name')}
                          placeholder="e.g. Rahul Sharma"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border text-slate-900 dark:text-white text-sm focus:outline-none transition-all ${
                            touched.name && errors.name
                              ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                              : 'border-slate-200 dark:border-white/10 focus:border-ieee-blue dark:focus:border-ieee-teal focus:ring-2 focus:ring-ieee-blue/20'
                          }`}
                        />
                      </div>
                      {touched.name && errors.name && (
                        <p className="mt-1.5 text-xs text-rose-500 font-mono">{errors.name}</p>
                      )}
                    </div>

                    {/* 2. USN (University Seat Number) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-mono uppercase tracking-wider font-bold text-slate-700 dark:text-zinc-300">
                          USN (University Seat Number) <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                          Auto-detects year & branch
                        </span>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                          <CreditCard size={16} />
                        </div>
                        <input
                          type="text"
                          value={formData.usn}
                          onChange={(e) => handleUsnChange(e.target.value)}
                          onBlur={() => handleBlur('usn')}
                          placeholder="e.g. 4NM22CS001 or NN25CSE021"
                          maxLength={15}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border text-slate-900 dark:text-white text-sm font-mono uppercase focus:outline-none transition-all ${
                            touched.usn && errors.usn
                              ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                              : 'border-slate-200 dark:border-white/10 focus:border-ieee-blue dark:focus:border-ieee-teal focus:ring-2 focus:ring-ieee-blue/20'
                          }`}
                        />
                      </div>
                      {touched.usn && errors.usn ? (
                        <p className="mt-1.5 text-xs text-rose-500 font-mono">{errors.usn}</p>
                      ) : (
                        <p className="mt-1.5 text-[11px] text-slate-500 dark:text-zinc-500 font-mono">
                          Enter your college USN format (4NM... or NN...).
                        </p>
                      )}
                    </div>

                    {/* 3. Year of Study & 4. Branch / Department Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Year */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider font-bold text-slate-700 dark:text-zinc-300 mb-2">
                          Year of Study <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                            <GraduationCap size={16} />
                          </div>
                          <select
                            value={formData.year}
                            onChange={(e) => handleChange('year', e.target.value)}
                            onBlur={() => handleBlur('year')}
                            className={`w-full pl-10 pr-8 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border text-slate-900 dark:text-white text-sm focus:outline-none transition-all appearance-none ${
                              touched.year && errors.year
                                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                : 'border-slate-200 dark:border-white/10 focus:border-ieee-blue dark:focus:border-ieee-teal focus:ring-2 focus:ring-ieee-blue/20'
                            }`}
                          >
                            <option value="">Select Year</option>
                            {YEAR_OPTIONS.map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </select>
                        </div>
                        {touched.year && errors.year && (
                          <p className="mt-1.5 text-xs text-rose-500 font-mono">{errors.year}</p>
                        )}
                      </div>

                      {/* Branch */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider font-bold text-slate-700 dark:text-zinc-300 mb-2">
                          Branch / Department <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                            <Building2 size={16} />
                          </div>
                          <select
                            value={formData.branch}
                            onChange={(e) => handleChange('branch', e.target.value)}
                            onBlur={() => handleBlur('branch')}
                            className={`w-full pl-10 pr-8 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border text-slate-900 dark:text-white text-sm focus:outline-none transition-all appearance-none ${
                              touched.branch && errors.branch
                                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                : 'border-slate-200 dark:border-white/10 focus:border-ieee-blue dark:focus:border-ieee-teal focus:ring-2 focus:ring-ieee-blue/20'
                            }`}
                          >
                            <option value="">Select Branch</option>
                            {BRANCH_OPTIONS.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                        </div>
                        {touched.branch && errors.branch && (
                          <p className="mt-1.5 text-xs text-rose-500 font-mono">{errors.branch}</p>
                        )}
                      </div>
                    </div>

                    {/* 5. Email & 6. Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Email */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider font-bold text-slate-700 dark:text-zinc-300 mb-2">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                            <Mail size={16} />
                          </div>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            placeholder="e.g. rahul@nmamit.in"
                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border text-slate-900 dark:text-white text-sm focus:outline-none transition-all ${
                              touched.email && errors.email
                                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                : 'border-slate-200 dark:border-white/10 focus:border-ieee-blue dark:focus:border-ieee-teal focus:ring-2 focus:ring-ieee-blue/20'
                            }`}
                          />
                        </div>
                        {touched.email && errors.email && (
                          <p className="mt-1.5 text-xs text-rose-500 font-mono">{errors.email}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-wider font-bold text-slate-700 dark:text-zinc-300 mb-2">
                          WhatsApp / Mobile
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                            <Phone size={16} />
                          </div>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            onBlur={() => handleBlur('phone')}
                            placeholder="10-digit number"
                            maxLength={10}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border text-slate-900 dark:text-white text-sm focus:outline-none transition-all ${
                              touched.phone && errors.phone
                                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                                : 'border-slate-200 dark:border-white/10 focus:border-ieee-blue dark:focus:border-ieee-teal focus:ring-2 focus:ring-ieee-blue/20'
                            }`}
                          />
                        </div>
                        {touched.phone && errors.phone && (
                          <p className="mt-1.5 text-xs text-rose-500 font-mono">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-ieee-blue hover:bg-[#005a8f] dark:bg-ieee-teal dark:hover:bg-teal-400 text-white dark:text-black font-heading font-bold text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 rounded-full border-2 border-white dark:border-black border-t-transparent animate-spin" />
                            <span>Validating & Registering...</span>
                          </>
                        ) : (
                          <>
                            <span>Complete Registration</span>
                            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                          </>
                        )}
                      </button>
                      <p className="text-center text-[11px] text-slate-500 dark:text-zinc-500 font-mono mt-3">
                        By registering, you confirm attendance for {event.title}.
                      </p>
                    </div>
                  </form>
                </div>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

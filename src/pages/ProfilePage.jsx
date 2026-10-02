import React, { useState } from 'react';
import {
  Share2,
  Edit3,
  GraduationCap,
  BookOpen,
  Award,
  Link,
  CalendarDays,
  Mail,
  Github,
  Linkedin,
  Instagram,
} from 'lucide-react';

export default function ProfilePage() {
  // ================= PROFILE DATA =================

  const member = {
    name: 'Anagha',
    branch: 'Information Science & Engineering',
    year: '2nd Year',

    // Add the unique IEEE Membership ID when the member has one.
    // Leave empty if the member does not have one.
    membershipId: '',

    usn: 'NN25ISE021',
    collegeEmail: 'nn25ise021@nmamit.in',

    bio: 'Information Science & Engineering student interested in technology, problem solving, AI, and building meaningful projects.',
  };

  // ================= REGISTERED EVENTS =================

  const [events] = useState([
    {
      id: 1,
      title: 'Tech Talk',
      date: 'September 2026',
      description: 'Technical session conducted by IEEE.',
      attended: true,
    },
    {
      id: 2,
      title: 'Coding Workshop',
      date: 'September 2026',
      description: 'Hands-on coding workshop for IEEE members.',
      attended: false,
    },
  ]);

  return (
    <div className="pt-28 sm:pt-36 pb-20">

      {/* ================= PROFILE HEADER ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8">

        <div className="relative overflow-hidden rounded-2xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] shadow-lg">

          <div className="relative px-6 sm:px-10 py-10">

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* Profile Picture */}
              <div className="relative shrink-0">

                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-[#00629B] bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
                  <span className="text-4xl font-bold text-[#00629B]">
                    A
                  </span>
                </div>

                <button
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#00629B] text-white flex items-center justify-center border-2 border-white dark:border-[#0a0d16]"
                  aria-label="Edit profile"
                >
                  <Edit3 size={16} />
                </button>

              </div>

              {/* Basic Information */}
              <div className="flex-1 text-center sm:text-left">

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    {member.name}
                  </h1>

                  {/* IEEE Member badge only appears when Membership ID exists */}
                  {member.membershipId && (
                    <span className="inline-flex self-center sm:self-auto items-center px-3 py-1 rounded-full border border-[#00629B]/50 bg-[#00629B]/10 text-[#00629B] dark:text-[#5db4e8] text-xs font-mono uppercase">
                      IEEE Member
                    </span>
                  )}

                </div>

                <p className="mt-3 text-slate-600 dark:text-zinc-400">
                  {member.branch}
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
                  {member.year}
                </p>

                {/* Actions */}
                <div className="flex justify-center sm:justify-start gap-3 mt-6">

                  <button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 hover:border-[#00629B] transition"
                  >
                    <Share2 size={17} />
                    Share
                  </button>

                  <button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00629B] text-white hover:bg-[#00527f] transition"
                  >
                    <Edit3 size={17} />
                    Edit Profile
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= ACADEMIC INFORMATION ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">

        <SectionHeading
          icon={<GraduationCap size={20} />}
          title="Academic Information"
        />

        {/* Single Academic Information Box */}
        <div className="mt-5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] overflow-hidden">

          <InfoRow
            label="USN"
            value={member.usn}
          />

          <InfoRow
            label="College Email"
            value={member.collegeEmail}
          />

          <InfoRow
            label="Branch"
            value={member.branch}
          />

          <InfoRow
            label="Year"
            value={member.year}
          />

        </div>

      </section>


      {/* ================= BIO ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">

        <SectionHeading
          icon={<BookOpen size={20} />}
          title="Bio"
        />

        <div className="mt-5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6">

          <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
            {member.bio}
          </p>

        </div>

      </section>


      {/* ================= MEMBER OVERVIEW ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">

        <SectionHeading
          icon={<Award size={20} />}
          title="Member Overview"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">

          <StatCard
            title="Events Participated"
            value="0"
          />

          <StatCard
            title="Workshops Attended"
            value="0"
          />

          <StatCard
            title="IEEE Activities"
            value="0"
          />

        </div>

      </section>


      {/* ================= ACHIEVEMENTS ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">

        <SectionHeading
          icon={<Award size={20} />}
          title="Achievements"
        />

        <div className="mt-5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6">

          <p className="text-slate-500 dark:text-zinc-500">
            No achievements added yet.
          </p>

        </div>

      </section>


      {/* ================= SOCIAL LINKS ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">

        <SectionHeading
          icon={<Link size={20} />}
          title="Social Links"
        />

        <div className="flex flex-wrap gap-3 mt-5">

          <SocialButton
            icon={<Linkedin size={18} />}
            label="LinkedIn"
          />

          <SocialButton
            icon={<Github size={18} />}
            label="GitHub"
          />

          <SocialButton
            icon={<Instagram size={18} />}
            label="Instagram"
          />

          <SocialButton
            icon={<Mail size={18} />}
            label="Email"
          />

        </div>

      </section>


      {/* ================= MY EVENTS ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">

        <SectionHeading
          icon={<CalendarDays size={20} />}
          title="My Events"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">

          {events.length === 0 ? (

            <div className="md:col-span-2 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6">

              <p className="text-slate-500 dark:text-zinc-500">
                No events to display yet.
              </p>

            </div>

          ) : (

            events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))

          )}

        </div>

      </section>

    </div>
  );
}


/* ================= REUSABLE COMPONENTS ================= */

function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-3">

      <span className="text-[#00629B] dark:text-[#5db4e8]">
        {icon}
      </span>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
        {title}
      </h2>

    </div>
  );
}


/* ================= ACADEMIC INFORMATION ROW ================= */

function InfoRow({ label, value }) {
  return (
    <div className="px-6 py-5 border-b last:border-b-0 border-slate-200 dark:border-zinc-800">

      <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-900 dark:text-white break-words">
        {value}
      </p>

    </div>
  );
}


function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6 text-center">

      <p className="text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
        {title}
      </p>

    </div>
  );
}


function SocialButton({ icon, label }) {
  return (
    <button
      className="flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] text-slate-700 dark:text-zinc-300 hover:border-[#00629B] hover:text-[#00629B] dark:hover:text-[#5db4e8] transition"
    >
      {icon}
      {label}
    </button>
  );
}


function EventCard({ event }) {
  return (
    <div className="rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6">

      {/* Event Header */}
      <div className="flex items-start justify-between gap-4">

        <div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {event.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
            {event.date}
          </p>

        </div>

        {/* Attendance Status */}
        <span
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-mono uppercase ${
            event.attended
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
          }`}
        >
          {event.attended ? 'Attended' : 'Not Attended'}
        </span>

      </div>

      {/* Event Description */}
      <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
        {event.description}
      </p>

      {/* Feedback */}
      <div className="mt-5">

        {event.attended ? (

          <button
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#00629B] text-white hover:bg-[#00527f] transition"
          >
            Give Feedback
          </button>

        ) : (

          <p className="text-sm text-slate-500 dark:text-zinc-500">
            Feedback will be available after attending the event.
          </p>

        )}

      </div>

    </div>
  );
}
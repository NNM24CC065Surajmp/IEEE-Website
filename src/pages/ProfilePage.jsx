import React, { useEffect, useState } from 'react';
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
  Loader2,
  Save,
  X as XIcon,
} from 'lucide-react';
import { getUserProfile, updateUserProfile } from '../lib/firebase.js';

export default function ProfilePage({ authUser }) {
  // ================= LIVE PROFILE STATE (Firestore: users/{uid}) =================
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');

  // ================= REGISTERED EVENTS (still placeholder for now) =================
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

  useEffect(() => {
    let active = true;
    if (!authUser) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError('');
    getUserProfile(authUser.uid)
      .then((data) => {
        if (!active) return;
        setProfile(data);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Failed to load profile:', err);
        setLoadError(
          err?.code === 'permission-denied'
            ? "We don't have permission to read your profile. Firestore security rules may not be set up yet."
            : 'Something went wrong loading your profile.'
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [authUser]);

  const startEditing = () => {
    setForm({
      name: profile?.name || '',
      branch: profile?.branch || '',
      year: profile?.year || '',
      usn: profile?.usn || '',
      collegeEmail: profile?.collegeEmail || authUser?.email || '',
      bio: profile?.bio || '',
      membershipId: profile?.membershipId || '',
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setForm(null);
  };

  const saveEditing = async () => {
    if (!authUser || !form) return;
    setSaving(true);
    try {
      await updateUserProfile(authUser.uid, form);
      setProfile((prev) => ({ ...prev, ...form }));
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  // ================= NOT SIGNED IN =================
  if (!authUser) {
    return (
      <div className="pt-28 sm:pt-36 pb-20 max-w-xl mx-auto px-5 text-center">
        <p className="text-slate-500 dark:text-zinc-500">
          Sign in to view and manage your IEEE NMAMIT profile.
        </p>
      </div>
    );
  }

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="pt-28 sm:pt-36 pb-20 flex justify-center">
        <Loader2 className="animate-spin text-[#00629B]" size={28} />
      </div>
    );
  }

  // ================= LOAD ERROR =================
  if (loadError) {
    return (
      <div className="pt-28 sm:pt-36 pb-20 max-w-xl mx-auto px-5 text-center">
        <p className="text-red-500 dark:text-red-400">{loadError}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500">
          Check the browser console for the full error, and confirm Firestore Database is enabled
          for this project with rules allowing a user to read/write their own <code>users/&#123;uid&#125;</code> document.
        </p>
      </div>
    );
  }

  const member = {
    name: profile?.name || authUser.email?.split('@')[0] || 'Member',
    branch: profile?.branch || 'Not set',
    year: profile?.year || 'Not set',
    membershipId: profile?.membershipId || '',
    usn: profile?.usn || 'Not set',
    collegeEmail: profile?.collegeEmail || authUser.email || 'Not set',
    bio: profile?.bio || 'No bio added yet.',
  };

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
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Basic Information */}
              <div className="flex-1 text-center sm:text-left">

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {editing ? (
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Full name"
                      className="text-2xl sm:text-3xl font-extrabold bg-transparent border-b border-[#00629B]/40 focus:border-[#00629B] outline-none text-slate-900 dark:text-white"
                    />
                  ) : (
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                      {member.name}
                    </h1>
                  )}

                  {(editing ? form.membershipId : member.membershipId) && (
                    <span className="inline-flex self-center sm:self-auto items-center px-3 py-1 rounded-full border border-[#00629B]/50 bg-[#00629B]/10 text-[#00629B] dark:text-[#5db4e8] text-xs font-mono uppercase">
                      IEEE Member
                    </span>
                  )}
                </div>

                <p className="mt-3 text-slate-600 dark:text-zinc-400">
                  {(editing ? form.branch : member.branch) || 'Not set'}
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
                  {(editing ? form.year : member.year) || 'Not set'}
                </p>

                {/* Actions */}
                <div className="flex justify-center sm:justify-start gap-3 mt-6">
                  {editing ? (
                    <>
                      <button
                        onClick={cancelEditing}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 hover:border-red-400 transition"
                      >
                        <XIcon size={17} />
                        Cancel
                      </button>
                      <button
                        onClick={saveEditing}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00629B] text-white hover:bg-[#00527f] transition disabled:opacity-60"
                      >
                        {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 hover:border-[#00629B] transition">
                        <Share2 size={17} />
                        Share
                      </button>

                      <button
                        onClick={startEditing}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00629B] text-white hover:bg-[#00527f] transition"
                      >
                        <Edit3 size={17} />
                        Edit Profile
                      </button>
                    </>
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= ACADEMIC INFORMATION ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">

        <SectionHeading icon={<GraduationCap size={20} />} title="Academic Information" />

        <div className="mt-5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] overflow-hidden">

          <InfoRow
            label="USN"
            value={member.usn}
            editing={editing}
            inputValue={form?.usn}
            onChange={(v) => setForm({ ...form, usn: v.toUpperCase() })}
          />

          <InfoRow
            label="College Email"
            value={member.collegeEmail}
            editing={editing}
            inputValue={form?.collegeEmail}
            onChange={(v) => setForm({ ...form, collegeEmail: v })}
          />

          <InfoRow
            label="Branch"
            value={member.branch}
            editing={editing}
            inputValue={form?.branch}
            onChange={(v) => setForm({ ...form, branch: v })}
          />

          <InfoRow
            label="Year"
            value={member.year}
            editing={editing}
            inputValue={form?.year}
            onChange={(v) => setForm({ ...form, year: v })}
          />

          <InfoRow
            label="IEEE Membership ID"
            value={member.membershipId || 'Not set'}
            editing={editing}
            inputValue={form?.membershipId}
            onChange={(v) => setForm({ ...form, membershipId: v })}
          />

        </div>

      </section>


      {/* ================= BIO ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">

        <SectionHeading icon={<BookOpen size={20} />} title="Bio" />

        <div className="mt-5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6">
          {editing ? (
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              placeholder="Tell the branch a bit about yourself..."
              className="w-full bg-transparent outline-none border border-slate-300 dark:border-zinc-700 focus:border-[#00629B] rounded-lg p-3 text-slate-700 dark:text-zinc-300"
            />
          ) : (
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
              {member.bio}
            </p>
          )}
        </div>

      </section>


      {/* ================= MEMBER OVERVIEW ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">

        <SectionHeading icon={<Award size={20} />} title="Member Overview" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          <StatCard title="Events Participated" value="0" />
          <StatCard title="Workshops Attended" value="0" />
          <StatCard title="IEEE Activities" value="0" />
        </div>

      </section>


      {/* ================= ACHIEVEMENTS ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">

        <SectionHeading icon={<Award size={20} />} title="Achievements" />

        <div className="mt-5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6">
          <p className="text-slate-500 dark:text-zinc-500">
            No achievements added yet.
          </p>
        </div>

      </section>


      {/* ================= SOCIAL LINKS ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">

        <SectionHeading icon={<Link size={20} />} title="Social Links" />

        <div className="flex flex-wrap gap-3 mt-5">
          <SocialButton icon={<Linkedin size={18} />} label="LinkedIn" />
          <SocialButton icon={<Github size={18} />} label="GitHub" />
          <SocialButton icon={<Instagram size={18} />} label="Instagram" />
          <SocialButton icon={<Mail size={18} />} label="Email" />
        </div>

      </section>


      {/* ================= MY EVENTS ================= */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">

        <SectionHeading icon={<CalendarDays size={20} />} title="My Events" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {events.length === 0 ? (
            <div className="md:col-span-2 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6">
              <p className="text-slate-500 dark:text-zinc-500">No events to display yet.</p>
            </div>
          ) : (
            events.map((event) => <EventCard key={event.id} event={event} />)
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
      <span className="text-[#00629B] dark:text-[#5db4e8]">{icon}</span>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
    </div>
  );
}

/* Academic Information row — renders as text normally, swaps to an
   input when `editing` is true. */
function InfoRow({ label, value, editing, inputValue, onChange }) {
  return (
    <div className="px-6 py-5 border-b last:border-b-0 border-slate-200 dark:border-zinc-800">
      <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500">
        {label}
      </p>
      {editing ? (
        <input
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full bg-transparent border-b border-slate-300 dark:border-zinc-700 focus:border-[#00629B] outline-none font-semibold text-slate-900 dark:text-white"
        />
      ) : (
        <p className="mt-2 font-semibold text-slate-900 dark:text-white break-words">{value}</p>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6 text-center">
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">{title}</p>
    </div>
  );
}

function SocialButton({ icon, label }) {
  return (
    <button className="flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] text-slate-700 dark:text-zinc-300 hover:border-[#00629B] hover:text-[#00629B] dark:hover:text-[#5db4e8] transition">
      {icon}
      {label}
    </button>
  );
}

function EventCard({ event }) {
  return (
    <div className="rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{event.title}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">{event.date}</p>
        </div>
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

      <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
        {event.description}
      </p>

      <div className="mt-5">
        {event.attended ? (
          <button className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#00629B] text-white hover:bg-[#00527f] transition">
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
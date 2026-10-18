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
   ExternalLink,
  Globe,
} from 'lucide-react';
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
} from '../lib/firebase.js';
import { parseNmamitIdentity } from '../lib/nmamitId.js';


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
      setLoadError('');
      return () => {
        active = false;
      };
    }

    const loadProfile = async () => {
      setLoading(true);
      setLoadError('');

      try {
        // Require the college email domain before creating/loading a profile.
        const email = authUser.email?.trim().toLowerCase() || '';
        if (!email.endsWith('@nmamit.in')) {
          throw new Error('COLLEGE_EMAIL_REQUIRED');
        }

        // Google Workspace display name format: "USN FULL NAME".
        const identity = parseNmamitIdentity(authUser.displayName);
        const existing = await getUserProfile(authUser.uid);

        const defaults = {
          name: identity?.name || authUser.displayName || '',
          usn: identity?.usn || '',
          branch: identity?.branchName || '',
          branchCode: identity?.branchCode || '',
          batchYear: identity?.batchYear ?? null,
          roll: identity?.roll || '',
          year: identity?.yearLabel || '',
          collegeEmail: email,
        };

        if (!existing) {
          const initialProfile = {
            ...defaults,
            bio: '',
            membershipId: '',
          };
          await createUserProfile(authUser.uid, initialProfile);
          if (active) setProfile(initialProfile);
        } else {
          // Only fill missing fields; never overwrite profile edits on login.
          const updates = {};
          for (const [key, value] of Object.entries(defaults)) {
            const isMissing =
              existing[key] === undefined ||
              existing[key] === null ||
              existing[key] === '';

            if (isMissing && value !== '' && value !== null) {
              updates[key] = value;
            }
          }

          if (Object.keys(updates).length > 0) {
            await updateUserProfile(authUser.uid, updates);
          }

          if (active) setProfile({ ...existing, ...updates });
        }
      } catch (err) {
        if (!active) return;
        console.error('Failed to load profile:', err);

        if (err?.message === 'COLLEGE_EMAIL_REQUIRED') {
          setLoadError('Please sign in using your @nmamit.in college account.');
        } else if (err?.code === 'permission-denied') {
          setLoadError(
            "We don't have permission to read your profile. Firestore security rules may not be set up yet."
          );
        } else {
          setLoadError('Something went wrong loading your profile.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile();

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
      socialLinks: {
        linkedin: profile?.socialLinks?.linkedin || '',
        github: profile?.socialLinks?.github || '',
        instagram: profile?.socialLinks?.instagram || '',
        website: profile?.socialLinks?.website || '',
      },
    });
    setEditing(true);
  };

  const [saveError, setSaveError] = useState('');

  const cancelEditing = () => {
    setEditing(false);
    setForm(null);
    setSaveError('');
  };

  const saveEditing = async () => {
    if (!authUser || !form) return;
    setSaving(true);
    setSaveError('');
    try {
      await updateUserProfile(authUser.uid, form);
      setProfile((prev) => ({ ...prev, ...form }));
      setEditing(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setSaveError(
        err?.code === 'permission-denied'
          ? 'Permission denied. Please verify your Firestore security rules allow writing to users/{uid}.'
          : 'Failed to save changes. Please try again.'
      );
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
    socialLinks: {
      linkedin: profile?.socialLinks?.linkedin || '',
      github: profile?.socialLinks?.github || '',
      instagram: profile?.socialLinks?.instagram || '',
      website: profile?.socialLinks?.website || '',
    },
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

                {saveError && (
                  <p className="mt-3 text-sm text-red-500 dark:text-red-400">
                    {saveError}
                  </p>
                )}

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

        {editing ? (
          <div className="mt-5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6 space-y-4">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-2">
              Add or edit your profile links (URLs or handles)
            </p>

            <SocialInputRow
              icon={<Linkedin size={18} className="text-[#0A66C2]" />}
              label="LinkedIn"
              placeholder="https://linkedin.com/in/username"
              value={form?.socialLinks?.linkedin || ''}
              onChange={(val) =>
                setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, linkedin: val },
                })
              }
            />

            <SocialInputRow
              icon={<Github size={18} className="text-slate-800 dark:text-zinc-200" />}
              label="GitHub"
              placeholder="https://github.com/username"
              value={form?.socialLinks?.github || ''}
              onChange={(val) =>
                setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, github: val },
                })
              }
            />

            <SocialInputRow
              icon={<Instagram size={18} className="text-[#E4405F]" />}
              label="Instagram"
              placeholder="https://instagram.com/username"
              value={form?.socialLinks?.instagram || ''}
              onChange={(val) =>
                setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, instagram: val },
                })
              }
            />

            <SocialInputRow
              icon={<Globe size={18} className="text-[#00629B] dark:text-[#5db4e8]" />}
              label="Portfolio / Website"
              placeholder="https://yourportfolio.com"
              value={form?.socialLinks?.website || ''}
              onChange={(val) =>
                setForm({
                  ...form,
                  socialLinks: { ...form.socialLinks, website: val },
                })
              }
            />
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 mt-5">
            <SocialButton
              icon={<Linkedin size={18} />}
              label="LinkedIn"
              href={member.socialLinks?.linkedin}
            />
            <SocialButton
              icon={<Github size={18} />}
              label="GitHub"
              href={member.socialLinks?.github}
            />
            <SocialButton
              icon={<Instagram size={18} />}
              label="Instagram"
              href={member.socialLinks?.instagram}
            />
            {member.socialLinks?.website && (
              <SocialButton
                icon={<Globe size={18} />}
                label="Website"
                href={member.socialLinks?.website}
              />
            )}
            <SocialButton
              icon={<Mail size={18} />}
              label="Email"
              href={member.collegeEmail !== 'Not set' ? `mailto:${member.collegeEmail}` : ''}
            />
          </div>
        )}

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

function SocialInputRow({ icon, label, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="flex items-center gap-2 w-44 shrink-0">
        {icon}
        <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-zinc-300">
          {label}
        </span>
      </div>
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-sm px-3.5 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-[#00629B] dark:focus:border-[#0096D6] transition"
        />
      </div>
    </div>
  );
}

function formatUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function SocialButton({ icon, label, href }) {
  const isClickable = Boolean(href && href.trim());
  const resolvedHref = isClickable ? formatUrl(href) : null;

  if (resolvedHref) {
    return (
      <a
        href={resolvedHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] text-slate-700 dark:text-zinc-300 hover:border-[#00629B] hover:text-[#00629B] dark:hover:text-[#5db4e8] transition"
      >
        {icon}
        <span>{label}</span>
        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
      </a>
    );
  }

  return (
    <div
      title="Not provided yet"
      className="flex items-center gap-2 px-5 py-3 rounded-lg border border-dashed border-slate-300 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 text-slate-400 dark:text-zinc-600 cursor-not-allowed select-none"
    >
      {icon}
      <span>{label}</span>
      <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-600">(Not set)</span>
    </div>
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
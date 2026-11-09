import React, { useEffect, useState, useRef } from 'react';
import {
  Share2,
  Edit3,
  GraduationCap,
  BookOpen,
  Award,
  Link as LinkIcon,
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
  Plus,
  Trash2,
  Pencil,
  User,
  LogIn,
  UserPlus,
  QrCode,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
} from '../lib/firebase.js';
import { parseNmamitIdentity, parseNmamitUsn } from '../lib/nmamitId.js';
import { decodeQrFromImage, parseMemberQrPayload, isUrlLike } from '../lib/qrHelper.js';

export default function ProfilePage({ authUser, onOpenAuth }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [achievementError, setAchievementError] = useState('');
  const [achievementDraft, setAchievementDraft] = useState({
    title: '',
    description: '',
    date: '',
  });
  const [editingAchievementId, setEditingAchievementId] = useState(null);

  // Quick USN Connector State
  const [quickUsnInput, setQuickUsnInput] = useState('');
  const [quickUsnError, setQuickUsnError] = useState('');
  const [quickUsnSuccess, setQuickUsnSuccess] = useState('');

  // QR Scanning & Upload State
  const [qrScanning, setQrScanning] = useState(false);
  const [qrSuccessMessage, setQrSuccessMessage] = useState('');
  const [qrErrorMessage, setQrErrorMessage] = useState('');
  const [isQrDragOver, setIsQrDragOver] = useState(false);
  const qrFileInputRef = useRef(null);

  // Placeholder events
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

  // ─── Profile Loading & Hydration ──────────────────────────────────
  useEffect(() => {
    let active = true;

    // Check if an active verified QR pass was scanned in this browser session
    const savedQr = sessionStorage.getItem('ieee_qr_user');
    let qrData = null;
    if (savedQr) {
      try {
        qrData = JSON.parse(savedQr);
      } catch {
        sessionStorage.removeItem('ieee_qr_user');
      }
    }

    const currentAuth = authUser || qrData;

    if (!currentAuth) {
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

      // Fast-path: Verified QR session
      if (currentAuth?.isQrSession || qrData) {
        const source = qrData || currentAuth;
        const initialName = (source.name && !isUrlLike(source.name)) 
          ? source.name 
          : ((source.displayName && !isUrlLike(source.displayName)) ? source.displayName : 'IEEE Member');

        const initialQrProfile = {
          name: initialName,
          usn: source.usn || '',
          branch: source.branch || '',
          branchCode: source.branchCode || '',
          year: source.year || (source.validThrough ? `Valid through ${source.validThrough}` : ''),
          collegeEmail: source.collegeEmail || source.email || (source.usn ? `${source.usn.toLowerCase()}@nmamit.in` : ''),
          membershipId: source.membershipId || '',
          role: source.role || 'Student Member',
          validThrough: source.validThrough || '31 December 2027',
          subsection: source.subsection || 'Mangalore Subsection',
          bio: source.bio && !isUrlLike(source.bio) 
            ? source.bio 
            : `Verified IEEE ${source.role || 'Student Member'} · ${source.subsection || 'Mangalore Subsection'} · Member ID: ${source.membershipId || ''}`,
          socialLinks: source.socialLinks || { linkedin: '', github: '', instagram: '', website: '' },
          achievements: Array.isArray(source.achievements) ? source.achievements : [],
          isQrVerified: true,
          isIeeePass: Boolean(source.isIeeePass),
        };

        if (active) {
          setProfile(initialQrProfile);
          setLoading(false);
        }

        // Asynchronously check if Firestore has additional stored edits
        if (currentAuth.uid) {
          try {
            const remote = await getUserProfile(currentAuth.uid);
            if (active && remote) {
              setProfile((prev) => ({
                ...prev,
                ...remote,
                name: (remote.name && !isUrlLike(remote.name)) ? remote.name : prev.name,
                usn: remote.usn || prev.usn,
                membershipId: remote.membershipId || prev.membershipId,
                branch: remote.branch || prev.branch,
                year: remote.year || prev.year,
                collegeEmail: remote.collegeEmail || prev.collegeEmail,
                role: remote.role || prev.role,
                subsection: remote.subsection || prev.subsection,
                validThrough: remote.validThrough || prev.validThrough,
                isQrVerified: true,
              }));
            }
          } catch {
            // Firestore optional for local QR sessions
          }
        }
        return;
      }

      // Standard Firebase User Session
      try {
        const email = currentAuth.email?.trim().toLowerCase() || '';
        if (!email.endsWith('@nmamit.in')) {
          throw new Error('COLLEGE_EMAIL_REQUIRED');
        }

        const identity = parseNmamitIdentity(currentAuth.displayName);
        const existing = await getUserProfile(currentAuth.uid);
        const defaults = {
          name: identity?.name || currentAuth.displayName || 'IEEE Member',
          usn: identity?.usn || '',
          branch: identity?.branchName || '',
          branchCode: identity?.branchCode || '',
          batchYear: identity?.batchYear ?? null,
          roll: identity?.roll || '',
          year: identity?.yearLabel || '',
          collegeEmail: email,
          role: 'Student Member',
          subsection: 'Mangalore Subsection',
          validThrough: '31 December 2027',
        };

        if (!existing) {
          const initialProfile = {
            ...defaults,
            bio: '',
            membershipId: identity?.usn || '',
            socialLinks: { linkedin: '', github: '', instagram: '', website: '' },
            achievements: [],
          };
          await createUserProfile(currentAuth.uid, initialProfile);
          if (active) setProfile(initialProfile);
        } else {
          // Fill only missing identity fields; preserve existing user edits.
          const updates = {};
          for (const [key, value] of Object.entries(defaults)) {
            const isMissing =
              existing[key] === undefined ||
              existing[key] === null ||
              existing[key] === '';
            if (isMissing && value !== '' && value !== null) updates[key] = value;
          }
          if (!Array.isArray(existing.achievements)) updates.achievements = [];
          if (!existing.socialLinks) {
            updates.socialLinks = { linkedin: '', github: '', instagram: '', website: '' };
          }
          if (Object.keys(updates).length > 0) {
            await updateUserProfile(currentAuth.uid, updates);
          }
          if (active) setProfile({ ...existing, ...updates });
        }
      } catch (err) {
        if (!active) return;
        console.error('Failed to load profile:', err);

        // Fallback for QR session or offline
        if (currentAuth?.isQrSession || currentAuth?.usn) {
          const identity = parseNmamitIdentity(currentAuth.displayName || `${currentAuth.usn || ''} ${currentAuth.name || ''}`);
          const fallbackProfile = {
            name: identity?.name || currentAuth.name || currentAuth.displayName || 'IEEE Member',
            usn: identity?.usn || currentAuth.usn || '',
            branch: identity?.branchName || currentAuth.branch || '',
            branchCode: identity?.branchCode || '',
            batchYear: identity?.batchYear ?? null,
            roll: identity?.roll || '',
            year: identity?.yearLabel || currentAuth.year || '',
            collegeEmail: currentAuth.email || (currentAuth.usn ? `${currentAuth.usn.toLowerCase()}@nmamit.in` : ''),
            bio: currentAuth.bio || 'Verified IEEE Student Member',
            membershipId: currentAuth.membershipId || currentAuth.usn || '',
            role: currentAuth.role || 'Student Member',
            subsection: currentAuth.subsection || 'Mangalore Subsection',
            validThrough: currentAuth.validThrough || '31 December 2027',
            socialLinks: currentAuth.socialLinks || { linkedin: '', github: '', instagram: '', website: '' },
            achievements: currentAuth.achievements || [],
            isQrVerified: true,
          };
          setProfile(fallbackProfile);
          setLoading(false);
          return;
        }

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
    return () => {
      active = false;
    };
  }, [authUser]);

  // ─── Direct QR Code Processing on Profile Page ──────────────────────
  const handleProfileQrFile = async (file) => {
    if (!file) return;

    setQrErrorMessage('');
    setQrSuccessMessage('');
    setQrScanning(true);

    try {
      const rawPayload = await decodeQrFromImage(file);
      const member = parseMemberQrPayload(rawPayload);

      // Preserve existing profile values when merging
      const existingName = (profile?.name && !isUrlLike(profile.name) && profile.name !== 'IEEE Member') 
        ? profile.name 
        : (authUser?.displayName && !isUrlLike(authUser.displayName) ? authUser.displayName : '');
      const existingUsn = (profile?.usn && profile.usn !== 'Not set') ? profile.usn : (authUser?.usn || '');
      const existingBranch = (profile?.branch && profile.branch !== 'Not set') ? profile.branch : (authUser?.branch || '');
      const existingYear = (profile?.year && profile.year !== 'Not set') ? profile.year : (authUser?.year || '');
      const existingEmail = (profile?.collegeEmail && profile.collegeEmail !== 'Not set') 
        ? profile.collegeEmail 
        : (authUser?.email && authUser.email !== 'member@nmamit.in' ? authUser.email : '');

      const memberId = member.membershipId || profile?.membershipId || '';
      let memberName = (member.name && !isUrlLike(member.name) && member.name !== 'IEEE Member') 
        ? member.name 
        : (existingName || 'IEEE Member');
      let memberUsn = member.usn || existingUsn;
      let memberBranch = member.branch || existingBranch;
      let memberYear = member.year || existingYear;
      let memberEmail = member.collegeEmail || member.email || existingEmail;
      let role = member.role || profile?.role || 'Student Member';
      let validThrough = member.validThrough || profile?.validThrough || '31 December 2027';
      let subsection = member.subsection || profile?.subsection || 'Mangalore Subsection';

      // If USN is present, infer missing academic fields
      if (memberUsn) {
        const parsedUsn = parseNmamitUsn(memberUsn);
        if (parsedUsn) {
          if (!memberBranch || memberBranch === 'Not set') memberBranch = parsedUsn.branchName;
          if (!memberYear || memberYear === 'Not set') memberYear = parsedUsn.yearLabel || parsedUsn.gradYear;
        }
        if (!memberEmail || memberEmail === 'Not set' || memberEmail === 'member@nmamit.in') {
          memberEmail = `${memberUsn.toLowerCase()}@nmamit.in`;
        }
      }

      const resolvedUid = authUser?.uid || member.uid || `qr_${memberId || memberUsn || 'member'}_${Date.now()}`;

      const qrUserData = {
        uid: resolvedUid,
        email: memberEmail || (memberUsn ? `${memberUsn.toLowerCase()}@nmamit.in` : ''),
        collegeEmail: memberEmail || (memberUsn ? `${memberUsn.toLowerCase()}@nmamit.in` : ''),
        displayName: memberName,
        name: memberName,
        usn: memberUsn || '',
        branch: memberBranch || '',
        year: memberYear || '',
        membershipId: memberId,
        role,
        validThrough,
        subsection,
        bio: member.bio || (profile?.bio && !isUrlLike(profile.bio) ? profile.bio : `Verified IEEE ${role} · ${subsection} · Member ID: ${memberId}`),
        socialLinks: profile?.socialLinks || member.socialLinks || { linkedin: '', github: '', instagram: '', website: '' },
        achievements: Array.isArray(member.achievements) && member.achievements.length > 0 
          ? member.achievements 
          : (profile?.achievements || []),
        isQrSession: true,
        isQrVerified: true,
        isIeeePass: Boolean(member.isIeeePass),
        qrVerifiedAt: new Date().toISOString(),
      };

      // Save locally to session and local storage
      sessionStorage.setItem('ieee_qr_user', JSON.stringify(qrUserData));
      localStorage.setItem('ieee_member_profile', JSON.stringify(qrUserData));

      // Update state immediately
      setProfile(qrUserData);

      // Try updating Firestore if user account exists
      try {
        const existing = await getUserProfile(resolvedUid);
        if (!existing) {
          await createUserProfile(resolvedUid, qrUserData);
        } else {
          await updateUserProfile(resolvedUid, qrUserData);
        }
      } catch {
        // Handled via local session
      }

      window.dispatchEvent(new CustomEvent('ieee:qr-auth', { detail: qrUserData }));
      setQrSuccessMessage(`Verified official IEEE ${role}: ${memberName} (Member #${memberId || memberUsn})`);
    } catch (err) {
      setQrErrorMessage(err.message || 'Could not read a valid IEEE QR code from this image. Please ensure the QR is clear and well-lit.');
    } finally {
      setQrScanning(false);
      if (qrFileInputRef.current) qrFileInputRef.current.value = '';
    }
  };

  const handleQrFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleProfileQrFile(file);
  };

  const handleQrDrop = (e) => {
    e.preventDefault();
    setIsQrDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProfileQrFile(file);
  };

  // ─── Quick USN Connector ──────────────────────────────────────────
  const handleQuickLinkUsn = async (e) => {
    e?.preventDefault();
    setQuickUsnError('');
    setQuickUsnSuccess('');

    const cleanUsn = quickUsnInput.trim().toUpperCase();
    if (!cleanUsn) {
      setQuickUsnError('Please enter your NMAMIT college USN (e.g. NN23CSE045 or NN25CSE021).');
      return;
    }

    const parsed = parseNmamitUsn(cleanUsn);
    if (!parsed) {
      setQuickUsnError('Invalid USN format. Please enter a valid NMAMIT USN (e.g. NN25CSE021, NNM22CS045, or 4NM22CS001).');
      return;
    }

    const derivedBranch = parsed.branchName;
    const derivedYear = parsed.yearLabel || `${parsed.gradYear} (Class of ${parsed.gradYear})`;
    const derivedEmail = `${cleanUsn.toLowerCase()}@nmamit.in`;

    const updatedProfile = {
      ...(profile || {}),
      usn: cleanUsn,
      branch: derivedBranch,
      year: derivedYear,
      collegeEmail: derivedEmail,
    };

    setProfile(updatedProfile);

    // Save locally
    const savedQr = sessionStorage.getItem('ieee_qr_user');
    if (savedQr) {
      try {
        const merged = { ...JSON.parse(savedQr), ...updatedProfile };
        sessionStorage.setItem('ieee_qr_user', JSON.stringify(merged));
        localStorage.setItem('ieee_member_profile', JSON.stringify(merged));
      } catch {
        // Fall through
      }
    } else {
      localStorage.setItem('ieee_member_profile', JSON.stringify(updatedProfile));
    }

    // Try updating Firestore if user is authenticated
    const uid = authUser?.uid || profile?.uid;
    if (uid) {
      try {
        await updateUserProfile(uid, {
          usn: cleanUsn,
          branch: derivedBranch,
          year: derivedYear,
          collegeEmail: derivedEmail,
        });
      } catch {
        // Local session preserved
      }
    }

    setQuickUsnInput('');
    setQuickUsnSuccess(`Connected USN ${cleanUsn}! Branch: ${derivedBranch}, Year: ${derivedYear}`);
  };

  // ─── Profile Editing Controls ──────────────────────────────────────
  const startEditing = () => {
    setForm({
      name: profile?.name || '',
      branch: profile?.branch || '',
      year: profile?.year || '',
      usn: profile?.usn || '',
      collegeEmail: profile?.collegeEmail || authUser?.email || '',
      bio: profile?.bio || '',
      membershipId: profile?.membershipId || '',
      role: profile?.role || 'Student Member',
      subsection: profile?.subsection || 'Mangalore Subsection',
      validThrough: profile?.validThrough || '31 December 2027',
      socialLinks: {
        linkedin: profile?.socialLinks?.linkedin || '',
        github: profile?.socialLinks?.github || '',
        instagram: profile?.socialLinks?.instagram || '',
        website: profile?.socialLinks?.website || '',
      },
      achievements: Array.isArray(profile?.achievements)
        ? profile.achievements.map((achievement, index) => ({
            id: achievement.id ?? `achievement-${index}-${Date.now()}`,
            title: achievement.title || '',
            description: achievement.description || '',
            date: achievement.date || '',
          }))
        : [],
    });
    setAchievementDraft({ title: '', description: '', date: '' });
    setEditingAchievementId(null);
    setAchievementError('');
    setSaveError('');
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setForm(null);
    setSaveError('');
    setAchievementError('');
    setEditingAchievementId(null);
    setAchievementDraft({ title: '', description: '', date: '' });
  };

  const saveEditing = async () => {
    if (!profile || !form) return;
    setSaving(true);
    setSaveError('');
    try {
      // If USN was changed, auto-derive branch and year if missing
      let finalBranch = form.branch;
      let finalYear = form.year;
      let finalEmail = form.collegeEmail;

      if (form.usn) {
        const parsed = parseNmamitUsn(form.usn);
        if (parsed) {
          if (!finalBranch) finalBranch = parsed.branchName;
          if (!finalYear) finalYear = parsed.yearLabel || parsed.gradYear;
          if (!finalEmail) finalEmail = `${form.usn.toLowerCase()}@nmamit.in`;
        }
      }

      const cleanForm = {
        ...form,
        branch: finalBranch,
        year: finalYear,
        collegeEmail: finalEmail,
        achievements: (form.achievements || []).map(({ id, title, description, date }) => ({
          id,
          title: title.trim(),
          description: description.trim(),
          date: date.trim(),
        })),
      };

      const updatedProfile = { ...profile, ...cleanForm };
      setProfile(updatedProfile);

      // Save locally
      const savedQr = sessionStorage.getItem('ieee_qr_user');
      if (savedQr) {
        try {
          const parsed = JSON.parse(savedQr);
          const merged = { ...parsed, ...cleanForm };
          sessionStorage.setItem('ieee_qr_user', JSON.stringify(merged));
          localStorage.setItem('ieee_member_profile', JSON.stringify(merged));
        } catch {
          // Fall through
        }
      } else {
        localStorage.setItem('ieee_member_profile', JSON.stringify(updatedProfile));
      }

      // Update Firestore if available
      const uid = authUser?.uid || profile?.uid;
      if (uid) {
        try {
          await updateUserProfile(uid, cleanForm);
        } catch {
          // Local session changes remain saved
        }
      }

      setEditing(false);
      setForm(null);
      setEditingAchievementId(null);
      setAchievementDraft({ title: '', description: '', date: '' });
    } catch (err) {
      console.error('Failed to save profile:', err);
      setSaveError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetAchievementDraft = () => {
    setAchievementDraft({ title: '', description: '', date: '' });
    setEditingAchievementId(null);
    setAchievementError('');
  };

  const addOrUpdateAchievement = () => {
    if (!achievementDraft.title.trim()) {
      setAchievementError('Please enter an achievement title.');
      return;
    }

    setForm((previous) => {
      if (!previous) return previous;
      const currentAchievements = Array.isArray(previous.achievements)
        ? previous.achievements
        : [];

      if (editingAchievementId !== null) {
        return {
          ...previous,
          achievements: currentAchievements.map((achievement) =>
            achievement.id === editingAchievementId
              ? {
                  ...achievement,
                  title: achievementDraft.title.trim(),
                  description: achievementDraft.description.trim(),
                  date: achievementDraft.date.trim(),
                }
              : achievement
          ),
        };
      }

      return {
        ...previous,
        achievements: [
          ...currentAchievements,
          {
            id: `achievement-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title: achievementDraft.title.trim(),
            description: achievementDraft.description.trim(),
            date: achievementDraft.date.trim(),
          },
        ],
      };
    });

    resetAchievementDraft();
  };

  const beginEditAchievement = (achievement) => {
    setEditingAchievementId(achievement.id);
    setAchievementDraft({
      title: achievement.title || '',
      description: achievement.description || '',
      date: achievement.date || '',
    });
    setAchievementError('');
  };

  const deleteAchievement = (id) => {
    setForm((previous) => {
      if (!previous) return previous;
      return {
        ...previous,
        achievements: (previous.achievements || []).filter(
          (achievement) => achievement.id !== id
        ),
      };
    });

    if (editingAchievementId === id) resetAchievementDraft();
  };

  // ─── Logged-out View with Integrated QR Dropzone ───────────────────
  if (!authUser && !profile) {
    return (
      <div className="pt-28 sm:pt-36 pb-20 max-w-lg mx-auto px-5">
        <input
          ref={qrFileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          onChange={handleQrFileInputChange}
        />

        <div className="p-7 sm:p-9 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/70 backdrop-blur-xl shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#00629B]/10 dark:bg-[#0096D6]/20 border border-[#00629B]/20 flex items-center justify-center mx-auto mb-4 text-[#00629B] dark:text-[#38bdf8]">
            <User size={30} />
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Member Profile
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
            Sign in with your @nmamit.in college account or upload your IEEE membership card / QR pass to access your verified profile.
          </p>

          {/* Direct QR Upload Target */}
          <div
            onClick={() => qrFileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsQrDragOver(true);
            }}
            onDragLeave={() => setIsQrDragOver(false)}
            onDrop={handleQrDrop}
            className={`border-2 border-dashed rounded-xl p-5 mb-6 text-center cursor-pointer transition-all ${
              isQrDragOver
                ? 'border-[#00629B] bg-[#00629B]/10 scale-[1.01]'
                : 'border-slate-300 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-950/40 hover:border-[#00629B]'
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-[#00629B]/10 dark:bg-[#00629B]/20 text-[#00629B] dark:text-[#38bdf8] flex items-center justify-center mb-2">
              {qrScanning ? <Loader2 size={20} className="animate-spin" /> : <QrCode size={20} />}
            </div>
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {qrScanning ? 'Reading membership QR...' : 'Upload IEEE Membership Card / QR'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Drop your member card image or browse device (PNG, JPG, WebP)
            </p>
            <button
              type="button"
              disabled={qrScanning}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#00629B] dark:text-[#38bdf8] bg-[#00629B]/10 dark:bg-[#00629B]/20 hover:bg-[#00629B]/20 transition-colors"
            >
              <UploadCloud size={14} />
              <span>Browse card image</span>
            </button>
          </div>

          {qrErrorMessage && (
            <div className="mb-5 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2 text-left">
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-500" />
              <span>{qrErrorMessage}</span>
            </div>
          )}

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-zinc-900 px-3 text-slate-400 font-medium">
                or sign in with password
              </span>
            </div>
          </div>

          {onOpenAuth && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => onOpenAuth('login')}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-[#00629B] hover:bg-[#005080] text-white font-medium text-xs transition shadow-sm"
              >
                <LogIn size={15} />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/80 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-medium text-xs transition"
              >
                <UserPlus size={15} className="text-[#00629B] dark:text-[#38bdf8]" />
                <span>Create Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-28 sm:pt-36 pb-20 flex justify-center">
        <Loader2 className="animate-spin text-[#00629B]" size={28} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="pt-28 sm:pt-36 pb-20 max-w-xl mx-auto px-5 text-center">
        <p className="text-red-500 dark:text-red-400">{loadError}</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-zinc-500">
          Check your account credentials or upload your IEEE digital membership card to authenticate.
        </p>
      </div>
    );
  }

  // ─── Member Representation ─────────────────────────────────────────
  const member = {
    name: (profile?.name && !isUrlLike(profile.name)) ? profile.name : ((authUser?.displayName && !isUrlLike(authUser.displayName)) ? authUser.displayName : 'IEEE Member'),
    branch: (profile?.branch && !isUrlLike(profile.branch) && profile.branch !== '') ? profile.branch : 'Not set',
    year: (profile?.year && !isUrlLike(profile.year) && profile.year !== '') ? profile.year : (profile?.validThrough ? `Valid through ${profile.validThrough}` : 'Not set'),
    membershipId: profile?.membershipId || '',
    role: profile?.role || 'Student Member',
    validThrough: profile?.validThrough || '31 December 2027',
    subsection: profile?.subsection || 'Mangalore Subsection',
    usn: (profile?.usn && !isUrlLike(profile.usn) && profile.usn !== '') ? profile.usn : 'Not set',
    collegeEmail: (profile?.collegeEmail && !isUrlLike(profile.collegeEmail) && profile.collegeEmail !== '') ? profile.collegeEmail : (authUser?.email || 'Not set'),
    bio: (profile?.bio && !isUrlLike(profile.bio)) ? profile.bio : `Verified IEEE ${profile?.role || 'Student Member'} · ${profile?.subsection || 'Mangalore Subsection'} · Member ID: ${profile?.membershipId || ''}`,
    socialLinks: profile?.socialLinks || { linkedin: '', github: '', instagram: '', website: '' },
    achievements: Array.isArray(profile?.achievements) ? profile.achievements : [],
    isQrVerified: Boolean(profile?.isQrVerified || authUser?.isQrSession || profile?.membershipId),
  };

  const displayedAchievements = editing ? (form?.achievements || []) : member.achievements;
  const cardExpiryYear = member.validThrough?.match(/\d{4}/)?.[0] || member.year?.match(/\d{4}/)?.[0] || '2027';

  return (
    <div className="pt-28 sm:pt-36 pb-20">
      {/* Hidden File Input for QR Scanning anywhere on profile */}
      <input
        ref={qrFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleQrFileInputChange}
      />

      {/* QR VERIFICATION FEEDBACK BANNER */}
      {qrSuccessMessage && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-6">
          <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-medium">{qrSuccessMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setQrSuccessMessage('')}
              className="text-emerald-600 hover:text-emerald-900 dark:hover:text-emerald-200 cursor-pointer"
            >
              <XIcon size={16} />
            </button>
          </div>
        </div>
      )}

      {qrErrorMessage && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 mb-6">
          <div className="p-3.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{qrErrorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setQrErrorMessage('')}
              className="text-rose-600 hover:text-rose-900 dark:hover:text-rose-200 cursor-pointer"
            >
              <XIcon size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ─── PROFILE HEADER ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] shadow-lg">
          <div className="relative px-6 sm:px-10 py-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Profile Avatar */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-[#00629B] bg-slate-100 dark:bg-zinc-900 flex items-center justify-center shadow-inner">
                  <span className="text-4xl font-black text-[#00629B] dark:text-[#38bdf8]">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {editing ? (
                    <input
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      placeholder="Full name"
                      className="text-2xl sm:text-3xl font-extrabold bg-transparent border-b border-[#00629B]/40 focus:border-[#00629B] outline-none text-slate-900 dark:text-white"
                    />
                  ) : (
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {member.name}
                    </h1>
                  )}

                  {/* Verified IEEE Member Badge */}
                  {member.membershipId ? (
                    <span className="inline-flex self-center sm:self-auto items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-medium">
                      <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                      <span>IEEE Verified · {member.role || 'Member'} · #{member.membershipId}</span>
                    </span>
                  ) : (
                    <span className="inline-flex self-center sm:self-auto items-center px-3 py-1 rounded-full border border-[#00629B]/50 bg-[#00629B]/10 text-[#00629B] dark:text-[#5db4e8] text-xs font-mono uppercase">
                      IEEE Member
                    </span>
                  )}
                </div>

                <p className="mt-3 text-slate-600 dark:text-zinc-400 font-medium">
                  {(editing ? form.branch : (member.branch !== 'Not set' ? member.branch : `${member.subsection || 'Mangalore Subsection'} (STB 60002)`))}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
                  {(editing ? form.year : (member.year !== 'Not set' ? member.year : `Valid through ${member.validThrough}`))}
                </p>

                {/* Header Action Buttons */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 sm:gap-3 mt-6">
                  {editing ? (
                    <>
                      <button
                        onClick={cancelEditing}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 hover:border-red-400 transition disabled:opacity-60 text-xs sm:text-sm font-medium cursor-pointer"
                      >
                        <XIcon size={16} /> Cancel
                      </button>
                      <button
                        onClick={saveEditing}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00629B] text-white hover:bg-[#00527f] transition disabled:opacity-60 text-xs sm:text-sm font-medium shadow-sm cursor-pointer"
                      >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: `${member.name} | IEEE NMAMIT`, url: window.location.href }).catch(() => {});
                          } else if (navigator.clipboard) {
                            navigator.clipboard.writeText(window.location.href).catch(() => {});
                          }
                        }}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 hover:border-[#00629B] transition text-xs sm:text-sm font-medium cursor-pointer"
                      >
                        <Share2 size={16} /> Share
                      </button>

                      <button
                        type="button"
                        onClick={() => qrFileInputRef.current?.click()}
                        disabled={qrScanning}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#00629B]/30 bg-[#00629B]/10 hover:bg-[#00629B]/20 text-[#00629B] dark:text-[#38bdf8] transition text-xs sm:text-sm font-medium cursor-pointer"
                      >
                        {qrScanning ? <Loader2 size={16} className="animate-spin" /> : <QrCode size={16} />}
                        <span>{qrScanning ? 'Reading Card...' : 'Update from QR'}</span>
                      </button>

                      <button
                        onClick={startEditing}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#00629B] text-white hover:bg-[#00527f] transition text-xs sm:text-sm font-medium shadow-sm cursor-pointer"
                      >
                        <Edit3 size={16} /> Edit Profile
                      </button>
                    </>
                  )}
                </div>

                {saveError && <p className="mt-3 text-sm text-red-500 dark:text-red-400">{saveError}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OFFICIAL IEEE DIGITAL MEMBERSHIP CARD ──────────────────── */}
      {member.membershipId && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-8">
          <div className="relative max-w-xl mx-auto bg-white dark:bg-[#0c101d] rounded-2xl border-2 border-[#00843D]/50 dark:border-[#00843D]/40 shadow-xl shadow-[#00843D]/5 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#00843D]/10">
            
            {/* Top diagonal year badge - matching the official card design */}
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 bg-[#00843D] rounded-bl-[60px] sm:rounded-bl-[70px] flex items-start justify-end p-3 sm:p-3.5 text-white font-mono font-black text-lg sm:text-2xl shadow-md select-none pointer-events-none z-10">
              <span>{cardExpiryYear}</span>
            </div>

            <div className="p-6 sm:p-8 relative z-0">
              {/* Header Tag */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#00843D] dark:text-[#22c55e] font-mono font-black text-xs sm:text-sm tracking-widest uppercase">
                  {member.role ? member.role.toUpperCase() : 'STUDENT MEMBER'}
                </span>
              </div>
              {/* Divider matching official card */}
              <div className="w-4/5 h-[1.5px] bg-[#00843D]/30 dark:bg-[#00843D]/40 mb-5" />

              {/* Member Details & QR Code Grid */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 pr-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase font-sans">
                    {member.name}
                  </h2>
                  
                  <div className="mt-2 space-y-0.5 text-sm sm:text-base">
                    <p className="font-semibold text-slate-800 dark:text-zinc-200">
                      Member # <span className="font-mono text-[#00629B] dark:text-[#38bdf8] font-bold">{member.membershipId}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
                      {member.subsection || 'Mangalore Subsection'}
                    </p>
                  </div>

                  <div className="mt-5 text-xs text-slate-600 dark:text-zinc-400 space-y-0.5">
                    <p className="text-slate-500 dark:text-zinc-500">Valued IEEE Member for 1 year</p>
                    <p className="font-semibold text-slate-800 dark:text-zinc-200">
                      Valid through {member.validThrough || '31 December 2027'}
                    </p>
                  </div>
                </div>

                {/* QR Card Emblem / Scan Preview */}
                <div className="shrink-0 flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-inner">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-[#00843D] dark:text-[#22c55e]">
                    <QrCode size={70} strokeWidth={1.5} className="sm:hidden" />
                    <QrCode size={84} strokeWidth={1.5} className="hidden sm:block" />
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mt-1">
                    VERIFIED PASS
                  </span>
                </div>
              </div>

              {/* Official Bottom Bar */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-zinc-800/80 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200">
                    Jill Gostin
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                    {cardExpiryYear} IEEE President & CEO
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-[#00629B] dark:text-[#38bdf8] font-mono font-black text-sm sm:text-base tracking-wider">
                  <span className="text-base sm:text-lg">◆</span>
                  <span>IEEE</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ─── ACADEMIC INFORMATION ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">
        <SectionHeading icon={<GraduationCap size={20} />} title="Academic Information" />

        {/* Quick Link USN Card if USN is not yet linked */}
        {(!profile?.usn || profile.usn === 'Not set') && (
          <div className="mt-5 p-5 sm:p-6 rounded-2xl border border-[#00629B]/30 bg-gradient-to-r from-[#00629B]/10 via-sky-500/5 to-transparent backdrop-blur-md shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#00629B] dark:text-[#38bdf8] font-bold text-sm sm:text-base">
                  <Sparkles size={18} className="text-[#00629B] dark:text-[#38bdf8]" />
                  <span>Connect Your NMAMIT College USN</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 max-w-xl leading-relaxed">
                  Welcome {member.name}! Your official IEEE Membership (<span className="font-mono font-bold text-[#00629B] dark:text-[#38bdf8]">#{member.membershipId}</span>) is verified. Connect your NMAMIT USN to automatically auto-fill your branch, year of study, and official college email.
                </p>
              </div>

              <form onSubmit={handleQuickLinkUsn} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="e.g. NN23CSE045"
                  value={quickUsnInput}
                  onChange={(e) => setQuickUsnInput(e.target.value.toUpperCase())}
                  className="px-3.5 py-2.5 text-xs sm:text-sm font-mono uppercase rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white outline-none focus:border-[#00629B] w-full sm:w-48 shadow-2xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-[#00629B] hover:bg-[#005080] text-white transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Link USN</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            </div>
            {quickUsnError && <p className="text-xs text-rose-500 mt-2 font-medium">{quickUsnError}</p>}
            {quickUsnSuccess && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">{quickUsnSuccess}</p>}
          </div>
        )}

        <div className="mt-5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] overflow-hidden shadow-xs">
          <InfoRow
            label="College USN"
            value={member.usn}
            editing={editing}
            inputValue={form?.usn}
            onChange={(value) => setForm({ ...form, usn: value.toUpperCase() })}
          />
          <InfoRow
            label="College Email"
            value={member.collegeEmail}
            editing={editing}
            inputValue={form?.collegeEmail}
            onChange={(value) => setForm({ ...form, collegeEmail: value })}
          />
          <InfoRow
            label="Branch"
            value={member.branch}
            editing={editing}
            inputValue={form?.branch}
            onChange={(value) => setForm({ ...form, branch: value })}
          />
          <InfoRow
            label="Year of Study"
            value={member.year}
            editing={editing}
            inputValue={form?.year}
            onChange={(value) => setForm({ ...form, year: value })}
          />
          <InfoRow
            label="IEEE Membership ID"
            value={member.membershipId || 'Not set'}
            editing={editing}
            inputValue={form?.membershipId}
            onChange={(value) => setForm({ ...form, membershipId: value })}
            badge={member.membershipId ? 'VERIFIED' : null}
          />
          <InfoRow
            label="IEEE Subsection / Branch"
            value={`${member.subsection || 'Mangalore Subsection'} · NMAMIT STB 60002`}
            editing={false}
            badge="ACTIVE"
          />
          <InfoRow
            label="Membership Validity"
            value={`Valid through ${member.validThrough || '31 December 2027'}`}
            editing={false}
            badge="2027"
          />
        </div>
      </section>

      {/* ─── BIO ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">
        <SectionHeading icon={<BookOpen size={20} />} title="Bio" />
        <div className="mt-5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6 shadow-xs">
          {editing ? (
            <textarea
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
              rows={4}
              placeholder="Tell the branch a bit about yourself..."
              className="w-full bg-transparent outline-none border border-slate-300 dark:border-zinc-700 focus:border-[#00629B] rounded-lg p-3 text-slate-700 dark:text-zinc-300"
            />
          ) : (
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">{member.bio}</p>
          )}
        </div>
      </section>

      {/* ─── MEMBER OVERVIEW ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">
        <SectionHeading icon={<Award size={20} />} title="Member Overview" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <StatCard title="Membership Status" value={member.membershipId ? 'Active' : 'Unverified'} badge={member.membershipId ? 'VERIFIED' : null} />
          <StatCard title="Member ID" value={member.membershipId || 'Not set'} />
          <StatCard title="Student Branch" value="STB 60002" />
          <StatCard title="Subsection" value="Mangalore" />
        </div>
      </section>

      {/* ─── ACHIEVEMENTS ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">
        <SectionHeading icon={<Award size={20} />} title="Achievements" />
        <div className="mt-5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6 shadow-xs">
          {editing ? (
            <div className="mb-6 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900/60 p-4 sm:p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {editingAchievementId !== null ? 'Edit achievement' : 'Add an achievement'}
              </h3>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-sm text-slate-700 dark:text-zinc-300">
                  Achievement title <span className="text-red-500">*</span>
                  <input
                    value={achievementDraft.title}
                    onChange={(event) => setAchievementDraft({ ...achievementDraft, title: event.target.value })}
                    placeholder="e.g. Hackathon Finalist"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 outline-none focus:border-[#00629B]"
                  />
                </label>
                <label className="block text-sm text-slate-700 dark:text-zinc-300">
                  Date or year
                  <input
                    value={achievementDraft.date}
                    onChange={(event) => setAchievementDraft({ ...achievementDraft, date: event.target.value })}
                    placeholder="e.g. October 2026"
                    className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 outline-none focus:border-[#00629B]"
                  />
                </label>
                <label className="block text-sm text-slate-700 dark:text-zinc-300 sm:col-span-2">
                  Description
                  <textarea
                    value={achievementDraft.description}
                    onChange={(event) => setAchievementDraft({ ...achievementDraft, description: event.target.value })}
                    placeholder="Add a short description (optional)"
                    rows={3}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 outline-none focus:border-[#00629B]"
                  />
                </label>
              </div>
              {achievementError && <p className="mt-2 text-sm text-red-500">{achievementError}</p>}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={addOrUpdateAchievement}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#00629B] px-4 py-2.5 text-white hover:bg-[#00527f] transition font-medium text-xs sm:text-sm cursor-pointer"
                >
                  {editingAchievementId !== null ? <Save size={16} /> : <Plus size={16} />}
                  {editingAchievementId !== null ? 'Update achievement' : 'Add achievement'}
                </button>
                {editingAchievementId !== null && (
                  <button type="button" onClick={resetAchievementDraft} className="rounded-lg border border-slate-300 dark:border-zinc-700 px-4 py-2.5 text-slate-700 dark:text-zinc-200 text-xs sm:text-sm cursor-pointer">
                    Cancel edit
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {displayedAchievements.length === 0 ? (
            <p className="text-slate-500 dark:text-zinc-500 text-sm">
              {editing ? 'No achievements yet. Use the form above to add one.' : 'No achievements added yet.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedAchievements.map((achievement) => (
                <article key={achievement.id} className="rounded-xl border border-slate-200 dark:border-zinc-800 p-5 shadow-2xs">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 rounded-lg bg-[#00629B]/10 p-2.5 text-[#00629B] dark:text-[#5db4e8]">
                      <Award size={21} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white break-words">{achievement.title}</h3>
                      {achievement.date && <p className="mt-1 text-xs text-slate-500 dark:text-zinc-500">{achievement.date}</p>}
                    </div>
                    {editing && (
                      <div className="flex shrink-0 gap-1">
                        <button type="button" title="Edit achievement" aria-label="Edit achievement" onClick={() => beginEditAchievement(achievement)} className="rounded-md p-2 text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800 cursor-pointer">
                          <Pencil size={16} />
                        </button>
                        <button type="button" title="Delete achievement" aria-label="Delete achievement" onClick={() => deleteAchievement(achievement.id)} className="rounded-md p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  {achievement.description && <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-zinc-400 whitespace-pre-wrap">{achievement.description}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── SOCIAL LINKS ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">
        <SectionHeading icon={<LinkIcon size={20} />} title="Social Links" />
        {editing ? (
          <div className="mt-5 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6 space-y-4 shadow-xs">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500 mb-2">Add or edit your profile links (URLs or handles)</p>
            <SocialInputRow icon={<Linkedin size={18} className="text-[#0A66C2]" />} label="LinkedIn" placeholder="https://linkedin.com/in/username" value={form?.socialLinks?.linkedin || ''} onChange={(value) => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: value } })} />
            <SocialInputRow icon={<Github size={18} className="text-slate-800 dark:text-zinc-200" />} label="GitHub" placeholder="https://github.com/username" value={form?.socialLinks?.github || ''} onChange={(value) => setForm({ ...form, socialLinks: { ...form.socialLinks, github: value } })} />
            <SocialInputRow icon={<Instagram size={18} className="text-[#E4405F]" />} label="Instagram" placeholder="https://instagram.com/username" value={form?.socialLinks?.instagram || ''} onChange={(value) => setForm({ ...form, socialLinks: { ...form.socialLinks, instagram: value } })} />
            <SocialInputRow icon={<Globe size={18} className="text-[#00629B] dark:text-[#5db4e8]" />} label="Portfolio / Website" placeholder="https://yourportfolio.com" value={form?.socialLinks?.website || ''} onChange={(value) => setForm({ ...form, socialLinks: { ...form.socialLinks, website: value } })} />
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 mt-5">
            <SocialButton icon={<Linkedin size={18} />} label="LinkedIn" href={member.socialLinks.linkedin} />
            <SocialButton icon={<Github size={18} />} label="GitHub" href={member.socialLinks.github} />
            <SocialButton icon={<Instagram size={18} />} label="Instagram" href={member.socialLinks.instagram} />
            {member.socialLinks.website && <SocialButton icon={<Globe size={18} />} label="Website" href={member.socialLinks.website} />}
            <SocialButton icon={<Mail size={18} />} label="Email" href={member.collegeEmail && member.collegeEmail !== 'Not set' ? `mailto:${member.collegeEmail}` : ''} />
          </div>
        )}
      </section>

      {/* ─── MY EVENTS ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 mt-10">
        <SectionHeading icon={<CalendarDays size={20} />} title="My Events" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {events.length === 0 ? (
            <div className="md:col-span-2 rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6 shadow-xs">
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

function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#00629B] dark:text-[#5db4e8]">{icon}</span>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
    </div>
  );
}

function InfoRow({ label, value, editing, inputValue, onChange, badge }) {
  return (
    <div className="px-6 py-4.5 border-b last:border-b-0 border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
      <div className="flex items-center gap-2">
        <p className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-500">{label}</p>
        {badge && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            {badge}
          </span>
        )}
      </div>
      {editing && onChange ? (
        <input
          value={inputValue ?? ''}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 sm:mt-0 w-full sm:max-w-md bg-transparent border-b border-slate-300 dark:border-zinc-700 focus:border-[#00629B] outline-none font-semibold text-slate-900 dark:text-white sm:text-right"
        />
      ) : (
        <p className="mt-1 sm:mt-0 font-semibold text-slate-900 dark:text-white break-words sm:text-right">{value}</p>
      )}
    </div>
  );
}

function StatCard({ title, value, badge }) {
  return (
    <div className="rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6 text-center shadow-xs">
      <div className="flex items-center justify-center gap-2">
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white truncate">{value}</p>
        {badge && (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">{title}</p>
    </div>
  );
}

function SocialInputRow({ icon, label, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="flex items-center gap-2 w-44 shrink-0">
        {icon}
        <span className="text-xs font-mono uppercase tracking-wider text-slate-700 dark:text-zinc-300">{label}</span>
      </div>
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
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
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function SocialButton({ icon, label, href }) {
  const isClickable = Boolean(href && href.trim());
  const resolvedHref = isClickable ? formatUrl(href) : null;

  if (resolvedHref) {
    return (
      <a href={resolvedHref} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] text-slate-700 dark:text-zinc-300 hover:border-[#00629B] hover:text-[#00629B] dark:hover:text-[#5db4e8] transition">
        {icon}
        <span>{label}</span>
        <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
      </a>
    );
  }

  return (
    <div title="Not provided yet" className="flex items-center gap-2 px-5 py-3 rounded-lg border border-dashed border-slate-300 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 text-slate-400 dark:text-zinc-600 cursor-not-allowed select-none">
      {icon}
      <span>{label}</span>
      <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-zinc-600">(Not set)</span>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <div className="rounded-xl border border-slate-300 dark:border-zinc-800 bg-white dark:bg-[#0a0d16] p-6 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{event.title}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">{event.date}</p>
        </div>
        <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-mono uppercase ${event.attended ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'}`}>
          {event.attended ? 'Attended' : 'Not Attended'}
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{event.description}</p>
      <div className="mt-5">
        {event.attended ? (
          <button type="button" className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-[#00629B] text-white hover:bg-[#00527f] transition font-medium text-xs sm:text-sm cursor-pointer">Give Feedback</button>
        ) : (
          <p className="text-sm text-slate-500 dark:text-zinc-500">Feedback will be available after attending the event.</p>
        )}
      </div>
    </div>
  );
}

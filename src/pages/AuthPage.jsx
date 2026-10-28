import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Hash,
  LogIn,
  UserPlus,
  Loader2,
  QrCode,
  UploadCloud,
  CheckCircle2,
  GraduationCap,
  Building2,
  ArrowLeft,
  AlertCircle,
  Sun,
  Moon,
} from 'lucide-react';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginAnonymously,
  resetPassword,
  logoutUser,
  createUserProfile,
  getUserProfile,
} from '../lib/firebase.js';
import { parseNmamitIdentity } from '../lib/nmamitId.js';
import { decodeQrFromImage, parseMemberQrPayload } from '../lib/qrHelper.js';
import FloatingLabelInput from '../components/FloatingLabelInput.jsx';

const ALLOWED_GOOGLE_DOMAIN = 'nmamit.in';

const COMMON_BRANCHES = [
  'Computer Science and Engineering (CSE)',
  'Information Science and Engineering (ISE)',
  'Electronics and Communication Engineering (ECE)',
  'Artificial Intelligence and Data Science (AI&DS)',
  'Artificial Intelligence and Machine Learning (AI&ML)',
  'Computer and Communication Engineering (CCE)',
  'Electrical and Electronics Engineering (EEE)',
  'Mechanical Engineering (MECH)',
  'Civil Engineering (CIVIL)',
  'Biotechnology Engineering (BTY)',
  'Cyber Security (CYBER)',
  'VLSI Design and Technology (VLSI)',
];

const GRAD_YEARS = ['2025', '2026', '2027', '2028', '2029'];

export default function AuthPage({
  initialMode = 'login',
  theme = 'dark',
  onToggleTheme,
  authUser,
  onNavigate,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine mode from route path or prop
  const routeMode = location.pathname.includes('register')
    ? 'register'
    : location.pathname.includes('reset')
    ? 'reset'
    : initialMode || 'login';

  const [mode, setMode] = useState(routeMode); // 'login' | 'register' | 'reset'

  // Sync mode with route changes
  useEffect(() => {
    if (location.pathname.includes('register')) {
      setMode('register');
    } else if (location.pathname.includes('login')) {
      setMode('login');
    }
  }, [location.pathname]);

  // Sub-view: Sign In with Member QR mode
  const [signInWithQr, setSignInWithQr] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [usn, setUsn] = useState('');

  // Inline Validation Errors
  const [fieldErrors, setFieldErrors] = useState({});

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);
  const [qrSuccessMessage, setQrSuccessMessage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  // Hidden File Input Ref
  const qrFileInputRef = useRef(null);

  const isLight = theme === 'light';

  // If already authenticated, redirect to profile
  useEffect(() => {
    if (authUser && !authUser.isQrSession) {
      // User is already logged in
    }
  }, [authUser]);

  // Switch tabs cleanly
  const handleTabSwitch = (newMode) => {
    setMode(newMode);
    setError('');
    setFieldErrors({});
    setResetSent(false);
    setSignInWithQr(false);
    setQrSuccessMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const friendlyError = (code) => {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password. Please verify your credentials.';
      case 'auth/email-already-in-use':
        return 'An account with this college email already exists. Try signing in.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was closed before completion.';
      default:
        return 'Authentication failed. Please check your network and try again.';
    }
  };

  // ─── Inline Validation ─────────────────────────────────────────────
  const validateField = (field, val) => {
    const nextErrors = { ...fieldErrors };

    if (field === 'email') {
      if (!val) {
        nextErrors.email = 'Email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        nextErrors.email = 'Please enter a valid email address';
      } else if (mode === 'register' && !val.toLowerCase().endsWith(`@${ALLOWED_GOOGLE_DOMAIN}`)) {
        nextErrors.email = `Must be your official @${ALLOWED_GOOGLE_DOMAIN} address`;
      } else {
        delete nextErrors.email;
      }
    }

    if (field === 'password') {
      if (!val) {
        nextErrors.password = 'Password is required';
      } else if (val.length < 6) {
        nextErrors.password = 'Password must be at least 6 characters';
      } else {
        delete nextErrors.password;
      }
    }

    if (field === 'name') {
      if (!val.trim()) {
        nextErrors.name = 'Full name is required';
      } else {
        delete nextErrors.name;
      }
    }

    if (field === 'branch') {
      if (!val.trim()) {
        nextErrors.branch = 'Branch is required';
      } else {
        delete nextErrors.branch;
      }
    }

    if (field === 'year') {
      if (!val.trim()) {
        nextErrors.year = 'Graduation year is required';
      } else {
        delete nextErrors.year;
      }
    }

    if (field === 'usn') {
      const cleanUsn = val.trim();
      if (!cleanUsn) {
        nextErrors.usn = 'College USN is required';
      } else if (cleanUsn.length < 6) {
        nextErrors.usn = 'Please enter a valid USN (e.g. NN25CSE021)';
      } else {
        delete nextErrors.usn;
      }
    }

    setFieldErrors(nextErrors);
    return nextErrors;
  };

  // ─── Standard Form Submission ──────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Sign Up Field Validation
    if (mode === 'register') {
      const errs = {};
      if (!name.trim()) errs.name = 'Full name is required';
      if (!branch.trim()) errs.branch = 'Branch is required';
      if (!year.trim()) errs.year = 'Graduation year is required';
      if (!usn.trim()) errs.usn = 'College USN is required';
      if (!email.trim()) errs.email = 'College email is required';
      else if (!email.toLowerCase().endsWith(`@${ALLOWED_GOOGLE_DOMAIN}`)) {
        errs.email = `Must be your official @${ALLOWED_GOOGLE_DOMAIN} address`;
      }
      if (!password) errs.password = 'Password is required';
      else if (password.length < 6) errs.password = 'Password must be at least 6 characters';

      if (Object.keys(errs).length > 0) {
        setFieldErrors(errs);
        return;
      }
    }

    // Sign In Validation
    if (mode === 'login') {
      if (!email.trim() || !password) {
        setError('Please enter both your email address and password.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        navigate('/profile');
      } else if (mode === 'register') {
        const cred = await registerWithEmail(email, password);
        await createUserProfile(cred.user.uid, {
          name: name.trim(),
          email: cred.user.email,
          branch: branch.trim(),
          year: year.trim(),
          usn: usn.trim().toUpperCase(),
          role: 'member',
          photoURL: '',
          bio: '',
          skills: [],
          socials: {
            linkedin: '',
            github: '',
            instagram: '',
            website: '',
          },
          achievements: [],
        });
        navigate('/profile');
      } else if (mode === 'reset') {
        if (!email.trim()) {
          setError('Please enter your college email to receive a reset link.');
          setLoading(false);
          return;
        }
        await resetPassword(email);
        setResetSent(true);
      }
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ─── Google Authentication ─────────────────────────────────────────
  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const cred = await loginWithGoogle();
      const userEmail = cred.user.email || '';

      if (!userEmail.endsWith(`@${ALLOWED_GOOGLE_DOMAIN}`)) {
        await logoutUser();
        setError(`Please use your NMAMIT college email (@${ALLOWED_GOOGLE_DOMAIN}) to sign in.`);
        return;
      }

      const existing = await getUserProfile(cred.user.uid);
      if (!existing) {
        const parsed = parseNmamitIdentity(cred.user.displayName || '');
        await createUserProfile(cred.user.uid, {
          name: parsed?.name || cred.user.displayName || 'Member',
          email: userEmail,
          branch: parsed?.branchName || parsed?.branchCode || '',
          year: parsed?.yearLabel || '',
          usn: parsed?.usn || '',
          role: 'member',
          photoURL: cred.user.photoURL || '',
          bio: '',
          skills: [],
          socials: {
            linkedin: '',
            github: '',
            instagram: '',
            website: '',
          },
          achievements: [],
        });
      }
      navigate('/profile');
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  // ─── QR Code Processing for Sign In & Sign Up ──────────────────────
  const processQrFile = async (file) => {
    if (!file) return;

    setError('');
    setQrSuccessMessage('');
    setQrScanning(true);

    try {
      const rawPayload = await decodeQrFromImage(file);
      const member = parseMemberQrPayload(rawPayload);

      if (mode === 'login' || signInWithQr) {
        // Sign In Flow with QR
        const memberUsn = member.usn || 'IEEE-MEMBER';
        const memberName = member.name || 'IEEE Member';
        const memberEmail = member.email || `${memberUsn.toLowerCase()}@nmamit.in`;

        let resolvedUid = member.uid;

        try {
          const anonUser = await loginAnonymously();
          resolvedUid = anonUser.uid;
        } catch {
          resolvedUid = `qr_${memberUsn}`;
        }

        const qrUserData = {
          uid: resolvedUid,
          email: memberEmail,
          displayName: `${memberUsn} ${memberName}`,
          name: memberName,
          usn: memberUsn,
          branch: member.branch || '',
          year: member.year || '',
          role: 'member',
          isQrSession: true,
        };

        try {
          const existing = await getUserProfile(resolvedUid);
          if (!existing) {
            await createUserProfile(resolvedUid, {
              ...qrUserData,
              bio: 'Verified IEEE Member via QR Pass',
              socialLinks: { linkedin: '', github: '', instagram: '', website: '' },
              achievements: member.achievements || [],
            });
          }
        } catch {
          // Handled via local session
        }

        window.dispatchEvent(new CustomEvent('ieee:qr-auth', { detail: qrUserData }));
        setQrSuccessMessage(`Verified pass for ${memberName} (${memberUsn})`);

        setTimeout(() => {
          navigate('/profile');
        }, 600);

      } else if (mode === 'register') {
        // Sign Up Flow with QR: Auto-fill registration form
        if (member.name) setName(member.name);
        if (member.usn) setUsn(member.usn);
        if (member.branch) setBranch(member.branch);
        if (member.year) setYear(member.year);
        if (member.email) setEmail(member.email);

        if (member.usn && (!member.branch || !member.year)) {
          const parsed = parseNmamitIdentity(`${member.usn} ${member.name || ''}`);
          if (parsed) {
            if (!member.branch && parsed.branchName) setBranch(parsed.branchName);
            if (!member.year && parsed.yearLabel) setYear(parsed.yearLabel);
          }
        }

        setFieldErrors({});
        setQrSuccessMessage(`Autofilled details for ${member.name || member.usn}. Create a password to finish.`);
      }
    } catch (err) {
      setError(err.message || 'Could not read a valid IEEE QR code from this image. Please ensure the QR is clear and well-lit.');
    } finally {
      setQrScanning(false);
      if (qrFileInputRef.current) qrFileInputRef.current.value = '';
    }
  };

  const handleQrFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) processQrFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processQrFile(file);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between selection:bg-[#00629B] selection:text-white transition-colors duration-200 ${
        isLight ? 'bg-[#FAFAFA] text-slate-900' : 'bg-[#0B0F19] text-slate-100'
      }`}
    >
      {/* Hidden File Input for QR Code scanning */}
      <input
        ref={qrFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleQrFileInput}
      />

      {/* Datalists for quick & accurate branch/year selection */}
      <datalist id="auth-branch-list">
        {COMMON_BRANCHES.map((b) => (
          <option key={b} value={b} />
        ))}
      </datalist>
      <datalist id="auth-year-list">
        {GRAD_YEARS.map((y) => (
          <option key={y} value={y} />
        ))}
      </datalist>

      {/* ─── TOP BRAND HEADER ────────────────────────────────────────── */}
      <header className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B] rounded-lg group"
        >
          <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
            <img
              src="/images/ieee-nmamit-mark-only.png"
              alt="IEEE NMAMIT"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-[#00629B] transition-colors">
                IEEE NMAMIT
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/70 dark:border-slate-700/60 leading-none">
                STB 60002
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
              Student Branch Portal
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B]"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B]"
          >
            <ArrowLeft size={14} />
            <span>Back to website</span>
          </Link>
        </div>
      </header>

      {/* ─── MAIN CONTENT: READABLE MODERATE-WIDTH COLUMN ────────────── */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-[420px] mx-auto">
          {/* Card Container */}
          <div
            className={`rounded-2xl p-6 sm:p-8 transition-colors ${
              isLight
                ? 'bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
                : 'bg-[#0E131F] border border-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.3)]'
            }`}
          >
            {/* Mode Switch (Sign in / Create account) */}
            {mode !== 'reset' && !signInWithQr && (
              <div
                role="tablist"
                aria-label="Authentication mode"
                className={`grid grid-cols-2 p-1 rounded-xl border mb-6 ${
                  isLight
                    ? 'bg-slate-100/90 border-slate-200/80'
                    : 'bg-[#111726] border-slate-800'
                }`}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'login'}
                  onClick={() => handleTabSwitch('login')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B] ${
                    mode === 'login'
                      ? isLight
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'bg-[#182136] text-white shadow-xs border border-slate-700/60'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'register'}
                  onClick={() => handleTabSwitch('register')}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B] ${
                    mode === 'register'
                      ? isLight
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'bg-[#182136] text-white shadow-xs border border-slate-700/60'
                      : isLight
                      ? 'text-slate-600 hover:text-slate-900'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create account
                </button>
              </div>
            )}

            {/* Context Header */}
            <div className="mb-6">
              <h1 className="text-xl font-heading font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                {mode === 'login' && (signInWithQr ? 'Sign in with Member Pass' : 'Sign in to your account')}
                {mode === 'register' && 'Create branch account'}
                {mode === 'reset' && 'Reset your password'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {mode === 'login' && !signInWithQr && 'Access registered events, member resources, and your branch profile.'}
                {mode === 'login' && signInWithQr && 'Upload or drop your IEEE digital pass to authenticate immediately.'}
                {mode === 'register' && 'Register with your NMAMIT credentials to activate membership access.'}
                {mode === 'reset' && 'Enter your registered college email and we will send a password reset link.'}
              </p>
            </div>

            {/* Feedback: QR Auto-fill / Success Confirmation */}
            {qrSuccessMessage && (
              <div className="mb-4 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium leading-tight">{qrSuccessMessage}</span>
              </div>
            )}

            {/* Feedback: Error Alert */}
            {error && (
              <div className="mb-4 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/80 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle size={16} className="shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <span className="leading-tight">{error}</span>
              </div>
            )}

            {/* Reset Sent Confirmation View */}
            {mode === 'reset' && resetSent ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    isLight
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300'
                  }`}
                >
                  <p className="font-semibold mb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    Password reset link sent
                  </p>
                  <p>
                    We have dispatched a reset link to <span className="font-medium underline">{email}</span>. Please verify your inbox and spam folder.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B]"
                >
                  <ArrowLeft size={14} />
                  <span>Return to sign in</span>
                </button>
              </div>
            ) : mode === 'login' && signInWithQr ? (
              /* =========================================================
                 SIGN IN WITH MEMBER QR (DRAG & DROP / FILE BROWSE)
              ========================================================= */
              <div className="space-y-4">
                <div
                  onClick={() => qrFileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    isDragOver
                      ? 'border-[#00629B] bg-[#00629B]/5'
                      : isLight
                      ? 'border-slate-300 bg-slate-50/50 hover:border-slate-400'
                      : 'border-slate-800 bg-[#0E1422] hover:border-slate-700'
                  }`}
                >
                  <div className="w-11 h-11 mx-auto rounded-xl bg-[#00629B]/10 dark:bg-[#00629B]/20 text-[#00629B] dark:text-[#38bdf8] flex items-center justify-center mb-2.5">
                    {qrScanning ? (
                      <Loader2 size={22} className="animate-spin text-[#00629B] dark:text-[#38bdf8]" />
                    ) : (
                      <QrCode size={22} />
                    )}
                  </div>

                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {qrScanning ? 'Verifying member pass...' : 'Upload IEEE Member Pass'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                    Drag and drop your badge image here, or browse from device (PNG, JPG, WebP up to 5 MB).
                  </p>

                  <button
                    type="button"
                    disabled={qrScanning}
                    className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#00629B] dark:text-[#38bdf8] bg-[#00629B]/10 dark:bg-[#00629B]/20 hover:bg-[#00629B]/15 transition-colors"
                  >
                    <UploadCloud size={14} />
                    <span>Browse image</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setSignInWithQr(false)}
                  className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5 font-medium"
                >
                  <ArrowLeft size={13} />
                  <span>Return to email and password</span>
                </button>
              </div>
            ) : (
              /* =========================================================
                 STANDARD CREDENTIAL FORMS (SIGN IN / SIGN UP / RESET)
              ========================================================= */
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Quick Fill with QR (Sign Up only) */}
                {mode === 'register' && (
                  <div className="p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#00629B]/10 dark:bg-[#00629B]/20 text-[#00629B] dark:text-[#38bdf8] flex items-center justify-center shrink-0">
                        {qrScanning ? <Loader2 size={15} className="animate-spin" /> : <QrCode size={15} />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 dark:text-slate-200 truncate">Have an IEEE QR Pass?</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Autofill your student profile in one click</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => qrFileInputRef.current?.click()}
                      disabled={qrScanning}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-[#00629B] dark:text-[#38bdf8] hover:bg-[#00629B]/10 dark:hover:bg-[#00629B]/20 transition-colors shrink-0"
                    >
                      {qrScanning ? 'Reading...' : 'Upload pass'}
                    </button>
                  </div>
                )}

                {/* SIGN UP EXCLUSIVE FIELDS */}
                {mode === 'register' && (
                  <>
                    <FloatingLabelInput
                      id="reg-name"
                      label="Full Name"
                      icon={User}
                      placeholder="e.g., Alan Turing"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) validateField('name', e.target.value);
                      }}
                      onBlur={(e) => validateField('name', e.target.value)}
                      error={fieldErrors.name}
                      required
                      theme={theme}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <FloatingLabelInput
                        id="reg-branch"
                        label="Branch"
                        icon={Building2}
                        placeholder="e.g., CSE"
                        list="auth-branch-list"
                        value={branch}
                        onChange={(e) => {
                          setBranch(e.target.value);
                          if (fieldErrors.branch) validateField('branch', e.target.value);
                        }}
                        onBlur={(e) => validateField('branch', e.target.value)}
                        error={fieldErrors.branch}
                        required
                        theme={theme}
                      />

                      <FloatingLabelInput
                        id="reg-year"
                        label="Grad Year"
                        icon={GraduationCap}
                        placeholder="e.g., 2027"
                        list="auth-year-list"
                        value={year}
                        onChange={(e) => {
                          setYear(e.target.value);
                          if (fieldErrors.year) validateField('year', e.target.value);
                        }}
                        onBlur={(e) => validateField('year', e.target.value)}
                        error={fieldErrors.year}
                        required
                        theme={theme}
                      />
                    </div>

                    <FloatingLabelInput
                      id="reg-usn"
                      label="College USN"
                      icon={Hash}
                      placeholder="e.g., NN25CSE021"
                      value={usn}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setUsn(val);
                        if (fieldErrors.usn) validateField('usn', val);
                      }}
                      onBlur={(e) => validateField('usn', e.target.value)}
                      error={fieldErrors.usn}
                      required
                      theme={theme}
                    />
                  </>
                )}

                {/* EMAIL FIELD (SIGN IN, SIGN UP, RESET) */}
                <FloatingLabelInput
                  id="auth-email"
                  type="email"
                  label={mode === 'register' ? 'College Email (@nmamit.in)' : 'College Email'}
                  icon={Mail}
                  placeholder="you@nmamit.in"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) validateField('email', e.target.value);
                  }}
                  onBlur={(e) => validateField('email', e.target.value)}
                  error={fieldErrors.email}
                  helperText={mode === 'register' ? 'Must be your official @nmamit.in address' : ''}
                  required
                  theme={theme}
                />

                {/* PASSWORD FIELD (SIGN IN, SIGN UP) */}
                {mode !== 'reset' && (
                  <FloatingLabelInput
                    id="auth-password"
                    type="password"
                    label="Password"
                    icon={Lock}
                    placeholder={mode === 'register' ? 'Create a secure password' : '••••••••'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) validateField('password', e.target.value);
                    }}
                    onBlur={(e) => {
                      if (mode === 'register') validateField('password', e.target.value);
                    }}
                    error={fieldErrors.password}
                    helperText={mode === 'register' ? 'Minimum 6 characters' : ''}
                    required
                    theme={theme}
                  />
                )}

                {/* Forgot Password Link (Sign In only) */}
                {mode === 'login' && (
                  <div className="flex justify-end pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('reset');
                        setError('');
                      }}
                      className="text-xs text-[#00629B] dark:text-[#38bdf8] hover:underline font-medium focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* PRIMARY SUBMIT ACTION */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-2 rounded-xl bg-[#00629B] hover:bg-[#005080] active:bg-[#00426b] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00629B]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>
                        {mode === 'login' && 'Signing in...'}
                        {mode === 'register' && 'Creating account...'}
                        {mode === 'reset' && 'Sending link...'}
                      </span>
                    </>
                  ) : (
                    <>
                      {mode === 'login' && <LogIn size={16} />}
                      {mode === 'register' && <UserPlus size={16} />}
                      <span>
                        {mode === 'login' && 'Sign in'}
                        {mode === 'register' && 'Create branch account'}
                        {mode === 'reset' && 'Send reset link'}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* SECONDARY & TERTIARY ACTIONS (GOOGLE & MEMBER QR) */}
            {mode !== 'reset' && !signInWithQr && (
              <div className="pt-2">
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span
                      className={`px-3 font-medium ${
                        isLight ? 'bg-white text-slate-400' : 'bg-[#0E131F] text-slate-500'
                      }`}
                    >
                      or continue with
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {/* Secondary Action: Member QR Login (Sign In mode) */}
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setSignInWithQr(true)}
                      className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B]"
                    >
                      <QrCode size={16} className="text-[#00629B] dark:text-[#38bdf8]" />
                      <span>Sign in with Member QR</span>
                    </button>
                  )}

                  {/* Tertiary Action: Google SSO */}
                  <button
                    type="button"
                    onClick={handleGoogle}
                    disabled={loading}
                    className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors flex items-center justify-center gap-2.5 shadow-2xs disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00629B]"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-3.5">
                  Restricted to @{ALLOWED_GOOGLE_DOMAIN} college accounts
                </p>
              </div>
            )}

            {/* Footer Navigation (Reset flow return) */}
            {mode === 'reset' && !resetSent && (
              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors inline-flex items-center gap-1.5 font-medium"
                >
                  <ArrowLeft size={13} />
                  <span>Back to sign in</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─── QUIET BOTTOM FOOTER ──────────────────────────────────────── */}
      <footer className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <p>
          © {new Date().getFullYear()} IEEE NMAMIT Student Branch · STB 60002 · NMAM Institute of Technology, Nitte
        </p>
      </footer>
    </div>
  );
}

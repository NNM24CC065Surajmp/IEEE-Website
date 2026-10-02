import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Hash, LogIn, UserPlus, Loader2, Chrome } from 'lucide-react';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  resetPassword,
  createUserProfile,
  getUserProfile,
} from '../lib/firebase.js';

export default function AuthModal({ isOpen, onClose, theme = 'dark' }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Extra fields collected at registration
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [usn, setUsn] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const isLight = theme === 'light';

  useEffect(() => {
    if (isOpen) {
      setError('');
      setResetSent(false);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const friendlyError = (code) => {
    const map = {
      'auth/invalid-email': 'That email address looks invalid.',
      'auth/user-not-found': 'No account found with that email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Incorrect email or password.',
      'auth/email-already-in-use': 'An account already exists with that email.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
      'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
    };
    return map[code] || 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else if (mode === 'register') {
        const user = await registerWithEmail(email, password);
        await createUserProfile(user.uid, {
          name: name.trim(),
          branch: branch.trim(),
          year,
          usn: usn.trim().toUpperCase(),
          collegeEmail: email.trim(),
          bio: '',
          membershipId: '',
        });
      } else if (mode === 'reset') {
        await resetPassword(email);
        setResetSent(true);
      }
      // App.jsx's onAuthStateChanged listener closes the modal automatically on success.
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      // First time this Google account signs in, seed a minimal profile
      // so the Profile page has something to show — the rest can be
      // filled in later from the Edit Profile screen.
      const existing = await getUserProfile(user.uid);
      if (!existing) {
        await createUserProfile(user.uid, {
          name: user.displayName || '',
          branch: '',
          year: '',
          usn: '',
          collegeEmail: user.email || '',
          bio: '',
          membershipId: '',
        });
      }
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const inputWrapClass = `mt-1 flex items-center gap-2 rounded-lg border px-3 py-2.5 ${
    isLight ? 'bg-slate-50 border-slate-200 focus-within:border-[#00629B]' : 'bg-zinc-900/80 border-zinc-800 focus-within:border-[#0096D6]'
  }`;
  const inputFieldClass = `w-full bg-transparent text-sm outline-none ${
    isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-zinc-100 placeholder:text-zinc-600'
  }`;
  const labelClass = `text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-zinc-500'}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 overflow-y-auto"
      style={{ background: 'rgba(3,4,6,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-sm rounded-2xl border p-7 shadow-2xl my-auto ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#0a0d11] border-zinc-800'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`absolute top-4 right-4 w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
            isLight
              ? 'border-slate-200 text-slate-500 hover:border-[#00629B] hover:text-[#00629B]'
              : 'border-zinc-800 text-zinc-400 hover:border-[#0096D6] hover:text-[#0096D6]'
          }`}
        >
          <X size={16} />
        </button>

        <div className="mb-6">
          <p className={labelClass}>IEEE NMAMIT · Student Branch</p>
          <h2 className={`text-xl font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {mode === 'login' && 'Welcome back'}
            {mode === 'register' && 'Create an account'}
            {mode === 'reset' && 'Reset your password'}
          </h2>
        </div>

        {mode === 'reset' && resetSent ? (
          <div
            className={`text-sm rounded-lg p-4 border ${
              isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            Password reset email sent to <span className="font-medium">{email}</span>. Check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className={labelClass}>Full Name</label>
                  <div className={inputWrapClass}>
                    <User size={15} className={isLight ? 'text-slate-400' : 'text-zinc-500'} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="NAME"
                      className={inputFieldClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Branch</label>
                    <div className={inputWrapClass}>
                      <input
                        type="text"
                        required
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="CSE / ISE / ECE..."
                        className={inputFieldClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Year</label>
                    <div className={inputWrapClass}>
                      <select
                        required
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className={`${inputFieldClass} cursor-pointer`}
                      >
                        <option value="" disabled>Select</option>
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>USN</label>
                  <div className={inputWrapClass}>
                    <Hash size={15} className={isLight ? 'text-slate-400' : 'text-zinc-500'} />
                    <input
                      type="text"
                      required
                      value={usn}
                      onChange={(e) => setUsn(e.target.value)}
                      placeholder="USN"
                      className={`${inputFieldClass} uppercase`}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className={labelClass}>{mode === 'register' ? 'College Email' : 'Email'}</label>
              <div className={inputWrapClass}>
                <Mail size={15} className={isLight ? 'text-slate-400' : 'text-zinc-500'} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@nmamit.in"
                  className={inputFieldClass}
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <label className={labelClass}>Password</label>
                <div className={inputWrapClass}>
                  <Lock size={15} className={isLight ? 'text-slate-400' : 'text-zinc-500'} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputFieldClass}
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <button
                type="button"
                onClick={() => setMode('reset')}
                className={`text-xs font-mono cursor-pointer ${isLight ? 'text-[#00629B] hover:underline' : 'text-[#0096D6] hover:underline'}`}
              >
                Forgot password?
              </button>
            )}

            {error && (
              <p className={`text-xs rounded-lg px-3 py-2 border ${isLight ? 'bg-red-50 border-red-200 text-red-600' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#00629B] hover:bg-[#00558a] text-white text-sm font-semibold py-2.5 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : mode === 'register' ? <UserPlus size={16} /> : <LogIn size={16} />}
              {mode === 'login' && 'Sign In'}
              {mode === 'register' && 'Create Account'}
              {mode === 'reset' && 'Send Reset Link'}
            </button>
          </form>
        )}

        {mode !== 'reset' && (
          <>
            <div className="flex items-center gap-3 my-5">
              <div className={`h-px flex-1 ${isLight ? 'bg-slate-200' : 'bg-zinc-800'}`} />
              <span className={`text-[10px] font-mono uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-zinc-600'}`}>or</span>
              <div className={`h-px flex-1 ${isLight ? 'bg-slate-200' : 'bg-zinc-800'}`} />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 rounded-lg border text-sm font-medium py-2.5 transition-colors disabled:opacity-60 cursor-pointer ${
                isLight ? 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50' : 'border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              <Chrome size={16} />
              Continue with Google
            </button>
            {mode === 'register' && (
              <p className={`text-[11px] mt-2 text-center ${isLight ? 'text-slate-400' : 'text-zinc-600'}`}>
                Google sign-up skips the fields above — add them later from Edit Profile.
              </p>
            )}
          </>
        )}

        <p className={`text-center text-xs mt-6 ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
          {mode === 'login' && (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" onClick={() => setMode('register')} className={isLight ? 'text-[#00629B] font-medium hover:underline cursor-pointer' : 'text-[#0096D6] font-medium hover:underline cursor-pointer'}>
                Sign up
              </button>
            </>
          )}
          {mode === 'register' && (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('login')} className={isLight ? 'text-[#00629B] font-medium hover:underline cursor-pointer' : 'text-[#0096D6] font-medium hover:underline cursor-pointer'}>
                Sign in
              </button>
            </>
          )}
          {mode === 'reset' && (
            <button type="button" onClick={() => setMode('login')} className={isLight ? 'text-[#00629B] font-medium hover:underline cursor-pointer' : 'text-[#0096D6] font-medium hover:underline cursor-pointer'}>
              ← Back to sign in
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
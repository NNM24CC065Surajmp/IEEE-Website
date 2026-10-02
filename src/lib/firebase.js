import { initializeApp } from 'firebase/app';
import {
  getAuth,
  browserSessionPersistence,
  setPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

// ─── Firebase Configuration ───────────────────────────────────────
// Replace placeholder values with your actual Firebase project config
// found in Firebase Console → Project Settings → Your apps → Config
const firebaseConfig = {
  apiKey: 'BPx0f7BZwFAyWRjE5LCDr65xTb0e_6VOx9yU6vywaWoATe6J4HUPbT5Ne7L_l-IDfL8EK481xLvGF3wyDIMa_uU',
  authDomain: 'ieee-website-nmamit.firebaseapp.com',       // ← replace
  projectId: 'ieee-website-nmamit',                        // ← replace
  storageBucket: 'ieee-website-nmamit.firebasestorage.app', // ← replace
  messagingSenderId: '000000000000',                        // ← replace
  appId: '1:000000000000:web:0000000000000000000000',       // ← replace
};

// ─── Initialize Firebase ──────────────────────────────────────────
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Force session-level persistence so the user must log in again
// every time they close the browser tab/window.
setPersistence(auth, browserSessionPersistence);

// ─── Auth Helpers ─────────────────────────────────────────────────

/** Register a new user with email + password */
export async function registerWithEmail(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

/** Sign in an existing user with email + password */
export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

/** Sign in with Google popup */
export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  return cred.user;
}

/** Send a password-reset email */
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/** Sign out the current user */
export async function logoutUser() {
  await signOut(auth);
}

/**
 * Subscribe to auth-state changes.
 * @param {function} callback – called with the Firebase User (or null).
 * @returns {function} unsubscribe function.
 */
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}

export { auth };

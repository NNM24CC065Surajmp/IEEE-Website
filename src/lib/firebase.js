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
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

// ─── Firebase Configuration ───────────────────────────────────────
// Replace placeholder values with your actual Firebase project config
// found in Firebase Console → Project Settings → Your apps → Config
const firebaseConfig = {
  apiKey: "AIzaSyBhy33lOYjC5iZbyg6aiMQHteG32CibsrQ",
  authDomain: "ieee-b6bf8.firebaseapp.com",
  projectId: "ieee-b6bf8",
  storageBucket: "ieee-b6bf8.firebasestorage.app",
  messagingSenderId: "1032672849162",
  appId: "1:1032672849162:web:bf192203879e17ac449ef3",
  measurementId: "G-4SB584FCG5"
};

// ─── Initialize Firebase ──────────────────────────────────────────
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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

// ─── User Profile Helpers (Firestore: users/{uid}) ────────────────
// NOTE: Firestore Database must be enabled in the Firebase console for
// this project, with security rules allowing a user to read/write only
// their own document, e.g.:
//
//   match /users/{uid} {
//     allow read, write: if request.auth != null && request.auth.uid == uid;
//   }

/** Create (or merge into) a user's profile document. */
export async function createUserProfile(uid, data) {
  await setDoc(
    doc(db, 'users', uid),
    { ...data, createdAt: serverTimestamp() },
    { merge: true }
  );
}

/** Fetch a user's profile document. Returns null if it doesn't exist yet. */
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

/** Update fields on an existing user profile document. */
export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() });
}

export { auth, db };
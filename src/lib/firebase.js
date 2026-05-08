// ---------------------------------------------------------------------------
// Firebase init for WanderForge.
//
// 1. In Firebase Console -> Project settings -> "Your apps" -> Web,
//    register a web app (or open the existing one) and copy the
//    `firebaseConfig` object.
// 2. Paste your values into firebaseConfig below (these values are public —
//    they identify the project, security comes from Firestore rules).
// 3. Make sure Firestore + Google Auth are enabled in the console.
// ---------------------------------------------------------------------------

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'PASTE_API_KEY_HERE',
  authDomain: 'wanderforge.firebaseapp.com',
  projectId: 'wanderforge',
  storageBucket: 'wanderforge.appspot.com',
  messagingSenderId: 'PASTE_SENDER_ID_HERE',
  appId: 'PASTE_APP_ID_HERE'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function signOutUser() {
  return signOut(auth);
}

export { onAuthStateChanged };

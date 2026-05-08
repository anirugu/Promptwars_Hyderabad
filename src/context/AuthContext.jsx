import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  auth,
  signInWithGoogle,
  signOutUser,
  onAuthStateChanged
} from '../lib/firebase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  const value = useMemo(
    () => ({
      user,
      authReady,
      signIn: signInWithGoogle,
      signOut: signOutUser
    }),
    [user, authReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

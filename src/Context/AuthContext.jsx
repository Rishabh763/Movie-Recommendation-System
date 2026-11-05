import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import app from "../firebase";

// Auth only. Bookmarks and ratings live in BookmarkContext (single source of truth).
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Remove every localStorage entry cached for this user (movie list, recommendations).
const clearUserCache = (uid) => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith(`movies_${uid}`) || key.startsWith(`recs_${uid}`))
    .forEach((key) => localStorage.removeItem(key));
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const logout = async () => {
    if (currentUser) clearUserCache(currentUser.uid);
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = { currentUser, signInWithGoogle, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

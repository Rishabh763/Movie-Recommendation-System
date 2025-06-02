import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import app from "../firebase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app); // 🔥 Firestore instance

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  const logout = async () => {
  if (currentUser) {
    localStorage.removeItem(`movies_${currentUser.uid}`);
    localStorage.removeItem(`movies_${currentUser.uid}_timestamp`);
  }
  setBookmarks([]);
  setRatings({});
  await signOut(auth);
};


  // 📥 Load user Firestore data after login
  const fetchUserData = async (uid) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, { bookmarks: [], ratings: {} });
      setBookmarks([]);
      setRatings({});
    } else {
      const data = snap.data();
      setBookmarks(data.bookmarks || []);
      setRatings(data.ratings || {});
    }
  };

  const addBookmark = async (movieId) => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    const userRef = doc(db, "users", uid);
    const updated = [...new Set([...bookmarks, movieId])];

    await updateDoc(userRef, { bookmarks: updated });
    setBookmarks(updated);
  };

  const removeBookmark = async (movieId) => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    const userRef = doc(db, "users", uid);
    const updated = bookmarks.filter((id) => id !== movieId);

    await updateDoc(userRef, { bookmarks: updated });
    setBookmarks(updated);
  };

  const rateMovie = async (movieId, rating) => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      [`ratings.${movieId}`]: rating,
    });

    setRatings((prev) => ({
      ...prev,
      [movieId]: rating,
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        await fetchUserData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    signInWithGoogle,
    logout,
    bookmarks,
    ratings,
    addBookmark,
    removeBookmark,
    rateMovie,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

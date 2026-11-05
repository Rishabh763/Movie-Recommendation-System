import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

// The signed-in user's ratings and bookmarks, keyed by MovieLens movieId.
// Stored in users/{uid} as `mlRatings` ({movieId: rating}) and `mlBookmarks` ([movieId]).
// The old `ratings` / `bookmarks` fields belonged to the 29-title demo catalog and are ignored.
const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [ratings, setRatings] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setRatings({});
    setBookmarks([]);
    if (!currentUser) return;

    (async () => {
      const ref = doc(db, "users", currentUser.uid);
      try {
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, { mlRatings: {}, mlBookmarks: [] });
        } else if (!cancelled) {
          const data = snap.data();
          setRatings(data.mlRatings || {});
          setBookmarks(data.mlBookmarks || []);
        }
      } catch (err) {
        console.error("Failed to load your ratings:", err);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  // Writes touch only the field that changed, so rapid clicks can't overwrite each other.
  const rateMovie = useCallback(
    async (movieId, rating) => {
      if (!currentUser) return;
      const key = String(movieId);
      setRatings((prev) => {
        const next = { ...prev };
        if (rating === null) delete next[key];
        else next[key] = rating;
        return next;
      });
      try {
        await updateDoc(doc(db, "users", currentUser.uid), {
          [`mlRatings.${key}`]: rating === null ? deleteField() : rating,
        });
      } catch (err) {
        console.error("Error saving rating:", err);
      }
    },
    [currentUser]
  );

  const toggleBookmark = useCallback(
    async (movieId) => {
      if (!currentUser) return;
      const id = Number(movieId);
      const nowBookmarked = !bookmarks.includes(id);
      setBookmarks((prev) =>
        nowBookmarked ? [...new Set([...prev, id])] : prev.filter((b) => b !== id)
      );
      try {
        await updateDoc(doc(db, "users", currentUser.uid), {
          mlBookmarks: nowBookmarked ? arrayUnion(id) : arrayRemove(id),
        });
      } catch (err) {
        console.error("Error saving bookmark:", err);
      }
    },
    [currentUser, bookmarks]
  );

  const value = {
    ratings,
    bookmarks,
    loaded,
    rateMovie,
    toggleBookmark,
    ratingOf: (movieId) => ratings[String(movieId)] ?? null,
    isBookmarked: (movieId) => bookmarks.includes(Number(movieId)),
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};

export const useLibrary = () => useContext(LibraryContext);

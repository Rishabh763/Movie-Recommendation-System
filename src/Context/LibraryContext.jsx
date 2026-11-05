import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
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

// The signed-in user's ratings, bookmarks and page views, keyed by MovieLens movieId.
// Stored in users/{uid} as `mlRatings` ({movieId: rating}), `mlBookmarks` ([movieId]) and
// `mlViews` ({movieId: epoch ms}). The backend weighs them rating > bookmark > view.
// The old `ratings` / `bookmarks` fields belonged to the 29-title demo catalog and are ignored.
const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [ratings, setRatings] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [views, setViews] = useState({});
  const [loaded, setLoaded] = useState(false);
  const viewedThisSession = useRef(new Set());

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setRatings({});
    setBookmarks([]);
    setViews({});
    viewedThisSession.current = new Set();
    if (!currentUser) return;

    (async () => {
      const ref = doc(db, "users", currentUser.uid);
      try {
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          await setDoc(ref, { mlRatings: {}, mlBookmarks: [], mlViews: {} });
        } else if (!cancelled) {
          const data = snap.data();
          setRatings(data.mlRatings || {});
          setBookmarks(data.mlBookmarks || []);
          setViews(data.mlViews || {});
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

  // Opening a movie's page is a weak "interested" signal. Written at most once per movie
  // per session to keep Firestore writes low.
  const recordView = useCallback(
    async (movieId) => {
      if (!currentUser) return;
      const key = String(movieId);
      if (viewedThisSession.current.has(key)) return;
      viewedThisSession.current.add(key);
      const now = Date.now();
      setViews((prev) => ({ ...prev, [key]: now }));
      try {
        await updateDoc(doc(db, "users", currentUser.uid), { [`mlViews.${key}`]: now });
      } catch (err) {
        console.error("Error saving view:", err);
      }
    },
    [currentUser]
  );

  const value = {
    ratings,
    bookmarks,
    views,
    loaded,
    rateMovie,
    toggleBookmark,
    recordView,
    ratingOf: (movieId) => ratings[String(movieId)] ?? null,
    isBookmarked: (movieId) => bookmarks.includes(Number(movieId)),
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};

export const useLibrary = () => useContext(LibraryContext);

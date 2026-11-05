import React, { createContext, useContext, useEffect, useState } from "react";
import moviesData from "../data.json";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
} from "firebase/firestore";

export const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [movies, setMovies] = useState([]);

  // Shuffle helper
  const shuffleArray = (array) => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const userDocRef = currentUser ? doc(db, "users", currentUser.uid) : null;

      if (currentUser) {
        const local = localStorage.getItem(`movies_${currentUser.uid}`);
        const localTimestamp = localStorage.getItem(
          `movies_${currentUser.uid}_timestamp`
        );
        const isExpired =
          localTimestamp &&
          Date.now() - parseInt(localTimestamp) > 24 * 60 * 60 * 1000;

        if (local && !isExpired) {
          setMovies(JSON.parse(local));
          return;
        }

        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const initialized = moviesData.map((movie) => ({
              ...movie,
              isBookmarked: userData.bookmarks?.includes(movie.id) || false,
              userRating: userData.ratings?.[movie.id] || null,
            }));
            setMovies(initialized);
            localStorage.setItem(
              `movies_${currentUser.uid}`,
              JSON.stringify(initialized)
            );
            localStorage.setItem(
              `movies_${currentUser.uid}_timestamp`,
              Date.now().toString()
            );
          } else {
            const shuffled = shuffleArray(moviesData).map((movie) => ({
              ...movie,
              isBookmarked: false,
              userRating: null,
            }));
            setMovies(shuffled);
            localStorage.setItem(
              `movies_${currentUser.uid}`,
              JSON.stringify(shuffled)
            );
            localStorage.setItem(
              `movies_${currentUser.uid}_timestamp`,
              Date.now().toString()
            );

            await setDoc(userDocRef, {
              bookmarks: [],
              ratings: {},
            });
          }
        } catch (err) {
          console.error("Firestore fetch failed:", err);
          const fallback = moviesData.map((movie) => ({
            ...movie,
            isBookmarked: false,
            userRating: null,
          }));
          setMovies(fallback);
        }
      } else {
        const fallback = moviesData.map((movie) => ({
          ...movie,
          isBookmarked: false,
          userRating: null,
        }));
        setMovies(fallback);
      }
    };

    fetchMovies();
  }, [currentUser]);

  // Persist the current movie list for this user (cache used for 24h).
  const cacheMovies = (list) => {
    localStorage.setItem(`movies_${currentUser.uid}`, JSON.stringify(list));
  };

  // Toggle bookmark. arrayUnion/arrayRemove are atomic on the server, so two quick
  // clicks (or two tabs) can't overwrite each other's changes.
  const toggleBookmark = async (title) => {
    if (!currentUser) {
      alert("Please log in to bookmark movies.");
      return;
    }

    const target = movies.find((movie) => movie.title === title);
    if (!target) return;
    const nowBookmarked = !target.isBookmarked;

    const updated = movies.map((movie) =>
      movie.id === target.id ? { ...movie, isBookmarked: nowBookmarked } : movie
    );
    setMovies(updated);
    cacheMovies(updated);

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        bookmarks: nowBookmarked ? arrayUnion(target.id) : arrayRemove(target.id),
      });
    } catch (err) {
      console.error("Error updating bookmarks:", err);
    }
  };

  // Rate movie (rating === null clears it). Writes only this movie's field instead of
  // read-modify-writing the whole ratings map, which lost updates under fast clicks.
  const rateMovie = async (title, rating) => {
    if (!currentUser) {
      alert("Please log in to rate movies.");
      return;
    }

    const target = movies.find((movie) => movie.title === title);
    if (!target) return;

    const updated = movies.map((movie) =>
      movie.id === target.id ? { ...movie, userRating: rating } : movie
    );
    setMovies(updated);
    cacheMovies(updated);

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        [`ratings.${target.id}`]: rating === null ? deleteField() : rating,
      });
    } catch (err) {
      console.error("Error updating rating:", err);
    }
  };

  return (
    <BookmarkContext.Provider value={{ movies, toggleBookmark, rateMovie }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => useContext(BookmarkContext);

import React, { createContext, useContext, useEffect, useState } from "react";
import moviesData from "../data.json";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

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
        // ✅ Try localStorage first
        const local = localStorage.getItem(`movies_${currentUser.uid}`);
        if (local) {
          setMovies(JSON.parse(local));
          return;
        }

        try {
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            // 🔁 Existing user: no shuffle
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
          } else {
            // 🆕 New user: shuffle movies
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

            // Store only bookmarks and ratings in Firestore
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
        // Not logged in: no shuffle
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

  // Toggle bookmark
  const toggleBookmark = async (title) => {
    if (!currentUser) {
      alert("Please log in to bookmark movies.");
      return;
    }

    const updated = movies.map((movie) =>
      movie.title === title
        ? { ...movie, isBookmarked: !movie.isBookmarked }
        : movie
    );
    setMovies(updated);
    localStorage.setItem(`movies_${currentUser.uid}`, JSON.stringify(updated));

    const userDocRef = doc(db, "users", currentUser.uid);
    const newBookmarks = updated.filter((m) => m.isBookmarked).map((m) => m.id);
    try {
      await updateDoc(userDocRef, { bookmarks: newBookmarks });
    } catch (err) {
      console.error("Error updating bookmarks:", err);
    }
  };

  // Rate movie
  const rateMovie = async (title, rating) => {
    if (!currentUser) {
      alert("Please log in to rate movies.");
      return;
    }

    const updated = movies.map((movie) =>
      movie.title === title ? { ...movie, userRating: rating } : movie
    );
    setMovies(updated);
    localStorage.setItem(`movies_${currentUser.uid}`, JSON.stringify(updated));

    const ratedMovie = updated.find((m) => m.title === title);
    const userDocRef = doc(db, "users", currentUser.uid);

    try {
      const docSnap = await getDoc(userDocRef);
      const oldRatings = docSnap.data().ratings || {};
      await updateDoc(userDocRef, {
        ratings: {
          ...oldRatings,
          [ratedMovie.id]: rating,
        },
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

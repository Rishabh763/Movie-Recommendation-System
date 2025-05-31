// src/Context/BookmarkContext.jsx
import React, { createContext, useContext, useState } from "react";
import moviesData from "../data.json";

// Create the context
const BookmarkContext = createContext();

// Provider component
export const BookmarkProvider = ({ children }) => {
  const [movies, setMovies] = useState(moviesData);

  const toggleBookmark = (title) => {
    const updatedMovies = movies.map((movie) =>
      movie.title === title
        ? { ...movie, isBookmarked: !movie.isBookmarked }
        : movie
    );
    setMovies(updatedMovies);
  };

  return (
    <BookmarkContext.Provider value={{ movies, toggleBookmark }}>
      {children}
    </BookmarkContext.Provider>
  );
};

// Custom hook for easier use
export const useBookmarks = () => useContext(BookmarkContext);

// ✅ Export BookmarkContext if needed directly
export { BookmarkContext };

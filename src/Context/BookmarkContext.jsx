
import React, { createContext, useContext, useState, useEffect } from "react";
import moviesData from "../data.json";

const BookmarkContext = createContext();

const LOCAL_STORAGE_KEY = "bookmarked";

const getStoredMovies = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : moviesData;
};


export const BookmarkProvider = ({ children }) => {
  const [movies, setMovies] = useState(getStoredMovies);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(movies));
  }, [movies]);

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


export const useBookmarks = () => useContext(BookmarkContext);


export { BookmarkContext };

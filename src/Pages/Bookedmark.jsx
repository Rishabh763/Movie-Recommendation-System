import React, { useContext } from "react";
import { BookmarkContext } from "../Context/BookmarkContext";
import MovieCard from "../Components/MovieCard";
import { AnimatePresence } from "framer-motion";

function Bookmarked() {
  const { movies, toggleBookmark } = useContext(BookmarkContext);

  const bookmarkedMovies = movies.filter(
    (movie) => movie.isBookmarked && movie.category === "Movie"
  );
  const bookmarkedTVSeries = movies.filter(
    (movie) => movie.isBookmarked && movie.category === "TV Series"
  );

  return (
    <div className="py-4 md:p-4">
      <h2 className="text-2xl md:text-4xl font-semibold text-white py-4 mb-2">
        Bookmarked Movies
      </h2>

      {bookmarkedMovies.length === 0 ? (
        <p className="text-gray-400 ">No bookmarked Movie.</p>
      ) : (
        <div className="special-grid">
          <AnimatePresence>
            {bookmarkedMovies.map((movie) => (
              <MovieCard key={movie.title} movie={movie} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <h2 className="text-2xl md:text-4xl font-semibold text-white py-4 mb-2">
        Bookmarked TV Series
      </h2>

      {bookmarkedTVSeries.length === 0 ? (
        <p className="text-gray-400">No bookmarked TV Series.</p>
      ) : (
        <div className="special-grid">
          <AnimatePresence>
            {bookmarkedTVSeries.map((movie) => (
              <MovieCard key={movie.title} movie={movie} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default Bookmarked;

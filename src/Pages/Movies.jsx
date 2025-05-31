import React, { useContext } from "react";
import { BookmarkContext } from "../Context/BookmarkContext";
import MovieCard from "../Components/MovieCard";

function Movies() {
  const { movies, toggleBookmark } = useContext(BookmarkContext);

  
  const Movies = movies.filter(
    (movie) => movie.category === "Movie"
  );

  return (
    <div className="p-4">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
        Movies
      </h2>

      {Movies.length === 0 ? (
        <p className="text-gray-400">No bookmarked movies.</p>
      ) : (
        <div className="special-grid">
          {Movies.map((movie, index) => (
            <MovieCard
              key={index}
              movie={movie}
              onBookmarkToggle={() => toggleBookmark(movie.title)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Movies;

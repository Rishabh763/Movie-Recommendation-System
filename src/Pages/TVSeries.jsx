import React, { useContext } from "react";
import { BookmarkContext } from "../Context/BookmarkContext";
import MovieCard from "../Components/MovieCard";

function TVSeries() {
  const { movies, toggleBookmark } = useContext(BookmarkContext);

  
  const TVSeries = movies.filter(
    (movie) => movie.category === "TV Series"
  );

  return (
    <div className="p-4">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
         TV Series
      </h2>

      {TVSeries.length === 0 ? (
        <p className="text-gray-400">No bookmarked TV Series.</p>
      ) : (
        <div className="special-grid">
          {TVSeries.map((movie, index) => (
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

export default TVSeries;

import React, { useContext } from "react";
import { BookmarkContext } from "../Context/BookmarkContext";
import MovieCard from "../Components/MovieCard";

function Bookedmark() {
  const { movies, toggleBookmark } = useContext(BookmarkContext);

  
  const bookmarkedMovies = movies.filter(
    (movie) => movie.isBookmarked &&  movie.category === "Movie"
  );
  const bookmarkedTVSeries = movies.filter(
    (movie) => movie.isBookmarked &&  movie.category === "TV Series"
  );

  return (
    <div className="p-4">
      <h2 className="text-xl md:text-2xl font-semibold text-white p-4">
        Bookmarked Movies
      </h2>

      {bookmarkedMovies.length === 0 ? (
        <p className="text-gray-400">No bookmarked Movie.</p>
      ) : (
        <div className="special-grid">
          {bookmarkedMovies.map((movie, index) => (
            <MovieCard
              key={index}
              movie={movie}
              onBookmarkToggle={() => toggleBookmark(movie.title)}
            />
          ))}
        </div>
      )}
      <h2 className="text-xl md:text-2xl font-semibold text-white p-4">
        Bookmarked TV Series
      </h2>

      {bookmarkedTVSeries.length === 0 ? (
        <p className="text-gray-400">No bookmarked TV Series.</p>
      ) : (
        <div className="special-grid">
          {bookmarkedTVSeries.map((movie, index) => (
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

export default Bookedmark;

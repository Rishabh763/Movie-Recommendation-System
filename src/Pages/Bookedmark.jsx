import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import MovieCard from "../Components/MovieCard";
import SkeletonCard from "../Components/SkeletonCard";
import { useLibrary } from "../Context/LibraryContext";
import { getMoviesByIds } from "../api";

function Bookmarked() {
  const { bookmarks, loaded } = useLibrary();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const key = [...bookmarks].sort((a, b) => a - b).join(",");

  // Fetch details only when the set of bookmarked ids changes; un-bookmarking just hides.
  useEffect(() => {
    if (!loaded) return;
    const ids = key ? key.split(",").map(Number) : [];
    if (!ids.length) {
      setMovies([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getMoviesByIds(ids)
      .then(setMovies)
      .catch(() => setError("Couldn't load your bookmarks."))
      .finally(() => setLoading(false));
  }, [key, loaded]);

  const visible = movies.filter((m) => bookmarks.includes(m.id));

  return (
    <div className="py-4 md:p-4">
      <h2 className="text-2xl md:text-4xl font-semibold text-white py-4 mb-2">Bookmarked</h2>
      {error && <p className="text-red-400">{error}</p>}
      {!loading && visible.length === 0 && !error && (
        <p className="text-gray-400">No bookmarks yet. Tap the bookmark icon on any movie.</p>
      )}
      <div className="poster-grid">
        {loading
          ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          : (
            <AnimatePresence>
              {visible.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </AnimatePresence>
          )}
      </div>
    </div>
  );
}

export default Bookmarked;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Film } from "lucide-react";
import { motion } from "framer-motion";
import { useLibrary } from "../Context/LibraryContext";
import { posterUrl } from "../api";

export function Poster({ movie, size = "w342", className = "" }) {
  const [failed, setFailed] = useState(false);
  const src = posterUrl(movie.id, size);
  if (failed) {
    return (
      <div className={`grid place-items-center bg-[#161D2F] text-gray-500 ${className}`}>
        <Film className="w-10 h-10" strokeWidth={1} />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={`${movie.title} poster`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

export function StarRating({ movieId, size = 18 }) {
  const { ratingOf, rateMovie } = useLibrary();
  const current = ratingOf(movieId) || 0;
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => rateMovie(movieId, current === star ? null : star)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            size={size}
            className={`transition-colors ${
              current >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
            }`}
          />
        </motion.button>
      ))}
    </div>
  );
}

export function BookmarkButton({ movieId, className = "" }) {
  const { isBookmarked, toggleBookmark } = useLibrary();
  const on = isBookmarked(movieId);
  return (
    <button
      type="button"
      onClick={() => toggleBookmark(movieId)}
      className={`bg-slate-900/60 p-2 rounded-full ${className}`}
      aria-label={on ? "Remove bookmark" : "Bookmark"}
    >
      <img
        src={on ? "/assets/svg_files/icon-bookmark-full.svg" : "/assets/svg_files/icon-bookmark-empty.svg"}
        alt=""
      />
    </button>
  );
}

const MovieCard = ({ movie }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="relative flex flex-col rounded-lg bg-[#161D2F] overflow-hidden"
    >
      <Link to={`/movie/${movie.id}`} className="block overflow-hidden">
        <Poster
          movie={movie}
          className="w-full aspect-[2/3] hover:scale-105 transition duration-200"
        />
      </Link>

      <BookmarkButton movieId={movie.id} className="absolute top-2 right-2" />

      {movie.predictedRating != null && (
        <span className="absolute top-2 left-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-yellow-300">
          ★ {movie.predictedRating.toFixed(1)} for you
        </span>
      )}

      <div className="flex flex-col gap-2 p-3 flex-1">
        <div className="text-gray-400 text-xs flex flex-wrap gap-x-2">
          {movie.year && <span>{movie.year}</span>}
          {movie.genres.length > 0 && <span>• {movie.genres.slice(0, 2).join(", ")}</span>}
          <span>• ★ {movie.avgRating.toFixed(1)}</span>
        </div>
        <Link to={`/movie/${movie.id}`} className="text-white font-semibold leading-snug hover:underline">
          {movie.title}
        </Link>
        {movie.because && (
          <p className="text-xs text-gray-400">
            Because you liked{" "}
            <Link to={`/movie/${movie.because.id}`} className="text-gray-200 hover:underline">
              {movie.because.title}
            </Link>
          </p>
        )}
        <div className="mt-auto pt-1">
          <StarRating movieId={movie.id} />
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MovieCard, { BookmarkButton, Poster, StarRating } from "../Components/MovieCard";
import { getMovie } from "../api";
import { useLibrary } from "../Context/LibraryContext";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState("");
  const { recordView, loaded } = useLibrary();

  // Count the visit once the user's library has loaded (so the write targets their doc).
  useEffect(() => {
    if (loaded && movie && String(movie.id) === String(id)) recordView(movie.id);
  }, [loaded, movie, id, recordView]);

  useEffect(() => {
    const controller = new AbortController();
    setMovie(null);
    setError("");
    getMovie(id, controller.signal)
      .then(setMovie)
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message || "Couldn't load this movie.");
      });
    return () => controller.abort();
  }, [id]);

  if (error) {
    return (
      <div className="py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <Link to="/" className="underline">Back to browse</Link>
      </div>
    );
  }
  if (!movie) return <div className="py-12 text-gray-400">Loading…</div>;

  return (
    <div className="py-4 md:p-4 pb-12">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <ArrowLeft className="w-4 h-4" /> Browse
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        <Poster movie={movie} size="w500" className="w-56 md:w-72 aspect-[2/3] rounded-lg shrink-0" />
        <div className="flex flex-col gap-4 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold">
            {movie.title} {movie.year && <span className="text-gray-400 font-normal">({movie.year})</span>}
          </h1>
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span key={g} className="text-xs px-2 py-1 rounded-full bg-[#161D2F] text-gray-300">
                {g}
              </span>
            ))}
          </div>
          <p className="text-gray-300">
            ★ {movie.avgRating.toFixed(2)} average from {movie.numRatings.toLocaleString()} MovieLens ratings
          </p>
          {movie.overview && <p className="text-gray-200 leading-relaxed">{movie.overview}</p>}
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Your rating</span>
            <StarRating movieId={movie.id} size={24} />
            <BookmarkButton movieId={movie.id} />
          </div>
        </div>
      </div>

      {movie.similar?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">More like this</h2>
          <div className="poster-grid">
            {movie.similar.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default MovieDetail;

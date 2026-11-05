import React, { useEffect, useRef, useState } from "react";
import MovieCard from "../Components/MovieCard";
import SkeletonCard from "../Components/SkeletonCard";
import { getGenres, searchMovies } from "../api";

const PAGE_SIZE = 24;
const SORTS = [
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Highest rated" },
  { value: "year", label: "Newest" },
  { value: "title", label: "A–Z" },
];

function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function MainContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState("popular");
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const q = useDebounced(searchTerm.trim());

  useEffect(() => {
    getGenres().then(setGenres).catch(() => setGenres([]));
  }, []);

  // New query: start again from page 1.
  useEffect(() => {
    setPage(1);
  }, [q, genre, sort]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    searchMovies({ q, genre, sort, page, pageSize: PAGE_SIZE }, controller.signal)
      .then((data) => {
        setTotal(data.total);
        setMovies((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError("Couldn't load movies. The server may be waking up; try again in a minute.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [q, genre, sort, page]);

  // Infinite scroll: load the next page when a sentinel below the grid comes within
  // 600px of the viewport. The observer is re-created whenever loading/total change so
  // it never fires while a page is already in flight.
  const sentinelRef = useRef(null);
  const hasMore = movies.length < total;
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || loading || error || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setPage((p) => p + 1);
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, error, hasMore]);

  const heading = q ? `${total.toLocaleString()} results for '${q}'` : genre ? `${genre} movies` : "Browse movies";

  return (
    <div className="relative w-full pb-8 md:p-0">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search 10,000 movies"
        className="w-full lg:mt-12 p-3 rounded-lg bg-[#161D2F] text-white placeholder-gray-400 focus:outline-none"
      />

      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <h2 className="text-xl md:text-3xl font-semibold text-white">{heading}</h2>
        <div className="flex flex-wrap gap-3">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="py-2 px-3 rounded-lg bg-[#161D2F] text-white focus:outline-none"
            aria-label="Genre"
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="py-2 px-3 rounded-lg bg-[#161D2F] text-white focus:outline-none"
            aria-label="Sort by"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-red-400 py-2">{error}</p>}

      <div className="poster-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
        {loading && [...Array(page === 1 ? 12 : 6)].map((_, i) => <SkeletonCard key={`s${i}`} />)}
      </div>

      {!loading && !error && movies.length === 0 && (
        <p className="text-gray-400 py-6">No movies match that search.</p>
      )}

      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      {!loading && !hasMore && movies.length > 0 && (
        <p className="text-center text-gray-500 py-8">You've reached the end.</p>
      )}
    </div>
  );
}

export default MainContent;

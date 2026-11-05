import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BookmarkContext } from "../Context/BookmarkContext";
import MovieCard from "../Components/MovieCard";
import { useAuth } from "../Context/AuthContext";
import SkeletonCard from "../Components/SkeletonCard";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://movie-recommendation-system-backend-m2xt.onrender.com";
const FETCH_COUNT = 8; // fetch the max once, slice to topK on the client
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

// A fingerprint of the user's ratings. If it changes, cached recommendations are stale.
const ratingsSignature = (movies) =>
  movies
    .filter((m) => m.userRating)
    .map((m) => `${m.id}:${m.userRating}`)
    .sort()
    .join(",");

// Accepts the current shape ([{id, title}]) and the old one ([title]) so the frontend
// can be deployed before the backend.
const normalizeRecs = (recs, movies) =>
  recs
    .map((r) =>
      typeof r === "object" && r !== null
        ? r.id
        : movies.find((m) => m.title === r)?.id
    )
    .filter((id) => id !== undefined);

function Recommendation() {
  const { movies } = useContext(BookmarkContext);
  const { currentUser } = useAuth();

  const [model, setModel] = useState(localStorage.getItem("rec_model") || "cosine");
  const [topK, setTopK] = useState(Number(localStorage.getItem("rec_topK")) || 4);

  const [recommendedIds, setRecommendedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Read through a ref so rating a movie on this page doesn't trigger a refetch while
  // the Firestore write may still be in flight. The signature is checked on the next
  // visit, model change, or Refresh click.
  const moviesRef = useRef(movies);
  moviesRef.current = movies;
  const moviesReady = movies.length > 0;

  useEffect(() => {
    localStorage.setItem("rec_model", model);
  }, [model]);

  useEffect(() => {
    localStorage.setItem("rec_topK", topK.toString());
  }, [topK]);

  const fetchRecommendations = useCallback(
    async (forceRefresh) => {
      if (!currentUser) return;

      const cacheKey = `recs_${currentUser.uid}_${model}`;
      const signature = ratingsSignature(moviesRef.current);

      if (!forceRefresh) {
        try {
          const cached = JSON.parse(localStorage.getItem(cacheKey));
          const fresh =
            cached &&
            Array.isArray(cached.ids) &&
            cached.signature === signature &&
            Date.now() - cached.savedAt < CACHE_TTL_MS;
          if (fresh) {
            setRecommendedIds(cached.ids);
            setError("");
            return;
          }
        } catch {
          // Corrupt or old-format cache entry: ignore and refetch.
        }
      }

      setLoading(true);
      setError("");

      try {
        const token = await currentUser.getIdToken();
        const response = await fetch(
          `${API_BASE_URL}/recommendations?model=${model}&top=${FETCH_COUNT}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || `Request failed (${response.status})`);
        }

        const ids = normalizeRecs(data.recommendations || [], moviesRef.current);
        setRecommendedIds(ids);
        if (ids.length > 0) {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ ids, signature, savedAt: Date.now() })
          );
        } else {
          setError("No recommendations found. Rate a few more movies.");
        }
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setRecommendedIds([]);
        setError("Something went wrong while fetching recommendations.");
      } finally {
        setLoading(false);
      }
    },
    [currentUser, model]
  );

  useEffect(() => {
    if (moviesReady) fetchRecommendations(false);
  }, [fetchRecommendations, moviesReady]);

  // Keep the backend's ranking order, then trim to topK.
  const recommendedMovies = useMemo(() => {
    const byId = new Map(movies.map((m) => [m.id, m]));
    return recommendedIds
      .map((id) => byId.get(id))
      .filter(Boolean)
      .slice(0, topK);
  }, [recommendedIds, movies, topK]);

  return (
    <div className="py:4 md:p-4">
      <div className="flex flex-wrap gap-4 md:flex-row items-start md:items-center justify-between">
        <h2 className="text-2xl md:text-4xl font-semibold text-white py-4">
          Recommendation
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="topK" className="text-sm font-medium">
            No. of Movies (1–8): <span className="font-bold">{topK}</span>
          </label>

          <input
            id="topK"
            type="range"
            min="1"
            max="8"
            value={topK}
            onChange={(e) => setTopK(Number(e.target.value))}
            className="w-full md:w-64 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4"
          />

          <div>
            <label htmlFor="model" className="text-white">
              Model : &nbsp;&nbsp;
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="p-2 rounded bg-gray-800 text-white"
            >
              <option value="cosine">Cosine Similarity</option>
              <option value="svd">SVD</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => fetchRecommendations(true)}
            disabled={loading}
            className="p-2 px-4 rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="special-grid mt-4">
        {loading
          ? [...Array(topK)].map((_, index) => <SkeletonCard key={index} />)
          : recommendedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
      </div>

      {!loading && error && <p className="text-red-500 py-2">{error}</p>}

      {!loading && !error && recommendedMovies.length === 0 && (
        <p className="text-gray-400 py-2">No recommendations available.</p>
      )}
    </div>
  );
}

export default Recommendation;

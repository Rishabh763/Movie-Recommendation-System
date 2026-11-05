import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import MovieCard from "../Components/MovieCard";
import SkeletonCard from "../Components/SkeletonCard";
import { useAuth } from "../Context/AuthContext";
import { useLibrary } from "../Context/LibraryContext";
import { getRecommendations, searchMovies } from "../api";

const TOP_N = 24;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const ONBOARDING_TARGET = 5;

// Fingerprint of everything the model uses: cached recommendations are stale once it changes.
const signalsSignature = ({ ratings, bookmarks, views }) =>
  [
    Object.entries(ratings).map(([id, r]) => `r${id}:${r}`).sort().join(","),
    [...bookmarks].sort((a, b) => a - b).join(","),
    Object.keys(views).sort().join(","),
  ].join("|");

const STRATEGY_TEXT = {
  popular: "You haven't rated, bookmarked or opened any movies yet, so these are the most popular ones. Rate a few below to personalise them.",
  hybrid: "Early picks from your first few ratings, bookmarks and views, blended with your favourite genres. They sharpen as you go.",
  implicit_als: "Personalised by a matrix-factorisation model trained on 32 million MovieLens ratings, weighting your ratings 70%, bookmarks 20% and movies you've opened 10%.",
};

function Recommendation() {
  const { currentUser } = useAuth();
  const { ratings, bookmarks, views, loaded } = useLibrary();
  const [recs, setRecs] = useState([]);
  const [strategy, setStrategy] = useState(null);
  const [onboarding, setOnboarding] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ratedCount = Object.keys(ratings).length;
  // Read through a ref so rating a card here doesn't refetch while the write is in flight;
  // the cache signature catches the change on the next visit or Refresh.
  const signalsRef = useRef({ ratings, bookmarks, views });
  signalsRef.current = { ratings, bookmarks, views };

  const load = useCallback(
    async (force) => {
      if (!currentUser) return;
      const cacheKey = `recs_${currentUser.uid}`;
      const signature = signalsSignature(signalsRef.current);

      if (!force) {
        try {
          const cached = JSON.parse(localStorage.getItem(cacheKey));
          if (cached && cached.signature === signature && Date.now() - cached.savedAt < CACHE_TTL_MS) {
            setRecs(cached.recs);
            setStrategy(cached.strategy);
            setError("");
            return;
          }
        } catch {
          // Corrupt or old-format entry: refetch.
        }
      }

      setLoading(true);
      setError("");
      try {
        const token = await currentUser.getIdToken();
        const data = await getRecommendations(token, TOP_N);
        setRecs(data.recommendations);
        setStrategy(data.strategy);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ recs: data.recommendations, strategy: data.strategy, signature, savedAt: Date.now() })
        );
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setError("Couldn't load recommendations. The server may be waking up; try Refresh in a minute.");
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  useEffect(() => {
    if (loaded) load(false);
  }, [load, loaded]);

  // Onboarding: popular movies to rate until the user has a handful of ratings.
  useEffect(() => {
    if (!loaded || ratedCount >= ONBOARDING_TARGET || onboarding.length) return;
    searchMovies({ sort: "popular", pageSize: 18 })
      .then((d) => setOnboarding(d.results))
      .catch(() => {});
  }, [loaded, ratedCount, onboarding.length]);

  const unratedOnboarding = useMemo(
    () => onboarding.filter((m) => !(String(m.id) in ratings)),
    [onboarding, ratings]
  );

  return (
    <div className="py-4 md:p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl md:text-4xl font-semibold text-white py-4">Recommended for you</h2>
        <button
          type="button"
          onClick={() => load(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#161D2F] text-white hover:bg-[#1f2942] disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {strategy && !loading && <p className="text-gray-400 mb-6 max-w-3xl">{STRATEGY_TEXT[strategy]}</p>}
      {error && <p className="text-red-400 py-2">{error}</p>}

      <div className="poster-grid">
        {loading
          ? [...Array(12)].map((_, i) => <SkeletonCard key={i} />)
          : recs.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

      {loaded && ratedCount < ONBOARDING_TARGET && unratedOnboarding.length > 0 && (
        <section className="mt-12">
          <h3 className="text-xl md:text-2xl font-semibold text-white">
            Rate a few you've seen ({ratedCount}/{ONBOARDING_TARGET})
          </h3>
          <p className="text-gray-400 mb-4">Then hit Refresh to see how your recommendations change.</p>
          <div className="poster-grid">
            {unratedOnboarding.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Recommendation;

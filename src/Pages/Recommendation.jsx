import React, { useContext, useEffect, useState } from "react";
import { BookmarkContext } from "../Context/BookmarkContext";
import MovieCard from "../Components/MovieCard";
import { useAuth } from "../Context/AuthContext";
import SkeletonCard from "../Components/SkeletonCard";

function Recommendation() {
  const { movies } = useContext(BookmarkContext);
  const { currentUser } = useAuth();

  // Load model and topK from localStorage if available
  const [model, setModel] = useState(localStorage.getItem("rec_model") || "cosine");
  const [topK, setTopK] = useState(Number(localStorage.getItem("rec_topK")) || 4);

  const [recommendedTitles, setRecommendedTitles] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Persist model & topK to localStorage when changed
  useEffect(() => {
    localStorage.setItem("rec_model", model);
  }, [model]);

  useEffect(() => {
    localStorage.setItem("rec_topK", topK.toString());
  }, [topK]);

  const fetchRecommendations = async () => {
    if (!currentUser) return;

    const cacheKey = `recs_${currentUser.uid}_${model}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        setRecommendedTitles(cachedData);
        return;
      } catch (e) {
        console.error("Failed to parse cached recommendations:", e);
      }
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://movie-recommendation-system-backend-m2xt.onrender.com/recommendations?uid=${currentUser.uid}&model=${model}&top=8`
      );
      const data = await response.json();

      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendedTitles(data.recommendations);
        localStorage.setItem(cacheKey, JSON.stringify(data.recommendations));
      } else {
        setRecommendedTitles([]);
        setError("No recommendations found.");
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      setError("Something went wrong while fetching recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch when model or user changes
  useEffect(() => {
    fetchRecommendations();
  }, [currentUser, model]);

  // Trim recommendations according to topK
  useEffect(() => {
    const matchedMovies = movies.filter((movie) =>
      recommendedTitles.includes(movie.title)
    );

    setRecommendedMovies(matchedMovies.slice(0, topK));
  }, [recommendedTitles, movies, topK]);

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
        </div>
      </div>

      <div className="special-grid mt-4">
        {loading
          ? [...Array(topK)].map((_, index) => <SkeletonCard key={index} />)
          : recommendedMovies.map((movie, index) => (
              <MovieCard key={index} movie={movie} />
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

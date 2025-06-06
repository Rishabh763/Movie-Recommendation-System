import React, { useContext, useEffect, useState } from "react";
import { BookmarkContext } from "../Context/BookmarkContext";
import MovieCard from "../Components/MovieCard";
import { useAuth } from "../Context/AuthContext";
import { Loader2 } from "lucide-react";
import SkeletonCard from "../Components/SkeletonCard";

function Recommendation() {
  const { movies } = useContext(BookmarkContext);
  const { currentUser } = useAuth();

  const [recommendedTitles, setRecommendedTitles] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("cosine"); // default model
  const [topK, setTopK] = useState(4); // default model
  const [error, setError] = useState("");

  const fetchRecommendations = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://movie-recommendation-system-backend-m2xt.onrender.com/recommendations?uid=${currentUser.uid}&model=${model}&top=${topK}`
      );
      const data = await response.json();

      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendedTitles(data.recommendations);
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

  useEffect(() => {
    fetchRecommendations();
  }, [currentUser, model, topK]);

  useEffect(() => {
    const matchedMovies = movies.filter((movie) =>
      recommendedTitles.includes(movie.title)
    );

    setRecommendedMovies(matchedMovies);
  }, [recommendedTitles, movies]);

  return (
    <div className="md:p-4">
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

      {/* <div className="special-grid">
        {recommendedMovies.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div> */}
    </div>
  );
}

export default Recommendation;

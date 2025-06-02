import React, { useContext, useEffect, useState } from "react";
import { BookmarkContext } from "../Context/BookmarkContext";
import MovieCard from "../Components/MovieCard";
import { useAuth } from "../Context/AuthContext";

function Recommendation() {
  const { movies } = useContext(BookmarkContext);
  const { currentUser } = useAuth();
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentUser) return;
      try {
        const response = await fetch(
          `http://localhost:5000/recommendations?uid=${currentUser.uid}`
        );
        console.log(currentUser.uid);
        const data = await response.json();
        setRecommended(data);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      }
    };
    
    fetchRecommendations();
  }, [currentUser]);
  console.log(`http://localhost:5000/recommendations?uid=${currentUser.uid}`);
        console.log(recommended)


  return (
    <div className="p-4">
      <h2 className="text-2xl md:text-4xl font-semibold text-white py-4">
        Recommendation
      </h2>

      <div className="special-grid">
        {recommended.map((movie, index) => (
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default Recommendation;

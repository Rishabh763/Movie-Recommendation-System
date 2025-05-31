import React, { useContext, useState } from "react";
import { BookmarkContext } from "../Context/BookmarkContext";
import MovieCard from "../Components/MovieCard";
import TrendingCard from "../Components/TrendingCard";

function MainContent() {
  const { movies } = useContext(BookmarkContext);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const trendingMovies = movies.filter((movie) => movie.isTrending);

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for movies or TV series"
          className="w-4/5 mt-12 p-3 rounded-lg bg-[#161D2F] text-white placeholder-gray-400 focus:outline-none"
        />
      </div>

      {/* Conditional Rendering for Search */}
      {searchTerm ? (
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4">
            Found {filteredMovies.length} results for '{searchTerm}'
          </h2>
          <div className="special-grid">
            {filteredMovies.map((movie, index) => (
              <MovieCard key={index} movie={movie} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Trending Section */}
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Trending</h2>
            <div className="w-full overflow-x-auto no-scrollbar">
              <div className="flex gap-4 w-max">
                {trendingMovies.map((movie, index) => (
                  <TrendingCard key={index} movie={movie} />
                ))}
              </div>
            </div>
          </section>

          {/* Recommended Section */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
              Recommended for you
            </h2>
            <div className="special-grid">
              {movies.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default MainContent;

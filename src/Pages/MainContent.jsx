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
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for movies or TV series"
          className="w-full lg:mt-12 p-3 rounded-lg bg-[#161D2F] text-white placeholder-gray-400 focus:outline-none"
        />
      </div>

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
          <section className="mb-10 overflow-hidden">
            <h2 className="text-xl md:text-2xl font-semibold text-white py-4">
              Trending
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth">
              <div className="flex gap-4 snap-x snap-mandatory" style={{ maxWidth: `${trendingMovies.length * 200}px` }}>
                {trendingMovies.map((movie, index) => (
                  <TrendingCard key={index} movie={movie} className="snap-center" />
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-white py-4">
              All Movies and TV Series
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

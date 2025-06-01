import React, { useContext, useState, useEffect } from "react";
import { BookmarkContext } from "../Context/BookmarkContext";
import MovieCard from "../Components/MovieCard";
import TrendingCard from "../Components/TrendingCard";
import { useAuth } from "../Context/AuthContext";
import LoginModal from "../Components/Login";

function MainContent() {
  const { currentUser } = useAuth();
  const { movies } = useContext(BookmarkContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    setFilteredMovies(movies); // initial set
  }, [movies]);

  const handleFilterChange = (value) => {
    if (value === "") {
      setFilteredMovies(movies); // reset to original
      return;
    }

    let sorted = [...movies];

    switch (value) {
      case "alphabetical":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "time":
        sorted.sort((a, b) => b.year - a.year); // Newest first
        break;
      case "movie":
        sorted = sorted.filter((m) => m.category === "Movie");
        break;
      case "tv":
        sorted = sorted.filter((m) => m.category === "TV Series");
        break;
      case "PG":
        sorted = sorted.filter((m) => m.rating === "PG");
        break;
      case "18+":
        sorted = sorted.filter((m) => m.rating === "18+");
        break;
      case "E":
        sorted = sorted.filter((m) => m.rating === "E");
        break;
      default:
        break;
    }

    setFilteredMovies(sorted);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const SearchedMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const trendingMovies = movies.filter((movie) => movie.isTrending);

  return (
    <div className="relative w-full">
      {!currentUser && <LoginModal />}

      <div className={`${!currentUser ? "pointer-events-none blur-sm" : ""}`}>
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
              Found {SearchedMovies.length} results for '{searchTerm}'
            </h2>
            <div className="special-grid">
              {SearchedMovies.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <section className="mb-10 overflow-hidden">
              <h2 className="text-2xl md:text-4xl font-semibold text-white py-4">
                Trending
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth">
                <div
                  className="flex gap-4 snap-x snap-mandatory "
                  style={{ maxWidth: `${trendingMovies.length * 200}px` }}
                >
                  {trendingMovies.map((movie, index) => (
                    <TrendingCard
                      key={index}
                      movie={movie}
                      className="snap-center"
                    />
                  ))}
                </div>
              </div>
            </section>

            <section>
              <div className="flex justify-between flex-wrap gap-x-8 ">
                <h2 className="text-xl md:text-2xl font-semibold text-white py-4">
                  All Movies and TV Series
                </h2>
                <select
                  className="mb-6 py-2 px-4 rounded-lg bg-[#161D2F] text-white placeholder-gray-400 focus:outline-none"
                  onChange={(e) => handleFilterChange(e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="time">Time</option>
                  <option value="movie">Movies</option>
                  <option value="tv">TV Series</option>
                  <optgroup label="Rating">
                    <option value="PG">PG</option>
                    <option value="18+">18+</option>
                    <option value="E">E</option>
                  </optgroup>
                </select>
              </div>

              <div className="special-grid">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default MainContent;

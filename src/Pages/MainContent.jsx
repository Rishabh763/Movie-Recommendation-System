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
  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (value) => {
    setFilterValue(value);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  useEffect(() => {
    let updated = [...movies];

    switch (filterValue) {
      case "alphabetical":
        updated.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "time":
        updated.sort((a, b) => b.year - a.year);
        break;
      case "movie":
        updated = updated.filter((m) => m.category === "Movie");
        break;
      case "tv":
        updated = updated.filter((m) => m.category === "TV Series");
        break;
      case "PG":
      case "18+":
      case "E":
        updated = updated.filter((m) => m.rating === filterValue);
        break;
      default:
        break;
    }

    // Apply search
    if (searchTerm.trim() !== "") {
      updated = updated.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMovies(updated);
  }, [movies, filterValue, searchTerm]);

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

        {searchTerm.trim() !== "" ? (
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4">
              Found {filteredMovies.length} results for '{searchTerm}'
            </h2>
            <div className="special-grid">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        ) : (
          <>
            <section className="mb-10 overflow-hidden">
              <h2 className="text-2xl md:text-4xl font-semibold text-white py-4">
                Trending
              </h2>
              <div className="flex gap-4 overflow-x-scroll snap-x snap-mandatory pb-4 scrollbar-hide scroll-smooth">
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

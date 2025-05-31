import React from "react";
import { useBookmarks } from "../Context/BookmarkContext";

function TrendingCard({ movie }) {
  const { toggleBookmark } = useBookmarks();

  return (
    <div className="relative snap-start min-w-[240px] md:min-w-[470px] h-36 md:h-60 rounded-md overflow-hidden">
      <picture>
        <source media="(min-width: 768px)" srcSet={movie.thumbnail.trending.large} />
        <img src={movie.thumbnail.trending.small} alt={movie.title} className="w-full h-full object-cover" />
      </picture>

      <button
        onClick={() => toggleBookmark(movie.title)}
        className="absolute top-2 right-2 bg-slate-600/40 p-2 rounded-full cursor-pointer"
      >
        <img
          src={
            movie.isBookmarked
              ? "/assets/svg_files/icon-bookmark-full.svg"
              : "/assets/svg_files/icon-bookmark-empty.svg"
          }
          alt="Bookmark"
        />
      </button>

      <div className="absolute bottom-4 left-4 text-white ">
        <div className="text-slate-300 text-base flex gap-2">
          <span>{movie.year}</span>
          <span>•</span>
          <span className="grid place-content-center">
            <img
              src={`/assets/svg_files/icon-category-${movie.category
                .split(" ")[0]
                .toLowerCase()}.svg`}
              alt={`${movie.category}-img`}
            />
          </span>
          <span>{movie.category}</span>
          <span>•</span>
          <span>{movie.rating}</span>
        </div>
        <h3 className="text-white font-semibold text-xl mt-2">{movie.title}</h3>
      </div>
    </div>
  );
}

export default TrendingCard;

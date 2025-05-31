import React from "react";
import { useBookmarks } from "../Context/BookmarkContext";

function TrendingCard({ movie }) {
  const { toggleBookmark } = useBookmarks();

  return (
    <div className="relative min-w-[240px] md:min-w-[470px] h-36 md:h-60 rounded-md overflow-hidden">
      <picture>
        <source media="(min-width: 768px)" srcSet={movie.thumbnail.trending.large} />
        <img src={movie.thumbnail.trending.small} alt={movie.title} className="w-full h-full object-cover" />
      </picture>

      <div
        onClick={() => toggleBookmark(movie.title)}
        className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded-full cursor-pointer"
      >
        <img
          src={
            movie.isBookmarked
              ? "/assets/svg_files/icon-bookmark-full.svg"
              : "/assets/svg_files/icon-bookmark-empty.svg"
          }
          alt="Bookmark"
        />
      </div>

      <div className="absolute bottom-2 left-2 text-white text-sm">
        <p className="font-medium">{movie.title}</p>
      </div>
    </div>
  );
}

export default TrendingCard;

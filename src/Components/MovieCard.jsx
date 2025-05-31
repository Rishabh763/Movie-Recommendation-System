import React from "react";
import { useBookmarks } from "../Context/BookmarkContext";

const MovieCard = ({ movie }) => {
  const { toggleBookmark } = useBookmarks(); 
  const { title, year, category, rating, thumbnail, isBookmarked } = movie;

  return (
    <div className="relative overflow-hidden shadow-lg">
      <picture>
        <source media="(min-width: 1024px)" srcSet={thumbnail.regular.large} />
        <source media="(min-width: 640px)" srcSet={thumbnail.regular.medium} />
        <img
          src={thumbnail.regular.small}
          alt={title}
          className="w-full aspect-video object-cover rounded-lg"
        />
      </picture>

      <div className="p-4">
        <div className="text-gray-400 text-sm flex gap-2">
          <span>{year}</span>
          <span>•</span>
          <span className="grid place-content-center">
            <img
              src={`/assets/svg_files/icon-category-${category
                .split(" ")[0]
                .toLowerCase()}.svg`}
              alt={`${category}-img`}
            />
          </span>
          <span>{category}</span>
          <span>•</span>
          <span>{rating}</span>
        </div>
        <h3 className="text-white font-semibold text-lg mt-1">{title}</h3>
      </div>

      <button
        className="absolute top-2 right-2 bg-slate-600/40 p-2 rounded-full"
        onClick={() => toggleBookmark(title)} // ✅ use title to toggle
      >
        {isBookmarked ? (
          <img src="/assets/svg_files/icon-bookmark-full.svg" alt="Bookmarked" />
        ) : (
          <img src="/assets/svg_files/icon-bookmark-empty.svg" alt="Bookmark" />
        )}
      </button>
    </div>
  );
};

export default MovieCard;

import React from "react";
import { useBookmarks } from "../Context/BookmarkContext";
import { Star } from "lucide-react";

const MovieCard = ({ movie }) => {
  const { toggleBookmark, rateMovie } = useBookmarks(); // <-- new function
  const { title, year, category, rating, thumbnail, isBookmarked, userRating = 0 } = movie;

  const handleRating = (ratingValue) => {
    rateMovie(title, ratingValue); // Update userRating in context
  };

  return (
    <div className="relative overflow-hidden shadow-lg z-10">
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

        
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              className={`cursor-pointer transition-colors ${
                userRating >= star ? "text-yellow-400" : "text-gray-500"
              }`}
              onClick={() => handleRating(star)}
              fill={userRating >= star ? "currentColor" : "none"}
            />
          ))}
        </div>
      </div>

      {/* Bookmark button */}
      <button
        className="absolute top-2 right-2 bg-slate-600/40 p-2 rounded-full"
        onClick={() => toggleBookmark(title)}
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

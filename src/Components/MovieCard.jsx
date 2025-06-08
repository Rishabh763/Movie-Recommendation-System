import React from "react";
import { useBookmarks } from "../Context/BookmarkContext";
import { Star, Trash } from "lucide-react";
import { motion } from "framer-motion";

const MovieCard = ({ movie }) => {
  const { toggleBookmark, rateMovie } = useBookmarks();
  const {
    title,
    year,
    category,
    rating,
    thumbnail,
    isBookmarked,
    userRating = 0,
  } = movie;

  const handleRating = (ratingValue) => {
    if (userRating === ratingValue) {
      rateMovie(title, null); // Unrate
    } else {
      rateMovie(title, ratingValue); // Set new rating
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-lg shadow-lg z-10"
    >
      <picture className="rounded-lg overflow-hidden" loading="lazy">
        {/* <source media="(min-width: 1024px)" srcSet={thumbnail.regular.large} /> */}
        {/* <source media="(min-width: 640px)" srcSet={thumbnail.regular.medium} /> */}
        <img
          src={thumbnail.regular.small}
          alt={title}
          className="w-full aspect-video object-cover hover:scale-105 transition duration-200"
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

        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.div
              key={star}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Star
                size={20}
                onClick={() => handleRating(star)}
                className={`cursor-pointer transition-all duration-300 ease-in-out ${
                  userRating >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-500 fill-transparent"
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bookmark button */}
      <button
        className="absolute top-2 right-2 bg-slate-600/40 p-2 rounded-full"
        onClick={() => toggleBookmark(title)}
        alt="icon-bookmark"
      >
        {isBookmarked ? (
          <img
            src="/assets/svg_files/icon-bookmark-full.svg"
            alt="Bookmarked"
          />
        ) : (
          <img src="/assets/svg_files/icon-bookmark-empty.svg" alt="Bookmark" />
        )}
      </button>
    </motion.div>
  );
};

export default MovieCard;

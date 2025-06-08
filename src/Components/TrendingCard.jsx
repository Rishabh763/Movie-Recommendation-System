import React from "react";
import { useBookmarks } from "../Context/BookmarkContext";
import { motion } from "framer-motion";

function TrendingCard({ movie }) {
  const { toggleBookmark } = useBookmarks();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative snap-start min-w-[90%] sm:min-w-[600px] rounded-xl overflow-hidden"
    >
      <picture>
        <source
          media="(min-width: 1024px)"
          srcSet={movie.thumbnail.trending.large}
        />
        <img
          src={movie.thumbnail.trending.small}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
        />
      </picture>

      {/* Bookmark Button */}
      <button
        onClick={() => toggleBookmark(movie.title)}
        className="absolute top-2 right-2 bg-slate-600/40 p-2 rounded-full cursor-pointer z-10"
        alt="icon-bookmark"
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

      {/* Text Content Fade In & Slide Up */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateZ: 15 }}
        animate={{ opacity: 1, y: 0, rotateZ: 0 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        className="origin-left absolute bottom-4 left-4 text-white backdrop-blur-sm bg-black/30 p-2 rounded-md"
      >
        <div className="text-slate-300 text-base flex gap-2 flex-wrap items-center">
          <span>{movie.year}</span>
          <span>•</span>
          <span className="grid place-content-center">
            <img
              src={`/assets/svg_files/icon-category-${movie.category
                .split(" ")[0]
                .toLowerCase()}.svg`}
              alt={`${movie.category}-img`}
              className="w-4 h-4"
            />
          </span>
          <span>{movie.category}</span>
          <span>•</span>
          <span>{movie.rating}</span>
        </div>
        <h3 className="text-white font-semibold text-xl mt-2">{movie.title}</h3>
      </motion.div>
    </motion.div>
  );
}

export default TrendingCard;

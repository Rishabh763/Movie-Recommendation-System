import React from "react";

const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-[#161D2F] rounded-lg overflow-hidden">
      <div className="w-full aspect-[2/3] bg-gray-700/60" />
      <div className="p-3">
        <div className="h-3 bg-gray-600 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-600 rounded w-3/4 mb-3"></div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-4 bg-gray-600 rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;

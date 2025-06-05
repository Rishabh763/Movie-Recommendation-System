import React from "react";

const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-gray-800 rounded-lg overflow-hidden shadow-md">
      <div className="w-full aspect-video bg-gray-700" />
      <div className="p-4">
        <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-600 rounded w-1/2 mb-2"></div>
        <div className="flex gap-2 mt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-4 bg-gray-600 rounded-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;

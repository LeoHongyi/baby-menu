import React from "react";

const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="flex items-center gap-4 p-4">
      <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse" />
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;

import React from 'react';

const JobCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden animate-pulse">
      <div className="p-6">
        
        {/* Title placeholder */}
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
        
        {/* Description placeholder */}
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6 mb-6"></div>
        
        {/* Department */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
        </div>

        {/* Location */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>

        {/* Deadline */}
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>

        {/* Button placeholder */}
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded-xl w-full mt-6"></div>
      </div>
    </div>
  );
};

export default JobCardSkeleton;

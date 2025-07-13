import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const PageNavigator = ({ filteredComplaints, rowsPerPage, currentPage, totalPages, handlePageChange, pageNumbers }) => {
  if (filteredComplaints.length <= rowsPerPage) return null;

  // Show limited page numbers on mobile
  const getVisiblePageNumbers = () => {
    const delta = 2; // Show 2 pages before and after current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = totalPages <= 7 ? pageNumbers : getVisiblePageNumbers();

  return (
    <div className="mt-4 sm:mt-6 space-y-3 flex flex-col items-center">
      {/* Page Info Text */}
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
        Page {currentPage} of {totalPages}
      </p>

      {/* Pagination Buttons */}
      <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2">
        {/* First and Previous buttons */}
        <div className="flex gap-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">First</span>
            <span className="sm:hidden">‹‹</span>
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MdChevronLeft className="text-sm sm:text-base" />
          </button>
        </div>

        {/* Page Numbers */}
        <div className="flex flex-wrap justify-center gap-1 max-w-xs sm:max-w-none overflow-x-auto">
          {visiblePages.map((num, index) => (
            <button
              key={index}
              onClick={() => typeof num === 'number' && handlePageChange(num)}
              disabled={num === '...'}
              className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded transition-colors ${
                currentPage === num
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : num === '...'
                  ? 'bg-transparent text-gray-400 cursor-default'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Next and Last buttons */}
        <div className="flex gap-1">
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MdChevronRight className="text-sm sm:text-base" />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="hidden sm:inline">Last</span>
            <span className="sm:hidden">››</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNavigator;
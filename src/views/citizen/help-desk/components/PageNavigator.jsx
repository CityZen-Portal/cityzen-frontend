import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const DOTS = '...';

const PageNavigator = ({ totalPages, currentPage, handlePageChange }) => {
  if (totalPages <= 1) return null;

  const siblingCount = 1;
  const totalPageNumbersToShow = siblingCount + 5;
  let paginationRange;

  if (totalPages <= totalPageNumbersToShow) {
    paginationRange = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      paginationRange = [...leftRange, DOTS, totalPages];
    } else if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      paginationRange = [firstPageIndex, DOTS, ...rightRange];
    } else {
      let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
      paginationRange = [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }

  return (
    <div className="mt-6 space-y-3 flex flex-col items-center">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-700 transition-colors"
        >
          <MdChevronLeft size={20} />
        </button>

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return <span key={`${DOTS}-${index}`} className="px-3 py-1 text-gray-500">...</span>;
          }

          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currentPage === pageNumber
                  ? 'bg-brand-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-700'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-700 transition-colors"
        >
          <MdChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default PageNavigator;
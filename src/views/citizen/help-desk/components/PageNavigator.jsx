import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const PageNavigator = ({ filteredComplaints, rowsPerPage, currentPage, totalPages, handlePageChange, pageNumbers }) => {
  if (filteredComplaints.length <= rowsPerPage) return null;

  return (
    <div className="mt-6 space-y-3 flex flex-col items-center">
      {/* Page Info Text */}
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </p>

      {/* Pagination Buttons Centered */}
      <div className="flex flex-wrap justify-center gap-1">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          <MdChevronLeft />
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`px-3 py-1 rounded ${currentPage === num
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-300'}`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          <MdChevronRight />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default PageNavigator;

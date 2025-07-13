import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-4 flex justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`rounded-lg px-3 py-1 text-sm font-medium ${currentPage === 1
          ? 'bg-gray-300 text-white cursor-not-allowed'
          : 'bg-brand-500 text-white hover:bg-brand-600'
        }`}
      >
        Previous
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`rounded-lg px-3 py-1 text-sm font-medium ${currentPage === index + 1
            ? 'bg-brand-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-navy-700 dark:hover:bg-navy-600 text-gray-700 dark:text-white'
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`rounded-lg px-3 py-1 text-sm font-medium ${currentPage === totalPages
          ? 'bg-gray-300 text-white cursor-not-allowed'
          : 'bg-brand-500 text-white hover:bg-brand-600'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

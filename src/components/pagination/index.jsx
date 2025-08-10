import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-4 flex justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`rounded-lg px-3 py-1 text-sm font-medium bg-gray-300 text-white cursor-not-allowed dark:bg-brand-500  hover:bg-brand-600
        }`}
      >
        Previous
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`rounded-lg px-3 py-1 text-sm font-medium   
            bg-gray-400 hover:bg-gray-200 dark:bg-gary-600 dark:hover:bg-gray-500 text-dark dark:text-white'
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
         className={`rounded-lg px-3 py-1 text-sm font-medium bg-gray-300 text-white cursor-not-allowed dark:bg-brand-500  hover:bg-brand-600`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

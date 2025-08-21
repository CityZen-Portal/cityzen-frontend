import React from 'react';

/**
 * @param {string} userRole - The role of the user ('admin', 'citizen', 'staff'). Determines the layout.
 */
const SkeletonRow = ({ userRole = 'citizen' }) => {
  return (
    <>
      {/* --- DESKTOP SKELETON ROW --- */}
      <tr className={`dark:bg-navy-700 transition-colors ${userRole === 'citizen' ? 'hidden md:table-row' : ''}`}>
        {/* Common cells for all roles */}
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </td>

        {/* Extra cell, only for citizen role (for the 'Feedback' column) */}
        {userRole === 'citizen' && (
          <td className="px-6 py-4">
            <div className="h-8 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </td>
        )}
      </tr>

      {/* --- MOBILE SKELETON CARD --- */}
      {userRole === 'citizen' && (
        <tr className="md:hidden">
          <td colSpan="100%" className="p-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg m-2 p-4 shadow-sm animate-pulse">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-3 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="h-5 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>
              {/* Card Body */}
              <div className="space-y-2 mb-4">
                <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
              {/* Card Footer (Action Buttons) */}
              <div className="flex flex-col sm:flex-row gap-2 pt-3">
                <div className="h-10 w-full bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                <div className="h-10 w-full bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default SkeletonRow;
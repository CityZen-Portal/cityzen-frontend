import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';

const Row = ({ complaint, getStatusColor, getStatusText, link }) => {
  const navigate = useNavigate()
  return (
    <>
      {/* Desktop Table Row - Hidden on mobile */}
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hidden md:table-row">
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-r">{complaint.id}</td>
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-r">{complaint.issue}</td>
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-r">{complaint.department}</td>
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-r">{complaint.dateLogged}</td>
        <td className="px-6 py-4 border-r">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
            {getStatusText(complaint.status)}
          </span>
        </td>

        {/* View Button */}
        <td className="px-6 py-4 border-r whitespace-nowrap text-sm text-gray-900 dark:text-white">
          <button 
            onClick={() => navigate(`/citizen/help-desk/complaint/view/${complaint.id}`)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center text-sm transition-colors duration-200">
            <FaEye className="mr-1 text-xs" /> View
          </button>
        </td>

        <td className="px-6 py-4">
          <button
            onClick={() => {
              navigate(link);
              window.scrollTo(0, 0);
            }}
            disabled={complaint.status !== 'resolved'}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              complaint.status === 'resolved'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Give Feedback
          </button>
        </td>
      </tr>

      {/* Mobile Card Layout - Hidden on desktop */}
      <tr className="md:hidden">
        <td colSpan="100%" className="p-0">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg m-2 p-4 shadow-sm hover:shadow-md transition-shadow">
            {/* Header with ID and Status */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 dark:text-gray-400">ID</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{complaint.id}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                {getStatusText(complaint.status)}
              </span>
            </div>

            {/* Issue */}
            <div className="mb-3">
              <span className="text-xs text-gray-500 dark:text-gray-400">Issue</span>
              <p className="text-sm text-gray-900 dark:text-white mt-1 break-words">{complaint.issue}</p>
            </div>

            {/* Department and Date */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Department</span>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{complaint.department}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Date Logged</span>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{complaint.dateLogged}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => navigate(`/citizen/help-desk/complaint/view/${complaint.id}`)}
                className="flex items-center justify-center px-4 py-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 border border-blue-600 dark:border-blue-400 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <FaEye className="mr-2 text-xs" /> View Details
              </button>
              
              <button
                onClick={() => {
                  navigate(link);
                  window.scrollTo(0, 0);
                }}
                disabled={complaint.status !== 'resolved'}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  complaint.status === 'resolved'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Give Feedback
              </button>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

export default Row;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import RateButton from './RateButton';

const Row = ({ complaint, getStatusColor, getStatusText, link }) => {
  const navigate = useNavigate()
  return (
    <>
      {/* Desktop Table Row - Hidden on mobile */}
      <tr className="dark:bg-navy-700 hover:bg-n-50 transition-colors hidden md:table-row">
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{complaint.id}</td>
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{complaint.issue.length > 25 ? `${complaint.issue.slice(0, 25)}...` : complaint.issue}</td>
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{complaint.department ? complaint.department : complaint.category}</td>
        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-max w-max">{complaint.complaintDate && complaint.complaintDate.split('T')[0]}</td>
        <td className="flex justify-center px-6 py-4">
          <span className={`flex justify-center text-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
            {getStatusText(complaint.status)}
          </span>
        </td>

        {/* View Button */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
          <button 
            onClick={() => navigate(`/citizen/help-desk/complaint/view/${complaint.id}`)}
            className="text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 flex items-center text-sm transition-colors duration-200">
            <FaEye className="mr-1 text-xs" /> View
          </button>
        </td>

        <td className="flex justify-center px-6 py-4">
          <RateButton
            feedback={complaint.feedback}
            status={complaint.status}
            link={link}
            />
        </td>
      </tr>

      {/* Mobile Card Layout - Hidden on desktop */}
      <tr className="md:hidden dark:bg-navy-700">
        <td colSpan="100%" className="p-0">
          <div className="bg-white dark:bg-navy-700 rounded-lg m-2 p-4 shadow-sm hover:shadow-md transition-shadow">
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
              <p className="text-sm text-gray-900 dark:text-white mt-1 break-words">
                {complaint.issue.length > 35 ? `${complaint.issue.slice(0, 35)}...` : complaint.issue}
              </p>
            </div>

            {/* Department and Date */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Department</span>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{complaint.department ? complaint.department : complaint.category}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Date</span>
                <p className="text-sm text-gray-900 dark:text-white mt-1">{complaint.complaintDate && complaint.complaintDate.split('T')[0]}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-3">
              <button 
                onClick={() => navigate(`/citizen/help-desk/complaint/view/${complaint.id}`)}
                className="flex items-center justify-center px-4 py-2 text-brand-600 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 border border-brand-600 dark:border-brand-400 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-brand-50 dark:hover:bg-brand-900/20">
                <FaEye className="mr-2 text-xs" /> View Details
              </button>
              
              <RateButton
                feedback={complaint.feedback}
                status={complaint.status}
                link={link}
                />
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

export default Row;
import React from 'react';
import { MdEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Row = ({ complaint, getStatusColor, getStatusText }) => {
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      {/* Complaint ID */}
      <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
        <div className="font-medium">{complaint.id}</div>
      </td>

      {/* Issue */}
      <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
        <div className="max-w-32 sm:max-w-48 lg:max-w-none truncate" title={complaint.issue}>
          {complaint.issue}
        </div>
      </td>

      {/* Department */}
      <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
        <div className="max-w-24 sm:max-w-32 lg:max-w-none truncate" title={complaint.department}>
          {complaint.department}
        </div>
      </td>

      {/* Location */}
      <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
        <div className="max-w-24 sm:max-w-32 lg:max-w-none truncate" title={complaint.location}>
          {complaint.location}
        </div>
      </td>

      {/* Date Logged */}
      <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
        <div className="whitespace-nowrap">{complaint.dateLogged}</div>
      </td>

      {/* Status + Edit Button */}
      <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(complaint.status)}`}>
            <span className="hidden sm:inline">{getStatusText(complaint.status)}</span>
            <span className="sm:hidden">
              {complaint.status === 'pending' ? 'P' : 
               complaint.status === 'under-review' ? 'UR' :
               complaint.status === 'assigned' ? 'A' :
               complaint.status === 'in-progress' ? 'IP' :
               complaint.status === 'on-hold' ? 'OH' :
               complaint.status === 'resolved' ? 'R' :
               complaint.status === 'rejected' ? 'RJ' :
               complaint.status.charAt(0).toUpperCase()}
            </span>
          </span>
          <button
            onClick={() => navigate(`/admin/complaints/update/${complaint.id}`)}
            className="px-1.5 sm:px-2 py-1 bg-blue-1000 text-white rounded-md hover:bg-blue-700 text-xs inline-flex items-center transition-colors duration-200 flex-shrink-0"
            title="Edit"
          >
            <MdEdit className="text-xs sm:text-sm" />
          </button>
        </div>
      </td>

      {/* View Button */}
      <td className="px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 dark:text-white">
        <button 
          onClick={() => navigate(`/admin/complaints/view/${complaint.id}`)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center text-xs sm:text-sm transition-colors duration-200"
        >
          <FaEye className="text-xs sm:text-sm flex-shrink-0" />
          <span className="hidden sm:inline ml-1">View</span>
        </button>
      </td>
    </tr>
  );
};

export default Row;
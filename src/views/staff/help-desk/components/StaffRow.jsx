import React from 'react';
import { FaEye } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used for navigation

const StaffRow = ({ complaint }) => {
  const { id, citizen, issue, department, dateLogged, location, status } = complaint;
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-200 dark:text-yellow-900';
      case 'under-review': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-200 dark:text-blue-900';
      case 'assigned': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-200 dark:text-purple-900';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-200 dark:text-indigo-900';
      case 'on-hold': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-200 dark:text-orange-900';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-200 dark:text-green-900';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-200 dark:text-gray-900';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-200 dark:text-red-900';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-200 dark:text-gray-900';
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'under-review': 'Under Review',
      'assigned': 'Assigned',
      'in-progress': 'In Progress',
      'on-hold': 'On Hold',
      'resolved': 'Resolved',
      'closed': 'Closed',
      'rejected': 'Rejected'
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-r">{id}</td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-r">{citizen}</td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-r">{issue}</td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-r">{department}</td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-r">{dateLogged}</td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-r">{location}</td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white border-r">
        <div className="flex justify-between items-center w-full">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)} inline-flex items-center`}>
            {formatStatus(status)}
          </span>
          <button
            onClick={() => navigate(`/staff/complaints/update-details`)}
            className="px-2 py-1 bg-blue-1000 text-white rounded-md hover:bg-blue-700 text-xs inline-flex items-center transition-colors duration-200"
          >
            <MdEdit className="text-sm" />
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        <button 
          onClick={() => navigate(``)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center text-sm transition-colors duration-200">
          <FaEye className="mr-1 text-xs" /> View
        </button>
      </td>
    </tr>
  );
};
export default StaffRow;
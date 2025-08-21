import React from 'react';
import { MdEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getStatusColor, getStatusText } from '../utils/helpers';
import RateButton from 'views/citizen/help-desk/components/RateButton';

/**
 * @param {Object} complaint
 * @param {string} userRole - The role of the user ('admin', 'citizen', 'staff').
 */
const Row = ({ complaint, userRole = 'citizen' }) => {
  const navigate = useNavigate();

  // Dynamically determine paths and text based on userRole
  const departmentText = userRole === 'admin'
    ? (complaint.department || 'N/A')
    : (complaint.department || complaint.category);

  const viewPath = {
    admin: `/admin/complaints/view/${complaint.id}`,
    staff: `/staff/complaints/view-details/${complaint.id}`,
    citizen: `/citizen/help-desk/complaint/${complaint.id}`,
  }[userRole];

  const editPath = {
    admin: `/admin/complaints/update/${complaint.id}`,
    staff: `/staff/complaints/update-details/${complaint.id}`,
  }[userRole];

  const feedbackPath = `/citizen/help-desk/complaint/feedback/${complaint.id}`;

  return (
    <>
      {/* --- DESKTOP TABLE ROW --- */}
      {/* This row is hidden on mobile for citizens, but visible for admin/staff on all screen sizes */}
      <tr className={`transition-colors dark:bg-navy-800 hover:bg-n-50 ${userRole === 'citizen' ? 'hidden md:table-row' : ''}`}>
        
        {/* ID, Issue, Department, Date (Common structure) */}
        <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 dark:text-white">{complaint.id}</td>
        <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 dark:text-white truncate max-w-xs" title={complaint.issue} style={{maxWidth: "250px"}} >
          {complaint.issue}
        </td>
        <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 dark:text-white">{departmentText}</td>
        <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
          {complaint.complaintDate && complaint.complaintDate.split('T')[0]}
        </td>
        
        {/* Status */}
        <td className="px-4 lg:px-6 py-4">
          {userRole === 'citizen' ? (
            <span className={`flex justify-center text-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
              {getStatusText(complaint.status)}
            </span>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(complaint.status)}`}>
                <span className="hidden sm:inline">{getStatusText(complaint.status)}</span>
                <span className="sm:hidden">
                  {/* Abbreviated status for small screens */}
                  {{
                    'pending': 'P', 'under-review': 'UR', 'assigned': 'A', 'in-progress': 'IP', 
                    'on-hold': 'OH', 'resolved': 'R', 'rejected': 'RJ'
                  }[complaint.status] || complaint.status.charAt(0).toUpperCase()}
                </span>
              </span>
            </div>
          )}
        </td>
        
        {/* Actions Column 1 (View or Edit) */}
        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
          {userRole === 'citizen' ? (
            <button onClick={() => navigate(viewPath)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center text-sm transition-colors duration-200">
              <FaEye className="mr-1 text-xs" /> View
            </button>
          ) : (
            <div className='flex items-center gap-4'>
              <button onClick={() => navigate(viewPath)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center text-sm transition-colors duration-200">
                <FaEye className="mr-1" />
                <span className="hidden sm:inline">View</span>
              </button>
              <button onClick={() => navigate(editPath)} className="px-2 py-1 bg-blue-1000 text-white rounded-md hover:bg-blue-700 text-xs inline-flex items-center transition-colors duration-200" title="Edit">
                <MdEdit className="text-sm" />
              </button>
            </div>
          )}
        </td>

        {/* Actions Column 2 (Feedback) - Only for Citizen */}
        {userRole === 'citizen' && (
          <td className="px-4 lg:px-6 py-4">
            <RateButton
              feedback={complaint.feedback}
              status={complaint.status}
              link={feedbackPath}
            />
          </td>
        )}
      </tr>

      {/* --- MOBILE CARD LAYOUT --- */}
      {/* This entire section only renders for the citizen role on mobile screens */}
      {userRole === 'citizen' && (
        <tr className="md:hidden dark:bg-navy-700">
          <td colSpan="100%" className="p-0">
            <div className="bg-white dark:bg-navy-700 rounded-lg m-2 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400">ID</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{complaint.id}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                  {getStatusText(complaint.status)}
                </span>
              </div>
              <div className="mb-3">
                <span className="text-xs text-gray-500 dark:text-gray-400">Issue</span>
                <p className="text-sm text-gray-900 dark:text-white mt-1 break-words">{complaint.issue}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Department</span>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">{departmentText}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Date</span>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">{complaint.complaintDate && complaint.complaintDate.split('T')[0]}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-3">
                <button onClick={() => navigate(viewPath)} className="flex items-center justify-center px-4 py-2 text-brand-600 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 border border-brand-600 dark:border-brand-400 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-brand-50 dark:hover:bg-brand-900/20">
                  <FaEye className="mr-2 text-xs" /> View Details
                </button>
                <RateButton
                  feedback={complaint.feedback}
                  status={complaint.status}
                  link={feedbackPath}
                />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default Row;
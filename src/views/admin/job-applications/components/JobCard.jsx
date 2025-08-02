import React from 'react';
import {
  MdEdit,
  MdLocationOn,
  MdBusiness,
  MdDelete,
  MdFavorite,
  MdToggleOn,
  MdToggleOff
} from 'react-icons/md';

const JobCard = ({ job, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6">
        {/* Header with Status Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Job Type Badge */}
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              job.jobType === 'municipal'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            }`}>
              {job.jobType === 'municipal' ? (
                <MdBusiness size={16} />
              ) : (
                <MdFavorite size={16} />
              )}
              {job.jobType === 'municipal' ? 'Municipal' : 'Volunteer'}
            </div>
          </div>
          
          {/* Status Badge - Now Clickable Toggle */}
          <button
            onClick={() => onToggleStatus(job.id)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all hover:scale-105 ${
              job.isActive
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {job.isActive ? (
              <MdToggleOn size={16} />
            ) : (
              <MdToggleOff size={16} />
            )}
            {job.isActive ? 'Active' : 'Inactive'}
          </button>
        </div>

        {/* Job Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {job.title}
        </h3>

        {/* Department */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
          <MdBusiness size={16} />
          <span className="text-sm">{job.department}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
          <MdLocationOn size={16} />
          <span className="text-sm line-clamp-1">{job.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 line-clamp-3">
          {job.description}
        </p>

        {/* Action Buttons - Equal Sizes */}
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(job)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm"
          >
            <MdEdit size={16} />
            Edit
          </button>
          <button
            onClick={() => onDelete(job)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 text-sm"
          >
            <MdDelete size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

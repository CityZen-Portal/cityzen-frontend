import React from 'react';
import { Building2, MapPin, Calendar, AlertTriangle, Eye } from 'lucide-react';

const JobCard = ({ job, onViewDetails, isJobExpired, formatDate }) => {
  const expired = isJobExpired(job);
  
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => onViewDetails(job.id)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className={`text-xl font-bold line-clamp-2 flex-1 text-blue-600 dark:text-blue-400`}>
            {job.title}
          </h3>
          {expired && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium ml-2 flex items-center gap-1">
              <AlertTriangle size={12} />
              EXPIRED
            </div>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-6">
          {job.description}
        </p>

        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Building2 size={16} />
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Department</p>
                <p className="font-medium">{job.department}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <MapPin size={16} />
              <div>
                <p className="text-xs text-purple-600 dark:text-purple-400">Location</p>
                <p className="font-medium line-clamp-1">{job.location}</p>
              </div>
            </div>
          </div>

          <div className={`${expired ? 'bg-red-50 dark:bg-red-900/20' : 'bg-orange-50 dark:bg-orange-900/20'} rounded-lg p-3`}>
            <div className={`flex items-center gap-2 ${expired ? 'text-red-700 dark:text-red-300' : 'text-orange-700 dark:text-orange-300'}`}>
              <Calendar size={16} />
              <div>
                <p className={`text-xs ${expired ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  Application Deadline
                </p>
                <p className="font-medium">
                  {formatDate(job.deadline)} {expired && (
                    <span className="text-red-600 dark:text-red-400 text-xs ml-1">EXPIRED</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(job.id);
          }}
          className="w-full mt-6 py-3 px-4 rounded-xl transition-colors font-medium text-sm flex items-center gap-2 justify-center bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Eye size={16} />
          View Details
        </button>
      </div>
    </div>
  );
};

export default JobCard;
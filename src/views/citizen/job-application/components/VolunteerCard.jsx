import React from 'react';
import { Heart, MapPin, Calendar, Clock, Users, Eye } from 'lucide-react';

const VolunteerCard = ({ volunteer, onViewDetails, formatDate }) => {
  return (
    <div
      className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
      onClick={() => onViewDetails(volunteer.id)}
    >
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold line-clamp-2 flex-1 text-blue-600 dark:text-blue-400">
            {volunteer.programTitle}
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-6 min-h-[40px]">
          {volunteer.programDescription}
        </p>

        <div className="space-y-4 flex-grow">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Heart size={16} />
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Program</p>
                <p className="font-medium">Community Volunteer</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <MapPin size={16} />
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Location</p>
                <p className="font-medium line-clamp-1">{volunteer.location}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Calendar size={16} />
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Program Date</p>
                <p className="font-medium">{formatDate(volunteer.programDate)}</p>
              </div>
            </div>
          </div>

          {/* <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <Clock size={16} />
              <div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400">Time</p>
                <p className="font-medium">{volunteer.programTime}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Users size={16} />
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Duration</p>
                <p className="font-medium">{volunteer.duration}</p>
              </div>
            </div>
          </div> */}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(volunteer.id);
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

export default VolunteerCard;
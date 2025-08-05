import React from 'react';
import { Heart, MapPin, Calendar, Clock, Users, Eye, Edit, Trash2 } from 'lucide-react';


// Small Toggle Switch Component for top right corner
const SmallToggleSwitch = ({ isActive, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative inline-flex items-center h-4 rounded-full w-8 transition-colors duration-300 focus:outline-none ${
      isActive ? 'bg-green-500' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform duration-300 ${
        isActive ? 'translate-x-4' : 'translate-x-0.5'
      }`}
    />
  </button>
);

const VolunteerCard = ({ volunteer, onViewDetails, formatDate, isAdminView = false, onEdit, onDelete, onToggleStatus }) => {
  return (
    <div
      className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => !isAdminView && onViewDetails(volunteer.id)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold line-clamp-2 flex-1 text-green-600 dark:text-green-400 pr-3">
            {volunteer.programTitle}
          </h3>
          {isAdminView && onToggleStatus && (
            <SmallToggleSwitch 
              isActive={volunteer.isActive} 
              onToggle={(e) => {
                e.stopPropagation();
                onToggleStatus(volunteer);
              }}
            />
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-6">
          {volunteer.programDescription}
        </p>

        <div className="space-y-4">
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

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Clock size={16} />
              <div>
                <p className="text-xs text-blue-600 dark:text-blue-400">Time</p>
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
          </div>
        </div>

        {/* Conditional buttons based on admin view */}
        {isAdminView ? (
          <div className="flex gap-3 mt-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(volunteer);
              }}
              className="flex-1 py-3 px-4 rounded-xl transition-colors font-medium text-sm flex items-center gap-2 justify-center bg-brand-500 hover:bg-brand-600 text-white"
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(volunteer);
              }}
              className="flex-1 py-3 px-4 rounded-xl transition-colors font-medium text-sm flex items-center gap-2 justify-center bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(volunteer.id);
            }}
            className="w-full mt-6 py-3 px-4 rounded-xl transition-colors font-medium text-sm flex items-center gap-2 justify-center bg-green-600 hover:bg-green-700 text-white"
          >
            <Eye size={16} />
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default VolunteerCard;


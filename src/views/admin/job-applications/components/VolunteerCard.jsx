import React from 'react';
import { Heart, MapPin, Calendar, Eye, Edit, Trash2 } from 'lucide-react';

// Small Toggle Switch Component for top right corner
const SmallToggleSwitch = ({ isActive, onToggle, isDeleted = false }) => (
  <button
    onClick={onToggle}
    disabled={isDeleted}
    className={`relative inline-flex items-center h-4 rounded-full w-8 transition-colors duration-300 focus:outline-none ${
      isDeleted 
        ? 'bg-gray-300 cursor-not-allowed opacity-50' 
        : isActive 
          ? 'bg-blue-500' 
          : 'bg-gray-400'
    }`}
  >
    <span
      className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform duration-300 ${
        isActive && !isDeleted ? 'translate-x-4' : 'translate-x-0.5'
      }`}
    />
  </button>
);

const VolunteerCard = ({ 
  volunteer, 
  onViewDetails, 
  formatDate, 
  isAdminView = false, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  isDeletedView = false 
}) => {
  const isDeleted = volunteer.isDeleted || false;
  
  return (
    <div
      className={`bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full ${
        isDeleted ? 'opacity-75 bg-gray-50 dark:bg-gray-800' : ''
      }`}
      onClick={() => !isAdminView && onViewDetails(volunteer.id)}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Deleted indicator */}
        {isDeleted && (
          <div className="mb-4 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium rounded-full inline-block">
            Deleted
          </div>
        )}
        
        <div className="flex items-start justify-between mb-4">
          <h3 className={`text-xl font-bold line-clamp-2 flex-1 pr-3 ${
            isDeleted 
              ? 'text-gray-500 dark:text-gray-400' 
              : 'text-blue-600 dark:text-blue-400'
          }`}>
            {volunteer.programTitle}
          </h3>
          {isAdminView && onToggleStatus && !isDeletedView && (
            <SmallToggleSwitch 
              isActive={volunteer.isActive} 
              isDeleted={isDeleted}
              onToggle={(e) => {
                e.stopPropagation();
                onToggleStatus(volunteer);
              }}
            />
          )}
        </div>

        <p className={`text-sm line-clamp-3 mb-6 ${
          isDeleted 
            ? 'text-gray-500 dark:text-gray-500' 
            : 'text-gray-600 dark:text-gray-300'
        }`}>
          {volunteer.programDescription}
        </p>

        <div className="space-y-4 flex-grow">
          <div className={`rounded-lg p-3 ${
            isDeleted 
              ? 'bg-gray-100 dark:bg-gray-700' 
              : 'bg-blue-50 dark:bg-blue-900/20'
          }`}>
            <div className={`flex items-center gap-2 ${
              isDeleted 
                ? 'text-gray-600 dark:text-gray-400' 
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              <Heart size={16} />
              <div>
                <p className={`text-xs ${
                  isDeleted 
                    ? 'text-gray-500 dark:text-gray-500' 
                    : 'text-blue-600 dark:text-blue-400'
                }`}>Program</p>
                <p className="font-medium">Community Volunteer</p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-3 ${
            isDeleted 
              ? 'bg-gray-100 dark:bg-gray-700' 
              : 'bg-blue-50 dark:bg-blue-900/20'
          }`}>
            <div className={`flex items-center gap-2 ${
              isDeleted 
                ? 'text-gray-600 dark:text-gray-400' 
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              <MapPin size={16} />
              <div>
                <p className={`text-xs ${
                  isDeleted 
                    ? 'text-gray-500 dark:text-gray-500' 
                    : 'text-blue-600 dark:text-blue-400'
                }`}>Location</p>
                <p className="font-medium line-clamp-1">{volunteer.location}</p>
              </div>
            </div>
          </div>

          <div className={`rounded-lg p-3 ${
            isDeleted 
              ? 'bg-gray-100 dark:bg-gray-700' 
              : 'bg-blue-50 dark:bg-blue-900/20'
          }`}>
            <div className={`flex items-center gap-2 ${
              isDeleted 
                ? 'text-gray-600 dark:text-gray-400' 
                : 'text-blue-700 dark:text-blue-300'
            }`}>
              <Calendar size={16} />
              <div>
                <p className={`text-xs ${
                  isDeleted 
                    ? 'text-gray-500 dark:text-gray-500' 
                    : 'text-blue-600 dark:text-blue-400'
                }`}>Program Date</p>
                <p className="font-medium">{formatDate(volunteer.programDate)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conditional buttons based on admin view and deleted status */}
        {isAdminView ? (
          <div className="flex gap-3 mt-auto pt-6">
            {/* For deleted view, show no buttons - just the card */}
            {!isDeletedView && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit && onEdit(volunteer);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl transition-colors font-medium text-sm flex items-center gap-2 justify-center ${
                    isDeleted
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  disabled={isDeleted}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete && onDelete(volunteer);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl transition-colors font-medium text-sm flex items-center gap-2 justify-center ${
                    isDeleted
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                  disabled={isDeleted}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(volunteer.id);
            }}
            className={`w-full mt-auto pt-6 py-3 px-4 rounded-xl transition-colors font-medium text-sm flex items-center gap-2 justify-center ${
              isDeleted
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            disabled={isDeleted}
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
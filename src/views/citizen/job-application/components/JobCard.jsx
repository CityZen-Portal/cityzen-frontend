import React, { useState, useEffect } from 'react';
import { FaRegBuilding, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const JobCard = ({ job, onApply }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate days remaining and time remaining
  const lastDate = new Date(job.lastDate);
  const timeDiff = lastDate - currentTime;
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  // Calculate hours, minutes, and seconds for countdown
  const hoursRemaining = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
  // Determine urgency - only show red badges for urgent and closing soon
  const isUrgent = daysRemaining <= 3;
  const isClosingSoon = daysRemaining <= 7 && daysRemaining > 3;

  return (
    <div className="bg-white dark:bg-navy-700 rounded-xl shadow-md w-full p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200 dark:border-navy-600 overflow-hidden group relative">
      
      {/* Urgency Badge - Only show for urgent (red) and closing soon (red) */}
      {isUrgent && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10 font-medium">
          <FaExclamationTriangle className="text-xs" />
          URGENT
        </div>
      )}
      
      {isClosingSoon && (
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10 font-medium">
          <FaClock className="text-xs" />
          {daysRemaining} DAYS LEFT
        </div>
      )}
      
      <div className="space-y-4">
        {/* Centered Job Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300 leading-tight text-center">
          {job.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center">
          {job.description}
        </p>

        <div className="space-y-3 mt-6">
          {/* Department - Always blue */}
          <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <FaRegBuilding className="text-blue-600 flex-shrink-0 text-lg" /> 
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">Department</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">{job.department}</span>
            </div>
          </div>
          
          {/* Location - Always green */}
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <FaMapMarkerAlt className="text-green-600 flex-shrink-0 text-lg" /> 
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">Location</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">{job.location}</span>
            </div>
          </div>
          
          {/* Application Deadline - Always gray background, only days left text in red */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FaCalendarAlt className="text-gray-600 flex-shrink-0 text-lg" /> 
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">Application Deadline</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800 dark:text-white">{job.lastDate}</span>
                {daysRemaining > 1 ? (
                  <span className={`text-xs font-bold ${
                    isUrgent || isClosingSoon ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {daysRemaining} days left
                  </span>
                ) : timeDiff > 0 ? (
                  <span className="text-xs font-bold text-red-600 font-mono">
                    {hoursRemaining > 0 
                      ? `${hoursRemaining.toString().padStart(2, '0')}:${minutesRemaining.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`
                      : `${minutesRemaining.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`
                    }
                  </span>
                ) : (
                  <span className="text-xs font-bold text-red-600">
                    Expired
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Button - Always blue, no color changes */}
      <div className="flex justify-center mt-6">
        <button
          onClick={onApply}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-10 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
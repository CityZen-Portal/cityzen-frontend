import React from 'react';
import {
  UsersIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const StaffManagement = ({ onAddStaffs, onViewTasks, onViewSchedule }) => {
  // Helper component for individual cards to reduce repetition
  const ManagementCard = ({ icon, title, description, onClick, buttonText }) => {
    const IconComponent = icon;
    return (
      <div className="group bg-gray-50/50 dark:bg-navy-900/50 p-6 rounded-lg border border-gray-200 dark:border-navy-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6 flex-grow">
          {description}
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClick}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            {buttonText}
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  };

  return (
    // Main container with enhanced shadow and padding
    <div className="bg-white dark:bg-navy-800 shadow-lg rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        {/* Styled Icon */}
        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
          <UsersIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Staff Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Add staff, assign tasks, and manage schedules.</p>
        </div>
      </div>

      {/* Grid for management cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ManagementCard
          icon={UserPlusIcon}
          title="Add Staff"
          description="Onboard new employees and manage their profiles and credentials."
          onClick={onAddStaffs}
          buttonText="Add Staff"
        />
        <ManagementCard
          icon={ClipboardDocumentListIcon}
          title="Assign Tasks"
          description="Create new tasks, assign them to staff, and track their progress."
          onClick={onViewTasks}
          buttonText="View Tasks"
        />
        <ManagementCard
          icon={CalendarDaysIcon}
          title="Staff Schedule"
          description="View and manage weekly work schedules and staff availability."
          onClick={onViewSchedule}
          buttonText="View Schedule"
        />
      </div>
    </div>
  );
};

export default StaffManagement;
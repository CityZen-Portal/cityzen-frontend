import React from 'react';

const StaffManagement = ({ onAddStaffs, onViewTasks, onViewSchedule }) => {
  return (
    <div className="bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        <span className="material-icons mr-2">people</span>
        Staff Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Add Staff */}
        <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add Staff</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">Register new staff members</p>
          <button
            onClick={onAddStaffs}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 w-full shadow-sm"
          >
            <span>Add Staff</span>
          </button>
        </div>

        {/* View Tasks */}
        <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Assign Tasks</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">Manage service bookings</p>
          <button
            onClick={onViewTasks}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 w-full shadow-sm"
          >
            <span>View Tasks</span>
          </button>
        </div>

        {/* View Schedule */}
        <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Staff Schedule</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">Manage work timings</p>
          <button
            onClick={onViewSchedule}
            className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 w-full shadow-sm"
          >
            <span>View Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;

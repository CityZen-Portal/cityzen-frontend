import React from 'react';

const ServiceManagement = ({ onManageClick }) => {
  return (
    <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        <span className="material-icons mr-2">Settings</span>
        Service Management
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add Services</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">Configure utility services</p>
          <button
            onClick={onManageClick}   
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 w-full"
          >
            Manage Services
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;

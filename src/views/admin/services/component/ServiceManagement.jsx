import React from 'react';
import { WrenchScrewdriverIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const ServiceManagement = ({ onManageClick }) => {
  return (

    <div className="bg-white dark:bg-navy-800 shadow-lg rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-8">

        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
          <WrenchScrewdriverIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Service Management
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Add, edit, and monitor your utility services.</p>
        </div>
      </div>

      <div>
        
        <div className="group bg-gray-50/50 dark:bg-navy-900/50 p-6 rounded-lg border border-gray-200 dark:border-navy-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-500/20 rounded-lg flex items-center justify-center">
              <PencilSquareIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Manage Services</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
            Add new services or edit existing ones, like Electricity and Water Supply.
          </p>
          <div className="flex justify-end">
            <button
              onClick={onManageClick}
              className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-500/20 rounded-md hover:bg-blue-100 dark:hover:bg-blue-500/30 transition-colors"
            >
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
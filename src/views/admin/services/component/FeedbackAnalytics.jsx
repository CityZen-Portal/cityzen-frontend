import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeedbackAnalytics = () => {
  const navigate = useNavigate();

  const handleFeedbackClick = () => {
    navigate('/admin/services/feedback');
  };

  return (
    <div className="bg-gray-50 dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
        <span className="material-icons mr-2">analytics</span>
        Feedback & Analytics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Customer Feedback</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">View and manage feedback</p>
          <button
            onClick={handleFeedbackClick}
            className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 w-full shadow-sm hover:bg-purple-600 transition-colors"
          >
            <span>View Feedback</span>
          </button>
        </div>
        <div className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Service Analytics</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">Performance metrics and reports</p>
          <button className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 w-full shadow-sm hover:bg-purple-600 transition-colors">
            <span>View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalytics;

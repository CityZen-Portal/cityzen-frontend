import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, ChatBubbleOvalLeftEllipsisIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const FeedbackAnalytics = () => {
  const navigate = useNavigate();

  const handleFeedbackClick = () => {
    navigate('/admin/services/feedback');
  };

  return (
    // Main container with enhanced shadow and padding
    <div className="bg-white dark:bg-navy-800 shadow-lg rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        {/* Styled Icon */}
        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Feedback & Analytics
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Review comments and ratings from your customers.</p>
        </div>
      </div>

      {/* Container for the single feedback card */}
      <div>
        <div className="group bg-gray-50/50 dark:bg-navy-900/50 p-6 rounded-lg border border-gray-200 dark:border-navy-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
              <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Customer Feedback</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
            View all submitted feedback, respond to customers, and gain insights.
          </p>
          <div className="flex justify-end">
            <button
              onClick={handleFeedbackClick}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              View Feedback
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalytics;
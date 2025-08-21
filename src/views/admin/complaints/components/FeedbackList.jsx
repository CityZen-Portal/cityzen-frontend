import React, { useState } from 'react';
import FeedbackCard from './FeedbackCard';

const FeedbackList = ({ complaintsWithFeedback = [] }) => {
  // 1. State to manage the number of visible feedback items
  const [visibleCount, setVisibleCount] = useState(3);

  if (!complaintsWithFeedback.length) return null;

  // 2. Handler to show all feedback items
  const handleShowMore = () => {
    setVisibleCount(complaintsWithFeedback.length);
  };

  // 3. Slice the array to only show the number of items in visibleCount
  const visibleFeedback = complaintsWithFeedback.slice(0, visibleCount);

  return (
    <section className="mt-8 sm:p-6">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Feedback Received</h2>
      <div className="space-y-4">
        {visibleFeedback.map((complaint) => (
          <FeedbackCard
            key={complaint.id}
            complaint={complaint}
          />
        ))}
      </div>

      {/* 4. Conditionally render the "Show More" button */}
      {visibleCount < complaintsWithFeedback.length && (
        // MODIFIED: Added a border-top for separation
        <div className="mt-6 pt-6 text-center">
          {/* MODIFIED: Cleaned up and improved button styling for both themes */}
          <button
            onClick={handleShowMore}
            className="bg-gray-300 dark:bg-gray-400 text-slate-700 dark:text-slate-200 font-semibold py-2 px-6 rounded-3xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-200"
          >
            Show All {complaintsWithFeedback.length} Feedbacks
          </button>
        </div>
      )}
    </section>
  );
};

export default FeedbackList;
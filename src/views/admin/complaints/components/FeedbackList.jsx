// FeedbackList.jsx
import React from 'react';
import FeedbackCard from './FeedbackCard';

const FeedbackList = ({ complaintsWithFeedback = [], getStatusColor, getStatusText }) => {
  if (!complaintsWithFeedback.length) return null;

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Feedback Received</h2>
      <div className="space-y-3">
        {complaintsWithFeedback.map((c) => (
          <FeedbackCard
            key={c.id}
            complaint={c}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        ))}
      </div>
    </section>
  );
};

export default FeedbackList;

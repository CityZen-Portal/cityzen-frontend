// FeedbackCard.jsx
import React from 'react';

const FeedbackCard = ({ complaint, getStatusColor = () => '', getStatusText = (s) => s }) => {
  const fb =
    complaint.feedback ||
    (Array.isArray(complaint.feedbacks) && complaint.feedbacks[0]) ||
    (complaint.feedbacks && complaint.feedbacks.length && complaint.feedbacks[0]) ||
    null;

  console.log("Complaints API response:", complaint);

  if (!fb) return null;

  const submittedAt =
    fb.submittedAt || fb.createdAt || complaint.feedbackSubmittedAt || complaint.updatedAt;
  const dateStr = submittedAt ? new Date(submittedAt).toLocaleString() : '';

  // Check multiple possible keys for description
  const description = fb.comments || '';

  // Function to render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white dark:bg-navy-700 rounded-lg shadow p-4 mb-4 border">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-300">
            Complaint Id : {complaint.id} · {complaint.department || 'General'}
          </div>
          <h3 className="font-semibold text-base text-gray-900 dark:text-white mt-1">
            {complaint.issue || 'No title'}
          </h3>
          {complaint.street && (
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {complaint.street}
            </div>
          )}
        </div>

        <div className="text-right">
          {getStatusColor && (
            <div
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                complaint.status || ''
              )}`}
            >
              {getStatusText(complaint.status || '')}
            </div>
          )}
          {dateStr && <div className="text-xs text-gray-400 dark:text-gray-300 mt-1">{dateStr}</div>}
        </div>
      </div>

      {/* Resolved + Rating stacked */}
      <div className="mt-3">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Resolved</div>
          <div className="font-medium text-white">{fb.isResolved ? 'Yes' : 'No'}</div>
        </div>

        <div className="mt-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
          <div className="flex">{renderStars(fb.rating ?? 0)}</div>
        </div>
      </div>

      {/* Citizen Description */}
      {description && (
        <div className="mt-3">
          <div className="text-xs text-gray-500 dark:text-gray-400">Comments</div>
          <div className="text-sm text-gray-700 dark:text-gray-200">{description}</div>
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;

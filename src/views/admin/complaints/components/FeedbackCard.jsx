import React from 'react';
import { MdBusiness, MdLocationOn, MdFeedback, MdCheckCircleOutline, MdHighlightOff, MdStar } from 'react-icons/md';
import { format } from 'date-fns';

const FeedbackCard = ({ complaint }) => {
  const fb =
    complaint.feedback ||
    (Array.isArray(complaint.feedbacks) && complaint.feedbacks[0]) ||
    (complaint.feedbacks && complaint.feedbacks.length && complaint.feedbacks[0]) ||
    null;

  if (!fb) return null;

  // const submittedAt =
  //   fb.submittedAt || fb.createdAt || complaint.feedbackSubmittedAt || complaint.updatedAt;
  // const dateStr = submittedAt ? format(new Date(submittedAt)) : 'Not available';

  const description = fb.comments || '';

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MdStar
          key={i}
          className={`${
            i <= rating
              ? "text-yellow-400"
              : "text-slate-300 dark:text-white"
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl shadow-md border border-slate-200 dark:border-navy-700 overflow-hidden transition-colors duration-300">
      
      {/* --- CARD HEADER --- */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-navy-700">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
            <MdFeedback className="text-xl text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 dark:text-white truncate">
              Feedback for Complaint #{complaint.id}
            </h3>
            <p className="text-sm text-slate-600 dark:text-white truncate">
              {complaint.issue || 'No title'}
            </p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex items-center gap-2 mt-4">
          <p className="text-sm font-medium text-slate-600 dark:text-white">Rating:</p>
          <div className="flex text-2xl">
            {renderStars(fb.rating ?? 0)}
          </div>
        </div>
      </div>

      {/* --- CARD BODY --- */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-5">
          {/* Department Info */}
          <div className="flex items-start gap-3">
            <MdBusiness className="text-slate-400  dark:text-white mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500 dark:text-white">Department</p>
              <p className="text-sm font-medium text-slate-700 dark:text-white">
                {complaint.department || 'General'}
              </p>
            </div>
          </div>

          {/* Location Info */}
          {complaint.street && (
            <div className="flex items-start gap-3">
              <MdLocationOn className="text-slate-400 dark:text-white mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-500 dark:text-white">Location</p>
                <p className="text-sm font-medium text-slate-700 dark:text-white">
                  {complaint.street}
                </p>
              </div>
            </div>
          )}

          {/* Resolution Status */}
          <div className="flex items-start gap-3">
            {fb.isResolved ? (
              <MdCheckCircleOutline className="text-green-500 dark:text-green-400 mt-1 flex-shrink-0" />
            ) : (
              <MdHighlightOff className="text-red-500 dark:text-red-400 mt-1 flex-shrink-0" />
            )}
            <div>
              <p className="text-xs text-slate-500 dark:text-white">Citizen Confirmed Resolution</p>
              <p className={`text-sm font-medium ${fb.isResolved ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`}>
                {fb.isResolved ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- CARD FOOTER --- */}
      {description && (
        <div className="bg-slate-50 dark:bg-navy-700/50 p-4 sm:p-5 border-t border-slate-200 dark:border-navy-700">
          <p className="text-sm font-semibold text-slate-700 dark:text-white mb-2">Citizen's Comments:</p>
          <blockquote className="text-sm text-slate-600 dark:text-white italic border-l-4 border-slate-300 dark:border-slate-600 pl-4">
            {description}
          </blockquote>
          {/* <p className="text-right text-xs text-slate-400 dark:text-white mt-3">
            Feedback submitted on {dateStr}
          </p> */}
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;

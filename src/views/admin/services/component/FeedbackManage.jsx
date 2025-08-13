import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaCommentDots } from "react-icons/fa";

function FeedbackManage() {
  const navigate = useNavigate();
  const [userData, setData] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeedback() {
      try {
        setLoading(true);
        setError(null);
        const result = await axios.get(
          "https://utility-booking-backend.onrender.com/api/feedback/all"
        );

        const responseData = result.data;
        if (Array.isArray(responseData)) {
          setData(responseData);
        } else if (
          responseData &&
          (Array.isArray(responseData.feedback) ||
            Array.isArray(responseData.data))
        ) {
          setData(responseData.feedback || responseData.data);
        } else {
          setData([]);
        }
      } catch (err) {
        setError("Could not fetch feedback data.");
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeedback();
  }, []);

  return (
    <div className="mt-12 rounded-2xl bg-white p-6 shadow-md dark:bg-navy-900">
      <button
        onClick={() => navigate("/admin/services")}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-500"
      >
        <span>←</span> Back to Services
      </button>

      <div className="w-full">
        <div className="min-h-screen bg-gray-100 p-6 dark:bg-navy-800">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-xl shadow-lg">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
              <h2 className="text-xl font-bold">📬 Feedback Management</h2>
            </div>

            {/* Content */}
            <div className="p-6 dark:bg-navy-800">
              {loading && (
                <div className="animate-pulse py-8 text-center text-gray-600 dark:text-gray-300">
                  Loading feedback...
                </div>
              )}
              {error && (
                <div className="py-8 text-center text-red-500 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Feedback Grid */}
              {!loading && !error && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.isArray(userData) && userData.length > 0 ? (
                    userData.map((item) => {
                      const initials = (item.name || "A")
                        .split(" ")
                        .map((n) => n[0])
                        .join("");
                      return (
                        <div
                          key={item.id || item._id}
                          className="relative flex transform flex-col justify-between rounded-xl border border-gray-200 bg-white/80 shadow-md backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl dark:border-gray-700 dark:bg-white/10"
                        >
                          {/* Card Content */}
                          <div className="p-5">
                            {/* Avatar + Name */}
                            <div className="mb-4 flex items-center">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-base font-bold text-white shadow">
                                {initials}
                              </div>
                              <div className="ml-3">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                  {item.name || "Anonymous"}
                                </h3>
                                <div className="flex items-center text-xs text-gray-500">
                                  <FaCalendarAlt className="mr-1" />
                                  {item.date || "N/A"}
                                </div>
                              </div>
                            </div>

                            {/* Feedback Preview */}
                            <div className="line-clamp-4 text-sm text-gray-600 dark:text-gray-300">
                              <FaCommentDots className="mr-1 inline-block text-blue-500" />
                              {(item.description || "").length > 150
                                ? item.description.slice(0, 150) + "..."
                                : item.description}
                            </div>
                          </div>

                          {/* Bottom Panel */}
                          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-navy-900">
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                              New
                            </span>
                            <button
                              onClick={() => setSelectedFeedback(item)}
                              className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
                            >
                              View Details →
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full py-4 text-center text-gray-500">
                      No feedback found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        {selectedFeedback && (
          <div className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-lg transition-all dark:bg-navy-800">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  📝 Feedback Details
                </h3>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-2xl font-bold text-gray-400 hover:text-gray-600 dark:text-gray-300"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-4 text-gray-700 dark:text-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Name:
                  </p>
                  <p>{selectedFeedback.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Date:
                  </p>
                  <p>{selectedFeedback.date}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                    Description:
                  </p>
                  <p className="whitespace-pre-wrap">
                    {selectedFeedback.description}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackManage;

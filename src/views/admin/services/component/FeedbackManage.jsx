import React, { useEffect, useState } from "react";
import axios from "axios";

function FeedbackManage() {
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
          (Array.isArray(responseData.feedback) || Array.isArray(responseData.data))
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
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md mt-12">
      <h2 className="text-xl text-black dark:text-white font-semibold mb-2">Feedback Management</h2>
      <div className="w-full mt-10">
        <div className="min-h-screen bg-gray-100 dark:bg-navy-900 p-6">
          <div className="mx-auto max-w-5xl rounded-md shadow-lg bg-white dark:bg-navy-800">
            <div className="bg-gradient-to-r from-navy-700 to-navy-700 px-6 py-4 text-white rounded-t-md">
              <h2 className="text-xl font-bold">📬 Feedback Management</h2>
            </div>

            <div className="p-4 dark:bg-gray-800">
              {loading && (
                <div className="py-8 text-center text-gray-600 dark:text-gray-300">Loading...</div>
              )}
              {error && (
                <div className="py-8 text-center text-red-500 dark:text-red-400">{error}</div>
              )}
              {!loading && !error && (
                <div className="w-full max-w-[1600px] mx-auto px-4">
                  <table className="w-full table-auto text-left text-sm text-gray-700 dark:text-gray-200">
                    <thead className="bg-gray-200 dark:bg-navy-700 text-gray-600 dark:text-gray-100">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(userData) && userData.length > 0 ? (
                        userData.map((item) => (
                          <tr
                            key={item.id || item._id}
                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-navy-700 transition"
                          >
                            <td className="px-4 py-2">{item.name || "N/A"}</td>
                            <td className="px-4 py-2">{item.date || "N/A"}</td>
                            <td className="px-4 py-2">
                              {(item.description || "").length > 70
                                ? item.description.slice(0, 70) + "..."
                                : item.description}
                            </td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => setSelectedFeedback(item)}
                                className="text-blue-600 hover:underline dark:text-blue-400"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-4 text-center">
                            No feedback found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedFeedback && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 dark:bg-opacity-60 transition-all">
            <div className="w-full max-w-md rounded-lg bg-white dark:bg-navy-800 p-6 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-600">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">📝 Feedback Details</h3>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-2xl font-bold text-gray-500 hover:text-gray-700 dark:text-gray-300"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4 mt-4 text-gray-700 dark:text-gray-200">
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Name:</p>
                  <p>{selectedFeedback.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Date:</p>
                  <p>{selectedFeedback.date}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Description:</p>
                  <p>{selectedFeedback.description}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 text-sm text-gray-800 dark:text-white"
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
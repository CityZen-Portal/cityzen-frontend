import React, { useEffect, useState } from "react";
import axios from "axios";

function FeedbackManage() {
  const [userData, setData] = useState([]); // Always keep this as an array
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
        // Check if result.data is actually an array or inside a property
        let responseData = result.data;
        if (Array.isArray(responseData)) {
          setData(responseData);
        } else if (
          responseData &&
          (Array.isArray(responseData.feedback) ||
            Array.isArray(responseData.data))
        ) {
          setData(responseData.feedback || responseData.data);
        } else {
          setData([]); // fallback if not an array
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-md bg-white shadow-md">
        <div className="rounded-t-md bg-blue-600 px-6 py-4 text-white">
          <h2 className="text-lg font-bold">Feedback Management</h2>
        </div>

        <div className="overflow-x-auto p-4">
          {loading && (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          )}
          {error && (
            <div className="py-8 text-center text-red-500">{error}</div>
          )}
          {!loading && !error && (
            <table className="w-full table-auto text-left text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(userData) && userData.length > 0 ? (
                  userData.map((item) => (
                    <tr key={item.id || item._id} className="border-b">
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
                          className="text-blue-600 hover:underline"
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
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedFeedback && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold">Feedback Details</h3>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="hover:text-black text-2xl leading-none text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Name:</p>
                <p>{selectedFeedback.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Date:</p>
                <p>{selectedFeedback.date}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">
                  Description:
                </p>
                <p>{selectedFeedback.description}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedFeedback(null)}
                className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackManage;

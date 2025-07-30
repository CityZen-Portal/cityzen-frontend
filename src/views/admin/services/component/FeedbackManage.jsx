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
   <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md mt-12">
   <h2 className="text-xl text-black dark:text-white font-semibold mb-2">Feedback Management</h2>
<div className="w-full mt-10">
       

        <div className=" p-4 dark:bg-gray-800">
          {loading && (
            <div className="py-8 text-center text-gray-500">Loading...</div>
          )}
          {error && (
            <div className="py-8 text-center text-red-500">{error}</div>
          )}
          {!loading && !error && (
            <div className="w-full max-w-[1600px] mx-auto px-4">
<table className="w-full text-sm text-left border mb-6 relative">
          <thead className="text-xs uppercase bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200">
                <tr>
                  <th className="px-4 py-2">Id</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(userData) && userData.length > 0 ? (
                  userData.map((item) => (
                    <tr key={item.id || item._id} className="border-b dark:text-white ">
                      <td className="px-4 py-2">{item._id || item.id}</td>
                      <td className="px-4 py-2">{item.name || "N/A"}</td>
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
            </div>
          )}
        </div>
      </div>

     {selectedFeedback && (
  <div className="p-6"> 
    <div className="bg-gray-100 dark:bg-navy-800 text-gray-900 dark:text-white p-6 rounded-xl shadow-lg w-full max-w-3xl mx-auto mt-6">
      <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-3 mb-4">
        <h3 className="text-xl font-semibold">Feedback Details</h3>
        <button
          onClick={() => setSelectedFeedback(null)}
          className="text-2xl text-gray-600 dark:text-gray-200 hover:text-red-500"
        >
          &times;
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">ID:</p>
          <p className="text-lg">{selectedFeedback.id}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</p>
          <p className="text-lg">{selectedFeedback.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description:</p>
          <p className="text-lg">{selectedFeedback.description}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setSelectedFeedback(null)}
          className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-200"
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

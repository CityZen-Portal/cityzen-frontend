import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ViewSchedule() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://utility-booking-backend.onrender.com/api/task/all"
        );
        setData(response.data.data.data); // make sure this path is correct
        console.log(response.data.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Group tasks by staffId
  const groupedByStaff = data.reduce((acc, task) => {
    if (!acc[task.staffId]) {
      acc[task.staffId] = [];
    }
    acc[task.staffId].push(task);
    return acc;
  }, {});

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 px-4">
      <div className="bg-white dark:bg-navy-800 shadow rounded-lg">
        <div className="bg-blue-600 p-4 rounded-t-lg">
          <button
            onClick={() => navigate("/admin/services")}
            className="text-white hover:text-gray-200 transition-colors flex items-center gap-1 mb-2"
          >
            <span>←</span> Back
          </button>
          <h2 className="text-white text-lg font-semibold">Staff Schedules</h2>
        </div>

        <div className="p-4 space-y-6 overflow-x-auto">
          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          ) : data.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No tasks found.</p>
          ) : (
            Object.entries(groupedByStaff).map(([staffId, tasks]) => (
              <div key={staffId}>
                <h3 className="text-md font-semibold text-gray-700 dark:text-white mb-2">
                  👤 Staff ID: {staffId}
                </h3>

                <table className="min-w-full border border-gray-300 dark:border-gray-600">
                  <thead className="bg-gray-200 dark:bg-navy-700">
                    <tr>
                      <th className="border px-4 py-2 text-left">#</th>
                      <th className="border px-4 py-2 text-left">Service ID</th>
                      <th className="border px-4 py-2 text-left">Citizen ID</th>
                      <th className="border px-4 py-2 text-left">Status</th>
                      <th className="border px-4 py-2 text-left">Completion Date</th>
                      <th className="border px-4 py-2 text-left">Suggestion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, index) => (
                      <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-navy-600">
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{task.serviceId}</td>
                        <td className="border px-4 py-2">{task.citizenId}</td>
                        <td className="border px-4 py-2">{task.status}</td>
                        <td className="border px-4 py-2">
                          {task.completion_date
                            ? new Date(task.completion_date).toLocaleDateString()
                            : "Not Completed"}
                        </td>
                        <td className="border px-4 py-2">
                          {task.suggestion || "None"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewSchedule;

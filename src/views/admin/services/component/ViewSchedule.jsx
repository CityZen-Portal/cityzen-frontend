import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

function ViewSchedule() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://utility-booking-backend.onrender.com/api/task/dto/all");
        setData(response.data.data.data);
        console.log(response.data.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupedByStaff = data.reduce((acc, task) => {
    if (!acc[task.staffId]) {
      acc[task.staffId] = {
        staffName: task.staffName,
        staffDepartment: task.staffDepartment,
        tasks: [],
      };
    }
    acc[task.staffId].tasks.push(task);
    return acc;
  }, {});

  return (
    <div className="mt-12 mb-8 px-4 flex flex-col gap-8 ">
      <div className="bg-white dark:bg-navy-800 shadow-md rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-navy-700 to-navy-500 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <button
            onClick={() => navigate("/admin/services")}
            className="text-white  hover:text-gray-200 text-sm font-medium flex items-center gap-1 mb-2 sm:mb-0"
          >
            ← Back
          </button>
          <h2 className="text-white text-lg font-semibold">🗓 Staff Schedules</h2>
        </div>

        <div className="p-4 space-y-8 overflow-x-auto">
          {loading ? (
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          ) : data.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">No tasks found.</p>
          ) : (
            Object.entries(groupedByStaff).map(([staffId, group]) => (
              <div
                key={staffId}
                className="bg-gray-50 dark:bg-navy-700 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow"
              >
                <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3">
                  👤 {group.staffName} ({group.staffDepartment})
                </h3>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left text-gray-600 dark:text-gray-300 border-collapse">
                    <thead className="bg-gray-200 dark:bg-navy-600 text-gray-700 dark:text-gray-100">
                      <tr>
                        <th className="px-4 py-2 border">#</th>
                        <th className="px-4 py-2 border">Task</th>
                        <th className="px-4 py-2 border">Citizen</th>
                        <th className="px-4 py-2 border">Status</th>
                        <th className="px-4 py-2 border">Completion Date</th>
                        <th className="px-4 py-2 border">Suggestion</th>
                        <th className="px-4 py-2 border">Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.tasks.map((task, index) => (
                        <tr
                          key={index}
                          className={`border-t ${
                            index % 2 === 0
                              ? "bg-white dark:bg-navy-800"
                              : "bg-gray-100 dark:bg-navy-700"
                          } hover:bg-gray-50 dark:hover:bg-navy-600 transition-colors`}
                        >
                          <td className="px-4 py-2 border">{index + 1}</td>
                          <td className="px-4 py-2 border">{task.taskName}</td>
                          <td className="px-4 py-2 border">{task.citizenName}</td>
                          <td className="px-4 py-2 border">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                task.taskStatus === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {task.taskStatus}
                            </span>
                          </td>
                          <td className="px-4 py-2 border">
                            {task.completed_date
                              ? new Date(task.completed_date).toLocaleDateString()
                              : "Not Completed"}
                          </td>
                          <td className="px-4 py-2 border">
                            {task.suggesttion || "None"}
                          </td>
                          <td className="px-4 py-2 border text-center">
                            {task.imagePath ? (
                              <a
                                href={task.imagePath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                                title="View Image"
                              >
                                <FaEye />
                              </a>
                            ) : (
                              <span className="text-gray-400">No Image</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewSchedule;

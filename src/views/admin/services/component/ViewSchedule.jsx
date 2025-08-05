import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const PAGE_SIZE = 3; // Number of staff groups per page

function ViewSchedule() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://utility-booking-backend.onrender.com/api/task/dto/all"
        );
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

  // Group tasks by staffId
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

  // Convert grouped object to array for pagination
  const staffGroupsArray = Object.entries(groupedByStaff);

  // Calculate pagination values
  const totalPages = Math.ceil(staffGroupsArray.length / PAGE_SIZE);

  // Slice current page groups
  const currentGroups = staffGroupsArray.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="mt-12 mb-8 px-4 flex flex-col gap-8">
      <div className="bg-white dark:bg-navy-800 shadow-md rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-navy-700 to-navy-500 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <button
            onClick={() => navigate("/admin/services")}
            className="text-white hover:text-gray-200 text-sm font-medium flex items-center gap-1 mb-2 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
          >
            ← Back
          </button>
          <h2 className="text-white text-lg font-semibold select-none">
            🗓 Staff Schedules
          </h2>
        </div>

        <div className="p-4 space-y-8 overflow-x-auto min-h-[300px]">
          {loading ? (
            <p className="text-gray-600 dark:text-gray-300 select-none">
              Loading...
            </p>
          ) : data.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 select-none">
              No tasks found.
            </p>
          ) : (
            <>
              {currentGroups.map(([staffId, group]) => (
                <div
                  key={staffId}
                  className="bg-gray-50 dark:bg-navy-700 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3 select-none">
                    👤 {group.staffName} ({group.staffDepartment})
                  </h3>

                  <div className="overflow-x-auto rounded-md border border-gray-300 dark:border-navy-600 shadow-sm dark:shadow-md">
                    <table className="min-w-full text-sm text-left text-gray-600 dark:text-gray-300 border-collapse table-auto">
                      <caption className="sr-only">
                        Staff tasks and schedules table
                      </caption>
                      <thead className="bg-gray-200 dark:bg-navy-600 text-gray-700 dark:text-gray-100 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-2 border cursor-default select-none">#</th>
                          <th className="px-4 py-2 border cursor-default select-none">Task</th>
                          <th className="px-4 py-2 border cursor-default select-none">Citizen</th>
                          <th className="px-4 py-2 border cursor-default select-none">Status</th>
                          <th className="px-4 py-2 border cursor-default select-none">Completion Date</th>
                          <th className="px-4 py-2 border cursor-default select-none">Suggestion</th>
                          <th className="px-4 py-2 border cursor-default select-none">Image</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.tasks.map((task, index) => (
                          <tr
                            key={index}
                            tabIndex={0}
                            className={`border-t ${
                              index % 2 === 0
                                ? "bg-white dark:bg-navy-800"
                                : "bg-gray-100 dark:bg-navy-700"
                            } hover:bg-gray-50 dark:hover:bg-navy-600 transition-colors cursor-pointer`}
                            title={`Task: ${task.taskName}, Citizen: ${task.citizenName}`}
                          >
                            <td className="px-4 py-2 whitespace-nowrap truncate border select-none" title={String(index + 1)}>
                              {index + 1}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap truncate border select-none" title={task.taskName}>
                              {task.taskName}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap truncate border select-none" title={task.citizenName}>
                              {task.citizenName}
                            </td>
                            <td className="px-4 py-2 border select-none">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold select-none ${
                                  task.taskStatus === "Completed"
                                    ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200"
                                    : "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200"
                                }`}
                              >
                                {task.taskStatus}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap truncate border select-none" title={task.completed_date ? new Date(task.completed_date).toLocaleDateString() : "Not Completed"}>
                              {task.completed_date
                                ? new Date(task.completed_date).toLocaleDateString()
                                : "Not Completed"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap truncate border select-none" title={task.suggesttion || "None"}>
                              {task.suggesttion || "None"}
                            </td>
                            <td className="px-4 py-2 border text-center select-none">
                              {task.imagePath ? (
                                <a
                                  href={task.imagePath}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600"
                                  title="View Image"
                                >
                                  <FaEye />
                                </a>
                              ) : (
                                <span className="text-gray-400 dark:text-gray-500 select-none">
                                  No Image
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              <div className="flex justify-center mt-6 gap-3 select-none">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-navy-600 dark:text-navy-400"
                      : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  }`}
                >
                  Previous
                </button>
                <span className="flex items-center text-gray-700 dark:text-gray-300 font-semibold">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-3 py-1 rounded-md font-medium transition-colors ${
                    currentPage === totalPages || totalPages === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-navy-600 dark:text-navy-400"
                      : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewSchedule;

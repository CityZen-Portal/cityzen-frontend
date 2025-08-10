import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const PAGE_SIZE = 3;

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

  const staffGroupsArray = Object.entries(groupedByStaff);
  const totalPages = Math.ceil(staffGroupsArray.length / PAGE_SIZE);
  const currentGroups = staffGroupsArray.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const SkeletonRow = ({ cols }) => (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-2 border">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </td>
      ))}
    </tr>
  );

  const SkeletonGroup = () => (
    <div className="bg-gray-50 dark:bg-navy-700 rounded-lg p-4 shadow-sm">
      <div className="h-5 w-40 bg-gray-300 dark:bg-gray-600 rounded mb-3 animate-pulse"></div>
      <div className="overflow-x-auto rounded-md border border-gray-300 dark:border-navy-600">
        <table className="min-w-full text-sm border-collapse table-auto">
          <thead className="bg-gray-200 dark:bg-navy-600">
            <tr>
              {["#", "Task", "Citizen", "Status", "Completion Date", "Suggestion", "Image"].map((header) => (
                <th key={header} className="px-4 py-2 border">
                  <div className="h-3 bg-gray-400 dark:bg-gray-500 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonRow key={i} cols={7} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="mt-12 mb-8 px-4 flex flex-col gap-8">
      <div className="bg-white dark:bg-navy-800 shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-600 dark:bg-navy-600 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <button
            onClick={() => navigate("/admin/services")}
            className="text-white hover:text-gray-200 text-sm font-medium flex items-center gap-1 mb-2 sm:mb-0"
          >
            ← Back
          </button>
          <h2 className="text-white text-lg font-semibold select-none">
            🗓 Staff Schedules
          </h2>
        </div>

        <div className="p-4 space-y-8 overflow-x-auto min-h-[300px]">
          {loading ? (
            <>
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <SkeletonGroup key={i} />
              ))}
            </>
          ) : data.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 select-none">
              No tasks found.
            </p>
          ) : (
            <>
              {currentGroups.map(([staffId, group]) => (
                <div
                  key={staffId}
                  className="bg-white dark:bg-navy-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3 select-none">
                    👤 {group.staffName}{" "}
                    <span className="text-gray-500 dark:text-gray-400">
                      ({group.staffDepartment})
                    </span>
                  </h3>

                  <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
                    <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300 border-collapse table-auto">
                      <thead className="bg-gray-100 dark:bg-navy-700 text-gray-800 dark:text-gray-200">
                        <tr>
                          {["#", "Task", "Citizen", "Status", "Completion Date", "Suggestion", "Image"].map(
                            (header) => (
                              <th
                                key={header}
                                className="px-4 py-3 border-b border-gray-200 dark:border-white/10 font-medium uppercase tracking-wide text-xs"
                              >
                                {header}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {group.tasks.map((task, index) => (
                          <tr
                            key={index}
                            className={`border-b border-gray-200 dark:border-white/10 transition-colors ${
                              index % 2 === 0
                                ? "bg-gray-50 dark:bg-navy-900"
                                : "bg-white dark:bg-navy-800"
                            } hover:bg-gray-100 dark:hover:bg-navy-700`}
                          >
                            <td className="px-4 py-3">{index + 1}</td>
                            <td className="px-4 py-3">{task.taskName}</td>
                            <td className="px-4 py-3">{task.citizenName}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  task.taskStatus === "Completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300"
                                }`}
                              >
                                {task.taskStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {task.completed_date
                                ? new Date(task.completed_date).toLocaleDateString()
                                : "Not Completed"}
                            </td>
                            <td className="px-4 py-3">{task.suggesttion || "None"}</td>
                            <td className="px-4 py-3 text-center">
                              {task.imagePath ? (
                                <a
                                  href={task.imagePath}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  <FaEye />
                                </a>
                              ) : (
                                <span className="text-gray-500">No Image</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              <div className="flex justify-center mt-6 gap-3">
  <button
    onClick={handlePrev}
    disabled={currentPage === 1}
    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
      currentPage === 1
        ? "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
    }`}
  >
    Previous
  </button>

  <span className="flex items-center font-semibold text-gray-800 dark:text-white">
    Page {currentPage} of {totalPages || 1}
  </span>

  <button
    onClick={handleNext}
    disabled={currentPage === totalPages || totalPages === 0}
    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
      currentPage === totalPages || totalPages === 0
        ? "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
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

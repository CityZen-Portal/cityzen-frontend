import React from "react";
import { useNavigate } from "react-router-dom";

function ViewSchedule() {
  const navigate = useNavigate();
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const staffGroups = tasks.reduce((groups, task) => {
    if (!groups[task.staff]) {
      groups[task.staff] = [];
    }
    groups[task.staff].push(task);
    return groups;
  }, {});

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 px-4">
      <div className="bg-white dark:bg-navy-800 shadow rounded-lg">
        {/* Header */}
        <div className="bg-blue-600 dark:bg-navy-700 p-4 rounded-t-lg">
          <button
            onClick={() => navigate("/admin/services")}
            className="text-white hover:text-gray-200 transition-colors flex items-center gap-1 mb-2"
          >
            <span>←</span> Back
          </button>
          <h2 className="text-white text-lg font-semibold">Staff Schedule</h2>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {Object.keys(staffGroups).length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No tasks assigned yet.
            </p>
          ) : (
            Object.keys(staffGroups).map((staffName) => (
              <div
                key={staffName}
                className="border dark:border-navy-700 rounded-lg shadow-sm overflow-hidden"
              >
                {/* Staff header */}
                <div className="bg-gray-100 dark:bg-navy-600 px-4 py-2 font-bold text-gray-700 dark:text-gray-100">
                  👤 {staffName}
                </div>

                {/* Task list */}
                <div className="divide-y dark:divide-navy-700">
                  {staffGroups[staffName].map((task) => (
                    <div
                      key={task.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors"
                    >
                      <h3 className="font-semibold text-blue-700 dark:text-blue-300">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                        {task.description}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        📅 <strong>{task.date}</strong> &nbsp; ⏰{" "}
                        <strong>{task.time}</strong>
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        📍 {task.address}
                      </p>
                      <p className="text-xs italic mt-1 text-gray-500 dark:text-gray-400">
                        Status: {task.status || "Pending"}
                      </p>
                    </div>
                  ))}
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

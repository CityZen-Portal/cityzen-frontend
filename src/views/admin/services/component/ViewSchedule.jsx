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

      <div className="bg-white shadow rounded-lg">
        <div className="bg-blue-600 p-4 rounded-t-lg">
          <button
            onClick={() => navigate("/admin/services")}
            className="text-white hover:text-gray-200 transition-colors flex items-center gap-1 mb-2"
          >

      <div className="bg-white dark:bg-navy-800 shadow rounded-lg">
        <div className="bg-blue-600 dark:bg-navy-700 p-4 rounded-t-lg">
          <button onClick={() => navigate('/admin/services')} className="text-white hover:text-gray-200 transition-colors flex items-center gap-1 mb-2">

            <span>←</span> Back
          </button>
          <h2 className="text-white text-lg font-semibold">Staff Schedule</h2>
        </div>

        <div className="p-4 space-y-6">
          {Object.keys(staffGroups).length === 0 ? (
            <p className="text-gray-600">No tasks assigned yet.</p>
          ) : (
            Object.keys(staffGroups).map((staffName) => (
              <div
                key={staffName}
                className="border rounded-lg shadow-sm overflow-hidden"
              >
                {/* Staff Header */}
                <div className="bg-gray-100 px-4 py-2 font-bold text-gray-700">
                  👤 {staffName}
                </div>

                {/* Task list for this staff */}
                <div className="divide-y">
                  {staffGroups[staffName].map((task) => (
                    <div key={task.id} className="p-4 hover:bg-gray-50">
                      <h3 className="font-semibold text-blue-700">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {task.description}
                      </p>
                      <p className="text-sm">
                        📅 <strong>{task.date}</strong> &nbsp; ⏰{" "}
                        <strong>{task.time}</strong>
                      </p>
                      <p className="text-sm">📍 {task.address}</p>
                      <p className="text-xs italic mt-1 text-gray-500">
                        Status: {task.status}
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

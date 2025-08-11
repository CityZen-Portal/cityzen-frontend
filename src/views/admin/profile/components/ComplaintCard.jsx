import React from "react";
import { FaLightbulb } from "react-icons/fa";

export default function ComplaintCard({ comp, getStatusClass }) {
  return (
    <div className="flex items-start gap-3">
      <FaLightbulb className="flex-shrink-0 text-xl text-yellow-500" />

      <div className="flex flex-col">
        {/* Issue Name */}
        <span className="font-semibold text-gray-900 dark:text-white">
          {comp.issue || "No Issue"}
        </span>

        {/* Issue Description */}
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {comp.issueDescription || "No description provided"}
        </span>

        {/* Date */}
        <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Date:{" "}
          {comp.complaintDate
            ? new Date(comp.complaintDate).toLocaleDateString()
            : "No Date"}
        </span>

        {/* Status */}
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Status:{" "}
          <span className={getStatusClass(comp.status)}>
            {comp.status || "Unknown"}
          </span>
        </span>

        {/* Category & Department */}
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Category: {comp.category || "N/A"} | Department:{" "}
          {comp.department || "N/A"}
        </span>
      </div>
    </div>
  );
}

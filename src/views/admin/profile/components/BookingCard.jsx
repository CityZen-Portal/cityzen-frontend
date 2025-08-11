import React from "react";
import {
  MdWork,
  MdCalendarToday,
  MdCheckCircle,
  MdPerson,
} from "react-icons/md";

export default function BookingCardTailwind({ booking }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "inprogress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-md transition-all duration-200 hover:scale-[1.01] hover:shadow-lg dark:bg-navy-800">
      {/* Header: Service Name + Status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MdWork className="text-xl text-blue-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {booking.serviceName}
          </h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
            booking.status
          )}`}
        >
          {booking.status}
        </span>
      </div>

      {/* Dates */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <MdCalendarToday className="text-green-500" />
          <span>Requested: {formatDate(booking.requestedDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MdCalendarToday className="text-teal-500" />
          <span>
            Completed:{" "}
            {booking.completedDate
              ? formatDate(booking.completedDate)
              : "Not Completed"}
          </span>
        </div>
      </div>

      {/* Citizen & Staff Info */}
      <div className="flex flex-wrap justify-between gap-4 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <MdPerson className="text-purple-500" />
          <span>{booking.citizenName}</span>
        </div>
        <div className="flex items-center gap-2">
          <MdPerson className="text-orange-500" />
          <span>{booking.staffName || "N/A"}</span>
        </div>
      </div>
    </div>
  );
}

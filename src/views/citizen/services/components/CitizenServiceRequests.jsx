import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Pagination from "components/pagination";
import {
  MdArrowUpward,
  MdArrowDownward,
  MdSort,
  MdBuild,
  MdDateRange,
  MdPerson,
  MdSupervisorAccount,
  MdCheckCircle,
  MdDescription,
  MdClose,
  MdReport,
  MdFeedback,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

// Spinner component for loading inside buttons
const ButtonSpinner = () => (
  <svg
    className="h-4 w-4 animate-spin text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    ></path>
  </svg>
);

// Skeleton loader for table rows
const TableSkeleton = ({ rows = 5 }) => (
  <>
    {Array.from({ length: rows }).map((_, idx) => (
      <tr
        key={idx}
        className="animate-pulse border-b bg-white dark:bg-navy-700"
      >
        <td className="px-6 py-4">
          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-600"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-600"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-600"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-6 w-16 rounded bg-gray-200 dark:bg-gray-600"></div>
        </td>
      </tr>
    ))}
  </>
);

// Skeleton for details view
const DetailsSkeleton = () => (
  <div className="animate-pulse rounded-xl border border-gray-200 p-6 shadow-md dark:border-navy-600 dark:bg-navy-700">
    <div className="mb-4 h-6 w-48 rounded bg-gray-200 dark:bg-gray-600"></div>
    {Array.from({ length: 6 }).map((_, idx) => (
      <div
        key={idx}
        className="mb-3 h-4 w-56 rounded bg-gray-200 dark:bg-gray-600"
      ></div>
    ))}
  </div>
);

const CitizenServiceRequests = () => {
  const [viewingDetails, setViewingDetails] = useState(null);
  const [sortField, setSortField] = useState("requestedDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(null);

  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = localStorage.getItem("id");
        const response = await axios.get(
          `https://utility-booking-backend.onrender.com/api/task/dto/${id}`
        );
        setData(response.data.data.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  function formatDate(isoString) {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-IN", options);
  }

  const filteredData = useMemo(() => {
    if (statusFilter === "ALL") return data;
    return data.filter(
      (request) =>
        request.taskStatus &&
        request.taskStatus.toUpperCase().trim() === statusFilter.toUpperCase()
    );
  }, [data, statusFilter]);

  const sortedRequests = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField.toLowerCase().includes("date")) {
        aVal = aVal ? new Date(aVal) : new Date(0);
        bVal = bVal ? new Date(bVal) : new Date(0);
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [filteredData, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);

  const paginatedRequest = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRequests.slice(start, start + itemsPerPage);
  }, [sortedRequests, currentPage, itemsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleButtonClick = (type, callback) => {
    setButtonLoading(type);
    setTimeout(() => {
      callback();
      setButtonLoading(null);
    }, 800);
  };

  return (
    <div className="text-slate-800 dark:text-slate-100 rounded-2xl bg-white p-6 dark:bg-navy-800">
      {/* Filter Buttons */}
      <div className="mb-4 flex gap-4">
        {["ALL", "PENDING", "COMPLETED"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setCurrentPage(1);
              setViewingDetails(null);
            }}
            className={`rounded-xl px-4 py-2 font-medium shadow-sm transition-colors duration-200
              ${
                statusFilter === status
                  ? "bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white"
                  : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:hover:bg-indigo-500/30"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="text-slate-800 dark:text-slate-100 bg-gray-100 dark:bg-navy-700">
            <tr className="text-xs uppercase tracking-wider">
              {[
                { label: "Service", field: "serviceName" },
                { label: "Date", field: "requestedDate" },
                { label: "Status", field: "taskStatus" },
              ].map(({ label, field }) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className="cursor-pointer select-none px-6 py-3 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortField === field ? (
                      sortDirection === "asc" ? (
                        <MdArrowUpward className="text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <MdArrowDownward className="text-indigo-600 dark:text-indigo-400" />
                      )
                    ) : (
                      <MdSort className="dark:text-slate-500 text-gray-400" />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={5} />
            ) : paginatedRequest.length > 0 ? (
              paginatedRequest.map((request, idx) => (
                <tr
                  key={request.serviceId || idx}
                  className="text-slate-800 hover:bg-slate-50 dark:text-slate-100 border-b bg-white dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
                >
                  <td className="px-6 py-4 font-medium">
                    {request.serviceName}
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(request.requestedDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        request.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200/20 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-200/20 dark:text-green-400"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        handleButtonClick("view", () =>
                          setViewingDetails(request)
                        )
                      }
                      className="flex items-center gap-2 rounded-lg bg-indigo-100 px-4 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500"
                    >
                      {buttonLoading === "view" && <ButtonSpinner />}
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-slate-600 dark:text-slate-400 px-6 py-4 text-center"
                >
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Details View */}
      {viewingDetails &&
        (loading ? (
          <DetailsSkeleton />
        ) : (
          <div className="dark:text-slate-100 mt-8 rounded-xl border border-gray-200 p-6 shadow-md dark:border-navy-600 dark:bg-navy-700">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-indigo-700 dark:text-indigo-400">
              <MdBuild /> Service Request Details
            </h2>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <MdBuild className="text-indigo-500 dark:text-indigo-400" />{" "}
                {viewingDetails.serviceName}
              </p>
              <p className="flex items-center gap-2">
                <MdDateRange className="text-green-500 dark:text-green-400" />{" "}
                {formatDate(viewingDetails.requestedDate)}
              </p>
              <p className="flex items-center gap-2">
                <MdCheckCircle
                  className={
                    viewingDetails.status === "PENDING"
                      ? "text-yellow-500 dark:text-yellow-400"
                      : "text-green-500 dark:text-green-400"
                  }
                />
                {viewingDetails.status}
              </p>
              <p className="flex items-center gap-2">
                <MdPerson className="text-blue-500 dark:text-blue-400" />{" "}
                {viewingDetails.citizenName}
              </p>
              <p className="flex items-center gap-2">
                <MdSupervisorAccount className="text-purple-500 dark:text-purple-400" />{" "}
                {viewingDetails.staffName}
              </p>
              <p className="flex items-center gap-2">
                <MdDateRange className="text-gray-500 dark:text-gray-400" />{" "}
                {formatDate(viewingDetails.completedDate)}
              </p>
              <p className="flex items-center gap-2">
                <MdDescription className="text-orange-500 dark:text-orange-400" />{" "}
                {viewingDetails.description || "N/A"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-3">
              {viewingDetails.status.toLowerCase() === "pending" && (
                <button
                  onClick={() =>
                    handleButtonClick("report", () => navigate("reportform"))
                  }
                  className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
                >
                  {buttonLoading === "report" && <ButtonSpinner />}
                  <MdReport /> Report
                </button>
              )}
              {viewingDetails.status.toLowerCase() === "completed" && (
                <button
                  onClick={() =>
                    handleButtonClick("feedback", () => navigate("feedform"))
                  }
                  className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
                >
                  {buttonLoading === "feedback" && <ButtonSpinner />}
                  <MdFeedback /> Feedback
                </button>
              )}
              <button
                onClick={() =>
                  handleButtonClick("close", () => setViewingDetails(null))
                }
                className="flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                {buttonLoading === "close" && <ButtonSpinner />}
                <MdClose /> Close
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default CitizenServiceRequests;

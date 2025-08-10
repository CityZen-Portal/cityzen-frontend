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

const CitizenServiceRequests = () => {
  const [viewingDetails, setViewingDetails] = useState(null);
  const [sortField, setSortField] = useState("requestedDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const navigate = useNavigate();

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
            className={`rounded px-4 py-2 transition ${
              statusFilter === status
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="text-slate-800 dark:bg-navy-700 dark:text-white">
            <tr className="text-xs uppercase tracking-wider">
              {[
                { label: "Service", field: "serviceName" },
                { label: "Date", field: "requestedDate" },
                { label: "Status", field: "taskStatus" },
              ].map(({ label, field }) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className="cursor-pointer select-none px-6 py-3 hover:text-indigo-600"
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {sortField === field ? (
                      sortDirection === "asc" ? (
                        <MdArrowUpward />
                      ) : (
                        <MdArrowDownward />
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
            {paginatedRequest.length > 0 ? (
              paginatedRequest.map((request, idx) => (
                <tr
                  key={request.serviceId || idx}
                  className="hover:bg-slate-50 border-b bg-white transition-colors dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
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
                      onClick={() => setViewingDetails(request)}
                      className="rounded-lg bg-indigo-100 px-4 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500"
                    >
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
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Details View */}
      {viewingDetails && (
        <div className="mt-8 rounded-xl border border-gray-200 p-6 shadow-md dark:border-navy-600 dark:bg-navy-700">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-indigo-700 dark:text-indigo-400">
            <MdBuild /> Service Request Details
          </h2>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <MdBuild className="text-indigo-500" />{" "}
              {viewingDetails.serviceName}
            </p>
            <p className="flex items-center gap-2">
              <MdDateRange className="text-green-500" />{" "}
              {formatDate(viewingDetails.requestedDate)}
            </p>
            <p className="flex items-center gap-2">
              <MdCheckCircle
                className={
                  viewingDetails.status === "PENDING"
                    ? "text-yellow-500"
                    : "text-green-500"
                }
              />
              {viewingDetails.status}
            </p>
            <p className="flex items-center gap-2">
              <MdPerson className="text-blue-500" />{" "}
              {viewingDetails.citizenName}
            </p>
            <p className="flex items-center gap-2">
              <MdSupervisorAccount className="text-purple-500" />{" "}
              {viewingDetails.staffName}
            </p>
            <p className="flex items-center gap-2">
              <MdDateRange className="text-gray-500" />{" "}
              {formatDate(viewingDetails.completedDate)}
            </p>
            <p className="flex items-center gap-2">
              <MdDescription className="text-orange-500" />{" "}
              {viewingDetails.description || "N/A"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-3">
            {viewingDetails.status.toLowerCase() === "pending" && (
              <button
                onClick={() => navigate("reportform")}
                className="flex items-center gap-1 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                <MdReport /> Report
              </button>
            )}
            {viewingDetails.status.toLowerCase() === "completed" && (
              <button
                onClick={() => navigate("feedform")}
                className="flex items-center gap-1 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                <MdFeedback /> Feedback
              </button>
            )}
            <button
              onClick={() => setViewingDetails(null)}
              className="flex items-center gap-1 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              <MdClose /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenServiceRequests;

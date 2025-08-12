import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Pagination from "components/pagination";
import { MdArrowUpward, MdArrowDownward, MdSort } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // Add this at the top
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  FaTools,
  FaCalendarAlt,
  FaUser,
  FaUserTie,
  FaCheckCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

const CitizenServiceRequests = () => {
  const [loading, setLoading] = useState(true);
  const [viewingDetails, setViewingDetails] = useState(null);
  const [sortField, setSortField] = useState("requestedDate");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
        request.status &&
        request.status === statusFilter.toUpperCase()
    );
  }, [data, statusFilter]);
  // console.log(filteredData);
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
  const navigate = useNavigate();
  return (
    <div className="text-slate-800 dark:text-slate-100 rounded-2xl bg-white p-6 dark:bg-navy-800">
      <div className="mb-4 flex gap-4">
        {["ALL", "PENDING", "COMPLETED"].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setCurrentPage(1);
              setViewingDetails(null);
            }}
            className={`rounded px-4 py-2 ${
              statusFilter === status
                ? "bg-indigo-600 text-white"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="text-slate-800 dark:text-slate-100 dark:bg-navy-700 dark:text-white">
            <tr className="text-xs uppercase tracking-wider">
              <th
                onClick={() => handleSort("serviceName")}
                className="cursor-pointer select-none px-6 py-3 hover:text-indigo-600"
              >
                <div className="flex items-center gap-1">
                  Service
                  {sortField === "serviceName" ? (
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
              <th
                onClick={() => handleSort("requestedDate")}
                className="cursor-pointer select-none px-6 py-3 hover:text-indigo-600"
              >
                <div className="flex items-center gap-1">
                  Date
                  {sortField === "requestedDate" ? (
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
              <th
                onClick={() => handleSort("taskStatus")}
                className="cursor-pointer select-none px-6 py-3 hover:text-indigo-600"
              >
                <div className="flex items-center gap-1">
                  Status
                  {sortField === "taskStatus" ? (
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
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, idx) => (
                <tr key={idx} className="border-b bg-white dark:bg-navy-700">
                  <td className="px-6 py-4">
                    <Skeleton width={120} height={16} />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton width={100} height={16} />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton width={80} height={16} />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton width={60} height={24} />
                  </td>
                </tr>
              ))
            ) : paginatedRequest.length > 0 ? (
              paginatedRequest.map((request, idx) => (
                <tr
                  key={request.serviceId || idx}
                  className="hover:bg-slate-50 border-b bg-white transition-colors dark:border-navy-600 dark:bg-navy-700 dark:text-white dark:hover:bg-navy-600"
                >
                  <td className="text-slate-900 px-6 py-4 font-medium dark:text-white">
                    {request.serviceName}
                  </td>
                  <td className="px-6 py-4">{request.requestedDate}</td>
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
                      className="rounded-lg bg-indigo-100 px-4 py-1.5 text-xs font-medium text-indigo-700 transition-all hover:bg-indigo-200 dark:bg-indigo-600 dark:text-white dark:hover:bg-indigo-500"
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
                  className="text-slate-600 dark:text-slate-400 px-6 py-4 text-center dark:text-white"
                >
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {viewingDetails && (
        <div className="mt-8 rounded-xl border border-gray-200 p-6 shadow-md dark:border-navy-600 dark:bg-navy-700 dark:text-white">
          <h2 className="mb-6 text-xl font-semibold text-indigo-700 dark:text-indigo-400">
            Service Request Details
          </h2>

          <p className="flex items-center gap-3 text-lg">
            <FaTools className="text-blue-500" /> {viewingDetails.serviceName}
          </p>

          <p className="flex items-center gap-3 text-lg">
            <FaCalendarAlt className="text-orange-500" />{" "}
            {viewingDetails.requestedDate}
          </p>

          <p className="flex items-center gap-3 text-lg">
            <FaUser className="text-pink-500" /> {viewingDetails.citizenName}
          </p>

          <p className="flex items-center gap-3 text-lg">
            <FaUserTie className="text-yellow-500" /> {viewingDetails.staffName}
          </p>

          <p className="flex items-center gap-3 text-lg">
            <FaCheckCircle className="text-green-500" />{" "}
            {formatDate(viewingDetails.completedDate) || "N/A"}
          </p>

          <p className="flex items-center gap-3 text-lg">
            <FaInfoCircle className="text-purple-500" />{" "}
            {viewingDetails.description || "N/A"}
          </p>

          {/* Conditional Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {viewingDetails.status.toLowerCase() === "pending" && (
              <button
                onClick={() => navigate("reportform")}
                className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-white shadow transition-colors hover:bg-red-700"
              >
                <FaInfoCircle /> Report
              </button>
            )}
            {viewingDetails.status.toLowerCase() === "completed" && (
              <button
                onClick={() => navigate("feedform")}
                className="flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-white shadow transition-colors hover:bg-green-700"
              >
                <FaCheckCircle /> Feedback
              </button>
            )}
            <button
              onClick={() => setViewingDetails("")}
              className="flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-white shadow transition-colors hover:bg-indigo-700"
            >
              <FaTimes /> Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenServiceRequests;

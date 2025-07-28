import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Pagination from "components/pagination";
import RequestDetails from "../../../staff/services/component/RequestDetails";
import {
  MdOutlineAssignment,
  MdPendingActions,
  MdCheckCircleOutline,
  MdArrowUpward,
  MdArrowDownward,
  MdSort,
} from "react-icons/md";

const CitizenServiceRequests = ({ id }) => {
  const [viewingDetails, setViewingDetails] = useState(null);
  const [viewMode, setViewMode] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://utility-booking-backend.onrender.com/api/task/citizen/1234"
        );
        console.log(response.data.data.data);
        setData(response.data.data.data );
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    fetchData();
  }, []);

  const filteredRequests = useMemo(() => {
    let filtered = data.filter((req) => req.citizenId === id);
    if (viewMode !== "all") {
      filtered = filtered.filter((req) => req.status === viewMode);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.service.toLowerCase().includes(term) ||
          req.date.toLowerCase().includes(term) ||
          req.status.toLowerCase().includes(term) ||
          (req.description && req.description.toLowerCase().includes(term))
      );
    }
    return filtered;
  }, [data, searchTerm, viewMode, id]);

  const sortedRequests = useMemo(() => {
    return [...filteredRequests].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortField === "date") {
        return sortDirection === "asc"
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
      }
      if (typeof aVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [filteredRequests, sortField, sortDirection]);

  const paginatedRequest = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedRequests.slice(start, start + itemsPerPage);
  }, [sortedRequests, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);

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
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "completed"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 
                ${
                  viewMode === mode
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:bg-navy-700 dark:hover:bg-navy-600"
                }`}
            >
              {mode === "all" && <MdOutlineAssignment />}
              {mode === "pending" && <MdPendingActions />}
              {mode === "completed" && <MdCheckCircleOutline />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search service, status, date..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-lg border bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-navy-600 dark:bg-navy-700 sm:w-72"
        />
      </div>

      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="text-slate-800 dark:text-slate-100 dark:bg-navy-700">
            <tr className="text-xs uppercase tracking-wider">
              {["service", "date", "status"].map((field) => (
                <th
                  key={field}
                  onClick={() => handleSort(field)}
                  className="cursor-pointer select-none px-6 py-3 hover:text-indigo-600"
                >
                  <div className="flex items-center gap-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
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
              paginatedRequest.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-slate-50 border-b bg-white transition-colors dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
                >
                  <td className="text-slate-900 px-6 py-4 font-medium dark:text-white">
                    {request.service}
                  </td>
                  <td className="px-6 py-4">{request.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold 
                        ${
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200/20 dark:text-yellow-400"
                            : "bg-green-100 text-green-800 dark:bg-green-200/20 dark:text-green-400"
                        }`}
                    >
                      {request.status.charAt(0).toUpperCase() +
                        request.status.slice(1)}
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
                  className="text-slate-600 dark:text-slate-400 px-6 py-4 text-center"
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

      <RequestDetails
        viewingDetails={viewingDetails}
        setViewingDetails={setViewingDetails}
      />
    </div>
  );
};

export default CitizenServiceRequests;

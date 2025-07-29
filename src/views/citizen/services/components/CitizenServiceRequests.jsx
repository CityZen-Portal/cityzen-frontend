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

const CitizenServiceRequests = () => {
  const [viewingDetails, setViewingDetails] = useState(null);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id=localStorage.getItem("id");
        const response = await axios.get(`https://utility-booking-backend.onrender.com/api/task/dto/${id}`);
        setData(response.data.data.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    fetchData();
  }, []);

  const sortedRequests = useMemo(() => {
    return [...data].sort((a, b) => {
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
  }, [data, sortField, sortDirection]);

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
              paginatedRequest.map((request,idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50 border-b bg-white transition-colors dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
                >
                  <td className="text-slate-900 px-6 py-4 font-medium dark:text-white">
                    {request.serviceName}
                  </td>
                  <td className="px-6 py-4">{request.requestedDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold 
                        ${
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-200/20 dark:text-yellow-400"
                            : "bg-green-100 text-green-800 dark:bg-green-200/20 dark:text-green-400"
                        }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
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

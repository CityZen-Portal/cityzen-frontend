import React, { useState, useMemo } from 'react';
import Card from "components/card";
import Pagination from 'components/pagination';
import {
  MdOutlineAssignment,
  MdCheckCircleOutline,
  MdPendingActions,
  MdArrowUpward,
  MdArrowDownward,
  MdFirstPage,
  MdLastPage,
  MdChevronLeft,
  MdChevronRight,
  MdSort
} from "react-icons/md";

const RequestsTable = ({
  viewMode,
  filteredRequests,
  handleViewDetails,
  handleComplete
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const searchedRequests = useMemo(() => {
    if (!searchTerm) return filteredRequests;
    const searchLower = searchTerm.toLowerCase();
    return filteredRequests.filter(request => {
      return (
        request.id.toString().includes(searchLower) ||
        request.citizenName.toLowerCase().includes(searchLower) ||
        request.service.toLowerCase().includes(searchLower) ||
        request.date.toLowerCase().includes(searchLower) ||
        request.status.toLowerCase().includes(searchLower) ||
        (request.staffName && request.staffName.toLowerCase().includes(searchLower)) ||
        (request.completedDate && request.completedDate.toLowerCase().includes(searchLower)) ||
        (request.description && request.description.toLowerCase().includes(searchLower))
      );
    });
  }, [filteredRequests, searchTerm]);

  const totalPages = Math.ceil(searchedRequests.length / itemsPerPage);

  const paginatedRequests = useMemo(() => {
    const sortedRequests = [...searchedRequests].sort((a, b) => {
      if (sortField === 'date' || sortField === 'completedDate') {
        const dateA = new Date(a[sortField]);
        const dateB = new Date(b[sortField]);
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (typeof a[sortField] === 'string') {
        return sortDirection === 'asc'
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
      return sortDirection === 'asc'
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    });
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [searchedRequests, sortField, sortDirection, currentPage, itemsPerPage]);

  return (
    <Card extra="">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-full bg-brand-500 p-2 text-white">
            <MdOutlineAssignment className="h-6 w-6" />
          </div>
          <h5 className="text-xl font-bold text-navy-700 dark:text-white">
            {viewMode === "all" ? "All Service Requests" :
              viewMode === "pending" ? "Pending Requests" : "Completed Requests"}
          </h5>
        </div>

        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <label className="text-sm text-gray-600 dark:text-gray-400">Show</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-700 dark:text-white text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {[5, 10, 25, 50].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">entries</span>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-4 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 bg-gray-50 dark:bg-navy-900 rounded-xl">
            <div className="rounded-full bg-gray-200 dark:bg-navy-800 p-4 mb-3">
              <MdOutlineAssignment className="h-10 w-10 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-lg font-medium text-navy-700 dark:text-white mb-1">No requests found</p>
            <p className="text-gray-500 dark:text-gray-400">There are no service requests in this category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700">
                  {[
                    { label: "ID", key: "id" },
                    { label: "Citizen", key: "citizenName" },
                    { label: "Service", key: "service" },
                    { label: "Date", key: "date" },
                    { label: "Status", key: "status" },
                    ...(viewMode === "completed"
                      ? [{ label: "Completed", key: "completedDate" }, { label: "Staff", key: "staffName" }]
                      : []),
                  ].map(col => (
                    <th
                      key={col.key}
                      className="py-4 px-4 text-left text-sm font-bold text-navy-700 dark:text-white cursor-pointer select-none"
                      onClick={() => handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        <span>{col.label}</span>
                        {sortField === col.key ? (
                          sortDirection === 'asc' ? <MdArrowUpward className="h-4 w-4" /> : <MdArrowDownward className="h-4 w-4" />
                        ) : <MdSort className="h-4 w-4 text-gray-400" />}
                      </div>
                    </th>
                  ))}
                  <th className="py-4 px-4 text-left text-sm font-bold text-navy-700 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request, index) => (
                  <tr
                    key={request.id}
                    className={`border-b border-gray-200 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-900 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-navy-800' : 'bg-gray-50/50 dark:bg-navy-700/50'}`}
                  >
                    <td className="py-4 px-4 text-sm font-medium text-navy-700 dark:text-white">{request.id}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">{request.citizenName}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">{request.service}</td>
                    <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">{request.date}</td>
                    <td className="py-4 px-4 text-sm">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'}`}
                      >
                        {request.status === 'pending' ? (
                          <>
                            <MdPendingActions className="h-3.5 w-3.5" />
                            <span>Pending</span>
                          </>
                        ) : (
                          <>
                            <MdCheckCircleOutline className="h-3.5 w-3.5" />
                            <span>Completed</span>
                          </>
                        )}
                      </span>
                    </td>
                    {viewMode === "completed" && (
                      <>
                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">{request.completedDate}</td>
                        <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-300">{request.staffName}</td>
                      </>
                    )}
                    <td className="py-4 px-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          <span>View</span>
                        </button>
                        {request.status === 'pending' && (
                          <button
                            onClick={() => handleComplete(request.id)}
                            className="px-3 py-1.5 rounded-xl bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <MdCheckCircleOutline className="h-3.5 w-3.5" />
                            <span>Complete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredRequests.length > 0 && (
         <div className="mt-4 pt-4 border-t border-gray-200 dark:border-navy-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
         <div className="text-sm text-gray-600 dark:text-gray-400">
           Showing {searchedRequests.length > 0 ? Math.min((currentPage - 1) * itemsPerPage + 1, searchedRequests.length) : 0} 
           to {Math.min(currentPage * itemsPerPage, searchedRequests.length)} of {searchedRequests.length} entries
           {searchTerm && <span> (filtered from {filteredRequests.length} total entries)</span>}
         </div>
      
         <Pagination 
           currentPage={currentPage}
           totalPages={totalPages}
           onPageChange={(page) => setCurrentPage(page)}
         />
       </div>
       
        )}

      </div>
    </Card>
  );
};

export default RequestsTable;

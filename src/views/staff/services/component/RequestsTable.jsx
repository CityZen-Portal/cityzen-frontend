import React, { useState, useMemo } from 'react';
import Card from 'components/card';
import Pagination from 'components/pagination';
import {
  MdOutlineAssignment,
  MdCheckCircleOutline,
  MdPendingActions,
  MdArrowUpward,
  MdArrowDownward,
  MdSort
} from 'react-icons/md';

const RequestsTable = ({
  viewMode,
  filteredRequests,
  handleViewDetails,
  handleComplete,
  loading,
  scrollToForm 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortField, setSortField] = useState('citizenName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const searchedRequests = useMemo(() => {
    if (!searchTerm) return filteredRequests;
    const searchLower = searchTerm.toLowerCase();
    return filteredRequests.filter(request =>
      (request.citizenName || '').toLowerCase().includes(searchLower) ||
      (request.description || '').toLowerCase().includes(searchLower) ||
      (request.requested_Date || '').toLowerCase().includes(searchLower) ||
      (request.taskStatus || '').toLowerCase().includes(searchLower) ||
      (request.staffName || '').toLowerCase().includes(searchLower) ||
      (request.completedDate || '').toLowerCase().includes(searchLower)
    );
  }, [filteredRequests, searchTerm]);

  const sortedRequests = useMemo(() => {
    return [...searchedRequests].sort((a, b) => {
      const aValue = a[sortField] || '';
      const bValue = b[sortField] || '';
      if (sortField.toLowerCase().includes('date')) {
        return sortDirection === 'asc'
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }
      return sortDirection === 'asc'
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });
  }, [searchedRequests, sortField, sortDirection]);

  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedRequests, currentPage, itemsPerPage]);
   console.log(paginatedRequests);
  const totalPages = Math.ceil(searchedRequests.length / itemsPerPage);

  return (
    <Card extra="">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="rounded-full bg-brand-500 p-2 text-white">
            <MdOutlineAssignment className="h-6 w-6" />
          </div>
          <h5 className="text-xl font-bold text-navy-700 dark:text-white">
            {viewMode === 'all'
              ? 'All Service Requests'
              : viewMode === 'pending'
              ? 'Pending Requests'
              : 'Completed Requests'}
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
              className="rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-700 dark:text-white text-sm py-1 px-2"
            >
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
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
              className="pl-8 pr-4 py-2 rounded-lg border border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-navy-700 dark:text-white text-sm"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl shadow-md">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700">
                {[
                  { label: 'Citizen', key: 'citizenName' },
                  { label: 'Service', key: 'description' },
                  { label: 'Date', key: 'requested_Date' },
                  { label: 'Status', key: 'taskStatus' },
                  ...(viewMode === 'completed'
                    ? [
                        { label: 'Completed', key: 'completedDate' },
                        { label: 'Staff', key: 'staffName' }
                      ]
                    : [])
                ].map((col) => (
                  <th
                    key={col.key}
                    className="py-4 px-4 text-left text-sm font-bold text-navy-700 dark:text-white cursor-pointer"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.label}</span>
                      {sortField === col.key ? (
                        sortDirection === 'asc' ? (
                          <MdArrowUpward className="h-4 w-4" />
                        ) : (
                          <MdArrowDownward className="h-4 w-4" />
                        )
                      ) : (
                        <MdSort className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="py-4 px-4 text-left text-sm font-bold text-navy-700 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="100%" className="text-center py-6 text-gray-500">
                    Loading requests...
                  </td>
                </tr>
              ) : paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan="100%" className="text-center py-6 text-gray-500">
                    No data found.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((request, index) => (
                  <tr
                    key={request.taskId}
                    className={`border-b hover:bg-gray-50 dark:hover:bg-navy-900 transition-colors ${
                      index % 2 === 0
                        ? 'bg-white dark:bg-navy-800'
                        : 'bg-gray-50/50 dark:bg-navy-700/50'
                    }`}
                  >
                    <td className="py-4 px-4">{request.citizenName}</td>
                    <td className="py-4 px-4">{request.description}</td>
                    <td className="py-4 px-4">{request.requested_Date}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                          request.taskStatus === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {request.taskStatus === 'PENDING' ? (
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
                    {viewMode === 'completed' && (
                      <>
                        <td className="py-4 px-4">{request.completedDate}</td>
                        <td className="py-4 px-4">{request.staffName}</td>
                      </>
                    )}
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            handleViewDetails(request);
                            scrollToForm?.();
                          }}
                          className="text-blue-500 dark:text-cyan-500 "
                        >
                          View
                        </button>

                        {request.taskStatus === 'PENDING' && (
                          <button
                            onClick={() => {
                              handleComplete(request);
                              scrollToForm?.();
                            }}
                            className="text-green-700 dark:text-green-500"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredRequests.length > 0 && (
          <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, searchedRequests.length)} to {Math.min(currentPage * itemsPerPage, searchedRequests.length)} of {searchedRequests.length} entries
              {searchTerm && (
                <span> (filtered from {filteredRequests.length} total entries)</span>
              )}
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

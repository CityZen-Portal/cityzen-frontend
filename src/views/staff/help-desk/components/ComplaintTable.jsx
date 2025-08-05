import React, { useState } from 'react';
import PageNavigator from './PageNavigator';
import Rows from './Rows';
import { MdArrowUpward, MdArrowDownward, MdUnfoldMore, MdSearch } from 'react-icons/md';
import {
  getStatusColor,
  getStatusText,
  filterComplaints,
  sortComplaints,
} from '../../../citizen/help-desk/utils/helpers';

const ComplaintTable = ({ extra, complaints }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  
  const filteredComplaints = filterComplaints(complaints, statusFilter, searchTerm);

  const sortedComplaints = sortComplaints(filteredComplaints, sortConfig);

  const totalPages = Math.ceil(filteredComplaints.length / rowsPerPage);
  const paginatedComplaints = sortedComplaints.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 ${extra}`}>
      {/* Filter & Search */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className='flex gap-4'>
          {/* Status Filter */}
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
              Filter by Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border dark:border-gray-700 bg-white text-gray-800 dark:bg-navy-700 dark:text-white text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-navy-500"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Rows Per Page */}
          <div>
            <label htmlFor="rowsPerPage" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
              Rows per page
            </label>
            <select
              id="rowsPerPage"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border dark:border-gray-700 bg-white text-gray-800 dark:bg-navy-700 dark:text-white text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-navy-500"
            >
              {[5, 10, 25, 50].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div>
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
            Search
          </label>
          <input
            type="text"
            id="searchTerm"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-md border dark:border-gray-700 bg-white text-gray-800 dark:bg-navy-700 dark:text-white text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-navy-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6">
        <div className="inline-block min-w-full align-middle p-2">
          <div className="overflow-hidden md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
              <thead className="bg-gray-100 dark:bg-navy-700 hidden md:table-header-group">
                <tr>
                  {[
                    { label: 'ID', key: 'id' },
                    { label: 'Issue', key: 'issue' },
                    { label: 'Department', key: 'department' },
                    { label: 'Location', key: 'street' },
                    { label: 'Date', key: 'complaintDate' },
                    { label: 'Status', key: 'status' },
                    { label: 'Actions', key: '' },
                  ].map(({ label, key }, idx) => (
                    <th
                      key={idx}
                      onClick={() => key && handleSort(key)}
                      className={`px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-white ${
                        key ? 'cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-navy-800' : ''
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <span className="truncate">{label}</span>
                        {key && (
                          <span className="flex-shrink-0">
                            {sortConfig.key === key ? (
                              sortConfig.direction === 'asc' ? (
                                <MdArrowUpward className="text-xs" />
                              ) : (
                                <MdArrowDownward className="text-xs" />
                              )
                            ) : (
                              label !== 'Actions' && <MdUnfoldMore className="text-xs opacity-50" />
                            )}
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                <Rows 
                  complaints={paginatedComplaints}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                />
                {paginatedComplaints.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 px-4 text-gray-500 dark:text-gray-300">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-4xl"><MdSearch /></div>
                        <div className="text-sm font-medium">No complaints found</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <PageNavigator
        filteredComplaints={filteredComplaints}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        pageNumbers={pageNumbers}
      />
    </div>
  );
};

export default ComplaintTable;
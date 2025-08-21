import Rows from './Rows';
import React, { useState, useMemo } from 'react';
import FeedbackList from 'views/admin/complaints/components/FeedbackList';
import PageNavigator from 'views/citizen/help-desk/components/PageNavigator';
import { MdArrowUpward, MdArrowDownward, MdUnfoldMore, MdSearch } from 'react-icons/md';

import {
  getStatusText,
  filterComplaints,
  sortComplaints,
  statusOptions,
} from '../utils/helpers';
import SkeletonRow from './SkeletonRow';

/**
 * @param {string} userRole - The role of the user ('admin', 'citizen', 'staff')
 * @param {Array} complaints
 * @param {string} [extra]
 */

const ComplaintTable = ({ userRole = 'citizen', complaints, loading, extra = '' }) => {
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

  const headers = useMemo(() => {
    const baseHeaders = [
      { label: 'ID', key: 'id' },
      { label: 'Issue', key: 'issue' },
      { label: 'Department', key: 'department' },
      { label: 'Date', key: 'complaintDate' },
      { label: 'Status', key: 'status' },
    ];

    switch (userRole) {
      case 'citizen':
        return [
          ...baseHeaders,
          { label: 'View', key: '' },
          { label: 'Feedback', key: '' },
        ];
      case 'admin':
      case 'staff':
      default:
        return [
          ...baseHeaders,
          { label: 'Actions', key: '' },
        ];
    }
  }, [userRole]);

  // Logic to get complaints with feedback, only needed for admin
  const complaintsWithFeedback = useMemo(() => {
    if (userRole !== 'admin') return [];
    return filteredComplaints.filter((c) =>
      Boolean(
        c.feedback
        || (Array.isArray(c.feedbacks) && c.feedbacks.length > 0)
        || c.feedbackSubmitted
        || (c.feedbackComments || c.feedbackRating || c.rating)
      )
    );
  }, [userRole, filteredComplaints]);

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
    <div className={`rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 ${extra}`}>
      {/* Filter & Search Section */}
      {/* Filter & Search Section */}
      <div className="mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        {/* Search Input on the Left */}
        <div className="flex-1 md:w-72 lg:w-80">
          <label
            htmlFor="searchTerm"
            className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
          >
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

        {/* Filters on the Right */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          {/* Status Filter */}
          <div>
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
            >
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
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {getStatusText(s)}
                </option>
              ))}
            </select>
          </div>

          {/* Rows Per Page */}
          <div>
            <label
              htmlFor="rowsPerPage"
              className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
            >
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
              {[5, 10, 25, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto -mx-3 sm:mx-0 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
          {/* Desktop Table Header - Universal, but hidden on mobile */}
          <thead className="bg-gray-100 dark:bg-navy-800 hidden md:table-header-group">
            <tr>
              {headers.map(({ label, key }, idx) => (
                <th
                  key={idx}
                  onClick={() => key && handleSort(key)}
                  className={`px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-700 bg-gray-100 dark:bg-navy-700 dark:text-white ${key ? 'cursor-pointer select-none' : ''}`}
                >
                  <span className="flex items-center gap-1">
                    <span className="truncate">{label}</span>
                    {key && (
                      <span className="flex-shrink-0">
                        {sortConfig.key === key ? (
                          sortConfig.direction === 'asc' ? <MdArrowUpward className="text-xs" /> : <MdArrowDownward className="text-xs" />
                        ) : (
                          <MdUnfoldMore className="text-xs opacity-50" />
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Mobile Table Header - Renders only for citizen role */}
          {userRole === 'citizen' && (
            <thead className="md:hidden">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-800 dark:text-white bg-gray-100 dark:bg-navy-800">
                  <div className="flex items-center justify-between">
                    <span>Complaints</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {filteredComplaints.length} results
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
          )}

          <tbody className="bg-white dark:bg-navy-800 divide-y divide-gray-200 dark:divide-gray-600">
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => <SkeletonRow key={index} userRole={userRole} />)
            ) : (
              <>
                <Rows 
                  userRole={userRole}
                  complaints={paginatedComplaints}
                />
                {paginatedComplaints.length === 0 && (
                  <tr>
                    <td colSpan={headers.length} className="text-center py-8 px-4 text-gray-500 dark:text-gray-300">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="text-4xl"><MdSearch /></div>
                        <div className="text-sm font-medium">No complaints found</div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
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

      {/* Feedback List - Renders only for admin role */}
      {userRole === 'admin' && (
        <FeedbackList complaintsWithFeedback={complaintsWithFeedback} />
      )}
    </div>
  );
};

export default ComplaintTable;
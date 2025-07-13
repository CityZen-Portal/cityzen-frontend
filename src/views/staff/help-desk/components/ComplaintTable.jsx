import React, { useState } from 'react';
import PageNavigator from './PageNavigator';
import Rows from './Rows';
import { MdArrowUpward, MdArrowDownward, MdUnfoldMore } from 'react-icons/md';

const ComplaintTable = ({ complaints }) => {
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const statusPriority = {
    'pending': 1,
    'under-review': 2,
    'assigned': 3,
    'in-progress': 4,
    'on-hold': 5,
    'resolved': 6,
    'rejected': 7,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900';
      case 'under-review': return 'bg-amber-100 text-amber-800 dark:bg-amber-200 dark:text-amber-900';
      case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-200 dark:text-indigo-900';
      case 'on-hold': return 'bg-gray-200 text-gray-700 dark:bg-gray-400 dark:text-gray-900';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'under-review': return 'Under Review';
      case 'assigned': return 'Assigned';
      case 'in-progress': return 'In Progress';
      case 'on-hold': return 'On Hold';
      case 'resolved': return 'Resolved';
      case 'rejected': return 'Rejected';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesStatus = statusFilter ? c.status.toLowerCase() === statusFilter.toLowerCase() : true;
    const matchesSearch = searchTerm
      ? c.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toString().includes(searchTerm)
      : true;
    return matchesStatus && matchesSearch;
  });

  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;

    if (key === 'status') {
      const aPriority = statusPriority[a.status.toLowerCase()] || 999;
      const bPriority = statusPriority[b.status.toLowerCase()] || 999;
      return direction === 'asc' ? aPriority - bPriority : bPriority - aPriority;
    }

    const aVal = a[key]?.toString().toLowerCase();
    const bVal = b[key]?.toString().toLowerCase();
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
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
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
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
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
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
            className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {[
                    { label: 'ID', key: 'id' },
                    { label: 'Issue', key: 'issue' },
                    { label: 'Department', key: 'department' },
                    { label: 'Location', key: 'location' },
                    { label: 'Date', key: 'dateLogged' },
                    { label: 'Status', key: 'status' },
                    { label: 'Actions', key: '' },
                  ].map(({ label, key }, idx) => (
                    <th
                      key={idx}
                      onClick={() => key && handleSort(key)}
                      className={`px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-4 text-left text-xs sm:text-sm font-medium text-gray-700 dark:text-white ${
                        key ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                      } ${idx < 6 ? 'border-r border-gray-200 dark:border-gray-600' : ''}`}
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
                    <td colSpan="7" className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-300 text-sm sm:text-base">
                      No complaints match this filter or search.
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
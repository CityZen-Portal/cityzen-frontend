import { useState } from 'react';
import Rows from './Rows';
import PageNavigator from './PageNavigator';
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
      {/* Filter & Search */}
      <div className="mb-4 space-y-4 md:space-y-0 md:flex md:items-end md:justify-between md:gap-4">
        {/* Left side - Filters */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:flex-row">
          {/* Status Filter */}
          <div className="flex-1 sm:flex-none">
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
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
          <div className="flex-1 sm:flex-none">
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
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {[5, 10, 25, 50].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right side - Search Input */}
        <div className="flex-1 md:flex-none md:w-72 lg:w-80">
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
            Search
          </label>
          <input
            type="text"
            id="searchTerm"
            placeholder="Search by ID, issue, or department..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-3 sm:mx-0 sm:rounded-lg">
        <table className="w-full min-w-full">
          {/* Desktop Table Header - Hidden on mobile */}
          <thead className="bg-gray-100 dark:bg-gray-700 hidden md:table-header-group">
            <tr>
              {[
                { label: 'ID', key: 'id' },
                { label: 'Issue', key: 'issue' },
                { label: 'Department', key: 'department' },
                { label: 'Date', key: 'dateLogged' },
                { label: 'Status', key: 'status' },
                { label: 'View', key: '' },
                { label: 'Feedback', key: '' },
              ].map(({ label, key }, idx) => (
                <th
                  key={idx}
                  onClick={() => key && handleSort(key)}
                  className={`px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-medium text-gray-700 dark:text-white border-r last:border-r-0 ${
                    key ? 'cursor-pointer select-none hover:bg-gray-200 dark:hover:bg-gray-600' : ''
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {label}
                    {key && sortConfig.key === key ? (
                      sortConfig.direction === 'asc' ? (
                        <MdArrowUpward className="text-xs flex-shrink-0" />
                      ) : (
                        <MdArrowDownward className="text-xs flex-shrink-0" />
                      )
                    ) : (
                      label !== 'View' && label !== 'Feedback' && <MdUnfoldMore className="text-xs opacity-50 flex-shrink-0" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {/* Mobile Table Header - Only shown on mobile */}
          <thead className="md:hidden">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <span>Complaints</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {filteredComplaints.length} results
                  </span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
            <Rows 
              complaints={paginatedComplaints}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
            />
            {paginatedComplaints.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-8 px-4 text-gray-500 dark:text-gray-300">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-4xl">🔍</div>
                    <div className="text-sm font-medium">No complaints found</div>
                    <div className="text-xs">Try adjusting your search or filters</div>
                  </div>
                </td>
              </tr>
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
    </div>
  );
};

export default ComplaintTable;
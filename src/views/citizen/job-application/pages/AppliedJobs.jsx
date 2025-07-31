import React, { useState } from 'react';
import { FaRegBuilding, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaExclamationTriangle, FaCheckCircle, FaEye, FaHourglassHalf, FaSearch, FaFilter, FaDownload, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Sample applied jobs data
const appliedJobs = [
  {
    id: 1,
    applicationId: 'APP001234',
    title: 'Sanitary Inspector',
    department: 'Public Health Department',
    location: 'Coimbatore Municipal Corporation',
    appliedDate: '25 July 2025',
    lastDate: '30 July 2025',
    status: 'pending'
  },
  {
    id: 2,
    applicationId: 'APP001235',
    title: 'Junior Engineer (Civil)',
    department: 'Engineering Wing',
    location: 'Chennai Municipal Corporation',
    appliedDate: '20 July 2025',
    lastDate: '28 July 2025',
    status: 'selected'
  },
  {
    id: 3,
    applicationId: 'APP001236',
    title: 'Data Entry Operator',
    department: 'Municipal Admin Office',
    location: 'Trichy Municipal Corporation',
    appliedDate: '22 July 2025',
    lastDate: '6 August 2025',
    status: 'selected'
  },
  {
    id: 4,
    applicationId: 'APP001237',
    title: 'Fire Safety Officer',
    department: 'Fire Department',
    location: 'Salem Municipal Corporation',
    appliedDate: '18 July 2025',
    lastDate: '8 August 2025',
    status: 'selected'
  },
  {
    id: 5,
    applicationId: 'APP001238',
    title: 'Environmental Officer',
    department: 'Environmental Cell',
    location: 'Vellore Municipal Corporation',
    appliedDate: '15 July 2025',
    lastDate: '12 August 2025',
    status: 'rejected'
  },
  {
    id: 6,
    applicationId: 'APP001239',
    title: 'Assistant Town Planner',
    department: 'Urban Planning Dept.',
    location: 'Madurai Municipal Corporation',
    appliedDate: '10 July 2025',
    lastDate: '2 August 2025',
    status: 'pending'
  },
  {
    id: 7,
    applicationId: 'APP001240',
    title: 'Electrician (Grade II)',
    department: 'Electrical Maintenance',
    location: 'Tirunelveli Corporation',
    appliedDate: '12 July 2025',
    lastDate: '5 August 2025',
    status: 'rejected'
  },
  {
    id: 8,
    applicationId: 'APP001241',
    title: 'Public Relations Assistant',
    department: 'Public Relations',
    location: 'Erode Municipal Corporation',
    appliedDate: '8 July 2025',
    lastDate: '10 August 2025',
    status: 'selected'
  }
];

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: 'bg-yellow-500',
        text: 'text-white',
        icon: FaHourglassHalf,
        label: 'Pending'
      },
      selected: {
        bg: 'bg-emerald-600',
        text: 'text-gray-900 dark:text-white',
        icon: FaCheckCircle,
        label: 'Selected'
      },
      rejected: {
        bg: 'bg-red-500',
        text: 'text-white',
        icon: FaClock,
        label: 'Rejected'
      }
    };
    return configs[status] || configs.pending;
  };

  const handleViewDetails = (jobId) => {
    navigate(`/job-application/response/${jobId}`);
  };

  // Filter and search logic
  const filteredJobs = appliedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + rowsPerPage);

  const statusCounts = {
    all: appliedJobs.length,
    pending: appliedJobs.filter(j => j.status === 'pending').length,
    selected: appliedJobs.filter(j => j.status === 'selected').length,
    rejected: appliedJobs.filter(j => j.status === 'rejected').length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Applied Jobs</h1>
              <p className="text-gray-600 dark:text-gray-400">Track and manage your job applications</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { key: 'all', label: 'Total', color: 'bg-gray-500' },
              { key: 'pending', label: 'Pending', color: 'bg-yellow-500' },
              { key: 'selected', label: 'Selected', color: 'bg-emerald-600' },
              { key: 'rejected', label: 'Rejected', color: 'bg-red-500' }
            ].map(({ key, label, color }) => (
              <div key={key} className="bg-white dark:bg-navy-700 rounded-lg p-4 border border-gray-200 dark:border-navy-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts[key]}</p>
                  </div>
                  <div className={`w-3 h-3 ${color} rounded-full`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Filter and Search Controls - Complaint Log Style */}
          <div className="bg-white dark:bg-navy-700 rounded-lg p-4 border border-gray-200 dark:border-navy-600 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Filter by Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Rows per page */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rows per page</label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table - Complaint Log Style */}
        <div className="bg-white dark:bg-navy-700 rounded-lg border border-gray-200 dark:border-navy-600 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-navy-800 border-b border-gray-200 dark:border-navy-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-navy-600">
                    Application ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-navy-600">
                    Job Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-navy-600">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-navy-600">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-navy-600">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-navy-600">
                {paginatedJobs.map((job, index) => {
                  const statusConfig = getStatusConfig(job.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={job.id} className="bg-white dark:bg-navy-700 hover:bg-gray-100 dark:hover:bg-navy-600 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 dark:border-navy-600">
                        <div className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                          {job.applicationId}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-gray-200 dark:border-navy-600">
                        <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {job.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-gray-200 dark:border-navy-600">
                        <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {job.department}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 dark:border-navy-600">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {job.appliedDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200 dark:border-navy-600">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                          <StatusIcon className="text-xs" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleViewDetails(job.id)} 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors flex items-center gap-1"
                        >
                          <FaEye className="text-sm" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-navy-600 sm:px-6"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div className="flex-1 flex justify-between sm:justify-end">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-navy-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-navy-800 hover:bg-gray-50 dark:hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-navy-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-navy-800 hover:bg-gray-50 dark:hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedJobs;


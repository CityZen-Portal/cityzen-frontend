import React, { useState } from 'react';
import { FaRegBuilding, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaExclamationTriangle, FaCheckCircle, FaEye, FaHourglassHalf, FaSearch, FaFilter, FaDownload, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

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
    status: 'pending',
    priority: 'High'
  },
  {
    id: 2,
    applicationId: 'APP001235',
    title: 'Junior Engineer (Civil)',
    department: 'Engineering Wing',
    location: 'Chennai Municipal Corporation',
    appliedDate: '20 July 2025',
    lastDate: '28 July 2025',
    status: 'under_review',
    priority: 'Medium'
  },
  {
    id: 3,
    applicationId: 'APP001236',
    title: 'Data Entry Operator',
    department: 'Municipal Admin Office',
    location: 'Trichy Municipal Corporation',
    appliedDate: '22 July 2025',
    lastDate: '6 August 2025',
    status: 'shortlisted',
    priority: 'High'
  },
  {
    id: 4,
    applicationId: 'APP001237',
    title: 'Fire Safety Officer',
    department: 'Fire Department',
    location: 'Salem Municipal Corporation',
    appliedDate: '18 July 2025',
    lastDate: '8 August 2025',
    status: 'selected',
    priority: 'Low'
  },
  {
    id: 5,
    applicationId: 'APP001238',
    title: 'Environmental Officer',
    department: 'Environmental Cell',
    location: 'Vellore Municipal Corporation',
    appliedDate: '15 July 2025',
    lastDate: '12 August 2025',
    status: 'rejected',
    priority: 'Medium'
  },
  {
    id: 6,
    applicationId: 'APP001239',
    title: 'Assistant Town Planner',
    department: 'Urban Planning Dept.',
    location: 'Madurai Municipal Corporation',
    appliedDate: '10 July 2025',
    lastDate: '2 August 2025',
    status: 'pending',
    priority: 'High'
  },
  {
    id: 7,
    applicationId: 'APP001240',
    title: 'Electrician (Grade II)',
    department: 'Electrical Maintenance',
    location: 'Tirunelveli Corporation',
    appliedDate: '12 July 2025',
    lastDate: '5 August 2025',
    status: 'under_review',
    priority: 'Low'
  },
  {
    id: 8,
    applicationId: 'APP001241',
    title: 'Public Relations Assistant',
    department: 'Public Relations',
    location: 'Erode Municipal Corporation',
    appliedDate: '8 July 2025',
    lastDate: '10 August 2025',
    status: 'shortlisted',
    priority: 'Medium'
  }
];

const AppliedJobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-800 dark:text-yellow-200',
        badge: 'bg-yellow-500',
        icon: FaHourglassHalf,
        label: 'Pending'
      },
      under_review: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-800 dark:text-blue-200',
        badge: 'bg-blue-500',
        icon: FaEye,
        label: 'Under Review'
      },
      shortlisted: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-800 dark:text-green-200',
        badge: 'bg-green-500',
        icon: FaCheckCircle,
        label: 'Shortlisted'
      },
      selected: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-800 dark:text-emerald-200',
        badge: 'bg-emerald-600',
        icon: FaCheckCircle,
        label: 'Selected'
      },
      rejected: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-800 dark:text-red-200',
        badge: 'bg-red-500',
        icon: FaClock,
        label: 'Not Selected'
      }
    };
    return configs[status] || configs.pending;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      High: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300' },
      Medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
      Low: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' }
    };
    return configs[priority] || configs.Medium;
  };

  // Filter and search logic
  const filteredJobs = appliedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sorting logic
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (sortConfig.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = sortedJobs.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <FaSort className="text-gray-400" />;
    return sortConfig.direction === 'asc' ? 
      <FaSortUp className="text-blue-500" /> : 
      <FaSortDown className="text-blue-500" />;
  };

  const statusCounts = {
    all: appliedJobs.length,
    pending: appliedJobs.filter(j => j.status === 'pending').length,
    under_review: appliedJobs.filter(j => j.status === 'under_review').length,
    shortlisted: appliedJobs.filter(j => j.status === 'shortlisted').length,
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
            <div className="flex items-center gap-3">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                <FaDownload className="text-sm" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            {[
              { key: 'all', label: 'Total', color: 'bg-gray-500' },
              { key: 'pending', label: 'Pending', color: 'bg-yellow-500' },
              { key: 'under_review', label: 'Under Review', color: 'bg-blue-500' },
              { key: 'shortlisted', label: 'Shortlisted', color: 'bg-green-500' },
              { key: 'selected', label: 'Selected', color: 'bg-emerald-600' },
              { key: 'rejected', label: 'Not Selected', color: 'bg-red-500' }
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

          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-navy-700 rounded-lg p-4 border border-gray-200 dark:border-navy-600 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job title, department, or application ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <FaFilter className="text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-navy-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Not Selected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-navy-700 rounded-lg border border-gray-200 dark:border-navy-600 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-navy-800 border-b border-gray-200 dark:border-navy-600">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors"
                    onClick={() => handleSort('applicationId')}
                  >
                    <div className="flex items-center gap-2">
                      Application ID
                      <SortIcon column="applicationId" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-2">
                      Job Title
                      <SortIcon column="title" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors"
                    onClick={() => handleSort('appliedDate')}
                  >
                    <div className="flex items-center gap-2">
                      Applied Date
                      <SortIcon column="appliedDate" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-navy-600">
                {paginatedJobs.map((job, index) => {
                  const statusConfig = getStatusConfig(job.status);
                  const priorityConfig = getPriorityConfig(job.priority);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={job.id} className={`hover:bg-gray-50 dark:hover:bg-navy-800 transition-colors ${index % 2 === 0 ? 'bg-white dark:bg-navy-700' : 'bg-gray-50 dark:bg-navy-750'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                          {job.applicationId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                          {job.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {job.department}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {job.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {job.appliedDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityConfig.bg} ${priorityConfig.text}`}>
                          {job.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                          <StatusIcon className="text-xs" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                          View Details
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
            <div className="bg-white dark:bg-navy-700 px-6 py-4 border-t border-gray-200 dark:border-navy-600">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedJobs.length)} of {sortedJobs.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        currentPage === i + 1
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md text-sm font-medium border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {paginatedJobs.length === 0 && (
          <div className="bg-white dark:bg-navy-700 rounded-lg border border-gray-200 dark:border-navy-600 p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <FaSearch className="mx-auto text-4xl mb-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applications found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t applied for any jobs yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
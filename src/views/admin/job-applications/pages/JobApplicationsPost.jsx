import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, FilePen, Briefcase, MapPin, Calendar,
  Building2, ToggleLeft, ToggleRight, Trash2, Filter
} from 'lucide-react';

const AdminJobManager = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'inactive'

  // Load jobs from localStorage
  const loadJobs = useCallback(() => {
    const savedJobs = localStorage.getItem('jobs');
    if (savedJobs) {
      try {
        const parsedJobs = JSON.parse(savedJobs);
        setJobs(sortJobs(parsedJobs));
      } catch (error) {
        console.error('Failed to parse jobs', error);
        setJobs([]);
      }
    } else {
      // Initialize with sample data if no jobs exist
      const sampleJobs = [
        {
          id: "1",
          title: "Junior Engineer - Public Works",
          description: "The Municipal Corporation invites applications for the position of Junior Engineer...",
          department: "Public Works",
          location: "Coimbatore Municipal Corporation",
          lastDate: "2025-08-15",
          requirements: "Bachelor's degree in Civil Engineering...",
          isActive: true
        },
        {
          id: "2",
          title: "Health Inspector",
          description: "The Municipal Corporation seeks a qualified Health Inspector...",
          department: "Health Department",
          location: "Coimbatore Municipal Corporation",
          lastDate: "2025-08-20",
          requirements: "Bachelor's degree in Public Health...",
          isActive: true
        },
        {
          id: "3",
          title: "Assistant Town Planner",
          description: "The Municipal Corporation invites applications for Assistant Town Planner...",
          department: "Urban Planning",
          location: "Coimbatore Municipal Corporation",
          lastDate: "2025-07-30",
          requirements: "Master's degree in Urban Planning...",
          isActive: false
        }
      ];
      const sortedJobs = sortJobs(sampleJobs);
      setJobs(sortedJobs);
      localStorage.setItem('jobs', JSON.stringify(sortedJobs));
    }
  }, []);

  // Load jobs on component mount and when returning from form
  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Also reload jobs when the component becomes visible (e.g., when returning from form)
  useEffect(() => {
    const handleFocus = () => {
      loadJobs();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadJobs]);

  // Sort jobs: Active jobs first, then inactive jobs
  const sortJobs = (jobsArray) => {
    return [...jobsArray].sort((a, b) => {
      // First sort by active status (active first)
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }
      // Then sort by title alphabetically for jobs with same status
      return a.title.localeCompare(b.title);
    });
  };

  // Filter jobs based on active filter
  const getFilteredJobs = useCallback(() => {
    switch (activeFilter) {
      case 'active':
        return jobs.filter(job => job.isActive);
      case 'inactive':
        return jobs.filter(job => !job.isActive);
      case 'all':
      default:
        return jobs;
    }
  }, [jobs, activeFilter]);

  const toggleJobStatus = useCallback((id) => {
    const updatedJobs = jobs.map(job => 
      job.id.toString() === id.toString() ? { ...job, isActive: !job.isActive } : job
    );
    const sortedJobs = sortJobs(updatedJobs);
    setJobs(sortedJobs);
    localStorage.setItem('jobs', JSON.stringify(sortedJobs));
  }, [jobs]);

  const handleEdit = useCallback((id) => {
    console.log('Editing job with id:', id);
    navigate(`/admin/job-applications/edit/${id}`);
  }, [navigate]);

  const handleAddJob = useCallback(() => {
    navigate('/admin/job-applications/add');
  }, [navigate]);

  const handleViewApplicants = useCallback((id) => {
    navigate(`/admin/job-applications/applicants/${id}`);
  }, [navigate]);

  // Delete job functionality
  const handleDeleteClick = useCallback((job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (jobToDelete) {
      const updatedJobs = jobs.filter(job => job.id.toString() !== jobToDelete.id.toString());
      const sortedJobs = sortJobs(updatedJobs);
      setJobs(sortedJobs);
      localStorage.setItem('jobs', JSON.stringify(sortedJobs));
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  }, [jobs, jobToDelete]);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  }, []);

  // Filter change handler
  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
  }, []);

  // Get job counts
  const activeJobs = jobs.filter(job => job.isActive);
  const inactiveJobs = jobs.filter(job => !job.isActive);
  const filteredJobs = getFilteredJobs();

  return (
    <div className="bg-gray-50 dark:bg-navy-900 p-4 rounded-xl mb-6 min-h-screen">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#334155] rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Delete Job</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete "<strong>{jobToDelete?.title}</strong>"? This will permanently remove the job posting and all associated data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Delete Job
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-200 dark:bg-[#475569] hover:bg-gray-300 dark:hover:bg-[#64748b] text-gray-900 dark:text-gray-200 py-2 px-4 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#334155] border-b border-gray-200 dark:border-[#475569]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Job Applications</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your job postings</p>
            </div>
            <button
              onClick={handleAddJob}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg"
            >
              <Plus size={20} />
              Add Job
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {jobs.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center bg-white dark:bg-[#334155] rounded-2xl border border-gray-200 dark:border-[#475569] p-12 max-w-md">
              <div className="w-20 h-20 bg-gray-100 dark:bg-[#475569] rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="text-gray-500 dark:text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">No jobs posted yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">Start by creating your first job posting.</p>
              <button
                onClick={handleAddJob}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Create First Job
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Filter Tabs and Job Statistics */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 bg-white dark:bg-[#334155] p-1 rounded-lg border border-gray-200 dark:border-[#475569]">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#475569]'
                  }`}
                >
                  All Jobs ({jobs.length})
                </button>
                <button
                  onClick={() => handleFilterChange('active')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === 'active'
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#475569]'
                  }`}
                >
                  Active ({activeJobs.length})
                </button>
                <button
                  onClick={() => handleFilterChange('inactive')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeFilter === 'inactive'
                      ? 'bg-gray-600 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#475569]'
                  }`}
                >
                  Inactive ({inactiveJobs.length})
                </button>
              </div>

              {/* Current Filter Info */}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Filter size={16} />
                <span className="text-sm">
                  Showing {filteredJobs.length} {activeFilter === 'all' ? 'job' : activeFilter} 
                  {filteredJobs.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Jobs Grid */}
            {filteredJobs.length === 0 ? (
              <div className="flex items-center justify-center min-h-[40vh]">
                <div className="text-center bg-white dark:bg-[#334155] rounded-2xl border border-gray-200 dark:border-[#475569] p-12 max-w-md">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-[#475569] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="text-gray-500 dark:text-gray-400" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">
                    No {activeFilter} jobs found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    {activeFilter === 'active' && 'There are no active jobs at the moment.'}
                    {activeFilter === 'inactive' && 'There are no inactive jobs at the moment.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`bg-white dark:bg-[#334155] rounded-xl border ${
                      job.isActive 
                        ? 'border-[#3b82f6]' 
                        : 'border-gray-300 dark:border-gray-600'
                    } overflow-hidden transition-all duration-300 group shadow-sm hover:shadow-md`}
                  >
                    <div className={`relative h-48 ${
                      job.isActive 
                        ? 'bg-gradient-to-br from-[#3b82f6] to-[#60a5fa]' 
                        : 'bg-gradient-to-br from-gray-400 to-gray-500'
                    } overflow-hidden`}>
                      <div className="w-full h-full flex items-center justify-center">
                        <Briefcase className="text-white/90" size={48} />
                      </div>
                      <div className="absolute top-4 right-4 flex items-center gap-2">
                        <button
                          onClick={() => toggleJobStatus(job.id)}
                          className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-2 py-1 transition-all"
                        >
                          {job.isActive ? (
                            <ToggleRight className="text-white" size={18} />
                          ) : (
                            <ToggleLeft className="text-white" size={18} />
                          )}
                          <span className="text-xs font-medium text-white">
                            {job.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-xl font-bold group-hover:text-[#3b82f6] transition-colors ${
                          job.isActive 
                            ? 'text-gray-900 dark:text-gray-200' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(job.id)}
                            className={`${
                              job.isActive 
                                ? 'text-gray-500 hover:text-blue-600' 
                                : 'text-gray-400 hover:text-blue-600'
                            } transition-colors p-1`}
                            aria-label="Edit job"
                          >
                            <FilePen size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(job)}
                            className={`${
                              job.isActive 
                                ? 'text-gray-500 hover:text-red-600' 
                                : 'text-gray-400 hover:text-red-600'
                            } transition-colors p-1`}
                            aria-label="Delete job"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${
                        job.isActive 
                          ? 'text-gray-500 dark:text-gray-400' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {job.description}
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className={`flex items-center gap-3 ${
                          job.isActive 
                            ? 'text-gray-500 dark:text-gray-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          <Building2 size={18} className={`flex-shrink-0 ${
                            job.isActive ? 'text-[#3b82f6]' : 'text-gray-400'
                          }`} />
                          <span className="text-sm font-medium">{job.department}</span>
                        </div>
                        <div className={`flex items-center gap-3 ${
                          job.isActive 
                            ? 'text-gray-500 dark:text-gray-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          <MapPin size={18} className={`flex-shrink-0 ${
                            job.isActive ? 'text-[#22c55e]' : 'text-gray-400'
                          }`} />
                          <span className="text-sm font-medium">{job.location}</span>
                        </div>
                        <div className={`flex items-center gap-3 ${
                          job.isActive 
                            ? 'text-gray-500 dark:text-gray-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                          <Calendar size={18} className={`flex-shrink-0 ${
                            job.isActive ? 'text-[#f59e0b]' : 'text-gray-400'
                          }`} />
                          <span className="text-sm font-medium">Apply by {job.lastDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-200 dark:border-[#475569]">
                      <button
                        onClick={() => handleViewApplicants(job.id)}
                        className={`w-full py-2 rounded transition-colors ${
                          job.isActive 
                            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                            : 'bg-gray-400 hover:bg-gray-500 text-white'
                        }`}
                      >
                        View Applicants
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobManager;


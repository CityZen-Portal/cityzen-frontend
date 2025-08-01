import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, FilePen, Briefcase, MapPin, Calendar, Users,
  Building2, ToggleLeft, ToggleRight, Trash2, Filter,
  Heart, Award, Clock, Search
} from 'lucide-react';
import JobFormPages from './JobFormPages'; // Import the JobFormPages component

const JobApplicationsPost = () => {
  const [jobs, setJobs] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState('municipal');
  const [editingJob, setEditingJob] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load jobs from localStorage or initialize with sample data
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
      const sampleJobs = [
        {
          id: "1",
          title: "Senior Civil Engineer",
          description: "Lead infrastructure development projects and oversee construction activities across the municipal corporation. Responsible for planning, designing, and supervising major public works projects.",
          department: "Public Works Department",
          location: "Coimbatore Municipal Corporation HQ",
          lastDate: "2025-08-15",
          requirements: "Bachelor's degree in Civil Engineering with 5+ years experience",
          salary: "₹45,000 - ₹65,000 per month",
          jobType: "municipal",
          isActive: true,
          contactName: "John Smith",
          contactPhone: "+91 98765 43210",
          contactEmail: "hr@municipality.gov.in",
          contactAddress: "Coimbatore Municipal Corporation, Town Hall Road, Coimbatore - 641001"
        },
        {
          id: "2",
          title: "Ward Health Volunteer",
          description: "Support community health initiatives in Ward 15. Assist in health awareness campaigns, vaccination drives, and basic health screening programs for residents.",
          department: "Health & Welfare",
          location: "Ward 15, R.S. Puram",
          requirements: "12th pass with basic health knowledge, willingness to serve community",
          jobType: "volunteer",
          isActive: true,
          workDate: "2025-08-20",
          workTime: "9:00 AM - 5:00 PM",
          duration: "1 week",
          contactName: "Sarah Johnson",
          contactPhone: "+91 98765 43211",
          contactEmail: "volunteer@municipality.gov.in",
          contactAddress: "Ward Office, R.S. Puram, Coimbatore - 641002"
        },
        {
          id: "3",
          title: "Assistant Town Planner",
          description: "Assist in urban planning activities, prepare development plans, and coordinate with various departments for municipal development projects.",
          department: "Urban Planning",
          location: "Coimbatore Municipal Corporation",
          lastDate: "2025-08-25",
          requirements: "Master's degree in Urban Planning or related field",
          salary: "₹35,000 - ₹50,000 per month",
          jobType: "municipal",
          isActive: true,
          contactName: "Michael Brown",
          contactPhone: "+91 98765 43212",
          contactEmail: "planning@municipality.gov.in",
          contactAddress: "Urban Planning Department, Coimbatore Municipal Corporation"
        },
        {
          id: "4",
          title: "Community Garden Volunteer",
          description: "Help maintain community gardens in Ward 8, organize gardening workshops, and promote sustainable urban farming among residents.",
          department: "Environment & Parks",
          location: "Ward 8, Gandhipuram",
          requirements: "Interest in gardening, basic knowledge of plants, community service mindset",
          jobType: "volunteer",
          isActive: false,
          workDate: "2025-08-30",
          workTime: "6:00 AM - 10:00 AM",
          duration: "ongoing",
          contactName: "Emily Davis",
          contactPhone: "+91 98765 43213",
          contactEmail: "parks@municipality.gov.in",
          contactAddress: "Parks Department, Ward 8, Gandhipuram, Coimbatore"
        }
      ];
      const sortedJobs = sortJobs(sampleJobs);
      setJobs(sortedJobs);
      localStorage.setItem('jobs', JSON.stringify(sortedJobs));
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Sort jobs: Active first, then by job type, then alphabetically
  const sortJobs = (jobsArray) => {
    return [...jobsArray].sort((a, b) => {
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }
      if (a.jobType !== b.jobType) {
        return a.jobType === 'municipal' ? -1 : 1;
      }
      return a.title.localeCompare(b.title);
    });
  };

  // Filter jobs based on active filter and search term
  const getFilteredJobs = useCallback(() => {
    let filtered = jobs;

    // Apply type filter
    switch (activeFilter) {
      case 'active':
        filtered = jobs.filter(job => job.isActive);
        break;
      case 'inactive':
        filtered = jobs.filter(job => !job.isActive);
        break;
      case 'municipal':
        filtered = jobs.filter(job => job.jobType === 'municipal');
        break;
      case 'volunteer':
        filtered = jobs.filter(job => job.jobType === 'volunteer');
        break;
      case 'all':
      default:
        filtered = jobs;
        break;
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [jobs, activeFilter, searchTerm]);

  const toggleJobStatus = useCallback((id) => {
    const updatedJobs = jobs.map(job => 
      job.id.toString() === id.toString() ? { ...job, isActive: !job.isActive } : job
    );
    const sortedJobs = sortJobs(updatedJobs);
    setJobs(sortedJobs);
    localStorage.setItem('jobs', JSON.stringify(sortedJobs));
  }, [jobs]);

  const handleEdit = useCallback((job) => {
    setEditingJob(job);
    setIsEditMode(true);
    setSelectedJobType(job.jobType);
    setShowJobForm(true);
  }, []);

  const handleAddJob = useCallback((jobType) => {
    setEditingJob(null);
    setIsEditMode(false);
    setSelectedJobType(jobType);
    setShowJobForm(true);
  }, []);

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

  // Handle job form submission
  const handleJobFormSubmit = useCallback((jobData, isEdit = false) => {
    if (isEdit && editingJob) {
      // Update existing job
      const updatedJobs = jobs.map(job => 
        job.id.toString() === editingJob.id.toString() ? { ...jobData, id: editingJob.id } : job
      );
      const sortedJobs = sortJobs(updatedJobs);
      setJobs(sortedJobs);
      localStorage.setItem('jobs', JSON.stringify(sortedJobs));
    } else {
      // Add new job
      const newJob = {
        id: Date.now().toString(),
        ...jobData,
        isActive: true
      };
      
      const updatedJobs = [...jobs, newJob];
      const sortedJobs = sortJobs(updatedJobs);
      setJobs(sortedJobs);
      localStorage.setItem('jobs', JSON.stringify(sortedJobs));
    }
    
    setShowJobForm(false);
    setEditingJob(null);
    setIsEditMode(false);
  }, [jobs, editingJob]);

  const handleJobFormCancel = useCallback(() => {
    setShowJobForm(false);
    setEditingJob(null);
    setIsEditMode(false);
  }, []);

  // Get job counts
  const allJobs = jobs.length;
  const activeJobs = jobs.filter(job => job.isActive).length;
  const inactiveJobs = jobs.filter(job => !job.isActive).length;
  const municipalJobs = jobs.filter(job => job.jobType === 'municipal').length;
  const volunteerJobs = jobs.filter(job => job.jobType === 'volunteer').length;
  const filteredJobs = getFilteredJobs();

  if (showJobForm) {
    return (
      <JobFormPages 
        jobType={selectedJobType}
        onSubmit={handleJobFormSubmit}
        onCancel={handleJobFormCancel}
        editData={editingJob}
        isEditMode={isEditMode}
      />
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete Job Posting</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete "<strong>{jobToDelete?.title}</strong>"? 
              This will permanently remove the job posting.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl transition-colors font-medium"
              >
                Delete Job
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200 py-3 px-4 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Manage municipal and volunteer job postings</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleAddJob('municipal')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg"
              >
                <Building2 size={20} />
                Add Municipal Job
              </button>
              <button
                onClick={() => handleAddJob('volunteer')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg"
              >
                <Heart size={20} />
                Add Volunteer Job
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {jobs.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-12 max-w-lg shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No Job Postings Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Start by creating your first municipal or volunteer job posting to connect with qualified candidates.
              </p>
              {/* Fixed button alignment - single row */}
              <div className="flex flex-row gap-3 justify-center">
                <button
                  onClick={() => handleAddJob('municipal')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium inline-flex items-center gap-2"
                >
                  <Building2 size={20} />
                  Create Municipal Job
                </button>
                <button
                  onClick={() => handleAddJob('volunteer')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium inline-flex items-center gap-2"
                >
                  <Heart size={20} />
                  Create Volunteer Job
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Search and Filter Controls */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search jobs, departments, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeFilter === 'all'
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  All ({allJobs})
                </button>
                <button
                  onClick={() => setActiveFilter('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeFilter === 'active'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Active ({activeJobs})
                </button>
                <button
                  onClick={() => setActiveFilter('inactive')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeFilter === 'inactive'
                      ? 'bg-gray-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Inactive ({inactiveJobs})
                </button>
                <button
                  onClick={() => setActiveFilter('municipal')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeFilter === 'municipal'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Municipal ({municipalJobs})
                </button>
                <button
                  onClick={() => setActiveFilter('volunteer')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    activeFilter === 'volunteer'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Volunteer ({volunteerJobs})
                </button>
              </div>
            </div>

            {/* Results Info */}
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
              <Filter size={16} />
              <span className="text-sm">
                Showing {filteredJobs.length} of {allJobs} job{allJobs !== 1 ? 's' : ''}
                {searchTerm && ` matching "${searchTerm}"`}
              </span>
            </div>

            {/* Jobs Grid */}
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No jobs found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm 
                    ? `No jobs match your search for "${searchTerm}"`
                    : 'No jobs match the selected filter'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`bg-white dark:bg-gray-800 rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                      job.isActive 
                        ? 'border-gray-200 dark:border-gray-700' 
                        : 'border-gray-300 dark:border-gray-600 opacity-75'
                    }`}
                  >
                    {/* Job Type Badge */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          job.jobType === 'municipal'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        }`}>
                          {job.jobType === 'municipal' ? (
                            <>
                              <Building2 size={16} />
                              Municipal
                            </>
                          ) : (
                            <>
                              <Heart size={16} />
                              Volunteer
                            </>
                          )}
                        </div>
                        
                        {/* Status Toggle */}
                        <button
                          onClick={() => toggleJobStatus(job.id)}
                          className="flex items-center gap-2 text-sm transition-colors"
                        >
                          {job.isActive ? (
                            <>
                              <ToggleRight className="text-green-500" size={20} />
                              <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="text-gray-400" size={20} />
                              <span className="text-gray-500 dark:text-gray-400 font-medium">Inactive</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Job Title */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {job.title}
                      </h3>

                      {/* Job Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Building2 size={16} />
                          <span className="text-sm">{job.department}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin size={16} />
                          <span className="text-sm line-clamp-1">{job.location}</span>
                        </div>
                        {/* Only show application deadline for municipal jobs */}
                        {job.jobType === 'municipal' && job.lastDate && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar size={16} />
                            <span className="text-sm">Apply by: {job.lastDate}</span>
                          </div>
                        )}
                        {/* Show program date for volunteer jobs */}
                        {job.jobType === 'volunteer' && job.workDate && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Calendar size={16} />
                            <span className="text-sm">Date: {job.workDate}</span>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                        {job.description}
                      </p>

                      {/* Salary (only for municipal jobs) */}
                      {job.jobType === 'municipal' && job.salary && (
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2">
                            <Award className="text-green-600 dark:text-green-400" size={16} />
                            <span className="text-green-700 dark:text-green-300 font-medium text-sm">
                              {job.salary}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 pb-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 justify-center"
                        >
                          <FilePen size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(job)}
                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
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

export default JobApplicationsPost;


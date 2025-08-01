import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, Heart, Calendar, Users, 
  AlertTriangle, Search, Filter, Briefcase, TrendingUp
} from 'lucide-react';
import JobCard from '../components/JobCard';
import JobDetailsPage from './JobDetailsPage';
import { useNavigate } from 'react-router-dom';

// Sample job data - in a real app, this would come from an API
const sampleJobs = [
  {
    id: 1,
    title: "Civil Engineer",
    department: "Public Works Department",
    location: "Coimbatore Municipal Corporation",
    description: "We are seeking an experienced Civil Engineer to join our Public Works Department. The successful candidate will be responsible for planning, designing, and overseeing construction projects including roads, bridges, and municipal infrastructure. This role requires strong technical expertise, project management skills, and the ability to work collaboratively with various stakeholders.",
    requirements: "Bachelor's degree in Civil Engineering, 3+ years of experience in municipal projects, knowledge of local building codes and regulations, proficiency in AutoCAD and project management software.",
    jobType: "municipal",
    lastDate: "2025-08-15",
    contactName: "Dr. Rajesh Kumar",
    contactPhone: "+91 98765 43210",
    contactEmail: "rajesh.kumar@coimbatore.gov.in",
    contactAddress: "Public Works Department, Coimbatore Municipal Corporation, Town Hall, Coimbatore - 641001",
    isActive: true
  },
  {
    id: 2,
    title: "Community Health Volunteer",
    department: "Health & Family Welfare",
    location: "Various locations in Coimbatore",
    description: "Join our community health initiative to promote healthcare awareness and support health programs in various neighborhoods. Volunteers will conduct health surveys, assist in vaccination drives, and educate communities about preventive healthcare measures.",
    requirements: "Basic understanding of health and hygiene, good communication skills, willingness to work in community settings, flexible schedule availability.",
    jobType: "volunteer",
    workDate: "2025-08-10",
    workTime: "9:00 AM - 5:00 PM",
    duration: "6 months program",
    contactName: "Ms. Priya Sharma",
    contactPhone: "+91 87654 32109",
    contactEmail: "priya.sharma@coimbatore.gov.in",
    contactAddress: "Health Department, Municipal Corporation Office, Coimbatore",
    isActive: true
  },
  {
    id: 3,
    title: "Assistant Town Planner",
    department: "Urban Planning",
    location: "Coimbatore Municipal Corporation",
    description: "Assist in urban planning activities including land use planning, development control, and building plan approvals. The role involves reviewing development proposals, conducting site inspections, and ensuring compliance with planning regulations.",
    requirements: "Degree in Urban Planning or Architecture, knowledge of planning laws and regulations, GIS software experience preferred, strong analytical and communication skills.",
    jobType: "municipal",
    lastDate: "2025-08-20",
    contactName: "Mr. Suresh Babu",
    contactPhone: "+91 63694 74451",
    contactEmail: "suresh.babu@coimbatore.gov.in",
    contactAddress: "Urban Planning Department, Coimbatore Municipal Corporation",
    isActive: true
  },
  {
    id: 4,
    title: "Tree Plantation Drive",
    department: "Environment & Parks",
    location: "Coimbatore City Parks",
    description: "Participate in our city-wide tree plantation initiative to increase green cover and promote environmental sustainability. Volunteers will help plant saplings, maintain plant records, and support ongoing tree care activities.",
    requirements: "Environmental awareness, physical fitness for outdoor work, commitment to environmental conservation, weekend availability preferred.",
    jobType: "volunteer",
    workDate: "2025-08-12",
    workTime: "6:00 AM - 10:00 AM",
    duration: "One-time event with follow-up care",
    contactName: "Dr. Meera Nair",
    contactPhone: "+91 76543 21098",
    contactEmail: "meera.nair@coimbatore.gov.in",
    contactAddress: "Environment Department, Municipal Corporation, Coimbatore",
    isActive: true
  },
  {
    id: 5,
    title: "Accounts Officer",
    department: "Finance Department",
    location: "Municipal Corporation Head Office",
    description: "Handle financial transactions, maintain accounting records, prepare financial reports, and assist in budget preparation. The role requires attention to detail and strong analytical skills in financial management.",
    requirements: "BCom/MCom with accounting background, 2+ years experience in government accounting, knowledge of financial software, understanding of municipal finance procedures.",
    jobType: "municipal",
    lastDate: "2025-07-25", // This job is expired
    contactName: "Mrs. Lakshmi Devi",
    contactPhone: "+91 63827 58637",
    contactEmail: "lakshmi.devi@coimbatore.gov.in",
    contactAddress: "Finance Department, Municipal Corporation, Coimbatore",
    isActive: true
  }
];

const JobApplicationSystem = () => {
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState('list'); // 'list' or 'details'
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobs, setJobs] = useState(sampleJobs);
  const [filteredJobs, setFilteredJobs] = useState(sampleJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());

  // Filter jobs based on search and filter criteria
  useEffect(() => {
    let filtered = jobs.filter(job => job.isActive);

    // Apply type filter
    if (activeFilter === 'municipal') {
      filtered = filtered.filter(job => job.jobType === 'municipal');
    } else if (activeFilter === 'volunteer') {
      filtered = filtered.filter(job => job.jobType === 'volunteer');
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, activeFilter]);

  // Check if job deadline has passed
  const isJobExpired = useCallback((job) => {
    if (job.jobType === 'municipal' && job.lastDate) {
      const deadline = new Date(job.lastDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return deadline < today;
    }
    return false;
  }, []);

  // Format date for display
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  // Handle view details
  const handleViewDetails = useCallback((jobId) => {
    setSelectedJobId(jobId);
    navigate(`/citizen/job-application/details/${jobId}`);
  }, []);

  // Handle back to list
  const handleBack = useCallback(() => {
    setCurrentView('list');
    setSelectedJobId(null);
  }, []);

  // Handle bookmark toggle
  const handleBookmark = useCallback((jobId) => {
    const newBookmarks = new Set(bookmarkedJobs);
    if (newBookmarks.has(jobId)) {
      newBookmarks.delete(jobId);
    } else {
      newBookmarks.add(jobId);
    }
    setBookmarkedJobs(newBookmarks);
  }, [bookmarkedJobs]);

  // Get job counts
  const activeJobs = jobs.filter(job => job.isActive);
  const municipalCount = activeJobs.filter(job => job.jobType === 'municipal').length;
  const volunteerCount = activeJobs.filter(job => job.jobType === 'volunteer').length;

  if (currentView === 'details' && selectedJobId) {
    return <JobDetailsPage 
      jobId={selectedJobId} 
      jobs={jobs}
      onBack={handleBack}
      bookmarkedJobs={bookmarkedJobs}
      onBookmark={handleBookmark}
      isJobExpired={isJobExpired}
      formatDate={formatDate}
    />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Job Application</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover exciting career opportunities and volunteer programs with the Municipal Corporation
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeJobs.length}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  <TrendingUp size={16} className="inline mr-1" />
                  Active Opportunities
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Briefcase className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Municipal Jobs</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{municipalCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Building2 size={16} className="inline mr-1" />
                  Government Positions
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Building2 className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Volunteer Programs</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{volunteerCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Heart size={16} className="inline mr-1" />
                  Community Service
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Heart className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
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
                All Jobs ({activeJobs.length})
              </button>
              <button
                onClick={() => setActiveFilter('municipal')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeFilter === 'municipal'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Municipal ({municipalCount})
              </button>
              <button
                onClick={() => setActiveFilter('volunteer')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeFilter === 'volunteer'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Volunteer ({volunteerCount})
              </button>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-4">
            <Filter size={16} />
            <span className="text-sm">
              Showing {filteredJobs.length} of {activeJobs.length} job{activeJobs.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
          </div>
        </div>

        {/* Jobs Section */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="text-gray-400" size={40} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {activeJobs.length === 0 ? 'No Jobs Available' : 'No Jobs Found'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {activeJobs.length === 0 
                ? 'There are currently no job openings available. Please check back later for new opportunities.'
                : searchTerm 
                  ? `No jobs match your search for "${searchTerm}". Try adjusting your search terms.`
                  : 'No jobs match the selected filter. Try selecting a different category.'
              }
            </p>
          </div>
        ) : (
          <div>
            {/* Municipal Jobs Section */}
            {filteredJobs.some(job => job.jobType === 'municipal') && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <Building2 className="text-blue-600" size={28} />
                  Available Municipal Corporation Jobs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs
                    .filter(job => job.jobType === 'municipal')
                    .map((job) => (
                      <JobCard 
                        key={job.id} 
                        job={job} 
                        onViewDetails={handleViewDetails} 
                        isJobExpired={isJobExpired} 
                        formatDate={formatDate} 
                      />
                    ))}
                </div>
              </div>
            )}

            {/* Volunteer Jobs Section */}
            {filteredJobs.some(job => job.jobType === 'volunteer') && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <Heart className="text-green-600" size={28} />
                  Available Volunteer Opportunities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs
                    .filter(job => job.jobType === 'volunteer')
                    .map((job) => (
                      <JobCard 
                        key={job.id} 
                        job={job} 
                        onViewDetails={handleViewDetails} 
                        isJobExpired={isJobExpired} 
                        formatDate={formatDate} 
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicationSystem;
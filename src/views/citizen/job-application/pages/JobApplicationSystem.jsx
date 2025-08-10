import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, Heart, AlertTriangle, Search, Filter, Briefcase, TrendingUp
} from 'lucide-react';
import JobCard from '../components/JobCard';
import VolunteerCard from '../components/VolunteerCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Sample job data
// const sampleJobs = [
//   {
//     id: 1,
//     title: "Civil Engineer",
//     department: "Public Works Department",
//     location: "Coimbatore Municipal Corporation",
//     description: "We are seeking an experienced Civil Engineer to join our Public Works Department. The successful candidate will be responsible for planning, designing, and overseeing construction projects including roads, bridges, and municipal infrastructure.",
//     requirements: ["Bachelor's degree in Civil Engineering", "3+ years of experience in municipal projects", "Knowledge of local building codes and regulations", "Proficiency in AutoCAD and project management software"],
//     contactPersonName: "Dr. Rajesh Kumar",
//     contactPhoneNumber: "+91 98765 43210",
//     contactEmail: "rajesh.kumar@coimbatore.gov.in",
//     contactAddress: "Public Works Department, Coimbatore Municipal Corporation, Town Hall, Coimbatore - 641001",
//     isActive: true,
//     deadline: "2025-08-15T23:59:59"
//   },
//   {
//     id: 3,
//     title: "Assistant Town Planner",
//     department: "Urban Planning",
//     location: "Coimbatore Municipal Corporation",
//     description: "Assist in urban planning activities including land use planning, development control, and building plan approvals. The role involves reviewing development proposals, conducting site inspections, and ensuring compliance with planning regulations.",
//     requirements: ["Degree in Urban Planning or Architecture", "Knowledge of planning laws and regulations", "GIS software experience preferred", "Strong analytical and communication skills"],
//     contactPersonName: "Mr. Suresh Babu",
//     contactPhoneNumber: "+91 63694 74451",
//     contactEmail: "suresh.babu@coimbatore.gov.in",
//     contactAddress: "Urban Planning Department, Coimbatore Municipal Corporation",
//     isActive: true,
//     deadline: "2025-08-20T23:59:59"
//   },
//   {
//     id: 5,
//     title: "Accounts Officer",
//     department: "Finance Department",
//     location: "Municipal Corporation Head Office",
//     description: "Handle financial transactions, maintain accounting records, prepare financial reports, and assist in budget preparation. The role requires attention to detail and strong analytical skills in financial management.",
//     requirements: ["BCom/MCom with accounting background", "2+ years experience in government accounting", "Knowledge of financial software", "Understanding of municipal finance procedures"],
//     contactPersonName: "Mrs. Lakshmi Devi",
//     contactPhoneNumber: "+91 63827 58637",
//     contactEmail: "lakshmi.devi@coimbatore.gov.in",
//     contactAddress: "Finance Department, Municipal Corporation, Coimbatore",
//     isActive: true,
//     deadline: "2025-07-25T23:59:59"
//   }
// ];

// // Sample volunteer data
// const sampleVolunteers = [
//   {
//     id: 2,
//     programTitle: "Community Health Volunteer",
//     location: "Various locations in Coimbatore",
//     programDescription: "Join our community health initiative to promote healthcare awareness and support health programs in various neighborhoods. Volunteers will conduct health surveys, assist in vaccination drives, and educate communities about preventive healthcare measures.",
//     programDate: "2025-08-10",
//     programTime: "09:00:00",
//     duration: "6 months program",
//     coordinatorName: "Ms. Priya Sharma",
//     coordinatorPhone: "+91 87654 32109",
//     coordinatorEmail: "priya.sharma@coimbatore.gov.in",
//     coordinatorAddress: "Health Department, Municipal Corporation Office, Coimbatore",
//     isActive: true
//   },
//   {
//     id: 4,
//     programTitle: "Tree Plantation Drive",
//     location: "Coimbatore City Parks",
//     programDescription: "Participate in our city-wide tree plantation initiative to increase green cover and promote environmental sustainability. Volunteers will help plant saplings, maintain plant records, and support ongoing tree care activities.",
//     programDate: "2025-08-12",
//     programTime: "6:00 AM - 10:00 AM",
//     duration: "One-time event with follow-up care",
//     coordinatorName: "Dr. Meera Nair",
//     coordinatorPhone: "+91 76543 21098",
//     coordinatorEmail: "meera.nair@coimbatore.gov.in",
//     coordinatorAddress: "Environment Department, Municipal Corporation, Coimbatore",
//     isActive: true
//   }
// ];

const JobApplicationSystem = () => {
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const citizenId = localStorage.getItem("id")

  const [jobs, setJobs] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [filteredVolunteers, setFilteredVolunteers] = useState(volunteers);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());

  const JOB_APPLICATION_API = process.env.REACT_APP_API_JOB_APPLICATION_URL;

  const [jobPosts, setJobPosts] = useState([])
  const [volunteerPosts, setVolunteerPosts] = useState([])

  useEffect(() => {
    // setLoading(true);
  
    axios.get(`${JOB_APPLICATION_API}/jobs`,
      {
        headers:{
          token,
          email,
          id: citizenId
        }
      }
    )
      .then(res => {
          console.log('Response:', res.data.data);
          const data = res.data.data
          setJobs(data ? data : [])
        })
        .catch(err => {
          toast.error('Server Error!Unable to Fetch Job Posts Data', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored'
          });
          console.error('Error:', err.response?.data || err.message);
        })
        .finally(() => {
          // setLoading(false);
        });
        
    // setLoading(true);

    axios.get(`${JOB_APPLICATION_API}/service`,
      {
        headers:{
          token,
          email,
          id: citizenId
        }
      }
    )
      .then(res => {
          console.log('Response:', res.data.data);
          const data = res.data.data
          setVolunteers(data ? data : [])
        })
        .catch(err => {
          toast.error('Server Error!Unable to Fetch Volunteer Post Data', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored'
          });
          console.error('Error:', err.response?.data || err.message);
        })
        .finally(() => {
          // setLoading(false);
        });
  }, [token, email, citizenId, JOB_APPLICATION_API, navigate])

  // Filter jobs and volunteers based on search and filter criteria
  useEffect(() => {
    let filteredJobs = jobs.filter(job => job.isActive);
    let filteredVolunteers = volunteers.filter(volunteer => volunteer.isActive);

    // Apply type filter
    if (activeFilter === 'municipal') {
      filteredVolunteers = [];
    } else if (activeFilter === 'volunteer') {
      filteredJobs = [];
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      filteredVolunteers = filteredVolunteers.filter(volunteer =>
        volunteer.programTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.programDescription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredJobs(filteredJobs);
    setFilteredVolunteers(filteredVolunteers);
  }, [jobs, volunteers, searchTerm, activeFilter]);

  // Check if job deadline has passed
  const isJobExpired = useCallback((job) => {
    if (job.deadline) {
      const deadline = new Date(job.deadline);
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
  const handleViewDetails = useCallback((id, type) => {
    if (type === 'municipal') {
      navigate(`/citizen/job-application/job/${id}`);
    } else {
      navigate(`/citizen/job-application/volunteer/${id}`);
    }
  }, [navigate]);

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

  // Get counts
  const activeJobs = jobs.filter(job => job.isActive);
  const activeVolunteers = volunteers.filter(volunteer => volunteer.isActive);
  const municipalCount = activeJobs.length;
  const volunteerCount = activeVolunteers.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      {/* Header */}
      <div className="bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Job Application</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover exciting career opportunities and volunteer programs with the Municipal Corporation
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 ">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Opportunities</p>
                <p className="text-3xl font-bold text-black-900 dark:text-white">{municipalCount + volunteerCount}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  <TrendingUp size={16} className="inline mr-1" />
                  Active Opportunities
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Briefcase className="text-blue-600 dark:text-blue-400" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Municipal Jobs</p>
                <p className="text-3xl font-bold text-black-600 dark:text-white">{municipalCount}</p>
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

          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Volunteer Programs</p>
                <p className="text-3xl font-bold text-black-600 dark:text-white">{volunteerCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Heart size={16} className="inline mr-1" />
                  Community Service
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Heart className="text-blue-600 dark:text-blue-400" size={24} />
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
                placeholder="Search jobs, programs, departments, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 border border-navy-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-white dark:bg-navy-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                All ({municipalCount + volunteerCount})
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
                    ? 'bg-blue-600 text-white shadow-md'
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
              Showing {filteredJobs.length + filteredVolunteers.length} of {municipalCount + volunteerCount} opportunity{municipalCount + volunteerCount !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
          </div>
        </div>

        {/* Jobs Section */}
        {filteredJobs.length === 0 && filteredVolunteers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="text-gray-400" size={40} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {activeJobs.length === 0 && activeVolunteers.length === 0 ? 'No Opportunities Available' : 'No Opportunities Found'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {activeJobs.length === 0 && activeVolunteers.length === 0 
                ? 'There are currently no opportunities available. Please check back later.'
                : searchTerm 
                  ? `No opportunities match your search for "${searchTerm}". Try adjusting your search terms.`
                  : 'No opportunities match the selected filter. Try selecting a different category.'
              }
            </p>
          </div>
        ) : (
          <div>
            {/* Municipal Jobs Section */}
            {filteredJobs.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <Building2 className="text-black-600 dark:text-white" size={28} />
                  Available Municipal Corporation Jobs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      onViewDetails={(id) => handleViewDetails(id, 'municipal')}
                      isJobExpired={isJobExpired} 
                      formatDate={formatDate} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Volunteer Jobs Section */}
            {filteredVolunteers.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <Heart className="text-black-600 dark:text-white" size={28} />
                  Available Volunteer Opportunities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVolunteers.map((volunteer) => (
                    <VolunteerCard 
                      key={volunteer.id} 
                      volunteer={volunteer} 
                      onViewDetails={(id) => handleViewDetails(id, 'volunteer')}
                      formatDate={formatDate} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default JobApplicationSystem;
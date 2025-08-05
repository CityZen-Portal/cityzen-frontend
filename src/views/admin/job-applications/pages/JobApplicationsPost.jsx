import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, Heart, AlertTriangle, Search, Filter, Briefcase, TrendingUp, Plus
} from 'lucide-react';
import JobCard from '../components/JobCard';
import VolunteerCard from '../components/VolunteerCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Sample job data
const sampleJobs = [
  {
    id: 1,
    title: "Civil Engineer",
    department: "Public Works Department",
    location: "Coimbatore Municipal Corporation",
    description: "We are seeking an experienced Civil Engineer to join our Public Works Department. The successful candidate will be responsible for planning, designing, and overseeing construction projects including roads, bridges, and municipal infrastructure.",
    requirements: ["Bachelor's degree in Civil Engineering", "3+ years of experience in municipal projects", "Knowledge of local building codes and regulations", "Proficiency in AutoCAD and project management software"],
    contactPersonName: "Dr. Rajesh Kumar",
    contactPhoneNumber: "+91 98765 43210",
    contactEmail: "rajesh.kumar@coimbatore.gov.in",
    contactAddress: "Public Works Department, Coimbatore Municipal Corporation, Town Hall, Coimbatore - 641001",
    isActive: true,
    deadline: "2025-08-15T23:59:59"
  },
  {
    id: 3,
    title: "Assistant Town Planner",
    department: "Urban Planning",
    location: "Coimbatore Municipal Corporation",
    description: "Assist in urban planning activities including land use planning, development control, and building plan approvals. The role involves reviewing development proposals, conducting site inspections, and ensuring compliance with planning regulations.",
    requirements: ["Degree in Urban Planning or Architecture", "Knowledge of planning laws and regulations", "GIS software experience preferred", "Strong analytical and communication skills"],
    contactPersonName: "Mr. Suresh Babu",
    contactPhoneNumber: "+91 63694 74451",
    contactEmail: "suresh.babu@coimbatore.gov.in",
    contactAddress: "Urban Planning Department, Coimbatore Municipal Corporation",
    isActive: true,
    deadline: "2025-08-20T23:59:59"
  },
  {
    id: 5,
    title: "Accounts Officer",
    department: "Finance Department",
    location: "Municipal Corporation Head Office",
    description: "Handle financial transactions, maintain accounting records, prepare financial reports, and assist in budget preparation. The role requires attention to detail and strong analytical skills in financial management.",
    requirements: ["BCom/MCom with accounting background", "2+ years experience in government accounting", "Knowledge of financial software", "Understanding of municipal finance procedures"],
    contactPersonName: "Mrs. Lakshmi Devi",
    contactPhoneNumber: "+91 63827 58637",
    contactEmail: "lakshmi.devi@coimbatore.gov.in",
    contactAddress: "Finance Department, Municipal Corporation, Coimbatore",
    isActive: true,
    deadline: "2025-07-25T23:59:59"
  }
];

// Sample volunteer data
const sampleVolunteers = [
  {
    id: 2,
    programTitle: "Community Health Volunteer",
    location: "Various locations in Coimbatore",
    programDescription: "Join our community health initiative to promote healthcare awareness and support health programs in various neighborhoods. Volunteers will conduct health surveys, assist in vaccination drives, and educate communities about preventive healthcare measures.",
    programDate: "2025-08-10",
    programTime: "09:00:00",
    duration: "6 months program",
    coordinatorName: "Ms. Priya Sharma",
    coordinatorPhone: "+91 87654 32109",
    coordinatorEmail: "priya.sharma@coimbatore.gov.in",
    coordinatorAddress: "Health Department, Municipal Corporation Office, Coimbatore",
    isActive: true
  },
  {
    id: 4,
    programTitle: "Tree Plantation Drive",
    location: "Coimbatore City Parks",
    programDescription: "Participate in our city-wide tree plantation initiative to increase green cover and promote environmental sustainability. Volunteers will help plant saplings, maintain plant records, and support ongoing tree care activities.",
    programDate: "2025-08-12",
    programTime: "6:00 AM - 10:00 AM",
    duration: "One-time event with follow-up care",
    coordinatorName: "Dr. Meera Nair",
    coordinatorPhone: "+91 76543 21098",
    coordinatorEmail: "meera.nair@coimbatore.gov.in",
    coordinatorAddress: "Environment Department, Municipal Corporation, Coimbatore",
    isActive: true
  }
];

const JobApplicationsPost = () => {
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const adminId = localStorage.getItem("id")

  const [jobs, setJobs] = useState(sampleJobs);
  const [volunteers, setVolunteers] = useState(sampleVolunteers);
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [filteredVolunteers, setFilteredVolunteers] = useState(volunteers);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const JOB_APPLICATION_API = process.env.REACT_APP_API_JOB_APPLICATION_URL;

  // useEffect(() => {
  //   // Fetch jobs
  //   axios.get(`${JOB_APPLICATION_API}/jobs`)
  //     .then(res => {
  //         console.log('Jobs Response:', res.data.data);
  //         const data = res.data.data
  //         setJobs(data ? data : [])
  //       })
  //       .catch(err => {
  //         toast.error('Server Error! Unable to Fetch Jobs Data', {
  //           position: 'top-right',
  //           autoClose: 3000,
  //           theme: 'colored'
  //         });
  //         console.error('Error:', err.response?.data || err.message);
  //       });
        
  //   // Fetch volunteers
  //   axios.get(`${JOB_APPLICATION_API}/service`)
  //     .then(res => {
  //         console.log('Volunteers Response:', res.data.data);
  //         const data = res.data.data
  //         setVolunteers(data ? data : [])
  //       })
  //       .catch(err => {
  //         toast.error('Server Error! Unable to Fetch Volunteers Data', {
  //           position: 'top-right',
  //           autoClose: 3000,
  //           theme: 'colored'
  //         });
  //         console.error('Error:', err.response?.data || err.message);
  //       });
  // }, [token, email, adminId, JOB_APPLICATION_API, navigate])

  // Filter jobs and volunteers based on search and filter criteria
  useEffect(() => {
    let filteredJobs = jobs;
    let filteredVolunteers = volunteers;

    // Apply type filter
    if (activeFilter === 'municipal') {
      filteredVolunteers = [];
    } else if (activeFilter === 'volunteer') {
      filteredJobs = [];
    } else if (activeFilter === 'active') {
      filteredJobs = jobs.filter(job => job.isActive);
      filteredVolunteers = volunteers.filter(volunteer => volunteer.isActive);
    } else if (activeFilter === 'inactive') {
      filteredJobs = jobs.filter(job => !job.isActive);
      filteredVolunteers = volunteers.filter(volunteer => !volunteer.isActive);
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

  // Handle add new job/volunteer
  const handleAddMunicipalJob = useCallback(() => {
    navigate('/admin/job-applications/add/municipal');
  }, [navigate]);

  const handleAddVolunteerJob = useCallback(() => {
    navigate('/admin/job-applications/add/volunteer');
  }, [navigate]);

  // Handle edit
  const handleEdit = useCallback((item) => {
    const type = item.programTitle ? 'volunteer' : 'municipal';
    navigate(`/admin/job-applications/edit/${type}/${item.id}`);
  }, [navigate]);

  // Handle delete
  const handleDeleteClick = useCallback((item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (itemToDelete) {
      const isVolunteer = itemToDelete.programTitle ? true : false;
      const endpoint = isVolunteer ? 'service' : 'jobs';
      
      axios.delete(`${JOB_APPLICATION_API}/${endpoint}/${itemToDelete.id}`)
        .then(res => {
          toast.success(`${isVolunteer ? 'Volunteer program' : 'Job'} deleted successfully!`, {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored'
          });
          
          // Refresh data
          if (isVolunteer) {
            setVolunteers(volunteers.filter(v => v.id !== itemToDelete.id));
          } else {
            setJobs(jobs.filter(j => j.id !== itemToDelete.id));
          }
        })
        .catch(err => {
          toast.error('Error deleting item!', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored'
          });
          console.error('Delete error:', err.response?.data || err.message);
        });
      
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, JOB_APPLICATION_API, jobs, volunteers]);

  const cancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }, []);

  const handleToggleStatus = useCallback((item) => {
    const isVolunteer = !!item.programTitle;

    if (isVolunteer) {
      const updatedVolunteers = volunteers.map(v =>
        v.id === item.id ? { ...v, isActive: !v.isActive } : v
      );
      setVolunteers(updatedVolunteers);
      // Here you can also add an API call to update the status on the server
      // For example: axios.put(`${JOB_APPLICATION_API}/service/${item.id}`, { ...item, isActive: !item.isActive });
      toast.success(`'${item.programTitle}' status updated!`);
    } else {
      const updatedJobs = jobs.map(j =>
        j.id === item.id ? { ...j, isActive: !j.isActive } : j
      );
      setJobs(updatedJobs);
      // API call to update job status
      // For example: axios.put(`${JOB_APPLICATION_API}/jobs/${item.id}`, { ...item, isActive: !item.isActive });
      toast.success(`'${item.title}' status updated!`);
    }
  }, [jobs, volunteers]);

  // Get counts
  const allJobs = jobs.length;
  const allVolunteers = volunteers.length;
  const activeJobs = jobs.filter(job => job.isActive).length;
  const activeVolunteers = volunteers.filter(volunteer => volunteer.isActive).length;
  const inactiveJobs = jobs.filter(job => !job.isActive).length;
  const inactiveVolunteers = volunteers.filter(volunteer => !volunteer.isActive).length;
  const municipalCount = allJobs;
  const volunteerCount = allVolunteers;
  const totalOpportunities = municipalCount + volunteerCount;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer />
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete Item</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete "<strong>{itemToDelete?.title || itemToDelete?.programTitle}</strong>"? 
              This will permanently remove the {itemToDelete?.programTitle ? 'volunteer program' : 'job posting'}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl transition-colors font-medium"
              >
                Delete
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
      <div className="bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Admin - Job Management</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
                Manage municipal job postings and volunteer programs for the Municipal Corporation
              </p>
            </div>
            
            {/* Add Job Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddMunicipalJob}
                className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg"
              >
                <Plus size={20} />
                Add Municipal Job
              </button>
              <button
                onClick={handleAddVolunteerJob}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium shadow-lg"
              >
                <Plus size={20} />
                Add Volunteer Job
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Opportunities</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalOpportunities}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  <TrendingUp size={16} className="inline mr-1" />
                  Active: {activeJobs + activeVolunteers}
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
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{municipalCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Building2 size={16} className="inline mr-1" />
                  Active: {activeJobs}
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
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{volunteerCount}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <Heart size={16} className="inline mr-1" />
                  Active: {activeVolunteers}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Heart className="text-green-600 dark:text-green-400" size={24} />
              </div>
            </div>
          </div>
        </div>

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
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 bg-white dark:bg-navy-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All ({totalOpportunities})
            </button>
            <button
              onClick={() => setActiveFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === 'active'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Active ({activeJobs + activeVolunteers})
            </button>
            <button
              onClick={() => setActiveFilter('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === 'inactive'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Inactive ({inactiveJobs + inactiveVolunteers})
            </button>
            <button
              onClick={() => setActiveFilter('municipal')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === 'municipal'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Municipal ({municipalCount})
            </button>
            <button
              onClick={() => setActiveFilter('volunteer')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeFilter === 'volunteer'
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Volunteer ({volunteerCount})
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length === 0 && filteredVolunteers.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-navy-800 rounded-2xl shadow-lg">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No opportunities found matching your criteria.
              </p>
            </div>
          ) : (
            <>
              {filteredJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  isJobExpired={isJobExpired}
                  formatDate={formatDate}
                  isAdminView={true}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
              {filteredVolunteers.map(volunteer => (
                <VolunteerCard
                  key={volunteer.id}
                  volunteer={volunteer}
                  formatDate={formatDate}
                  isAdminView={true}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplicationsPost;


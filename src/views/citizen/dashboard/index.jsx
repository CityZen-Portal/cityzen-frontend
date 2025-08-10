import React, { useState, useEffect } from "react";
import { Plus, BarChart3, TrendingUp, Users, CheckCircle, Clock, AlertCircle, Briefcase, Settings } from "lucide-react";
import NewsGallery from "./components/NewsGallery.jsx";
import PieChartCard from "./components/PieChart";
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [serviceRequests, setServiceRequests] = useState({ pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  
  // Get token and user info from localStorage
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const citizenId = localStorage.getItem("id");
  const JOB_APPLICATION_API = process.env.REACT_APP_API_JOB_APPLICATION_URL;
  const HELPDESK_API = process.env.REACT_APP_API_HELPDESK_URL;
  const SERVICE_API = "https://utility-booking-backend.onrender.com/api/task/service/count";

  // Fetch jobs and volunteers data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch jobs data
        const jobsResponse = await axios.get(`${JOB_APPLICATION_API}/jobs`, {
          headers: {
            token,
            email,
            id: citizenId
          }
        });
        
        // Fetch volunteers data
        const volunteersResponse = await axios.get(`${JOB_APPLICATION_API}/service`, {
          headers: {
            token,
            email,
            id: citizenId
          }
        });
        
        const jobsData = jobsResponse.data?.data || [];
        const volunteersData = volunteersResponse.data?.data || [];
        
        setJobs(jobsData);
        setVolunteers(volunteersData);
        
      } catch (error) {
        console.error('Error fetching opportunities data:', error);
        toast.error('Unable to fetch opportunities data', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored'
        });
        setJobs([]);
        setVolunteers([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (token && email && citizenId && JOB_APPLICATION_API) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token, email, citizenId, JOB_APPLICATION_API]);

  // Fetch complaints data
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoadingComplaints(true);
        
        const response = await axios.get(`${HELPDESK_API}/citizen/complaints`, {
          headers: {
            token,
            email,
            id: citizenId
          }
        });
        
        const complaintsData = response.data?.data || [];
        setComplaints(complaintsData);
        
      } catch (error) {
        console.error('Error fetching complaints:', error);
        toast.error('Unable to fetch complaints', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored'
        });
        setComplaints([]);
      } finally {
        setLoadingComplaints(false);
      }
    };
    
    if (token && email && citizenId && HELPDESK_API) {
      fetchComplaints();
    } else {
      setLoadingComplaints(false);
    }
  }, [token, email, citizenId, HELPDESK_API]);

  // Fetch service requests count
  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setLoadingServices(true);
        
        const response = await axios.get(`${SERVICE_API}/${citizenId}`, {
          headers: {
            token,
            email,
            id: citizenId
          }
        });
        
        const serviceData = response.data?.data || { pending: 0, completed: 0 };
        setServiceRequests(serviceData);
        
      } catch (error) {
        console.error('Error fetching service requests:', error);
        toast.error('Unable to fetch service requests', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored'
        });
        setServiceRequests({ pending: 0, completed: 0 });
      } finally {
        setLoadingServices(false);
      }
    };
    
    if (token && email && citizenId) {
      fetchServiceRequests();
    } else {
      setLoadingServices(false);
    }
  }, [token, email, citizenId]);

  // Calculate counts from fetched data
  const activeJobs = jobs.filter(job => job.isActive);
  const activeVolunteers = volunteers.filter(volunteer => volunteer.isActive);
  const municipalCount = activeJobs.length;
  const volunteerCount = activeVolunteers.length;
  const totalOpportunities = municipalCount + volunteerCount;

  // Calculate complaint counts from the complaints data based on actual statuses
  const activeComplaints = complaints.filter(complaint => {
    if (!complaint.status) return false;
    const status = complaint.status.toLowerCase().trim();
    return ['active', 'open', 'in-progress', 'in progress', 'new', 'on-hold'].includes(status);
  });

  const resolvedComplaints = complaints.filter(complaint => {
    if (!complaint.status) return false;
    const status = complaint.status.toLowerCase().trim();
    return ['resolved', 'closed', 'completed', 'done', 'finished'].includes(status);
  });

  const pendingComplaints = complaints.filter(complaint => {
    if (!complaint.status) return false;
    const status = complaint.status.toLowerCase().trim();
    return ['pending', 'waiting', 'under review', 'assigned'].includes(status);
  });
  
  // Calculate due soon complaints (if there's a dueDate field)
  const today = new Date();
  const dueSoonComplaints = complaints.filter(complaint => {
    if (!complaint.dueDate && !complaint.expectedResolutionDate) return false;
    const dueDate = new Date(complaint.dueDate || complaint.expectedResolutionDate);
    if (isNaN(dueDate.getTime())) return false;
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0; // Due within the next 7 days
  });

  const quickStats = [
    { 
      number: loadingComplaints ? "..." : complaints.length.toString(), 
      label: "Total Complaints", 
      icon: AlertCircle, 
      change: loadingComplaints ? "Loading..." : (activeComplaints.length > 0 ? `${activeComplaints.length} active complaints` : "All complaints resolved"),
      color: "from-red-500 to-red-600"
    },
    { 
      number: loadingComplaints ? "..." : resolvedComplaints.length.toString(), 
      label: "Resolved Issues", 
      icon: CheckCircle, 
      change: loadingComplaints ? "Loading..." : (resolvedComplaints.length > 0 ? `${resolvedComplaints.length} successfully resolved` : "No resolved complaints yet"),
      color: "from-green-500 to-green-600"
    },
    { 
      number: loadingComplaints ? "..." : pendingComplaints.length.toString(), 
      label: "Pending Services", 
      icon: Clock, 
      change: loadingComplaints ? "Loading..." : (pendingComplaints.length > 0 ? `${pendingComplaints.length} awaiting response` : "No pending complaints"),
      color: "from-orange-500 to-orange-600"
    },
    { 
      number: loading ? "..." : totalOpportunities.toString(), 
      label: "Total Opportunities", 
      icon: Briefcase, 
      change: loading ? "Loading..." : `${municipalCount} jobs, ${volunteerCount} volunteer`,
      color: "from-blue-500 to-blue-600"  
    }
  ];

  // Debug logging to help understand the data structure
  useEffect(() => {
    if (complaints.length > 0) {
      console.log("Sample complaint data:", complaints[0]);
      console.log("All complaint statuses:", complaints.map(c => c.status).filter(Boolean));
    }
  }, [complaints]);

  useEffect(() => {
    if (serviceRequests.pending > 0 || serviceRequests.completed > 0) {
      console.log("Service requests data:", serviceRequests);
    }
  }, [serviceRequests]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 transition-colors duration-500">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-10 w-64 h-64 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Citizen{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Track your complaints, monitor service requests, and stay updated with municipal activities in your area.
            </p>
          </div>
          
          {/* Loading State for Stats */}
          {(loading || loadingComplaints || loadingServices) && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                <Settings className="w-4 h-4 mr-2 animate-spin" />
                Loading your dashboard data...
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 hover:-translate-y-3 cursor-pointer"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl mb-4 group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium mb-2">
                  {stat.label}
                </div>
                {stat.change && (
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    {stat.change}
                  </div>
                )}
              </div>
            ))}
          </div>


        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
            <BarChart3 className="w-4 h-4 mr-2" />
            Municipal Analytics
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            City{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Statistics
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real-time insights into municipal services and citizen engagement across different categories.
          </p>
        </div>
        <PieChartCard />
      </div>

      {/* News Section */}
      <div className="bg-white dark:bg-gray-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Municipal Updates
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay informed about important civic developments, policy changes, and community announcements.
            </p>
          </div>
          <NewsGallery />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
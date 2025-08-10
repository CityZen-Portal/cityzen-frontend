import React, { useState, useCallback, useEffect } from 'react';
import {
  Building2, MapPin, Calendar, Clock, Users, User, Phone, Mail, FileText, CheckCircle, Share2, Check, AlertTriangle, Briefcase, ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminJobDetailsPage = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const adminId = localStorage.getItem("id")

  const jobId = parseInt(id, 10);
  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const JOB_APPLICATION_API = process.env.REACT_APP_API_JOB_APPLICATION_URL;
  
  const [job, setJob] = useState({})

  useEffect(() => {
    setLoading(true);
  
    axios.get(`${JOB_APPLICATION_API}/jobs/${id}`,
      {
        headers:{
          token,
          email,
          id: adminId
        }
      }
    )
      .then(res => {
        console.log('Response:', res.data);
        const response = res.data;

        if (!response.success) {
          throw new Error(response.message || 'Unknown error');
        }

        setJob(response.data || {});
      })
      .catch(err => {
        const backendError = err.response?.data;
        const errorMessage =
          backendError?.message ||          // ApiResponse.message
          backendError?.data?.message ||    // ErrorDetails.message
          err.message ||                    // JS Error message
          'Something went wrong';

          toast.error('Server Error!Unable to Fetch Data', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
            onClose: () => navigate("/admin/job-application")
          });

          console.error('Error:', backendError || err);
        })
        .finally(() => {
          setLoading(false);
        });
        
  }, [id, token, email, adminId, JOB_APPLICATION_API, navigate])

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleShare = useCallback(() => {
    if (navigator.share && job) {
      navigator.share({
        title: job.title,
        text: `Check out this job opportunity: ${job.title}`,
        url: window.location.href
      });
    } else {
      const url = `${window.location.origin}${window.location.pathname}#job-${jobId}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  }, [job, jobId]);

  const handleBack = () => {
    navigate('/admin/job-application');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Building2 className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading...</h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch the job details.</p>
        </div>
      </div>
    );
  }

  if (!Object.keys(job).length) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Job Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The job posting you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      {/* Header */}
      <div className="bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                title="Back to jobs"
              >
                <ArrowLeft className="text-gray-600 dark:text-gray-400" size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Job Details</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Municipal Job Opportunity</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                title="Share job"
              >
                {copySuccess ? (
                  <Check className="text-green-600 dark:text-green-400" size={20} />
                ) : (
                  <Share2 className="text-gray-600 dark:text-gray-400" size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Basic Info */}
            <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                    <Building2 className="text-blue-600 dark:text-blue-400" size={32} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        <Briefcase size={16} />
                        Municipal Job
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        job.isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}>
                        <CheckCircle size={16} />
                        {job.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                    <p className="font-medium text-gray-900 dark:text-white">{job.department}</p>
                  </div>
                </div>

                {job.deadline && (
                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Application Deadline</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatDate(job.deadline)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                Job Description
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <CheckCircle className="text-blue-600 dark:text-blue-400" size={24} />
                  Requirements
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="text-gray-500 mt-1 flex-shrink-0" size={16} />
                      <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <User className="text-blue-600 dark:text-blue-400" size={20} />
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Contact Person</p>
                    <p className="font-medium text-gray-900 dark:text-white">{job.contactPersonName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <a 
                      href={`tel:${job.contactPhoneNumber}`}
                      className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {job.contactPhoneNumber}
                    </a>
                  </div>
                </div>

                {job.contactEmail && (
                  <div className="flex items-start gap-3">
                    <Mail className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <a 
                        href={`mailto:${job.contactEmail}`}
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {job.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {job.contactAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                      <p className="font-medium text-gray-900 dark:text-white leading-relaxed">
                        {job.contactAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${job.contactPhoneNumber}`}
                    className="flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 py-2 px-3 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/80 transition-colors text-sm font-medium"
                  >
                    <Phone size={16} />
                    Call
                  </a>
                  {job.contactEmail && (
                    <a
                      href={`mailto:${job.contactEmail}`}
                      className="flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 py-2 px-3 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/80 transition-colors text-sm font-medium"
                    >
                      <Mail size={16} />
                      Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminJobDetailsPage;

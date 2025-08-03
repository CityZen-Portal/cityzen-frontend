import React, { useState, useCallback, useEffect } from 'react';
import {
  Building2, MapPin, Calendar, User, Phone, Mail, FileText, CheckCircle, Share2, Check, AlertTriangle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const JobDetailsPage = () => {
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const citizenId = localStorage.getItem("id")

  const {id} = useParams();
  const jobId = parseInt(id, 10);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const JOB_APPLICATION_API = process.env.REACT_APP_API_JOB_APPLICATION_URL;
  
  const [job, setJob] = useState({})

  useEffect(() => {
    // setLoading(true);
  
    axios.get(`http://localhost:10001/api/work/jobs/${id}`)
      .then(res => {
          console.log('Response:', res.data.data);
          const data = res.data.data
          setJob(data ? data : {})
        })
        .catch(err => {
          toast.error('Server Error!Unable to Fetch Data', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
            onClose: () => navigate("/citizen/job-application")
          });
          console.error('Error:', err.response?.data || err.message);
        })
        .finally(() => {
          // setLoading(false);
        });
        
  }, [id, token, email, citizenId, JOB_APPLICATION_API, navigate])

  const isJobExpired = (job) => {
    if (job.deadline) {
      const deadline = new Date(job.deadline);
      const today = new Date();
      return deadline < today;
    }
    return false;
  };

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

  // if (!job) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
  //           <AlertTriangle className="text-gray-400" size={32} />
  //         </div>
  //         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Job Not Found</h2>
  //         <p className="text-gray-600 dark:text-gray-400 mb-6">The job you're looking for doesn't exist or has been removed.</p>
  //       </div>
  //     </div>
  //   );
  // }

  const expired = isJobExpired(job);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Job Details</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Municipal Corporation</p>
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

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
                    <Building2 className="text-blue-600 dark:text-blue-400" size={32} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {job.title}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                      {job.department}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        <Building2 size={16} />
                        Municipal Job
                      </div>
                      {expired && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                          <AlertTriangle size={16} />
                          Expired
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Application Deadline</p>
                    <p className={`font-medium ${expired ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {formatDate(job.deadline)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
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

            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                  Requirements
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <User className="text-purple-600 dark:text-purple-400" size={20} />
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

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${job.contactPhoneNumber}`}
                    className="flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 px-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                  >
                    <Phone size={16} />
                    Call
                  </a>
                  {job.contactEmail && (
                    <a
                      href={`mailto:${job.contactEmail}`}
                      className="flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 py-2 px-3 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium"
                    >
                      <Mail size={16} />
                      Email
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Job Type</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    Municipal Job
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Department</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {job.department}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Status</span>
                  <span className={`font-medium ${expired ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {expired ? 'Expired' : 'Active'}
                  </span>
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

export default JobDetailsPage;
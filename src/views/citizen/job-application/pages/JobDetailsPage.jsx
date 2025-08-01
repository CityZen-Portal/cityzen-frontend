import React, { useState, useCallback } from 'react';
import {
  Building2, Heart, MapPin, Calendar, Clock, Users,
  AlertTriangle, User, Phone, Mail, FileText, CheckCircle, Share2,
  Check
} from 'lucide-react';
import { useParams } from 'react-router-dom';

// All job data included within the component
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
    lastDate: "2025-07-25",
    contactName: "Mrs. Lakshmi Devi",
    contactPhone: "+91 63827 58637",
    contactEmail: "lakshmi.devi@coimbatore.gov.in",
    contactAddress: "Finance Department, Municipal Corporation, Coimbatore",
    isActive: true
  }
];

const JobDetailsPage = () => {
  const {id} = useParams();
  const jobId = parseInt(id, 10);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Find the job from local data
  const job = sampleJobs.find(j => j.id.toString() === jobId.toString());

  // Check if job deadline has passed
  const isJobExpired = (job) => {
    if (job.jobType === 'municipal' && job.lastDate) {
      const deadline = new Date(job.lastDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return deadline < today;
    }
    return false;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };


  // Handle share functionality
  const handleShare = useCallback(() => {
    if (navigator.share && job) {
      navigator.share({
        title: job.title,
        text: `Check out this ${job.jobType} opportunity: ${job.title}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      const url = `${window.location.origin}${window.location.pathname}#job-${jobId}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  }, [job, jobId]);

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Job Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The job you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const expired = isJobExpired(job);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Job Details</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {job.jobType === 'municipal' ? 'Municipal Corporation' : 'Volunteer Program'}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    job.jobType === 'municipal'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : 'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    {job.jobType === 'municipal' ? (
                      <Building2 className="text-blue-600 dark:text-blue-400" size={32} />
                    ) : (
                      <Heart className="text-green-600 dark:text-green-400" size={32} />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {job.title}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                      {job.department}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        job.jobType === 'municipal'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}>
                        {job.jobType === 'municipal' ? (
                          <>
                            <Building2 size={16} />
                            Municipal Job
                          </>
                        ) : (
                          <>
                            <Heart size={16} />
                            Volunteer Opportunity
                          </>
                        )}
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

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">{job.location}</p>
                  </div>
                </div>

                {job.jobType === 'municipal' && job.lastDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Application Deadline</p>
                      <p className={`font-medium ${expired ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                        {formatDate(job.lastDate)}
                      </p>
                    </div>
                  </div>
                )}

                {job.jobType === 'volunteer' && job.workDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Program Date</p>
                      <p className="font-medium text-gray-900 dark:text-white">{formatDate(job.workDate)}</p>
                    </div>
                  </div>
                )}

                {job.jobType === 'volunteer' && job.workTime && (
                  <div className="flex items-center gap-3">
                    <Clock className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-medium text-gray-900 dark:text-white">{job.workTime}</p>
                    </div>
                  </div>
                )}

                {job.jobType === 'volunteer' && job.duration && (
                  <div className="flex items-center gap-3">
                    <Users className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-medium text-gray-900 dark:text-white">{job.duration}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                {job.jobType === 'municipal' ? 'Job Description' : 'Program Description'}
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                  Requirements
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {job.requirements}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <User className="text-purple-600 dark:text-purple-400" size={20} />
                Contact Information
              </h3>
              
              <div className="space-y-4">
                {job.contactName && (
                  <div className="flex items-start gap-3">
                    <User className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Contact Person</p>
                      <p className="font-medium text-gray-900 dark:text-white">{job.contactName}</p>
                    </div>
                  </div>
                )}

                {job.contactPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <a 
                        href={`tel:${job.contactPhone}`}
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {job.contactPhone}
                      </a>
                    </div>
                  </div>
                )}

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

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-3">
                  {job.contactPhone && (
                    <a
                      href={`tel:${job.contactPhone}`}
                      className="flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2 px-3 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm font-medium"
                    >
                      <Phone size={16} />
                      Call
                    </a>
                  )}
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

            {/* Job Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Job Type</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {job.jobType}
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
    </div>
  );
};

export default JobDetailsPage;
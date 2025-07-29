import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Loader2 } from 'lucide-react';
const ApplicantDetails = () => {
  const { jobId, applicantId } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [status, setStatus] = useState('pending');

  // Sample appliedJobs data (replace with your data source)
  const appliedJobs = [
    {
      id: 1,
      applicationId: 'APP001234',
      title: 'Sanitary Inspector',
      jobId: 1,
      appliedDate: '2025-07-25',
      status: 'pending',
      adminResponse: '',
      citizen: {
        name: 'Ravi Kumar',
        email: 'ravi.kumar@example.com',
        phone: '+91-9876543210',
        qualifications: 'B.Sc. in Public Health',
        address: '123 Main St, Coimbatore'
      }
    },
    {
      id: 2,
      applicationId: 'APP001235',
      title: 'Junior Engineer (Civil)',
      jobId: 2,
      appliedDate: '2025-07-20',
      status: 'under_review',
      adminResponse: '',
      citizen: {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+91-8765432109',
        qualifications: 'B.Tech in Civil Engineering',
        address: '456 Park Ave, Chennai'
      }
    },
    {
      id: 3,
      applicationId: 'APP001236',
      title: 'Health Inspector',
      jobId: 1,
      appliedDate: '2025-07-28',
      status: 'accepted',
      adminResponse: '',
      citizen: {
        name: 'Amit Patel',
        email: 'amit.patel@example.com',
        phone: '+91-7654321098',
        qualifications: 'M.Sc. in Health Sciences',
        address: '789 Hill Rd, Bangalore'
      }
    },
  ];

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);
      const foundApplicant = appliedJobs.find(job => job.id === parseInt(applicantId) && job.jobId === parseInt(jobId));
      if (!foundApplicant) {
        setError('Applicant not found.');
      } else {
        setApplicant(foundApplicant);
        setAdminResponse(foundApplicant.adminResponse || '');
        setStatus(foundApplicant.status || 'pending');
      }
    } catch (err) {
      setError('An error occurred while loading applicant details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [jobId, applicantId]);

  const handleSave = () => {
    const updatedApplicants = appliedJobs.map(job =>
      job.id === parseInt(applicantId) ? { ...job, status, adminResponse } : job
    );
    // In a real app, this would update a backend or state management
    console.log('Updated applicants:', updatedApplicants);
    navigate(`/admin/job-applications/applicants/${jobId}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-navy-900 p-4 rounded-xl mb-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
          <p className="text-gray-600 dark:text-gray-300">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div className="bg-gray-50 dark:bg-navy-900 p-4 rounded-xl mb-6 min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-[#334155] rounded-2xl border border-gray-200 dark:border-[#475569] p-8 text-center max-w-md">
          <p className="text-red-500 mb-4">{error || 'Applicant not found.'}</p>
          <button
            onClick={() => navigate(`/admin/job-applications/applicants/${jobId}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Applicants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-navy-900 p-4 rounded-xl mb-6 min-h-screen">
      <div className="bg-white dark:bg-[#334155] border-b border-gray-200 dark:border-[#475569]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/admin/job-applications/applicants/${jobId}`)}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Applicants
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                Applicant Details - {applicant.applicationId}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Review and respond to applicant</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-[#334155] rounded-xl border border-gray-200 dark:border-[#475569] p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">Applicant Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><strong>Name:</strong> {applicant.citizen.name}</p>
                <p><strong>Email:</strong> {applicant.citizen.email}</p>
                <p><strong>Phone:</strong> {applicant.citizen.phone}</p>
                <p><strong>Qualifications:</strong> {applicant.citizen.qualifications}</p>
                <p><strong>Address:</strong> {applicant.citizen.address}</p>
                <p><strong>Applied Date:</strong> {applicant.appliedDate}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Response</label>
              <textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#334155] text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Enter your response here..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#334155] text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <CheckCircle size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;
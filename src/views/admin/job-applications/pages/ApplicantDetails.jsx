import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

const ApplicantDetails = () => {
  const { jobId, applicantId } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [status, setStatus] = useState('pending');
  const [saving, setSaving] = useState(false);

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
      status: 'pending',
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
      adminResponse: 'Congratulations! Your application has been approved.',
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

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedApplicants = appliedJobs.map(job =>
        job.id === parseInt(applicantId) ? { ...job, status, adminResponse } : job
      );
      console.log('Updated applicants:', updatedApplicants);
      
      setTimeout(() => {
        navigate(`/admin/job-applications/applicants/${jobId}`);
      }, 500);
    } catch (err) {
      console.error('Error saving changes:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={32} />
          <p className="text-gray-600 dark:text-gray-300">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !applicant) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center max-w-md">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate(`/admin/job-applications/applicants/${jobId}`)}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Applicants
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Applicant Details - {applicant.applicationId}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Review and respond to applicant</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-8">
            {/* Applicant Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Applicant Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name:
                  </label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">{applicant.citizen.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email:
                  </label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">{applicant.citizen.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone:
                  </label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">{applicant.citizen.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Qualifications:
                  </label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">{applicant.citizen.qualifications}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address:
                  </label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">{applicant.citizen.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Applied Date:
                  </label>
                  <p className="text-lg text-gray-900 dark:text-gray-100">{applicant.appliedDate}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700 mb-8" />

            {/* Admin Response */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Admin Response
              </label>
              <textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows="5"
                placeholder="Enter your response here..."
              />
            </div>

            {/* Status */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full max-w-xs p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg transition-all font-medium disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Saving Changes
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;


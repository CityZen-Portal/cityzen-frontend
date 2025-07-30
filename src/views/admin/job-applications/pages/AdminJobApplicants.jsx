import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Search, Filter, Loader2 } from 'lucide-react';
import { Eye } from 'lucide-react';
const AdminJobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('appliedDate');
  const [sortOrder, setSortOrder] = useState('desc');

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
      const jobApplicants = appliedJobs.filter(job => job.jobId === parseInt(jobId));
      if (jobApplicants.length === 0) {
        setError('No applicants found for this job.');
      } else {
        const sortedApplicants = [...jobApplicants].sort((a, b) => {
          if (sortBy === 'appliedDate') {
            return sortOrder === 'asc' ? new Date(a.appliedDate) - new Date(b.appliedDate) : new Date(b.appliedDate) - new Date(a.appliedDate);
          }
          return sortOrder === 'asc' ? a[sortBy].localeCompare(b[sortBy]) : b[sortBy].localeCompare(a[sortBy]);
        });
        setApplicants(sortedApplicants);
      }
    } catch (err) {
      setError('An error occurred while loading applicants.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [jobId, sortBy, sortOrder]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredApplicants = applicants.filter(applicant =>
    applicant.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (applicant.citizen?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
  );

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-navy-900 p-4 rounded-xl mb-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
          <p className="text-gray-600 dark:text-gray-300">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-navy-900 p-4 rounded-xl mb-6 min-h-screen flex items-center justify-center">
        <div className="bg-white dark:bg-[#334155] rounded-2xl border border-gray-200 dark:border-[#475569] p-8 text-center max-w-md">
          <User className="text-gray-400 dark:text-gray-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">No Applicants Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">It seems there are no applicants for this job yet. Check back later or promote the job to attract candidates.</p>
          <button
            onClick={() => navigate('/admin/job-applications')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Jobs
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
              onClick={() => navigate('/admin/job-applications')}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Jobs
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                Applicants for Job ID: {jobId}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and review applicant details</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search by ID, name, title, or status..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#334155] text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            onClick={() => handleSort('status')}
            className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            <Filter size={18} />
            <span>Sort by Status</span>
          </button>
        </div>

        <div className="bg-white dark:bg-[#334155] rounded-xl border border-gray-200 dark:border-[#475569] p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              Total Applicants: {filteredApplicants.length}
            </h2>
          </div>
          {filteredApplicants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 dark:bg-[#475569] border-b border-gray-200 dark:border-[#475569]">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                      onClick={() => handleSort('applicationId')}>
                      Application ID {sortBy === 'applicationId' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                      onClick={() => handleSort('title')}>
                      Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                      onClick={() => handleSort('appliedDate')}>
                      Applied Date {sortBy === 'appliedDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
                      onClick={() => handleSort('status')}>
                      Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className="border-b border-gray-200 dark:border-[#475569] hover:bg-gray-50 dark:hover:bg-[#3b4252]">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{applicant.applicationId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{applicant.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{applicant.appliedDate}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                        <span className={`px-2 py-1 rounded-full text-xs ${applicant.status === 'accepted' ? 'bg-green-100 text-green-800' : applicant.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' : applicant.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                          {applicant.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => navigate(`/admin/job-applications/applicants/${jobId}/details/${applicant.id}`)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#334155] rounded-2xl border border-gray-200 dark:border-[#475569] p-8 text-center max-w-md mx-auto">
              <User className="text-gray-400 dark:text-gray-500 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">No Applicants Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">It seems there are no applicants for this job yet. Check back later or promote the job to attract candidates.</p>
              <button
                onClick={() => navigate('/admin/job-applications')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Back to Jobs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobApplicants;
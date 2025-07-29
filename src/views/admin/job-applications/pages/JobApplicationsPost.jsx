import React, { useState, useEffect } from 'react';
import {
  Plus, FilePen, Briefcase, MapPin, Calendar,
  Building2, ToggleLeft, ToggleRight
} from 'lucide-react';

const AdminJobManager = () => {
  const [jobs, setJobs] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit'
  const [editingJobId, setEditingJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    location: '',
    lastDate: '',
    isActive: true
  });

  // Mock navigate function for demonstration
  const navigate = (path) => {
    if (path === '/admin/job-applications/add') {
      setCurrentView('add');
      setFormData({
        title: '',
        description: '',
        department: '',
        location: '',
        lastDate: '',
        isActive: true
      });
    } else if (path.includes('/admin/job-applications/edit/')) {
      const id = parseInt(path.split('/').pop());
      const jobToEdit = jobs.find(job => job.id === id);
      if (jobToEdit) {
        setCurrentView('edit');
        setEditingJobId(id);
        setFormData({
          title: jobToEdit.title,
          description: jobToEdit.description,
          department: jobToEdit.department,
          location: jobToEdit.location,
          lastDate: jobToEdit.lastDate,
          isActive: jobToEdit.isActive
        });
      }
    }
  };

  // Initialize with sample data if no jobs exist
  useEffect(() => {
    if (jobs.length === 0) {
      const sampleJobs = [
        {
          id: 1,
          title: "Frontend Developer",
          description: "We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for creating user-friendly web applications using modern technologies like React, Vue, or Angular.",
          department: "Engineering",
          location: "New York, NY",
          lastDate: "2025-08-15",
          isActive: true
        },
        {
          id: 2,
          title: "Product Manager",
          description: "Join our product team to drive the development of innovative solutions. You will work closely with engineering, design, and business teams to deliver exceptional products.",
          department: "Product",
          location: "San Francisco, CA",
          lastDate: "2025-08-20",
          isActive: true
        },
        {
          id: 3,
          title: "UX Designer",
          description: "We're seeking a creative UX Designer to craft intuitive and engaging user experiences. You'll conduct user research, create wireframes, and design beautiful interfaces.",
          department: "Design",
          location: "Remote",
          lastDate: "2025-07-30",
          isActive: false
        }
      ];
      setJobs(sortJobs(sampleJobs));
    }
  }, []);

  const sortJobs = (jobsArray) => {
    return [...jobsArray].sort((a, b) => {
      if (a.isActive === b.isActive) return 0;
      return a.isActive ? -1 : 1;
    });
  };

  const toggleJobStatus = (id) => {
    setJobs(prevJobs => {
      const updatedJobs = prevJobs.map(job =>
        job.id === id ? { ...job, isActive: !job.isActive } : job
      );
      return sortJobs(updatedJobs);
    });
  };

  const handleEdit = (id) => {
    navigate(`/admin/job-applications/edit/${id}`);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveJob = () => {
    if (currentView === 'add') {
      const newJob = {
        id: Math.max(...jobs.map(j => j.id), 0) + 1,
        ...formData
      };
      setJobs(prevJobs => sortJobs([...prevJobs, newJob]));
    } else if (currentView === 'edit') {
      setJobs(prevJobs => {
        const updatedJobs = prevJobs.map(job =>
          job.id === editingJobId ? { ...job, ...formData } : job
        );
        return sortJobs(updatedJobs);
      });
    }
    
    // Reset to list view
    setCurrentView('list');
    setEditingJobId(null);
    setFormData({
      title: '',
      description: '',
      department: '',
      location: '',
      lastDate: '',
      isActive: true
    });
  };

  const handleCancel = () => {
    setCurrentView('list');
    setEditingJobId(null);
    setFormData({
      title: '',
      description: '',
      department: '',
      location: '',
      lastDate: '',
      isActive: true
    });
  };

  // Job Form Component
  const JobForm = ({ isEdit = false }) => (
    <div className="bg-gray-50 dark:bg-navy-900 p-4 rounded-xl mb-6 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-[#334155] border-b border-gray-200 dark:border-[#475569]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                {isEdit ? 'Edit Job' : 'Add New Job'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {isEdit ? 'Update job posting details' : 'Create a new job posting'}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-[#334155] rounded-xl border border-gray-200 dark:border-[#475569] p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#475569] dark:text-gray-200"
                placeholder="Enter job title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#475569] dark:text-gray-200"
                placeholder="Enter detailed job description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#475569] dark:text-gray-200"
                  placeholder="e.g., Engineering, Marketing"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#475569] dark:text-gray-200"
                  placeholder="e.g., New York, NY or Remote"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Application Deadline *
              </label>
              <input
                type="date"
                value={formData.lastDate}
                onChange={(e) => handleInputChange('lastDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#475569] dark:text-gray-200"
                required
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Status
              </label>
              <button
                type="button"
                onClick={() => handleInputChange('isActive', !formData.isActive)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-[#475569] hover:bg-gray-200 dark:hover:bg-[#64748b] rounded-full px-4 py-2 transition-all"
              >
                {formData.isActive ? (
                  <ToggleRight className="text-green-600" size={20} />
                ) : (
                  <ToggleLeft className="text-gray-400" size={20} />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </button>
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                onClick={handleSaveJob}
                className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium"
              >
                {isEdit ? 'Update Job' : 'Create Job'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render based on current view
  if (currentView === 'add') {
    return <JobForm isEdit={false} />;
  }

  if (currentView === 'edit') {
    return <JobForm isEdit={true} />;
  }

  // Main job list view
  return (
    <div className="bg-gray-50 dark:bg-navy-900 p-4 rounded-xl mb-6 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-[#334155] border-b border-gray-200 dark:border-[#475569]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Job Applications</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your job postings</p>
            </div>
            <button
              onClick={() => navigate('/admin/job-applications/add')}
              className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg"
            >
              <Plus size={20} />
              Add Job
            </button>
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {jobs.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center bg-white dark:bg-[#334155] rounded-2xl border border-gray-200 dark:border-[#475569] p-12 max-w-md">
              <div className="w-20 h-20 bg-gray-100 dark:bg-[#475569] rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="text-gray-500 dark:text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-3">No jobs posted yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">Start by creating your first job posting.</p>
              <button
                onClick={() => navigate('/admin/job-applications/add')}
                className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Create First Job
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                {jobs.filter(j => j.isActive).length} Active • {jobs.filter(j => !j.isActive).length} Inactive
              </h2>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white dark:bg-[#334155] rounded-xl border ${job.isActive ? 'border-[#3b82f6]' : 'border-gray-300 dark:border-gray-600'} overflow-hidden transition-all duration-300 group`}
                >
                  <div className={`relative h-48 ${job.isActive ? 'bg-gradient-to-br from-[#3b82f6] to-[#60a5fa]' : 'bg-gradient-to-br from-gray-400 to-gray-500'} overflow-hidden`}>
                    <div className="w-full h-full flex items-center justify-center">
                      <Briefcase className="text-white/90" size={48} />
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <button
                        onClick={() => toggleJobStatus(job.id)}
                        className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-2 py-1 transition-all"
                      >
                        {job.isActive ? (
                          <ToggleRight className="text-white" size={18} />
                        ) : (
                          <ToggleLeft className="text-white" size={18} />
                        )}
                        <span className="text-xs font-medium text-white">
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`text-xl font-bold group-hover:text-[#3b82f6] transition-colors ${job.isActive ? 'text-gray-900 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                        {job.title}
                      </h3>
                      <button
                        onClick={() => handleEdit(job.id)}
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                        aria-label="Edit job"
                      >
                        <FilePen size={18} />
                      </button>
                    </div>

                    <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ${job.isActive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                      {job.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className={`flex items-center gap-3 ${job.isActive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        <Building2 size={18} className={`flex-shrink-0 ${job.isActive ? 'text-[#3b82f6]' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">{job.department}</span>
                      </div>
                      <div className={`flex items-center gap-3 ${job.isActive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        <MapPin size={18} className={`flex-shrink-0 ${job.isActive ? 'text-[#22c55e]' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">{job.location}</span>
                      </div>
                      <div className={`flex items-center gap-3 ${job.isActive ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        <Calendar size={18} className={`flex-shrink-0 ${job.isActive ? 'text-[#f59e0b]' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">Apply by {job.lastDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobManager;
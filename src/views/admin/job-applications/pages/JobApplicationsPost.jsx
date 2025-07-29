import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, FilePen, Briefcase, MapPin, Calendar,
  Building2, ToggleLeft, ToggleRight, AlertCircle
} from 'lucide-react';

// Job Form Component - moved outside to prevent recreation
const JobForm = React.memo(({ 
  isEdit, 
  formData, 
  onInputChange, 
  onSave, 
  onCancel,
  errors = {}
}) => {
  
  return (
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
              onClick={onCancel}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg"
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
              <div className="relative">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => onInputChange('title', e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#475569] dark:text-gray-200`}
                  placeholder="Enter job title"
                  required
                />
                {errors.title && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" size={20} />
                )}
              </div>
              {errors.title && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <div className="relative">
                <textarea
                  value={formData.description}
                  onChange={(e) => onInputChange('description', e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#475569] dark:text-gray-200 resize-none`}
                  placeholder="Enter detailed job description"
                  required
                />
                {errors.description && (
                  <AlertCircle className="absolute right-3 top-3 text-red-400" size={20} />
                )}
              </div>
              {errors.description && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => onInputChange('department', e.target.value)}
                    className={`w-full px-4 py-3 border ${errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#475569] dark:text-gray-200`}
                    placeholder="e.g., Engineering, Marketing"
                    required
                  />
                  {errors.department && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" size={20} />
                  )}
                </div>
                {errors.department && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.department}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => onInputChange('location', e.target.value)}
                    className={`w-full px-4 py-3 border ${errors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#475569] dark:text-gray-200`}
                    placeholder="e.g., New York, NY or Remote"
                    required
                  />
                  {errors.location && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" size={20} />
                  )}
                </div>
                {errors.location && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} />
                    {errors.location}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Application Deadline *
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.lastDate}
                  onChange={(e) => onInputChange('lastDate', e.target.value)}
                  className={`w-full px-4 py-3 border ${errors.lastDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#475569] dark:text-gray-200`}
                  required
                />
                {errors.lastDate && (
                  <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" size={20} />
                )}
              </div>
              {errors.lastDate && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {errors.lastDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Requirements *
              </label>
              <div className="relative">
                <textarea
                  value={formData.requirements}
                  onChange={(e) => onInputChange('requirements', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 border ${errors.requirements ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#475569] dark:text-gray-200 resize-none`}
                  placeholder="Enter job requirements and qualifications"
                  required
                />
                {errors.requirements && (
                  <AlertCircle className="absolute right-3 top-3 text-red-400" size={20} />
                )}
              </div>
              {errors.requirements && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {errors.requirements}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Status
              </label>
              <button
                type="button"
                onClick={() => onInputChange('isActive', !formData.isActive)}
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
                onClick={onSave}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium"
              >
                {isEdit ? 'Update Job' : 'Create Job'}
              </button>
              <button
                onClick={onCancel}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const AdminJobManager = () => {
  const [jobs, setJobs] = useState([]);
  const [currentView, setCurrentView] = useState('list'); // 'list', 'add', 'edit'
  const [editingJobId, setEditingJobId] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    location: '',
    lastDate: '',
    requirements: '',
    isActive: true
  });

  // Initialize with sample data if no jobs exist
  useEffect(() => {
    if (jobs.length === 0) {
      const sampleJobs = [
        {
          id: 1,
          title: "Junior Engineer - Public Works",
          description: "The Municipal Corporation invites applications for the position of Junior Engineer in Public Works Department. The candidate will be responsible for planning, designing, and supervising municipal infrastructure projects including roads, drainage systems, and public utilities. This role involves field inspections, project monitoring, and ensuring compliance with municipal standards and regulations.",
          department: "Public Works",
          location: "Coimbatore Municipal Corporation",
          lastDate: "2025-08-15",
          requirements: "Bachelor's degree in Civil Engineering. 2+ years experience in municipal infrastructure projects. Knowledge of municipal building codes and regulations. Valid professional engineering license preferred.",
          isActive: true
        },
        {
          id: 2,
          title: "Health Inspector",
          description: "The Municipal Corporation seeks a qualified Health Inspector to ensure public health and safety standards within the municipal limits. Responsibilities include conducting health inspections of food establishments, monitoring sanitation standards, investigating health complaints, and enforcing municipal health regulations. The role requires regular field visits and community interaction.",
          department: "Health Department",
          location: "Coimbatore Municipal Corporation",
          lastDate: "2025-08-20",
          requirements: "Bachelor's degree in Public Health, Environmental Health, or related field. 3+ years experience in health inspection or environmental health. Knowledge of municipal health codes and food safety regulations. Valid health inspector certification required.",
          isActive: true
        },
        {
          id: 3,
          title: "Assistant Town Planner",
          description: "The Municipal Corporation invites applications for Assistant Town Planner position in the Urban Planning Department. The candidate will assist in preparing development plans, reviewing building permit applications, conducting site surveys, and ensuring compliance with zoning regulations. This position involves working closely with citizens, developers, and other municipal departments.",
          department: "Urban Planning",
          location: "Coimbatore Municipal Corporation",
          lastDate: "2025-07-30",
          requirements: "Master's degree in Urban Planning, Architecture, or Civil Engineering. 2+ years experience in municipal planning or related field. Knowledge of urban planning software and GIS applications. Understanding of municipal planning laws and regulations.",
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

  // Form validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.lastDate) newErrors.lastDate = 'Application deadline is required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';

    // Date validation - must be future date
    if (formData.lastDate) {
      const selectedDate = new Date(formData.lastDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.lastDate = 'Deadline must be a future date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Stable navigate function
  const navigate = useCallback((path) => {
    if (path === '/admin/job-applications/add') {
      setCurrentView('add');
      setEditingJobId(null);
      setErrors({});
      setFormData({
        title: '',
        description: '',
        department: '',
        location: '',
        lastDate: '',
        requirements: '',
        isActive: true
      });
    } else if (path.includes('/admin/job-applications/edit/')) {
      const id = parseInt(path.split('/').pop());
      const jobToEdit = jobs.find(job => job.id === id);
      if (jobToEdit) {
        setCurrentView('edit');
        setEditingJobId(id);
        setErrors({});
        setFormData({
          title: jobToEdit.title,
          description: jobToEdit.description,
          department: jobToEdit.department,
          location: jobToEdit.location,
          lastDate: jobToEdit.lastDate,
          requirements: jobToEdit.requirements || '',
          isActive: jobToEdit.isActive
        });
      }
    } else if (path === '/admin/job-applications') {
      setCurrentView('list');
      setEditingJobId(null);
      setErrors({});
      setFormData({
        title: '',
        description: '',
        department: '',
        location: '',
        lastDate: '',
        requirements: '',
        isActive: true
      });
    }
  }, [jobs]);

  const toggleJobStatus = useCallback((id) => {
    setJobs(prevJobs => {
      const updatedJobs = prevJobs.map(job =>
        job.id === id ? { ...job, isActive: !job.isActive } : job
      );
      return sortJobs(updatedJobs);
    });
  }, []);

  const handleEdit = useCallback((id) => {
    navigate(`/admin/job-applications/edit/${id}`);
  }, [navigate]);

  // Stable input change handler with error clearing
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  const handleSaveJob = useCallback(() => {
    // Validate form before saving
    if (!validateForm()) {
      return;
    }

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
    navigate('/admin/job-applications');
  }, [currentView, formData, jobs, editingJobId, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/admin/job-applications');
  }, [navigate]);

  // Render based on current view
  if (currentView === 'add') {
    return (
      <JobForm 
        isEdit={false}
        formData={formData}
        onInputChange={handleInputChange}
        onSave={handleSaveJob}
        onCancel={handleCancel}
        errors={errors}
      />
    );
  }

  if (currentView === 'edit') {
    return (
      <JobForm 
        isEdit={true}
        formData={formData}
        onInputChange={handleInputChange}
        onSave={handleSaveJob}
        onCancel={handleCancel}
        errors={errors}
      />
    );
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
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-lg"
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium inline-flex items-center gap-2"
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
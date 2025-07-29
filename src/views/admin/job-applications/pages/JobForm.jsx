import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { Briefcase, Building2, MapPin, Calendar } from 'lucide-react';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    department: '',
    location: '',
    lastDate: '',
    requirements: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  // Load jobs from localStorage
  useEffect(() => {
    const savedJobs = localStorage.getItem('jobs');
    if (savedJobs) {
      try {
        const parsedJobs = JSON.parse(savedJobs);
        setJobs(parsedJobs);
        
        if (id) {
          const jobToEdit = parsedJobs.find(job => job.id === id);
          if (jobToEdit) {
            setFormData(jobToEdit);
          } else {
            navigate('/admin/job-applications', { replace: true });
          }
        }
      } catch (error) {
        console.error('Failed to parse jobs', error);
        setJobs([]);
      }
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleActiveStatus = () => {
    setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.lastDate) newErrors.lastDate = 'Application deadline is required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setJobs(prevJobs => {
      let updatedJobs;
      if (id) {
        updatedJobs = prevJobs.map(job => 
          job.id === id ? formData : job
        );
      } else {
        const newJob = { ...formData, id: Date.now().toString() };
        updatedJobs = [...prevJobs, newJob];
      }
      
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      return updatedJobs;
    });

    navigate('/admin/job-applications');
  };

  const handleCancel = () => {
    navigate('/admin/job-applications');
  };

  return (
    <div className="bg-gray-50 dark:bg-navy-900 p-4 rounded-xl mb-6 min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-[#334155] border-b border-gray-200 dark:border-[#475569]">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Jobs
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                {id ? 'Edit Job' : 'Create New Job'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in all the job details below</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#334155] rounded-2xl border border-gray-200 dark:border-[#475569] p-8">
          {/* Status Toggle */}
          <div className="mb-8">
            <label className="block text-gray-900 dark:text-gray-200 font-semibold mb-3">
              Job Status
            </label>
            <button
              type="button"
              onClick={toggleActiveStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${formData.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}
            >
              {formData.isActive ? (
                <ToggleRight className="text-green-600 dark:text-green-400" size={20} />
              ) : (
                <ToggleLeft className="text-gray-500 dark:text-gray-400" size={20} />
              )}
              <span>{formData.isActive ? 'Active' : 'Inactive'}</span>
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {formData.isActive ? 'This job will be visible to applicants' : 'This job will be hidden from applicants'}
            </p>
          </div>

          {/* Job Title */}
          <div className="mb-8">
            <label className="block text-gray-900 dark:text-gray-200 font-semibold mb-3">
              Job Title <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Briefcase className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${errors.title ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`} size={20} />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter job title"
                className={`w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border-2 ${errors.title ? 'border-red-500' : 'border-transparent'} rounded-xl text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#22c55e] transition-all`}
              />
              {errors.title && (
                <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400" size={20} />
              )}
            </div>
            {errors.title && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                <AlertCircle size={16} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-gray-900 dark:text-gray-200 font-semibold mb-3">
              Description <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter job description"
                rows={5}
                className={`w-full px-4 py-4 bg-white dark:bg-gray-800 border-2 ${errors.description ? 'border-red-500' : 'border-transparent'} rounded-xl text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#22c55e] transition-all resize-none`}
              />
              {errors.description && (
                <AlertCircle className="absolute right-4 top-4 text-red-400" size={20} />
              )}
            </div>
            {errors.description && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                <AlertCircle size={16} />
                {errors.description}
              </p>
            )}
          </div>

          {/* Department and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-gray-900 dark:text-gray-200 font-semibold mb-3">
                Department <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building2 className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${errors.department ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`} size={20} />
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                  className={`w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border-2 ${errors.department ? 'border-red-500' : 'border-transparent'} rounded-xl text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#22c55e] transition-all`}
                />
                {errors.department && (
                  <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400" size={20} />
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
              <label className="block text-gray-900 dark:text-gray-200 font-semibold mb-3">
                Location <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <MapPin className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${errors.location ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`} size={20} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  className={`w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border-2 ${errors.location ? 'border-red-500' : 'border-transparent'} rounded-xl text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#22c55e] transition-all`}
                />
                {errors.location && (
                  <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400" size={20} />
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

          {/* Application Deadline */}
          <div className="mb-8">
            <label className="block text-gray-900 dark:text-gray-200 font-semibold mb-3">
              Application Deadline <span className="text-red-400">*</span>
            </label>
            <div className="relative max-w-md">
              <Calendar className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${errors.lastDate ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`} size={20} />
              <input
                type="date"
                name="lastDate"
                value={formData.lastDate}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border-2 ${errors.lastDate ? 'border-red-500' : 'border-transparent'} rounded-xl text-gray-900 dark:text-gray-200 focus:outline-none focus:border-[#22c55e] transition-all`}
              />
              {errors.lastDate && (
                <AlertCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400" size={20} />
              )}
            </div>
            {errors.lastDate && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                <AlertCircle size={16} />
                {errors.lastDate}
              </p>
            )}
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <label className="block text-gray-900 dark:text-gray-200 font-semibold mb-3">
              Requirements <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Enter job requirements and qualifications"
                rows={5}
                className={`w-full px-4 py-4 bg-white dark:bg-gray-800 border-2 ${errors.requirements ? 'border-red-500' : 'border-transparent'} rounded-xl text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#22c55e] transition-all resize-none`}
              />
              {errors.requirements && (
                <AlertCircle className="absolute right-4 top-4 text-red-400" size={20} />
              )}
            </div>
            {errors.requirements && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                <AlertCircle size={16} />
                {errors.requirements}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-10 pt-8 border-t border-gray-200 dark:border-[#475569]">
            <button
              type="submit"
              className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white py-4 px-6 rounded-xl transition-all duration-200 font-semibold text-lg flex items-center justify-center gap-2 max-w-sm"
            >
              <CheckCircle size={20} />
              {id ? 'Update Job' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-4 bg-gray-200 dark:bg-[#475569] hover:bg-gray-300 dark:hover:bg-[#64748b] text-gray-900 dark:text-gray-200 rounded-xl transition-all duration-200 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
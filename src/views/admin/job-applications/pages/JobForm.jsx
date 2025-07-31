import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, ToggleLeft, ToggleRight, Briefcase, Building2, MapPin, Calendar } from 'lucide-react';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '', title: '', description: '', department: '', location: '', lastDate: '', requirements: '', isActive: true
  });
  const [errors, setErrors] = useState({});

  // Load jobs from localStorage and find the job to edit if an ID is present
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    if (id) {
      const jobToEdit = savedJobs.find(job => job.id.toString() === id.toString());
      if (jobToEdit) {
        setFormData(jobToEdit);
      } else {
        navigate('/admin/job-applications', { replace: true });
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
    if (formData.lastDate && new Date(formData.lastDate) < new Date()) {
      newErrors.lastDate = 'Deadline must be a future date';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const currentJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    let updatedJobs;
    if (id) {
      updatedJobs = currentJobs.map(job => job.id.toString() === id.toString() ? formData : job);
    } else {
      const newId = currentJobs.length > 0 ? Math.max(...currentJobs.map(j => parseInt(j.id) || 0)) + 1 : 1;
      updatedJobs = [...currentJobs, { ...formData, id: newId.toString() }];
    }
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    navigate('/admin/job-applications');
  };

  const handleCancel = () => {
    navigate('/admin/job-applications');
  };

  return (
    <div className="bg-gray-50 dark:bg-navy-900 min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={handleCancel} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
          {id ? 'Edit Job Posting' : 'Create New Job Posting'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details to post a job opportunity.</p>
      </div>

      {/* Form Card */}
      <div className="max-w-6xl mx-auto py-8">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-8 shadow-md">
          {/* Status Toggle */}
          <div className="mb-8">
            <label className="block text-gray-900 dark:text-gray-200 font-semibold mb-3">Job Status</label>
            <button type="button" onClick={toggleActiveStatus} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${formData.isActive ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-300'}`}>
              {formData.isActive ? <ToggleRight className="text-green-500" size={20} /> : <ToggleLeft className="text-gray-500" size={20} />}
              <span>{formData.isActive ? 'Active' : 'Inactive'}</span>
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{formData.isActive ? 'This job will be visible to applicants.' : 'This job will be hidden from applicants.'}</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title <span className="text-red-500">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Junior Engineer" className={`w-full p-3 bg-gray-100 dark:bg-slate-700 border-2 ${errors.title ? 'border-red-500' : 'border-transparent'} rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500`} />
              {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description <span className="text-red-500">*</span></label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Detailed description of the job role..." className={`w-full p-3 bg-gray-100 dark:bg-slate-700 border-2 ${errors.description ? 'border-red-500' : 'border-transparent'} rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 resize-none`} />
              {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Department & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department <span className="text-red-500">*</span></label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g., Public Works" className={`w-full p-3 bg-gray-100 dark:bg-slate-700 border-2 ${errors.department ? 'border-red-500' : 'border-transparent'} rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500`} />
                {errors.department && <p className="mt-2 text-sm text-red-500">{errors.department}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location <span className="text-red-500">*</span></label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Coimbatore" className={`w-full p-3 bg-gray-100 dark:bg-slate-700 border-2 ${errors.location ? 'border-red-500' : 'border-transparent'} rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500`} />
                {errors.location && <p className="mt-2 text-sm text-red-500">{errors.location}</p>}
              </div>
            </div>

            {/* Application Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Application Deadline <span className="text-red-500">*</span></label>
              <input type="date" name="lastDate" value={formData.lastDate} onChange={handleChange} className={`w-full md:max-w-xs p-3 bg-gray-100 dark:bg-slate-700 border-2 ${errors.lastDate ? 'border-red-500' : 'border-transparent'} rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500`} />
              {errors.lastDate && <p className="mt-2 text-sm text-red-500">{errors.lastDate}</p>}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Requirements <span className="text-red-500">*</span></label>
              <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={4} placeholder="List the qualifications, skills, and experience required..." className={`w-full p-3 bg-gray-100 dark:bg-slate-700 border-2 ${errors.requirements ? 'border-red-500' : 'border-transparent'} rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 resize-none`} />
              {errors.requirements && <p className="mt-2 text-sm text-red-500">{errors.requirements}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2">
              <CheckCircle size={20} />
              {id ? 'Update Job' : 'Post Job'}
            </button>
            <button type="button" onClick={handleCancel} className="py-3 px-6 bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 text-gray-900 dark:text-gray-200 rounded-lg transition-colors font-semibold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;





















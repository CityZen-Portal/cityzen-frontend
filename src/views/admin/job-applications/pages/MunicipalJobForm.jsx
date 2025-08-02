import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Building2, Save, X, Plus, Trash2, MapPin, Calendar,
  User, Phone, Mail, FileText, AlertCircle, CheckCircle,
  ArrowLeft
} from 'lucide-react';

const MunicipalJobForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [showSuccess, setShowSuccess] = useState(false);

  // Municipal Job Form State
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    location: '',
    requirements: [],
    lastDate: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: ''
  });
  const [newRequirement, setNewRequirement] = useState('');
  const [errors, setErrors] = useState({});

  // Load job data for editing
  useEffect(() => {
    if (isEditMode && id) {
      const savedJobs = localStorage.getItem('jobs');
      if (savedJobs) {
        try {
          const jobs = JSON.parse(savedJobs);
          const jobToEdit = jobs.find(job => job.id.toString() === id.toString() && job.jobType === 'municipal');
          if (jobToEdit) {
            setFormData({
              title: jobToEdit.title || '',
              department: jobToEdit.department || '',
              description: jobToEdit.description || '',
              location: jobToEdit.location || '',
              requirements: jobToEdit.requirements ? jobToEdit.requirements.split('; ').filter(req => req.trim()) : [],
              lastDate: jobToEdit.lastDate || '',
              contactName: jobToEdit.contactName || '',
              contactPhone: jobToEdit.contactPhone || '',
              contactEmail: jobToEdit.contactEmail || '',
              contactAddress: jobToEdit.contactAddress || ''
            });
          }
        } catch (error) {
          console.error('Failed to load job data', error);
        }
      }
    }
  }, [isEditMode, id]);

  // Handle form field changes - Fixed to prevent cursor jumping
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Add requirement
  const addRequirement = useCallback(() => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
      if (errors.requirements) {
        setErrors(prev => ({ ...prev, requirements: '' }));
      }
      toast.success('Requirement added successfully!');
    } else if (formData.requirements.includes(newRequirement.trim())) {
      toast.warning('This requirement already exists!');
    }
  }, [newRequirement, formData.requirements, errors.requirements]);

  // Remove requirement
  const removeRequirement = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
    toast.info('Requirement removed');
  }, []);

  // Handle requirement key press
  const handleRequirementKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRequirement();
    }
  }, [addRequirement]);

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.requirements.length === 0) newErrors.requirements = 'At least one requirement is needed';
    if (!formData.lastDate) newErrors.lastDate = 'Application deadline is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!formData.contactAddress.trim()) newErrors.contactAddress = 'Contact address is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail.trim() && !emailRegex.test(formData.contactEmail.trim())) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (formData.contactPhone.trim() && !phoneRegex.test(formData.contactPhone.trim())) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }
    
    return newErrors;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Prepare job data
      const jobData = {
        ...formData,
        jobType: 'municipal',
        requirements: formData.requirements.join('; '),
        department: formData.department || 'General'
      };

      // Get existing jobs
      const savedJobs = localStorage.getItem('jobs');
      let jobs = [];
      if (savedJobs) {
        try {
          jobs = JSON.parse(savedJobs);
        } catch (error) {
          console.error('Failed to parse jobs', error);
        }
      }

      if (isEditMode && id) {
        // Update existing job
        const updatedJobs = jobs.map(job => 
          job.id.toString() === id.toString() ? { ...jobData, id: id, isActive: job.isActive } : job
        );
        localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      } else {
        // Add new job
        const newJob = {
          id: Date.now().toString(),
          ...jobData,
          isActive: true
        };
        jobs.push(newJob);
        localStorage.setItem('jobs', JSON.stringify(jobs));
      }

      // Show success message
      setShowSuccess(true);
      toast.success(`Municipal job ${isEditMode ? 'updated' : 'posted'} successfully!`);
      
      // Navigate back after delay
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/admin/job-applications');
      }, 2000);
    } else {
      setErrors(newErrors);
      const errorCount = Object.keys(newErrors).length;
      toast.error(`Please fix ${errorCount} validation error${errorCount > 1 ? 's' : ''} before submitting.`);
    }
  }, [validateForm, formData, isEditMode, id, navigate]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/admin/job-applications');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray dark:bg-navy">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Success!</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Municipal job has been {isEditMode ? 'updated' : 'posted'} successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-navy-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ArrowLeft className="text-gray-600 dark:text-gray-400" size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit' : 'Create'} Municipal Job
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isEditMode ? 'Update the government position' : 'Post a new government position'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Building2 className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Senior Civil Engineer"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.title && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {errors.title}
                  </div>
                )}
              </div>
              
              {/* Department */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="e.g., Public Works Department"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.department ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.department && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {errors.department}
                  </div>
                )}
              </div>
            </div>
            
            {/* Job Description */}
            <div className="mt-6 space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Provide a detailed description of the job responsibilities and duties..."
                rows={4}
                className={`w-full px-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
              {errors.description && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {errors.description}
                </div>
              )}
            </div>
          </div>

          {/* Location & Timeline */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <MapPin className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Location & Timeline</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Work Location */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Work Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Coimbatore Municipal Corporation HQ"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.location ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.location && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {errors.location}
                  </div>
                )}
              </div>
              
              {/* Application Deadline */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Application Deadline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={formData.lastDate}
                    onChange={(e) => handleInputChange('lastDate', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.lastDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.lastDate && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {errors.lastDate}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <FileText className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Requirements</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Job Requirements <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={handleRequirementKeyPress}
                    placeholder="Enter a job requirement..."
                    className={`flex-1 px-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.requirements ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
                {errors.requirements && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {errors.requirements}
                  </div>
                )}
              </div>

              {/* Requirements List */}
              {formData.requirements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Added Requirements ({formData.requirements.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.requirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                          {req}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <User className="text-orange-600 dark:text-orange-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Person Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contact Person Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    placeholder="e.g., John Smith"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.contactName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.contactName && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {errors.contactName}
                  </div>
                )}
              </div>
              
              {/* Contact Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="e.g., +91 98765 43210"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.contactPhone ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.contactPhone && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {errors.contactPhone}
                  </div>
                )}
              </div>
              
              {/* Contact Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="e.g., hr@municipality.gov.in"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.contactEmail ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.contactEmail && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {errors.contactEmail}
                  </div>
                )}
              </div>
            </div>
            
            {/* Contact Address */}
            <div className="mt-6 space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Contact Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.contactAddress}
                onChange={(e) => handleInputChange('contactAddress', e.target.value)}
                placeholder="Complete address of the contact office..."
                rows={4}
                className={`w-full px-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
                  errors.contactAddress ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
              {errors.contactAddress && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {errors.contactAddress}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons - Smaller and Equal Sizes */}
        <div className="flex gap-4 mt-8 max-w-md mx-auto">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 text-sm shadow-lg"
          >
            <Save size={18} />
            {isEditMode ? 'Update' : 'Create'} Job
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200 py-3 px-4 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 text-sm"
          >
            <X size={18} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MunicipalJobForm;

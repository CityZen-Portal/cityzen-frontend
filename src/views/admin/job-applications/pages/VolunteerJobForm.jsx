import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Heart, Save, X, MapPin, Calendar,
  User, Phone, Mail, AlertCircle, CheckCircle,
  ArrowLeft, Clock, Users
} from 'lucide-react';

const VolunteerJobForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [showSuccess, setShowSuccess] = useState(false);

  // Volunteer Job Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    workDate: '',
    workTime: '',
    duration: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: ''
  });
  const [errors, setErrors] = useState({});

  // Load job data for editing
  useEffect(() => {
    if (isEditMode && id) {
      const savedJobs = localStorage.getItem('jobs');
      if (savedJobs) {
        try {
          const jobs = JSON.parse(savedJobs);
          const jobToEdit = jobs.find(job => job.id.toString() === id.toString() && job.jobType === 'volunteer');
          if (jobToEdit) {
            setFormData({
              title: jobToEdit.title || '',
              description: jobToEdit.description || '',
              location: jobToEdit.location || '',
              workDate: jobToEdit.workDate || '',
              workTime: jobToEdit.workTime || '',
              duration: jobToEdit.duration || '',
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

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Program title is required';
    if (!formData.description.trim()) newErrors.description = 'Program description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.workDate) newErrors.workDate = 'Program date is required';
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
        jobType: 'volunteer',
        department: 'Community Service',
        requirements: 'Community service mindset and willingness to help'
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
      toast.success(`Volunteer opportunity ${isEditMode ? 'updated' : 'posted'} successfully!`);
      
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
                Volunteer opportunity has been {isEditMode ? 'updated' : 'posted'} successfully.
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
                {isEditMode ? 'Edit' : 'Create'} Volunteer Program
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isEditMode ? 'Update the community service opportunity' : 'Create a community service opportunity'}
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
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <Heart className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Program Information</h2>
            </div>
            
            <div className="space-y-6">
              {/* Program Title */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Program Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Community Garden Volunteer"
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
              
              {/* Program Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Program Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the volunteer opportunity and what participants will be doing..."
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
          </div>

          {/* Schedule & Location */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Schedule & Location</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Ward 8, Gandhipuram"
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
              
              {/* Program Date */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Program Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={formData.workDate}
                    onChange={(e) => handleInputChange('workDate', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.workDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.workDate && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {errors.workDate}
                  </div>
                )}
              </div>
              
              {/* Time Schedule */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Time Schedule
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.workTime}
                    onChange={(e) => handleInputChange('workTime', e.target.value)}
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.workTime ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.workTime && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {errors.workTime}
                  </div>
                )}
              </div>
              
              {/* Duration */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Duration
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 1 week, ongoing"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.duration ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.duration && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    {errors.duration}
                  </div>
                )}
              </div>
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
                    placeholder="e.g., Sarah Johnson"
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
                    placeholder="e.g., +91 98765 43211"
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
                    placeholder="e.g., volunteer@municipality.gov.in"
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
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 text-sm shadow-lg"
          >
            <Save size={18} />
            {isEditMode ? 'Update' : 'Create'} Program
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

export default VolunteerJobForm;

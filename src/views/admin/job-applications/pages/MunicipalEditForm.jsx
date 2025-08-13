import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  MdFavorite as Heart,
  MdSave as Save,
  MdClose as X,
  MdLocationOn as MapPin,
  MdCalendarToday as Calendar,
  MdPerson as User,
  MdPhone as Phone,
  MdEmail as Mail,
  MdErrorOutline as AlertCircle,
  MdCheckCircle as CheckCircle,
  MdArrowBack as ArrowLeft,
  MdAccessTime as Clock,
  MdGroup as Users,
  MdCheckCircle,
  MdArrowBack,
  MdFavorite,
  MdErrorOutline,
  MdCalendarToday,
  MdLocationOn,
  MdAccessTime,
  MdPerson,
  MdPhone,
  MdEmail,
  MdSave,
  MdClose,
  MdDelete,
  MdAdd,
  MdDescription,
  MdBusiness
} from 'react-icons/md';
import loading_gif from '../../../../assets/gif/loading-gif.gif'

import axios from 'axios';

const MunicipalEditForm = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const citizenId = localStorage.getItem("id")

  const { id } = useParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Municipal Job Form State
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    description: '',
    location: '',
    requirements: [],
    deadline: '',
    contactPersonName: '',
    contactPhoneNumber: '',
    contactEmail: '',
    contactAddress: ''
  });
  const [newRequirement, setNewRequirement] = useState('');
  const [errors, setErrors] = useState({});

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  const isValidDeadline = (dateStr) => {
    const selectedDate = new Date(dateStr);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    return selectedDate >= minDate;
  };

  const JOB_APPLICATION_API = process.env.REACT_APP_API_JOB_APPLICATION_URL;

  // Fetch Job Post Details
  useEffect(() => {
    setLoading(true);
  
    axios.get(`${JOB_APPLICATION_API}/jobs/${id}`,
      {
        headers:{
          token,
          email,
          id: citizenId
        }
      }
    )
      .then(res => {
          console.log('Response:', res.data.data);
          const data = res.data.data
          if(data){
            setFormData({
              ...data,
              deadline: formatDateForInput(data.deadline)
            })
          }
        })
        .catch(err => {
          toast.error(err.response?.data?.message || 'Server Error!Unable to Fetch Job Posts Data', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored'
          });
          console.error('Error:', err.response?.data || err.message);
        })
        .finally(() => {
          setLoading(false);
        });
        console.error('Error:', err.response?.data || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
        
  }, [token, email, citizenId, JOB_APPLICATION_API, id])

  // Handle form field changes
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
    } else if (formData.requirements.includes(newRequirement.trim())) {
      // Removed toast.warning for duplicate requirement
    }
  }, [newRequirement, formData.requirements, errors.requirements]);

  // Remove requirement
  const removeRequirement = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  }, []);

  // Handle requirement key press
  const handleRequirementKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRequirement();
    }
  }, [addRequirement]);

  // Enhanced Validate form with additional validation rules
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Job title must be at least 3 characters long';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Job title must not exceed 100 characters';
    }
    
    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    } else if (formData.department.trim().length < 3) {
      newErrors.department = 'Department must be at least 3 characters long';
    } else if (formData.department.trim().length > 100) {
      newErrors.department = 'Department must not exceed 100 characters';
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Job description must be at least 20 characters long';
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = 'Job description must not exceed 2000 characters';
    }
    
    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 3) {
      newErrors.location = 'Location must be at least 3 characters long';
    } else if (formData.location.trim().length > 200) {
      newErrors.location = 'Location must not exceed 200 characters';
    }
    
    // Requirements validation
    if (formData.requirements.length === 0) {
      newErrors.requirements = 'At least one requirement is needed';
    } else if (formData.requirements.some(req => req.trim().length < 5)) {
      newErrors.requirements = 'Each requirement must be at least 5 characters long';
    }
    
    // Deadline validation
    if (!formData.deadline) {
      newErrors.deadline = 'Application deadline is required';
    } else if (!isValidDeadline(formData.deadline)) {
      newErrors.deadline = 'Application deadline must be at least 3 days from today';
    }
    
    // Contact Person Name validation
    if (!formData.contactPersonName.trim()) {
      newErrors.contactPersonName = 'Contact name is required';
    } else if (formData.contactPersonName.trim().length < 2) {
      newErrors.contactPersonName = 'Contact name must be at least 2 characters long';
    } else if (formData.contactPersonName.trim().length > 100) {
      newErrors.contactPersonName = 'Contact name must not exceed 100 characters';
    } else if (!/^[a-zA-Z\s.]+$/.test(formData.contactPersonName.trim())) {
      newErrors.contactPersonName = 'Contact name can only contain letters, spaces, and periods';
    }
    
    // Contact Phone validation
    if (!formData.contactPhoneNumber.trim()) {
      newErrors.contactPhoneNumber = 'Contact phone is required';
    } else {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(formData.contactPhoneNumber.trim())) {
        newErrors.contactPhoneNumber = 'Please enter a valid phone number (minimum 10 digits)';
      } else if (formData.contactPhoneNumber.trim().replace(/[^\d]/g, '').length < 10) {
        newErrors.contactPhoneNumber = 'Phone number must contain at least 10 digits';
      }
    }
    
    // Contact Email validation
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contactEmail.trim())) {
        newErrors.contactEmail = 'Please enter a valid email address';
      } else if (formData.contactEmail.trim().length > 254) {
        newErrors.contactEmail = 'Email address must not exceed 254 characters';
      }
    }
    
    // Contact Address validation
    if (!formData.contactAddress.trim()) {
      newErrors.contactAddress = 'Contact address is required';
    } else if (formData.contactAddress.trim().length < 10) {
      newErrors.contactAddress = 'Contact address must be at least 10 characters long';
    } else if (formData.contactAddress.trim().length > 500) {
      newErrors.contactAddress = 'Contact address must not exceed 500 characters';
    }
    
    // Date validation - ensure date is in the future
    if (formData.deadline) {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.deadline = 'Application deadline must be in the future';
      }
    }
    
    return newErrors;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    setLoading(true)
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // Show specific error messages for each field
      Object.entries(newErrors).forEach(([field, message]) => {
        toast.error(message, {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored'
        });
      });
      return;
    }

    const putData = {
      ...formData,
      deadline: new Date(formData.deadline)
    }
  
    axios.put(`${JOB_APPLICATION_API}/jobs/${id}`, putData,
      {
        headers:{
          token,
          email,
          id: citizenId
        }
      }
    )
    .then(res => {
      console.log('Response:', res.data);
      toast.success('Municipal Job updated successfully!', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'colored',
        onClose: () => navigate('/admin/job-application')
      });
    })
    .catch(err => {
      console.error('Error:', err?.response?.data || err?.message);
      toast.error(err.response?.data?.message || 'Server Error!Unable to Submit Post', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored'
      });
      return;
    })

  }, [validateForm, formData, id, navigate, JOB_APPLICATION_API, token, email, citizenId]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/admin/job-application');
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading job data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm h-full">
          <img
            src={loading_gif}
            alt="Loading..."
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
        </div>
      )}
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
          <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdCheckCircle className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Success!</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Municipal job has been updated successfully.
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
              <MdArrowBack className="text-gray-600 dark:text-gray-400" size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Edit Municipal Job
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Update the government position details
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
                <MdBusiness className="text-blue-600 dark:text-blue-400" size={20} />
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
                  <MdBusiness className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
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
                    <MdErrorOutline size={16} />
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
                  <MdBusiness className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
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
                    <MdErrorOutline size={16} />
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
                  <MdErrorOutline size={16} />
                  {errors.description}
                </div>
              )}
            </div>
          </div>

          {/* Location & Timeline */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <MdLocationOn className="text-blue-600 dark:text-blue-400" size={20} />
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
                  <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
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
                    <MdErrorOutline size={16} />
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
                  <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.deadline ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.deadline && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <MdErrorOutline size={16} />
                    {errors.deadline}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <MdDescription className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Job Requirements</h2>
            </div>
            
            {/* Add Requirement */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={handleRequirementKeyPress}
                    placeholder="e.g., Bachelor's degree in Civil Engineering"
                    className="w-full px-4 py-3 bg-white dark:bg-navy-800 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={addRequirement}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-2"
                >
                  <MdAdd size={20} />
                  Add
                </button>
              </div>
              
              {/* Requirements List */}
              {formData.requirements.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Added Requirements:
                  </h3>
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="flex-1 text-gray-700 dark:text-gray-300">{requirement}</span>
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {errors.requirements && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <MdErrorOutline size={16} />
                  {errors.requirements}
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <MdPerson className="text-blue-600 dark:text-blue-400" size={20} />
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
                  <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
                  <input
                    type="text"
                    value={formData.contactPersonName}
                    onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                    placeholder="e.g., Dr. Rajesh Kumar"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.contactPersonName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.contactPersonName && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <MdErrorOutline size={16} />
                    {errors.contactPersonName}
                  </div>
                )}
              </div>
              
              {/* Contact Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
                  <input
                    type="tel"
                    value={formData.contactPhoneNumber}
                    onChange={(e) => handleInputChange('contactPhoneNumber', e.target.value)}
                    placeholder="e.g., +91 98765 43210"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.contactPhoneNumber ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.contactPhoneNumber && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <MdErrorOutline size={16} />
                    {errors.contactPhoneNumber}
                  </div>
                )}
              </div>
              
              {/* Contact Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="e.g., rajesh.kumar@coimbatore.gov.in"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.contactEmail ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.contactEmail && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <MdErrorOutline size={16} />
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
                placeholder="e.g., Public Works Department, Coimbatore Municipal Corporation, Town Hall, Coimbatore - 641001"
                rows={3}
                className={`w-full px-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
                  errors.contactAddress ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
              {errors.contactAddress && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <MdErrorOutline size={16} />
                  {errors.contactAddress}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <MdClose size={20} />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center gap-2"
            >
              <MdSave size={20} />
              Update Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MunicipalEditForm;
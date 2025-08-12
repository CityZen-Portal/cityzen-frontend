import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MdDescription
} from 'react-icons/md';
import axios from 'axios';

const VolunteerJobForm = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const citizenId = localStorage.getItem("id");

  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    programTitle: '',
    programDescription: '',
    location: '',
    programDate: '',
    programTime: '',
    duration: '',
    coordinatorName: '',
    coordinatorPhone: '',
    coordinatorEmail: '',
    coordinatorAddress: '',
    requirements: []
  });
  const [newRequirement, setNewRequirement] = useState('');
  const [errors, setErrors] = useState({});

  const JOB_APPLICATION_API = process.env.REACT_APP_API_JOB_APPLICATION_URL;

  // Handle form field changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.programTitle.trim()) {
      newErrors.programTitle = 'Program title is required';
    } else if (formData.programTitle.trim().length < 3) {
      newErrors.programTitle = 'Program title must be at least 3 characters long';
    } else if (formData.programTitle.trim().length > 100) {
      newErrors.programTitle = 'Program title must not exceed 100 characters';
    }

    if (!formData.programDescription.trim()) {
      newErrors.programDescription = 'Program description is required';
    } else if (formData.programDescription.trim().length < 20) {
      newErrors.programDescription = 'Program description must be at least 20 characters long';
    } else if (formData.programDescription.trim().length > 2000) {
      newErrors.programDescription = 'Program description must not exceed 2000 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 3) {
      newErrors.location = 'Location must be at least 3 characters long';
    } else if (formData.location.trim().length > 200) {
      newErrors.location = 'Location must not exceed 200 characters';
    }

    if (!formData.programDate) {
      newErrors.programDate = 'Program date is required';
    } else {
      const selectedDate = new Date(formData.programDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.programDate = 'Program date must be in the future';
      }
    }

    if (!formData.programTime.trim()) {
      newErrors.programTime = 'Program time is required';
    } else if (!/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/.test(formData.programTime.trim())) {
      newErrors.programTime = 'Please enter a valid time in HH:MM AM/PM format';
    }

    if (formData.duration.trim() && formData.duration.trim().length > 100) {
      newErrors.duration = 'Duration must not exceed 100 characters';
    }

    if (!formData.coordinatorName.trim()) {
      newErrors.coordinatorName = 'Coordinator name is required';
    } else if (formData.coordinatorName.trim().length < 2) {
      newErrors.coordinatorName = 'Coordinator name must be at least 2 characters long';
    } else if (formData.coordinatorName.trim().length > 100) {
      newErrors.coordinatorName = 'Coordinator name must not exceed 100 characters';
    } else if (!/^[a-zA-Z\s.]+$/.test(formData.coordinatorName.trim())) {
      newErrors.coordinatorName = 'Coordinator name can only contain letters, spaces, and periods';
    }

    if (!formData.coordinatorPhone.trim()) {
      newErrors.coordinatorPhone = 'Coordinator phone is required';
    } else {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(formData.coordinatorPhone.trim())) {
        newErrors.coordinatorPhone = 'Please enter a valid phone number (minimum 10 digits)';
      } else if (formData.coordinatorPhone.trim().replace(/[^\d]/g, '').length < 10) {
        newErrors.coordinatorPhone = 'Phone number must contain at least 10 digits';
      }
    }

    if (!formData.coordinatorEmail.trim()) {
      newErrors.coordinatorEmail = 'Coordinator email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.coordinatorEmail.trim())) {
        newErrors.coordinatorEmail = 'Please enter a valid email address';
      } else if (formData.coordinatorEmail.trim().length > 254) {
        newErrors.coordinatorEmail = 'Email address must not exceed 254 characters';
      }
    }

    if (!formData.coordinatorAddress.trim()) {
      newErrors.coordinatorAddress = 'Coordinator address is required';
    } else if (formData.coordinatorAddress.trim().length < 10) {
      newErrors.coordinatorAddress = 'Coordinator address must be at least 10 characters long';
    } else if (formData.coordinatorAddress.trim().length > 500) {
      newErrors.coordinatorAddress = 'Coordinator address must not exceed 500 characters';
    }

    if (formData.requirements.length === 0) {
      newErrors.requirements = 'At least one requirement is needed';
    } else if (formData.requirements.some(req => req.trim().length < 5)) {
      newErrors.requirements = 'Each requirement must be at least 5 characters long';
    }

    return newErrors;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const errorCount = Object.keys(newErrors).length;
      toast.error(`Please fix ${errorCount} validation error${errorCount > 1 ? 's' : ''} before submitting.`);
      return;
    }

    const postData = {
      ...formData,
      programTime: `${formData.programTime}:00`
    };

    axios.post(`${JOB_APPLICATION_API}/service`, postData, {
      headers: {
        token,
        email,
        id: citizenId
      }
    })
      .then(res => {
        console.log('Response:', res.data);
        toast.success('Volunteer Program posted successfully!', {
          position: 'top-right',
          autoClose: 1000,
          theme: 'colored',
          onClose: () => navigate('/admin/job-application')
        });
      })
      .catch(err => {
        console.error('Error:', err?.response?.data || err?.message);
        toast.error('Server Error! Unable to Submit Post', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored'
        });
      });
  }, [validateForm, formData, navigate, JOB_APPLICATION_API, token, email, citizenId]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/admin/job-application');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
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

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdCheckCircle className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Success!</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Volunteer opportunity has been posted successfully.
              </p>
            </div>
          </div>
        </div>
      )}

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
                Create Volunteer Program
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Post a new community service opportunity
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <MdDescription className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Program Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Program Title <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdDescription className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
                  <input
                    type="text"
                    value={formData.programTitle}
                    onChange={(e) => handleInputChange('programTitle', e.target.value)}
                    placeholder="e.g., Community Cleanup Drive"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.programTitle ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.programTitle && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <MdErrorOutline size={16} />
                    {errors.programTitle}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Duration
                </label>
                <div className="relative">
                  <MdAccessTime className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 4 hours"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.duration ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.duration && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <MdErrorOutline size={16} />
                    {errors.duration}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Program Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.programDescription}
                onChange={(e) => handleInputChange('programDescription', e.target.value)}
                placeholder="Provide a detailed description of the volunteer program..."
                rows={4}
                className={`w-full px-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
                  errors.programDescription ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
              {errors.programDescription && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <MdErrorOutline size={16} />
                  {errors.programDescription}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <MdLocationOn className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Location & Schedule</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Central Park, Coimbatore"
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

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Program Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
                  <input
                    type="date"
                    value={formData.programDate}
                    onChange={(e) => handleInputChange('programDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.programDate ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.programDate && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <MdErrorOutline size={16} />
                    {errors.programDate}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Program Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdAccessTime className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
                  <input
                    type="text"
                    value={formData.programTime}
                    onChange={(e) => handleInputChange('programTime', e.target.value)}
                    placeholder="e.g., 09:00 AM"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.programTime ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.programTime && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <MdErrorOutline size={16} />
                    {errors.programTime}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <MdDescription className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Requirements</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={handleRequirementKeyPress}
                    placeholder="e.g., Must be 18 or older"
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

          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <MdPerson className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Coordinator Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Coordinator Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
                  <input
                    type="text"
                    value={formData.coordinatorName}
                    onChange={(e) => handleInputChange('coordinatorName', e.target.value)}
                    placeholder="e.g., Dr. Priya Sharma"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.coordinatorName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.coordinatorName && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <MdErrorOutline size={16} />
                    {errors.coordinatorName}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Coordinator Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
                  <input
                    type="tel"
                    value={formData.coordinatorPhone}
                    onChange={(e) => handleInputChange('coordinatorPhone', e.target.value)}
                    placeholder="e.g., +91 98765 43210"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.coordinatorPhone ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.coordinatorPhone && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <MdErrorOutline size={16} />
                    {errors.coordinatorPhone}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Coordinator Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-white" size={20} />
                  <input
                    type="email"
                    value={formData.coordinatorEmail}
                    onChange={(e) => handleInputChange('coordinatorEmail', e.target.value)}
                    placeholder="e.g., priya.sharma@coimbatore.gov.in"
                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.coordinatorEmail ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                </div>
                {errors.coordinatorEmail && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <MdErrorOutline size={16} />
                    {errors.coordinatorEmail}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Coordinator Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.coordinatorAddress}
                onChange={(e) => handleInputChange('coordinatorAddress', e.target.value)}
                placeholder="e.g., Community Services Department, Coimbatore Municipal Corporation, Town Hall, Coimbatore - 641001"
                rows={3}
                className={`w-full px-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
                  errors.coordinatorAddress ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                }`}
              />
              {errors.coordinatorAddress && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <MdErrorOutline size={16} />
                  {errors.coordinatorAddress}
                </div>
              )}
            </div>
          </div>

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
              Post Program
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerJobForm;
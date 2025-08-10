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
  MdSave
} from 'react-icons/md';
import axios from 'axios';


const VolunteerEditForm = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const citizenId = localStorage.getItem("id")

  const { id } = useParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Volunteer Job Form State
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
    coordinatorAddress: ''
  });
  const [errors, setErrors] = useState({});


  const JOB_APPLICATION_API = process.env.REACT_APP_API_JOB_APPLICATION_URL;
  useEffect(() => {
    // setLoading(true);
  
    axios.get(`${JOB_APPLICATION_API}/service/${id}`,
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
            setFormData(data)
          }
        })
        .catch(err => {
          toast.error('Server Error!Unable to Fetch Job Posts Data', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored'
          });
          console.error('Error:', err.response?.data || err.message);
        })
        .finally(() => {
          setLoading(false);
        });
        
    // setLoading(true);

  }, [token, email, citizenId, JOB_APPLICATION_API, navigate])

  // Load job data for editing
  useEffect(() => {
    // if (id) {
    //   const savedJobs = localStorage.getItem('jobs');
    //   if (savedJobs) {
    //     try {
    //       const jobs = JSON.parse(savedJobs);
    //       const jobToEdit = jobs.find(job => job.id.toString() === id.toString() && job.jobType === 'volunteer');
    //       if (jobToEdit) {
    //         setFormData({
    //           programTitle: jobToEdit.programTitle || '',
    //           programDescription: jobToEdit.programDescription || '',
    //           location: jobToEdit.location || '',
    //           programDate: jobToEdit.programDate || '',
    //           programTime: jobToEdit.programTime || '',
    //           duration: jobToEdit.duration || '',
    //           coordinatorName: jobToEdit.coordinatorName || '',
    //           coordinatorPhone: jobToEdit.coordinatorPhone || '',
    //           coordinatorEmail: jobToEdit.coordinatorEmail || '',
    //           coordinatorAddress: jobToEdit.coordinatorAddress || ''
    //         });
    //       } else {
    //         toast.error('Volunteer opportunity not found');
    //         navigate('/admin/job-applications');
    //       }
    //     } catch (error) {
    //       console.error('Failed to load job data', error);
    //       toast.error('Failed to load volunteer opportunity data');
    //       navigate('/admin/job-applications');
    //     }
    //   }
    //   setLoading(false);
    // }
  }, [id, navigate]);

  // Handle form field changes
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
    if (!formData.programTitle.trim()) newErrors.programTitle = 'Program programTitle is required';
    if (!formData.programDescription.trim()) newErrors.programDescription = 'Program programDescription is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.programDate) newErrors.programDate = 'Program date is required';
    if (!formData.coordinatorName.trim()) newErrors.coordinatorName = 'Contact name is required';
    if (!formData.coordinatorPhone.trim()) newErrors.coordinatorPhone = 'Contact phone is required';
    if (!formData.coordinatorEmail.trim()) newErrors.coordinatorEmail = 'Contact email is required';
    if (!formData.coordinatorAddress.trim()) newErrors.coordinatorAddress = 'Contact address is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.coordinatorEmail.trim() && !emailRegex.test(formData.coordinatorEmail.trim())) {
      newErrors.coordinatorEmail = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (formData.coordinatorPhone.trim() && !phoneRegex.test(formData.coordinatorPhone.trim())) {
      newErrors.coordinatorPhone = 'Please enter a valid phone number';
    }
    
    return newErrors;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    const newErrors = validateForm();

    const putData = {
      ...formData,
      programTime: `${formData.programTime}:00`
    }

    axios.put(`${JOB_APPLICATION_API}/service`, putData,
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
      toast.success('Volunteer Vacancy Post posted successfully!', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'colored',
        onClose: () => navigate('/admin/job-application')
      });
    })
    .catch(err => {
      console.error('Error:', err?.response?.data || err?.message);
      toast.error('Server Error!Unable to Submit Post', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored'
      });
      return;
    })
    .finally(() => {
      // setLoadingSubmit(false);
    });
    
    // if (Object.keys(newErrors).length === 0) {
    //   // Prepare job data
    //   const jobData = {
    //     ...formData,
    //     jobType: 'volunteer',
    //     department: 'Community Service',
    //     requirements: 'Community service mindset and willingness to help'
    //   };

    //   // Get existing jobs
    //   const savedJobs = localStorage.getItem('jobs');
    //   let jobs = [];
    //   if (savedJobs) {
    //     try {
    //       jobs = JSON.parse(savedJobs);
    //     } catch (error) {
    //       console.error('Failed to parse jobs', error);
    //     }
    //   }

    //   // Update existing job
    //   const updatedJobs = jobs.map(job => 
    //     job.id.toString() === id.toString() ? { ...jobData, id: id, isActive: job.isActive } : job
    //   );
    //   localStorage.setItem('jobs', JSON.stringify(updatedJobs));

    //   // Show success message
    //   setShowSuccess(true);
    //   toast.success('Volunteer opportunity updated successfully!');
      
    //   // Navigate back after delay
    //   setTimeout(() => {
    //     setShowSuccess(false);
    //     navigate('/admin/job-applications');
    //   }, 2000);
    // } else {
    //   setErrors(newErrors);
    //   const errorCount = Object.keys(newErrors).length;
    //   toast.error(`Please fix ${errorCount} validation error${errorCount > 1 ? 's' : ''} before submitting.`);
    // }
  }, [validateForm, formData, id, navigate]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    navigate('/admin/job-application');
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading volunteer opportunity data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
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
                Volunteer opportunity has been updated successfully.
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
                Edit Volunteer Program
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Update the community service opportunity details
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
                <MdFavorite className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Program Information</h2>
            </div>
            
            <div className="space-y-6">
              {/* Program programTitle */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Program programTitle <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdFavorite className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.programTitle}
                    onChange={(e) => handleInputChange('programTitle', e.target.value)}
                    placeholder="e.g., Community Garden Volunteer"
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
              
              {/* Program programDescription */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Program programDescription <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.programDescription}
                  onChange={(e) => handleInputChange('programDescription', e.target.value)}
                  placeholder="Describe the volunteer opportunity and what participants will be doing..."
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
          </div>

          {/* Schedule & Location */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <MdCalendarToday className="text-blue-600 dark:text-blue-400" size={20} />
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
                  <MdLocationOn className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                    <MdErrorOutline size={16} />
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
                  <MdCalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={formData.programDate}
                    onChange={(e) => handleInputChange('programDate', e.target.value)}
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
              
              {/* Time Schedule */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Time Schedule
                </label>
                <div className="relative">
                  <MdAccessTime className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.programTime}
                    onChange={(e) => handleInputChange('programTime', e.target.value)}
                    placeholder="e.g., 9:00 AM - 5:00 PM"
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
              
              {/* Duration */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Duration
                </label>
                <div className="relative">
                  <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                    <MdErrorOutline size={16} />
                    {errors.duration}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-navy-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <MdPerson  className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.coordinatorName}
                    onChange={(e) => handleInputChange('coordinatorName', e.target.value)}
                    placeholder="e.g., Sarah Johnson"
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
              
              {/* Contact Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    value={formData.coordinatorPhone}
                    onChange={(e) => handleInputChange('coordinatorPhone', e.target.value)}
                    placeholder="e.g., +91 98765 43211"
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
              
              {/* Contact Email */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={formData.coordinatorEmail}
                    onChange={(e) => handleInputChange('coordinatorEmail', e.target.value)}
                    placeholder="e.g., volunteer@municipality.gov.in"
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
              
              {/* Contact Address */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Office Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.coordinatorAddress}
                  onChange={(e) => handleInputChange('coordinatorAddress', e.target.value)}
                  placeholder="e.g., Ward Office, R.S. Puram, Coimbatore - 641002"
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
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2 shadow-lg"
            >
              <MdSave size={20} />
              Update Volunteer Opportunity
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200 py-4 px-6 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerEditForm;


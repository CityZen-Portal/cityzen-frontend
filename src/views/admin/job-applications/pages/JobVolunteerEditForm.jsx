import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Building2, Heart, Save, X, Plus, Trash2, MapPin, Calendar,
  User, Phone, Mail, FileText, AlertCircle, CheckCircle,
  ArrowLeft, Clock, Users, Award
} from 'lucide-react';

const JobVolunteerEditForm = ({ jobType = 'municipal', onSubmit, onCancel, editData = null, isEditMode = false }) => {
  const [currentForm, setCurrentForm] = useState(editData ? editData.jobType : jobType);
  const [showSuccess, setShowSuccess] = useState(false);
  const [newRequirement, setNewRequirement] = useState('');

  // Volunteer Job Form State (removed compensation and lastDate fields)
  const [volunteerForm, setVolunteerForm] = useState({
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

  // Initialize form data when in edit mode
  useEffect(() => {
    if (isEditMode && editData) {
        setVolunteerForm({
          title: editData.title || '',
          description: editData.description || '',
          location: editData.location || '',
          workDate: editData.workDate || '',
          workTime: editData.workTime || '',
          duration: editData.duration || '',
          contactName: editData.contactName || '',
          contactPhone: editData.contactPhone || '',
          contactEmail: editData.contactEmail || '',
          contactAddress: editData.contactAddress || ''
        });
    }
  }, [isEditMode, editData]);

  // Stable handlers to prevent re-rendering issues


  const handleVolunteerFormChange = useCallback((field) => {
    return (e) => {
      const value = e.target.value;
      setVolunteerForm(prev => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };
  }, [errors]);

  // Validate forms

  const validateVolunteerForm = useCallback(() => {
    const newErrors = {};
    if (!volunteerForm.title.trim()) newErrors.title = 'Program title is required';
    if (!volunteerForm.description.trim()) newErrors.description = 'Program description is required';
    if (!volunteerForm.location.trim()) newErrors.location = 'Location is required';
    if (!volunteerForm.workDate) newErrors.workDate = 'Program date is required';
    if (!volunteerForm.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!volunteerForm.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    if (!volunteerForm.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!volunteerForm.contactAddress.trim()) newErrors.contactAddress = 'Contact address is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (volunteerForm.contactEmail.trim() && !emailRegex.test(volunteerForm.contactEmail.trim())) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (volunteerForm.contactPhone.trim() && !phoneRegex.test(volunteerForm.contactPhone.trim())) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }
    
    return newErrors;
  }, [volunteerForm]);

  // Handle form submission
  const handleSubmit = useCallback(() => {
    const newErrors = validateVolunteerForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Prepare job data
      const jobData = {
        ...volunteerForm,
        jobType: 'volunteer',
        department: 'Community Service',
        requirements: 'Community service mindset and willingness to help',
        ...(isEditMode && editData ? { id: editData.id, isActive: editData.isActive } : {})
      };

      // Show success message
      setShowSuccess(true);
      toast.success(`${'Volunteer opportunity'} ${isEditMode ? 'updated' : 'posted'} successfully!`);
      
      // Call onSubmit after a delay
      setTimeout(() => {
        setShowSuccess(false);
        onSubmit(jobData, isEditMode);
        
        // Reset form only if not in edit mode
        if (!isEditMode) {
            setVolunteerForm({
              title: '', description: '', location: '', workDate: '', workTime: '',
              duration: '', contactName: '', contactPhone: '', contactEmail: '', contactAddress: ''
            });
        }
        setErrors({});
      }, 2000);
    } else {
      setErrors(newErrors);
      // Show validation errors with toastify
      const errorCount = Object.keys(newErrors).length;
      toast.error(`Please fix ${errorCount} validation error${errorCount > 1 ? 's' : ''} before submitting.`);
    }
  }, [currentForm, validateVolunteerForm, volunteerForm, onSubmit, isEditMode, editData]);

  // Stable InputField component using useMemo
  const InputField = useMemo(() => {
    return React.memo(({ label, type = 'text', value, onChange, error, placeholder, icon: Icon, required = false }) => (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          )}
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
            }`}
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>
    ));
  }, []);

  // Stable TextAreaField component using useMemo
  const TextAreaField = useMemo(() => {
    return React.memo(({ label, value, onChange, error, placeholder, required = false }) => (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className={`w-full px-4 py-3 bg-white dark:bg-navy-800 dark:text-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
            error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
          }`}
        />
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
      </div>
    ));
  }, []);

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
          <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Success!</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {'Volunteer opportunity'} has been {isEditMode ? 'updated' : 'posted'} successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-navy-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onCancel}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
                <ArrowLeft className="text-gray-600 dark:text-gray-400" size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isEditMode ? 'Edit' : 'Create'} {'Volunteer Program'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {isEditMode 
                    ? `Update the ${'community service opportunity'}`
                      : 'Create a community service opportunity'
                  }
                </p>
              </div>
            </div>
           
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
            <div className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <Heart className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Program Information</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <InputField
                      label="Program Title"
                      value={volunteerForm.title}
                      onChange={handleVolunteerFormChange('title')}
                      error={errors.title}
                      placeholder="e.g., Community Health Awareness Drive"
                      icon={Heart}
                      required
                    />
                  </div>
                  
                  <div className="lg:col-span-2">
                    <TextAreaField
                      label="Program Description"
                      value={volunteerForm.description}
                      onChange={handleVolunteerFormChange('description')}
                      error={errors.description}
                      placeholder="Describe the volunteer program, activities, and goals..."
                      required
                    />
                  </div>
                  
                  <InputField
                    label="Location"
                    value={volunteerForm.location}
                    onChange={handleVolunteerFormChange('location')}
                    error={errors.location}
                    placeholder="e.g., Ward 15, R.S. Puram"
                    icon={MapPin}
                    required
                  />
                  
                  <InputField
                    label="Program Date"
                    type="date"
                    value={volunteerForm.workDate}
                    onChange={handleVolunteerFormChange('workDate')}
                    error={errors.workDate}
                    icon={Calendar}
                    required
                  />
                  
                  <InputField
                    label="Program Time"
                    value={volunteerForm.workTime}
                    onChange={handleVolunteerFormChange('workTime')}
                    error={errors.workTime}
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    icon={Clock}
                  />
                  
                  <InputField
                    label="Duration"
                    value={volunteerForm.duration}
                    onChange={handleVolunteerFormChange('duration')}
                    error={errors.duration}
                    placeholder="e.g., 1 day, 2 weeks, ongoing"
                    icon={Users}
                  />
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <User className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contact Details</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <InputField
                    label="Contact Person Name"
                    value={volunteerForm.contactName}
                    onChange={handleVolunteerFormChange('contactName')}
                    error={errors.contactName}
                    placeholder="e.g., Sarah Johnson"
                    icon={User}
                    required
                  />
                  
                  <InputField
                    label="Contact Phone"
                    value={volunteerForm.contactPhone}
                    onChange={handleVolunteerFormChange('contactPhone')}
                    error={errors.contactPhone}
                    placeholder="e.g., +91 98765 43210"
                    icon={Phone}
                    required
                  />
                  
                  <InputField
                    label="Contact Email"
                    type="email"
                    value={volunteerForm.contactEmail}
                    onChange={handleVolunteerFormChange('contactEmail')}
                    error={errors.contactEmail}
                    placeholder="e.g., volunteer@municipality.gov.in"
                    icon={Mail}
                    required
                  />
                  
                  <div className="lg:col-span-2">
                    <TextAreaField
                      label="Contact Address"
                      value={volunteerForm.contactAddress}
                      onChange={handleVolunteerFormChange('contactAddress')}
                      error={errors.contactAddress}
                      placeholder="Complete address for volunteer coordination..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-8 py-3 bg-gray-300 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-xl transition-colors font-medium flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-all duration-200 font-medium flex items-center gap-2 shadow-lg"
            >
              <Save size={18} />
              {isEditMode ? 'Update' : 'Post'} {'Program'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobVolunteerEditForm;


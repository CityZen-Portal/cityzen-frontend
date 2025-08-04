import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Building2, Heart, Save, X, Plus, Trash2, MapPin, Calendar,
  User, Phone, Mail, FileText, AlertCircle, CheckCircle,
  ArrowLeft, Clock, Users, Award
} from 'lucide-react';

const JobMunicipalEditForm = ({ jobType = 'municipal', onSubmit, onCancel, editData = null, isEditMode = false }) => {
  const [currentForm, setCurrentForm] = useState(editData ? editData.jobType : jobType);
  const [showSuccess, setShowSuccess] = useState(false);

  // Municipal Job Form State (removed salary field)
  const [municipalForm, setMunicipalForm] = useState({
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

  // Volunteer Job Form State (removed compensation and lastDate fields)
  // const [volunteerForm, setVolunteerForm] = useState({
  //   title: '',
  //   description: '',
  //   location: '',
  //   workDate: '',
  //   workTime: '',
  //   duration: '',
  //   contactName: '',
  //   contactPhone: '',
  //   contactEmail: '',
  //   contactAddress: ''
  // });

  const [errors, setErrors] = useState({});

  // Initialize form data when in edit mode
  useEffect(() => {
    if (isEditMode && editData) {
        setMunicipalForm({
          title: editData.title || '',
          department: editData.department || '',
          description: editData.description || '',
          location: editData.location || '',
          requirements: editData.requirements ? editData.requirements.split('; ').filter(req => req.trim()) : [],
          lastDate: editData.lastDate || '',
          contactName: editData.contactName || '',
          contactPhone: editData.contactPhone || '',
          contactEmail: editData.contactEmail || '',
          contactAddress: editData.contactAddress || ''
        });
    }
  }, [isEditMode, editData]);

  // Stable handlers to prevent re-rendering issues
  const handleMunicipalFormChange = useCallback((field) => {
    return (e) => {
      const value = e.target.value;
      setMunicipalForm(prev => ({ ...prev, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    };
  }, [errors]);


  // Add requirement for municipal job
  const addRequirement = useCallback(() => {
    if (newRequirement.trim() && !municipalForm.requirements.includes(newRequirement.trim())) {
      setMunicipalForm(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
      // Clear requirements error
      if (errors.requirements) {
        setErrors(prev => ({ ...prev, requirements: '' }));
      }
      // toast.success('Requirement added successfully!');
    } else if (municipalForm.requirements.includes(newRequirement.trim())) {
      // toast.warning('This requirement already exists!');
    }
  }, [newRequirement, municipalForm.requirements, errors.requirements]);

  // Remove requirement
  const removeRequirement = useCallback((index) => {
    setMunicipalForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
    // toast.info('Requirement removed');
  }, []);

  // Handle requirement input change
  const handleRequirementChange = useCallback((e) => {
    setNewRequirement(e.target.value);
  }, []);

  // Handle requirement key press
  const handleRequirementKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRequirement();
    }
  }, [addRequirement]);

  // Validate forms
  const validateMunicipalForm = useCallback(() => {
    const newErrors = {};
    if (!municipalForm.title.trim()) newErrors.title = 'Job title is required';
    if (!municipalForm.department.trim()) newErrors.department = 'Department is required';
    if (!municipalForm.description.trim()) newErrors.description = 'Job description is required';
    if (!municipalForm.location.trim()) newErrors.location = 'Location is required';
    if (municipalForm.requirements.length === 0) newErrors.requirements = 'At least one requirement is needed';
    if (!municipalForm.lastDate) newErrors.lastDate = 'Application deadline is required';
    if (!municipalForm.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!municipalForm.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    if (!municipalForm.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!municipalForm.contactAddress.trim()) newErrors.contactAddress = 'Contact address is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (municipalForm.contactEmail.trim() && !emailRegex.test(municipalForm.contactEmail.trim())) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    if (municipalForm.contactPhone.trim() && !phoneRegex.test(municipalForm.contactPhone.trim())) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }
    
    return newErrors;
  }, [municipalForm]);


  // Handle form submission
  const handleSubmit = useCallback(() => {
    const newErrors = validateMunicipalForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Prepare job data
      const jobData = {
        ...municipalForm,
        jobType: 'municipal',
        requirements: municipalForm.requirements.join('; '),
        department: municipalForm.department || 'General',
        ...(isEditMode && editData ? { id: editData.id, isActive: editData.isActive } : {})
      } 

      // Show success message
      setShowSuccess(true);
      toast.success(`${'Municipal job'} ${isEditMode ? 'updated' : 'posted'} successfully!`);
      
      // Call onSubmit after a delay
      setTimeout(() => {
        setShowSuccess(false);
        onSubmit(jobData, isEditMode);
        
        // Reset form only if not in edit mode
        if (!isEditMode) {
            setMunicipalForm({
              title: '', department: '', description: '', location: '', requirements: [], 
              lastDate: '', contactName: '', contactPhone: '', contactEmail: '', contactAddress: ''
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
  }, [currentForm, validateMunicipalForm, municipalForm, onSubmit, isEditMode, editData]);

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
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Success!</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {'Municipal job'} has been {isEditMode ? 'updated' : 'posted'} successfully.
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
                  {isEditMode ? 'Edit' : 'Create'} {'Municipal Job'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {isEditMode 
                    ? `Update the ${'government position'}`
                    :'Post a new government position'
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
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <FileText className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Job Information</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-2">
                    <InputField
                      label="Job Title"
                      value={municipalForm.title}
                      onChange={handleMunicipalFormChange('title')}
                      error={errors.title}
                      placeholder="e.g., Senior Civil Engineer"
                      icon={Building2}
                      required
                    />
                  </div>
                  
                  <InputField
                    label="Department"
                    value={municipalForm.department}
                    onChange={handleMunicipalFormChange('department')}
                    error={errors.department}
                    placeholder="e.g., Public Works Department"
                    icon={Building2}
                    required
                  />
                  
                  <div className="lg:col-span-2">
                    <TextAreaField
                      label="Job Description"
                      value={municipalForm.description}
                      onChange={handleMunicipalFormChange('description')}
                      error={errors.description}
                      placeholder="Describe the job responsibilities, duties, and expectations..."
                      required
                    />
                  </div>
                  
                  <InputField
                    label="Location"
                    value={municipalForm.location}
                    onChange={handleMunicipalFormChange('location')}
                    error={errors.location}
                    placeholder="e.g., Coimbatore Municipal Corporation"
                    icon={MapPin}
                    required
                  />

                  <InputField
                    label="Application Deadline"
                    type="date"
                    value={municipalForm.lastDate}
                    onChange={handleMunicipalFormChange('lastDate')}
                    error={errors.lastDate}
                    icon={Calendar}
                    required
                  />
                </div>
              </div>

              {/* Requirements Card */}
              <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Job Requirements</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-3 dark:text-white">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={handleRequirementChange}
                      placeholder="Enter a job requirement..."
                      className="flex-1 px-4 py-3 bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      onKeyPress={handleRequirementKeyPress}
                    />
                    <button
                      type="button"
                      onClick={addRequirement}
                      disabled={!newRequirement.trim()}
                      className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white rounded-xl transition-colors flex items-center gap-2 font-medium"
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
                  
                  {municipalForm.requirements.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h3 className="font-medium text-gray-700 dark:text-gray-300">Requirements Added:</h3>
                      <div className="space-y-2">
                        {municipalForm.requirements.map((req, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-navy-800 rounded-lg p-3">
                            <span className="text-gray-700 dark:text-gray-300 dark:bg-navy-800">{req}</span>
                            <button
                              type="button"
                              onClick={() => removeRequirement(index)}
                              className="dark:text-white dark:hover:text-white p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                    value={municipalForm.contactName}
                    onChange={handleMunicipalFormChange('contactName')}
                    error={errors.contactName}
                    placeholder="e.g., John Smith"
                    icon={User}
                    required
                  />
                  
                  <InputField
                    label="Contact Phone"
                    value={municipalForm.contactPhone}
                    onChange={handleMunicipalFormChange('contactPhone')}
                    error={errors.contactPhone}
                    placeholder="e.g., +91 98765 43210"
                    icon={Phone}
                    required
                  />
                  
                  <InputField
                    label="Contact Email"
                    type="email"
                    value={municipalForm.contactEmail}
                    onChange={handleMunicipalFormChange('contactEmail')}
                    error={errors.contactEmail}
                    placeholder="e.g., hr@municipality.gov.in"
                    icon={Mail}
                    required
                  />
                  
                  <div className="lg:col-span-2">
                    <TextAreaField
                      label="Contact Address"
                      value={municipalForm.contactAddress}
                      onChange={handleMunicipalFormChange('contactAddress')}
                      error={errors.contactAddress}
                      placeholder="Complete address for applications and inquiries..."
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
              {isEditMode ? 'Update' : 'Post'} {currentForm === 'municipal' ? 'Job' : 'Program'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobMunicipalEditForm;


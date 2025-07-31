import React, { useState } from 'react';
import {
  Building2, Heart, Save, X, Plus, Trash2, MapPin, Calendar,
  User, Phone, Mail, FileText, AlertCircle, CheckCircle,
  ArrowLeft, Clock, Users, Award
} from 'lucide-react';

const JobFormPages = ({ jobType = 'municipal', onSubmit, onCancel }) => {
  const [currentForm, setCurrentForm] = useState(jobType);
  const [showSuccess, setShowSuccess] = useState(false);

  // Municipal Job Form State
  const [municipalForm, setMunicipalForm] = useState({
    title: '',
    department: '',
    description: '',
    location: '',
    requirements: [],
    salary: '',
    lastDate: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: ''
  });
  const [newRequirement, setNewRequirement] = useState('');

  // Volunteer Job Form State
  const [volunteerForm, setVolunteerForm] = useState({
    title: '',
    description: '',
    location: '',
    workDate: '',
    workTime: '',
    duration: '',
    compensation: '',
    lastDate: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: ''
  });

  const [errors, setErrors] = useState({});

  // Add requirement for municipal job
  const addRequirement = () => {
    if (newRequirement.trim() && !municipalForm.requirements.includes(newRequirement.trim())) {
      setMunicipalForm(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  // Remove requirement
  const removeRequirement = (index) => {
    setMunicipalForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  // Validate forms
  const validateMunicipalForm = () => {
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
    return newErrors;
  };

  const validateVolunteerForm = () => {
    const newErrors = {};
    if (!volunteerForm.title.trim()) newErrors.title = 'Program title is required';
    if (!volunteerForm.description.trim()) newErrors.description = 'Program description is required';
    if (!volunteerForm.location.trim()) newErrors.location = 'Location is required';
    if (!volunteerForm.workDate) newErrors.workDate = 'Program date is required';
    if (!volunteerForm.lastDate) newErrors.lastDate = 'Application deadline is required';
    if (!volunteerForm.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!volunteerForm.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    if (!volunteerForm.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!volunteerForm.contactAddress.trim()) newErrors.contactAddress = 'Contact address is required';
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = () => {
    const newErrors = currentForm === 'municipal' ? validateMunicipalForm() : validateVolunteerForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Prepare job data
      const jobData = currentForm === 'municipal' ? {
        ...municipalForm,
        jobType: 'municipal',
        requirements: municipalForm.requirements.join('; '),
        department: municipalForm.department || 'General'
      } : {
        ...volunteerForm,
        jobType: 'volunteer',
        department: 'Community Service',
        requirements: 'Community service mindset and willingness to help'
      };

      // Show success message
      setShowSuccess(true);
      
      // Call onSubmit after a delay
      setTimeout(() => {
        setShowSuccess(false);
        onSubmit(jobData);
        
        // Reset form
        if (currentForm === 'municipal') {
          setMunicipalForm({
            title: '', department: '', description: '', location: '', requirements: [], 
            salary: '', lastDate: '', contactName: '', contactPhone: '', contactEmail: '', contactAddress: ''
          });
        } else {
          setVolunteerForm({
            title: '', description: '', location: '', workDate: '', workTime: '',
            duration: '', compensation: '', lastDate: '', contactName: '', contactPhone: '', contactEmail: '', contactAddress: ''
          });
        }
      }, 2000);
    } else {
      setErrors(newErrors);
    }
  };

  const InputField = ({ label, type = 'text', value, onChange, error, placeholder, icon: Icon, required = false }) => (
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
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white dark:bg-gray-800 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
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
  );

  const TextAreaField = ({ label, value, onChange, error, placeholder, required = false }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className={`w-full px-4 py-3 bg-white dark:bg-gray-800 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none ${
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
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
                {currentForm === 'municipal' ? 'Municipal job' : 'Volunteer opportunity'} has been posted successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
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
                  Create {currentForm === 'municipal' ? 'Municipal Job' : 'Volunteer Program'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {currentForm === 'municipal' 
                    ? 'Post a new government position' 
                    : 'Create a community service opportunity'
                  }
                </p>
              </div>
            </div>
            
            {/* Form Type Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setCurrentForm('municipal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentForm === 'municipal'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Building2 size={18} />
                <span className="font-medium">Municipal</span>
              </button>
              <button
                onClick={() => setCurrentForm('volunteer')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentForm === 'volunteer'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Heart size={18} />
                <span className="font-medium">Volunteer</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {currentForm === 'municipal' ? (
            /* Municipal Job Form */
            <div className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
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
                      onChange={(e) => setMunicipalForm(prev => ({ ...prev, title: e.target.value }))}
                      error={errors.title}
                      placeholder="e.g., Senior Civil Engineer"
                      icon={Building2}
                      required
                    />
                  </div>
                  
                  <InputField
                    label="Department"
                    value={municipalForm.department}
                    onChange={(e) => setMunicipalForm(prev => ({ ...prev, department: e.target.value }))}
                    error={errors.department}
                    placeholder="e.g., Public Works Department"
                    icon={Building2}
                    required
                  />
                  
                  <InputField
                    label="Location"
                    value={municipalForm.location}
                    onChange={(e) => setMunicipalForm(prev => ({ ...prev, location: e.target.value }))}
                    error={errors.location}
                    placeholder="e.g., Coimbatore Municipal Corporation"
                    icon={MapPin}
                    required
                  />

                  <InputField
                    label="Salary Range"
                    value={municipalForm.salary}
                    onChange={(e) => setMunicipalForm(prev => ({ ...prev, salary: e.target.value }))}
                    error={errors.salary}
                    placeholder="e.g., ₹45,000 - ₹65,000 per month"
                    icon={Award}
                  />

                  <InputField
                    label="Application Deadline"
                    type="date"
                    value={municipalForm.lastDate}
                    onChange={(e) => setMunicipalForm(prev => ({ ...prev, lastDate: e.target.value }))}
                    error={errors.lastDate}
                    icon={Calendar}
                    required
                  />
                  
                  <div className="lg:col-span-2">
                    <TextAreaField
                      label="Job Description"
                      value={municipalForm.description}
                      onChange={(e) => setMunicipalForm(prev => ({ ...prev, description: e.target.value }))}
                      error={errors.description}
                      placeholder="Describe the job responsibilities, duties, and expectations..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Requirements Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Job Requirements</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Enter a job requirement..."
                      className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                    />
                    <button
                      type="button"
                      onClick={addRequirement}
                      disabled={!newRequirement.trim()}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl transition-colors flex items-center gap-2 font-medium"
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
                          <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <span className="text-gray-700 dark:text-gray-300">{req}</span>
                            <button
                              type="button"
                              onClick={() => removeRequirement(index)}
                              className="text-red-500 hover:text-red-700 p-1"
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
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
                    onChange={(e) => setMunicipalForm(prev => ({ ...prev, contactName: e.target.value }))}
                    error={errors.contactName}
                    placeholder="e.g., John Smith"
                    icon={User}
                    required
                  />
                  
                  <InputField
                    label="Contact Phone"
                    value={municipalForm.contactPhone}
                    onChange={(e) => setMunicipalForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                    error={errors.contactPhone}
                    placeholder="e.g., +91 98765 43210"
                    icon={Phone}
                    required
                  />
                  
                  <InputField
                    label="Contact Email"
                    type="email"
                    value={municipalForm.contactEmail}
                    onChange={(e) => setMunicipalForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                    error={errors.contactEmail}
                    placeholder="e.g., hr@municipality.gov.in"
                    icon={Mail}
                    required
                  />
                  
                  <div className="lg:col-span-2">
                    <TextAreaField
                      label="Contact Address"
                      value={municipalForm.contactAddress}
                      onChange={(e) => setMunicipalForm(prev => ({ ...prev, contactAddress: e.target.value }))}
                      error={errors.contactAddress}
                      placeholder="Complete address for applications and inquiries..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Volunteer Job Form */
            <div className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
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
                      onChange={(e) => setVolunteerForm(prev => ({ ...prev, title: e.target.value }))}
                      error={errors.title}
                      placeholder="e.g., Community Health Awareness Drive"
                      icon={Heart}
                      required
                    />
                  </div>
                  
                  <InputField
                    label="Location"
                    value={volunteerForm.location}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, location: e.target.value }))}
                    error={errors.location}
                    placeholder="e.g., Ward 15, R.S. Puram"
                    icon={MapPin}
                    required
                  />
                  
                  <InputField
                    label="Program Date"
                    type="date"
                    value={volunteerForm.workDate}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, workDate: e.target.value }))}
                    error={errors.workDate}
                    icon={Calendar}
                    required
                  />
                  
                  <InputField
                    label="Program Time"
                    value={volunteerForm.workTime}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, workTime: e.target.value }))}
                    error={errors.workTime}
                    placeholder="e.g., 9:00 AM - 5:00 PM"
                    icon={Clock}
                  />
                  
                  <InputField
                    label="Duration"
                    value={volunteerForm.duration}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, duration: e.target.value }))}
                    error={errors.duration}
                    placeholder="e.g., 1 day / 1 week / 1 month"
                    icon={Clock}
                  />

                  <InputField
                    label="Compensation/Benefits"
                    value={volunteerForm.compensation}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, compensation: e.target.value }))}
                    error={errors.compensation}
                    placeholder="e.g., Certificate + ₹5,000 allowance"
                    icon={Award}
                  />

                  <InputField
                    label="Application Deadline"
                    type="date"
                    value={volunteerForm.lastDate}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, lastDate: e.target.value }))}
                    error={errors.lastDate}
                    icon={Calendar}
                    required
                  />
                  
                  <div className="lg:col-span-2">
                    <TextAreaField
                      label="Program Description"
                      value={volunteerForm.description}
                      onChange={(e) => setVolunteerForm(prev => ({ ...prev, description: e.target.value }))}
                      error={errors.description}
                      placeholder="Describe the volunteer program, activities, and expectations..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
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
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, contactName: e.target.value }))}
                    error={errors.contactName}
                    placeholder="e.g., Sarah Johnson"
                    icon={User}
                    required
                  />
                  
                  <InputField
                    label="Contact Phone"
                    value={volunteerForm.contactPhone}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                    error={errors.contactPhone}
                    placeholder="e.g., +91 98765 43210"
                    icon={Phone}
                    required
                  />
                  
                  <InputField
                    label="Contact Email"
                    type="email"
                    value={volunteerForm.contactEmail}
                    onChange={(e) => setVolunteerForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                    error={errors.contactEmail}
                    placeholder="e.g., volunteer@municipality.gov.in"
                    icon={Mail}
                    required
                  />
                  
                  <div className="lg:col-span-2">
                    <TextAreaField
                      label="Contact Address"
                      value={volunteerForm.contactAddress}
                      onChange={(e) => setVolunteerForm(prev => ({ ...prev, contactAddress: e.target.value }))}
                      error={errors.contactAddress}
                      placeholder="Complete address for applications and inquiries..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="px-8 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-xl transition-colors font-medium flex items-center gap-2"
            >
              <X size={20} />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-8 py-3 rounded-xl transition-colors font-medium flex items-center gap-2 ${
                currentForm === 'municipal'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              <Save size={20} />
              Post {currentForm === 'municipal' ? 'Job' : 'Program'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFormPages;


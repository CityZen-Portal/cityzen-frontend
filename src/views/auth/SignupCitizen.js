import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Add this import
// Toast Notification Component
const Toast = ({ message, type = 'success', isVisible, onClose, persistent = false, otp = null }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (isVisible && !persistent) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto dismiss after 4 seconds only if not persistent

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, persistent]);

  const handleCopyOTP = async () => {
    if (otp) {
      try {
        await navigator.clipboard.writeText(otp);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy OTP:', err);
      }
    }
  };

  if (!isVisible) return null;

  const bgColor = type === 'success' 
    ? 'bg-gradient-to-r from-green-500 to-green-600' 
    : type === 'error' 
    ? 'bg-gradient-to-r from-red-500 to-red-600'
    : 'bg-gradient-to-r from-blue-500 to-blue-600';

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-lg backdrop-blur-md border border-white/20 max-w-sm`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{icon}</span>
            <div className="flex-1">
              <p className="font-medium text-sm">{message}</p>
              
              {/* OTP Display and Copy Button */}
              {otp && (
                <div className="mt-3 p-3 bg-white/20 rounded-lg border border-white/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-mono tracking-wider">{otp}</span>
                    </div>
                    <button
                      onClick={handleCopyOTP}
                      className="ml-3 px-3 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      {copySuccess ? (
                        <>
                          <span>✅</span>
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons for persistent toasts */}
              {persistent && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
                  >
                    Got it!
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Close button - only show if not persistent or show smaller version */}
          {!persistent && (
            <button
              onClick={onClose}
              className="ml-4 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// OTP Verification Modal Component
const OtpModal = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  phoneNumber,
  verificationStatus,
  verificationError 
}) => {
  const [otpInput, setOtpInput] = useState('');
  const [mockOtp, setMockOtp] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Generate a new 6-digit OTP when modal opens
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setMockOtp(otp);
      setOtpInput('');
    }
  }, [isOpen]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtpInput(value);
    }
  };

  const handleVerify = () => {
    onVerify(otpInput, mockOtp);
  };

  const handleCopyOTP = async () => {
    try {
      await navigator.clipboard.writeText(mockOtp);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy OTP:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl dark:bg-gray-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Verify OTP</h3>
          
          <p className="text-gray-600 dark:text-gray-300">
            A 6-digit OTP has been sent to your phone number ending with 
            <span className="font-semibold"> {phoneNumber.slice(-4)}</span>
          </p>

          {/* Mock OTP Display */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Your OTP:</p>
                <p className="text-2xl font-mono tracking-wider text-blue-600 dark:text-blue-400">{mockOtp}</p>
              </div>
              <button
                onClick={handleCopyOTP}
                className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center space-x-1 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-blue-300"
              >
                {copySuccess ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              This is a mock OTP for demonstration purposes.
            </p>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              value={otpInput}
              onChange={handleOtpChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter 6-digit OTP"
              maxLength="6"
            />
          </div>

          {verificationStatus === 'success' ? (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg dark:bg-green-900 dark:text-green-200">
              ✅ OTP Verified Successfully!
            </div>
          ) : verificationStatus === 'error' ? (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-200">
              ❌ {verificationError}
            </div>
          ) : null}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              disabled={otpInput.length !== 6}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                otpInput.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Verify OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock Footer Component
const Footer = () => (
  <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
    <p>&copy; 2024 Your Company. All rights reserved.</p>
  </div>
);

const SignupCitizen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadharNumber: '',
    phoneNumber: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // OTP verification states
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'error', null
  const [verificationError, setVerificationError] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Toast states
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success',
    persistent: false,
    otp: null
  });

  const showToast = (message, type = 'success', persistent = false, otp = null) => {
    setToast({
      isVisible: true,
      message,
      type,
      persistent,
      otp
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEmailBlur = () => {
    validateEmail(formData.email);
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
      return true;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    // Use custom email validation
    if (!validateEmail(formData.email)) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.aadharNumber.trim()) newErrors.aadharNumber = 'Aadhar number is required';
    else if (!/^\d{12}$/.test(formData.aadharNumber.replace(/\s/g, ''))) newErrors.aadharNumber = 'Aadhar number must be 12 digits';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phoneNumber)) newErrors.phoneNumber = 'Phone number must be 10 digits';
    
    // Check if phone is verified
    if (!phoneVerified) newErrors.phoneNumber = 'Please verify your phone number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      showToast('Account created successfully! Welcome aboard!', 'success');
      // Navigate to citizen dashboard after successful submission
      setTimeout(() => {
        navigate('/citizen/dashboard');
      }, 2000);
    }
  };

  const formatAadharNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleAadharChange = (e) => {
    const formatted = formatAadharNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 12) {
      setFormData(prev => ({ ...prev, aadharNumber: formatted }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setFormData(prev => ({ ...prev, phoneNumber: value }));
      // Reset verification if phone number changes
      if (phoneVerified) {
        setPhoneVerified(false);
      }
    }
  };

  const handleSendOtp = async () => {
    // Validate phone number first
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setErrors(prev => ({ ...prev, phoneNumber: 'Phone number must be 10 digits' }));
      return;
    }

    setSendingOtp(true);
    setErrors(prev => ({ ...prev, phoneNumber: '' }));

    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSendingOtp(false);
    setOtpModalOpen(true);
    setVerificationStatus(null);
    setVerificationError('');
  };

  const handleVerifyOtp = (enteredOtp, expectedOtp) => {
    if (enteredOtp === expectedOtp) {
      setVerificationStatus('success');
      setVerificationError('');
      // Close modal after 1.5 seconds and mark as verified
      setTimeout(() => {
        setOtpModalOpen(false);
        setPhoneVerified(true);
      }, 1500);
    } else {
      setVerificationStatus('error');
      setVerificationError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 
                    dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 
                    transition-all duration-300">

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        persistent={toast.persistent}
        otp={toast.otp}
      />

      {/* OTP Verification Modal */}
      <OtpModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        onVerify={handleVerifyOtp}
        phoneNumber={formData.phoneNumber}
        verificationStatus={verificationStatus}
        verificationError={verificationError}
      />

      {/* Decorative Gradient Blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-40"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full filter blur-2xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-300 rounded-full filter blur-2xl opacity-25"></div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {/* SignUp Card - Expanded size */}
        <div className="relative z-10 w-full max-w-2xl p-10 rounded-2xl shadow-2xl 
                        border border-blue-100 dark:border-gray-700 
                        bg-white/80 dark:bg-gray-700/90 backdrop-blur-md 
                        transition-all duration-300 overflow-y-auto max-h-[90vh]">

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Create Citizen Account
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Enter your details to create a new citizen account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                    errors.firstName ? 'border-red-500' : 'border-[#a3aed0]'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Last Name*</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                    errors.lastName ? 'border-red-500' : 'border-[#a3aed0]'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email*</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleEmailBlur}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                  errors.email ? 'border-red-500' : 'border-[#a3aed0]'
                }`}
                placeholder="mail@example.com"
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password*</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-[#a3aed0]'
                  }`}
                  placeholder="Min. 8 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Confirm Password*</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-[#a3aed0]'
                  }`}
                  placeholder="Confirm your password"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Aadhar Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Aadhar Number*</label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleAadharChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                  errors.aadharNumber ? 'border-red-500' : 'border-[#a3aed0]'
                }`}
                placeholder="1234 5678 9012"
                maxLength="14"
              />
              {errors.aadharNumber && <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>}
            </div>

            {/* Phone Number with OTP Verification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Phone Number*</label>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    disabled={phoneVerified}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                      errors.phoneNumber ? 'border-red-500' : 'border-[#a3aed0]'
                    } ${phoneVerified ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                    placeholder="9876543210"
                    maxLength="10"
                  />
                  {phoneVerified && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <span className="text-green-600 text-sm font-medium">✅ Verified</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={phoneVerified || sendingOtp || !formData.phoneNumber || formData.phoneNumber.length !== 10}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    phoneVerified 
                      ? 'bg-green-500 text-white cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                  } ${sendingOtp ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {sendingOtp ? 'Sending...' : phoneVerified ? 'Verified' : 'Send OTP'}
                </button>
              </div>
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2 pt-2">
              <input type="checkbox" id="terms" className="mt-1 w-4 h-4 text-[#422afb] border-[#a3aed0] rounded" required />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                I agree to the <a href="#" className="text-[#422afb] hover:text-[#1b254b]">Terms of Service</a> and <a href="#" className="text-[#422afb] hover:text-[#1b254b]">Privacy Policy</a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r
                       from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                       transition-transform duration-300 transform hover:scale-105 shadow-lg mt-6"
            >
              Create Account
            </button>
          </form>

          {/* Already have account */}
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{' '}
            <button
              onClick={() => navigate("/auth/signin")}
              className="text-[#422afb] hover:text-[#1b254b] font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>

      {/* Footer - Aligned to bottom */}
      <div className="w-full py-4">
        <Footer />
      </div>
    </div>
  );
};

export default SignupCitizen;
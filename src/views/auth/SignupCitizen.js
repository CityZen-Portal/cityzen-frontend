import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from "components/footer/FooterAuthDefault";

const SignupCitizen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadharNumber: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Aadhaar OTP verification states
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [mockOtp, setMockOtp] = useState('');
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [aadhaarSending, setAadhaarSending] = useState(false);

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
    
    // Check if Aadhaar is verified
    if (!aadhaarVerified) newErrors.aadharNumber = 'Please verify your Aadhaar number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Navigate to citizen dashboard after successful submission
      navigate('/citizen/dashboard');
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
      // Reset OTP states if Aadhaar is changed
      if (otpSent || aadhaarVerified) {
        setOtpSent(false);
        setOtpInput('');
        setAadhaarVerified(false);
        setMockOtp('');
      }
    }
  };

  const handleAadhaarVerify = async () => {
    // Validate Aadhaar number first
    const cleanAadhaar = formData.aadharNumber.replace(/\s/g, '');
    if (!/^\d{12}$/.test(cleanAadhaar)) {
      setErrors(prev => ({ ...prev, aadharNumber: 'Aadhar number must be 12 digits' }));
      return;
    }

    setAadhaarSending(true);
    setErrors(prev => ({ ...prev, aadharNumber: '' }));

    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate mock 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtp(generatedOtp);
    setOtpSent(true);
    setAadhaarSending(false);

    // Show OTP in console for testing
    console.log('Mock OTP sent:', generatedOtp);
    
    // You can also show a toast notification here
    alert(`OTP sent successfully! Mock OTP: ${generatedOtp}`);
  };

  const handleOtpValidate = async () => {
    if (!otpInput.trim()) {
      setErrors(prev => ({ ...prev, otp: 'Please enter OTP' }));
      return;
    }

    if (otpInput.length !== 6) {
      setErrors(prev => ({ ...prev, otp: 'OTP must be 6 digits' }));
      return;
    }

    setOtpVerifying(true);
    setErrors(prev => ({ ...prev, otp: '' }));

    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (otpInput === mockOtp) {
      setAadhaarVerified(true);
      setOtpVerifying(false);
      alert('Aadhaar verified successfully!');
    } else {
      setErrors(prev => ({ ...prev, otp: 'Invalid OTP. Please try again.' }));
      setOtpVerifying(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtpInput(value);
      if (errors.otp) {
        setErrors(prev => ({ ...prev, otp: '' }));
      }
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 
                    dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 
                    transition-all duration-300">

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
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleAadharChange}
                  disabled={aadhaarVerified}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                    errors.aadharNumber ? 'border-red-500' : 'border-[#a3aed0]'
                  } ${aadhaarVerified ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                  placeholder="1234 5678 9012"
                  maxLength="14"
                />
                {aadhaarVerified && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-green-600 text-sm font-medium">✅ Verified</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleAadhaarVerify}
                disabled={aadhaarVerified || aadhaarSending}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  aadhaarVerified 
                    ? 'bg-green-500 text-white cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                } ${aadhaarSending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {aadhaarSending ? 'Sending...' : aadhaarVerified ? 'Verified' : 'Verify'}
              </button>
            </div>
            {errors.aadharNumber && <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>}
          </div>

          {/* OTP Input - Shows only when OTP is sent */}
          {otpSent && !aadhaarVerified && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Enter OTP*
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={otpInput}
                  onChange={handleOtpChange}
                  className={`flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${
                    errors.otp ? 'border-red-500' : 'border-[#a3aed0]'
                  }`}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                />
                <button
                  type="button"
                  onClick={handleOtpValidate}
                  disabled={otpVerifying}
                  className={`px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    otpVerifying ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {otpVerifying ? 'Validating...' : 'Validate OTP'}
                </button>
              </div>
              {errors.otp && <p className="mt-1 text-sm text-red-600">{errors.otp}</p>}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                OTP sent to your registered mobile number
              </p>
            </div>
          )}

          {/* Terms */}
          <div className="flex items-start space-x-2 pt-2">
            <input type="checkbox" id="terms" className="mt-1 w-4 h-4 text-[#422afb] border-[#a3aed0] rounded" />
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
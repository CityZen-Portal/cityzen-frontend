import React, { useState } from 'react';
import CitizenSignupSVG from '../../../assets/svg/citizen-signup.svg'; // Corrected path

const SignupCitizen = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadharNumber: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadharNumber.replace(/\s/g, ''))) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Handle form submission here
    }
  };

  const formatAadharNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleAadharChange = (e) => {
    const formattedValue = formatAadharNumber(e.target.value);
    if (formattedValue.replace(/\s/g, '').length <= 12) {
      setFormData(prev => ({
        ...prev,
        aadharNumber: formattedValue
      }));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-navy-900 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto gap-y-12 lg:gap-y-0 lg:gap-x-24 px-4 py-12">
        {/* Left Section - Form */}
        <div className="w-full lg:w-[48%] flex items-center justify-center">
          <div className="w-full max-w-xl dark:bg-navy-900 px-18">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Citizen Account</h1>
              <p className="text-gray-600 dark:text-gray-300">Enter your details to create a new citizen account</p>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Full Name*
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422afb] focus:border-transparent transition-colors ${
                    errors.fullName ? 'border-red-500' : 'border-[#a3aed0]'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Email*
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422afb] focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-[#a3aed0]'
                  }`}
                  placeholder="mail@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422afb] focus:border-transparent transition-colors pr-10 ${
                      errors.password ? 'border-red-500' : 'border-[#a3aed0]'
                    }`}
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Confirm Password*
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422afb] focus:border-transparent transition-colors pr-10 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-[#a3aed0]'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Aadhar Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Aadhar Number*
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleAadharChange}
                    className={`flex-1 px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#422afb] focus:border-transparent transition-colors ${
                      errors.aadharNumber ? 'border-red-500' : 'border-[#a3aed0]'
                    }`}
                    placeholder="1234 5678 9012"
                    maxLength="14"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // Handle Aadhar verification logic here
                      console.log('Verifying Aadhar:', formData.aadharNumber);
                    }}
                    className="px-4 py-3 bg-[#422afb] text-white rounded-lg hover:bg-[#1b254b] focus:outline-none focus:ring-2 focus:ring-[#422afb] focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                  >
                    Verify
                  </button>
                </div>
                {errors.aadharNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 text-[#422afb] border-[#a3aed0] rounded focus:ring-[#422afb]"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-[#422afb] hover:text-[#1b254b]">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-[#422afb] hover:text-[#1b254b]">Privacy Policy</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#422afb] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1b254b] focus:outline-none focus:ring-2 focus:ring-[#422afb] focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] mt-6"
              >
                Create Account
              </button>
            </form>

            {/* Sign In Link */}
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="#" className="text-[#422afb] hover:text-[#1b254b] font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Right Section - Illustration */}
        <div className="hidden lg:flex lg:w-[48%] dark:bg-navy-900 items-center justify-center relative overflow-hidden rounded-2xl min-h-[750px]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-20 left-20 w-32 h-32 bg-[#422afb] rounded-full opacity-20"></div>
              <div className="absolute top-40 right-32 w-24 h-24 bg-[#422afb] rounded-full opacity-15"></div>
              <div className="absolute bottom-32 left-16 w-40 h-40 bg-[#422afb] rounded-full opacity-10"></div>
              <div className="absolute bottom-20 right-20 w-20 h-20 bg-[#422afb] rounded-full opacity-25"></div>
            </div>
          </div>
          <div className="text-center text-[#1b254b] dark:text-white z-12 px-22 w-full max-w-xl">
            {/* SVG Illustration */}
            <div className="w-80 h-80 mx-auto mb-10 flex items-center justify-center">
              <img src={CitizenSignupSVG} alt="Citizen Signup" className="w-full h-full object-contain" />
            </div>
            {/* Content */}
            <h2 className="text-4xl font-bold mb-4 text-[#1b254b] dark:text-white">Welcome to CityZen</h2>
            <p className="text-xl mb-8 opacity-90 text-[#a3aed0] dark:text-gray-300">
              Join thousands of citizens making their city better, one report at a time.
            </p>
            {/* Features */}
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-[#422afb] bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-4 h-4 text-[#422afb]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[#1b254b] dark:text-white">Report civic issues instantly</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-[#422afb] bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-4 h-4 text-[#422afb]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[#1b254b] dark:text-white">Track resolution progress</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-[#422afb] bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-4 h-4 text-[#422afb]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[#1b254b] dark:text-white">Connect with your community</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-[#422afb] bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-4 h-4 text-[#422afb]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-[#1b254b] dark:text-white">Make a real difference</span>
              </div>
            </div>
          </div>
          {/* Floating Elements */}
          <div className="absolute top-10 right-10 w-3 h-3 bg-[#422afb] rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-2 h-2 bg-[#422afb] rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-1/2 right-10 w-1 h-1 bg-[#422afb] rounded-full opacity-80 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SignupCitizen;
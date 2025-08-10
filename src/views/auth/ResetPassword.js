import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Lock, Shield, CheckCircle, Sun, Moon } from "lucide-react";
import axios from "axios";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        return storedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  
  // Favicon setup and theme effect
  useEffect(() => {
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = "/brand-logo.png";
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.href = "/brand-logo.png";
      document.head.appendChild(newFavicon);
    }
    
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    return () => {
      if (favicon) {
        favicon.href = "/favicon.ico";
      }
    };
  }, [isDark]);
  
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;
    return Math.min(strength, 100);
  };
  
  const validatePassword = (password) => {
    if (!password) return 'New password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      return 'Password must contain uppercase, lowercase, number and special character';
    }
    return '';
  };
  
  useEffect(() => {
    const { newPassword, confirmPassword } = formData;
    const newErrors = {};
    newErrors.newPassword = validatePassword(newPassword);
    if (confirmPassword && confirmPassword.trim() !== newPassword.trim()) {
      newErrors.confirmPassword = 'Passwords do not match';
    } else {
      newErrors.confirmPassword = '';
    }
    setErrors(prev => ({ ...prev, ...newErrors }));
    
    // Update password strength
    if (newPassword) {
      setPasswordStrength(calculatePasswordStrength(newPassword));
    } else {
      setPasswordStrength(0);
    }
  }, [formData]);
  
  const validateForm = () => {
    const { newPassword, confirmPassword } = formData;
    const newErrors = {};
    newErrors.newPassword = validatePassword(newPassword);
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword.trim() !== newPassword.trim()) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).every(key => !newErrors[key]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();
    
    if (!token) {
      toast.error('Invalid reset token', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "!bg-red-500 !text-white"
      });
      return;
    }
    
    if (!validateForm()) {
      if (errors.newPassword) {
        toast.error(errors.newPassword, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "!bg-red-500 !text-white"
        });
      } else if (errors.confirmPassword) {
        toast.error(errors.confirmPassword, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "!bg-red-500 !text-white"
        });
      }
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://auth-backend-2-k3ph.onrender.com/api/auth/reset-password`,
        {
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        }
      );
      
      if (response.status === 200) {
        toast.success('Password reset successfully', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "!bg-green-500 !text-white",
          onClose: () => navigate('/auth/signin')
        });
      } else {
        throw new Error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to reset password', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        className: "!bg-red-500 !text-white"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };
  
  return (
    <div className="relative flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Theme Toggle - Top Right Corner */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed right-6 top-6 z-50 rounded-full border border-gray-200 bg-white p-3 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
      >
        {isDark ? (
          <Sun className="h-5 w-5 text-yellow-500" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600" />
        )}
      </button>
      
      {/* Toast Container - No global theme */}
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
      />
      
      {/* Left Side - Reset Password Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Header */}
          <div className="mb-8 text-left">
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Reset Password
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Create a new secure password for your CityZen account
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password*
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className={`w-full border px-4 py-3 pl-10 ${
                    errors.newPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600"
                  } rounded-lg bg-white focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showNewPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Password Strength
                    </span>
                    <span className={`text-xs font-medium ${
                      passwordStrength < 40 ? 'text-red-600' : 
                      passwordStrength < 70 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className={`h-2 rounded-full ${getStrengthColor()} transition-all duration-300`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {errors.newPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password*
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full border px-4 py-3 pl-10 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600"
                  } rounded-lg bg-white focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white`}
                  placeholder="Repeat new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* Password Requirements */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                Password Requirements:
              </h3>
              <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-400">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1.5" />
                  Minimum 8 characters
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1.5" />
                  Uppercase and lowercase letters
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1.5" />
                  At least one number
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1.5" />
                  At least one special character
                </li>
              </ul>
            </div>
            
            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors duration-300 hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
            
            {/* Back to Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => navigate('/auth/signin')}
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Back to Sign In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right Side - Security Illustration */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-blue-50 dark:bg-gray-800 lg:flex">
        <div className="max-w-lg px-8 text-center">
          {/* Security Icon */}
          <div className="mb-8 flex justify-center">
            <div className="p-6 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Shield className="h-16 w-16 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            <span className="text-blue-600">Secure Your Account</span>
          </h1>
          <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-300">
            Creating a strong password is essential to protect your CityZen account and personal information.
          </p>
          
          {/* Security Tips */}
          <div className="space-y-4 text-left">
            <div className="flex items-start space-x-3 text-gray-700 dark:text-gray-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  ✓
                </span>
              </div>
              <div>
                <p className="font-medium">Use a unique password</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Don't reuse passwords from other sites</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 text-gray-700 dark:text-gray-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  ✓
                </span>
              </div>
              <div>
                <p className="font-medium">Consider a passphrase</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Combine random words for better security</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 text-gray-700 dark:text-gray-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  ✓
                </span>
              </div>
              <div>
                <p className="font-medium">Enable two-factor authentication</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 text-gray-700 dark:text-gray-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  ✓
                </span>
              </div>
              <div>
                <p className="font-medium">Regularly update your password</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Change it every few months</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
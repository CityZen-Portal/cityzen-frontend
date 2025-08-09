import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InputField from "components/fields/InputField";
import Footer from "components/footer/FooterAuthDefault";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Lock } from "lucide-react";
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
  
  // Add useEffect to set favicon
  useEffect(() => {
    // Set favicon
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = "/brand-logo.png";
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.href = "/brand-logo.png";
      document.head.appendChild(newFavicon);
    }
    
    // Cleanup function to reset favicon when component unmounts
    return () => {
      if (favicon) {
        favicon.href = "/favicon.ico"; // Reset to default
      }
    };
  }, []);
  
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
        theme: "colored",
      });
      return;
    }

    if (!validateForm()) {
      if (errors.newPassword) {
        toast.error(errors.newPassword, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      } else if (errors.confirmPassword) {
        toast.error(errors.confirmPassword, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
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

      if (response.data.success) {
        toast.success('Password reset successfully! Redirecting to login...', {
          position: "top-right",
          autoClose: 2000,
          theme: "colored",
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
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-blue-100 via-blue-200 to-purple-100 
                    dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 
                    transition-all duration-300 overflow-y-auto">
      
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
        theme="colored"
      />
      
      {/* Decorative Gradient Blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500 rounded-full filter blur-3xl opacity-40"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-purple-600 rounded-full filter blur-2xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-400 rounded-full filter blur-2xl opacity-25"></div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 w-full">
        <div className="relative z-10 w-full max-w-2xl p-10 rounded-2xl shadow-2xl 
                        border border-blue-200 dark:border-gray-700 
                        bg-white/95 dark:bg-gray-700/95 backdrop-blur-md 
                        transition-all duration-300 my-8">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              {/* Logo with black outline */}
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src="/brand-logo.png"
                  alt="CityZen Logo"
                  className="w-14 h-14 rounded-lg border-2 border-black shadow-md"
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Reset Your Password
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your new password and confirm it below
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                New Password*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Enter your new password"
                  className={`w-full pl-10 pr-12 py-3 border ${errors.newPassword ? 'border-red-500' : 'border-blue-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-blue-600 dark:text-white transition-all duration-200 shadow-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Must contain: uppercase, lowercase, number, and special character
              </p>
            </div>
            
            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Confirm Password*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  className={`w-full pl-10 pr-12 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-blue-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-blue-600 dark:text-white transition-all duration-200 shadow-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
            
            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r
                       from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                       transition-all duration-300 shadow-lg mt-6 flex items-center justify-center hover:scale-[1.01] hover:shadow-xl
                       ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            
            {/* Back to Sign In Link */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => navigate('/auth/signin')}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer */}
      <div className="w-full py-4">
        <Footer />
      </div>
    </div>
  );
}
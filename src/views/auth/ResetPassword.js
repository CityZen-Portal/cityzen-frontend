import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from "components/fields/InputField";
import Footer from "components/footer/FooterAuthDefault";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ResetPassword() {
  const navigate = useNavigate();

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

    if (!validateForm()) {
      if (errors.newPassword) {
        toast.error(errors.newPassword);
      } else if (errors.confirmPassword) {
        toast.error(errors.confirmPassword);
      }
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password reset successfully! Redirecting...', { autoClose: 2000 });
      setTimeout(() => navigate('/auth/signin'), 2000);
    } catch (error) {
      toast.error(error.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 
                    dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
      
      <ToastContainer position="top-center" autoClose={5000} />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/80 dark:bg-gray-700/90 backdrop-blur-md">
          <h2 className="text-3xl font-bold mb-2 text-center text-blue-600 dark:text-white">
            Reset Password
          </h2>
          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
            Enter your new password and confirm it below
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                New Password*
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Enter your new password"
                  className={`w-full px-4 py-3 rounded-xl transition duration-200 focus:outline-none
                    bg-white dark:bg-gray-800 dark:text-white
                    ${errors.newPassword 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} 
                    border`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
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
              {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Must contain: uppercase, lowercase, number, and special character
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Confirm Password*
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  className={`w-full px-4 py-3 rounded-xl transition duration-200 focus:outline-none
                    bg-white dark:bg-gray-800 dark:text-white
                    ${errors.confirmPassword 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} 
                    border`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
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
              {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r
                         from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                         transition-transform duration-300 transform ${
                           isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                         } shadow-lg`}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          {/* Navigation */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/auth/signin')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
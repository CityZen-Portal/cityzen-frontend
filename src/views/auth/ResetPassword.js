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

  useEffect(() => {
    const { newPassword, confirmPassword } = formData;
    const newErrors = {};

    if (newPassword && newPassword.trim().length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else {
      newErrors.newPassword = '';
    }

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

    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.trim().length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword.trim() !== newPassword.trim()) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    if (!validateForm()) {
      toast.error('Please fix the validation errors.');
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
                  placeholder="Min. 8 characters"
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
                  {showNewPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>}
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
                  {showConfirmPassword ? '🙈' : '👁️'}
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

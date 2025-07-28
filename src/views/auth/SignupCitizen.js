import InputField from "components/fields/InputField";
import { useNavigate } from "react-router-dom";
import Checkbox from "components/checkbox";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "components/footer/FooterAuthDefault";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadharNumber: '',
    phoneNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Aadhaar verification states
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
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

  const handleEmailBlur = () => {
    validateEmail(formData.email);
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      toast.error("Name is required", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      toast.error("Email is required", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
      toast.error("Please enter a valid email address", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      toast.error("Password is required", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      toast.error("Password must be at least 8 characters", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
      toast.error("Password must contain uppercase, lowercase, number and special character", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      toast.error("Please confirm your password", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      toast.error("Passwords do not match", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }

    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      toast.error("Phone number is required", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
      toast.error("Phone number must be 10 digits", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }

    // Aadhar validation
    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar number is required';
      toast.error("Aadhar number is required", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    } else if (!/^\d{12}$/.test(formData.aadharNumber.replace(/\s/g, ''))) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
      toast.error("Aadhar number must be 12 digits", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }

    // Terms validation
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and policy';
      toast.error("You must agree to the terms and policy", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success("Account created successfully! Redirecting...", {
        position: 'top-right',
        autoClose: 1000,
        theme: 'colored',
        onClose: () => navigate("/citizen/dashboard"),
      });
    } else {
      Object.values(errors).forEach(error => {
        if (error && typeof error === 'string') {
          toast.error(error, {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          });
        }
      });
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
      // Reset verification if Aadhaar is changed
      if (aadhaarVerified) {
        setAadhaarVerified(false);
      }
    }
  };

  const handleAadhaarVerify = async () => {
    const cleanAadhaar = formData.aadharNumber.replace(/\s/g, '');
    if (!/^\d{12}$/.test(cleanAadhaar)) {
      setErrors(prev => ({ ...prev, aadharNumber: 'Aadhar number must be 12 digits' }));
      return;
    }

    setAadhaarSending(true);
    setErrors(prev => ({ ...prev, aadharNumber: '' }));

    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setAadhaarVerified(true);
    setAadhaarSending(false);
    toast.success("Aadhaar number verified successfully!", {
      position: 'top-right',
      autoClose: 3000,
      theme: 'colored',
    });
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 
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
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-40"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full filter blur-2xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-300 rounded-full filter blur-2xl opacity-25"></div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 w-full">
        <div className="relative z-10 w-full max-w-2xl p-10 rounded-2xl shadow-2xl 
                        border border-blue-100 dark:border-gray-700 
                        bg-white/80 dark:bg-gray-700/90 backdrop-blur-md 
                        transition-all duration-300 my-8">

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            Create Citizen Account
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Enter your details to create a new citizen account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Full Name*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${errors.name ? 'border-red-500' : 'border-[#a3aed0]'
                  }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-[#a3aed0]'
                  }`}
                placeholder="mail@example.com"
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password*</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${errors.password ? 'border-red-500' : 'border-[#a3aed0]'
                    }`}
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
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
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Confirm Password*</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${errors.confirmPassword ? 'border-red-500' : 'border-[#a3aed0]'
                    }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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

            {/* Phone Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Phone Number*</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${errors.phoneNumber ? 'border-red-500' : 'border-[#a3aed0]'
                  }`}
                placeholder="9876543210"
                maxLength="10"
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
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
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200 ${errors.aadharNumber ? 'border-red-500' : 'border-[#a3aed0]'
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
                  className={`px-4 py-3 rounded-lg text-sm font-medium ${aadhaarVerified
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                    } ${aadhaarSending ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {aadhaarSending ? 'Verifying...' : aadhaarVerified ? 'Verified' : 'Verify'}
                </button>
              </div>
              {errors.aadharNumber && <p className="mt-1 text-sm text-red-600">{errors.aadharNumber}</p>}
            </div>

            {/* Terms */}
            <div className="pt-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className={errors.terms ? 'border-red-500' : ''}
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                  I agree to the <a href="#" className="text-[#422afb] hover:text-[#1b254b]">Terms of Service</a> and <a href="#" className="text-[#422afb] hover:text-[#1b254b]">Privacy Policy</a>
                </label>
              </div>
              {errors.terms && (
                <p className="mt-1 ml-6 text-sm text-red-600">
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!aadhaarVerified || !agreeTerms}
              className={`w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r
                       from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                       transition-all duration-300 shadow-lg mt-6 ${(!aadhaarVerified || !agreeTerms) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'
                }`}
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

      {/* Footer */}
      <div className="w-full py-4">
        <Footer />
      </div>
    </div>
  );
}
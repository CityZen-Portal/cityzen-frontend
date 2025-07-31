import InputField from "components/fields/InputField";
import { useNavigate } from "react-router-dom";
import Checkbox from "components/checkbox";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "components/footer/FooterAuthDefault";
import { ChevronDown, User, Mail, Lock, Phone, Shield, CheckCircle } from "lucide-react";
export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadharNumber: '',
    phoneNumber: '',
    gender: '' // Added gender field
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
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
    }
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
    }
    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
    }
    // Aadhar validation
    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadharNumber.replace(/\s/g, ''))) {
      newErrors.aadharNumber = 'Aadhar number must be 12 digits';
    }
    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    // Terms validation
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms and policy';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Object.values(errors).forEach(error => {
        if (error && typeof error === 'string') {
          toast.error(error, {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          });
        }
      });
      return;
    }
    // Prepare user data for backend
    const userData = {
      username: formData.name,
      email: formData.email,
      password: formData.password,
      aadharNumber: parseInt(formData.aadharNumber.replace(/\s/g, '')),
      phoneNumber: formData.phoneNumber,
      gender: formData.gender, // Added gender to user data
      role: ["user"] // Default role
    };
    try {
      const response = await fetch("https://auth-backend-obcu.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Account created successfully! Redirecting...", {
          position: 'top-right',
          autoClose: 1000,
          theme: 'colored',
          onClose: () => navigate("/citizen/dashboard"),
        });
      } else {
        // Handle backend validation errors
        const errorMsg = result.message || result.error || "Registration failed";
        toast.error(errorMsg, {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Network error. Please try again.", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
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
    try {
      const response = await fetch(`https://auth-backend-obcu.onrender.com/api/auth/userInfo/${cleanAadhaar}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (response.ok) {
        if (result.data === true) {
          toast.error("Aadhaar number already registered", {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          });
          setErrors(prev => ({ ...prev, aadharNumber: 'Aadhaar number already registered' }));
        } else {
          setAadhaarVerified(true);
          toast.success("Aadhaar number verified successfully!", {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          });
        }
      } else {
        setAadhaarVerified(true); // Assuming verification passes if not found in system
        toast.success("Aadhaar number verified successfully!", {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification service unavailable. Please try again.", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    } finally {
      setAadhaarSending(false);
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
              Create Citizen Account
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Join CityZen to transform your city experience
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-500' : 'border-blue-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-blue-600 dark:text-white transition-all duration-200 shadow-sm`}
                placeholder="Full Name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleEmailBlur}
                className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-blue-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-blue-600 dark:text-white transition-all duration-200 shadow-sm`}
                placeholder="Email Address"
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-500' : 'border-blue-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-blue-600 dark:text-white transition-all duration-200 shadow-sm`}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
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
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            
            {/* Confirm Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-blue-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-blue-600 dark:text-white transition-all duration-200 shadow-sm`}
                placeholder="Confirm Password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
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
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
            
            {/* Phone Number Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border ${errors.phoneNumber ? 'border-red-500' : 'border-blue-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-blue-600 dark:text-white transition-all duration-200 shadow-sm`}
                placeholder="Phone Number"
                maxLength="10"
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>
            
            {/* Gender Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-blue-500" />
              </div>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-10 py-3 border ${errors.gender ? 'border-red-500' : 'border-blue-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-blue-600 dark:text-white transition-all duration-200 shadow-sm appearance-none`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-blue-500" />
              </div>
              {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
            </div>
            
            {/* Aadhar Number */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleAadharChange}
                  disabled={aadhaarVerified}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.aadharNumber ? 'border-red-500' : 'border-blue-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-blue-600 dark:text-white transition-all duration-200 shadow-sm ${aadhaarVerified ? 'bg-blue-50 dark:bg-blue-900/20 cursor-not-allowed' : ''}`}
                  placeholder="Aadhar Number"
                  maxLength="14"
                />
                {aadhaarVerified && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAadhaarVerify}
                  disabled={aadhaarVerified || aadhaarSending}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${aadhaarVerified
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                    } ${aadhaarSending ? 'opacity-50 cursor-not-allowed' : ''} transition-all duration-300 shadow-sm`}
                >
                  {aadhaarSending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : aadhaarVerified ? (
                    <>
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Verified
                    </>
                  ) : (
                    'Verify Aadhaar'
                  )}
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
                  I agree to the <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">Privacy Policy</a>
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
                       from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                       transition-all duration-300 shadow-lg mt-6 flex items-center justify-center ${(!aadhaarVerified || !agreeTerms) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] hover:shadow-xl'}`}
            >
              Create Account
            </button>
          </form>
          
          {/* Already have account */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <button
                onClick={() => navigate("/auth/signin")}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="w-full py-4">
        <Footer />
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import InputField from "components/fields/InputField";
import { useNavigate } from "react-router-dom";
import Checkbox from "components/checkbox";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "components/footer/FooterAuthDefault";
import {
  ChevronDown,
  User,
  Mail,
  Lock,
  Phone,
  Shield,
  CheckCircle,
  Sun,
  Moon,
  Edit,
} from "lucide-react";
import signupImage from "./assets/undraw_to-do-list_o3jf.svg";
import loading_gif from "../../assets/gif/loading-gif.gif";
import axios from "axios";
const apiurl = process.env.REACT_APP_API_UMS_URL;
export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    aadharNumber: "",
    phoneNumber: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [aadhaarSending, setAadhaarSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Main loading state
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
  // Add useEffect to set favicon and theme
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
    // Apply theme
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    // Cleanup function to reset favicon when component unmounts
    return () => {
      if (favicon) {
        favicon.href = "/favicon.ico"; // Reset to default
      }
    };
  }, [isDark]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const validateEmail = (email) => {
    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
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
      newErrors.name = "Name is required";
    }
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number and special character";
    }
    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }
    // Aadhar validation
    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = "Aadhar number is required";
    } else if (!/^\d{12}$/.test(formData.aadharNumber.replace(/\s/g, ""))) {
      newErrors.aadharNumber = "Aadhar number must be 12 digits";
    }
    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }
    // Terms validation
    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms and policy";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Show first error found
      const firstError = Object.values(errors).find(error => error && typeof error === "string");
      if (firstError) {
        toast.error(firstError, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
      return;
    }
    const userData = {
      userName: formData.name,
      email: formData.email,
      password: formData.password,
      aadhaar: parseInt(formData.aadharNumber.replace(/\s/g, "")),
      phoneNumber: formData.phoneNumber,
      gender: formData.gender, 
      role: "CITIZEN", 
    };
    try {
      setIsLoading(true); 
      const response = await fetch(`${apiurl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      console.log(JSON.stringify(userData));
      const result = await response.json();
      if (response.ok) {
        toast.success("Account created successfully! Redirecting...", {
          position: "top-right",
          autoClose: 1000,
          theme: "colored",
          onClose: () => navigate("/auth/signin"),
        });
      } else {
        const errorMsg = result.message || result.error || "Registration failed";
        
        // Check if the error is related to Aadhaar already being used
        if (errorMsg.toLowerCase().includes("aadhaar") && 
            (errorMsg.toLowerCase().includes("already") || 
             errorMsg.toLowerCase().includes("exists") || 
             errorMsg.toLowerCase().includes("registered"))) {
          
          // Reset Aadhaar verification status to make the field editable
          setAadhaarVerified(false);
          
          // Set specific error for Aadhaar field
          setErrors((prev) => ({
            ...prev,
            aadharNumber: "Aadhaar number is already used"
          }));
          
          toast.error("Aadhaar number is already used", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          });
        } else {
          toast.error(errorMsg, {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
          });
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Network error. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  const formatAadharNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };
  const handleAadharChange = (e) => {
    const formatted = formatAadharNumber(e.target.value);
    if (formatted.replace(/\s/g, "").length <= 12) {
      setFormData((prev) => ({ ...prev, aadharNumber: formatted }));
      // Reset verification if Aadhaar is changed
      if (aadhaarVerified) {
        setAadhaarVerified(false);
      }
      // Clear any existing Aadhaar errors when user starts editing
      if (errors.aadharNumber) {
        setErrors((prev) => ({ ...prev, aadharNumber: "" }));
      }
    }
  };
  const handleAadhaarVerify = async () => {
    const cleanAadhaar = formData.aadharNumber.replace(/\s/g, "");
    if (!/^\d{12}$/.test(cleanAadhaar)) {
      setErrors((prev) => ({
        ...prev,
        aadharNumber: "Aadhar number must be 12 digits",
      }));
      return;
    }
    setAadhaarSending(true);
    setErrors((prev) => ({ ...prev, aadharNumber: "" }));
    try {
      const response = await axios.post(`${apiurl}/api/auth/verify-aadhaar`, {
        aadhaar: cleanAadhaar,
      });
      const result = response.data;
      // For verification, we allow it to succeed even if Aadhaar exists
      // The actual "already used" check will happen during account creation
      setAadhaarVerified(true);
      toast.success("Aadhaar number verified successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      
    } catch (error) {
      console.error("Verification error:", error);
      
      // Check if error response contains information about invalid Aadhaar
      let errorMessage = "Verification service unavailable. Please try again.";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMsg = error.response.data?.message || error.response.data?.error;
        
        if (errorMsg) {
          // Check if the error message indicates invalid Aadhaar
          if (errorMsg.toLowerCase().includes("invalid") || 
              errorMsg.toLowerCase().includes("not found") || 
              errorMsg.toLowerCase().includes("does not exist") ||
              errorMsg.toLowerCase().includes("not valid")) {
            errorMessage = "Aadhaar is invalid";
          }
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      // Set the error message for the Aadhaar field
      setErrors((prev) => ({
        ...prev,
        aadharNumber: errorMessage
      }));
      
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setAadhaarSending(false);
    }
  };
  return (
    <div className="relative flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <img
            src={loading_gif}
            alt="Loading..."
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
        </div>
      )}
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
      {/* Left Side - Sign Up Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Header */}
          <div className="mb-8 text-left">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Create CityZen Account
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Join our platform to access municipal services and connect with
              your community
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4" data-form-type="other" autoComplete="off">
            {/* Name Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name*
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full border px-4 py-3 ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            </div>
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email*
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleEmailBlur}
                  disabled={isLoading}
                  className={`w-full border px-4 py-3 ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white`}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
            {/* Password Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="new-password"
                  data-form-type="other"
                  className={`w-full border px-4 py-3 pr-12 ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white`}
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            {/* Confirm Password Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password*
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="new-password"
                  data-form-type="other"
                  className={`w-full border px-4 py-3 pr-12 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showConfirmPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            {/* Phone Number Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number*
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full border px-4 py-3 ${
                    errors.phoneNumber
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white`}
                  placeholder="10-digit phone number"
                  maxLength="10"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>
            {/* Gender Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Gender*
              </label>
              <div className="relative">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full border px-4 py-3 ${
                    errors.gender
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } appearance-none rounded-lg bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>
            </div>
            {/* Aadhar Number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Aadhaar Number*
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleAadharChange}
                  disabled={isLoading}
                  className={`w-full border px-4 py-3 ${
                    errors.aadharNumber
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } rounded-lg bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white`}
                  placeholder="12-digit Aadhaar number"
                  maxLength="14"
                />
                {aadhaarVerified && !errors.aadharNumber && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAadhaarVerify}
                  disabled={aadhaarSending || isLoading}
                  className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
                    aadhaarVerified && !errors.aadharNumber
                      ? "cursor-not-allowed bg-green-100 text-green-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } ${
                    aadhaarSending || isLoading ? "cursor-not-allowed opacity-50" : ""
                  } transition-colors duration-300`}
                >
                  {aadhaarSending ? (
                    <>
                      <svg
                        className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </>
                  ) : aadhaarVerified && !errors.aadharNumber ? (
                    <>
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Verified
                    </>
                  ) : (
                    "Verify Aadhaar"
                  )}
                </button>
              </div>
              {errors.aadharNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.aadharNumber}
                </p>
              )}
            </div>
            {/* Terms */}
            <div className="pt-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className={errors.terms ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 dark:text-gray-300"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.terms && (
                <p className="ml-6 mt-1 text-sm text-red-600">{errors.terms}</p>
              )}
            </div>
            {/* Submit */}
            <button
              type="submit"
              disabled={!aadhaarVerified || !agreeTerms || isLoading}
              className={`w-full rounded-lg px-4 py-3 font-medium text-white transition-colors duration-300 ${
                isLoading 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : !aadhaarVerified || !agreeTerms
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          {/* Already have account */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/auth/signin")}
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
        {/* Footer */}
        {/* <div className="w-full py-4 mt-auto">
          <Footer />
        </div> */}
      </div>
      {/* Right Side - Illustration */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-blue-50 dark:bg-gray-800 lg:flex">
        <div className="max-w-lg px-8 text-center">
          {/* Illustration Image */}
          <div className="mb-8">
            <img
              src={signupImage}
              alt="Citizen Signup Illustration"
              className="mx-auto w-full max-w-md"
            />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            <span className="text-blue-600">Join CityZen</span>
          </h1>
          <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-300">
            Create your account to access municipal services, report civic
            issues, and stay connected with your community through our
            comprehensive citizen portal.
          </p>
          {/* Feature Checkmarks */}
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  ✓
                </span>
              </div>
              <span>Secure identity verification with Aadhaar</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  ✓
                </span>
              </div>
              <span>Access all municipal services online</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  ✓
                </span>
              </div>
              <span>Report and track civic issues</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  ✓
                </span>
              </div>
              <span>Stay updated with city notifications</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
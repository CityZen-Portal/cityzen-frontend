import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sun, Moon } from "lucide-react";
import { useUser } from "../../../contexts/UserContext";
import Checkbox from "components/checkbox";
import images from "../assets/Mobile login-rafiki.svg";
import loading_gif from "../../../assets/gif/loading-gif.gif";

export default function SignIn() {
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Fixed: Added fallback URL
  const apiurl = process.env.REACT_APP_API_UMS_URL || "http://localhost:3000";
  const { login } = useUser();
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
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
    return () => {
      if (favicon) {
        favicon.href = "/favicon.ico";
      }
    };
  }, [isDark]);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error("Email is required to reset password", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }
    
    // Fixed: Added API URL validation
    if (!apiurl) {
      toast.error("Server configuration error. Please contact support.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await axios.get(`https://utility-booking-backend.onrender.com/api/staff/email/${email}`);
      const id = res.data.id;
      const staffresponse = await axios.put(`https://utility-booking-backend.onrender.com/api/staff/reset-password-request/${id}?isRequestToResetPassword=true`);
      // console.log(staffresponse.status);
      if (staffresponse.status === 200) {
        toast.success('Password reset requested,', {
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
         setShowForgotPassword(false);
      }
       else{
      
      
    }
    } catch (error) {
      console.log(error.response.status)
      if(error.response.status===404)
      {
        const response = await axios.post(`${apiurl}/api/auth/forgot-password`, {
        email,
      });
      if (response.data.success) {
        toast.success(`Password reset link sent to ${email}`, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        setShowForgotPassword(false);
      } else {

        toast.success(response.data.message || "Failed to send reset link", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
      }
      else{
      console.error("Password reset error:", error);
      const errorMsg =
        error.response?.data?.message || "Error sending reset link";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex = /^.{4,}$/;

    if (!validateEmail(email)) {
      toast.error("Enter a valid email", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      setEmailState("error");
      return;
    } else {
      setEmailState("success");
    }

    if (!passwordRegex.test(password)) {
      toast.error("Enter a strong password", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      setPasswordState("error");
      return;
    } else {
      setPasswordState("success");
    }

    if (!apiurl) {
      toast.error("Server configuration error. Please contact support.", {
        position: "top-right",
        autoClose: 5000,
        theme: "colored",
      });
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(`${apiurl}/api/auth/login`, {
        email,
        password,
      });
      
      // Fixed: Destructure using the correct field name from backend (userName, not username)
      const {
        accessToken,
        roles,
        userName,  // ✅ This matches the backend field name exactly
        email: userEmail,
        id,
      } = response.data.data;
      
      // Debug log to verify the data
      console.log("Login response data:", response.data.data);
      console.log("UserName from response:", userName);
      
      // Pass the userName directly to the login function
      login({
        token: accessToken,
        userName: userName,  // ✅ This will now contain the actual username
        email: userEmail,
        role: roles,
        id,
      });
      
      toast.success("Login successful", {
        position: "top-right",
        autoClose: 1000,
        theme: "colored",
        onClose: () => {
          if (roles.includes("STAFF")) {
            navigate("/staff/dashboard");
          } else if (roles.includes("CITIZEN")) {
            navigate("/citizen/dashboard");
          } else if (roles.includes("ADMIN")) {
            navigate("/admin/dashboard");
          }
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      const errorMsg =
        error.response?.data?.message || "Invalid credentials or server error";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
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
      {/* Left Side - Sign In Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Header */}
          <div className="mb-8 text-left">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Welcome Back to CityZen
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to access your citizen portal and manage civic services
            </p>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className="space-y-6" 
            data-form-type="other" 
            autoComplete="off"
            data-lpignore="true"
          >
            {/* Email Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email*
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border px-4 py-3 ${emailState === "error"
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600"
                    } rounded-lg bg-white focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white`}
                  placeholder="Enter your email"
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  disabled={isLoading}
                />
                {emailState === "error" && (
                  <p className="mt-2 text-sm text-red-600">
                    Enter a valid email
                  </p>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border px-4 py-3 pr-12 ${passwordState === "error"
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600"
                    } rounded-lg bg-white focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white`}
                  placeholder="Min. 8 characters"
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                {passwordState === "error" && (
                  <p className="mt-2 text-sm text-red-600">
                    Enter a strong password
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>
            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-lg px-4 py-3 font-medium text-white transition-colors duration-300 ${isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isLoading ? "Signing In..." : "Sign In to Your Account"}
            </button>
            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/auth/signup")}
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  disabled={isLoading}
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
      {/* Right Side - Illustration */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-blue-50 dark:bg-gray-800 lg:flex">
        <div className="max-w-lg px-8 text-center">
          {/* Illustration Image */}
          <div className="mb-8">
            <img
              src={images}
              alt="Citizen Portal Illustration"
              className="mx-auto w-full max-w-md"
            />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            <span className="text-blue-600">Citizen Portal</span>
          </h1>
          <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-300">
            Access municipal services, report civic issues, and stay connected
            with your community through our comprehensive citizen portal.
          </p>
          {/* Feature Checkmarks */}
          <div className="space-y-4 text-left">
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
              <span>Access municipal services online</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  ✓
                </span>
              </div>
              <span>Stay updated with city notifications</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  ✓
                </span>
              </div>
              <span>Secure digital identity verification</span>
            </div>
          </div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="mb-6 text-center">
              <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Reset Password
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enter your email to receive a password reset link
              </p>
            </div>
            <div className="relative mb-6">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                disabled={isLoading}
              />
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className={`mb-4 w-full rounded-lg px-4 py-3 font-medium text-white transition-colors duration-300 ${isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                disabled={isLoading}
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
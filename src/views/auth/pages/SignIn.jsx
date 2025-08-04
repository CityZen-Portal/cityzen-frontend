import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sun, Moon } from "lucide-react";
import { useUser } from "../../../contexts/UserContext";
import Checkbox from "components/checkbox";
import images from "../assets/Mobile login-rafiki.svg"

export default function SignIn() {
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const apiurl = process.env.REACT_APP_API_UMS_URL;
  const { login } = useUser();
  
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
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
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    return () => {
      if (favicon) {
        favicon.href = "/favicon.ico";
      }
    };
  }, [isDark]);
  
  const handleForgotPassword = () => {
    if (!email.trim()) {
      toast.error("Email is required to reset password", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }
    if (!validateEmail(email.trim())) {
      toast.error("Enter a valid email", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }
    console.log("Password reset requested for:", email);
    setShowForgotPassword(false);
    toast.success(`Password reset link sent to ${email}`, {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });
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
    try {
      const response = await axios.post(
        `https://auth-backend-obcu.onrender.com/api/auth/login`,
        { email, password }
      );
      const token = response.data.data.token;
      const roles = response.data.data.roles[0];
      login({
        token: token,
        username: response.data.data.username,
        email: response.data.data.email,
        role: response.data.data.roles,
        id: response.data.data.id,
      });
      toast.success("Login successful", {
        position: "top-right",
        autoClose: 1000,
        theme: "colored",
        onClose: () => {
          if (roles.includes("ROLE_STAFF")) {
            navigate("/staff/dashboard");
          } else if (roles.includes("ROLE_USER")) {
            navigate("/citizen/dashboard");
          } else if (roles.includes("ROLE_ADMIN")) {
            navigate("/admin/dashboard");
          } else {
            navigate("/");
          }
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials or server error", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 relative">
      {/* Theme Toggle - Top Right Corner */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600" />
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
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Header */}
          <div className="text-left mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back to CityZen
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to access your citizen portal and manage civic services
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email*
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border ${
                    emailState === 'error' 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                  } rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 dark:text-white`}
                  placeholder="Enter your email"
                  autoComplete="email"
                />
                {emailState === 'error' && (
                  <p className="mt-2 text-sm text-red-600">Enter a valid email</p>
                )}
              </div>
            </div>
            
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 pr-12 border ${
                    passwordState === 'error' 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                  } rounded-lg focus:outline-none focus:ring-2 bg-white dark:bg-gray-800 dark:text-white`}
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                {passwordState === 'error' && (
                  <p className="mt-2 text-sm text-red-600">Enter a strong password</p>
                )}
              </div>
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>
            </div>
            
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Forgot password?
              </button>
            </div>
            
            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Sign In to Your Account
            </button>
            
            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate("/auth/signup")}
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right Side - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-blue-50 dark:bg-gray-800 relative overflow-hidden items-center justify-center">
        <div className="text-center max-w-lg px-8">
          {/* Illustration Image */}
          <div className="mb-8">
            <img
              src={images}
              alt="Citizen Portal Illustration"
              className="w-full max-w-md mx-auto"
            />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="text-blue-600">Citizen Portal</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Access municipal services, report civic issues, and stay connected with your community through our comprehensive citizen portal.
          </p>
          
          {/* Feature Checkmarks */}
          <div className="space-y-4 text-left">
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-sm">✓</span>
              </div>
              <span>Report and track civic issues</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-sm">✓</span>
              </div>
              <span>Access municipal services online</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-sm">✓</span>
              </div>
              <span>Stay updated with city notifications</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-sm">✓</span>
              </div>
              <span>Secure digital identity verification</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Reset Password
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enter your email to receive a password reset link
              </p>
            </div>
            
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 mb-4 transition-colors duration-300"
            >
              Send Reset Link
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
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
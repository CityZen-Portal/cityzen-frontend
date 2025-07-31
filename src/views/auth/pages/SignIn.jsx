import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import { Form, useNavigate } from "react-router-dom";
import Checkbox from "components/checkbox";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Footer from "components/footer/FooterAuthDefault";
import axios from "axios";
import { Mail, Lock } from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const apiurl = process.env.REACT_APP_API_UMS_URL;
  console.log(apiurl);
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
    console.log("Form submitted");
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
        {
          email,
          password,
        }
      );
      const token = response.data.data.token;
      const roles = response.data.data.roles[0];
      localStorage.setItem("token", token);
      localStorage.setItem("username", response.data.data.username);
      localStorage.setItem("email", response.data.data.email);
      localStorage.setItem("role", JSON.stringify(roles));
      localStorage.setItem("id", response.data.data.id);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
          }
          else{
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
              Sign In to Your Account
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back! Please enter your credentials
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border ${emailState === 'error' ? 'border-red-500' : 'border-blue-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-blue-600 dark:text-white transition-all duration-200 shadow-sm`}
                placeholder="Email Address"
                autoComplete="email"
              />
              {emailState === 'error' && <p className="mt-1 text-sm text-red-600">Enter a valid email</p>}
            </div>
            
            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border ${passwordState === 'error' ? 'border-red-500' : 'border-blue-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-blue-600 dark:text-white transition-all duration-200 shadow-sm`}
                placeholder="Password"
              />
              {passwordState === 'error' && <p className="mt-1 text-sm text-red-600">Enter a strong password</p>}
            </div>
            
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox color="blue" />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Forgot Password?
              </button>
            </div>
            
            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r
                       from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                       transition-all duration-300 shadow-lg mt-6 flex items-center justify-center hover:scale-[1.01] hover:shadow-xl"
            >
              Sign In
            </button>
            
            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate("/auth/signup")}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Create Account
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Footer */}
      <div className="w-full py-4">
        <Footer />
      </div>
      
      {/* Forgot Password Popup */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md rounded-2xl border border-blue-200 
                          bg-white/95 p-6 shadow-2xl backdrop-blur-md 
                          transition-all duration-300 dark:border-gray-700 dark:bg-gray-700/95">
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
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-blue-600 dark:text-white transition-all duration-200 shadow-sm"
                placeholder="Email Address"
                autoComplete="email"
              />
            </div>
            
            <button
              type="button"
              onClick={handleForgotPassword}
              className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r
                       from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                       transition-all duration-300 shadow-lg mt-6 flex items-center justify-center hover:scale-[1.01] hover:shadow-xl"
            >
              Send Reset Link
            </button>
            
            <div className="mt-4 text-center">
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
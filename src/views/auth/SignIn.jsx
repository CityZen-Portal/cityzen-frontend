import InputField from "components/fields/InputField";
import { useNavigate } from "react-router-dom";
import Checkbox from "components/checkbox";
import { useState } from "react";

export default function SignIn() {
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgotPassword = () => {
    // Here you would typically send a password reset email
    console.log("Password reset requested for:", email);
    setShowForgotPassword(false);
    // You might want to show a success message here
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 
                    bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 
                    dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 
                    transition-all duration-300 overflow-hidden">
      
      {/* Decorative Gradient Blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-40"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full filter blur-2xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-300 rounded-full filter blur-2xl opacity-25"></div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl 
                      border border-blue-100 dark:border-gray-700 
                      bg-white/80 dark:bg-gray-700/90 backdrop-blur-md 
                      transition-all duration-300">
        
        {/* Title */}
        <h2 className="text-4xl font-extrabold mb-2 text-center text-blue-700 dark:text-white">
          Sign In
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
          Enter your email and password to access your account
        </p>

        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-4"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="text"
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-4"
          label="Password*"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
        />

        {/* Checkbox + Forgot Password */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-gray-700 dark:text-white">Keep me logged In</p>
          </div>
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-300"
          >
            Forgot Password?
          </button>
        </div>

        {/* Sign In Button */}
        <button
        onClick={() => navigate("/citizen/dashboard")}
          className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r
                     from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                     transition-transform duration-300 transform hover:scale-105 shadow-lg"
        >
          Sign In
        </button>

        {/* Sign Up */}
        <div className="text-center mt-6">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Not registered yet?
          </span>
          <button
            onClick={() => navigate("/auth/signup")}
            className="ml-1 text-sm font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-300"
          >
            Create an account
          </button>
        </div>
      </div>

      {/* Forgot Password Popup */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 mx-4 rounded-2xl shadow-2xl 
                          border border-blue-100 dark:border-gray-700 
                          bg-white dark:bg-gray-800
                          transition-all duration-300">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold mb-2 text-center text-blue-700 dark:text-white">
              Reset Password
            </h3>
            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
              Enter your email to receive a password reset link
            </p>

            <InputField
              variant="auth"
              extra="mb-6"
              label="Email*"
              placeholder="mail@simmmple.com"
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleForgotPassword}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r
                         from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                         transition-transform duration-300 transform hover:scale-105 shadow-lg"
            >
              Send Reset Link
            </button>

            <div className="text-center mt-4">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-300"
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
import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField"
import { useNavigate } from "react-router-dom";
import Checkbox from "components/checkbox";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Footer from "components/footer/FooterAuthDefault";

export default function SignIn() {
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Test@1234"); // for testing
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleForgotPassword = () => {
    if (!email.trim()) {
      toast.error("Email is required to reset password", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
      return;
    }
    if(!validateEmail(email.trim())){
      toast.error("Enter a valid email", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
      return;
    }
    console.log("Password reset requested for:", email);
    
    setShowForgotPassword(false);
    toast.success(`Password reset link sent to ${email}`, {
      position: 'top-right',
      autoClose: 2000,
      theme: 'colored'
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Email validation
    if (!validateEmail(email)) {
      toast.error("Enter a valid email", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
      setEmailState("error")
      return;
    }
    else{
      setEmailState("success")
    }

    // Paswsord validation
    if (!passwordRegex.test(password)) {
      toast.error("Enter a strong password", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
      setPasswordState("error")
      return;
    }
    else{
      setPasswordState("success")
    }

  // Login Success
  toast.success("Login successful", {
    position: 'top-right',
    autoClose: 1000,
    theme: 'colored',
    onClose: () => navigate("/citizen/dashboard"),
  });
};


  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 
                    dark:from-navy-900 dark:via-navy-900 dark:to-navy-900 
                    transition-all duration-300">
      
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400 dark:bg-navy-600 rounded-full filter blur-3xl opacity-40"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 dark:bg-navy-600 rounded-full filter blur-2xl opacity-30"></div>
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-300 dark:bg-navy-600 rounded-full filter blur-2xl opacity-25"></div>

      <div className="flex-1 flex items-center justify-center p-4">
        {/* Auth Card */}
        <div className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-2xl 
                        border border-blue-100 dark:border-none 
                        bg-white/80 dark:bg-navy-700/90 backdrop-blur-md 
                        transition-all duration-300">
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <h2 className="text-4xl font-extrabold mb-2 text-center text-brand-500 dark:text-white">
              Sign In
            </h2>
            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
              Enter your email and password to access your account
            </p>

            {/* Email */}
            <InputField
              key={1}
              variant="auth"
              extra="mb-4"
              label="Email*"
              placeholder="mail@simple.com"
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              state={emailState}
            />

            {/* Password */}
            <PasswordField
              label="Password*"
              id="password"
              placeholder="password"
              variant="auth"
              extra="mb-4"
              state={passwordState}
              disabled={false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />




            {/* Checkbox + Forgot Password */}
            <div className="mb-4 flex items-center justify-between text-sm">
              <div className="flex items-center">
                
                <label className="flex items-center text-gray-700 dark:text-white gap-2 cursor-pointer">
                  <Checkbox color={'blue'} />
                  Keep me logged in
                </label>

              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-blue-400"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r
                        from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700
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
                className="ml-1 text-sm font-semibold text-brand-500 hover:text-brand-600 dark:text-brand-300"
              >
                Create an account
              </button>
            </div>
            
          </form>
        </div>
      </div>

      {/* Footer - Aligned to bottom */}
      <div className="w-full py-4">
        <Footer />
      </div>

      {/* Forgot Password Popup */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 mx-4 rounded-2xl shadow-2xl 
                          border border-blue-100 dark:border-gray-700 
                          bg-white dark:bg-gray-800
                          transition-all duration-300">
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl font-bold mb-2 text-center text-brand-500 dark:text-white">
              Reset Password
            </h3>
            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
              Enter your email to receive a password reset link
            </p>

            <InputField
              key={3}
              variant="auth"
              extra="mb-6"
              label="Email*"
              placeholder="mail@simple.com"
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="button"
              onClick={handleForgotPassword}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r
                         from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700
                         transition-transform duration-300 transform hover:scale-105 shadow-lg"
            >
              Send Reset Link
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-300"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
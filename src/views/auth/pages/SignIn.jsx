import InputField from "../components/InputField";
import PasswordField from "../components/PasswordField";
import { Form, useNavigate } from "react-router-dom";
import Checkbox from "components/checkbox";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Footer from "components/footer/FooterAuthDefault";
import axios from "axios";
import { ProgressCircleCircle } from "@chakra-ui/react";

export default function SignIn() {
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Test@1234");
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const apiurl = process.env.REACT_APP_API_UMS_URL;
  console.log(apiurl);

  const [userRole, setUserRole] = useState("");

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
      const response = await axios.post(`${apiurl}/api/auth/login`, {
        email,
        password,
      });

      const token = response.data.token;
      const roles = response.data.roles;

      localStorage.setItem("token", token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("role", JSON.stringify(roles));
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
          } else {
            navigate("/admin/dashboard");
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
    <div
      className="fixed inset-0 flex flex-col bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 
                    transition-all duration-300 dark:from-navy-900 
                    dark:via-navy-900 dark:to-navy-900"
    >
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-400 opacity-40 blur-3xl filter dark:bg-navy-600"></div>
      <div className="absolute right-10 top-10 h-64 w-64 rounded-full bg-blue-500 opacity-30 blur-2xl filter dark:bg-navy-600"></div>
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-300 opacity-25 blur-2xl filter dark:bg-navy-600"></div>

      <div className="flex flex-1 items-center justify-center p-4">
        {/* Auth Card */}
        <div
          className="relative z-10 w-full max-w-md rounded-2xl border border-blue-100 
                        bg-white/80 p-8 shadow-2xl 
                        backdrop-blur-md transition-all duration-300 
                        dark:border-none dark:bg-navy-700/90"
        >
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <h2 className="mb-2 text-center text-4xl font-extrabold text-brand-500 dark:text-white">
              Sign In
            </h2>
            <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
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
                <label className="flex cursor-pointer items-center gap-2 text-gray-700 dark:text-white">
                  <Checkbox color={"blue"} />
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
              className="w-full transform rounded-xl bg-gradient-to-r from-brand-500 to-brand-600
                        py-3 font-semibold text-white shadow-lg
                        transition-transform duration-300 hover:scale-105 hover:from-brand-600 hover:to-brand-700"
            >
              Sign In
            </button>

            {/* Sign Up */}
            <div className="mt-6 text-center">
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
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div
            className="relative mx-4 w-full max-w-md rounded-2xl border border-blue-100 
                          bg-white p-6 shadow-2xl 
                          transition-all duration-300
                          dark:border-gray-700 dark:bg-gray-800"
          >
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

            <h3 className="mb-2 text-center text-2xl font-bold text-brand-500 dark:text-white">
              Reset Password
            </h3>
            <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
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
              className="w-full transform rounded-xl bg-gradient-to-r from-brand-500 to-brand-600
                         py-3 font-semibold text-white shadow-lg
                         transition-transform duration-300 hover:scale-105 hover:from-brand-600 hover:to-brand-700"
            >
              Send Reset Link
            </button>

            <div className="mt-4 text-center">
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

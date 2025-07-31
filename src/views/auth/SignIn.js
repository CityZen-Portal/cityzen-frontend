// import InputField from "components/fields/InputField";
// import { useNavigate } from "react-router-dom";
// import Checkbox from "components/checkbox";
// import { useState } from "react";
// import Footer from "components/footer/FooterAuthDefault";

// export default function SignIn() {
//   const navigate = useNavigate();
//   const [showForgotPassword, setShowForgotPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [errors, setErrors] = useState({
//     email: "",
//     password: ""
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const validateForm = () => {
//     let valid = true;
//     const newErrors = {
//       email: "",
//       password: ""
//     };

//     console.log("Validating form with email:", email, "password length:", password.length);

//     // Email validation
//     if (!email || !email.trim()) {
//       newErrors.email = "Email is required";
//       valid = false;
//       console.log("Email validation failed: empty email");
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
//       newErrors.email = "Please enter a valid email address";
//       valid = false;
//       console.log("Email validation failed: invalid format");
//     } else {
//       console.log("Email validation passed");
//     }

//     // Password validation
//     if (!password) {
//       newErrors.password = "Password is required";
//       valid = false;
//       console.log("Password validation failed: empty password");
//     } else if (password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//       valid = false;
//       console.log("Password validation failed: too short");
//     } else {
//       console.log("Password validation passed");
//     }

//     console.log("Form validation result:", valid);
//     console.log("Errors:", newErrors);
//     setErrors(newErrors);
//     return valid;
//   };

//   const handleForgotPassword = () => {
//     if (!email.trim()) {
//       setErrors({...errors, email: "Email is required to reset password"});
//       return;
//     }
//     console.log("Password reset requested for:", email);
//     // Here you would typically call an API to send reset link
//     setShowForgotPassword(false);
//     alert(`Password reset link sent to ${email}`);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Clear any previous errors
//     setErrors({
//       email: "",
//       password: ""
//     });
    
//     if (validateForm()) {
//       setIsLoading(true);
//       console.log("Form is valid, attempting to navigate...");
      
//       setTimeout(() => {
//         console.log("Navigation timeout completed");
//         setIsLoading(false);
//         try {
//           navigate("/citizen/dashboard");
//           console.log("Navigation called successfully");
//         } catch (error) {
//           console.error("Navigation error:", error);
//         }
//       }, 1000);
//     } else {
//       console.log("Form validation failed");
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 
//                     dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 
//                     transition-all duration-300">
      
//       {/* Decorative Gradient Blobs */}
//       <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400 rounded-full filter blur-3xl opacity-40"></div>
//       <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full filter blur-2xl opacity-30"></div>
//       <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-300 rounded-full filter blur-2xl opacity-25"></div>

//       {/* Main Content */}
//       <div className="flex-1 flex items-center justify-center p-4">
//         {/* Auth Card - Expanded size */}
//         <div className="relative z-10 w-full max-w-lg p-10 rounded-2xl shadow-2xl 
//                         border border-blue-100 dark:border-gray-700 
//                         bg-white/80 dark:bg-gray-700/90 backdrop-blur-md 
//                         transition-all duration-300">
          
//           {/* Title */}
//           <h2 className="text-4xl font-extrabold mb-2 text-center text-blue-700 dark:text-white">
//             Sign In
//           </h2>
//           <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-8">
//             Enter your email and password to access your account
//           </p>

//           <form onSubmit={handleSubmit}>
//             {/* Email */}
//             <div className="mb-4">
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Email*
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="mail@simmmple.com"
//                 value={email}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                 }}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="mb-4">
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                 Password*
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Min. 8 characters"
//                   value={password}
//                   onChange={(e) => {
//                     setPassword(e.target.value);
//                   }}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-all duration-200"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
//                 >
//                   {showPassword ? (
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     </svg>
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//               )}
//             </div>

//             {/* Checkbox + Forgot Password */}
//             <div className="mb-6 flex items-center justify-between text-sm">
//               <div className="flex items-center">
//                 <Checkbox />
//                 <p className="ml-2 text-gray-700 dark:text-white">Keep me logged In</p>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setShowForgotPassword(true)}
//                 className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-300"
//               >
//                 Forgot Password?
//               </button>
//             </div>

//             {/* Sign In Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r
//                          from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
//                          transition-transform duration-300 ${isLoading ? 'opacity-70' : 'hover:scale-105'} shadow-lg
//                          flex items-center justify-center`}
//             >
//               {isLoading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Signing In...
//                 </>
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//           </form>

//           {/* Sign Up */}
//           <div className="text-center mt-8">
//             <span className="text-sm text-gray-700 dark:text-gray-300">
//               Not registered yet?
//             </span>
//             <button
//               type="button"
//               onClick={() => navigate("/auth/signup")}
//               className="ml-1 text-sm font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-300"
//             >
//               Create an account
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Footer - Aligned to bottom */}
//       <div className="w-full py-4">
//         <Footer />
//       </div>

//       {/* Forgot Password Popup */}
//       {showForgotPassword && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//           <div className="relative w-full max-w-md p-8 mx-4 rounded-2xl shadow-2xl 
//                           border border-blue-100 dark:border-gray-700 
//                           bg-white dark:bg-gray-800
//                           transition-all duration-300">
//             <button
//               onClick={() => setShowForgotPassword(false)}
//               className="absolute top-4 right-4 p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>

//             <h3 className="text-2xl font-bold mb-2 text-center text-blue-700 dark:text-white">
//               Reset Password
//             </h3>
//             <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">
//               Enter your email to receive a password reset link
//             </p>

//             <InputField
//               variant="auth"
//               extra="mb-6"
//               label="Email*"
//               placeholder="mail@simmmple.com"
//               id="reset-email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               state={errors.email ? "error" : ""}
//               errorMessage={errors.email}
//             />

//             <button
//               onClick={handleForgotPassword}
//               className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r
//                          from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
//                          transition-transform duration-300 transform hover:scale-105 shadow-lg"
//             >
//               Send Reset Link
//             </button>

//             <div className="text-center mt-4">
//               <button
//                 onClick={() => setShowForgotPassword(false)}
//                 className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-300"
//               >
//                 Back to Sign In
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
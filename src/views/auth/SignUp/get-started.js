import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpClient from "./SignUpClient";
import SignUpStaff from "./SignUpStaff";

export default function GetStarted() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  if (role === "client") return <SignUpClient onBack={() => setRole("")} />;
  if (role === "staff") return <SignUpStaff onBack={() => setRole("")} />;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-navy-900 relative overflow-hidden px-4 py-8 transition-colors duration-300">
      {/* Back Button */}
      <button
  onClick={() => navigate(-1)}
  className="absolute top-6 left-6 flex items-center text-blue-600 dark:text-blue-300 hover:underline z-20 bg-white/80 dark:bg-navy-900/80 rounded-full px-3 py-1 shadow"
  style={{ backdropFilter: 'blur(4px)' }}
>
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="mr-2">
    <path d="M7.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L4.414 9H16a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" fill="currentColor"/>
  </svg>
  Back
</button>

      {/* Decorative Circles */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-blue-200 rounded-full opacity-40 z-0"></div>
      <div className="absolute top-1/2 left-0 w-20 h-20 bg-blue-200 rounded-full opacity-30 z-0"></div>
      <div className="absolute bottom-10 left-20 w-16 h-16 bg-blue-200 rounded-full opacity-30 z-0"></div>
      <div className="absolute top-10 right-10 w-16 h-16 bg-blue-200 rounded-full opacity-40 z-0"></div>
      <div className="absolute top-1/2 right-0 w-20 h-20 bg-blue-200 rounded-full opacity-30 z-0"></div>
      <div className="absolute bottom-10 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-30 z-0"></div>

      {/* Title and Subtitle */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mt-8 mb-2 z-10">
        Welcome to <span className="text-blue-600">CityZen</span>
      </h1>
      <p className="text-lg text-gray-500 text-center mb-10 z-10 max-w-2xl">
        Your digital gateway to seamless city services. Choose your path to get started.
      </p>

      {/* Cards */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Citizen Card */}
        <div className="flex flex-col items-center justify-center py-12 px-8">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" fill="#2563eb"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16a4 4 0 100-8 4 4 0 000 8z" fill="#fff"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-2.21 0-4 1.79-4 4" stroke="#fff"/></svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm a Citizen</h3>
          <p className="text-center text-gray-500 mb-5 max-w-xs">Access city services, pay bills, submit requests, track applications, and stay connected with your local government.</p>
          <ul className="text-left text-[#4f46e5] font-medium mb-8 space-y-2">
            <li className="flex items-center gap-2"><svg className="w-5 h-5 text-[#4f46e5]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" /></svg>Pay utilities & taxes</li>
            <li className="flex items-center gap-2"><svg className="w-5 h-5 text-[#4f46e5]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" /></svg>Submit service requests</li>
          </ul>
          <button
            onClick={() => setRole("client")}
            className="w-full rounded-lg bg-[#2563eb] py-3 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors duration-200 text-lg mt-auto focus:outline-none"
          >
            Get Started as Citizen →
          </button>
        </div>
        {/* Employee Side */}
        <div className="flex flex-col items-center justify-center py-12 px-8">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#1e293b] mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" fill="#1e293b"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" fill="#fff"/></svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm an Employee</h3>
          <p className="text-center text-gray-500 mb-5 max-w-xs">Manage city operations, process citizen requests, update service statuses, and collaborate with your team effectively.</p>
          <ul className="text-left text-[#6366f1] font-medium mb-8 space-y-2">
            <li className="flex items-center gap-2"><svg className="w-5 h-5 text-[#6366f1]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" /></svg>Manage service requests</li>
            <li className="flex items-center gap-2"><svg className="w-5 h-5 text-[#6366f1]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" /></svg>Update case statuses</li>
            <li className="flex items-center gap-2"><svg className="w-5 h-5 text-[#6366f1]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" /></svg>Access admin tools</li>
          </ul>
          <button
            onClick={() => setRole("staff")}
            className="w-full rounded-lg bg-[#1e293b] py-3 text-white font-semibold shadow-md hover:bg-[#334155] transition-colors duration-200 text-lg mt-auto focus:outline-none"
          >
            Get Started as Employee →
          </button>
        </div>
      </div>
    </div>
  );
}
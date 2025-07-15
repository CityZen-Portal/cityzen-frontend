import { useNavigate, Outlet } from "react-router-dom";

const RoleCard = ({
  role,
  title,
  description,
  features,
  icon,
  buttonColor,
  buttonHoverColor,
  featureColor,
  accentColor,
  onClick
}) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.01] p-4 sm:p-6 md:p-8 flex flex-col h-full border-2 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-400 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-blue-100/10 dark:from-blue-900/10 dark:via-transparent dark:to-blue-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-200 dark:bg-blue-600 rounded-full opacity-20 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110" />
      <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-blue-300 dark:bg-blue-500 rounded-full opacity-15 group-hover:opacity-25 transition-all duration-500 group-hover:scale-110" />
      <div className="relative z-10 flex-1 flex flex-col">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl ${buttonColor} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
          {icon}
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">{description}</p>
        <div className="flex-1 mb-4 sm:mb-6">
          <ul className="space-y-2 sm:space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 sm:gap-3 group/item">
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-2 h-2 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-xs sm:text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={onClick} className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl md:rounded-2xl font-bold text-white text-sm sm:text-base ${buttonColor} ${buttonHoverColor} transition-all duration-300 transform group-hover:scale-105 shadow-xl hover:shadow-2xl relative overflow-hidden mt-auto`}>
          <span className="relative z-10">Get Started as {role} →</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
      </div>
    </div>
  );
};

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300 py-6">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-blue-200 dark:bg-blue-600 rounded-full opacity-40 animate-pulse z-0" />
      <div className="absolute top-1/2 left-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-blue-200 dark:bg-blue-600 rounded-full opacity-30 animate-pulse delay-300 z-0" />
      <div className="absolute bottom-10 left-20 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-blue-200 dark:bg-blue-600 rounded-full opacity-30 animate-pulse delay-700 z-0" />
      <div className="absolute top-10 right-10 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-blue-200 dark:bg-blue-600 rounded-full opacity-40 animate-pulse delay-500 z-0" />
      <div className="absolute top-1/2 right-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-blue-200 dark:bg-blue-600 rounded-full opacity-30 animate-pulse delay-200 z-0" />
      <div className="absolute bottom-10 right-20 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-blue-200 dark:bg-blue-600 rounded-full opacity-30 animate-pulse delay-600 z-0" />

      {/* Header with Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center text-blue-600 dark:text-blue-300 hover:underline z-20 bg-white/80 dark:bg-gray-900/80 rounded-full px-3 py-1 shadow backdrop-blur-sm"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="mr-2">
          <path d="M7.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L4.414 9H16a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" fill="currentColor" />
        </svg>
        Back
      </button>

      {/* Hero Section */}
      <div className="w-full max-w-6xl z-10 text-center mt-16 sm:mt-12 px-4 sm:px-6 md:px-8 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight text-gray-900 dark:text-white">
          Welcome to <span className="text-blue-600 dark:text-blue-400">CityZen</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-3xl mx-auto">
          Your digital gateway to seamless city services. Choose your path to get started.
        </p>
      </div>

      {/* Cards Section */}
      <div className="w-full z-10 px-4 sm:px-6 md:px-8 lg:px-12 flex-1 flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            {/* Citizen Card */}
            <div className="h-auto min-h-[480px] sm:min-h-[520px]">
              <RoleCard
                role="Citizen"
                title="I'm a Citizen"
                description="Access city services, pay bills, submit requests, track applications, and stay connected with your local government."
                features={[
                  "Pay utilities & taxes",
                  "Submit service requests",
                  "Track application status",
                  "Access city announcements"
                ]}
                icon={
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
                buttonColor="bg-blue-600"
                buttonHoverColor="hover:bg-blue-700"
                featureColor="text-blue-600"
                accentColor="blue"
                onClick={() => navigate("/auth/signup/get-started/citizen")}
              />
            </div>

            {/* Employee Card */}
            <div className="h-auto min-h-[480px] sm:min-h-[520px]">
              <RoleCard
                role="Employee"
                title="I'm an Employee"
                description="Manage city operations, process citizen requests, update service statuses, and collaborate with your team effectively."
                features={[
                  "Manage service requests",
                  "Update case statuses",
                  "Team collaboration tools",
                  "Administrative dashboard"
                ]}
                icon={
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
                buttonColor="bg-blue-600"
                buttonHoverColor="hover:bg-blue-700"
                featureColor="text-blue-600"
                accentColor="blue"
                onClick={() => navigate("/auth/signup/get-started/staff")}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mt-12 z-20">
        <Outlet />
      </div>
    </div>
  );
}
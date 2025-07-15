import React from "react";
import avatar from "assets/img/avatars/avatar1.png"; // Adjust path if needed

const Profile = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="p-4">

        {/* 1. User Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="bg-white dark:bg-navy-800 rounded-xl shadow-md overflow-hidden relative">
            <div className="h-32 w-full bg-blue-400 flex items-center justify-center relative">
              <h3 className="text-black dark:text-white font-bold text-sm sm:text-lg hidden">
                Only You Can Define Your Own Success
              </h3>
              <div className="absolute -bottom-10 left-6">
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-navy-700"
                />
              </div>
            </div>

            <div className="pt-14 pb-6 px-9 text-left">
              <h2 className="text-2xl font-poppins text-black dark:text-white">
                Adela Parkson
              </h2>
              <p className="text-sm font-poppins text-black dark:text-white/70">
                City Admin
              </p>

              <div className="mt-3 text-sm space-y-2 font-poppins">
                <div className="flex items-center gap-2 text-black dark:text-white/70">
                  <span role="img" aria-label="email">
                    📧
                  </span>
                  <a
                    href="mailto:smartcitizen.portal@gmail.com"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    smartcitizen.portal@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-2 text-black dark:text-white/70">
                  <span role="img" aria-label="badge">
                    🎫
                  </span>
                  <span>EMP1024</span>
                </div>

                <div className="flex items-center gap-2 text-black dark:text-white/70">
                  <i className="fas fa-map-marker-alt text-red-500 text-base"></i>
                  <span>Coimbatore</span>
                </div>

                <div className="flex items-center gap-2 text-black dark:text-white/70">
                  <span role="img" aria-label="calendar">
                    📅
                  </span>
                  <span>Joined on: Jan 2, 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Previous Bookings */}
        <div className="mt-8 max-w-6xl bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-md ">
          <h2 className="text-lg font-poppins text-black dark:text-white mb-1">
            Previous Bookings
          </h2>
          <p className="text-sm text-black dark:text-white/70 mb-4 font-poppins">
            Your booking history is shown here.
          </p>

          <ul className="space-y-4 font-poppins">
            <li className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl text-black dark:text-white">

              🗓️ Garbage Pickup – 15 June 2025 – Scheduled
            </li>
            <li className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl text-black dark:text-white">

              🗓️ Water Tanker – 3 May 2025 – Completed
            </li>
          </ul>
        </div>

        {/* 3. Previous Complaints */}
        <div className="mt-8 max-w-6xl bg-white dark:bg-navy-800 rounded-3xl p-6 shadow-md">
          <h2 className="text-lg font-poppins text-black dark:text-white mb-1">
            Previous Complaints
          </h2>
          <p className="text-sm text-black dark:text-white/70 mb-4 font-poppins">
            All your submitted complaints appear here.
          </p>

          <ul className="space-y-4 font-poppins">
            <li className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl text-black dark:text-white">

              🚧 Street light not working – 12 April 2025 – Resolved
            </li>
           <li className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl text-black dark:text-white">

              🧹 Garbage not collected – 5 March 2025 – Pending
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;

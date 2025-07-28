import React, { useState } from "react";
import {
  FaTrashAlt,
  FaTint,
  FaLightbulb,
  FaEdit,
  FaSave,
  FaTimes,
  FaPen,
} from "react-icons/fa";
import {
  MdPerson,
  MdBadge,
  MdEmail,
  MdPhone,
  MdEvent,
  MdFingerprint,
  MdDescription,
  MdLocationOn,
  MdMale,
  MdFemale,
  MdTransgender,
} from "react-icons/md";
import avatar from "assets/img/avatars/avatar1.png";

export default function ProfileCard() {
  const [editMode, setEditMode] = useState(false);

  const [user, setUser] = useState({
    firstName: "Adela",
    lastName: "Parkson",
    citizenId: "CIT123456",
    userType: "Citizen",
    email: "smartcitizen.portal@gmail.com",
    phone: "+91 98765 43210",
    dob: "1990-05-22",
    gender: "Female",
    aadhar: "XXXX-XXXX-9012",
    address: "123, Gandhi Street, Coimbatore, Tamil Nadu – 641001",
  });

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      console.log("Selected image:", imageUrl);
    }
  };

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-6 font-sans text-base leading-relaxed tracking-wide">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Card */}
       <div
  className={`flex flex-col items-center bg-blue-600 rounded-2xl p-6 w-full lg:w-1/3 shadow-lg ${
    editMode ? "justify-center min-h-[500px]" : ""
  }`}
>
  <div className="relative flex justify-center items-center mb-4">
    <img
      src={avatar}
      alt="User"
      className="rounded-full border-2 border-white w-56 h-56 object-cover shadow-md"
    />
    {editMode && (
      <>
        <label htmlFor="profilePicUpload">
          <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow-md hover:bg-gray-100 transition">
            <FaPen className="text-blue-600" />
          </div>
        </label>
        <input
          type="file"
          id="profilePicUpload"
          accept="image/*"
          className="hidden"
          onChange={handleProfilePicChange}
        />
      </>
    )}
  </div>
  <h2 className="text-2xl font-semibold text-white text-center tracking-wide">
    {user.firstName} {user.lastName}
  </h2>
  <p className="text-white text-sm mt-1 text-center font-medium tracking-wide">
    {user.userType}
  </p>
</div>

        {/* Right Card */}
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl p-6 pb-3 w-full lg:w-2/3 shadow-lg space-y-3">
          <div className="flex justify-end gap-2">
            {!editMode ? (
              <button
                className="flex items-center gap-1.5 bg-yellow-400 text-white px-3 py-1.5 rounded-full shadow-md hover:bg-yellow-500 transition duration-300 ease-in-out font-semibold text-sm tracking-wide"
                onClick={() => setEditMode(true)}
                aria-label="Edit Profile"
              >
                <FaEdit className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <>
                <button
                  className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-full shadow-md hover:bg-green-700 transition duration-300 ease-in-out font-semibold text-sm tracking-wide"
                  onClick={() => setEditMode(false)}
                  aria-label="Save Profile"
                >
                  <FaSave className="w-4 h-4" />
                  Save
                </button>
                <button
                  className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1.5 rounded-full shadow-md hover:bg-red-700 transition duration-300 ease-in-out font-semibold text-sm tracking-wide"
                  onClick={() => setEditMode(false)}
                  aria-label="Cancel Editing"
                >
                  <FaTimes className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ["firstName", "First Name"],
              ["lastName", "Last Name"],
              ["citizenId", "Citizen ID", true],
              ["userType", "User Type", true],
              ["email", "Email"],
              ["phone", "Phone"],
              ["dob", "Date of Birth", false, "date"],
              ["gender", "Gender", false, "select"],
              ["aadhar", "Aadhaar", true],
              ["address", "Address"],
            ].map(([key, label, isReadOnly = false, type = "text"]) => {
              if (!editMode && key === "lastName") return null;

              const value = user[key];

              const iconMap = {
  firstName: <MdPerson className="text-2xl text-blue-600" />,
  lastName: <MdPerson className="text-2xl text-blue-600" />,
  citizenId: <MdBadge className="text-2xl text-blue-600" />,
  userType: <MdDescription className="text-2xl text-blue-600" />,
  email: <MdEmail className="text-2xl text-blue-600" />,
  phone: <MdPhone className="text-2xl text-blue-600" />,
  dob: <MdEvent className="text-2xl text-blue-600" />,
  gender:
    user.gender === "Male" ? (
      <MdMale className="text-2xl text-blue-600" />
    ) : user.gender === "Female" ? (
      <MdFemale className="text-2xl text-blue-600" />
    ) : (
      <MdTransgender className="text-2xl text-blue-600" />
    ),
  aadhar: <MdFingerprint className="text-2xl text-blue-600" />,
  address: <MdLocationOn className="text-2xl text-blue-600" />,
};

              return (
                <div key={key}>
                  {editMode ? (
                    <>
                      <label className="block text-sm font-semibold mb-1 tracking-wide text-gray-700 dark:text-gray-300">
                        {label}
                      </label>
                      {type === "select" ? (
                        <select
                          className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={user[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          disabled={isReadOnly}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <input
                          type={type}
                          className={`w-full p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isReadOnly ? "opacity-60 cursor-not-allowed" : ""
                          }`}
                          placeholder={`Enter ${label.toLowerCase()}`}
                          value={user[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          readOnly={isReadOnly}
                        />
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
                      <span className="text-blue-600">{iconMap[key]}</span>
                      <p className="text-sm font-medium tracking-wide">
                        {key === "firstName"
                          ? `${user.firstName} ${user.lastName}`
                          : value}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bookings & Complaints */}
      <div className="flex flex-col gap-6 font-sans">
        {/* Bookings */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 space-y-4 w-full">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 tracking-wide">
            Previous Bookings
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 tracking-wide">
            Your booking history is shown here.
          </p>
          <ul className="space-y-3">
            <li className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center gap-3 text-sm shadow-md text-gray-800 dark:text-gray-300">
              <FaTrashAlt className="text-gray-700 dark:text-gray-400" />
              <span>
                Garbage Pickup – 15 June 2025 –{" "}
                <span className="font-medium text-yellow-600">Scheduled</span>
              </span>
            </li>
            <li className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center gap-3 text-sm shadow-md text-gray-800 dark:text-gray-300">
              <FaTint className="text-gray-700 dark:text-gray-400" />
              <span>
                Water Tanker – 3 May 2025 –{" "}
                <span className="font-medium text-green-600">Completed</span>
              </span>
            </li>
          </ul>
        </div>

        {/* Complaints */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 space-y-4 w-full">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 tracking-wide">
            Previous Complaints
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 tracking-wide">
            All your submitted complaints appear here.
          </p>
          <ul className="space-y-3">
            <li className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center gap-3 text-sm shadow-md text-gray-800 dark:text-gray-300">
              <FaLightbulb className="text-gray-700 dark:text-gray-400" />
              <span>
                Street light not working – 12 April 2025 –{" "}
                <span className="font-medium text-green-600">Resolved</span>
              </span>
            </li>
            <li className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center gap-3 text-sm shadow-md text-gray-800 dark:text-gray-300">
              <FaTrashAlt className="text-gray-700 dark:text-gray-400" />
              <span>
                Garbage not collected – 5 March 2025 –{" "}
                <span className="font-medium text-yellow-600">Pending</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

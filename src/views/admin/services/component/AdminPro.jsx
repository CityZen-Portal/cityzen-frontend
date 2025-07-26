import React, { useState } from "react";
import avatar from "assets/img/avatars/avatar1.png";
import {
  FaPen,
  FaEnvelope,
  FaTransgender,
  FaPhone,
  FaMapMarkerAlt,
  FaVenus,
  FaMars,
  FaUser,
} from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { FaIdCard } from "react-icons/fa6";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(avatar);
  const [fullName, setFullName] = useState("Adela");
  const [lastName, setLastName] = useState("Parkson");
  const userType = "Admin User";
  const [department, setDepartment] = useState("Public Relations");
  const [email, setEmail] = useState("admin.smartportal@gmail.com");
  const [phone, setPhone] = useState("+91 98765 43210");

  const [addressLine, setAddressLine] = useState("456, Admin Street");
  const [city, setCity] = useState("Chennai");
  const [state, setState] = useState("Tamil Nadu");
  const [pincode, setPincode] = useState("600001");

  const adminId = "ADMIN2048";
  const [dob, setDob] = useState("1988-08-15");
  const [gender, setGender] = useState("Female");

  // New Fields
  const [accessLevel, setAccessLevel] = useState("Super Admin");
  const [lastLogin] = useState("2025-07-24 18:45");
  const [status, setStatus] = useState("Active");

  const inputStyle =
    "px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-black dark:bg-navy-700 dark:text-white";

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePhoto(imageUrl);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saved:", {
      fullName,
      lastName,
      email,
      phone,
      addressLine,
      city,
      state,
      pincode,
      dob,
      gender,
      department,
      status,
      profilePhoto,
    });
  };

  const renderGenderIcon = () => {
    switch (gender.toLowerCase()) {
      case "female":
        return <FaVenus className="text-gray-400 text-xl" />;
      case "male":
        return <FaMars className="text-gray-400 text-xl" />;
      default:
        return <FaTransgender className="text-gray-400 text-xl" />;
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="p-4">
        <div className="bg-white dark:bg-navy-800 rounded-xl shadow-md overflow-hidden relative">
          <div className="h-32 w-full bg-blue-400 relative">
            <div className="absolute -bottom-10 left-6 cursor-pointer">
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white dark:border-navy-700 object-cover"
                onClick={() => {
                  if (isEditing) document.getElementById("photo-upload").click();
                }}
                title={isEditing ? "Click to change profile photo" : ""}
              />
              {isEditing && (
                <>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => document.getElementById("photo-upload").click()}
                    className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    title="Change Profile Photo"
                  >
                    <FaPen />
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute bottom-2 left-32 w-8 h-8 flex items-center justify-center rounded-full bg-blue-900 text-white border-2 border-white shadow-md"
              title="Edit Profile"
            >
              <FaPen size={12} />
            </button>
          </div>

          <div className="pt-14 pb-6 px-6 sm:px-9 text-left text-black dark:text-white font-poppins">
            <div className="flex flex-col space-y-1">
              {isEditing ? (
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex flex-col w-full sm:w-[200px]">
                    <label className="text-xs font-semibold mb-1">First Name:</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`text-2xl font-bold ${inputStyle} w-full`}
                      placeholder="First Name"
                    />
                  </div>
                  <div className="flex flex-col w-full sm:w-[200px]">
                    <label className="text-xs font-semibold mb-1">Last Name:</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`text-2xl font-bold ${inputStyle} w-full`}
                      placeholder="Last Name"
                    />
                  </div>
                </div>
              ) : (
                <h2 className="text-2xl font-bold">{`${fullName} ${lastName}`}</h2>
              )}
            </div>

            <div className="mt-6 text-sm space-y-6">
              <InfoRow
                icon={<FaUser />}
                label="User Type"
                value={userType}
                isEditing={isEditing}
                input={<input readOnly value={userType} className={`${inputStyle} bg-gray-100 cursor-not-allowed`} />}
              />

              <InfoRow
                icon={<FaIdCard />}
                label="Admin ID"
                value={adminId}
                isEditing={isEditing}
                input={<input readOnly value={adminId} className={`${inputStyle} bg-gray-100 cursor-not-allowed`} />}
              />
                 {/* Department */}
              <InfoRow
                icon={<FaUser />}
                label="Department"
                value={department}
                isEditing={isEditing}
                input={<input value={department} onChange={(e) => setDepartment(e.target.value)} className={inputStyle} />}
              />

              <InfoRow
                icon={<FaEnvelope />}
                label="Email"
                value={email}
                isEditing={isEditing}
                input={<input value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyle} />}
              />

              <InfoRow
                icon={<FaPhone />}
                label="Phone"
                value={phone}
                isEditing={isEditing}
                input={<input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputStyle} />}
              />

              {/* Address */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
                <FaMapMarkerAlt className="text-gray-400 text-xl mt-1 sm:mr-2" />
                <div className="flex flex-col w-full">
                  {isEditing ? (
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                      <InputField label="Address Line" value={addressLine} setter={setAddressLine} />
                      <InputField label="City" value={city} setter={setCity} />
                      <InputField label="State" value={state} setter={setState} />
                      <InputField label="Pincode" value={pincode} setter={setPincode} />
                    </div>
                  ) : (
                    <span>{`${addressLine}, ${city}, ${state} - ${pincode}`}</span>
                  )}
                </div>
              </div>

              <InfoRow
                icon={<MdDateRange />}
                label="Date of Birth"
                value={dob}
                isEditing={isEditing}
                input={<input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputStyle} />}
              />

              {/* Gender */}
   <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-4">
  <div className="text-gray-400 text-xl mt-1 sm:mr-2">{renderGenderIcon()}</div>
  <div className="flex flex-col w-full sm:w-auto">
    {isEditing ? (
      <>
        <label className="text-sm font-medium text-black-700 mb-1">Gender:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black w-full sm:w-55"
        >
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
      </>
    ) : (
      <span>{gender}</span>
    )}
  </div>
</div>


              
              <InfoRow
  icon={<FaUser />}
  label="Access Level"
  value={accessLevel}
  isEditing={isEditing}
  input={
    <select
      value={accessLevel}
      onChange={(e) => setAccessLevel(e.target.value)}
      className={inputStyle}
    >
      <option>Super Admin</option>
      <option>Moderator</option>
      <option>Viewer</option>
    </select>
  }
/>


              {/* Last Login */}
            <InfoRow
  icon={<MdDateRange />}
  label="Last Login"
  value={lastLogin}
  isEditing={isEditing}
  input={
    <input
      readOnly
      value={lastLogin}
      className="px-3 py-1 rounded-md border border-gray-300 bg-gray-100 cursor-not-allowed text-black dark:bg-navy-700 dark:text-white"
    />
  }
/>

              {/* Status */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mb-4">
  <FaUser className="text-gray-400 text-xl mt-1 sm:mr-2" />
  <div className="flex flex-col w-full sm:w-auto">
    {isEditing ? (
      <>
        <label className="text-sm font-medium text-black-700 mb-1">Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black w-full sm:w-55"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
        </select>
      </>
    ) : (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          status === "Active"
            ? "bg-green-200 text-green-800"
            : status === "Inactive"
            ? "bg-yellow-200 text-yellow-800"
            : "bg-red-200 text-red-800"
        }`}
      >
        {status}
      </span>
    )}
  </div>
</div>

            </div>

            {isEditing && (
              <button
                onClick={handleSave}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable components
const InfoRow = ({ icon, label, value, isEditing, input }) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
    <div className="text-gray-400 text-xl mt-1 sm:mr-2">{icon}</div>
    <div className="flex flex-col w-full sm:w-auto">
      {isEditing && input ? (
        <div className="mb-1">
          <label className="block text-white-600 text-sm font-medium mb-1">{label}:</label>
          {input}
        </div>
      ) : (
        <span>{value}</span>
      )}
    </div>
  </div>
);

const InputField = ({ label, value, setter }) => (
  <div className="flex flex-col w-full sm:w-[200px]">
    <p className="text-black text-xs font-medium mb-1">{label}:</p>
    <input
      value={value}
      onChange={(e) => setter(e.target.value)}
      className="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-black dark:bg-navy-700 dark:text-white"
    />
  </div>
);

export default AdminProfile;

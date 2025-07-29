import React, { useState } from "react";
import avatarPlaceholder from "assets/img/avatars/avatar1.png";
import {
  FaPen,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaIdCard,
  FaCity,
  FaFlag,
  FaKey,
  FaSignal,
  FaCheckCircle,
  FaCalendarAlt,
  FaMars,
  FaVenus,
  FaGenderless,
  FaPhone,
} from "react-icons/fa";

// Gender Icon Selector
const getGenderIcon = (gender) => {
  switch (gender) {
    case "Male":
      return <FaMars className="text-gray-700 text-2xl" />;
    case "Female":
      return <FaVenus className="text-gray-700 text-2xl" />;
    case "Other":
      return <FaGenderless className="text-gray-700 text-2xl" />;
    default:
      return <FaGenderless className="text-gray-700 text-2xl" />;
  }
};

// Reusable Field Component
const Field = ({
  label,
  name,
  value,
  onChange,
  editable = false,
  disabled = false,
  type = "text",
  icon,
  isSelect = false,
  options = [],
}) => (
  <div className="flex items-start gap-3 mb-4">
    <div className="text-gray-700 mt-1">{icon}</div>
    <div className="w-full">
      {editable ? (
        <>
          <label className="text-sm text-gray-600 dark:text-gray-300">{label}</label>
          {isSelect ? (
            <select
              name={name}
              value={value}
              onChange={onChange}
              disabled={disabled}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-navy-800 dark:text-white disabled:cursor-not-allowed"
            >
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              disabled={disabled}
              className="w-full border rounded px-3 py-2 bg-white dark:bg-navy-800 dark:text-white disabled:cursor-not-allowed"
            />
          )}
        </>
      ) : (
        <p className="mt-1 text-base text-gray-800 dark:text-gray-100">{value}</p>
      )}
    </div>
  </div>
);

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(avatarPlaceholder);

  const [formData, setFormData] = useState({
    firstName: "Priya",
    lastName: "Kumar",
    adminId: "ADM456",
    role: "Citizen Admin",
    email: "priya@example.com",
    dob: "1990-05-15",
    gender: "Female",
    address: "123 Smart Street",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    phone: "9876543210",
    accessLevel: "super admin",
    status: "Active",
    lastLogin: "2025-07-26 10:45 AM",
    userType: "Admin",
    country: "India",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      // TODO: Upload logic (e.g., API call) can go here
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // TODO: Save profile changes to backend
  };

  return (
    <div className="p-4 dark:bg-navy-700 dark:text-white max-w-screen-lg mx-auto">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4 bg-blue-500 rounded-2xl p-6 shadow-md text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profilePic}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
            />
            {isEditing && (
              <>
                <label htmlFor="profilePicUpload">
                  <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow-md hover:bg-gray-100 transition">
                    <FaPen className="text-blue-600 w-4 h-4" />
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
          <div>
            <h2 className="text-2xl font-semibold">
              {formData.firstName} {formData.lastName}
            </h2>
            <p>{formData.userType}</p>
            <p>{formData.country}</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className={`px-4 py-2 rounded flex items-center gap-2 text-white ${
            isEditing ? "bg-red-600 hover:bg-red-700" : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          <FaPen />
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-md p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b pb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isEditing ? (
            <>
              <Field label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} editable={isEditing} icon={<FaUser />} />
              <Field label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} editable={isEditing} icon={<FaUser />} />
            </>
          ) : (
            <div className="flex items-start gap-3 mb-4">
              <div className="text-gray-700 mt-1"><FaUser /></div>
              <div className="w-full">
                <p className="mt-1 text-base text-gray-800 dark:text-gray-100">
                  {formData.firstName} {formData.lastName}
                </p>
              </div>
            </div>
          )}
          <Field label="Admin ID" name="adminId" value={formData.adminId} onChange={handleChange} editable={isEditing} disabled icon={<FaIdCard />} />
          <Field label="Role" name="role" value={formData.role} onChange={handleChange} editable={isEditing} disabled icon={<FaKey />} />
          <Field label="Email" name="email" value={formData.email} onChange={handleChange} editable={isEditing} icon={<FaEnvelope />} />
          <Field
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            editable={isEditing}
            isSelect
            options={["Male", "Female", "Other"]}
            icon={getGenderIcon(formData.gender)}
          />
          <Field
            label="Date of Birth"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            editable={isEditing}
            type="date"
            icon={<FaCalendarAlt />}
          />
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-md p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b pb-2">
          Address Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Address" name="address" value={formData.address} onChange={handleChange} editable={isEditing} icon={<FaMapMarkerAlt />} />
          <Field label="City" name="city" value={formData.city} onChange={handleChange} editable={isEditing} icon={<FaCity />} />
          <Field label="State" name="state" value={formData.state} onChange={handleChange} editable={isEditing} icon={<FaFlag />} />
          <Field label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} editable={isEditing} icon={<FaMapMarkerAlt />} />
          <Field label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} editable={isEditing} icon={<FaPhone />} type="tel" />
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-md p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b pb-2">
          System Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Access Level"
            name="accessLevel"
            value={formData.accessLevel}
            onChange={handleChange}
            editable={isEditing}
            isSelect={true}
            options={["admin", "super admin", "Service Manager", "Complaint Manager", "Read-Only Admin"]}
            icon={<FaSignal />}
          />
          <Field
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            editable={isEditing}
            isSelect={true}
            options={["Active", "Inactive", "Suspended"]}
            icon={<FaCheckCircle />}
          />
          <div className="flex items-start gap-3 mb-4">
            <div className="text-gray-700 mt-1"><FaCalendarAlt /></div>
            <div className="w-full">
              {isEditing ? (
                <>
                  <label className="text-sm text-gray-600 dark:text-gray-300">Last Login</label>
                  <input
                    type="text"
                    name="lastLogin"
                    value={formData.lastLogin}
                    readOnly
                    disabled
                    className="w-full border rounded px-3 py-2 bg-white dark:bg-navy-800 dark:text-white cursor-default"
                  />
                </>
              ) : (
                <p className="mt-1 text-base text-gray-800 dark:text-gray-100">{formData.lastLogin}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="text-right mt-6">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;

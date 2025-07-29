import axios from "axios";
import avatarPlaceholder from "assets/img/avatars/avatar1.png";
import React, { useState, useEffect } from "react";

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
  loading = false,
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
      ) : loading ? (
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-navy-700 rounded animate-pulse mt-1"></div>
      ) : (
        <p className="mt-1 text-base text-gray-800 dark:text-gray-100">{value}</p>
      )}
    </div>
  </div>
);

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(avatarPlaceholder);
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    department: "",
    contactNumber: "",
    emailAddress: "",
    password: "",
    fullAddress: "",
    dob: "",
    aadharNumber: "",
    created_date: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("https://utility-booking-backend.onrender.com/api/staff/6884917f8b53ed2ef33c6818");

        const staff = response.data.data;
        console.log("Fetched Staff Data:", staff);

        setFormData({
          id: staff.id || "",
          fullName: staff.fullName || "",
          department: staff.department || "",
          contactNumber: staff.contactNumber || "",
          emailAddress: staff.emailAddress || "",
          password: staff.password || "",
          fullAddress: staff.fullAddress || "",
          dob: staff.dob || "",
          aadharNumber: staff.aadharNumber || "",
          created_date: staff.created_date || ""
        });
        setOriginalData(staff);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      await axios.put("https://utility-booking-backend.onrender.com/api/staff/6884917f8b53ed2ef33c6818", formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
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
            {loading ? (
              <div className="space-y-2">
                <div className="h-6 w-40 bg-gray-200 dark:bg-navy-700 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-navy-700 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-navy-700 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p>{formData.userType}</p>
                <p>{formData.country}</p>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              setFormData(originalData);
            }
            setIsEditing((prev) => !prev);
          }}
          className={`px-4 py-2 rounded flex items-center gap-2 text-white ${isEditing ? "bg-red-600 hover:bg-red-700" : "bg-teal-600 hover:bg-teal-700"}`}
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
          <Field label="ID" name="id" value={formData.id} onChange={handleChange} editable={isEditing} disabled={!isEditing} icon={<FaIdCard />} loading={loading} />
          <Field label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} editable={isEditing} icon={<FaUser />} loading={loading} />
          <Field label="Department" name="department" value={formData.department} onChange={handleChange} editable={isEditing} icon={<FaKey />} loading={loading} />
          <Field label="Date of Birth" name="dob" value={formData.dob} onChange={handleChange} editable={isEditing} icon={<FaCalendarAlt />} loading={loading} />
          <Field label="Aadhaar Number" name="aadharNumber" value={formData.aadharNumber || "N/A"} onChange={handleChange} editable={isEditing} icon={<FaIdCard />} loading={loading} />
          <Field label="Created Date" name="created_date" value={formData.created_date} onChange={handleChange} editable={isEditing} icon={<FaCalendarAlt />} loading={loading} />
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-md p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b pb-2">
          Address Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} editable={isEditing} icon={<FaPhone />} loading={loading} />
          <Field label="Email Address" name="emailAddress" value={formData.emailAddress} onChange={handleChange} editable={isEditing} icon={<FaEnvelope />} loading={loading} />
          <Field label="Password" name="password" value={formData.password} onChange={handleChange} editable={isEditing} icon={<FaKey />} loading={loading} />
          <Field label="Full Address" name="fullAddress" value={formData.fullAddress} onChange={handleChange} editable={isEditing} icon={<FaMapMarkerAlt />} loading={loading} />
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="text-right mt-6">
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow">
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;

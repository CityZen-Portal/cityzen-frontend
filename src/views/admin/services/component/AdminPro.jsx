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
  FaBriefcase,
  FaRegCalendarCheck,
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
  onAttemptEdit,
}) => (
  <div
    className="flex items-start gap-3 mb-4"
    title={disabled ? "You can't edit this field" : ""}
  >
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
              onClick={disabled ? onAttemptEdit : undefined}
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
              onClick={disabled ? onAttemptEdit : undefined}
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
  const [originalProfilePic, setOriginalProfilePic] = useState(null); // NEW

  const [formData, setFormData] = useState({
    firstName: "Priya",
    lastName: "Kumar",
    adminId: "ADM456",
    email: "priya@example.com",
    dob: "1990-05-15",
    gender: "Female",
    address: "123 Smart Street",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560001",
    phone: "9876543210",
    designation: "Senior Admin",
    joinedAt: "2022-01-10",
    country: "India",
  });

  const [originalData, setOriginalData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    setOriginalData(null);
    setOriginalProfilePic(null);
  };

  const handleBlockedEdit = () => {
    alert("You can't edit this field.");
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
          onClick={() => {
            if (isEditing) {
              if (originalData) {
                setFormData(originalData);
                setProfilePic(originalProfilePic); // Reset profile picture
              }
              setOriginalData(null);
              setOriginalProfilePic(null);
              setIsEditing(false);
            } else {
              setOriginalData({ ...formData });
              setOriginalProfilePic(profilePic); // Save original picture
              setIsEditing(true);
            }
          }}
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
          <Field label="Admin ID" name="adminId" value={formData.adminId} onChange={handleChange} editable={isEditing} disabled icon={<FaIdCard />} onAttemptEdit={handleBlockedEdit} />
         
          <Field label="Email" name="email" value={formData.email} onChange={handleChange} editable={isEditing} icon={<FaEnvelope />} />
          <Field
            label="Date of Birth"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            editable={isEditing}
            type="date"
            icon={<FaCalendarAlt />}
          />
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
      label="Designation"
      name="designation"
      value={formData.designation}
      onChange={handleChange}
      editable={isEditing}
      icon={<FaBriefcase />}
    />

    {/* ➕ New Joined At Field */}
    <Field
      label="Joined At"
      name="joinedAt"
      value={formData.joinedAt}
      onChange={handleChange}
      editable={isEditing}
      type="date"
      disabled icon={<FaIdCard />}
      onAttemptEdit={handleBlockedEdit}
      
    />
        </div>
      </div>

      {/* Address Info */}
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

      {/* System Info */}
      

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
import axios from "axios";
import avatarPlaceholder from "assets/img/avatars/avatar1.png";
import React, { useState, useEffect } from "react";

import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaUser,
  FaIdCard,
  FaKey,
  FaCalendarAlt,
  FaPhone,
  FaCheckCircle,
} from "react-icons/fa";

// Reusable Field Component (Read-Only)
const Field = ({ label, value, icon, loading = false }) => (
  <div className="flex items-start gap-3 mb-4">
    <div className="text-gray-700 mt-1">{icon}</div>
    <div className="w-full">
      <label className="text-sm text-gray-600 dark:text-gray-300">{label}</label>
      {loading ? (
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-navy-700 rounded animate-pulse mt-1"></div>
      ) : (
        <p className="mt-1 text-base text-gray-800 dark:text-gray-100">{value || "N/A"}</p>
      )}
    </div>
  </div>
);

const AdminProfile = () => {
  const [profilePic, setProfilePic] = useState(avatarPlaceholder);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    staffid: "",
    fullName: "",
    department: "",
    contactNumber: "",
    emailAddress: "",
    fullAddress: "",
    dob: "",
    aadharNumber: "",
    designation: "",
    requestToResetPassword: false,
   
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "https://utility-booking-backend.onrender.com/api/staff/email/poovarasan936161@gmail.com"
        );

        // ✅ LOG RESPONSE TO CHECK
        console.log("API Response:", response.data);

        // ✅ Use correct structure based on response shape
        const staff = response.data?.data || response.data;

        setFormData({
           staffid: staff.staffId || "",
          fullName: staff.fullName || "",
          department: staff.department || "",
          contactNumber: staff.contactNumber || "",
          emailAddress: staff.emailAddress || "",
          fullAddress: staff.fullAddress || "",
          dob: staff.dob || "",
          aadharNumber: staff.aadharNumber || "N/A",
          designation: staff.designation || "",
          requestToResetPassword: staff.requestToResetPassword || false,
          
        });
      } catch (error) {
        console.error("❌ Failed to fetch profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-4 dark:bg-navy-700 dark:text-white max-w-screen-lg mx-auto">
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4 bg-blue-500 rounded-2xl p-6 shadow-md text-white">
        <div className="flex items-center gap-4">
          <div>
            <img
              src={profilePic}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
            />
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
                <h2 className="text-2xl font-semibold">{formData.fullName}</h2>
                <p>{formData.designation}</p>
                <p>{formData.department}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-md p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b pb-2">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Staff ID" value={formData.staffid} icon={<FaIdCard />} loading={loading} />
          <Field label="Full Name" value={formData.fullName} icon={<FaUser />} loading={loading} />
          <Field label="Designation" value={formData.designation} icon={<FaKey />} loading={loading} />
          <Field label="Department" value={formData.department} icon={<FaKey />} loading={loading} />
          <Field label="Date of Birth" value={formData.dob} icon={<FaCalendarAlt />} loading={loading} />
          <Field label="Aadhaar Number" value={formData.aadharNumber} icon={<FaIdCard />} loading={loading} />
          
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-md p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b pb-2">
          Address Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Contact Number" value={formData.contactNumber} icon={<FaPhone />} loading={loading} />
          <Field label="Email Address" value={formData.emailAddress} icon={<FaEnvelope />} loading={loading} />
          <Field label="Full Address" value={formData.fullAddress} icon={<FaMapMarkerAlt />} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
import React, { useState } from "react";
import avatar from "assets/img/avatars/avatar1.png";
import { FaPen, FaEnvelope, FaPhone, FaIdCard, FaMapMarkerAlt } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { BsGenderFemale } from "react-icons/bs";
import { AiFillIdcard } from "react-icons/ai";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("Adela");
  const [lastName, setLastName] = useState("Parkson");
  const [userType, setUserType] = useState("Citizen User");
  const [email, setEmail] = useState("smartcitizen.portal@gmail.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("123, Gandhi Street, Coimbatore, Tamil Nadu");
  const [citizenId, setCitizenId] = useState("CITZ1024");
  const [dob, setDob] = useState("1990-05-22");
  const [gender, setGender] = useState("Female");
  const [aadhaar, setAadhaar] = useState("123456789012");

  const [isAadhaarEditable, setIsAadhaarEditable] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const maskedAadhaar = `XXXX-XXXX-${aadhaar.slice(-4)}`;

  const inputStyle =
    "px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-black dark:bg-navy-700 dark:text-white";

  const handleSave = () => {
    setIsEditing(false);
    setIsAadhaarEditable(false);
    setShowOTPInput(false);
    setOtp("");
    setOtpError("");
    console.log("Saved:", {
      fullName,
      lastName,
      userType,
      email,
      phone,
      address,
      citizenId,
      dob,
      gender,
      aadhaar,
    });
  };

  const handleVerifyOtp = () => {
    if (otp === "123456") {
      setIsAadhaarEditable(true);
      setOtp("");
      setOtpError("");
      setShowOTPInput(false);
    } else {
      setOtpError("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="p-4">
        <div className="bg-white dark:bg-navy-800 rounded-xl shadow-md overflow-hidden relative">
          {/* Top Banner */}
          <div className="h-32 w-full bg-blue-400 relative">
            <div className="absolute -bottom-10 left-6">
              <img
                src={avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white dark:border-navy-700"
              />
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute bottom-2 left-32 w-8 h-8 flex items-center justify-center rounded-full bg-blue-900 text-white border-2 border-white shadow-md"
              title="Edit Profile"
            >
              <FaPen size={12} />
            </button>
          </div>

          {/* Profile Details */}
          <div className="pt-14 pb-6 px-9 text-left text-black dark:text-white font-poppins">
            <div className="flex flex-col space-y-1">
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`text-2xl font-bold ${inputStyle} w-[200px]`}
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`text-2xl font-bold ${inputStyle} w-[200px]`}
                    placeholder="Last Name"
                  />
                  <input
                    type="text"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className={`${inputStyle} w-[200px]`}
                    placeholder="User Type"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">{`${fullName} ${lastName}`}</h2>
                  <p className="text-sm text-black dark:text-white/70">{userType}</p>
                </>
              )}
            </div>

            <div className="mt-4 text-sm space-y-3">
              {/* Email */}
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-blue-500" />
                {isEditing ? (
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${inputStyle} w-[300px]`}
                  />
                ) : (
                  <a href={`mailto:${email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    {email}
                  </a>
                )}
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2">
                <FaPhone className="text-pink-500" />
                {isEditing ? (
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`${inputStyle} w-[200px]`}
                  />
                ) : (
                  phone
                )}
              </div>

              {/* Citizen ID */}
              <div className="flex items-center gap-2">
                <FaIdCard className="text-yellow-500" />
                {isEditing ? (
                  <input
                    value={citizenId}
                    onChange={(e) => setCitizenId(e.target.value)}
                    className={`${inputStyle} w-[200px]`}
                  />
                ) : (
                  <span>{citizenId}</span>
                )}
              </div>

              {/* Address */}
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                {isEditing ? (
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`${inputStyle} w-[400px]`}
                  />
                ) : (
                  address
                )}
              </div>

              {/* DOB */}
              <div className="flex items-center gap-2">
                <MdDateRange className="text-blue-500" />
                {isEditing ? (
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={`${inputStyle} w-[200px]`}
                  />
                ) : (
                  <span>Date of Birth: {dob}</span>
                )}
              </div>

              {/* Gender */}
              <div className="flex items-center gap-2">
                <BsGenderFemale className="text-purple-500" />
                {isEditing ? (
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`${inputStyle} w-[200px]`}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <span>Gender: {gender}</span>
                )}
              </div>

              {/* Aadhaar with View and OTP */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <AiFillIdcard className="text-indigo-600" />
                  {!isAadhaarEditable ? (
                    <>
                      <span>Aadhaar: {maskedAadhaar}</span>
                      {!showOTPInput && (
                        <button
                          onClick={() => setShowOTPInput(true)}
                          className="text-xs text-blue-600 underline font-medium hover:text-blue-800"
                        >
                        <button>View Aadhaar</button>
                        </button>
                      )}
                    </>
                  ) : isEditing ? (
                    <input
                      type="text"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value)}
                      maxLength={12}
                      className={`${inputStyle} w-[220px]`}
                    />
                  ) : (
                    <span>Aadhaar: {aadhaar}</span>
                  )}
                </div>

                {showOTPInput && !isAadhaarEditable && (
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={`${inputStyle} w-[120px]`}
                      placeholder="OTP"
                      maxLength={6}
                    />
                    <button
                      onClick={handleVerifyOtp}
                      className="text-sm px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Verify
                    </button>
                    {otpError && (
                      <span className="text-xs text-red-500">{otpError}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="mt-4">
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

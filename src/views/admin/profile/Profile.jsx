import React, { useState, useEffect } from "react";
import avatar from "assets/img/avatars/avatar1.png";
import {
  FaPen,
  FaEnvelope,
  FaTransgender,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaVenus,
  FaMars,
  FaUser,
  FaTrashAlt, FaTint, FaLightbulb
} from "react-icons/fa";
import { MdDateRange,MdOutlinePendingActions } from "react-icons/md";
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(avatar);
  const [fullName, setFullName] = useState("Adela");
  const [lastName, setLastName] = useState("Parkson");
  const userType = "Citizen User"; // constant, not editable
  const [email, setEmail] = useState("smartcitizen.portal@gmail.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [addressLine, setAddressLine] = useState("123, Gandhi Street");
  const [city, setCity] = useState("Coimbatore");
  const [state, setState] = useState("Tamil Nadu");
  const [pincode, setPincode] = useState("641001");
  const citizenId = "CITZ1024"; // constant, not editable
  const [dob, setDob] = useState("1990-05-22");
  const [gender, setGender] = useState("Female");
  const aadhaar = "123456789012";

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (isEditing) {
      setOriginalData({
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
        profilePhoto,
      });
    }
  }, [isEditing]);

  const hasChanges = () => {
    return (
      fullName !== originalData.fullName ||
      lastName !== originalData.lastName ||
      email !== originalData.email ||
      phone !== originalData.phone ||
      addressLine !== originalData.addressLine ||
      city !== originalData.city ||
      state !== originalData.state ||
      pincode !== originalData.pincode ||
      dob !== originalData.dob ||
      gender !== originalData.gender ||
      profilePhoto !== originalData.profilePhoto
    );
  };

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
      profilePhoto,
    });
  };

  const renderGenderIcon = () => {
    switch (gender.toLowerCase()) {
      case "female":
        return <FaVenus className="text-gray-400 text-xl" />;
      case "male":
        return <FaMars className="text-gray-400 text-xl" />;
      case "other":
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
              {/* User Type */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
                <FaUser className="text-gray-400 text-xl mt-1 sm:mr-2" />
                <div className="flex flex-col w-full sm:w-auto">
                  {isEditing ? (
                    <div className="mb-1">
                      <label className="block text-white-600 text-sm font-medium mb-1">User Type:</label>
                      <input
                        type="text"
                        value={userType}
                        readOnly
                        className={`${inputStyle} w-full sm:w-[250px] bg-gray-100 cursor-not-allowed`}
                      />
                    </div>
                  ) : (
                    <span>{userType}</span>
                  )}
                </div>
              </div>

              {/* Citizen ID */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
                <FaIdCard className="text-gray-400 text-xl mt-1 sm:mr-2" />
                <div className="flex flex-col w-full sm:w-auto">
                  {isEditing ? (
                    <div className="mb-1">
                      <label className="block text-white-600 text-sm font-medium mb-1">Citizen ID:</label>
                      <input
                        type="text"
                        value={citizenId}
                        readOnly
                        className={`${inputStyle} w-full sm:w-[250px] bg-gray-100 cursor-not-allowed`}
                      />
                    </div>
                  ) : (
                    <span>{citizenId}</span>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
                <FaEnvelope className="text-gray-400 text-xl mt-1 sm:mr-2" />
                <div className="flex flex-col w-full sm:w-auto">
                  {isEditing ? (
                    <div className="mb-1">
                      <label className="block text-white-600 text-sm font-medium mb-1">Email:</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`${inputStyle} w-full sm:w-[250px]`}
                      />
                    </div>
                  ) : (
                    <span>{email}</span>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
                <FaPhone className="text-gray-400 text-xl mt-1 sm:mr-2" />
                <div className="flex flex-col w-full sm:w-auto">
                  {isEditing ? (
                    <div className="mb-1">
                      <label className="block text-white-600 text-sm font-medium mb-1">Phone:</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`${inputStyle} w-full sm:w-[180px]`}
                      />
                    </div>
                  ) : (
                    <span>{phone}</span>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
                <FaMapMarkerAlt className="text-gray-400 text-xl mt-1 sm:mr-2" />
                <div className="flex flex-col w-full">
                  {isEditing ? (
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                      <div className="flex flex-col w-full sm:w-[300px]">
                        <p className="text-black text-xs font-medium mb-1">Address Line:</p>
                        <input
                          value={addressLine}
                          onChange={(e) => setAddressLine(e.target.value)}
                          className={`${inputStyle} w-full`}
                        />
                      </div>
                      <div className="flex flex-col w-full sm:w-[200px]">
                        <p className="text-black text-xs font-medium mb-1">City:</p>
                        <input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={`${inputStyle} w-full`}
                        />
                      </div>
                      <div className="flex flex-col w-full sm:w-[200px]">
                        <p className="text-black text-xs font-medium mb-1">State:</p>
                        <input
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className={`${inputStyle} w-full`}
                        />
                      </div>
                      <div className="flex flex-col w-full sm:w-[200px]">
                        <p className="text-black text-xs font-medium mb-1">Pincode:</p>
                        <input
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className={`${inputStyle} w-full`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span>{`${addressLine}, ${city}, ${state} - ${pincode}`}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* DOB */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
                <MdDateRange className="text-gray-400 text-xl mt-1 sm:mr-2" />
                <div className="flex flex-col w-full sm:w-auto">
                  {isEditing ? (
                    <div className="mb-1">
                      <label className="block text-white-600 text-sm font-medium mb-1">Date of Birth:</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className={inputStyle}
                      />
                    </div>
                  ) : (
                    <span>{dob}</span>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
                <div className="mt-1 sm:mr-2">{renderGenderIcon()}</div>
                <div className="flex flex-col w-full sm:w-auto">
                  {isEditing ? (
                    <div className="mb-1">
                      <label className="block text-white-600 text-sm font-medium mb-1">Gender:</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className={inputStyle}
                      >
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other</option>
                      </select>
                    </div>
                  ) : (
                    <span>{gender}</span>
                  )}
                </div>
              </div>

              {/* Aadhaar */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2">
                <FaIdCard className="text-gray-400 text-xl mt-1 sm:mr-2" />
                <div className="flex flex-col">
                  <span>{`XXXX-XXXX-${aadhaar.slice(-4)}`}</span>
                </div>
              </div>

            </div>

            {/* Conditionally render Save button only if data is changed */}
            {isEditing && hasChanges() && (
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
    <div className="p-4 pt-0 space-y-6">
  {/* Bookings Card */}
  <div className="bg-white dark:bg-navy-800 rounded-xl shadow-md p-6 space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Previous Bookings</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Your booking history is shown here.</p>
    <ul className="space-y-3">
      <li className="w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center gap-3 text-sm shadow-md">
        <FaTrashAlt className="text-gray-700" />
        <span>Garbage Pickup – 15 June 2025 – <span className="font-medium text-yellow-600">Scheduled</span></span>
      </li>
      <li className="w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center gap-3 text-sm shadow-md">
        <FaTint className="text-gray-700" />
        <span>Water Tanker – 3 May 2025 – <span className="font-medium text-green-600">Completed</span></span>
      </li>
    </ul>
  </div>

  {/* Complaints Card */}
  <div className="bg-white dark:bg-navy-800 rounded-xl shadow-md p-6 space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Previous Complaints</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">All your submitted complaints appear here.</p>
    <ul className="space-y-3">
      <li className="w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center gap-3 text-sm shadow-md">
        <FaLightbulb className="text-gray-700" />
        <span>Street light not working – 12 April 2025 – <span className="font-medium text-green-600">Resolved</span></span>
      </li>
      <li className="w-full p-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center gap-3 text-sm shadow-md">
        <FaTrashAlt className="text-gray-700" />
        <span>Garbage not collected – 5 March 2025 – <span className="font-medium text-yellow-600">Pending</span></span>
      </li>
    </ul>
  </div>
</div>


    </div>
  
  );
};

export default Profile;

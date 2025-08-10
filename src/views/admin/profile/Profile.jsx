import React, { useState, useEffect } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaPen,
  FaTrashAlt,
  FaTint,
  FaLightbulb,
  FaMars,
  FaVenus,
  FaGenderless,
} from "react-icons/fa";
import {
  MdPerson,
  MdBadge,
  MdEmail,
  MdFingerprint,
  MdLocationCity,
  MdLocationPin,
  MdLocationOn,
  MdWc,
  MdCalendarToday,
  MdHome,
} from "react-icons/md";
import avatar from "assets/img/avatars/avatar5.png";

// Crop image helper function
function getCroppedImg(imageSrc, pixelCrop) {
  const canvas = document.createElement("canvas");
  const image = new Image();

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Canvas is empty"));
        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/jpeg");
    };
    image.onerror = reject;
    image.src = imageSrc;
  });
}

// Function to get gender icon
const getGenderIcon = (gender) => {
  if (!gender) return <FaGenderless />;
  const g = gender.toLowerCase();
  if (g === "male") return <FaMars className="text-blue-500" />;
  if (g === "female") return <FaVenus className="text-blue-500" />;
  return <FaGenderless className="text-blue-500" />;
};

export default function ProfileCard() {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    user_name: "",
    citizen_id: "",
    aadhaar: "",
    email: "",
    address: "",
    city: "",
    dob: "",
    gender: "",
    pincode: "",
    state: "",
  });
  const [bookings, setBookings] = useState([]); // NEW state for API bookings
  const [originalUser, setOriginalUser] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setCropModalOpen(true);
    }
  };

  const showCroppedImage = async () => {
    try {
      const cropped = await getCroppedImg(selectedImage, croppedAreaPixels);
      setCroppedImage(cropped);
      setCropModalOpen(false);
      setSelectedImage(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "https://auth-backend-2-k3ph.onrender.com/citizen-profiles/CIT005"
        );

        const data = res.data?.data || res.data || {};

        const userObj = {
          user_name: data.userName || "",
          citizen_id: data.citizenId || "",
          aadhaar: data.aadhaar || "",
          email: data.email || "",
          address: data.address || "",
          city: data.city || "",
          dob: data.dob || "",
          gender: data.gender || "",
          pincode: data.pincode || "",
          state: data.state || "",
        };

        setUser(userObj);
        setOriginalUser(userObj);
        setOriginalImage(avatar);
        setCroppedImage(avatar);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

  const fetchBookings = async () => {
      try {
        const res = await axios.get(
          "https://utility-booking-backend.onrender.com/api/task/dto/18"
        );
        setBookings(res.data?.data?.data || []); // store bookings array
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchUser();
    fetchBookings();
  }, []);

  // status color helper
  const getStatusClass = (status) => {
    if (!status) return "text-gray-500";
    const s = status.toLowerCase();
    if (s.includes("completed")) return "text-green-600 font-medium";
    if (s.includes("pending")) return "text-yellow-600 font-medium";
    if (s.includes("scheduled")) return "text-blue-600 font-medium";
    return "text-gray-600";
  };
  // Save updated user
  const handleSave = async () => {
    try {
      const payload = {
        citizenId: user.citizen_id,
        userName: user.user_name,
        email: user.email,
        aadhaar: user.aadhaar,
        gender: user.gender,
        address: user.address,
        city: user.city,
        state: "Newyork", // Force change to Newyork
        pincode: user.pincode,
        dob: user.dob,
      };

      await axios.put(
        `https://auth-backend-2-k3ph.onrender.com/citizen-profiles/${user.citizen_id}`,
        payload
      );

      setOriginalUser({ ...user, state: "Newyork" });
      setUser((prev) => ({ ...prev, state: "Newyork" }));
      setEditMode(false);
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const fields = [
    ["user_name", "User Name", <MdPerson />],
    ["citizen_id", "Citizen ID", <MdBadge />, true],
    ["email", "Email", <MdEmail />],
    ["aadhaar", "Aadhaar", <MdFingerprint />, true],
    ["address", "Address", <MdHome />],
    ["city", "City", <MdLocationCity />],
    ["dob", "Date of Birth", <MdCalendarToday />],
    ["gender", "Gender", <MdWc />],
    ["pincode", "Pincode", <MdLocationPin />],
    ["state", "State", <MdLocationOn />],
  ];

  return (
    <div className="p-6 space-y-6 font-sans">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center bg-blue-600 rounded-2xl p-6 w-full lg:w-1/3 shadow-lg">
          <div className="relative mb-2">
            <img
              src={croppedImage || avatar}
              alt="User"
              className="rounded-full border-2 border-white w-56 h-56 object-cover shadow-md"
            />
            {editMode && (
              <>
                <label htmlFor="profilePicUpload">
                  <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow hover:bg-gray-100">
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
          <h2 className="text-2xl font-semibold text-white">
            {user.user_name}
          </h2>
        </div>

        {/* Profile Info Section */}
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl p-6 w-full lg:w-2/3 shadow-lg">
          <div className="flex justify-end gap-2 mb-4">
            {!editMode ? (
              <button
                onClick={() => {
                  setOriginalUser(user);
                  setOriginalImage(croppedImage);
                  setEditMode(true);
                }}
                className="bg-yellow-400 text-white px-3 py-1.5 rounded-full shadow hover:bg-yellow-500 flex items-center gap-1 text-sm font-semibold"
              >
                <FaEdit /> Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-3 py-1.5 rounded-full shadow hover:bg-green-700 flex items-center gap-1 text-sm font-semibold"
                >
                  <FaSave /> Save
                </button>
                <button
                  onClick={() => {
                    setUser(originalUser);
                    setCroppedImage(originalImage);
                    setSelectedImage(null);
                    setEditMode(false);
                  }}
                  className="bg-red-600 text-white px-3 py-1.5 rounded-full shadow hover:bg-red-700 flex items-center gap-1 text-sm font-semibold"
                >
                  <FaTimes /> Cancel
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map(([key, label, icon, isReadOnly = false]) => (
              <div key={key}>
                {editMode ? (
                  <>
                    <label className="block text-sm font-semibold mb-1">
                      {label}
                    </label>
                    {key === "dob" ? (
                      <input
                        type="date"
                        className={`w-full p-2 rounded border ${
                          isReadOnly
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                            : "bg-white dark:bg-[#0b1331] text-gray-900 dark:text-white border border-gray-400 dark:border-gray-200"
                        }`}
                        value={user[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        readOnly={isReadOnly}
                      />
                    ) : key === "gender" ? (
                      <select
                        className={`w-full p-2 rounded border ${
                          isReadOnly
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                            : "bg-white dark:bg-[#0b1331] text-gray-900 dark:text-white border border-gray-400 dark:border-gray-200"
                        }`}
                        value={user[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        disabled={isReadOnly}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        className={`w-full p-2 rounded border ${
                          isReadOnly
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                            : "bg-white dark:bg-[#0b1331] text-gray-900 dark:text-white border border-gray-400 dark:border-gray-200"
                        }`}
                        value={user[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        readOnly={isReadOnly}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
                    <span className="text-blue-600">
                      {key === "gender" ? getGenderIcon(user[key]) : icon}
                    </span>
                    <p className="text-sm font-medium">
                      {key === "aadhaar"
                        ? `**** **** ${user[key]?.slice(-4)}`
                        : user[key]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Previous Bookings */}
     
<div className="bg-white dark:bg-gray-900 dark:text-white rounded-xl shadow-md p-6 space-y-4">
  <h3 className="text-lg font-semibold">Previous Bookings</h3>
  {bookings.length === 0 ? (
    <p className="text-gray-500">No previous bookings found.</p>
  ) : (
    <ul className="space-y-3">
      {bookings.map((b, index) => (
        <li
          key={index}
          className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-md"
        >
          <FaTint /> {/* Icon for service */}
          <span>
            {b.serviceName} – {b.requestedDate} –{" "}
            <span className={getStatusClass(b.status)}>{b.status}</span>
          </span>
        </li>
      ))}
    </ul>
  )}
</div>


      {/* Previous Complaints */}
      <div className="bg-white dark:bg-gray-900  dark:text-white rounded-xl shadow-md p-6 space-y-4">
        <h3 className="text-lg font-semibold">Previous Complaints</h3>
        <ul className="space-y-3">
          <li className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-md">
            <FaLightbulb /> Street light not working – 12 April 2025 –{" "}
            <span className="text-green-600 font-medium">Resolved</span>
          </li>
          <li className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-md">
            <FaTrashAlt /> Garbage not collected – 5 March 2025 –{" "}
            <span className="text-yellow-600 font-medium">Pending</span>
          </li>
        </ul>
      </div>

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-4 w-[90%] max-w-md shadow-lg">
            <div className="relative w-full h-64 bg-gray-100">
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) =>
                  setCroppedAreaPixels(croppedAreaPixels)
                }
              />
            </div>
            <div className="flex justify-between mt-4">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
              />
              <div className="flex gap-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded shadow"
                  onClick={showCroppedImage}
                >
                  Crop
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded shadow"
                  onClick={() => {
                    setCropModalOpen(false);
                    setSelectedImage(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

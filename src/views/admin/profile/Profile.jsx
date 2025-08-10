import loading_gif from "../../../assets/gif/loading-gif.gif";
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
import avatar from "assets/img/avatars/avatar4.png";

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

// Gender icon helper
const getGenderIcon = (gender) => {
  if (!gender) return <FaGenderless />;
  const g = gender.toLowerCase();
  if (g === "male") return <FaMars className="text-blue-500" />;
  if (g === "female") return <FaVenus className="text-blue-500" />;
  return <FaGenderless className="text-blue-500" />;
};

export default function ProfileCard() {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const citizenId = localStorage.getItem("id");
  const HELPDESK_API = process.env.REACT_APP_API_HELPDESK_URL;

  const [loading, setLoading] = useState(false);
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
  const [complaints, setComplaints] = useState([]);
  const [bookings, setBookings] = useState([]);
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
  useEffect(() => {
    const fetchData = async () => {
      let showLoaderTimeout;

      try {
        showLoaderTimeout = setTimeout(() => {
          setLoading(true);
        }, 300);

        const userRes = await axios.get(
          `https://auth-backend-2-k3ph.onrender.com/citizen-profiles/${citizenId}`
        );
        const data = userRes.data?.data || userRes.data || {};
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

        const id = localStorage.getItem("id");
        if (id) {
          const bookingsRes = await axios.get(
            `https://utility-booking-backend.onrender.com/api/task/dto/${citizenId}`
          );
          setBookings(bookingsRes.data?.data?.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        clearTimeout(showLoaderTimeout);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!token || !email || !citizenId || !HELPDESK_API) return;

    setLoading(true);

    axios
      .get(`${HELPDESK_API}/citizen/complaints`, {
        headers: {
          token,
          email,
          id: citizenId,
        },
      })
      .then((res) => {
        console.log("Complaints Response:", res.data.data);
        setComplaints(res.data.data || []);
      })
      .catch((err) => {
        console.error(
          "Failed to fetch complaints:",
          err.response?.data || err.message
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token, email, citizenId, HELPDESK_API]);

  const getStatusClass = (status) => {
    if (!status) return "text-gray-500";
    const s = status.toLowerCase();
    if (s.includes("completed") || s === "resolved")
      return "text-green-600 font-medium";
    if (s.includes("pending")) return "text-yellow-600 font-medium";
    if (s.includes("scheduled")) return "text-blue-600 font-medium";
    return "text-gray-600";
  };

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
        state: user.state,
        pincode: user.pincode,
        dob: user.dob,
      };

      await axios.put(
        `https://auth-backend-2-k3ph.onrender.com/citizen-profiles/${user.citizen_id}`,
        payload
      );

      setOriginalUser(user);
      setUser(user);
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
    <div className="space-y-6 p-6 font-sans">
      {/* Loading Overlay */}
      {loading && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
          <img
            src={loading_gif}
            alt="Loading..."
            className="h-12 w-12 sm:h-16 sm:w-16"
          />
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Profile Picture */}
        <div className="flex w-full flex-col items-center rounded-2xl bg-blue-600 p-6 shadow-lg lg:w-1/3">
          <div className="relative mb-2">
            <img
              src={croppedImage || avatar}
              alt="User"
              className="h-56 w-56 rounded-full border-2 border-white object-cover shadow-md"
            />
            {editMode && (
              <>
                <label htmlFor="profilePicUpload">
                  <div className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-white p-2 shadow hover:bg-gray-100">
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

        {/* Profile Info */}
        <div className="w-full rounded-2xl bg-white p-6 text-gray-900 shadow-lg dark:bg-gray-900 dark:text-white lg:w-2/3">
          <div className="mb-4 flex justify-end gap-2">
            {!editMode ? (
              <button
                onClick={() => {
                  setOriginalUser(user);
                  setOriginalImage(croppedImage);
                  setEditMode(true);
                }}
                className="flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-yellow-500"
              >
                <FaEdit /> Edit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-green-700"
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
                  className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-red-700"
                >
                  <FaTimes /> Cancel
                </button>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {fields.map(([key, label, icon, isReadOnly = false]) => (
              <div key={key}>
                {editMode ? (
                  <>
                    <label className="mb-1 block text-sm font-semibold">
                      {label}
                    </label>
                    {key === "dob" ? (
                      <input
                        type="date"
                        className={`w-full rounded border p-2 ${
                          isReadOnly
                            ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800"
                            : "border border-gray-400 bg-white text-gray-900 dark:border-gray-200 dark:bg-[#0b1331] dark:text-white"
                        }`}
                        value={user[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        readOnly={isReadOnly}
                      />
                    ) : key === "gender" ? (
                      <select
                        className={`w-full rounded border p-2 ${
                          isReadOnly
                            ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800"
                            : "border border-gray-400 bg-white text-gray-900 dark:border-gray-200 dark:bg-[#0b1331] dark:text-white"
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
                        className={`w-full rounded border p-2 ${
                          isReadOnly
                            ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800"
                            : "border border-gray-400 bg-white text-gray-900 dark:border-gray-200 dark:bg-[#0b1331] dark:text-white"
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
      <div className="space-y-4 rounded-xl bg-white p-6 shadow-md dark:bg-gray-900 dark:text-white">
        <h3 className="text-lg font-semibold">Previous Bookings</h3>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No previous bookings found.</p>
        ) : (
          <ul className="space-y-3">
            {bookings.map((b, index) => (
              <li
                key={index}
                className="flex items-center gap-3 rounded-2xl bg-gray-100 p-4 shadow-md dark:bg-gray-800"
              >
                <FaTint />
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
      <div className="space-y-4 rounded-xl bg-white p-6 shadow-md dark:bg-gray-900 dark:text-white">
        <h3 className="text-lg font-semibold">Previous Complaints</h3>

        {complaints.length === 0 ? (
          <p className="text-gray-500">No previous complaints found.</p>
        ) : (
          <ul className="space-y-3">
            {complaints.map((comp) => (
              <li
                key={comp.id}
                className="rounded-2xl bg-gray-100 p-4 shadow-md dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  <FaLightbulb className="flex-shrink-0 text-yellow-500" />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {comp.issue || "No Issue"}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {comp.issueDescription || "No description provided"}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Date:{" "}
                      {comp.complaintDate
                        ? new Date(comp.complaintDate).toLocaleDateString()
                        : "No Date"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Status:{" "}
                      <span className={getStatusClass(comp.status)}>
                        {comp.status || "Unknown"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Category: {comp.category || "N/A"} | Department:{" "}
                      {comp.department || "N/A"}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-60">
          <div className="w-[90%] max-w-md rounded-lg bg-white p-4 shadow-lg">
            <div className="relative h-64 w-full bg-gray-100">
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
            <div className="mt-4 flex justify-between">
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
                  className="rounded bg-blue-600 px-4 py-2 text-white shadow"
                  onClick={showCroppedImage}
                >
                  Crop
                </button>
                <button
                  className="rounded bg-gray-400 px-4 py-2 text-white shadow"
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

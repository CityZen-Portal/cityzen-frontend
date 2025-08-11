import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaPen,
  FaMars,
  FaVenus,
  FaGenderless,
  FaLightbulb,
} from "react-icons/fa";
import {
  MdWork,
  MdCheckCircle,
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
import avatar from "assets/img/avatars/avatar6.jpg";
import loading_gif from "../../../assets/gif/loading-gif.gif";
import ComplaintCard from "./components/ComplaintCard";
import BookingCard from "./components/BookingCard";
import BookingCardHorizon from "./components/BookingCard";
import BookingCardTailwind from "./components/BookingCard";

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

  const [loading, setLoading] = useState(true);
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
  const [originalImage, setOriginalImage] = useState(avatar);
  const [selectedImage, setSelectedImage] = useState(avatar);

  useEffect(() => {
    let active = true;
    async function fetchAll() {
      setLoading(true);
      try {
        const [userRes, bookingsRes, complaintsRes] = await Promise.all([
          axios.get(
            `https://auth-backend-2-k3ph.onrender.com/api/auth/getUser/${email}`
          ),
          axios.get(
            `https://utility-booking-backend.onrender.com/api/task/dto/${citizenId}`
          ),
          axios.get(`${HELPDESK_API}/citizen/complaints`, {
            headers: {
              token,
              email,
              id: citizenId,
            },
          }),
        ]);
        if (!active) return;
        const data = userRes.data?.data || userRes.data || {};
        const userObj = {
          user_name: data.userName || "",
          citizen_id: data.id || "",
          aadhaar: data.aadhaar || "",
          email: data.email || "",
          address: data.address || "not update",
          city: data.city || "not update yet",
          dob: data.dob || "not update yet",
          gender: data.gender || "",
          pincode: data.pincode || "not update yet",
          state: data.state || "not update yet",
        };
        setUser(userObj);
        setOriginalUser(userObj);
        setOriginalImage(avatar);
        setSelectedImage(avatar);
        setBookings(bookingsRes.data?.data?.data || []);
        setComplaints(complaintsRes.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    if (token && email && citizenId && HELPDESK_API) {
      fetchAll();
    } else {
      setLoading(false);
    }
    return () => {
      active = false;
    };
  }, [token, email, citizenId, HELPDESK_API]);

  // Standard input and image handlers
  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  // Simple image upload handler (no cropping)
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
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
      setEditMode(false);
    } catch (error) {
      console.error("Failed to save user:", error);
    }
  };

  const getStatusClass = (status) => {
    if (!status) return "text-gray-500";
    const s = status.toLowerCase();
    if (s.includes("completed") || s === "resolved")
      return "text-green-600 font-medium";
    if (s.includes("pending")) return "text-yellow-600 font-medium";
    if (s.includes("scheduled")) return "text-blue-600 font-medium";
    return "text-gray-600";
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

  // --- Loader page ---
  if (loading) {
    return (
      <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
        <img
          src={loading_gif}
          alt="Loading..."
          className="h-12 w-12 sm:h-16 sm:w-16"
        />
      </div>
    );
  }

  // --- Main profile page ---
  return (
    <div className="space-y-6 p-6 font-sans">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Profile Picture */}
        <div className="flex w-full flex-col items-center rounded-2xl bg-blue-600 p-6 shadow-lg lg:w-1/3">
          <div className="relative mb-2">
            <img
              src={selectedImage || avatar}
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
                    setSelectedImage(avatar);
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
                <div className="flex items-start gap-3">
                  <FaLightbulb className="flex-shrink-0 text-xl text-yellow-500" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {comp.issue || "No Issue"}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {comp.issueDescription || "No description provided"}
                    </span>
                    <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Date:{" "}
                      {comp.complaintDate
                        ? new Date(comp.complaintDate).toLocaleDateString()
                        : "No Date"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Status:{" "}
                      <span className={getStatusClass(comp.status)}>
                        {comp.status || "Unknown"}
                      </span>
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Category: {comp.category || "N/A"} | Department:{" "}
                      {comp.department || "N/A"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-4 rounded-xl bg-white p-6 shadow-md dark:bg-gray-900 dark:text-white">
        <h3 className="text-lg font-semibold">Previous Bookings</h3>

        {bookings.length === 0 ? (
          <p className="text-gray-500">No previous bookings found.</p>
        ) : (
          <ul className="space-y-3">
            {bookings.map((booking, index) => (
              <BookingCardTailwind key={index} booking={booking} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

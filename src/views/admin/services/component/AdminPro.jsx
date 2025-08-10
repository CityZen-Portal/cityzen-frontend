import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";
import avatarPlaceholder from "assets/img/avatars/avatar1.png";
import {
  FaPen, FaEnvelope, FaMapMarkerAlt, FaUser, FaIdCard, FaCity,
  FaFlag, FaCalendarAlt, FaMars, FaVenus, FaGenderless, FaPhone,
  FaBriefcase
} from "react-icons/fa";

const getGenderIcon = (gender) => {
  switch (gender) {
    case "Male": return <FaMars className="text-gray-700 text-2xl" />;
    case "Female": return <FaVenus className="text-gray-700 text-2xl" />;
    default: return <FaGenderless className="text-gray-700 text-2xl" />;
  }
};

const Field = ({
  label, name, value, onChange, editable = false,
  disabled = false, type = "text", icon, isSelect = false,
  options = [], onAttemptEdit
}) => (
  <div className="flex items-start gap-3 mb-4" title={disabled ? "You can't edit this field" : ""}>
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
                <option key={opt} value={opt}>{opt}</option>
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
  const [originalProfilePic, setOriginalProfilePic] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", adminId: "", email: "", dob: "",
    gender: "", address: "", city: "", state: "", pincode: "",
    phone: "", designation: "", joinedAt: "", country: ""
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleBlockedEdit = () => alert("You can't edit this field.");

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = useCallback(async (imageSrc, cropPixels) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((res) => (image.onload = res));
    const canvas = document.createElement("canvas");
    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      cropPixels.x, cropPixels.y, cropPixels.width, cropPixels.height,
      0, 0, cropPixels.width, cropPixels.height
    );
    return canvas.toDataURL("image/jpeg");
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setCropModalOpen(true);
    }
  };

  const handleSaveCrop = async () => {
    const cropped = await getCroppedImg(selectedImage, croppedAreaPixels);
    setProfilePic(cropped);
    setSelectedImage(null);
    setCropModalOpen(false);
  };

  const handleCancelCrop = () => {
    setCropModalOpen(false);
    setSelectedImage(null);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        phoneNo: formData.phone, // match backend field name
        profilePic
      };

      const response = await axios.put(
        `https://auth-backend-2-k3ph.onrender.com/admin-profiles/${formData.adminId}`,
        payload
      );

      console.log("Update success:", response.data);
      setIsEditing(false);
      setOriginalData(null);
      setOriginalProfilePic(null);
      
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    const adminId = "ADM007"; // Change this as needed

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://auth-backend-2-k3ph.onrender.com/admin-profiles/${adminId}`
        );
        const data = response.data;

        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          adminId: data.adminId || "",
          email: data.email || "",
          dob: data.dob || "",
          gender: data.gender || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          phone: data.phoneNo || data.phone || "",
          designation: data.designation || "",
          joinedAt: data.joinedAt || "",
          country: data.country || ""
        });

        if (data.profilePic) {
          setProfilePic(data.profilePic);
        }
      } catch (err) {
        console.error("Error fetching admin profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-4 dark:bg-navy-700 dark:text-white max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 bg-blue-500 rounded-2xl p-6 shadow-md text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow" />
            {isEditing && (
              <>
                <label htmlFor="profilePicUpload">
                  <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow-md hover:bg-gray-100 transition">
                    <FaPen className="text-blue-600 w-4 h-4" />
                  </div>
                </label>
                <input type="file" id="profilePicUpload" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
              </>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{formData.firstName} {formData.lastName}</h2>
            <p>{formData.country}</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              setFormData(originalData);
              setProfilePic(originalProfilePic);
              setOriginalData(null);
              setOriginalProfilePic(null);
              setIsEditing(false);
            } else {
              setOriginalData({ ...formData });
              setOriginalProfilePic(profilePic);
              setIsEditing(true);
            }
          }}
          className={`px-4 py-2 rounded flex items-center gap-2 text-white ${isEditing ? "bg-red-600 hover:bg-red-700" : "bg-teal-600 hover:bg-teal-700"}`}
        >
          <FaPen />
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-4 w-[90%] max-w-lg">
            <h2 className="text-lg font-semibold mb-2">Crop Image</h2>
            <div className="relative w-full h-64 bg-gray-200">
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="mt-4">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button onClick={handleCancelCrop} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
              <button onClick={handleSaveCrop} className="px-4 py-2 bg-blue-600 text-white rounded">Crop</button>
            </div>
          </div>
        </div>
      )}

      {/* Personal Info */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-md p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b pb-2">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isEditing ? (
            <>
              <Field label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} editable icon={<FaUser />} />
              <Field label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} editable icon={<FaUser />} />
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
          <Field label="Date of Birth" name="dob" value={formData.dob} onChange={handleChange} editable={isEditing} type="date" icon={<FaCalendarAlt />} />
          <Field label="Gender" name="gender" value={formData.gender} onChange={handleChange} editable={isEditing} isSelect options={["Male", "Female", "Other"]} icon={getGenderIcon(formData.gender)} />
          <Field label="Designation" name="designation" value={formData.designation} onChange={handleChange} editable={isEditing} icon={<FaBriefcase />} />
          <Field label="Joined At" name="joinedAt" value={formData.joinedAt} onChange={handleChange} editable={isEditing} type="date" disabled icon={<FaIdCard />} onAttemptEdit={handleBlockedEdit} />
        </div>
      </div>

      {/* Address Info */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-md p-6 mt-8">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 border-b pb-2">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Address" name="address" value={formData.address} onChange={handleChange} editable={isEditing} icon={<FaMapMarkerAlt />} />
          <Field label="City" name="city" value={formData.city} onChange={handleChange} editable={isEditing} icon={<FaCity />} />
          <Field label="State" name="state" value={formData.state} onChange={handleChange} editable={isEditing} icon={<FaFlag />} />
          <Field label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} editable={isEditing} icon={<FaMapMarkerAlt />} />
          <Field label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} editable={isEditing} icon={<FaPhone />} type="tel" />
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="text-right mt-6">
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow">Save Changes</button>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;

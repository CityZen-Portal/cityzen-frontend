import React, { useEffect, useState } from 'react';
import Card from "components/card";
import InputField from "components/fields/InputField";
import { MdCheckCircleOutline, MdPhotoCamera, MdPerson, MdCalendarToday, MdComment } from "react-icons/md";
import axios from 'axios';

const IMAGE_UPLOAD_API = "https://media-api-service-hzx2.onrender.com/api/images/upload";

const CompletionForm = ({
  selectedRequest,
  setSelectedRequest,
  formData,
  handleInputChange,
  errors,
  setErrors,
  fetchRequests
}) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null); // File object
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (!selectedRequest) return;
    const fetchTask = async () => {
      try {
        const response = await axios.get(`https://utility-booking-backend.onrender.com/api/task/${selectedRequest.taskId}`);
        setTask(response.data.data);
        // console.log(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTask();
  }, [selectedRequest?.taskId]);

  if (!selectedRequest) return null;

  // Handle photo input change (store file + preview for UI)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file); // Store the actual file object for upload
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
      if (setErrors) setErrors((prev = {}) => ({ ...prev, photo: undefined })); // Clear photo error
    }
  };

  // Function for uploading file
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("name", selectedRequest.taskId);
    formData.append("imageFile", file); // Use the File object directly!
    const response = await axios.post(IMAGE_UPLOAD_API, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  };

  // Submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageName, imagePath;

    try {

      const uploadRes = await uploadImage(photo);

      imageName = uploadRes.data.name;
      imagePath = uploadRes.data.path;

      const payload = {
        serviceId: task.serviceId,
        citizenId: task.citizenId,
        staffId: task.staffId,
        status: "COMPLETED",
        completion_date: `${formData.completionDate}T00:00:00.000+00:00`,
        imageName: imageName,
        imagePath: imagePath,
        suggestion: formData.suggestion || ""
      };
      // console.log(payload);
      await axios.put(`https://utility-booking-backend.onrender.com/api/task/${selectedRequest.taskId}`, payload);
      fetchRequests();
      setSelectedRequest(null);
      alert("Task marked as completed!");
    } catch (err) {
      alert("There was an error completing the request.");
    }
    setLoading(false);
  };

  return (
    <Card extra=" mt-7">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-full bg-brand-500 p-2 text-white">
            <MdCheckCircleOutline className="h-6 w-6" />
          </div>
          <h5 className="text-xl font-bold text-navy-700 dark:text-white">Complete Service Request</h5>
        </div>
        <div className="bg-gray-50 dark:bg-navy-900 p-4 rounded-xl mb-6">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-navy-700">
            <MdPerson className="h-5 w-5 text-brand-500" />
            <p className="font-bold text-navy-700 dark:text-white">Request Informations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="font-medium text-navy-700 dark:text-white">Citizen:</span>
              {selectedRequest.citizenName}
            </p>
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="font-medium text-navy-700 dark:text-white">Service Request:</span>
              {selectedRequest.description}
            </p>
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="font-medium text-navy-700 dark:text-white">Request Date:</span>
              {selectedRequest.requested_Date}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-navy-800 p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-navy-700">
                <MdPerson className="h-5 w-5 text-brand-500" />
                {/* <p className="font-bold text-navy-700 dark:text-white">Staff Information</p> */}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-navy-700 dark:text-white mb-2">
                  <div className="flex items-center gap-2">
                    <MdCalendarToday className="h-4 w-4" />
                    <span>Completion Date *</span>
                  </div>
                </label>
                <input
                  type="date"
                  id="completionDate"
                  value={formData.completionDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]} // disables past dates
                  className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border ${errors?.completionDate ? 'border-red-500' : 'border-gray-200'
                    } bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white focus:border-brand-500 dark:focus:border-brand-400 transition-colors`}
                />

                {errors?.completionDate && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.completionDate}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-navy-700 dark:text-white mb-2">
                  <div className="flex items-center gap-2">
                    <MdComment className="h-4 w-4" />
                    <span>Work Summary</span>
                  </div>
                </label>
                <textarea
                  id="suggestion"
                  placeholder="Enter any suggestions or notes for the citizen"
                  value={formData.suggestion}
                  onChange={handleInputChange}
                  className="mt-2 flex min-h-[100px] w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none dark:!border-white/10 dark:text-white focus:border-brand-500 dark:focus:border-brand-400 transition-colors"
                />
              </div>
            </div>
            <div className="bg-white dark:bg-navy-800 p-4 rounded-xl shadow-md">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-navy-700">
                <MdPhotoCamera className="h-5 w-5 text-brand-500" />
                <p className="font-bold text-navy-700 dark:text-white">Completion Photo *</p>
              </div>
              <div className="mb-4 flex flex-col items-center justify-center">
                <div className="w-full mb-4">
                  <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-navy-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-navy-900 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <MdPhotoCamera className="w-10 h-10 mb-3 text-gray-400 dark:text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or JPEG (MAX. 5MB)</p>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {errors?.photo && (
                  <p className="text-red-500 text-xs mt-1 text-center">{errors.photo}</p>
                )}
                {photoPreview ? (
                  <div className="mt-2 w-full">
                    <div className="overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 mt-2">
                    <p>No photo selected yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              disabled={loading}
              type="button"
              onClick={() => setSelectedRequest(null)}
              className="px-5 py-3 mr-3 rounded-xl bg-white text-navy-700 dark:bg-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-600 shadow-md transition-all duration-200 flex items-center gap-2"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="px-5 py-3 rounded-xl bg-brand-500 text-white hover:bg-brand-600 shadow-md transition-all duration-200 flex items-center gap-2"
            >
              {loading ? "Saving..." : (
                <>
                  <MdCheckCircleOutline className="h-5 w-5" />
                  <span>Mark as Completed</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default CompletionForm;

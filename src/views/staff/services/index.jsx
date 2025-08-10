import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FilterButtons, RequestDetails, CompletionForm, RequestsTable } from './component';
import loading_gif from "../../../assets/gif/loading-gif.gif"
const StaffService = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [formData, setFormData] = useState({
    staffName: "",
    completionDate: new Date().toISOString().split('T')[0],
    suggestion: ""
  });
  const [viewMode, setViewMode] = useState("all");
  const [viewingDetails, setViewingDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const formRef = useRef(null);

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };


  const fetchRequests = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await axios.get(`https://utility-booking-backend.onrender.com/api/task/email/${email}`);
      setRequests(response.data.data);
    } catch (err) {
      setStatusCode(err.status);
      // setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setErrors(prev => ({
      ...prev,
      [id]: ""
    }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setPhoto(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);

      setErrors(prev => ({
        ...prev,
        photo: ""
      }));
    }
  };

  const handleComplete = (request) => {
    setSelectedRequest(request);
    setFormData({
      staffName: "",
      completionDate: new Date().toISOString().split('T')[0],
      suggestion: ""
    });
    setPhoto(null);
    setPhotoPreview(null);
    setViewingDetails(null);
    setErrors({});
    scrollToForm();
  };

  const handleViewDetails = (request) => {
    setViewingDetails(request);
    setSelectedRequest(null);
    scrollToForm();
  };

  const handleSubmitCompletion = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.staffName.trim()) newErrors.staffName = "Staff name is required.";
    if (!formData.completionDate) newErrors.completionDate = "Completion date is required.";
    if (!photoPreview) newErrors.photo = "Completion photo is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const updatePayload = {
        ...selectedRequest,
        status: "completed",
        completedDate: formData.completionDate,
        staffName: formData.staffName,
        suggestion: formData.suggestion,
        photo: photoPreview
      };

      await axios.put(`https://utility-booking-backend.onrender.com/api/task/${selectedRequest.id}`, updatePayload);

      fetchRequests(); // Refresh data from backend
    } catch (err) {
      console.error("Error updating request", err);
      setError("Failed to update task");
    }

    setSelectedRequest(null);
    setPhoto(null);
    setPhotoPreview(null);
    setFormData({
      staffName: "",
      completionDate: new Date().toISOString().split('T')[0],
      suggestion: ""
    });
    setErrors({});
  };

  const filteredRequests =
    viewMode === "all"
      ? requests
      : viewMode === "pending"
        ? requests.filter(req => req.taskStatus === "PENDING")
        : requests.filter(req => req.taskStatus === "COMPLETED");

  

  if (error) return <p className="text-center text-red-500 mt-5">{error}</p>;

  return (
    <div className="mt-3">
      {statusCode === 404 ?
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="
      bg-white dark:bg-navy-700 
      text-center px-8 py-6 rounded-lg shadow-lg max-w-lg w-full 
      border border-gray-300 dark:border-gray-700
    ">

            <div className="flex justify-center mb-4">
              <div className="
          flex items-center justify-center w-12 h-12 rounded-full 
          border-2 border-yellow-400 
          bg-yellow-50 dark:bg-gray-800
        ">
                <span className="text-yellow-500 text-lg font-bold">!</span>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              <span className=" text-white px-1 rounded">No</span> Service Requests Available
            </h2>

            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
               You have no service requests at the moment.
            </p>
          </div>
        </div>
        : <>
          <FilterButtons viewMode={viewMode} setViewMode={setViewMode} />

          <RequestsTable
            viewMode={viewMode}
            filteredRequests={filteredRequests}
            handleViewDetails={handleViewDetails}
            handleComplete={handleComplete}
             loading={loading} 
          />
        </>
      }
      <div ref={formRef}>
        <CompletionForm
          selectedRequest={selectedRequest}
          setSelectedRequest={setSelectedRequest}
          formData={formData}
          handleInputChange={handleInputChange}
          handlePhotoChange={handlePhotoChange}
          photoPreview={photoPreview}
          errors={errors}
          handleSubmitCompletion={handleSubmitCompletion}
          fetchRequests={fetchRequests}
        />
      </div>
      <RequestDetails
        selectedRequest={selectedRequest}
        viewingDetails={viewingDetails}
        setViewingDetails={setViewingDetails}
      />
    </div>
  );
};

export default StaffService;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FilterButtons, RequestDetails, CompletionForm, RequestsTable } from './component';

const StaffService = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
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

  // Fetch from backend
  const fetchRequests = async () => {
    try {
      const email = localStorage.getItem("email");
      const response = await axios.get(`https://utility-booking-backend.onrender.com/api/task/email/${email}`);
      setRequests(response.data.data);
    } catch (err) {
      setError("Failed to fetch data");
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
  };

  const handleViewDetails = (request) => {
    setViewingDetails(request);
    setSelectedRequest(null);
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
        photo: photoPreview // Optional: send base64
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
        ? requests.filter(req => req.status === "pending")
        : requests.filter(req => req.status === "completed");

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-5">{error}</p>;

  return (
    <div className="mt-3">
      <FilterButtons viewMode={viewMode} setViewMode={setViewMode} />
      <RequestsTable
        viewMode={viewMode}
        filteredRequests={filteredRequests}
        handleViewDetails={handleViewDetails}
        handleComplete={handleComplete}
      />
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
      <RequestDetails
        selectedRequest={selectedRequest}
        viewingDetails={viewingDetails}
        setViewingDetails={setViewingDetails}
      />
    </div>
  );
};

export default StaffService;

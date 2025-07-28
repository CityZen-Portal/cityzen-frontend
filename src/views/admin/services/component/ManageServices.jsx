import React, { useState, useEffect } from "react";
import axios from "axios";

const categories = {
  Utilities: ["Water Supply", "Electricity", "Gas", "Internet"],
  Sanitation: ["Waste Management", "Solid Waste Collection", "Public Health & Sanitation"],
  Infrastructure: ["Road Maintenance", "Street Lighting", "Building Permits"],
  Environment: ["Environmental Services", "Disaster Management", "Animal Control"],
  "Community Services": [
    "Public Parks & Recreation",
    "Fire and Emergency Services",
    "Community Welfare Services",
  ],
};

function ManageServices() {
  const [formData, setFormData] = useState({
    category: "",
    serviceName: "",
    description: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [services, setServices] = useState([]);
  const [editServiceId, setEditServiceId] = useState(null);
  const [error, setError] = useState("");

  const loadServices = async () => {
    try {
      const response = await axios.get("https://utility-booking-backend.onrender.com/api/service/all");
      setServices(response.data.data || []);
    } catch (err) {
      console.error("Error loading services:", err);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.description) {
      setError("Description is required.");
      return;
    }

    try {
      let uploadedImage = { imageName: "", imagePath: "" };

      if (formData.image instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append("name", formData.serviceName);
        imageFormData.append("imageFile", formData.image);

        const imgRes = await axios.post(
          "https://media-api-service-hzx2.onrender.com/api/images/upload",
          imageFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        uploadedImage = {
          imageName: imgRes.data.name,
          imagePath: imgRes.data.path,
        };
      }

      const servicePayload = {
        category: formData.category,
        serviceName: formData.serviceName,
        description: formData.description,
        imageName: uploadedImage.imageName,
        imagePath: uploadedImage.imagePath,
      };

      if (editServiceId) {
        await axios.put(
          `https://utility-booking-backend.onrender.com/api/service/update/${editServiceId}`,
          servicePayload
        );
      } else {
        await axios.post(
          "https://utility-booking-backend.onrender.com/api/service/add",
          servicePayload
        );
      }

      loadServices();
      resetForm();
    } catch (err) {
      console.error("Error saving service:", err);
      setError("An error occurred while saving the service.");
    }
  };

  const resetForm = () => {
    setFormData({ category: "", serviceName: "", description: "", image: null });
    setPreviewImage(null);
    setEditServiceId(null);
    setError("");
  };

  const handleEdit = (service) => {
    setFormData({
      category: service.category,
      serviceName: service.serviceName,
      description: service.description,
      image: null,
    });
    setEditServiceId(service.id);
    setPreviewImage(`${service.imagePath}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://utility-booking-backend.onrender.com/api/service/delete/${id}`);
      loadServices();
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  const selectedSubServices =
    Object.entries(categories).find(([key]) => key === formData.category)?.[1] || [];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">{editServiceId ? "Edit Service" : "Add New Service"}</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-6 rounded-lg shadow">
        {/* Category Dropdown */}
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value, serviceName: "" })}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Category</option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Service Name"
          value={formData.serviceName}
          onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFormData({ ...formData, image: file });
              const reader = new FileReader();
              reader.onloadend = () => setPreviewImage(reader.result);
              reader.readAsDataURL(file);
            }
          }}
          className="w-full"
        />

        {previewImage && (
          <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded" />
        )}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editServiceId ? "Update" : "Add"} Service
        </button>
      </form>

      {/* Display Services */}
      <h3 className="text-xl font-semibold mt-10">All Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {services.map((service) => (
          <div key={service.id} className="border p-4 rounded-lg shadow bg-white">
            <p>
              <strong>Category:</strong> {service.category}
            </p>
            <p>
              <strong>Name:</strong> {service.serviceName}
            </p>
            <p>
              <strong>Description:</strong> {service.description}
            </p>
            {service.imagePath && (
              <img
                src={`${service.imagePath}`}
                alt={service.imageName}
                className="w-full h-32 object-cover mt-2 rounded"
              />
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(service)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageServices;

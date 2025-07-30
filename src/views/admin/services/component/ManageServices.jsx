import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      const response = await axios.get(
        "https://utility-booking-backend.onrender.com/api/service/all"
      );
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

    if (!formData.category || !formData.serviceName) {
      setError("Category and Service Name are required.");
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
          imageName: imgRes.data.data.name,
          imagePath: imgRes.data.data.path,
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
        toast.success("Service updated successfully!");
      } else {
        await axios.post(
          "https://utility-booking-backend.onrender.com/api/service/add",
          servicePayload
        );
        toast.success("Service added successfully!");
      }

      loadServices();
      resetForm();
    } catch (err) {
      console.error("Error saving service:", err);
      setError("An error occurred while saving the service.");
      toast.error("Failed to save service. Please try again.");
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
    setPreviewImage(service.imagePath);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://utility-booking-backend.onrender.com/api/service/delete/${id}`
      );
      loadServices();
      toast.success("Service deleted successfully!");
    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error("Failed to delete service. Please try again.");
    }
  };

  const selectedSubServices =
    Object.entries(categories).find(([key]) => key === formData.category)?.[1] || [];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h2 className="text-3xl font-extrabold mb-8 text-white">
        {editServiceId ? "Edit Service" : "Add New Service"}
      </h2>

      {error && (
        <p className="mb-6 px-4 py-3 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto dark:bg-navy-800"
        noValidate
      >
        <div>
          <label className="block mb-2 font-semibold text-gray-700 ">
            Select Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value, serviceName: "" })
            }
            className="w-full border border-gray-300 dark:border-navy-700 rounded-md p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            required
          >
            <option value="" disabled>
              Choose Category
            </option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Service Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Service Name"
            value={formData.serviceName}
            onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
            className="w-full border border-gray-300 dark:border-navy-700 rounded-md p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Provide a detailed description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition resize-y min-h-[100px]"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700">Upload Image</label>
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
        </div>

        {previewImage && (
          <div className="mt-4 flex justify-center">
            <img
              src={previewImage}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-xl border border-gray-300 shadow-md transition-transform hover:scale-105"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={!formData.category || !formData.serviceName || !formData.description}
          className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition 
            ${
              formData.category && formData.serviceName && formData.description
                ? "bg-navy-700 hover:bg-navy-800 cursor-pointer"
                : "bg-navy-300 cursor-not-allowed"
            }
          `}
        >
          {editServiceId ? "Update Service" : "Add Service"}
        </button>
      </form>

      <h3 className="text-2xl font-extrabold mt-14 mb-8 text-white">
        All Services
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl dark:bg-navy-800 shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition"
          >
            <div>
              <p className="text-sm text-gray-500 mb-1">
                <span className="font-semibold">Category:</span> {service.category}
              </p>
              <h4 className="text-lg font-bold text-blue-700 mb-2">{service.serviceName}</h4>
              <p className="text-gray-700 mb-4 line-clamp-4">{service.description}</p>
            </div>

            {service.imagePath && (
              <img
                src={service.imagePath}
                alt={service.imageName}
                className="w-full h-40 object-cover rounded-lg shadow-sm mb-4"
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(service)}
                className="flex-1 bg-navy-700 text-white font-semibold py-2 rounded-lg hover:bg-navy-300 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="flex-1 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default ManageServices;
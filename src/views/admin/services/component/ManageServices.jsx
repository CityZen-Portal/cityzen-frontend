import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const categories = {
  "Utilities": [
    "Electricity Board",
    "Water Supply Department",
    "Gas Supply Department",
    "Telecom Services",
    "Public Works - Utility Maintenance Wing"
  ],
  "Sanitation": [
    "Municipal Sanitation Department",
    "Solid Waste Management Board",
    "Drainage & Sewerage Department",
    "Public Toilets Management",
    "Health Department (Vector Control Unit)"
  ],
  "Infrastructure": [
    "Public Works Department (PWD)",
    "Highways Department",
    "Urban Planning Authority",
    "Railway Infrastructure Division",
    "Metro Rail Corporation"
  ],
  "Environment": [
    "Forest Department",
    "Pollution Control Board",
    "Environmental Monitoring Wing",
    "Climate Change Cell",
    "Water Resource Department"
  ],
  "Community Services": [
    "Social Welfare Department",
    "Education Department",
    "Health Department",
    "Food & Civil Supplies Department",
    "Labour Welfare Department"
  ],
  "Health and Family Welfare": [
    "Primary Health Centers (PHC)",
    "Government Hospitals Department",
    "National Health Mission",
    "Immunization Department",
    "Medical Education & Research Directorate"
  ],
  "Education": [
    "School Education Department",
    "Higher Education Department",
    "Technical Education Department",
    "Adult Literacy Mission",
    "Teachers Recruitment Board"
  ],
  "Transport": [
    "Road Transport Department",
    "Railway Department",
    "Metro Rail Corporation",
    "Transport Commissioner’s Office",
    "State Transport Corporation"
  ],
  "Revenue and Land Records": [
    "Revenue Department",
    "Survey and Settlement Department",
    "Registration Department",
    "Land Reforms Department",
    "Disaster Management and Mitigation Department"
  ],
  "Law and Order": [
    "Police Department",
    "Home Department",
    "Judiciary",
    "Fire and Rescue Services",
    "Prison Department"
  ]
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

    const { category, serviceName, description } = formData;

    if (!category || !serviceName || !description) {
      setError("All fields marked * are required.");
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
        category,
        serviceName,
        description,
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
      await axios.delete(`https://utility-booking-backend.onrender.com/api/service/delete/${id}`);
      loadServices();
      toast.success("Service deleted successfully!");
    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error("Failed to delete service.");
    }
  };

  const selectedSubServices = formData.category ? categories[formData.category] || [] : [];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-white">
          {editServiceId ? "Edit Service" : "Add New Service"}
        </h2>

        {error && (
          <div className="mb-6 text-red-600 bg-red-100 border border-red-300 rounded p-3">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-navy-800 shadow-lg rounded-xl p-8 space-y-6"
        >
          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value, serviceName: "" })}
              className="w-full p-3 border border-gray-300 dark:border-navy-600 rounded-md dark:bg-navy-700 dark:text-white"
              required
            >
              <option value="">Select a Category</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Service Name <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.serviceName}
              onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-navy-600 rounded-md dark:bg-navy-700 dark:text-white"
              required
            >
              <option value="">Choose Service Name</option>
              {selectedSubServices.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-navy-600 rounded-md dark:bg-navy-700 dark:text-white min-h-[100px]"
              placeholder="Enter a brief description"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Upload Image</label>
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
            <div className="flex justify-center">
              <img
                src={previewImage}
                alt="Preview"
                className="w-40 h-40 object-cover rounded-xl border mt-4 shadow-md"
              />
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-white ${
              formData.category && formData.serviceName && formData.description
                ? "bg-navy-700 hover:bg-navy-800"
                : "bg-navy-300 cursor-not-allowed"
            }`}
            disabled={!formData.category || !formData.serviceName || !formData.description}
          >
            {editServiceId ? "Update Service" : "Add Service"}
          </button>
        </form>

        <h3 className="text-2xl font-bold mt-12 mb-6 text-gray-800 dark:text-white text-center">
          All Services
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              {service.imagePath && (
                <img
                  src={service.imagePath}
                  alt={service.imageName}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                <strong>Category:</strong> {service.category}
              </p>
              <h4 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">
                {service.serviceName}
              </h4>
              <p className="text-gray-700 dark:text-gray-200 line-clamp-4 mb-4">{service.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default ManageServices;

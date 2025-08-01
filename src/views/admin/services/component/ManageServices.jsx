import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const categories = {
  Utilities: [
    "Electricity Board",
    "Water Supply Department",
    "Gas Supply Department",
    "Telecom Services",
    "Public Works - Utility Maintenance Wing",
  ],
  Sanitation: [
    "Municipal Sanitation Department",
    "Solid Waste Management Board",
    "Drainage & Sewerage Department",
    "Public Toilets Management",
    "Health Department (Vector Control Unit)",
  ],
  Infrastructure: [
    "Public Works Department (PWD)",
    "Highways Department",
    "Urban Planning Authority",
    "Railway Infrastructure Division",
    "Metro Rail Corporation",
  ],
  Environment: [
    "Forest Department",
    "Pollution Control Board",
    "Environmental Monitoring Wing",
    "Climate Change Cell",
    "Water Resource Department",
  ],
  "Community Services": [
    "Social Welfare Department",
    "Education Department",
    "Health Department",
    "Food & Civil Supplies Department",
    "Labour Welfare Department",
  ],
  "Health and Family Welfare": [
    "Primary Health Centers (PHC)",
    "Government Hospitals Department",
    "National Health Mission",
    "Immunization Department",
    "Medical Education & Research Directorate",
  ],
  Education: [
    "School Education Department",
    "Higher Education Department",
    "Technical Education Department",
    "Adult Literacy Mission",
    "Teachers Recruitment Board",
  ],
  Transport: [
    "Road Transport Department",
    "Railway Department",
    "Metro Rail Corporation",
    "Transport Commissioner’s Office",
    "State Transport Corporation",
  ],
  "Revenue and Land Records": [
    "Revenue Department",
    "Survey and Settlement Department",
    "Registration Department",
    "Land Reforms Department",
    "Disaster Management and Mitigation Department",
  ],
  "Law and Order": [
    "Police Department",
    "Home Department",
    "Judiciary",
    "Fire and Rescue Services",
    "Prison Department",
  ],
};

function ManageServices() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const [serviceToDelete, setServiceToDelete] = useState(null);


  const [formData, setFormData] = useState({
    category: "",
    otherCategory: "",
    serviceName: "",
    otherServiceName: "",
    description: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [editServiceId, setEditServiceId] = useState(null);
  const [error, setError] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 6;

  // Fetch services from backend
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

  useEffect(() => {
    if (selectedFilterCategory === "All") {
      setFilteredServices(services);
    } else {
      setFilteredServices(
        services.filter((s) =>
          selectedFilterCategory === "Other"
            ? s.category && !(s.category in categories)
            : s.category === selectedFilterCategory
        )
      );
    }
    setCurrentPage(1);
  }, [services, selectedFilterCategory]);
 const validateForm = (formData) => {
  let isValid = true;

  if (!formData.image) {
    toast.error("Please upload an image.");
    isValid = false;
  }

  if (!formData.category) {
    toast.error("Please select a category.");
    isValid = false;
  }

  if (formData.category === "Other" && !formData.otherCategory.trim()) {
    toast.error("Please enter a custom category.");
    isValid = false;
  }

  if (!formData.serviceName) {
    toast.error("Please select a service name.");
    isValid = false;
  }

  if (formData.serviceName === "Other" && !formData.otherServiceName.trim()) {
    toast.error("Please enter a custom service name.");
    isValid = false;
  }

  if (!formData.description.trim()) {
    toast.error("Please enter a description.");
    isValid = false;
  }

  return isValid;
};

  // Handles submit with all validation & field handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
const isValid = validateForm(formData);
  if (!isValid) return;
 
    let category, serviceName;
    if (formData.category === "Other") {
      category = formData.otherCategory.trim();
      if (!category) {
        setError("Please enter a category name.");
        toast.error("Please enter a category name.");
        return;
      }
    } else {
      category = formData.category;
      if (!category) {
        setError("Please select a category.");
        toast.error("Please select a category.");
        return;
      }
    }
    if (formData.serviceName === "Other") {
      serviceName = formData.otherServiceName.trim();
      if (!serviceName) {
        setError("Please enter a service name.");
        toast.error("Please enter a service name.");
        return;
      }
    } else {
      serviceName = formData.serviceName;
      if (!serviceName) {
        setError("Please select a service name.");
        toast.error("Please select a service name.");
        return;
      }
    }

    if (!formData.description.trim()) {
      setError("Description is required.");
      toast.error("Description is required.");
      return;
    }

    try {
      let uploadedImage = { imageName: "", imagePath: "" };

      if (formData.image instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append("name", serviceName);
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

      await loadServices();
      resetForm();
    } catch (err) {
      console.error("Error saving service:", err);
      toast.error("Failed to save service. Please try again.");
    }
  };

  // Resets all form fields and clears file input
  const resetForm = () => {
    setFormData({
      category: "",
      otherCategory: "",
      serviceName: "",
      otherServiceName: "",
      description: "",
      image: null,
    });
    setPreviewImage(null);
    setEditServiceId(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleEdit = (service) => {
    const isOtherCategory = !(service.category in categories);
    const isOtherServiceName =
      service.category in categories
        ? !categories[service.category].includes(service.serviceName)
        : true;

    setFormData({
      category: isOtherCategory ? "Other" : service.category,
      otherCategory: isOtherCategory ? service.category : "",
      serviceName: isOtherServiceName ? "Other" : service.serviceName,
      otherServiceName: isOtherServiceName ? service.serviceName : "",
      description: service.description,
      image: null,
    });
    setEditServiceId(service.id);
    setPreviewImage(service.imagePath || null);
    if (fileInputRef.current) fileInputRef.current.value = null;
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
      toast.error("Failed to delete service.");
    }
  };

  const selectedSubServices =
    formData.category && categories[formData.category]
      ? categories[formData.category]
      : [];

  // Pagination calculations
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirstService,
    indexOfLastService
  );
  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/admin/services")}
          className="mb-2 flex items-center gap-2 text-sm text-gray-800 dark:text-white"
        >
          <span>←</span> Back to Services
        </button>
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
  {/* CATEGORY */}
  <div>
    <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
      Category <span className="text-red-500">*</span>
    </label>
    <select
      value={formData.category}
      onChange={(e) => {
        setFormData({
          ...formData,
          category: e.target.value,
          otherCategory: "",
          serviceName: "",
          otherServiceName: "",
        });
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
      }}
      className="w-full p-3 border border-gray-300 dark:border-navy-600 rounded-md dark:bg-navy-700 dark:text-white"
      
    >
      <option value="">Select a Category</option>
      {Object.keys(categories).map((cat) => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
      <option value="Other">Other</option>
    </select>
    {formData.category === "Other" && (
      <input
        type="text"
        className="mt-2 w-full p-3 border border-gray-300 dark:border-navy-600 rounded-md dark:bg-navy-700 dark:text-white"
        placeholder="Enter category name"
        value={formData.otherCategory}
        onChange={(e) =>
          setFormData({ ...formData, otherCategory: e.target.value })
        }
      />
    )}
  </div>

  {/* SERVICE NAME */}
  <div>
    <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
      Service Name <span className="text-red-500">*</span>
    </label>
    <select
      value={formData.serviceName}
      onChange={(e) =>
        setFormData({
          ...formData,
          serviceName: e.target.value,
          otherServiceName: "",
        })
      }
      className="w-full p-3 border border-gray-300 dark:border-navy-600 rounded-md dark:bg-navy-700 dark:text-white"
      required
      disabled={
        !formData.category ||
        (formData.category === "Other" && !formData.otherCategory.trim())
      }
    >
      <option value="">Choose Service Name</option>
      {selectedSubServices.map((sub) => (
        <option key={sub} value={sub}>{sub}</option>
      ))}
      {formData.category && <option value="Other">Other</option>}
    </select>
    {formData.serviceName === "Other" && (
      <input
        type="text"
        className="mt-2 w-full p-3 border border-gray-300 dark:border-navy-600 rounded-md dark:bg-navy-700 dark:text-white"
        placeholder="Enter service name"
        value={formData.otherServiceName}
        onChange={(e) =>
          setFormData({ ...formData, otherServiceName: e.target.value })
        }
      />
    )}
  </div>

  {/* DESCRIPTION */}
  <div>
    <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
      Description <span className="text-red-500">*</span>
    </label>
    <textarea
      value={formData.description}
      onChange={(e) =>
        setFormData({ ...formData, description: e.target.value })
      }
      className="w-full p-3 border border-gray-300 dark:border-navy-600 rounded-md dark:bg-navy-700 dark:text-white min-h-[100px]"
      placeholder="Enter a brief description"
    />
  </div>

  {/* IMAGE UPLOAD */}
  <div>
    <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
      Upload Image <span className="text-red-500">*</span>
    </label>
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          setFormData({ ...formData, image: file });
          const reader = new FileReader();
          reader.onloadend = () => setPreviewImage(reader.result);
          reader.readAsDataURL(file);
        } else {
          setFormData({ ...formData, image: null });
          setPreviewImage(null);
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
    className="w-full py-3 rounded-lg font-bold text-white bg-navy-700 hover:bg-navy-800"
  >
    {editServiceId ? "Update Service" : "Add Service"}
  </button>
</form>



        {/* Filters */}
        <div className="flex justify-between items-center mt-12 mb-4">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
            All Services
          </h3>
          <select
            value={selectedFilterCategory}
            onChange={(e) => setSelectedFilterCategory(e.target.value)}
            className="p-2 border rounded-md dark:bg-navy-700 dark:text-white"
          >
            <option value="All">All Categories</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentServices.map((service) => (
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
              <p className="text-gray-700 dark:text-gray-200 line-clamp-4 mb-4">
                {service.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                >
                  Edit
                </button>
<button
  onClick={() => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  }}
  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
>
  Delete
</button>

              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-full ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 dark:bg-navy-600 text-gray-800 dark:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
        {showDeleteModal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-xl max-w-sm w-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Confirm Deletion</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Are you sure you want to delete <strong>{serviceToDelete?.serviceName}</strong>?
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowDeleteModal(false)}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            try {
              await axios.delete(
                `https://utility-booking-backend.onrender.com/api/service/delete/${serviceToDelete.id}`
              );
              await loadServices();
              toast.success("Service deleted successfully!");
            } catch (err) {
              console.error("Error deleting service:", err);
              toast.error("Failed to delete service.");
            } finally {
              setShowDeleteModal(false);
              setServiceToDelete(null);
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}

      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default ManageServices;

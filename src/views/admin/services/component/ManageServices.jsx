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
  ],
  "others":[
    
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
  const [validationErrors, setValidationErrors] = useState({});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    


    const { category, serviceName, description } = formData;

     const errors = validateForm();

     if (Object.keys(errors).length > 0) {
      
       setValidationErrors(errors);
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
  const finalCategory =
    formData.category === "others"
      ? formData.customCategory
      : formData.category;
  const validateForm = () => {
    const errors = {};

    if (
      !formData.category ||
      (formData.category === "others" && !formData.customCategory)
    ) {
      errors.category = "Category is required";
    }

    if (!formData.serviceName || formData.serviceName.trim() === "") {
      errors.serviceName = "Service Name is required";
    }

    if (!formData.description || formData.description.trim() === "") {
      errors.description = "Description is required";
    }

    if (!formData.image) {
      errors.image = "Image is required";
    }

    return errors;
  };
  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10 dark:bg-navy-900">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-800 dark:text-white">
          {editServiceId ? "Edit Service" : "Add New Service"}
        </h2>

        {error && (
          <div className="mb-6 rounded border border-red-300 bg-red-100 p-3 text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-xl bg-white p-8 shadow-lg dark:bg-navy-800"
        >
          <div>
            <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                  serviceName: "",
                })
              }
              className="w-full rounded-md border border-gray-300 p-3 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              required
            >
              <option value="">Select a Category</option>
              {Object.keys(categories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {formData.category === "others" && (
              <input
                type="text"
                placeholder="Enter custom category"
                value={formData.customCategory || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customCategory: e.target.value,
                    serviceName: "", // optional if needed
                  })
                }
                className="mt-2 w-full rounded-md border border-gray-300 p-3 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              />
            )}
            {validationErrors.customCategory && (
              <p className="mt-1 text-sm text-red-500">
                {validationErrors.customCategory}
              </p>
            )}
          </div>
          {/* <div>
            <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
              Service Name <span className="text-red-500">*</span>
            </label>
            
            <select
              value={formData.serviceName}
              onChange={(e) =>
                setFormData({ ...formData, serviceName: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 p-3 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              required
            >
              <option value="">Choose Service Name</option>
              {selectedSubServices.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div> */}
          <div className="mt-4">
            <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
              Service Name <span className="text-red-500">*</span>
            </label>

            {formData.category === "others" ? (
              <input
                type="text"
                placeholder="Enter custom service name"
                value={formData.serviceName}
                onChange={(e) =>
                  setFormData({ ...formData, serviceName: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 p-3 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                required
              />
            ) : (
              <select
                value={formData.serviceName}
                onChange={(e) =>
                  setFormData({ ...formData, serviceName: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 p-3 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
                required
              >
                <option value="">Choose Service Name</option>
                {selectedSubServices.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            )}
          </div>
          {validationErrors.serviceName && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors.serviceName}
            </p>
          )}
          <div>
            <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[100px] w-full rounded-md border border-gray-300 p-3 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              placeholder="Enter a brief description"
              required
            />
          </div>
          {validationErrors.description && (
            <p className="mt-1 text-sm text-red-500">
              {validationErrors.description}
            </p>
          )}
          <div>
            <label className="mb-2 block font-semibold text-gray-700 dark:text-gray-300">
              Upload Image
            </label>
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
                className="mt-4 h-40 w-40 rounded-xl border object-cover shadow-md"
              />
            </div>
          )}
          <button
            type="submit"
            className="text-white w-full flex-1 rounded-lg rounded-md bg-blue-600 py-2 py-3 font-bold hover:bg-blue-700"
          >
            {editServiceId ? "Update Service" : "Add Service"}
          </button>
        </form>

        <h3 className="mb-6 mt-12 text-center text-2xl font-bold text-gray-800 dark:text-white">
          All Services
        </h3>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl bg-white p-6 shadow-md transition hover:shadow-xl dark:bg-navy-800"
            >
              {service.imagePath && (
                <img
                  src={service.imagePath}
                  alt={service.imageName}
                  className="mb-4 h-40 w-full rounded-md object-cover"
                />
              )}
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                <strong>Category:</strong> {service.category}
              </p>
              <h4 className="mb-2 text-lg font-semibold text-blue-700 dark:text-blue-400">
                {service.serviceName}
              </h4>
              <p className="mb-4 line-clamp-4 text-gray-700 dark:text-gray-200">
                {service.description}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="flex-1 rounded-md bg-red-600 py-2 text-white hover:bg-red-700"
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

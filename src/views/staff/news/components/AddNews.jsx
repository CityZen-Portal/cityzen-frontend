import React, { useState, useEffect } from 'react';
import Card from 'components/card';
import { useNavigate, useParams } from 'react-router-dom';
import { MdAdd, MdSave, MdCancel } from 'react-icons/md';
import { newsData } from '../variables/data';

const AddNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newsItems, setNewsItems] = useState(newsData);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    category: '',
    othercategory:"",
    priority: '',
    isBreaking: false,
    images: []
  });

  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    if (id) {
      const item = newsItems.find((n) => n.id === parseInt(id));
      if (item) {
        setFormData({
          title: item.title,
          content: item.content,
          location: item.location || '',
          category: item.category || '',
          priority: item.priority || '',
          isBreaking: item.isBreaking,
          images: item.images || []
        });
        setIsEditing(true);
        setCurrentId(item.id);
      } else {
        navigate('../news');
      }
    } else {
      setFormData({
        title: '',
        content: '',
        location: '',
        category: '',
        priority: '',
        isBreaking: false,
        images: []
      });
      setIsEditing(false);
      setCurrentId(null);
    }
  }, [id, newsItems, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.content.trim()) errors.content = 'Content is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.priority) errors.priority = 'Priority is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddNews = () => {
    if (!validateForm()) return;
    const newItem = {
      id: newsItems.length > 0 ? Math.max(...newsItems.map(item => item.id)) + 1 : 1,
      title: formData.title,
      content: formData.content,
      createdAt: new Date().toISOString(),
      location: formData.location,
      category: formData.category,
      priority: formData.priority,
      isBreaking: formData.isBreaking,
      images: formData.images
    };
    setNewsItems([newItem, ...newsItems]);
    navigate('/staff/news');
  };

  const handleUpdateNews = () => {
    if (!validateForm() || currentId === null) return;
    const updatedItems = newsItems.map(item =>
      item.id === currentId
        ? { ...item, ...formData }
        : item
    );
    setNewsItems(updatedItems);
    navigate('/staff/news');
  };

  const handleCancel = () => {
    navigate('/staff/news');
  };

  return (
    <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
      <Card extra="w-full max-w-3xl p-6 sm:p-8 shadow-xl rounded-2xl bg-white dark:bg-navy-700">
        <button
          onClick={() => navigate("/staff/news")}
          className="mb-4 flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
        >
          ← Back
        </button>

        <div className="mb-6">
          <h2 className="mb-1 text-2xl font-bold text-navy-700 dark:text-white">
            {isEditing ? "Edit News Post" : "Create News Post"}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Share important updates with the community
          </p>
        </div>

        <div className="mb-4">
          <label
            className={`mb-1 block text-sm font-medium ${
              formErrors.title
                ? "text-red-500"
                : "text-navy-700 dark:text-white"
            }`}
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a catchy title"
            className={`w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:text-white ${
              formErrors.title
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {formErrors.title && (
            <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className={`mb-1 block text-sm font-medium ${
              formErrors.content
                ? "text-red-500"
                : "text-navy-700 dark:text-white"
            }`}
          >
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Share the details of your news..."
            className={`h-28 w-full resize-none rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:text-white ${
              formErrors.content
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {formErrors.content && (
            <p className="mt-1 text-xs text-red-500">{formErrors.content}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className={`mb-1 block text-sm font-medium ${
              formErrors.location
                ? "text-red-500"
                : "text-navy-700 dark:text-white"
            }`}
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter location (e.g., Gandhi Nagar, Ward 12)"
            className={`w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:text-white ${
              formErrors.location
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {formErrors.location && (
            <p className="mt-1 text-xs text-red-500">{formErrors.location}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className={`mb-1 block text-sm font-medium ${
              formErrors.category
                ? "text-red-500"
                : "text-navy-700 dark:text-white"
            }`}
          >
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`w-full rounded-xl border px-4 py-2 text-sm dark:bg-navy-700 dark:text-white ${
              formErrors.category
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <option value="">Select Category</option>
            <option value="GOVERNMENT_ANNOUNCEMENT">
              Government Announcement
            </option>
            <option value="INFRASTRUCTURE">Infrastructure & Maintenance</option>
            <option value="HEALTH">Health & Safety</option>
            <option value="ELECTION">Election & Participation</option>
            <option value="ENVIRONMENT">Environment & Cleanliness</option>
            <option value="CULTURE">Cultural & Community Events</option>
            <option value="PUBLIC_SERVICE">Public Service Info</option>
            <option value="EMERGENCY">Emergency Alert</option>
            <option value="JOBS">Jobs & Appointments</option>
            <option value="PUBLIC_NOTICE">Public Notice / Lost & Found</option>
            <option value="OTHERS">Others</option>
          </select>
          {formData.category === "OTHERS" && (
            <input
              type="text"
              name="otherCategory"
              value={formData.othercategory}
              onChange={handleInputChange}
              placeholder="Enter custom category"
              className="mt-3 w-full rounded-xl border px-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 dark:bg-navy-700 dark:text-white"
            />
          )}
          {formErrors.category && (
            <p className="mt-1 text-xs text-red-500">{formErrors.category}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className={`mb-1 block text-sm font-medium ${
              formErrors.priority
                ? "text-red-500"
                : "text-navy-700 dark:text-white"
            }`}
          >
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className={`w-full rounded-xl border px-4 py-2 text-sm dark:bg-navy-700 dark:text-white ${
              formErrors.priority
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            <option value="">Select Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
          {formErrors.priority && (
            <p className="mt-1 text-xs text-red-500">{formErrors.priority}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-navy-700 dark:text-white">
            Upload Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:bg-navy-700 dark:text-white"
          />
          {formData.images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {formData.images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${index}`}
                    className="h-32 w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1 top-1 rounded-full bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="flex items-center space-x-2 text-sm text-navy-700 dark:text-white">
            <input
              type="checkbox"
              name="isBreaking"
              checked={formData.isBreaking}
              onChange={handleCheckboxChange}
              className="h-4 w-4"
            />
            <span>Breaking News</span>
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleUpdateNews}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white transition-all hover:bg-blue-700"
              >
                <MdSave />
                Update
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-xl border border-red-500 px-5 py-2 text-red-500 transition-all hover:bg-red-100"
              >
                <MdCancel />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAddNews}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 text-white transition-all hover:bg-green-700"
            >
              <MdAdd />
              Post News
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AddNews;

import React, { useState, useEffect } from 'react';
import Card from 'components/card';
import { useNavigate, useParams } from 'react-router-dom';
import { MdAdd, MdSave, MdCancel } from 'react-icons/md';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    category: '',
    othercategory: '',
    author_id: '4',
    isBreaking: false,
    image: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      axios.get(`https://city-news-alert-backend-new.onrender.com/api/news/${id}`)
        .then(res => {
          const item = res.data.data;
          setFormData({
            title: item.title,
            content: item.content,
            location: item.location || '',
            category: item.category || '',
            othercategory: item.category_name || '',
            breaking: item.breaking || false,
            image: null,
          });
          setIsEditing(true);
        })
        .catch(() => navigate('/staff/news'));
    }
  }, [id, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.content.trim()) errors.content = 'Content is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.category) errors.category = 'Category is required';
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
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const uploadImage = async () => {
    if (!formData.image) return { imageName: '', imagePath: '' };

    const imageForm = new FormData();
    imageForm.append('name', formData.title);
    imageForm.append('imageFile', formData.image);

    const res = await axios.post('https://media-api-service-hzx2.onrender.com/api/images/upload', imageForm, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      imageName: formData.title,
      imagePath: res.data.data.path,
    };
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const { imageName, imagePath } = await uploadImage();

      const payload = {
        title: formData.title,
        content: formData.content,
        location: formData.location,
        breaking: formData.breaking,
        author_id: '4',
        ...(formData.category === 'OTHERS'
          ? {
              category_name: formData.othercategory,
              imageName,
              imagePath,
            }
          : {
              category: formData.category,
              imageName,
              imagePath,
            }),
      };

      if (isEditing) {
        await axios.put(`https://city-news-alert-backend-new.onrender.com/api/news/update/${id}`, payload);
        toast.success('News updated successfully!');
      } else {
        await axios.post('https://city-news-alert-backend-new.onrender.com/api/news/add', payload);
        toast.success('News posted successfully!');
      }

      setTimeout(() => {
        navigate('/staff/news');
      }, 2000);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/staff/news');
  };

  return (
    <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
      <Card extra="w-full max-w-3xl p-6 sm:p-8 shadow-xl rounded-2xl bg-white dark:bg-navy-700">
        <button
          onClick={() => navigate('/staff/news')}
          className="mb-4 flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
        >
          ← Back
        </button>

        <div className="mb-6">
          <h2 className="mb-1 text-2xl font-bold text-navy-700 dark:text-white">
            {isEditing ? 'Edit News Post' : 'Create News Post'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Share important updates with the community
          </p>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full rounded-xl border px-4 py-2 text-sm dark:bg-navy-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="h-28 w-full rounded-xl border px-4 py-2 text-sm dark:bg-navy-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full rounded-xl border px-4 py-2 text-sm dark:bg-navy-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full rounded-xl border px-4 py-2 text-sm dark:bg-navy-700 dark:text-white"
          >
            <option value="">Select Category</option>
            <option value="GOVERNMENT_ANNOUNCEMENT">Government Announcement</option>
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

          {formData.category === 'OTHERS' && (
            <input
              type="text"
              name="othercategory"
              value={formData.othercategory}
              onChange={handleInputChange}
              placeholder="Enter custom category"
              className="mt-2 w-full rounded-xl border px-4 py-2 text-sm dark:bg-navy-700 dark:text-white"
            />
          )}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-xl border px-4 py-2 text-sm dark:bg-navy-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-2 text-sm">
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
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                <MdSave /> Update
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-xl border border-red-500 px-5 py-2 text-red-500 hover:bg-red-100"
              >
                <MdCancel /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 text-white hover:bg-green-700"
            >
              <MdAdd /> Post News
            </button>
          )}
        </div>
      </Card>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AddNews;

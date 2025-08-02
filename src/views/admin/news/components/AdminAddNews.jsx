import React, { useState, useEffect } from 'react';
import Card from 'components/card';
import { useNavigate, useParams } from 'react-router-dom';
import { MdAdd, MdSave, MdCancel, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyTextEditor from '../../../../components/textEditor/MyTextEditor'

const AddNews = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const authorId = localStorage.getItem('id') || '';

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    location: '',
    category: '',
    othercategory: '',
    authorId: authorId,
    isBreaking: false,
    image: null,
  });

  const [existingImagePath, setExistingImagePath] = useState(''); 
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isInEditMode, setIsInEditMode] = useState(id === 'new');
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      axios.get(`https://city-news-alert-backend-new.onrender.com/api/news/${id}`)
        .then(res => {
          const item = res.data.data;
          setFormData({
            title: item.title,
            content: item.content,
            location: item.location || '',
            category: item.category || '',
            othercategory: item.category_name || '',
            authorId: authorId,
            isBreaking: item.breaking || false,
            image: null,
          });
          setExistingImagePath(item.imagePath || ''); 
          setIsEditing(true);
          setIsInEditMode(false);
          setShowImage(false);
        })
        .catch(() => {
          toast.error('Failed to load news post.');
          navigate('/admin/news');
        });
    } else {
      setIsInEditMode(true);
    }
  }, [id, navigate, authorId]);

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.content.trim()) {
      errors.content = 'Content is required';
      isValid = false;
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
      isValid = false;
    }

    if (!formData.category) {
      errors.category = 'Category is required';
      isValid = false;
    }

    if (formData.category === 'OTHERS' && !formData.othercategory.trim()) {
      errors.othercategory = 'Custom category is required';
      isValid = false;
    }

    if (!isEditing && !formData.image) {
      errors.image = 'Image is required';
      isValid = false;
    }

    setFormErrors(errors);
    Object.values(errors).forEach((msg) => toast.error(msg));
    return isValid;
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

  const handleEditorChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
    setFormErrors((prev) => ({ ...prev, content: '' }));
  };

  const uploadImage = async () => {
    if (!formData.image) return { imageName: '', imagePath: existingImagePath || '' };

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
        breaking: formData.isBreaking,
        authorId: authorId,
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
        navigate('/admin/news');
      }, 2000);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      setIsInEditMode(false);
      axios.get(`https://city-news-alert-backend-new.onrender.com/api/news/${id}`)
        .then(res => {
          const item = res.data.data;
          setFormData({
            title: item.title,
            content: item.content,
            location: item.location || '',
            category: item.category || '',
            othercategory: item.category_name || '',
            authorId: authorId,
            isBreaking: item.breaking || false,
            image: null,
          });
          setExistingImagePath(item.imagePath || '');
          setFormErrors({});
          setShowImage(false);
        })
        .catch(() => {
          toast.error('Failed to reload news post.');
          navigate('/admin/news');
        });
    } else {
      navigate('/admin/news');
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
      <Card extra="w-full max-w-3xl p-6 sm:p-8 shadow-xl rounded-2xl bg-white dark:bg-navy-700">
        <button
          onClick={() => navigate('/admin/news')}
          className="mb-4 flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
        >
          ← Back
        </button>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="mb-1 text-2xl font-bold text-navy-700 dark:text-white">
              {isEditing ? 'Edit News Post' : 'Create News Post'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share important updates with the community
            </p>
          </div>
          {isEditing && !isInEditMode && (
            <button
              onClick={() => setIsInEditMode(true)}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Edit
            </button>
          )}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Title</label>
          {isInEditMode ? (
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-xl border px-4 py-2 text-sm dark:bg-navy-700 dark:text-white"
            />
          ) : (
            <p className="py-2 text-gray-700 dark:text-gray-300">{formData.title}</p>
          )}
          {formErrors.title && isInEditMode && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
        </div>

        <div className="mb-4 pb-5">
          <label className="text-sm font-medium">Content</label>
          {isInEditMode ? (
            <div className='pb-4'>
            <MyTextEditor value={formData.content} onChange={handleEditorChange} />
            </div>
          ) : (
            <div
              className="prose max-w-full dark:prose-dark"
              dangerouslySetInnerHTML={{ __html: formData.content }}
            />
          )}
          {formErrors.content && isInEditMode && <p className="text-red-500 text-xs mt-1">{formErrors.content}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Location</label>
          {isInEditMode ? (
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full rounded-xl border px-4 py-2 text-sm dark:bg-navy-700 dark:text-white"
            />
          ) : (
            <p className="py-2 text-gray-700 dark:text-gray-300">{formData.location}</p>
          )}
          {formErrors.location && isInEditMode && <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Category</label>
          {isInEditMode ? (
            <>
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
              {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
              {formErrors.othercategory && <p className="text-red-500 text-xs mt-1">{formErrors.othercategory}</p>}
            </>
          ) : (
            <p className="py-2 text-gray-700 dark:text-gray-300">
              {formData.category === 'OTHERS' ? formData.othercategory : formData.category}
            </p>
          )}
        </div>

        {!isInEditMode && existingImagePath && (
          <div className="mb-4 flex items-center space-x-2">
            <label className="text-sm font-medium">Image</label>
            <button
              type="button"
              onClick={() => setShowImage(!showImage)}
              className="rounded bg-gray-200 p-1 text-gray-600 hover:bg-gray-300 dark:bg-navy-600 dark:text-gray-300 dark:hover:bg-navy-500"
              aria-label={showImage ? 'Hide Image' : 'Show Image'}
            >
              {showImage ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
            </button>
          </div>
        )}

        {!isInEditMode && showImage && existingImagePath && (
          <div className="mb-6">
            <img src={existingImagePath} alt="News" className="max-w-full rounded-lg shadow-md" />
          </div>
        )}

        {isInEditMode && (
          <div className="mb-4">
            <label className="text-sm font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-xl border px-4 py-2 text-sm dark:bg-navy-700 dark:text-white"
            />
            {formErrors.image && <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>}
          </div>
        )}

        <div className="mb-4">
          {isInEditMode ? (
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
          ) : (
            formData.isBreaking && (
              <p className="text-sm font-medium text-red-600">Breaking News</p>
            )
          )}
        </div>

        <div className="mt-4 flex justify-end gap-3">
          {isInEditMode &&(
            <>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
              >
                <MdSave /> {isEditing ? 'Update' : 'Post News'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-xl border border-red-500 px-5 py-2 text-red-500 hover:bg-red-100"
              >
                <MdCancel /> Cancel
              </button>
             
            </>
          )}
        </div>
      </Card>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AddNews;

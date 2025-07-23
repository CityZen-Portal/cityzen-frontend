import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PencilSquareIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/solid';
import Water from "../../../../assets/img/service/water.jpeg";
import Electricity from "../../../../assets/img/service/electrical.jpeg";

const ManageServices = () => {
  const navigate = useNavigate();

  const serviceCategories = {
    'Utilities': ['Water Supply', 'Electricity', 'Gas', 'Internet'],
    'Sanitation': ['Waste Management', 'Solid Waste Collection', 'Public Health & Sanitation'],
    'Infrastructure': ['Road Maintenance', 'Street Lighting', 'Building Permits'],
    'Environment': ['Environmental Services', 'Disaster Management', 'Animal Control'],
    'Community Services': ['Public Parks & Recreation', 'Fire and Emergency Services', 'Community Welfare Services']
  };

  const getDefaultImage = (serviceName) => {
    switch (serviceName) {
      case 'Water Supply':
        return Water;
      case 'Electricity':
        return Electricity;
      default:
        return '';
    }
  };

  const [services, setServices] = useState([]);
  const [addServices, setAddServices] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    category: 'Utilities',
    serviceName: 'Water Supply',
    description: '',
    image: getDefaultImage('Water Supply')
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const storedServices = [
      { id: 1, category: 'Utilities', serviceName: 'Water Supply', description: 'Monthly water service', image: Water },
      { id: 2, category: 'Utilities', serviceName: 'Electricity', description: '24x7 power supply', image: Electricity }
    ];
    setServices(storedServices);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const isDuplicate = () => {
    return services.some(service =>
      service.category === formData.category &&
      service.serviceName === formData.serviceName &&
      service.id !== editServiceId
    );
  };

  const resetForm = () => {
    setFormData({ category: 'Utilities', serviceName: 'Water Supply', description: '', image: getDefaultImage('Water Supply') });
    setEditServiceId(null);
    setAddServices(false);
    setError('');
  };

  const openAddForm = () => {
    setAddServices(true);
    setEditServiceId(null);
    setFormData({
      category: 'Utilities',
      serviceName: 'Water Supply',
      description: '',
      image: getDefaultImage('Water Supply')
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description) return setError('Description is required.');
    if (!formData.image) formData.image = getDefaultImage(formData.serviceName);
    if (isDuplicate()) return setError('This service already exists.');

    if (editServiceId !== null) {
      setServices(prev =>
        prev.map(service =>
          service.id === editServiceId ? { ...service, ...formData } : service
        )
      );
    } else {
      setServices(prev => [...prev, { id: Date.now(), ...formData }]);
    }

    resetForm();
  };

  const handleDelete = (id) => setServices(prev => prev.filter(service => service.id !== id));

  const handleEdit = (service) => {
    const category = Object.keys(serviceCategories).find(cat => serviceCategories[cat].includes(service.serviceName));
    setFormData({ category, serviceName: service.serviceName, description: service.description, image: service.image });
    setEditServiceId(service.id);
    setAddServices(true);
    setError('');
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="bg-white dark:bg-navy-800 p-6 rounded-xl border border-gray-300 dark:border-navy-600 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/admin/services')}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-300 transition-colors flex items-center gap-1 mb-2"
            >
              <span>←</span> Back
            </button>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Services</h2>
          </div>
          <button
            onClick={() => addServices ? resetForm() : openAddForm()}
            className={`px-6 py-2 rounded-lg transition-colors shadow-sm ${
              addServices ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            {editServiceId !== null ? 'Edit Service' : 'Add Service'}
          </button>
        </div>
      </div>

      {addServices && (
        <div className="bg-white dark:bg-navy-800 p-6 rounded-xl border border-gray-300 dark:border-navy-600 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 font-medium">{error}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Service Category</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={(e) => {
                  const category = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    category,
                    serviceName: serviceCategories[category][0],
                    image: getDefaultImage(serviceCategories[category][0])
                  }));
                }}
                className="w-full border border-gray-300 dark:border-navy-600 dark:bg-navy-700 dark:text-white p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {Object.keys(serviceCategories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Service Name</label>
              <select
                name="serviceName"
                required
                value={formData.serviceName}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    serviceName: name,
                    image: getDefaultImage(name)
                  }));
                }}
                className="w-full border border-gray-300 dark:border-navy-600 dark:bg-navy-700 dark:text-white p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {serviceCategories[formData.category]?.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Description</label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full border border-gray-300 dark:border-navy-600 dark:bg-navy-700 dark:text-white p-2 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Service Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData(prev => ({ ...prev, image: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full border border-gray-300 dark:border-navy-600 dark:bg-navy-700 dark:text-white p-2 rounded-lg"
              />
            </div>

            {formData.image && (
              <div className="mt-2">
                <img src={formData.image} alt="Preview" className="h-20 rounded-md object-cover" />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 dark:border-navy-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                {editServiceId !== null ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-navy-800 p-6 rounded-xl border border-gray-300 dark:border-navy-600 shadow-sm">
        <h3 className="text-xl font-semibold mb-6 text-purple-700 dark:text-purple-400">Existing Services</h3>
        {services.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300 text-center">No services added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service.id} className="bg-gradient-to-br from-white to-purple-50 dark:from-navy-700 dark:to-navy-800 border border-gray-200 dark:border-navy-600 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{service.serviceName}</h4>
                    <p className="text-sm text-purple-600 font-medium mt-1">{service.category}</p>
                  </div>
                  <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600 text-sm font-bold">
                    {service.serviceName.charAt(0)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-3">{service.description}</p>
                <div className="flex justify-end items-center gap-2 mt-4">
                  {service.image && (
                    <button onClick={() => setPreviewImage(service.image)} className="text-purple-600 hover:text-purple-800 dark:hover:text-purple-400">
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => handleEdit(service)} className="text-yellow-500 hover:text-yellow-600">
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:text-red-800">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-800 rounded-xl p-4 shadow-lg max-w-2xl w-full relative">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-lg"
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-h-[70vh] w-full object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;

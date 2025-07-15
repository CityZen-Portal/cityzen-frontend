import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageServices = () => {
  const navigate = useNavigate();
  const [addServices, setAddServices] = useState(false);
  const [deleteServices, setDeleteServices] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceType: 'Water',
    description: ''
  });

  const serviceTypes = ['Water', 'Electricity', 'Gas', 'Internet', 'Waste Management'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Service Data:', formData);
    setAddServices(false);
    setFormData({ serviceName: '', serviceType: 'Water', description: '' });
  };

  return (
    <div className="space-y-6 dark:bg-navy-700">
      <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm ">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={() => navigate('/admin/services')} className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1 mb-2">
              <span>←</span> Back
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Manage Services</h2>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                setAddServices(!addServices);
                setDeleteServices(false);
              }} 
              className={`px-6 py-2 rounded-lg shadow-sm transition-colors ${addServices ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
            >
              Add Services
            </button>
            <button 
              onClick={() => {
                setDeleteServices(!deleteServices);
                setAddServices(false);
              }}
              className={`px-6 py-2 rounded-lg shadow-sm transition-colors ${deleteServices ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
            >
              Delete Services
            </button>
          </div>
        </div>
      </div>

      {addServices && (
        <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">
                Service Name
              </label>
              <input
                id="serviceName"
                name="serviceName"
                type="text"
                required
                value={formData.serviceName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter service name"
              />
            </div>

            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                id="serviceType"
                name="serviceType"
                required
                value={formData.serviceType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter service description"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setAddServices(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Add Service
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteServices && (
        <div className="bg-white p-6 rounded-xl border border-gray-300 shadow-sm">
          <div className="space-y-4">
            {/* Sample service items - replace with your actual service data */}
            {['Water Supply', 'Electricity', 'Internet Service'].map((service) => (
              <div key={service} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-800">{service}</h3>
                  <p className="text-sm text-gray-500">Type: Utility Service</p>
                </div>
                <button
                  className="px-3 py-1 text-red-500 border border-red-500 rounded hover:bg-red-50 transition-colors"
                  onClick={() => console.log(`Delete ${service}`)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;

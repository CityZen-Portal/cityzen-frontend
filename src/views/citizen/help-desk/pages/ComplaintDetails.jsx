import React, { useState } from 'react';
import { FaMapMarkerAlt, FaExclamationCircle, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ComplaintDetails = () => {
  const navigate = useNavigate()
  
  const [showImageModal, setShowImageModal] = useState(false);

  const complaintData = {
    id: '0001',
    issue: 'Water Leakage',
    department: 'Water Resource',
    dateLogged: '19/04/2025',
    status: 'pending',
    complaintant: 'John Richard',
    location: 'Anna Nagar, Chennai',
    address: '123 Main Street, Anna Nagar',
    wardNumber: '45',
    pincode: '600040',
    complaintType: 'Infrastructure',
    Issue: 'Water Pipeline Burst',
    description: 'The main water pipeline has burst near the junction of Anna Nagar main road. Water is flowing continuously causing inconvenience to residents and potential damage to nearby properties.',
    imageUrl: null,
    statusHistory: [
      { status: 'Submitted', date: '19/04/2025 10:00 AM', note: 'Complaint received' },
      { status: 'Pending', date: '19/04/2025 10:15 AM', note: 'Assigned to Water Resource team' },
    ]
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-300 dark:text-yellow-900';
      case 'inprogress': return 'bg-blue-100 text-blue-800 dark:bg-blue-300 dark:text-blue-900';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-300 dark:text-green-900';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-300 dark:text-gray-900';
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'Pending';
      case 'inprogress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <FaExclamationCircle className="text-3xl text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Complaint #{complaintData.id}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Manage your complaint details</p>
            </div>
          </div>
          <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(complaintData.status)}`}>
            {getStatusText(complaintData.status)}
          </span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-navy-800 rounded-xl shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location Details */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-blue-600" /> Location Details
                  </h2>
                  {['complaintant', 'location', 'address', 'wardNumber', 'pincode'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <p className="mt-1 text-gray-900 dark:text-white">{complaintData[field]}</p>
                    </div>
                  ))}
                </div>

                {/* Complaint Details */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <FaExclamationCircle className="mr-2 text-blue-600" /> Complaint Title & Details
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Complaint Type</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{complaintData.complaintType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Issue</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{complaintData.Issue}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{complaintData.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
                    <div className="mt-1">
                      {complaintData.imageUrl ? (
                        <img
                          src={complaintData.imageUrl}
                          alt="Complaint"
                          className="max-w-xs rounded-md cursor-pointer hover:opacity-80"
                          onClick={() => setShowImageModal(true)}
                        />
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No image uploaded</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-navy-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <FaHistory className="mr-2 text-blue-600" /> Status History
              </h2>
              <div className="space-y-4">
                {complaintData.statusHistory.map((entry, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-blue-600 rounded-full mt-1.5"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.status}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{entry.date}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{entry.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-navy-800 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h2>
              {['department', 'dateLogged'].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-white">{complaintData[field]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => {
              navigate(`/citizen/help-desk/complaint/log`)
              window.scrollTo(0,0)
            }}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors dark:bg-white dark:text-navy-900 dark:hover:bg-gray-200"
          >
            Back to Complaint Log
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && complaintData.imageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-navy-800 rounded-xl p-4 max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Image Preview</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <img
              src={complaintData.imageUrl}
              alt="Complaint"
              className="w-full rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetails;

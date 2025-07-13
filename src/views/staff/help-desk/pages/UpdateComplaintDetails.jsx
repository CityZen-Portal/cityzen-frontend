import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaExclamationCircle } from 'react-icons/fa';

const UpdateComplaintDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Fallback complaint object
  const defaultComplaint = {
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
    ],
    resolution: '',
    notes: '',
  };

  const complaint = state?.complaint || defaultComplaint;
  const [formData, setFormData] = useState({
    status: complaint.status || '',
    resolution: complaint.resolution || '',
    notes: complaint.notes || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.resolution.trim()) {
      alert('Please enter a resolution.');
      return;
    }
    navigate('/staff/complaints', { state: { updatedComplaint: { ...complaint, ...formData } } });
  };

  const statusOptions = [
    'pending',
    'under-review',
    'assigned',
    'in-progress',
    'on-hold',
    'resolved',
    'closed',
    'rejected',
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-300 dark:text-yellow-900';
      case 'under-review': return 'bg-blue-100 text-blue-800 dark:bg-blue-300 dark:text-blue-900';
      case 'assigned': return 'bg-purple-100 text-purple-800 dark:bg-purple-300 dark:text-purple-900';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-300 dark:text-indigo-900';
      case 'on-hold': return 'bg-orange-100 text-orange-800 dark:bg-orange-300 dark:text-orange-900';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-300 dark:text-green-900';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-300 dark:text-gray-900';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-300 dark:text-red-900';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-300 dark:text-gray-900';
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'Pending';
      case 'under-review': return 'Under Review';
      case 'assigned': return 'Assigned';
      case 'in-progress': return 'In Progress';
      case 'on-hold': return 'On Hold';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <FaExclamationCircle className="text-3xl text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Complaint #{id || complaint.id}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Update your complaint details</p>
            </div>
          </div>
          <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(formData.status)}`}>
            {getStatusText(formData.status)}
          </span>
        </div>

        <div className="lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-navy-800 rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" /> Location Details
                </h2>
                {['complaintant', 'location', 'address', 'wardNumber', 'pincode', 'dateLogged'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-white">{complaint[field] || ''}</p>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaExclamationCircle className="mr-2 text-blue-600" /> Complaint Title & Details
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Complaint Type</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{complaint.issue || complaint.complaintType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Issue</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{complaint.issue || complaint.Issue}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{complaint.notes || complaint.description || 'No description available'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image</label>
                  <p className="mt-1 text-gray-500 dark:text-gray-400 italic">No image uploaded</p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <form className="flex flex-col h-full" onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-1 text-gray-800 dark:text-gray-100">Update Complaint</h2>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white text-gray-800 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">-- Select status --</option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {getStatusText(status)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Resolution</label>
                      <textarea
                        name="resolution"
                        value={formData.resolution}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white text-gray-800 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Enter resolution details..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Notes</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white text-gray-800 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Enter additional notes..."
                      />
                    </div>
                  </div>
                  <div className="mt-auto pt-4 text-center">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-2 rounded-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateComplaintDetails;
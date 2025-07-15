import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaExclamationCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateComplaintDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

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
    description: 'The main water pipeline has burst near the junction...',
    assignedStaff: 'Kane Schnider',
    imageUrl: null,
    statusHistory: [],
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

    if (!formData.status) {
      toast.error('Please select a status.', { position: 'top-right', autoClose: 1500, theme: 'colored' });
      return;
    }

    if (!formData.resolution.trim()) {
      toast.error('Please enter a resolution.', { position: 'top-right', autoClose: 1500, theme: 'colored' });
      return;
    }

    toast.success('Changes saved successfully!', {
      position: 'top-right',
      autoClose: 1500,
      theme: 'colored',
      onClose: () =>
        navigate('/staff/complaints', {
          state: {
            updatedComplaint: { ...complaint, ...formData },
          },
        }),
    });
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
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <FaExclamationCircle className="text-blue-600 text-2xl" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Complaint #{id || complaint.id}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Update your complaint details</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(formData.status)}`}>
            {getStatusText(formData.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white dark:bg-navy-800 rounded-xl p-6 shadow-sm">
          {/* Left Column: Location Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <FaMapMarkerAlt className="text-blue-600 mr-2" />
              Location Details
            </h2>
            {['complaintant', 'location', 'address', 'wardNumber', 'pincode', 'dateLogged'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <p className="text-sm text-gray-900 dark:text-white">{complaint[field]}</p>
              </div>
            ))}
          </div>

          {/* Middle Column: Complaint Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Complaint Info</h2>
            {[
              { label: 'Complaint Type', value: complaint.complaintType },
              { label: 'Issue', value: complaint.issue },
              { label: 'Description', value: complaint.description },
              { label: 'Assigned Staff', value: complaint.assignedStaff },
              { label: 'Image', value: 'No image uploaded' },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                <p className="text-sm text-gray-900 dark:text-white">{value}</p>
              </div>
            ))}
          </div>

          {/* Right Column: Update Form */}
          <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Update Complaint</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full mt-1 p-2 border dark:border-gray-700 rounded dark:bg-navy-700 dark:text-white"
              >
                <option value="" disabled>
                  -- Select status --
                </option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {getStatusText(s)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resolution</label>
              <textarea
                name="resolution"
                value={formData.resolution}
                onChange={handleChange}
                placeholder="Enter resolution"
                rows="4"
                className="w-full mt-1 p-2 border dark:border-gray-700 rounded dark:bg-navy-700 dark:text-white"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (optional)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter any notes"
                rows="4"
                className="w-full mt-1 p-2 border dark:border-gray-700 rounded dark:bg-navy-700 dark:text-white"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default UpdateComplaintDetails;

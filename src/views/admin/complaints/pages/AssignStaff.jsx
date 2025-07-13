import React, { useState } from 'react';
import { FaMapMarkerAlt, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const staffList = [
  { id: 1, name: 'Alice Johnson' },
  { id: 2, name: 'Bob Smith' },
  { id: 3, name: 'Charlie Lee' },
];

const deptList = [
  { id: 1, name: 'Sanitation' },
  { id: 2, name: 'Water Supply' },
  { id: 3, name: 'Electricity' },
  { id: 4, name: 'Roads & Infrastructure' },
  { id: 5, name: 'Sewerage' },
  { id: 6, name: 'Urban Planning' },
  { id: 7, name: 'Parks & Horticulture' },
  { id: 8, name: 'Pollution Control' },
  { id: 9, name: 'Transport' },
  { id: 10, name: 'Public Health' },
];

const AssignStaff = () => {
  const navigate = useNavigate()
  
  const [showImageModal, setShowImageModal] = useState(false);

  const complaint = {
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
  }

  const [assignedStaff, setAssignedStaff] = useState(complaint?.assignedStaff || '');
  const [assignedDept, setAssignedDept] = useState(complaint?.departmentId || '');

  const handleAssign = (e) => {
    setAssignedStaff(e.target.value);
  };

  const handleAssignDept = (e) => {
    setAssignedDept(e.target.value);
    setAssignedStaff('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!assignedStaff) return alert('Please select a staff member to assign.');
    console.log(`Assigned staff ID: ${assignedStaff} for complaint ID: ${complaint?.id}`);
    alert('Staff assigned successfully!');
    navigate('/admin/complaints/')
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <FaExclamationCircle className="text-2xl sm:text-3xl text-blue-600 flex-shrink-0" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Complaint #{complaint.id}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Manage your complaint details</p>
            </div>
          </div>
          <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)} self-start sm:self-auto`}>
            {getStatusText(complaint.status)}
          </span>
        </div>

        {/* Main Content */}
        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white dark:bg-navy-800 rounded-xl shadow-sm p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Location Details */}
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-600 flex-shrink-0" /> Location Details
                </h2>
                {['complaintant', 'location', 'address', 'wardNumber', 'pincode', 'dateLogged'].map((field) => (
                  <div key={field} className="break-words">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize mb-1">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <p className="text-gray-900 dark:text-white text-sm sm:text-base">{complaint[field]}</p>
                  </div>
                ))}
              </div>

              {/* Complaint Details */}
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <FaExclamationCircle className="mr-2 text-blue-600 flex-shrink-0" /> Complaint Title & Details
                </h2>
                <div className="break-words">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Complaint Type</label>
                  <p className="text-gray-900 dark:text-white text-sm sm:text-base">{complaint.complaintType}</p>
                </div>
                <div className="break-words">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue</label>
                  <p className="text-gray-900 dark:text-white text-sm sm:text-base">{complaint.Issue}</p>
                </div>
                <div className="break-words">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <p className="text-gray-900 dark:text-white text-sm sm:text-base">{complaint.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image</label>
                  <div className="mt-1">
                    {complaint.imageUrl ? (
                      <img
                        src={complaint.imageUrl}
                        alt="Complaint"
                        className="max-w-full sm:max-w-xs rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setShowImageModal(true)}
                      />
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic text-sm">No image uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Assign Staff */}
              <div>
                <form 
                  className="flex flex-col h-full"
                  onSubmit={handleSubmit}>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-gray-100">Assignment</h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Department</label>
                      <select
                        value={assignedDept}
                        onChange={handleAssignDept}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 text-sm sm:text-base"
                        required
                      >
                        <option value="" disabled>-- Select department --</option>
                        {deptList.map((dept) => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>

                    {assignedDept && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign</label>
                        <select
                          value={assignedStaff}
                          onChange={handleAssign}
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 text-sm sm:text-base"
                          required
                        >
                          <option value="" disabled>-- Select staff --</option>
                          {staffList.map((staff) => (
                            <option key={staff.id} value={staff.id}>{staff.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 lg:mt-auto pt-4 text-center">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-2 rounded-lg text-sm sm:text-base"
                    >
                      Assign Staff
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && complaint.imageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-navy-800 rounded-xl p-4 max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Image Preview</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-xl p-1"
              >
                ✕
              </button>
            </div>
            <img
              src={complaint.imageUrl}
              alt="Complaint"
              className="w-full rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignStaff;
import React, { useState, useEffect } from 'react';
import ComplaintTable from '../components/ComplaintTable';
import { MdTrackChanges, MdPendingActions, MdAssignment, MdCheckCircleOutline, MdListAlt } from 'react-icons/md';

const ComplaintLog = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const mockData = [
      { id: 'T001', citizen: 'John Doe', issue: 'Road Repair', department: 'Public Works', status: 'pending', dateLogged: '2025-07-08', location: 'Anna Nagar' },
      { id: 'T002', citizen: 'Jane Smith', issue: 'Waste Collection', department: 'Sanitation', status: 'in-progress', dateLogged: '2025-07-09', location: 'T. Nagar' },
      { id: 'T003', citizen: 'Robert Johnson', issue: 'Street Light Repair', department: 'Maintenance', status: 'resolved', dateLogged: '2025-07-07', location: 'Adyar' },
      { id: 'T004', citizen: 'Emily Davis', issue: 'Tree Trimming', department: 'Maintenance', status: 'pending', dateLogged: '2025-07-06', location: 'Mylapore' },
      { id: 'T005', citizen: 'Michael Brown', issue: 'Water Supply', department: 'Water Works', status: 'assigned', dateLogged: '2025-07-05', location: 'Velachery' },
      { id: 'T006', citizen: 'Sarah Wilson', issue: 'Drainage', department: 'Public Works', status: 'under-review', dateLogged: '2025-07-04', location: 'Guindy' },
      { id: 'T007', citizen: 'David Taylor', issue: 'Park Maintenance', department: 'Parks', status: 'on-hold', dateLogged: '2025-07-03', location: 'Nungambakkam' },
      { id: 'T008', citizen: 'Lisa Anderson', issue: 'Traffic Signal', department: 'Traffic', status: 'closed', dateLogged: '2025-07-02', location: 'Besant Nagar' },
      { id: 'T009', citizen: 'Tom Wilson', issue: 'Noise Complaint', department: 'Municipal', status: 'rejected', dateLogged: '2025-07-01', location: 'Mount Road' },
      { id: 'T010', citizen: 'Amy Johnson', issue: 'Building Permit', department: 'Planning', status: 'resolved', dateLogged: '2025-06-30', location: 'Kodambakkam' },
    ];
    setComplaints(mockData);
  }, []);

  const iconMap = {
    pending: MdPendingActions,
    'in-progress': MdAssignment,
    resolved: MdCheckCircleOutline,
    total: MdListAlt,
  };

  const metrics = [
    {
      key: 'pending',
      label: 'Pending',
      value: complaints.filter(c => c.status === 'pending').length,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      key: 'in-progress',
      label: 'In Progress',
      value: complaints.filter(c => c.status === 'in-progress').length,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      key: 'resolved',
      label: 'Resolved',
      value: complaints.filter(c => c.status === 'resolved').length,
      color: 'bg-green-100 text-green-800',
    },
    {
      key: 'total',
      label: 'Total',
      value: complaints.length,
      color: 'bg-gray-100 text-gray-800',
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-4 sm:mb-6 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MdTrackChanges className="text-3xl sm:text-4xl text-blue-600" />
            Tasks
          </h1>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map(({ key, label, value, color }, index) => {
          const Icon = iconMap[key];
          return (
            <div
              key={index}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg shadow-md ${color}`}
            >
              {Icon && <Icon className="text-2xl sm:text-3xl flex-shrink-0" />}
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium truncate">{label}</p>
                <p className="text-xl sm:text-2xl font-bold">{value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <ComplaintTable complaints={complaints} />
    </div>
  );
};

export default ComplaintLog;

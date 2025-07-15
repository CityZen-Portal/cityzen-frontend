import React, { useState } from 'react';
import ComplaintTable from '../components/ComplaintTable.jsx';

const ComplaintLog = () => {
  const [complaints] = useState([
    {
      id: '0001',
      issue: 'Water Leakage',
      department: 'Water Resource',
      dateLogged: '2025-04-19',
      status: 'pending'
    },
    {
      id: '0002',
      issue: 'Street Light Issue',
      department: 'Electricity',
      dateLogged: '2025-05-12',
      status: 'in-progress'
    },
    {
      id: '0003',
      issue: 'Garbage Collection',
      department: 'Sanitation',
      dateLogged: '2025-06-30',
      status: 'resolved'
    },
    {
      id: '0004',
      issue: 'Water Leakage',
      department: 'Water Resource',
      dateLogged: '2025-04-19',
      status: 'on-hold'
    },
    {
      id: '0005',
      issue: 'Street Light Issue',
      department: 'Electricity',
      dateLogged: '2025-04-20',
      status: 'in-progress'
    },
    {
      id: '0006',
      issue: 'Garbage Collection',
      department: 'Sanitation',
      dateLogged: '2025-04-21',
      status: 'resolved'
    },
    {
      id: '0007',
      issue: 'Water Leakage',
      department: 'Water Resource',
      dateLogged: '2025-01-23',
      status: 'pending'
    },
    {
      id: '0008',
      issue: 'Street Light Issue',
      department: 'Electricity',
      dateLogged: '2025-01-20',
      status: 'in-progress'
    },
    {
      id: '0009',
      issue: 'Garbage Collection',
      department: 'Sanitation',
      dateLogged: '2025-01-21',
      status: 'resolved'
    },
    {
      id: '0010',
      issue: 'Water Leakage',
      department: 'Water Resource',
      dateLogged: '2025-03-19',
      status: 'under-review'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl">
      <div>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center sm:text-left">Complaint Log</h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 text-center sm:text-left">View your submitted complaints and their status</p>
        </div>

        <div className="overflow-x-auto">
          <ComplaintTable complaints={complaints} />
        </div>
      </div>
    </div>
  );
};

export default ComplaintLog;
import React, { useState, useEffect } from 'react';
import ComplaintTable from '../components/ComplaintTable';
import { MdTrackChanges, MdPendingActions, MdAssignment, MdCheckCircleOutline, MdListAlt } from 'react-icons/md';
import loading_gif from '../../../../assets/img/loading/loading_gif.gif'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ComplaintLog = () => {
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const citizenId = localStorage.getItem("id")
  console.log(citizenId)

  const HELPDESK_API = process.env.REACT_APP_API_HELPDESK_URL;
  
  const [complaints, setComplaints] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect( () => {
    setLoading(true);
    axios.get(`${HELPDESK_API}/staff/complaints`,
      {
        headers:{
          token,
          email,
          id: citizenId
        }
      }
    )
      .then(res => {
          console.log('Response:', res.data.data);
          const data = res.data.data
          setComplaints(data);
        })
        .catch(err => {
          toast.error('Server Error!Unable to Fetch Data', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored'
          });
          console.error('Error:', err.response?.data || err.message);
        })
        .finally(() => {
          setLoading(false);
        });
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
      
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <img src={loading_gif} alt="Loading..." className="w-10 h-10" />
            </div>
          ) : (
            <ComplaintTable extra={"mt-8"} complaints={complaints} />
          )}
          <ToastContainer />
    </div>
  );
};

export default ComplaintLog;

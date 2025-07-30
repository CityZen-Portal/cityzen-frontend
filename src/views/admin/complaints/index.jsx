import React, { useEffect, useState } from 'react';
import ComplaintTable from './components/ComplaintTable.jsx';
import loading_gif from '../../../assets/img/loading/loading_gif.gif'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ComplaintManagement = () => {
  // const [complaints] = useState([
  //   {
  //     id: '0001',
  //     complainant: 'John Doe',
  //     issue: 'Water Leakage',
  //     department: 'Water Resource',
  //     location: 'Anna Nagar',
  //     dateLogged: '2025-04-19',
  //     status: 'pending'
  //   },
  //   {
  //     id: '0002',
  //     complainant: 'Albert Smith',
  //     issue: 'Street Light Issue',
  //     department: 'Electricity',
  //     location: 'T.Nagar',
  //     dateLogged: '2025-04-20',
  //     status: 'in-progress'
  //   },
  //   {
  //     id: '0003',
  //     complainant: 'Bench Markov',
  //     issue: 'Garbage Collection',
  //     department: 'Sanitation',
  //     location: 'Anna Nagar',
  //     dateLogged: '2025-04-21',
  //     status: 'resolved'
  //   },
  //   {
  //     id: '0004',
  //     complainant: 'Jane Smith',
  //     issue: 'Water Leakage',
  //     department: 'Water Resource',
  //     location: 'Anna Nagar',
  //     dateLogged: '2025-04-19',
  //     status: 'on-hold'
  //   },
  //   {
  //     id: '0005',
  //     complainant: 'Jane Smith',
  //     issue: 'Street Light Issue',
  //     department: 'Electricity',
  //     location: 'T.Nagar',
  //     dateLogged: '2025-04-20',
  //     status: 'in-progress'
  //   },
  //   {
  //     id: '0006',
  //     complainant: 'Jane Smith',
  //     issue: 'Garbage Collection',
  //     department: 'Sanitation',
  //     location: 'Anna Nagar',
  //     dateLogged: '2025-04-21',
  //     status: 'resolved'
  //   },
  //   {
  //     id: '0007',
  //     complainant: 'Jane Smith',
  //     issue: 'Water Leakage',
  //     department: 'Water Resource',
  //     location: 'Anna Nagar',
  //     dateLogged: '2025-01-23',
  //     status: 'pending'
  //   },
  //   {
  //     id: '0008',
  //     complainant: 'Jane Smith',
  //     issue: 'Street Light Issue',
  //     department: 'Electricity',
  //     location: 'T.Nagar',
  //     dateLogged: '2025-01-20',
  //     status: 'in-progress'
  //   },
  //   {
  //     id: '0009',
  //     complainant: 'Jane Smith',
  //     issue: 'Garbage Collection',
  //     department: 'Sanitation',
  //     location: 'Anna Nagar',
  //     dateLogged: '2025-01-21',
  //     status: 'resolved'
  //   },
  //   {
  //     id: '0010',
  //     complainant: 'Jane Smith',
  //     issue: 'Water Leakage',
  //     department: 'Water Resource',
  //     location: 'Anna Nagar',
  //     dateLogged: '2025-03-19',
  //     status: 'under-review'
  //   },
  //   {
  //     id: '00011',
  //     complainant: 'Jane Smith',
  //     issue: 'Street Light Issue',
  //     department: 'Electricity',
  //     location: 'T.Nagar',
  //     dateLogged: '2025-04-01',
  //     status: 'in-progress'
  //   },
  //   {
  //     id: '00012',
  //     complainant: 'Jane Smith',
  //     issue: 'Garbage Collection',
  //     department: 'Sanitation',
  //     location: 'Anna Nagar',
  //     dateLogged: '2025-04-24',
  //     status: 'assigned'
  //   },
  //   {
  //     id: '00013',
  //     complainant: 'Jane Smith',
  //     issue: 'Water Leakage',
  //     department: 'Water Resource',
  //     location: 'Anna Nagar',
  //     dateLogged: '2025-04-19',
  //     status: 'pending'
  //   },
  //   {
  //     id: '00014',
  //     complainant: 'Jane Smith',
  //     issue: 'Street Light Issue',
  //     department: 'Electricity',
  //     location: 'T.Nagar',
  //     dateLogged: '2025-04-20',
  //     status: 'on-hold'
  //   },
  //   {
  //     id: '00015',
  //     complainant: 'Jane Smith',
  //     issue: 'Garbage Collection',
  //     department: 'Sanitation',
  //     location: 'Anna Nagar',
  //     dateLogged: '2025-04-21',
  //     status: 'rejected'
  //   }
  // ]);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = 'http://localhost:10101/api/helpdesk';

  useEffect( () => {
    setLoading(true);
    axios.get(`${BASE_URL}/admin/complaints`)
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 rounded-xl">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Complaint Log</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <img src={loading_gif} alt="Loading..." className="w-10 h-10" />
        </div>
      ) : (
        <ComplaintTable complaints={complaints} />
      )}
      <ToastContainer />
    </div>
  );
};

export default ComplaintManagement;

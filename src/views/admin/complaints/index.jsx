import React, { useEffect, useState } from 'react';
import ComplaintTable from './components/ComplaintTable.jsx';
import loading_gif from '../../../assets/img/loading/loading_gif.gif'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ComplaintManagement = () => {
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const citizenId = localStorage.getItem("id")

  const HELPDESK_API = process.env.REACT_APP_API_HELPDESK_URL;
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect( () => {
    setLoading(true);
    axios.get(`${HELPDESK_API}/admin/complaints`,
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

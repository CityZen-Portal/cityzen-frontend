import React, { useEffect, useState } from 'react';
import ComplaintTable from '../components/ComplaintTable.jsx';
import loading_gif from '../../../../assets/img/loading/loading_gif.gif'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ComplaintLog = () => {
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const citizenId = localStorage.getItem("id")

  const HELPDESK_API = process.env.REACT_APP_API_HELPDESK_URL;
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect( () => {
    setLoading(true);
    axios.get(`${HELPDESK_API}/citizen/complaints`,
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
  }, [token, email, citizenId, HELPDESK_API]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl">
      <div>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center sm:text-left">Complaint Log</h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 text-center sm:text-left">View your submitted complaints and their status</p>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <img src={loading_gif} alt="Loading..." className="w-10 h-10" />
            </div>
          ) : (
            <ComplaintTable complaints={complaints} />
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ComplaintLog;
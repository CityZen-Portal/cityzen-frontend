import React, { useEffect, useState } from 'react';
import { MdError, MdLocationOn } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import TitleCard from '../components/TitleCard';
import DetailsList from '../components/DetailsList';
import StatusHistory from '../components/StatusHistory';
import StaffCard from '../components/StaffCard';
import ResponseCard from '../components/ResponseCard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import loading_gif from '../../../../assets/img/loading/loading_gif.gif';


const ComplaintDetails = () => {
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const citizenId = localStorage.getItem("id")

  const HELPDESK_API = process.env.REACT_APP_API_HELPDESK_URL;
  
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState({});

  useEffect(() => {
    setLoading(true);
  
    axios.get(`${HELPDESK_API}/citizen/complaints/${id}`,
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
          setComplaint(data)
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
  }, [id, complaint.id, token, email, citizenId])

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900';
      case 'under-review': return 'bg-amber-100 text-amber-800 dark:bg-amber-200 dark:text-amber-900';
      case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900';
      case 'in-progress': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-200 dark:text-indigo-900';
      case 'on-hold': return 'bg-gray-200 text-gray-700 dark:bg-gray-400 dark:text-gray-900';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'under-review': return 'Under Review';
      case 'assigned': return 'Assigned';
      case 'in-progress': return 'In Progress';
      case 'on-hold': return 'On Hold';
      case 'resolved': return 'Resolved';
      case 'rejected': return 'Rejected';
      default: return status ?status.charAt(0).toUpperCase() + status.slice(1) : "Pending";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 py-12 px-4 sm:px-6 lg:px-8">
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <img src={loading_gif} alt="Loading..." className="w-10 h-10" />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <TitleCard 
            title={`Complaint #${complaint.id}`}
            Icon={MdError}
            complaintStatus={complaint.status}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-navy-800 rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location Details */}
                  <DetailsList
                    key={1}
                    title={'Location Details'}
                    Icon={MdLocationOn}
                    complaintData={complaint}
                    fields={['citizenName', 'street', 'wardNumber', 'pincode', 'citizenEmail']}
                  />

                  {/* Complaint Details */}
                  <DetailsList
                    key={2}
                    title={'Complaint Details'}
                    Icon={MdError}
                    complaintData={complaint}
                    fields={['category','department', 'issue', 'issueDescription', 'attachment']}
                  />
                </div>
              </div>
                <ResponseCard 
                  extra={'mt-8'}
                  responses={complaint.responses}
                  />
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Staff */}
              <StaffCard 
                complaintData={complaint}
                fields={['staffName', 'department']}
                />

              {/* Status History */}
              <StatusHistory statusHistory={complaint.complaintHistory} />
            
            </div>
          </div>

          {/* Response & Resolutions */}
          {/* <ResponseCard 
            extra={'grid grid-cols-1 lg:grid-cols-3 mt-8'}
            responses={complaint.responses}
            /> */}

          {/* Back Button */}
          {/* <div className="mt-8">
            <button
              onClick={() => {
                navigate(`/citizen/help-desk/complaint/log`)
                window.scrollTo(0,0)
              }}
              className="bg-blue-600 text-white font-bold px-4 py-2 rounded-md hover:bg-blue-700 text-sm transition-colors duration-200 w-full sm:w-auto outline-none focus:ring-2 focus:ring-navy-500"
            >
              Back to Complaint Log
            </button>
          </div> */}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ComplaintDetails;

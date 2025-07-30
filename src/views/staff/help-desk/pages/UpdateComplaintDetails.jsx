import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdError, MdLocationOn, MdSync } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import loading_gif from '../../../../assets/img/loading/loading_gif.gif';

import TitleCard from 'views/citizen/help-desk/components/TitleCard';
import DetailsList from 'views/citizen/help-desk/components/DetailsList';
import ResponseCard from 'views/citizen/help-desk/components/ResponseCard';
import StatusHistory from 'views/citizen/help-desk/components/StatusHistory';

const UpdateComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState({});

  const complaintData = {
    id: '0001',
    issue: 'Water Leakage',
    department: 'Water Supply',
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
    staff: {staffName: "Davis Wanbros", department: "Water Supply", role: "Maintenance Technicians"},
    statusHistory: [
      { status: 'Submitted', date: '19/04/2025 10:00 AM', note: 'Complaint received' },
      { status: 'Pending', date: '19/04/2025 10:15 AM', note: 'Assigned to Water Resource team' },
      { status: 'Under Review', date: '20/04/2025 10:55 AM', note: 'Reviewing under Water Resource team' },
    ],
    responses: [
      { index:1, description: "Your request is viewed and being reviewed for processing a solution", date: "19/04/2025 10:30 AM" },
      { index:2, description: "Your request is review and is in progress", date: "20/04/2025 11:30 AM" }
    ]
  };

  
  const [response, setResponse] = useState("")
  const [resolution, setResolution] = useState("")
  const [status, setStatus] = useState("")

  
  const BASE_URL = 'http://localhost:10101/api/helpdesk';

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!response.trim()) {
      toast.error('Please enter a response.', { position: 'top-right', autoClose: 3000, theme: 'colored' });
      return;
    }
    const statusData = status.split(" ").map((s, i) => i === 0 ? s.toLowerCase() : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join("")

    const putData = {
      status: statusData,
      responseDetails: response,
      resolutionDetails: resolution,
      respondedBy: 51,
      respondedDate: "2025-07-29T05:11:58.279Z",
      attachment:"null"
    }

    axios.put(`${BASE_URL}/staff/complaints/${id}`, putData)
      .then(() => {
          toast.success("Response Submitted Successfully!", {
            position: "top-right",
            autoClose: 1000,
            theme: "colored",
            onClose: () => navigate("/staff/complaints"),
          });
          return;
        })
        .catch(err => {
          toast.error('Server Error! Unable to Submit Response', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored'
          });
          console.error('Error:', err.response?.data || err.message);
        })
        .finally(() => setLoading(false)); 
  };


  const statusOptions = [
    'pending',
    'under review',
    'assigned',
    'in progress',
    'on hold',
    'resolved',
    'closed',
    'rejected',
  ];

  useEffect(() => {
    setLoading(true);

    axios.get(`${BASE_URL}/staff/complaints/${id}`)
      .then(res => {
          console.log('Response:', res.data.data);
          const data = res.data.data
          setComplaint(data)
          setStatus(data.status?.toLowerCase())
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
  }, [id])

  

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900';
      case 'under review': return 'bg-amber-100 text-amber-800 dark:bg-amber-200 dark:text-amber-900';
      case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900';
      case 'in progress': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-200 dark:text-indigo-900';
      case 'on hold': return 'bg-gray-200 text-gray-700 dark:bg-gray-400 dark:text-gray-900';
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'under review': return 'Under Review';
      case 'assigned': return 'Assigned';
      case 'in progress': return 'In Progress';
      case 'on hold': return 'On Hold';
      case 'resolved': return 'Resolved';
      case 'rejected': return 'Rejected';
      default: return status ?status.charAt(0).toUpperCase() + status.slice(1) : "Pending";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
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
            complaintStatus={complaint.status?.toLowerCase()}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
      
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
            {/* Left Section */}
            <div className="lg:col-span-2 flex flex-col h-full">
              <div className="flex-grow space-y-6 sm:space-y-8 h-full">
                <div className="bg-white dark:bg-navy-800 rounded-xl shadow-sm p-4 sm:p-6 h-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 h-full">
                    {/* Location Details */}
                  <DetailsList
                    key={1}
                    title={'Location Details'}
                    Icon={MdLocationOn}
                    complaintData={complaintData}
                    fields={['complaintant', 'street', 'wardNumber', 'pincode', 'department']}
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
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col h-full">
              {/* Response & Resolution */}
              <div className="flex-grow bg-white dark:bg-navy-800 rounded-xl shadow-sm p-4 sm:p-6 h-full">
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                  <div className="space-y-4 sm:space-y-6 flex-grow">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <MdSync className="mr-2 text-blue-600 h-6 w-6" />
                      Update Complaint
                    </h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                      <select
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
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
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Response</label>
                      <textarea
                        name="response"
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Enter response"
                        rows="4"
                        className="w-full mt-1 p-2 border dark:border-gray-700 rounded dark:bg-navy-700 dark:text-white"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resolution (optional)</label>
                      <textarea
                        name="notes"
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder="Enter any notes"
                        rows="4"
                        className="w-full mt-1 p-2 border dark:border-gray-700 rounded dark:bg-navy-700 dark:text-white"
                      ></textarea>
                    </div>

                    <div className="text-center pt-10">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                      >
                        Update Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Response & Resolutions */}
          <ResponseCard 
            extra={'mt-8'}
            responses={complaint.responses}
            />

          <StatusHistory
              extra="mt-8"
              statusHistory={complaint.complaintHistory}
            />

          {/* Back Button */}
          <div className="mt-8">
            <button
              onClick={() => {
                navigate(`/staff/complaints/`)
                window.scrollTo(0,0)
              }}
              className="bg-blue-600 text-white font-bold px-4 py-2 rounded-md hover:bg-blue-700 text-sm transition-colors duration-200 w-full sm:w-auto outline-none focus:ring-2 focus:ring-navy-500"
            >
              Back to Complaint Log
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default UpdateComplaintDetails;

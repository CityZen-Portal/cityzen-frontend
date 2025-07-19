import React from 'react';
import { MdError, MdLocationOn } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import TitleCard from '../components/TitleCard';
import auth from '../../../../assets/img/auth/auth.png' // Dummy File URL
import DetailsList from '../components/DetailsList';
import StatusHistory from '../components/StatusHistory';
import StaffCard from '../components/StaffCard';
import ResponseCard from '../components/ResponseCard';

const ComplaintDetails = () => {
  const navigate = useNavigate()

  const complaintData = {
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
    fileUrl: auth,
    staff: {staffName: "Davis Wanbros", department: "Water Supply", role: "Maintenance Technicians"},
    statusHistory: [
      { status: 'Submitted', date: '19/04/2025 10:00 AM', note: 'Complaint received' },
      { status: 'Pending', date: '19/04/2025 10:15 AM', note: 'Assigned to Water Resource team' },
      { status: 'Under Review', date: '20/04/2025 10:55 AM', note: 'Reviewing under Water Resource team' },
    ],
    responses: [
      { index:1, description: "Your request is viewed and being reviewed for processing a solution", date: "19/04/2025 10:30 AM" },
      { index:2, description: "Your request is review and is in progress", date: "20/04/2025 11:30 AM" }
    ],
    resolution: "-",
  };

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
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <TitleCard 
          title={`Complaint #${complaintData.id}`}
          Icon={MdError}
          complaintStatus={complaintData.status}
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
                  complaintData={complaintData}
                  fields={['complaintant', 'location', 'address', 'wardNumber', 'pincode', 'department']}
                />

                {/* Complaint Details */}
                <DetailsList
                  key={2}
                  title={'Complaint Details'}
                  Icon={MdError}
                  complaintData={complaintData}
                  fields={['complaintType','department', 'Issue', 'description', 'attachment']}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Staff */}
            <StaffCard 
              complaintData={complaintData}
              fields={['staffName', 'department', 'role']}
              />

            {/* Status History */}
            <StatusHistory statusHistory={complaintData.statusHistory} />
          
          </div>
        </div>

        {/* Response & Resolutions */}
        <ResponseCard 
          extra={'grid grid-cols-1 lg:grid-cols-3 mt-8'}
          resolution={complaintData.resolution} 
          responses={complaintData.responses}
          />

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

    </div>
  );
};

export default ComplaintDetails;

import React, { useState } from 'react';
import { MdError, MdLocationOn } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DetailsList from 'views/citizen/help-desk/components/DetailsList';
import ResponseCard from 'views/citizen/help-desk/components/ResponseCard';
import StaffCard from 'views/citizen/help-desk/components/StaffCard';
import StatusHistory from 'views/citizen/help-desk/components/StatusHistory';
import TitleCard from 'views/citizen/help-desk/components/TitleCard';

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
  const navigate = useNavigate();

  const complaint = {
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
    ],
    resolution: "-",
    notes: '',
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

  const [assignedStaff, setAssignedStaff] = useState(complaint?.assignedStaff || '');
  const [assignedDepartment, setAssignedDepartment] = useState(complaint?.department || '');

  const handleAssign = (e) => setAssignedStaff(e.target.value);

  const handleAssignDept = (e) => {
    setAssignedDepartment(e.target.value);
    setAssignedStaff('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!assignedDepartment){
      toast.error('Please select a Department', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'colored',
      });
      return;
    }
    if (!assignedStaff) {
      toast.error('Please select a Staff Member', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'colored',
      });
      return;
    }

    // Show success toast and navigate after it closes
    toast.success('Staff assigned successfully!', {
      position: 'top-right',
      autoClose: 1000,
      theme: 'colored',
      onClose: () => navigate('/admin/complaints/')
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
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
                    complaintData={complaint}
                    fields={['complaintant', 'location', 'address', 'wardNumber', 'pincode', 'department']}
                  />

                  {/* Complaint Details */}
                  <DetailsList
                    key={2}
                    title={'Complaint Details'}
                    Icon={MdError}
                    complaintData={complaint}
                    fields={['complaintType','department', 'Issue', 'description', 'attachment']}
                  />

                </div>
              </div>
            </div>
          </div>
            
          {/* Right Sidebar */}
          <div className="flex flex-col h-full">
            {/* Response & Resolution */}
            <div className="flex-grow bg-white dark:bg-navy-800 rounded-xl shadow-sm p-4 sm:p-6 h-full">
              <form onSubmit={handleSubmit} className="h-full flex flex-col">
                <div className="space-y-4 sm:space-y-6 flex-grow">
                    <h2 className="text-lg font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-gray-100">Staff Assignment</h2>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Department</label>
                      <select
                        value={assignedDepartment}
                        onChange={handleAssignDept}
                        className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white text-gray-800 dark:bg-navy-700 dark:text-white"
                      >
                        <option value="" disabled>-- Select department --</option>
                        {deptList.map((dept) => (
                          <option key={dept.id} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                    </div>

                    {assignedDepartment && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Staff</label>
                        <select
                          value={assignedStaff}
                          onChange={handleAssign}
                          className="w-full px-4 py-2 rounded-md border dark:border-gray-700 bg-white text-gray-800 dark:bg-navy-700 dark:text-white"
                        >
                          <option value="" disabled>-- Select staff --</option>
                          {staffList.map((staff) => (
                            <option key={staff.id} value={staff.id}>{staff.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="text-center pt-10">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                    >
                      Assign Staff
                    </button>
                  </div>
                </form>
              </div>
          </div>
        </div>

        {/* Staff */}
        {/* <StaffCard 
          extra={"mt-8"}
          complaintData={complaint}
          fields={['staffName', 'department', 'role']}
          /> */}

        {/* Response & Resolutions */}
        <ResponseCard
              extra="mt-8"
              resolution={complaint.resolution}
              responses={complaint.responses}
            />

        <StatusHistory
            extra="mt-8"
            statusHistory={complaint.statusHistory}
          />

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => {
              navigate(`/admin/complaints/`)
              window.scrollTo(0,0)
            }}
            className="bg-blue-600 text-white font-bold px-4 py-2 rounded-md hover:bg-blue-700 text-sm transition-colors duration-200 w-full sm:w-auto outline-none focus:ring-2 focus:ring-navy-500"
          >
            Back to Complaint Log
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default AssignStaff;

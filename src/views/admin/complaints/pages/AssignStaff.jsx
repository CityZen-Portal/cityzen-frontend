import React, { useEffect, useState } from 'react';
import { MdError, MdLocationOn } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DetailsList from 'views/citizen/help-desk/components/DetailsList';
import ResponseCard from 'views/citizen/help-desk/components/ResponseCard';
import StatusHistory from 'views/citizen/help-desk/components/StatusHistory';
import TitleCard from 'views/citizen/help-desk/components/TitleCard';
import axios from 'axios';
import loading_gif from '../../../../assets/img/loading/loading_gif.gif';
import {
  getStatusText,
  getStatusColor
}
from '../../../citizen/help-desk/utils/helpers';


// const deptList = [
//   { id: 1, name: 'Sanitation' },
//   { id: 2, name: 'Water Supply' },
//   { id: 3, name: 'Electricity' },
//   { id: 4, name: 'Roads & Infrastructure' },
//   { id: 5, name: 'Seweage' },
//   { id: 6, name: 'Urban Planning' },
//   { id: 7, name: 'Parks & Horticulture' },
//   { id: 8, name: 'Pollution Control' },
//   { id: 9, name: 'Transport' },
//   { id: 10, name: 'Public Health' },
// ];

const AssignStaff = () => {
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const citizenId = localStorage.getItem("id")

  const HELPDESK_API = process.env.REACT_APP_API_HELPDESK_URL;
  const UTILITY_URL = process.env.REACT_APP_API_UTILITY_URL;
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState({});
  const [staff, setStaff] = useState([]);
  const [department, setDepartment] = useState([]);

  const [assignedStaff, setAssignedStaff] = useState(complaint?.assignedStaff || '');
  const [assignedDepartment, setAssignedDepartment] = useState(complaint?.department || '');

  const handleAssign = (e) => setAssignedStaff(e.target.value);

  const handleAssignDept = (e) => {
    setAssignedDepartment(e.target.value);
    setAssignedStaff('');
  };

  // Fetch Complaint Details
  useEffect(() => {
    setLoading(true);
  
    axios.get(`${HELPDESK_API}/admin/complaints/${id}`,
      {
        headers:{
          token,
          email,
          id: citizenId
        }
      }
    )
      .then(res => {
          console.log('Complaint:', res.data.data);
          const data = res.data.data
          setComplaint(data ? data : {})
          // setAssignedDepartment(data.assignedDepartment)
          // setAssignedStaff(data.assignedStaff)
        })
        .catch(err => {
          toast.error(err.response?.data?.message || 'Server Error!Unable to Fetch Complaint Data', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
            onClose: () => navigate("/admin/complaints/"),
          });
          console.error('Error:', err.response?.data || err.message);
          navigate("")
        })
        .finally(() => {
          setLoading(false);
        });
      

  }, [id, complaint.id, token, email, citizenId])

  // Fetch Department List
  useEffect( () => {
    setLoading(true)
    
    axios.get(`${UTILITY_URL}/api/service/all`)
    .then(res => {
        console.log('Department:', res.data.data);
        const data = res.data.data
        setDepartment(data ? data : [])
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Server Error!Unable to Fetch Department Data', {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored'
        });
        console.error('Error:', err.response?.data || err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [])

  // Fetch Staff List
  useEffect( () => {
    if(assignedDepartment){
      setLoading(true)
      
      axios.get(`${UTILITY_URL}/api/staff/department/${assignedDepartment}`)
      .then(res => {
          console.log('Staff:', res.data.data.data);
          const data = res.data.data.data
          setStaff(data ? data : [])
        })
        .catch(err => {
          toast.error(err.response?.data?.message || 'Server Error!Unable to Fetch Staff Data', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored'
          });
          console.error('Error:', err.response?.data || err.message);
        })
        .finally(() => {
          setLoading(false);
        });
      }
  }, [assignedDepartment])

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)

    if(!assignedDepartment){
      toast.error('Please select a Department', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'colored',
      });
      setLoading(false)
      return;
    }
    if (!assignedStaff) {
      toast.error('Please select a Staff Member', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'colored',
      });
      setLoading(false)
      return;
    }

    const putData = {
      staffId: assignedStaff,
      department: assignedDepartment
    }

    setLoading(true)

    axios.put(
      `${HELPDESK_API}/admin/complaints/${id}`,
      null,
      {
        headers: {
          token,
          email,
          id: citizenId,
        },
        params: putData,
      }
    )
      .then(() => {
          toast.success("Staff assigned successfully!!", {
            position: "top-right",
            autoClose: 1000,
            theme: "colored",
            onClose: () => navigate("/admin/complaints/"),
          });
          return;
        })
        .catch(err => {
          toast.error(err.response?.data?.message || 'Server Error! Unable to Assign Staff', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored'
          });
          console.error('Error:', err.response?.data || err.message);
        })
        .finally(() => setLoading(false));
  };

  return (
    <div 
      className="relative flex items-center justify-center min-h-screen py-6 sm:py-8 lg:py-10 px-4 sm:px-2 lg:px-8"
      style={{ overflow: loading ? 'hidden' : 'auto' }}
    >
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <img
            src={loading_gif}
            alt="Loading..."
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
        </div>
      )}
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
                        {department.map((dept) => (
                          <option key={dept.id} value={dept.serviceName}>{dept.serviceName}</option>
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
                          {staff.map((staff) => (
                            <option key={staff.emailAddress} value={staff.emailAddress}>{staff.fullName}</option>
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

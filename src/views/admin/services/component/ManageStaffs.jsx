import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/solid';
import axios from 'axios';

const initialNewStaffState = {
  name: '',
  department: '',
  contact: '',
  age: '',
  email: '',
  address: '',
  dateOfJoining: '',
  password: ''
};

function ManageStaffs() {
  const navigate = useNavigate();
  const [departments] = useState([
    'Electricity',
    'Water Supply',
    'Cleaning',
    'Gardening',
    'Security',
    'Maintenance'
  ]);

  const [staffs, setStaffs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newStaff, setNewStaff] = useState(initialNewStaffState);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("https://utility-booking-backend.onrender.com/api/staff/all");
        const staffData = response.data?.data.data;
        setStaffs(Array.isArray(staffData) ? staffData : []);
      } catch (err) {
        console.error("Failed to fetch staff data:", err);
        setStaffs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const handleOpen = (staff = null) => {
    if (staff) {
      setEditId(staff.id);
      setNewStaff(staff);
    } else {
      setEditId(null);
      setNewStaff(initialNewStaffState);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateStaff = () => {
    if (!newStaff.name || !newStaff.department || !newStaff.contact) {
      alert("Please fill in Name, Department, and Contact.");
      return;
    }

    if (editId) {
      setStaffs((prev) =>
        prev.map((s) => (s.id === editId ? { ...newStaff, id: editId } : s))
      );
    } else {
      const newId = staffs.length ? Math.max(...staffs.map(s => s.id || 0)) + 1 : 1;
      setStaffs((prev) => [...prev, { ...newStaff, id: newId }]);
    }

    handleClose();
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      setStaffs((prev) => prev.filter((s) => s.id !== id));
    }
  };
  const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
     today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
};


  return (
    <div className='mt-12 mb-8 flex flex-col gap-12 px-4 md:px-6'>
      <div className='dark:bg-navy-800 bg-white shadow-xl rounded-xl'>
        <div className='dark:bg-navy-700 bg-blue-600 p-6 rounded-t-xl flex flex-col md:flex-row justify-between md:items-center gap-4'>
          <div>
            <button onClick={() => navigate('/admin/services')} className="text-white hover:text-gray-200 transition-colors flex items-center gap-2 mb-2 text-sm">
              <span>←</span> Back to Services
            </button>
            <h2 className='text-white text-2xl font-bold'>Manage Staff Members</h2>
          </div>
          <button
            onClick={() => handleOpen()}
            className='flex items-center justify-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-lg shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105'
          >
            <PlusIcon className='w-5 h-5' />
            <span className="font-semibold">Add New Staff</span>
          </button>
        </div>

        <div className='p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-navy-900/50 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-navy-700 animate-pulse space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-full bg-gray-300 dark:bg-navy-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-navy-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-navy-700 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 dark:bg-navy-700 rounded"></div>
                  <div className="h-3 bg-gray-300 dark:bg-navy-700 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-300 dark:bg-navy-700 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : (
            Array.isArray(staffs) &&
            staffs.map((staff) => (
              <div key={staff.id} className="bg-gray-50 dark:bg-navy-900/50 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-navy-700 flex flex-col justify-between">
                <div>
                  <div className='flex justify-between items-start mb-4'>
                    <div className='flex items-center gap-4'>
                      <div className='w-14 h-14 bg-blue-100 dark:bg-navy-700 rounded-full flex items-center justify-center'>
                        <UserIcon className='w-8 h-8 text-blue-500 dark:text-blue-400' />
                      </div>
                      <div>
                        <h3 className='font-bold text-lg text-gray-800 dark:text-white'>{staff.fullName}</h3>
                        <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>{staff.department}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2.5">
                    <div className="flex items-center gap-3"><EnvelopeIcon className="h-5 w-5 text-gray-400" /><span>{staff.emailAddress}</span></div>
                    <div className="flex items-center gap-3"><PhoneIcon className="h-5 w-5 text-gray-400" /><span>{staff.contactNumber}</span></div>
                    <div className="flex items-center gap-3"><MapPinIcon className="h-5 w-5 text-gray-400" /><span>{staff.fullAddress}</span></div>
                    <div className="flex items-center gap-3"><CalendarIcon className="h-5 w-5 text-gray-400" /><span>Age: {calculateAge(staff.dob)}</span></div>
                  </div>
                </div>
                <div className="mt-5 pt-4 border-t border-gray-200 dark:border-navy-700 flex justify-end gap-3">
                  <button onClick={() => handleOpen(staff)} className='text-yellow-500 hover:text-yellow-600 transition-colors' aria-label="Edit Staff">
                    <PencilSquareIcon className='w-5 h-5' />
                  </button>
                  <button onClick={() => handleDeleteStaff(staff.id)} className='text-red-500 hover:text-red-600 transition-colors' aria-label="Delete Staff">
                    <TrashIcon className='w-5 h-5' />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {open && (
        <div className='fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-navy-800 w-full max-w-xl p-8 rounded-xl shadow-2xl m-4 border dark:border-navy-700'>
            <h2 className='text-2xl font-semibold text-center text-blue-600 dark:text-white mb-6'>
              {editId ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              <input name='name' placeholder='Full Name' value={newStaff.name} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none' />
              <select name='department' value={newStaff.department} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none'>
                <option value="" disabled>Select Department</option>
                {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
              </select>
              <input name='contact' placeholder='Contact Number' value={newStaff.contact} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none' />
              <input name='age' placeholder='Age' value={newStaff.age} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none' />
              <input name='email' placeholder='Email Address' value={newStaff.email} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none' />
              <input name='password' type='password' placeholder='Password' value={newStaff.password} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none' />
              <input name='address' placeholder='Full Address' value={newStaff.address} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full col-span-2 bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none' />
              <input type='date' name='dateOfJoining' value={newStaff.dateOfJoining} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full col-span-2 bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none' />
            </div>
            <div className='flex justify-end gap-4 mt-8'>
              <button onClick={handleClose} className='px-5 py-2.5 rounded-lg border text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-700 transition-colors'>Cancel</button>
              <button onClick={handleAddOrUpdateStaff} className='px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold'>
                {editId ? 'Update Staff' : 'Add Staff'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStaffs;

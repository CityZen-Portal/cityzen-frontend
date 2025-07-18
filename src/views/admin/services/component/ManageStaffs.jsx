import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon, PencilSquareIcon, EnvelopeIcon, PhoneIcon, UserIcon, MapPinIcon, CalendarIcon, BuildingOfficeIcon } from '@heroicons/react/24/solid';

// Initial state for the new staff form
const initialNewStaffState = {
  name: '',
  department: '', // Changed from 'role'
  contact: '',
  age: '',
  email: '',
  address: '',
  dateOfJoining: '',
  password: ''
};

function ManageStaffs() {
  const navigate = useNavigate();
  
  // In a real application, this list would likely be fetched from a database
  // or managed via a global state (Context API, Redux) so it can be updated from a "Manage Services" page.
  const [departments, setDepartments] = useState([
    'Electricity',
    'Water Supply',
    'Cleaning',
    'Gardening',
    'Security',
    'Maintenance'
  ]);

  const [staffs, setStaffs] = useState([
    {
      id: 1,
      name: 'Poovarasan',
      department: 'Cleaning', // Changed from 'role'
      contact: '+1234567890',
      age: '30',
      email: 'poovarasan05@gmail.com',
      address: '106/d, East Colony',
      dateOfJoining: '2025-01-01',
    },
    {
      id: 2,
      name: 'Jane Smith',
      department: 'Gardening', // Changed from 'role'
      contact: '+0987654321',
      age: '28',
      email: 'jane.smith@example.com',
      address: '456 Garden Ave',
      dateOfJoining: '2023-05-10',
    }
  ]);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newStaff, setNewStaff] = useState(initialNewStaffState);

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
      setStaffs((prev) => prev.map((s) => (s.id === editId ? { ...newStaff, id: editId } : s)));
    } else {
      const newId = staffs.length ? Math.max(...staffs.map(s => s.id)) + 1 : 1;
      setStaffs((prev) => [...prev, { ...newStaff, id: newId }]);
    }
    handleClose();
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      setStaffs((prev) => prev.filter((s) => s.id !== id));
    }
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
          {staffs.map((staff) => (
            <div key={staff.id} className="bg-gray-50 dark:bg-navy-900/50 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-navy-700 flex flex-col justify-between">
              <div>
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex items-center gap-4'>
                    <div className='w-14 h-14 bg-blue-100 dark:bg-navy-700 rounded-full flex items-center justify-center'>
                      <UserIcon className='w-8 h-8 text-blue-500 dark:text-blue-400' />
                    </div>
                    <div>
                      <h3 className='font-bold text-lg text-gray-800 dark:text-white'>{staff.name}</h3>
                      <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>{staff.department}</p>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2.5">
                  <div className="flex items-center gap-3"><EnvelopeIcon className="h-5 w-5 text-gray-400" /><span>{staff.email}</span></div>
                  <div className="flex items-center gap-3"><PhoneIcon className="h-5 w-5 text-gray-400" /><span>{staff.contact}</span></div>
                  <div className="flex items-center gap-3"><MapPinIcon className="h-5 w-5 text-gray-400" /><span>{staff.address}</span></div>
                  <div className="flex items-center gap-3"><CalendarIcon className="h-5 w-5 text-gray-400" /><span>Joined: {staff.dateOfJoining} (Age: {staff.age})</span></div>
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
          ))}
        </div>
      </div>

      {/* Modal with Backdrop Blur */}
      {open && (
        <div className='fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-navy-800 w-full max-w-xl p-8 rounded-xl shadow-2xl m-4 border dark:border-navy-700'>
            <h2 className='text-2xl font-semibold text-center text-blue-600 dark:text-white mb-6'>
              {editId ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
              <input name='name' placeholder='Full Name' value={newStaff.name} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none' />
              
              {/* Department Dropdown */}
              <select 
                name='department' 
                value={newStaff.department} 
                onChange={handleInputChange} 
                className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none'
              >
                <option value="" disabled>Select Department</option>
                {departments.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>

              <input name='contact' placeholder='Contact Number' value={newStaff.contact} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none' />
              <input name='age' placeholder='Age' value={newStaff.age} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none' />
              <input name='email' placeholder='Email Address' value={newStaff.email} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none' />
              <input name='password' type='password' placeholder='Password' value={newStaff.password} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none' />
              <input name='address' placeholder='Full Address' value={newStaff.address} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none col-span-2' />
              <input type='date' name='dateOfJoining' value={newStaff.dateOfJoining} onChange={handleInputChange} className='border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none col-span-2' />
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

function ManageStaffs() {
  const navigate = useNavigate();
  const [staffs, setStaffs] = useState([
    { id: 1, name: 'John Doe', role: 'Cleaner', contact: '+1234567890' },
    { id: 2, name: 'Jane Smith', role: 'Gardener', contact: '+0987654321' },
  ]);
  const [open, setOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', contact: '' });

  const handleOpen = () => setOpen(!open);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.role && newStaff.contact) {
      setStaffs((prev) => [
        ...prev,
        { id: prev.length + 1, ...newStaff },
      ]);
      setNewStaff({ name: '', role: '', contact: '' });
      handleOpen();
    }
  };

  const handleDeleteStaff = (id) => {
    setStaffs((prev) => prev.filter((staff) => staff.id !== id));
  };

  return (
    <div className='dark:bg-navy-800 mt-12 mb-8 flex flex-col gap-12'>
      <div className='dark:bg-navy-800 bg-white shadow-lg rounded-xl'>
        <div className='dark:bg-navy-500 bg-blue-600 p-6 rounded-t-xl'>
          <button onClick={() => navigate('/admin/services')} className="text-white hover:text-gray-200 transition-colors flex items-center gap-1 mb-2">
            <span>←</span> Back
          </button>
          <h2 className='text-white text-lg font-semibold'>Manage Staff Members</h2>
        </div>
        <div className='overflow-x-auto p-6'>
          <div className='flex justify-end mb-4'>
            <button
              onClick={handleOpen}
              className='bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700'
            >
              <PlusIcon className='w-4 h-4' />
              Add Staff
            </button>
          </div>
          <table className='min-w-full text-left border border-gray-200'>
            <thead>
              <tr className='bg-gray-100 text-xs uppercase text-gray-500'>
                <th className='dark:bg-navy-500 py-3 px-5'>Name</th>
                <th className='dark:bg-navy-500 py-3 px-5'>Role</th>
                <th className='dark:bg-navy-500 py-3 px-5'>Contact</th>
                <th className='dark:bg-navy-500 py-3 px-5'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffs.map(({ id, name, role, contact }) => (
                <tr key={id} className='border-t'>
                  <td className='py-3 px-5 text-sm font-medium text-gray-700'>{name}</td>
                  <td className='py-3 px-5 text-sm text-gray-700'>{role}</td>
                  <td className='py-3 px-5 text-sm text-gray-700'>{contact}</td>
                  <td className='py-3 px-5'>
                    <button
                      onClick={() => handleDeleteStaff(id)}
                      className='text-red-600 hover:text-red-800 flex items-center gap-1 text-sm'
                    >
                      <TrashIcon className='w-4 h-4' />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white w-full max-w-md p-6 rounded-lg shadow-lg'>
            <h3 className='text-lg font-semibold mb-4'>Add New Staff Member</h3>
            <div className='grid gap-4 mb-4'>
              <input
                type='text'
                name='name'
                placeholder='Name'
                value={newStaff.name}
                onChange={handleInputChange}
                className='border border-gray-300 rounded px-3 py-2 w-full'
              />
              <input
                type='text'
                name='role'
                placeholder='Role'
                value={newStaff.role}
                onChange={handleInputChange}
                className='border border-gray-300 rounded px-3 py-2 w-full'
              />
              <input
                type='text'
                name='contact'
                placeholder='Contact'
                value={newStaff.contact}
                onChange={handleInputChange}
                className='border border-gray-300 rounded px-3 py-2 w-full'
              />
            </div>
            <div className='flex justify-end gap-2'>
              <button
                onClick={handleOpen}
                className='px-4 py-2 text-gray-700 hover:text-red-600'
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
              >
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStaffs;

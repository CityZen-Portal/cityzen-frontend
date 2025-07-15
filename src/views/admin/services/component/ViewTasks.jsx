import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, MapPinIcon, ClockIcon, UserIcon } from '@heroicons/react/24/solid';

function ViewTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Garden Maintenance',
      staff: 'John Doe',
      date: '2024-01-20',
      time: '10:00',
      address: '123 Main St, City',
      status: 'Pending',
    },
  ]);

  const [open, setOpen] = useState(false);
  const [staffList] = useState([
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Williams',
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    staff: '',
    date: '',
    time: '',
    address: '',
    description: '',
  });

  const handleOpen = () => setOpen(!open);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStaffChange = (e) => {
    setNewTask((prev) => ({
      ...prev,
      staff: e.target.value,
    }));
  };

  const handleAddTask = () => {
    if (newTask.title && newTask.staff && newTask.date && newTask.time && newTask.address) {
      setTasks((prev) => [
        ...prev,
        { id: prev.length + 1, ...newTask, status: 'Pending' },
      ]);
      setNewTask({
        title: '',
        staff: '',
        date: '',
        time: '',
        address: '',
        description: '',
      });
      handleOpen();
    }
  };

  return (
    <div className=" mt-12 mb-8 flex flex-col gap-12 px-4">
      <div className="dark:bg-navy-800 bg-white shadow rounded-lg">
        <div className="bg-blue-600 p-4 rounded-t-lg">
          <button onClick={() => navigate('/admin/services')} className="text-white hover:text-gray-200 transition-colors flex items-center gap-1 mb-2">
            <span>←</span> Back
          </button>
          <h2 className="text-white text-lg font-semibold">Task Assignments</h2>
        </div>
        <div className="p-4 overflow-x-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleOpen}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4" />
              Assign New Task
            </button>
          </div>
          <table className="w-full min-w-[640px] table-auto border">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                {['Task', 'Assigned To', 'Date & Time', 'Address', 'Status'].map((el) => (
                  <th key={el} className="px-4 py-2 border-b font-semibold text-gray-700">
                    {el}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map(({ id, title, staff, date, time, address, status }) => (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{title}</td>
                  <td className="px-4 py-2 border-b flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-600" />
                    {staff}
                  </td>
                  <td className="px-4 py-2 border-b flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-gray-600" />
                    {date} at {time}
                  </td>
                  <td className="px-4 py-2 border-b flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-gray-600" />
                    {address}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      status === 'Completed' ? 'bg-green-100 text-green-700' :
                      status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Assign New Task</h3>
            <div className="grid gap-4">
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={newTask.title}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full"
              />
              <select
                name="staff"
                value={newTask.staff}
                onChange={handleStaffChange}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="">Select Staff</option>
                {staffList.map((staff) => (
                  <option key={staff} value={staff}>
                    {staff}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  value={newTask.date}
                  onChange={handleInputChange}
                  className="border px-3 py-2 rounded w-full"
                />
                <input
                  type="time"
                  name="time"
                  value={newTask.time}
                  onChange={handleInputChange}
                  className="border px-3 py-2 rounded w-full"
                />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={newTask.address}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full"
              />
              <textarea
                name="description"
                placeholder="Task Description"
                value={newTask.description}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleOpen}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewTasks;

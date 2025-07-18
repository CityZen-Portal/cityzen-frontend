import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, MapPinIcon, ClockIcon, UserIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';

const initialNewTaskState = {
  title: '',
  staff: '',
  date: '',
  time: '',
  address: '',
  description: '',
};

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
      description: 'Weekly maintenance for the front garden, including weeding and pruning.'
    },
    {
      id: 2,
      title: 'Lawn Mowing',
      staff: 'Jane Smith',
      date: '2024-01-22',
      time: '14:00',
      address: '456 Oak Ave, Town',
      status: 'Completed',
      description: 'Mow the entire front and back lawn.'
    },
    {
      id: 3,
      title: 'Hedge Trimming',
      staff: 'Mike Johnson',
      date: '2024-01-23',
      time: '09:00',
      address: '789 Pine Ln, Suburb',
      status: 'In Progress',
      description: 'Trim all hedges along the property line.'
    },
  ]);

  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null); // State to track the task being edited
  const [newTask, setNewTask] = useState(initialNewTaskState);
  const [staffList] = useState([
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Williams',
  ]);

  const handleOpen = (task = null) => {
    if (task) {
      // Editing an existing task
      setCurrentTask(task);
      setNewTask(task);
    } else {
      // Adding a new task
      setCurrentTask(null);
      setNewTask(initialNewTaskState);
    }
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    setCurrentTask(null);
    setNewTask(initialNewTaskState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveTask = () => {
    if (!newTask.title || !newTask.staff || !newTask.date || !newTask.time || !newTask.address) {
        alert("Please fill in all required fields.");
        return;
    }

    if (currentTask) {
   
      setTasks(tasks.map(task => (task.id === currentTask.id ? { ...newTask, id: currentTask.id } : task)));
    } else {

      const newId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
      setTasks([{ ...newTask, id: newId, status: 'Pending' }, ...tasks]);
    }
    handleClose();
  };
  
  const handleDeleteTask = (id) => {
    if(window.confirm("Are you sure you want to delete this task?")) {
        setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const getStatusChipClass = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Pending':
      default:
        return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 px-4 md:px-6">
      <div className="dark:bg-navy-800 bg-white shadow-xl rounded-xl">
        <div className="dark:bg-navy-700 bg-blue-600 p-6 rounded-t-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <button onClick={() => navigate('/admin/services')} className="text-white hover:text-gray-200 transition-colors flex items-center gap-2 mb-2 text-sm">
              <span>←</span> Back to Services
            </button>
            <h2 className="text-white text-2xl font-bold">Task Assignments</h2>
          </div>
          <button
            onClick={() => handleOpen()}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-lg shadow-md hover:bg-gray-100 transition-transform transform hover:scale-105"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="font-semibold">Assign New Task</span>
          </button>
        </div>
        
        <div className="p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-gray-50 dark:bg-navy-900/50 p-5 rounded-lg shadow-lg border border-gray-200 dark:border-navy-700 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">{task.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusChipClass(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 h-10">{task.description}</p>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <div className="flex items-center gap-3"><UserIcon className="h-5 w-5 text-gray-400" /><span>{task.staff}</span></div>
                  <div className="flex items-center gap-3"><ClockIcon className="h-5 w-5 text-gray-400" /><span>{task.date} at {task.time}</span></div>
                  <div className="flex items-center gap-3"><MapPinIcon className="h-5 w-5 text-gray-400" /><span>{task.address}</span></div>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-gray-200 dark:border-navy-700 flex justify-end gap-3">
                <button onClick={() => handleOpen(task)} className="text-yellow-500 hover:text-yellow-600 transition-colors" aria-label="Edit Task">
                  <PencilSquareIcon className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteTask(task.id)} className="text-red-500 hover:text-red-600 transition-colors" aria-label="Delete Task">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Modal for Add/Edit */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy-800 w-full max-w-lg rounded-xl shadow-2xl p-8 m-4 transform transition-all">
            <h3 className="text-2xl font-semibold mb-6 text-center text-blue-600 dark:text-white">
              {currentTask ? 'Edit Task' : 'Assign a New Task'}
            </h3>
            <div className="grid gap-5">
              <input type="text" name="title" placeholder="Task Title" value={newTask.title} onChange={handleInputChange} className="border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              <select name="staff" value={newTask.staff} onChange={handleInputChange} className="border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select Staff Member</option>
                {staffList.map((staff) => (<option key={staff} value={staff}>{staff}</option>))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" name="date" value={newTask.date} onChange={handleInputChange} className="border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="time" name="time" value={newTask.time} onChange={handleInputChange} className="border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <input type="text" name="address" placeholder="Full Address" value={newTask.address} onChange={handleInputChange} className="border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              <textarea name="description" placeholder="Task Description" value={newTask.description} onChange={handleInputChange} className="border px-4 py-2.5 rounded-lg w-full bg-gray-50 dark:bg-navy-700 dark:border-navy-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" rows={3} />
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={handleClose} className="px-5 py-2.5 rounded-lg border text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-700 transition-colors">Cancel</button>
              <button onClick={handleSaveTask} className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold">
                {currentTask ? 'Save Changes' : 'Assign Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewTasks;
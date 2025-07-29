import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const initialNewTaskState = {
  title: "",
  staff: "",
  date: "",
  time: "",
  address: "",
  description: "",
};

function ViewTasks() {
  const navigate = useNavigate();

  const [bookingRequests, setBookingRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState(initialNewTaskState);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBookingData, setSelectedBookingData] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(
          "https://utility-booking-backend.onrender.com/api/services/request/all"
        );
        const visibleRequests = response.data.data.filter((request) => request.show === false);
        setBookingRequests(visibleRequests);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRequest();
  }, []);

  const handleOpen = (task = null) => {
    setSelectedBooking("");
    setStaffList([]);
    if (task) {
      setCurrentTask(task);
      setNewTask(task);
    } else {
      setCurrentTask(null);
      setNewTask(initialNewTaskState);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTask(null);
    setNewTask(initialNewTaskState);
    setSelectedBooking("");
    setStaffList([]);
    setSelectedBookingData(null);
  };

  const handleBookingSelect = async (bookingId) => {
    setSelectedBooking(bookingId);
    const selected = bookingRequests.find((b) => b.id === bookingId);
    if (!selected) return;

    setSelectedBookingData(selected);
    setNewTask((prev) => ({
      ...prev,
      title: selected.serviceName || selected.services,
      date: selected.date,
      time: selected.time,
      address: selected.address,
      description: `Booking by ${selected.name}: ${selected.note}`,
    }));

    try {
      const res = await axios.get(
        `https://utility-booking-backend.onrender.com/api/staff/department/${encodeURIComponent(selected.services)}`
      );
      const fetchedStaff = res.data?.data?.data || [];
      setStaffList(fetchedStaff.map((staff) => ({
        name: staff.fullName,
        id: staff.id
      })));
    } catch (error) {
      console.error("Error fetching staff list:", error);
      setStaffList([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveTask = async () => {
    if (!newTask.title || !newTask.staff || !newTask.date || !newTask.time || !newTask.address) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const selectedStaff = staffList.find((s) => s.name === newTask.staff);
      if (!selectedStaff || !selectedBookingData) {
        alert("Invalid staff or booking request selection.");
        return;
      }

      const taskPayload = {
        serviceId: selectedBookingData.id,
        citizenId: selectedBookingData.citizenId || "1",
        staffId: selectedStaff.id,
        status: "PENDING",
      };

      await axios.post("https://utility-booking-backend.onrender.com/api/task/add", taskPayload);
      await axios.put(`https://utility-booking-backend.onrender.com/api/services/request/${selectedBookingData.id}`, {
        ...selectedBookingData,
        show: true,
      });

      toast.success("Task assigned successfully!");
      handleClose();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to assign task.");
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 px-4 md:px-6">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl">
        <div className="bg-blue-600 dark:bg-navy-800 p-6 rounded-t-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <button
              onClick={() => navigate("/admin/services")}
              className="text-white hover:text-gray-200 transition-colors flex items-center gap-2 mb-2 text-sm"
            >
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

        <div className="p-6 bg-white dark:bg-navy-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-200">
            User Booking Requests
          </h3>
          {bookingRequests.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">No booking requests found.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-10 px-4">
              {bookingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-2xl rounded-3xl
                    p-6 md:p-8 border-2 border-blue-200 dark:border-gray-700 hover:shadow-2xl hover:border-pink-300
                    transition duration-300 min-h-[260px] w-full md:max-w-[420px] flex flex-col justify-between"
                >
                  <h4 className="text-base md:text-lg font-bold text-blue-700 dark:text-blue-300 mb-3">
                    Requested by: <span className="font-semibold">{req.name}</span>
                  </h4>

                  <div className="flex items-center text-sm md:text-base text-gray-800 dark:text-gray-200 mb-2">
                    <span className="mr-2 text-blue-400 text-lg md:text-xl">📅</span>
                    <span>{req.date}</span>
                    <span className="mx-2 text-pink-400 text-lg md:text-xl">⏰</span>
                    <span>{req.time}</span>
                  </div>

                  <div className="flex items-start text-sm md:text-base text-gray-700 dark:text-gray-300 mb-2">
                    <span className="mr-2 pt-1 text-red-400 text-lg md:text-xl">📍</span>
                    <div className="whitespace-pre-line break-words font-medium max-h-[96px] overflow-auto custom-scrollbar">
                      {req.address}
                    </div>
                  </div>

                  {req.note && (
                    <p className="mt-2 text-xs md:text-sm italic text-gray-500 dark:text-gray-400">
                      {req.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-2xl p-8 m-4">
            <h3 className="text-2xl font-semibold mb-6 text-center text-blue-600 dark:text-blue-300">
              {currentTask ? "Edit Task" : "Assign a New Task"}
            </h3>

            {!currentTask && bookingRequests.length > 0 && (
              <div className="mb-4">
                <label className="block mb-1 font-medium dark:text-gray-300">Select Booking Request:</label>
                <select
                  value={selectedBooking}
                  onChange={(e) => handleBookingSelect(e.target.value)}
                  className="border px-4 py-2 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
                >
                  <option value="">-- Select --</option>
                  {bookingRequests.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.services} (by {b.name})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid gap-5">
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={newTask.title}
                onChange={handleInputChange}
                className="border px-4 py-2.5 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
              />
              <select
                name="staff"
                value={newTask.staff}
                onChange={handleInputChange}
                className="border px-4 py-2.5 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
              >
                <option value="">Select Staff Member</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.name}>
                    {staff.name}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  value={newTask.date}
                  onChange={handleInputChange}
                  className="border px-4 py-2.5 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
                />
                <input
                  type="time"
                  name="time"
                  value={newTask.time}
                  onChange={handleInputChange}
                  className="border px-4 py-2.5 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
                />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Full Address"
                value={newTask.address}
                onChange={handleInputChange}
                className="border px-4 py-2.5 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
              />
              <textarea
                name="description"
                placeholder="Task Description"
                value={newTask.description}
                onChange={handleInputChange}
                className="border px-4 py-2.5 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white border-gray-300 dark:border-gray-700"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-lg border text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTask}
                className="px-5 py-2.5 rounded-lg bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 font-semibold"
              >
                {currentTask ? "Save Changes" : "Assign Task"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default ViewTasks;

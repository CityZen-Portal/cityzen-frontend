import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { FaTools, FaUser, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaRegStickyNote, FaEnvelope, FaLock } from 'react-icons/fa';

const initialNewTaskState = {
  title: "",
  staff: "",
  date: "",
  time: "",
  address: "",
  description: "",
};

const SkeletonCard = () => (
  <div className="bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-2xl rounded-3xl border-2 border-blue-200 dark:border-gray-700 p-6 animate-pulse">
    <div className="h-5 w-2/3 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
    <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
    <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
    <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
  </div>
);

function ViewTasks() {
  const navigate = useNavigate();
  const [bookingRequests, setBookingRequests] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [newTask, setNewTask] = useState(initialNewTaskState);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedBookingData, setSelectedBookingData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://utility-booking-backend.onrender.com/api/services/request/all"
        );
        const visibleRequests = response.data.data.filter(
          (request) => request.show === false
        );
        setBookingRequests(visibleRequests);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [bookingRequests]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRequests = bookingRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(bookingRequests.length / itemsPerPage);

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
      title: selected.services,
      address: selected.address,
      description: selected.description
    }));
    try {
      const res = await axios.get(
        `https://utility-booking-backend.onrender.com/api/staff/department/${encodeURIComponent(selected.services)}`
      );
      const fetchedStaff = res.data?.data?.data || [];
      const filteredStaff = fetchedStaff.filter((staff) => staff.delete === false);
      setStaffList(filteredStaff.map((staff) => ({
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
    if (!newTask.staff) {
      toast.error("Please select a staff member.");
      return;
    }
    try {
      setAssigning(true);
      const selectedStaff = staffList.find((s) => s.name === newTask.staff);
      if (!selectedStaff || !selectedBookingData) {
        toast.error("Invalid staff or booking request selection.");
        setAssigning(false);
        return;
      }
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().slice(0, 5);
      const taskPayload = {
        serviceId: selectedBookingData.id,
        citizenId: selectedBookingData.citizenId || "1",
        staffId: selectedStaff.id,
        status: "PENDING",
        date: currentDate,
        time: currentTime,
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
    } finally {
      setAssigning(false);
    }
  };

  const filteredBookingRequests = bookingRequests.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 px-4 md:px-6">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl">
        <div className="bg-blue-600 dark:bg-navy-800 p-6 rounded-t-xl flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <button
              onClick={() => navigate("/admin/services")}
              className="text-white hover:text-gray-200 dark:text-cyan-100 transition-colors flex items-center gap-2 mb-2 text-sm"
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
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-200">User Booking Requests</h3>
          {bookingRequests.length === 0 ? (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6 px-4">
              {[...Array(6)].map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6 px-4">
                {currentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-xl rounded-3xl border border-blue-200 dark:border-gray-700 hover:shadow-2xl hover:border-pink-300 transition-all duration-300 ease-in-out min-h-[290px] w-full md:max-w-[420px] flex flex-col justify-between p-6 md:p-8"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <FaTools className="text-blue-500 text-xl" />
                      <span className="text-lg md:text-xl font-bold text-blue-700 dark:text-blue-300">{req.services}</span>
                    </div>
                    <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <FaUser className="text-indigo-500 text-lg" /> {req.name}
                    </div>
                    <div className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <FaEnvelope className="text-indigo-500 text-lg" /> {req.email}
                    </div>
                    <div className="flex items-center text-gray-800 dark:text-gray-200 text-sm md:text-base mb-3 gap-3">
                      <FaCalendarAlt className="text-blue-500" /> <span>{req.date}</span>
                      <FaClock className="text-pink-500" /> <span>{req.time}</span>
                    </div>
                    <div className="flex items-start text-gray-700 dark:text-gray-300 text-sm md:text-base mb-3 gap-2">
                      <FaMapMarkerAlt className="text-red-500 mt-1" />
                      <div className="whitespace-pre-line break-words font-medium max-h-[96px] overflow-auto custom-scrollbar">
                        {req.address}
                      </div>
                    </div>
                    {req.description && (
                      <div className="mt-auto flex items-center gap-2 bg-white/50 dark:bg-gray-700/40 p-3 rounded-xl border border-gray-200 dark:border-gray-600">
                        <FaRegStickyNote className="text-yellow-500 text-lg" />
                        <p className="text-xs md:text-sm italic text-gray-600 dark:text-gray-400">{req.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center gap-2 mt-4">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded disabled:opacity-50 dark:text-white">Prev</button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded text-sm ${currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-600 dark:text-white"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm rounded disabled:opacity-50 dark:text-white">Next</button>
              </div>
            </>
          )}
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
       <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-xl shadow-2xl p-8 m-4">
  <h3 className="text-2xl font-semibold mb-6 text-center text-blue-600 dark:text-blue-300">
    {currentTask ? "Edit Task" : "Assign a New Task"}
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
   
       <div className="space-y-5">
      {!currentTask && bookingRequests.length > 0 && (
        <>
          <label className="block mb-1 font-medium dark:text-gray-300">Select Booking Request:</label>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full mb-2 bg-white dark:bg-gray-800 text-black dark:text-white"
          />
          <select
            value={selectedBooking}
            onChange={(e) => handleBookingSelect(e.target.value)}
            className="border px-4 py-2 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white"
          >
            <option value="">-- Select --</option>
            {filteredBookingRequests.length > 0 ? (
              filteredBookingRequests.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.services} (by {b.name})
                </option>
              ))
            ) : (
              <option disabled>No matching results</option>
            )}
          </select>
        </>
      )}

      <div>
        <label className="block mb-1 font-medium dark:text-gray-300">Select Staff Member</label>
        <select
          name="staff"
          value={newTask.staff}
          onChange={handleInputChange}
          className="border px-4 py-2.5 rounded-lg w-full bg-white dark:bg-gray-800 text-black dark:text-white"
        >
          <option value="">Select Staff Member</option>
          {staffList.map((staff) => (
            <option key={staff.id} value={staff.name}>
              {staff.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          onClick={handleClose}
          className="px-5 py-2.5 rounded-lg border text-gray-600 dark:text-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveTask}
          disabled={assigning}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white"
        >
          {assigning ? "Assigning..." : currentTask ? "Save Changes" : "Assign Task"}
        </button>
      </div>
    </div>

   
    {selectedBookingData && (
      <div className="space-y-5">
        <div>
          <label className="block mb-1 font-medium dark:text-gray-300">Department</label>
          <div className="px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 opacity-70 cursor-not-allowed">
            {selectedBookingData.services || "-"}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium dark:text-gray-300">Email</label>
          <div className="px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 opacity-70 cursor-not-allowed">
            {selectedBookingData.email || "-"}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium dark:text-gray-300">Address</label>
          <div className="px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 opacity-70 cursor-not-allowed whitespace-pre-line">
            {selectedBookingData.address || "-"}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium dark:text-gray-300">Description</label>
          <div className="px-4 py-2.5 rounded-lg bg-gray-200 dark:bg-gray-700 opacity-70 cursor-not-allowed whitespace-pre-line">
            {selectedBookingData.description || "-"}
          </div>
        </div>
      </div>
    )}
 
  </div>
</div>

        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default ViewTasks;

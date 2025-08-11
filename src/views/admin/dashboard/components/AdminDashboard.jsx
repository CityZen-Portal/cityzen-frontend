import React, { useState, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  EyeSlashIcon,
  EyeIcon,
  TrashIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import GrievancesRaisedCard from "./cards/GrievancesRaisedCard";
import ResolvedComplaintsCard from "./cards/ResolvedComplaintsCard";
import ServiceRequestsCard from "./cards/ServiceRequestsCard";
import FeedbackReceivedCard from "./cards/FeedbackReceivedCard";
import StaffTasksCard from "./cards/StaffTasksCard";
import CitizenRegisteredCard from "./cards/CitizenRegisteredCard";


const PageNavigator = ({ 
  filteredComplaints, 
  rowsPerPage, 
  currentPage, 
  totalPages, 
  handlePageChange 
}) => {
  if (filteredComplaints.length <= rowsPerPage) return null;

  // Calculate visible page numbers (show current page and one on each side)
  const getVisiblePages = () => {
    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, currentPage + 1);
    
    // Adjust if we're at the beginning or end
    if (currentPage === 1) {
      end = Math.min(3, totalPages);
    } else if (currentPage === totalPages) {
      start = Math.max(1, totalPages - 2);
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="mt-6 flex flex-col items-center space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 px-2 py-1 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 px-2 py-1 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          <MdChevronLeft />
        </button>
        
        {visiblePages.map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num)}
            className={`flex h-8 w-8 items-center justify-center rounded px-2 py-1 ${
              currentPage === num
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
            }`}
          >
            {num}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 px-2 py-1 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          <MdChevronRight />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 px-2 py-1 disabled:opacity-50 dark:bg-gray-700 dark:text-white"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [showRequests, setShowRequests] = useState(false);
  const [showComplaints, setShowComplaints] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const [complaints, setComplaints] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage] = useState(5);

const totalPages = Math.ceil(complaints.length / rowsPerPage);
const currentComplaints = complaints.slice(
  (currentPage - 1) * rowsPerPage,
  currentPage * rowsPerPage
);

// Generate page numbers (e.g., [1, 2, 3])
const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

// Handle page change
const handlePageChange = (page) => {
  setCurrentPage(page);
};
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const citizenId = localStorage.getItem("id")
   const HELPDESK_API = process.env.REACT_APP_API_HELPDESK_URL;

  useEffect( () => {
    axios.get(`${HELPDESK_API}/admin/complaints`,
      {
        headers:{
          token,
          email,
          id: citizenId
        }
      }
    )
      .then(res => {
          console.log('Response:', res.data.data);
          const data = res.data.data
          setComplaints(data);
        })
        .catch(err => {
          toast.error('Server Error!Unable to Fetch Data', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored'
          });
          console.error('Error:', err.response?.data || err.message);
        })
        .finally(() => {
        });
  }, []);


  useEffect(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  }
}, []);

useEffect(() => {
  const root = window.document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
}, [theme]);
  const cardStyle = "rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md transition-colors";

  return (
    <div className="bg-slate-100 flex min-h-screen font-sans text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <div className="flex-1 p-6">
        {showRequests ? (
          <RequestsTable onBack={() => setShowRequests(false)} />
        ) : (
          <>
            {/* Stats */}
            <div className="mb-6 grid grid-cols-1 gap-10 md:grid-cols-3">
              <GrievancesRaisedCard />
              <ResolvedComplaintsCard />
              <ServiceRequestsCard />
              <FeedbackReceivedCard />
              <StaffTasksCard />
              <CitizenRegisteredCard />
            </div>

            {/* Actions */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">

              <ActionCard
                title="View Complaints"
                description="Monitor all citizen grievances raised across departments."
                onClick={() => navigate("/admin/complaints")}
              />
              <ActionCard
                title="View Requests"
                description="Access service requests like electricity, water, sanitation."
                onClick={() => setShowRequests(true)}
              />
              <ActionCard
                title="View Messages"
                description="Review citizen feedback to improve service quality."
                onClick={() => navigate("/admin/services/feedback")}
              />
            </div>

             {/* Summary Section */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
              {/* Civic Issue Summary */}
              <div className="col-span-2 rounded-2xl bg-white p-6 shadow-lg transition-colors dark:bg-gray-800">
  <div className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white">
    📋 <span>Civic Issue Summary</span>
  </div>
  <table className="w-full text-sm">
  <colgroup>
    <col className="w-[40%]" />  {/* Name column - 40% width */}
    <col className="w-[35%]" />  {/* Status column - 35% width */}
    <col className="w-[25%]" />  {/* Date column - 25% width (reduced) */}
  </colgroup>
  <thead>
    <tr className="text-left text-black dark:text-gray-300">
      <th className="pb-2 pr-2">Name</th>  {/* Added pr-2 for right padding */}
      <th className="pb-2 pr-2">Status</th> {/* Added pr-2 for right padding */}
      <th className="pb-2">Date</th>
    </tr>
  </thead>
  <tbody>
    {currentComplaints.map((item, i) => (
      <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
        <td className="py-3 font-medium text-black dark:text-white pr-2 truncate">
          {item.category}
        </td><td className="flex items-center gap-2 py-3 text-black dark:text-white pr-2 truncate">
          {item.icon}{" "}
          {item.status
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
        </td>
        <td className="py-3 text-black dark:text-white truncate">
          {item.complaintDate.split("T")[0]}
        </td>
      </tr>
    ))}
  </tbody>
</table>
  <PageNavigator
  filteredComplaints={complaints}
  rowsPerPage={rowsPerPage}
  currentPage={currentPage}
  totalPages={totalPages}
  handlePageChange={handlePageChange}
  pageNumbers={pageNumbers}
/>
</div>

              {/* Calendar */}
              <div className="col-span-2 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white">
                  📅 <span>Events Calendar</span>
                </div>
                <CustomCalendar />
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}

function ActionCard({ title, description, onClick }) {
  return (
    <div className="flex h-48 flex-col justify-between rounded-2xl bg-white p-6 shadow-md transition-colors dark:bg-gray-800">
      <div>
        <h2 className="mb-2 text-xl font-semibold text-indigo-600 dark:text-white">
          {title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">{description}</p>
      </div>
      <button
        onClick={onClick}
        className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm text-white transition hover:bg-indigo-700"
      >
        Go to {title.split(" ")[1]}
      </button>
    </div>
  );
}

function RequestsTable({ onBack }) {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Ravi Sharma",
      department: "Water",
      request: "New water connection for house in Sector 18",
      hidden: false,
      accepted: false,
    },
    {
      id: 2,
      name: "Anjali Patel",
      department: "Sanitation",
      request: "Request for additional dustbins in park area",
      hidden: false,
      accepted: false,
    },
    {
      id: 3,
      name: "Mohit Verma",
      department: "Electricity",
      request: "Apply for a new streetlight near bus stop",
      hidden: false,
      accepted: false,
    },
    {
      id: 4,
      name: "Sneha Rao",
      department: "Roads",
      request: "Request to construct a pedestrian crossing",
      hidden: false,
      accepted: false,
    },
  ]);

  const [menuOpen, setMenuOpen] = useState(null);
  const [showHidden, setShowHidden] = useState(false);

  const toggleMenu = (id) => {
    setMenuOpen((prev) => (prev === id ? null : id));
  };

  const acceptRequest = (id) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, accepted: true } : req))
    );
    setMenuOpen(null);
  };

  const toggleHide = (id) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, hidden: !req.hidden } : req))
    );
    setMenuOpen(null);
  };

  const removeRequest = (id) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
    setMenuOpen(null);
  };

  const visibleRequests = requests.filter((r) => !r.hidden && !r.accepted);
  const hiddenRequests = requests.filter((r) => r.hidden);
  const acceptedRequests = requests.filter((r) => r.accepted);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
      <button
        className="mb-4 text-lg font-bold text-indigo-600 underline"
        onClick={onBack}
      >
        ← Back
      </button>

      <h2 className="mb-2 text-xl font-semibold">Manage Requests</h2>

      <div className="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>Visible: {visibleRequests.length}</span>
        <span>Hidden: {hiddenRequests.length}</span>
        <span>Accepted: {acceptedRequests.length}</span>
      </div>

      {visibleRequests.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No visible requests.</p>
      ) : (
        <table className="relative mb-6 w-full border text-left text-sm">
          <thead className="bg-indigo-50 text-xs uppercase text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Request</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRequests.map((req, index) => (
              <tr className="relative border-b" key={req.id}>
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{req.name}</td>
                <td className="px-4 py-2">{req.department}</td>
                <td className="px-4 py-2">{req.request}</td>
                <td className="px-4 py-2">
                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(req.id)}
                      className="text-gray-700 hover:text-indigo-600 dark:text-gray-200"
                    >
                      <FaEllipsisV />
                    </button>
                    {menuOpen === req.id && (
                      <div className="absolute right-0 z-10 mt-2 rounded border bg-white shadow dark:bg-gray-700">
                        <button
                          onClick={() => acceptRequest(req.id)}
                          className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <CheckCircleIcon className="mr-2 h-4 w-4 text-green-600" />{" "}
                          Accept
                        </button>
                        <button
                          onClick={() => toggleHide(req.id)}
                          className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <EyeSlashIcon className="mr-2 h-4 w-4 text-yellow-600" />{" "}
                          Hide
                        </button>
                        <button
                          onClick={() => removeRequest(req.id)}
                          className="flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <TrashIcon className="mr-2 h-4 w-4 text-red-600" />{" "}
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {acceptedRequests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md mb-2 font-semibold text-green-700 dark:text-green-300">
            Accepted Requests
          </h3>
          <ul className="space-y-2">
            {acceptedRequests.map((req) => (
              <li
                key={req.id}
                className="flex items-center justify-between rounded bg-green-100 px-4 py-2 dark:bg-green-700"
              >
                <div>
                  <span className="font-medium">{req.name}</span> —{" "}
                  <span className="text-sm">{req.request}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hiddenRequests.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowHidden((prev) => !prev)}
            className="mb-2 text-sm text-indigo-600 underline"
          >
            {showHidden ? "Hide Hidden Requests" : "Show Hidden Requests"}
          </button>

          {showHidden && (
            <div>
              <h3 className="text-md mb-2 font-semibold text-gray-700 dark:text-gray-200">
                Hidden Requests
              </h3>
              <ul className="space-y-2">
                {hiddenRequests.map((req) => (
                  <li
                    key={req.id}
                    className="flex items-center justify-between rounded bg-gray-100 px-4 py-2 dark:bg-gray-700"
                  >
                    <div>
                      <span className="font-medium">{req.name}</span> —{" "}
                      <span className="text-sm">{req.request}</span>
                    </div>
                    <button
                      onClick={() => toggleHide(req.id)}
                      className="rounded bg-indigo-500 px-3 py-1 text-white hover:bg-indigo-600"
                      title="Unhide"
                    >
                      <EyeIcon className="mr-1 inline h-4 w-4" /> Unhide
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CustomCalendar() {
  const API_BASE_URL = "https://auth-backend-2-k3ph.onrender.com/api";
  const adminId = "ADM007"; // Static admin ID as requested

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showModal, setShowModal] = useState(false);
  const [eventText, setEventText] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [fromHour, setFromHour] = useState("");
  const [fromMinute, setFromMinute] = useState("");
  const [fromPeriod, setFromPeriod] = useState("AM");
  const [toHour, setToHour] = useState("");
  const [toMinute, setToMinute] = useState("");
  const [toPeriod, setToPeriod] = useState("AM");
  const [events, setEvents] = useState({});
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeReminders, setActiveReminders] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);
  const [reminderTime, setReminderTime] = useState("none");
  const [eventDescription, setEventDescription] = useState("");

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/events/admin/${adminId}`, {
        headers: {
          token: localStorage.getItem("token"),
          email: localStorage.getItem("email"),
          id: localStorage.getItem("id")
        }
      });
      
      const formattedEvents = {};
      response.data.forEach(event => {
        const dateKey = dayjs(event.date).format("YYYY-MM-DD");
        if (!formattedEvents[dateKey]) {
          formattedEvents[dateKey] = [];
        }
        formattedEvents[dateKey].push({
          id: event.id,
          name: event.title,
          location: event.location,
          startTime: event.startTime,
          endTime: event.endTime,
          date: event.date,
          description: event.description,
          reminderTime: event.reminderTime
        });
      });
      
      setEvents(formattedEvents);
    } catch (err) {
      toast.error('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Reset form inputs
  const resetForm = () => {
    setEventText("");
    setEventLocation("");
    setFromHour("");
    setFromMinute("");
    setFromPeriod("AM");
    setToHour("");
    setToMinute("");
    setToPeriod("AM");
    setEditingEventId(null);
    setReminderTime("none");
    setEventDescription("");
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const checkReminders = () => {
      const now = dayjs();
      const upcomingReminders = [];
      
      // Check all events for reminders
      Object.entries(events).forEach(([date, eventList]) => {
        eventList.forEach(event => {
          if (event.reminderTime && event.reminderTime !== "none") {
            // Calculate reminder time based on event start time and reminder setting
            const [startTime, period] = event.startTime.split(" ");
            let [hours, minutes] = startTime.split(":").map(Number);
            
            // Convert to 24-hour format
            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;
            
            const eventDateTime = dayjs(`${date}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
            
            // Calculate reminder time based on reminder setting
            let reminderDateTime;
            switch(event.reminderTime) {
              case "5min":
                reminderDateTime = eventDateTime.subtract(5, 'minute');
                break;
              case "10min":
                reminderDateTime = eventDateTime.subtract(10, 'minute');
                break;
              case "30min":
                reminderDateTime = eventDateTime.subtract(30, 'minute');
                break;
              default:
                return;
            }
            
            // Check if reminder should trigger now
            if (reminderDateTime.isAfter(now.subtract(1, 'minute'))) {
              upcomingReminders.push({
                ...event,
                date,
                reminderTime: event.reminderTime
              });
            }
          }
        });
      });
      
      if (upcomingReminders.length > 0) {
        setActiveReminders(upcomingReminders);
        setCurrentReminder(upcomingReminders[0]);
        setShowReminderModal(true);
      }
    };
    
    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [events]);

  const handleAddEvent = async () => {
    if (!eventText) {
      toast.error("Event name is required");
      return;
    }
    
    if (!fromHour || !fromMinute || !toHour || !toMinute) {
      toast.error("Please enter valid start and end times");
      return;
    }
    
    try {
      const eventData = {
        title: eventText,
        adminId: adminId,
        date: selectedDate.format("YYYY-MM-DD"),
        startTime: `${fromHour}:${fromMinute} ${fromPeriod}`,
        endTime: `${toHour}:${toMinute} ${toPeriod}`,
        location: eventLocation,
        reminderTime: reminderTime,
        description: eventDescription
      };

      if (editingEventId) {
        // Update existing event
        await axios.put(`${API_BASE_URL}/events/${editingEventId}`, eventData, {
          headers: {
            token: localStorage.getItem("token"),
            email: localStorage.getItem("email"),
            id: localStorage.getItem("id")
          }
        });
        toast.success('Event updated successfully!');
      } else {
        // Create new event
        await axios.post(`${API_BASE_URL}/events`, eventData, {
          headers: {
            token: localStorage.getItem("token"),
            email: localStorage.getItem("email"),
            id: localStorage.getItem("id")
          }
        });
        toast.success('Event created successfully!');
      }

      // Refresh events after update
      await fetchEvents();
      resetForm();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
      console.error(err);
    }
  };

  const ReminderModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="rounded-lg bg-white p-6 shadow-md w-96 dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Reminder</h3>
        {currentReminder && (
          <div className="dark:text-gray-200">
            <p><strong className="dark:text-white">Event:</strong> {currentReminder.name}</p>
            <p><strong className="dark:text-white">Time:</strong> {currentReminder.startTime}</p>
            <p><strong className="dark:text-white">Location:</strong> {currentReminder.location || 'None'}</p>
          </div>
        )}
        <div className="flex justify-between mt-4">
          <button 
            onClick={() => {
              const nextReminders = activeReminders.slice(1);
              setActiveReminders(nextReminders);
              setCurrentReminder(nextReminders[0] || null);
              if (nextReminders.length === 0) setShowReminderModal(false);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Dismiss
          </button>
          <button 
            onClick={() => setShowReminderModal(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
          >
            Snooze (10 min)
          </button>
        </div>
      </div>
    </div>
  );

  // Delete event
  const handleDeleteSelectedEvent = async () => {
    if (!selectedEventDetails) return;
    
    try {
      const eventId = selectedEventDetails.events[selectedEventDetails.selectedIndex].id;
      await axios.delete(`${API_BASE_URL}/events/${eventId}`, {
        headers: {
          token: localStorage.getItem("token"),
          email: localStorage.getItem("email"),
          id: localStorage.getItem("id")
        }
      });

      // Refresh events after deletion
      await fetchEvents();
      setSelectedEventDetails(null);
      toast.success('Event deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete event');
      console.error(err);
    }
  };

  // Open Event Details modal with list of events on that day
  const openEventDetails = (dateKey, index) => {
    setSelectedEventDetails({
      date: dateKey,
      events: events[dateKey],
      selectedIndex: index,
    });
    setShowModal(false);
  };

  // Open edit modal for the selected event in the list modal
  const openEditModalFromDetails = () => {
    if (!selectedEventDetails) return;

    const { events, selectedIndex } = selectedEventDetails;
    const event = events[selectedIndex];
    
    // Parse time from existing event
    const [startTime, startPeriod] = event.startTime.split(" ");
    const [startHour, startMinute] = startTime.split(":");
    
    const [endTime, endPeriod] = event.endTime.split(" ");
    const [endHour, endMinute] = endTime.split(":");

    setSelectedDate(dayjs(event.date));
    setEventText(event.name);
    setEventLocation(event.location || "");
    setFromHour(startHour);
    setFromMinute(startMinute);
    setFromPeriod(startPeriod);
    setToHour(endHour);
    setToMinute(endMinute);
    setToPeriod(endPeriod);
    setEditingEventId(event.id);
    setReminderTime(event.reminderTime || "none");
    setEventDescription(event.description || "");

    setShowModal(true);
    setSelectedEventDetails(null);
  };

  // Generate calendar dates
  const startOfMonth = currentDate.startOf("month");
  const startDay = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
  const daysInMonth = currentDate.daysInMonth();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(dayjs(currentDate).date(i));

  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
          className="rounded-full bg-indigo-600 px-2 py-1 text-lg text-white hover:bg-indigo-700"
        >
          &lt;
        </button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={() => setCurrentDate(currentDate.add(1, "month"))}
          className="rounded-full bg-indigo-600 px-2 py-1 text-lg text-white hover:bg-indigo-700"
        >
          &gt;
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days */}
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          const dateKey = date?.format("YYYY-MM-DD");
          return (
            <div
              key={idx}
              className="relative flex h-10 w-10 items-center justify-center"
            >
              {date ? (
                <button
                  onClick={() => handleDateClick(date)}
                  className={`h-10 w-10 rounded-full transition-all duration-200 ${
                    date.isSame(selectedDate, "day")
                      ? "bg-indigo-600 text-white"
                      : "text-gray-800 hover:bg-gray-200 dark:text-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {date.date()}
                </button>
              ) : (
                <div />
              )}

              {/* Event dots */}
              {events[dateKey]?.length > 0 &&
                events[dateKey].map((event, i) => (
                  <button
                    key={i}
                    onClick={() => openEventDetails(dateKey, i)}
                    className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 rounded-full border border-white dark:border-gray-800"
                    title={event.name}
                  ></button>
                ))}
            </div>
          );
        })}
      </div>

      {/* Add Event button */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
        >
          + Add Event
        </button>
      </div>

      {/* Reminder Modal */}
      {showReminderModal && <ReminderModal />}

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="rounded-lg bg-white p-6 shadow-md w-96 max-h-[90vh] overflow-auto dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              {editingEventId
                ? `Edit Event on ${selectedDate.format("DD MMM YYYY")}`
                : `Add Event on ${selectedDate.format("DD MMM YYYY")}`}
            </h3>

            <input
              type="text"
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              placeholder="Enter event name"
              className="w-full rounded border px-3 py-2 mb-3 focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />

            {/* From and To Time */}
            <div className="flex gap-2 mb-3">
              {/* From Time */}
              <div className="w-1/2">
                <label className="block text-sm text-gray-600 mb-1 dark:text-gray-300">From</label>
                <div className="flex">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    placeholder="HH"
                    value={fromHour}
                    onChange={(e) => setFromHour(e.target.value)}
                    className="w-1/3 rounded-l border px-2 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  <span className="px-1 py-2 dark:text-gray-300">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="MM"
                    value={fromMinute}
                    onChange={(e) => setFromMinute(e.target.value)}
                    className="w-1/3 border px-2 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  <select
                    value={fromPeriod}
                    onChange={(e) => setFromPeriod(e.target.value)}
                    className="w-1/3 rounded-r border px-2 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              {/* To Time */}
              <div className="w-1/2">
                <label className="block text-sm text-gray-600 mb-1 dark:text-gray-300">To</label>
                <div className="flex">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    placeholder="HH"
                    value={toHour}
                    onChange={(e) => setToHour(e.target.value)}
                    className="w-1/3 rounded-l border px-2 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  <span className="px-1 py-2 dark:text-gray-300">:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="MM"
                    value={toMinute}
                    onChange={(e) => setToMinute(e.target.value)}
                    className="w-1/3 border px-2 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                  <select
                    value={toPeriod}
                    onChange={(e) => setToPeriod(e.target.value)}
                    className="w-1/3 rounded-r border px-2 py-2 focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <input
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="Enter location"
              className="w-full rounded border px-3 py-2 mb-3 focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />

            {/* Reminder */}
            <select
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="w-full rounded border px-3 py-2 mb-3 text-gray-500 focus:outline-none focus:ring focus:ring-indigo-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="none">No reminder</option>
              <option value="5min">5 minutes before</option>
              <option value="10min">10 minutes before</option>
              <option value="30min">30 minutes before</option>
            </select>

            {/* Description */}
            <textarea
              rows="2"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Add a short description"
              className="w-full rounded border px-3 py-2 mb-3 focus:outline-none focus:ring focus:ring-indigo-300 resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(false);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {editingEventId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Event Details Modal with list */}
      {selectedEventDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="rounded-lg bg-white p-6 shadow-md w-96 max-h-[80vh] overflow-auto dark:bg-gray-800">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">
              Events on {dayjs(selectedEventDetails.date).format("DD MMM YYYY")}
            </h3>

            {/* Event list */}
            <div className="mb-4 max-h-32 overflow-y-auto border p-2 rounded dark:border-gray-600">
              {selectedEventDetails.events.map((ev, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setSelectedEventDetails((prev) => ({
                      ...prev,
                      selectedIndex: idx,
                    }))
                  }
                  className={`block w-full text-left px-2 py-1 rounded ${
                    idx === selectedEventDetails.selectedIndex
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-indigo-100 dark:hover:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {ev.name} ({ev.startTime})
                </button>
              ))}
            </div>

            {/* Selected event details */}
            {selectedEventDetails.events[selectedEventDetails.selectedIndex] && (
              <div className="dark:text-gray-200">
                <p className="mb-2">
                  <strong className="dark:text-white">Name:</strong> {selectedEventDetails.events[selectedEventDetails.selectedIndex].name}
                </p>
                <p className="mb-2">
                  <strong className="dark:text-white">Time:</strong> {selectedEventDetails.events[selectedEventDetails.selectedIndex].startTime} - {selectedEventDetails.events[selectedEventDetails.selectedIndex].endTime}
                </p>
                {selectedEventDetails.events[selectedEventDetails.selectedIndex].location && (
                  <p className="mb-2">
                    <strong className="dark:text-white">Location:</strong> {selectedEventDetails.events[selectedEventDetails.selectedIndex].location}
                  </p>
                )}
                {selectedEventDetails.events[selectedEventDetails.selectedIndex].description && (
                  <p className="mb-2">
                    <strong className="dark:text-white">Description:</strong> {selectedEventDetails.events[selectedEventDetails.selectedIndex].description}
                  </p>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={openEditModalFromDetails}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  handleDeleteSelectedEvent();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedEventDetails(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
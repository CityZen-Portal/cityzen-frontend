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
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";

import dayjs from "dayjs";

import GrievancesRaisedCard from "./cards/GrievancesRaisedCard";
import ResolvedComplaintsCard from "./cards/ResolvedComplaintsCard";
import ServiceRequestsCard from "./cards/ServiceRequestsCard";
import FeedbackReceivedCard from "./cards/FeedbackReceivedCard";
import StaffTasksCard from "./cards/StaffTasksCard";
import CitizenRegisteredCard from "./cards/CitizenRegisteredCard";


export default function AdminDashboard() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

 return (
  <div className="flex min-h-screen font-sans bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
    <div className="flex-1 p-6">
      {showRequests ? (
        <RequestsTable onBack={() => setShowRequests(false)} />
      ) : (
        <>
          {/* Stats */}
          <div className="mb-6 grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              "Grievences Raised",
              "Resolved Complaints",
              "Service Requests",
              "Feedback Received",
              "Staff Tasks",
              "Citizen Registered",
            ].map((title, i) => (
              <div key={i} className={cardStyle}>
                <div className="text-sm font-semibold text-black-700 dark:text-gray-300">{title}</div>
                <div className="text-xl font-bold text-black dark:text-white">0</div>
              </div>
            ))}
          </div>

  return (
    <div className="bg-slate-100 flex min-h-screen font-sans text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <div className="flex-1 p-6">
        {showComplaints ? (
          <ComplaintsTable onBack={() => setShowComplaints(false)} />
        ) : showRequests ? (
          <RequestsTable onBack={() => setShowRequests(false)} />
        ) : showFeedback ? (
          <FeedbackTable onBack={() => setShowFeedback(false)} />
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
            <div className="col-span-2 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-lg transition-colors">
              <div className="mb-4 text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                📋 <span>Civic Issue Summary</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-black dark:text-gray-300">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      name: "Road Maintenance",
                      status: "Approved",
                      icon: <CheckCircleIcon className="h-5 w-5 text-gray-500" />,
                      date: "24Jan'25",
                      color: "bg-green-500",
                      progress: "80%",
                    },
                    {
                      name: "Garbage Collection",
                      status: "Disable",
                      icon: <XCircleIcon className="h-5 w-5 text-gray-500" />,
                      date: "15Feb'25",
                      color: "bg-red-500",
                      progress: "30%",
                    },
                    {
                      name: "Street Light Repair",
                      status: "Error",
                      icon: <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />,
                      date: "20Mar'25",
                      color: "bg-orange-500",
                      progress: "50%",
                    },
                    {
                      name: "Water Leakage",
                      status: "Approved",
                      icon: <CheckCircleIcon className="h-5 w-5 text-gray-500" />,
                      date: "12Apr'25",
                      color: "bg-green-500",
                      progress: "70%",
                    },
                  ].map((item, i) => (
                    <tr key={i} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="py-3 font-medium text-black dark:text-white">{item.name}</td>
                      <td className="py-3 flex items-center gap-2 text-black dark:text-white">
                        {item.icon} {item.status}
                      </td>
                      <td className="py-3 text-black dark:text-white">{item.date}</td>
                      <td className="py-3">
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded">
                          <div className={`h-2 rounded ${item.color}`} style={{ width: item.progress }}></div>
                        </div>
                      </td>
                    </tr>

            {/* Summary Section */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
              {/* Civic Issue Summary */}
              <div className="col-span-2 rounded-2xl bg-white p-6 shadow-lg transition-colors dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white">
                  📋 <span>Civic Issue Summary</span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-black text-left dark:text-gray-300">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Road Maintenance",
                        status: "Approved",
                        icon: (
                          <CheckCircleIcon className="h-5 w-5 text-gray-500" />
                        ),
                        date: "24Jan'25"
                      },
                      {
                        name: "Garbage Collection",
                        status: "Disable",
                        icon: <XCircleIcon className="h-5 w-5 text-gray-500" />,
                        date: "15Feb'25"
                      },
                      {
                        name: "Street Light Repair",
                        status: "Error",
                        icon: (
                          <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />
                        ),
                        date: "20Mar'25"
                      },
                      {
                        name: "Water Leakage",
                        status: "Approved",
                        icon: (
                          <CheckCircleIcon className="h-5 w-5 text-gray-500" />
                        ),
                        date: "12Apr'25"
                      },
                    ].map((item, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-200 dark:border-gray-700"
                      >
                        <td className="text-black py-3 font-medium dark:text-white">
                          {item.name}
                        </td>
                        <td className="text-black flex items-center gap-2 py-3 dark:text-white">
                          {item.icon} {item.status}
                        </td>
                        <td className="text-black py-3 dark:text-white">
                          {item.date}
                        </td>
                        <td className="py-3">
                          <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700">
                            <div
                              className={`h-2 rounded ${item.color}`}
                              style={{ width: item.progress }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tasks */}
              <div className="col-span-1 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center text-xl font-bold text-gray-800 dark:text-white">
                    <ClipboardDocumentListIcon className="mr-2 h-5 w-5" />
                    Tasks
                  </h2>
                </div>
                <ul className="space-y-4">
                  {[
                    "Sanitation",
                    "Fire and Emergency",
                    "Electricity and Street Lights",
                    "Water Supply Management",
                    "Waste Management",
                  ].map((task, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="text-violet-500 focus:ring-violet-400 h-4 w-4 rounded"
                        />
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {task}
                        </span>
                      </label>
                    </li>

                  ))}
                </tbody>
              </table>
            </div>

            {/* Tasks */}
            <div className="col-span-1 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="flex items-center text-xl font-bold text-gray-800 dark:text-white">
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                  Tasks
                </h2>
              </div>
              <ul className="space-y-4">
                {["Sanitation", "Fire and Emergency", "Electricity and Street Lights", "Water Supply Management", "Waste Management"].map((task, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-violet-500 rounded focus:ring-violet-400"
                      />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {task}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Calendar */}
            <div className="col-span-1 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md">
              <div className="mb-4 text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                📅 <span>Events Calendar</span>

              {/* Calendar */}
              <div className="col-span-1 rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-white">
                  📅 <span>Events Calendar</span>
                </div>
                <CustomCalendar />

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

// Complaints Table
function ComplaintsTable({ onBack }) {
  const complaints = [
    {
      id: 1,
      name: "Priya Sharma",
      department: "Water",
      complaint: "No supply in Sector 12",
      status: "Pending",
    },
    {
      id: 2,
      name: "Amit Verma",
      department: "Sanitation",
      complaint: "Garbage not collected for 3 days",
      status: "In Progress",
    },
    {
      id: 3,
      name: "Neha Joshi",
      department: "Electricity",
      complaint: "Streetlights not working on 5th Avenue",
      status: "Resolved",
    },
    {
      id: 4,
      name: "Rahul Mehta",
      department: "Roads",
      complaint: "Potholes in front of Block C",
      status: "Pending",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-red-600";
      case "In Progress":
        return "text-yellow-600";
      case "Resolved":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
      <button
        className="mb-4 text-lg font-bold text-indigo-600 underline"
        onClick={onBack}
      >
        ← Back
      </button>
      <h2 className="mb-4 text-xl font-semibold">Manage Complaints</h2>
      <table className="w-full border text-left text-sm">
        <thead className="bg-indigo-50 text-xs uppercase text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Complaint</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="px-4 py-2">{c.id}</td>
              <td className="px-4 py-2">{c.name}</td>
              <td className="px-4 py-2">{c.department}</td>
              <td className="px-4 py-2">{c.complaint}</td>
              <td
                className={`px-4 py-2 font-semibold ${getStatusColor(
                  c.status
                )}`}
              >
                {c.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// Requests Table with Hide and Remove
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

// Feedback Table
function FeedbackTable({ onBack }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "Amit Kumar",
      department: "Electricity",
      message: "Has my electricity complaint been resolved yet?",
    },
    {
      id: 2,
      name: "Sunita Mehta",
      department: "Water",
      message: "I want to know how to apply for a new water connection.",
    },
  ]);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-gray-800">
      <button
        className="mb-4 text-lg font-bold text-indigo-600 underline"
        onClick={onBack}
      >
        ← Back
      </button>

      {/* User Messages Section */}
      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white">
        User Messages
      </h2>

      {messages.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No messages yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-left text-sm dark:border-gray-600">
            <thead className="bg-blue-50 text-xs uppercase text-blue-600 dark:bg-blue-900 dark:text-blue-200">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Citizen</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, index) => (
                <tr key={msg.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{msg.name}</td>
                  <td className="px-4 py-2">{msg.department}</td>
                  <td className="px-4 py-2">{msg.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Calendar component
function CustomCalendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const startOfMonth = currentDate.startOf("month");
  const startDay = startOfMonth.day() === 0 ? 6 : startOfMonth.day() - 1;
  const daysInMonth = currentDate.daysInMonth();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(dayjs(currentDate).date(i));

  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
          className="rounded-full bg-indigo-600 px-2 py-1 text-lg text-white"
        >
          &lt;
        </button>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={() => setCurrentDate(currentDate.add(1, "month"))}
          className="rounded-full bg-indigo-600 px-2 py-1 text-lg text-white"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-gray-600 dark:text-gray-300">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((date, idx) => (
          <div key={idx} className="flex h-10 w-10 items-center justify-center">
            {date ? (
              <button
                onClick={() => setSelectedDate(date)}
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
          </div>
        ))}
      </div>
    </div>
  );
}

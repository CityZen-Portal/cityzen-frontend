import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "react-calendar/dist/Calendar.css";

const cardStyle =
  "bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 flex flex-col items-start gap-1 transition-colors duration-300";

const dataLine = [
  { name: "JAN", uv: 450, pv: 600 },
  { name: "FEB", uv: 750, pv: 500 },
  { name: "MAR", uv: 620, pv: 530 },
  { name: "APR", uv: 680, pv: 490 },
  { name: "MAY", uv: 700, pv: 550 },
  { name: "JUN", uv: 730, pv: 570 },
  { name: "JUL", uv: 690, pv: 520 },
  { name: "AUG", uv: 710, pv: 540 },
  { name: "SEP", uv: 640, pv: 510 },
  { name: "OCT", uv: 600, pv: 480 },
  { name: "NOV", uv: 590, pv: 460 },
  { name: "DEC", uv: 660, pv: 500 },
];

export default function AdminDashboard() {
  const [theme, setTheme] = useState("light");
  const [showComplaints, setShowComplaints] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="flex min-h-screen font-sans bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <style>{`
  .react-calendar {
    background-color: white;
    color: #111827;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    width: 100%;
    max-width: 400px;
  }

  .dark .react-calendar {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .react-calendar__navigation button {
    background: none;
    color: #4f46e5;
    font-weight: 600;
    font-size: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
  }

  .dark .react-calendar__navigation button {
    color: #a5b4fc;
  }

  .react-calendar__tile {
    border-radius: 0.5rem;
    padding: 0.75rem 0.5rem;
    font-weight: 500;
    transition: background 0.2s;
  }

  .react-calendar__tile--active {
    background-color: #6366f1;
    color: white;
  }

  .dark .react-calendar__tile--active {
    background-color: #818cf8;
    color: white;
  }

  .react-calendar__tile--now {
    background-color: #e0e7ff;
    color: #3730a3;
  }

  .dark .react-calendar__tile--now {
    background-color: #4f46e5;
    color: white;
  }

  .react-calendar__tile:hover {
    background-color: #e5e7eb;
  }

  .dark .react-calendar__tile:hover {
    background-color: #374151;
  }

  .react-calendar__month-view__days__day--weekend {
    color: #6b7280;
  }

  .dark .react-calendar__month-view__days__day--weekend {
    color: #9ca3af;
  }
`}</style>


      {/* Theme toggle */}
      

      <div className="flex-1 p-6">
        {/* Conditional UI: Complaints / Requests / Feedback */}
        {showComplaints ? (
          <ComplaintsTable onBack={() => setShowComplaints(false)} />
        ) : showRequests ? (
          <RequestsTable onBack={() => setShowRequests(false)} />
        ) : showFeedback ? (
          <FeedbackTable onBack={() => setShowFeedback(false)} />
        ) : (
          <>
            {/* Dashboard Stats */}
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
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {title}
                  </div>
                  <div className="text-xl font-semibold">0</div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <ActionCard
                title="View Complaints"
                description="Monitor all citizen grievances raised across departments. Track pending, resolved, and escalated issues."
                onClick={() => setShowComplaints(true)}
              />
              <ActionCard
                title="View Requests"
                description="Access all public service requests including electricity, water, sanitation, and more. Assign tasks to staff."
                onClick={() => setShowRequests(true)}
              />
              <ActionCard
                title="View Feedback"
                description="Review citizen feedback on services and staff. Use insights to improve quality and public satisfaction."
                onClick={() => setShowFeedback(true)}
              />
            </div>

            {/* Graph & Calendar */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md">
                <div className="mb-4 text-xl font-semibold">
                  📈 Monthly Citizen Activity
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={dataLine}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" /> → <XAxis dataKey="name" interval={0} />

                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="uv" stroke="#6C5DD3" strokeWidth={3} />
                    <Line type="monotone" dataKey="pv" stroke="#00C9FF" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md">
  <style>{/* Paste style block here */}</style>
  <div className="mb-4 text-xl font-bold flex items-center gap-2">
    📅 <span>City Events Calendar</span>
  </div>
  <div className="flex justify-center">
    <Calendar className="w-full max-w-[400px]" />
  </div>
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
    <div className="h-48 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md flex flex-col justify-between transition-colors">
      <div>
        <h2 className="mb-2 text-xl font-semibold text-indigo-600">{title}</h2>
        <p className="text-gray-700 dark:text-gray-300">{description}</p>
      </div>
      <button
        onClick={onClick}
        className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition mt-4"
      >
        Go to {title.split(" ")[1]}
      </button>
    </div>
  );
}

function ComplaintsTable({ onBack }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md">
      <button className="text-lg font-bold text-indigo-600 underline mb-4" onClick={onBack}>
        ← Back
      </button>
      <h2 className="text-xl font-semibold mb-4">Manage Complaints</h2>
      <table className="w-full text-sm text-left border">
        <thead className="text-xs uppercase bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Citizen Name</th>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Complaint</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-2">1</td>
            <td className="px-4 py-2">Priya Sharma</td>
            <td className="px-4 py-2">Water</td>
            <td className="px-4 py-2">No supply in Sector 12</td>
            <td className="px-4 py-2 text-red-600">Pending</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function RequestsTable({ onBack }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md">
      <button className="text-lg font-bold text-indigo-600 underline mb-4" onClick={onBack}>
        ← Back
      </button>
      <h2 className="text-xl font-semibold mb-4">Manage Requests</h2>
      <p>No requests yet.</p>
    </div>
  );
}

function FeedbackTable({ onBack }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-md">
      <button className="text-lg font-bold text-indigo-600 underline mb-4" onClick={onBack}>
        ← Back
      </button>
      <h2 className="text-xl font-semibold mb-4">Citizen Feedback</h2>
      <p>No feedback yet.</p>
    </div>
  );
}

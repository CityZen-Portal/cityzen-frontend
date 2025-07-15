import React, { useState } from "react";
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
  "bg-white rounded-2xl shadow-md p-4 flex flex-col items-start gap-1";

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
  { name: "NOV", uv: 580, pv: 460 },
  { name: "DEC", uv: 660, pv: 500 },
];

export default function AdminDashboard() {
  const [showComplaints, setShowComplaints] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <div className="bg-slate-70 flex min-h-screen font-sans">
      <style>{`
        /* Custom react-calendar styles */
        .react-calendar {
          border: none;
          border-radius: 1rem;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 4px 10px rgb(0 0 0 / 0.1);
        }

        .react-calendar__navigation {
          background-color: #eef2ff; /* indigo-50 */
          border-radius: 1rem 1rem 0 0;
          margin-bottom: 8px;
        }

        .react-calendar__navigation button {
          color: #4f46e5; /* indigo-600 */
          font-weight: 600;
        }

        .react-calendar__tile--active {
          background: #6366f1; /* indigo-500 */
          color: white;
          border-radius: 0.75rem;
        }

        .react-calendar__tile--now {
          background: #a5b4fc; /* lighter indigo */
          color: #3730a3; /* indigo-900 */
          border-radius: 0.75rem;
        }

        .react-calendar__tile:hover {
          background-color: #ddd6fe; /* indigo-200 */
          border-radius: 0.75rem;
        }
      `}</style>

      <div
        className="flex-1 p-6"
        style={{ backgroundColor: "rgb(244 247 254)" }}
      >
        {/* Conditional Sections */}
        {showComplaints ? (
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <button
              className="text-lg font-bold text-indigo-600 underline mb-4"
              onClick={() => setShowComplaints(false)}
            >
              ← Back
            </button>
            <h2 className="text-xl font-semibold mb-4">Manage Complaints</h2>
            <table className="w-full text-sm text-left border">
              <thead className="text-xs uppercase bg-indigo-50 text-indigo-600">
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
                  <td className="px-4 py-2">Sanitation</td>
                  <td className="px-4 py-2">
                    Garbage not collected in Sector 12
                  </td>
                  <td className="px-4 py-2 text-yellow-600 font-medium">
                    Pending
                  </td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="px-4 py-2">2</td>
                  <td className="px-4 py-2">Rahul Mehta</td>
                  <td className="px-4 py-2">Water Supply</td>
                  <td className="px-4 py-2">No water supply since morning</td>
                  <td className="px-4 py-2 text-green-600 font-medium">
                    Resolved
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">3</td>
                  <td className="px-4 py-2">Ayesha Khan</td>
                  <td className="px-4 py-2">Street Lighting</td>
                  <td className="px-4 py-2">
                    Street lights not working in Block B
                  </td>
                  <td className="px-4 py-2 text-red-600 font-medium">
                    Escalated
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : showRequests ? (
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <button
              className="text-lg font-bold text-indigo-600 underline mb-4"
              onClick={() => setShowRequests(false)}
            >
              ← Back
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Manage Service Requests
            </h2>
            <table className="w-full text-sm text-left border">
              <thead className="text-xs uppercase bg-indigo-50 text-indigo-600">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Citizen Name</th>
                  <th className="px-4 py-2">Service</th>
                  <th className="px-4 py-2">Request Details</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2">Vikram Sinha</td>
                  <td className="px-4 py-2">Electricity</td>
                  <td className="px-4 py-2">Power outage in Lane 5</td>
                  <td className="px-4 py-2 text-yellow-600 font-medium">
                    Pending
                  </td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="px-4 py-2">2</td>
                  <td className="px-4 py-2">Neha Verma</td>
                  <td className="px-4 py-2">Water Supply</td>
                  <td className="px-4 py-2">Leakage in Sector 3 pipeline</td>
                  <td className="px-4 py-2 text-blue-600 font-medium">
                    In Progress
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">3</td>
                  <td className="px-4 py-2">Ramesh Kumar</td>
                  <td className="px-4 py-2">Sanitation</td>
                  <td className="px-4 py-2">Garbage bin full in Block A</td>
                  <td className="px-4 py-2 text-green-600 font-medium">
                    Completed
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : showFeedback ? (
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <button
              className="text-lg font-bold text-indigo-600 underline mb-4"
              onClick={() => setShowFeedback(false)}
            >
              ← Back
            </button>
            <h2 className="text-xl font-semibold mb-4">Citizen Feedback</h2>
            <table className="w-full text-sm text-left border">
              <thead className="text-xs uppercase bg-indigo-50 text-indigo-600">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Citizen Name</th>
                  <th className="px-4 py-2">Department</th>
                  <th className="px-4 py-2">Feedback</th>
                  <th className="px-4 py-2">Rating</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">1</td>
                  <td className="px-4 py-2">Sonal Jain</td>
                  <td className="px-4 py-2">Water Supply</td>
                  <td className="px-4 py-2">
                    Prompt response to water issue.
                  </td>
                  <td className="px-4 py-2 text-green-600 font-medium">
                    4.5 ★
                  </td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="px-4 py-2">2</td>
                  <td className="px-4 py-2">Manoj Rathi</td>
                  <td className="px-4 py-2">Sanitation</td>
                  <td className="px-4 py-2">Garbage was cleared late.</td>
                  <td className="px-4 py-2 text-yellow-600 font-medium">
                    3.0 ★
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">3</td>
                  <td className="px-4 py-2">Tina Verma</td>
                  <td className="px-4 py-2">Street Lighting</td>
                  <td className="px-4 py-2">
                    Quick repair of faulty lights.
                  </td>
                  <td className="px-4 py-2 text-green-600 font-medium">
                    5.0 ★
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <>
            {/* Dashboard Cards */}
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
                  <div className="text-sm text-gray-500">{title}</div>
                  <div className="text-xl font-semibold">0</div>
                </div>
              ))}
            </div>

            {/* Action Cards */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="h-48 rounded-2xl bg-white p-6 shadow-md flex flex-col justify-between">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-indigo-600">
                    View Complaints
                  </h2>
                  <p className="text-gray-700">
                    Monitor all citizen grievances raised across departments.
                    Track pending, resolved, and escalated issues.
                  </p>
                </div>
                <button
                  onClick={() => setShowComplaints(true)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition mt-4"
                >
                  Go to Complaints
                </button>
              </div>

              <div className="h-48 rounded-2xl bg-white p-6 shadow-md flex flex-col justify-between">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-indigo-600">
                    View Requests
                  </h2>
                  <p className="text-gray-700">
                    Access all public service requests including electricity,
                    water, sanitation, and more. Assign tasks to staff.
                  </p>
                </div>
                <button
                  onClick={() => setShowRequests(true)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition mt-4"
                >
                  Go to Requests
                </button>
              </div>

              <div className="h-48 rounded-2xl bg-white p-6 shadow-md flex flex-col justify-between">
                <div>
                  <h2 className="mb-2 text-xl font-semibold text-indigo-600">
                    View Feedback
                  </h2>
                  <p className="text-gray-700">
                    Review citizen feedback on services and staff. Use insights
                    to improve quality and public satisfaction.
                  </p>
                </div>
                <button
                  onClick={() => setShowFeedback(true)}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition mt-4"
                >
                  Go to Feedback
                </button>
              </div>
            </div>

            {/* Graph & Calendar */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-md">
                <div className="mb-4 text-xl font-semibold">
                  📈 Monthly Citizen Activity
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart
                    data={dataLine}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" minTickGap={10} />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="uv"
                      stroke="#6C5DD3"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="pv"
                      stroke="#00C9FF"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-md">
                <div className="mb-4 text-xl font-semibold text-left">
                  📅 City Events Calendar
                </div>

                {/* Center the Calendar */}
                <div className="flex justify-center">
                  <Calendar className="w-[400px]" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

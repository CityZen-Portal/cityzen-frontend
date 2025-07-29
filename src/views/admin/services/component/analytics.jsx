import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart
} from "recharts";
import {
  FaCheckCircle,
  FaIdCard,
  FaStar,
  FaClock,
} from "react-icons/fa"; // updated icons

const Dashboard = () => {
  const metricCards = [
    { icon: <FaCheckCircle />, title: "Resolved Complaints", value: 1846 },
    { icon: <FaIdCard />, title: "Pending Verifications", value: 112 },
    { icon: <FaStar />, title: "Most Used Service", value: "Water Supply" },
    { icon: <FaClock />, title: "Avg Resolution Time", value: "2.3 Days" },
  ];

  const monthlyData = [
    { month: "Jan", serviceRequests: 1000, complaints: 400 },
    { month: "Feb", serviceRequests: 1200, complaints: 460 },
    { month: "Mar", serviceRequests: 1800, complaints: 320 },
    { month: "Apr", serviceRequests: 1500, complaints: 300 },
    { month: "May", serviceRequests: 2000, complaints: 500 },
  ];

  const categoryData = [
    { category: "Water", value: 400 },
    { category: "Sanitation", value: 300 },
    { category: "Roads", value: 300 },
    { category: "Lights", value: 200 },
  ];

  const genderData = [
    { gender: "Male", value: 1800 },
    { gender: "Female", value: 1456 },
  ];

  const dailyRequestData = [
    { day: "Mon", requests: 90 },
    { day: "Tue", requests: 120 },
    { day: "Wed", requests: 140 },
    { day: "Thu", requests: 100 },
    { day: "Fri", requests: 160 },
    { day: "Sat", requests: 130 },
  ];

  const divisionStats = [
    { division: "Division A", count: 124 },
    { division: "Division B", count: 96 },
    { division: "Division C", count: 87 },
    { division: "Division D", count: 104 },
  ];

  return (
    <div className="p-6 space-y-6 dark:bg-navy-700">
      {/* Metric Cards */}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => (
          <div key={idx} className="p-4 bg-white dark:bg-navy-900 shadow rounded-xl flex items-center gap-4">
            <div className="text-xl text-purple-600 ">{card.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <h2 className="text-2xl font-bold">{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-navy-900 dark:text-white p-4 rounded-xl shadow">
          <h3 className="mb-2 font-semibold text-lg ">Service vs Complaint Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="serviceRequests" fill="#6a5acd" />
              <Line type="monotone" dataKey="complaints" stroke="#f97316" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 dark:bg-navy-900 dark:text-white rounded-xl shadow">
          <h3 className="mb-2 font-semibold text-lg">Requests by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="category"
                outerRadius={80}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"][index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-navy-900 dark:text-white  p-4 rounded-xl shadow">
          <h3 className="mb-2 font-semibold text-lg">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="gender"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                label
              >
                {genderData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#8e44ad", "#3498db"][index % 2]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-navy-900 dark:text-white  p-4 rounded-xl shadow">
          <h3 className="mb-2 font-semibold text-lg">Daily Request Traffic</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyRequestData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="requests" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Division & Monthly Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-navy-900 dark:text-white  p-4 rounded-xl shadow">
          <h3 className="mb-2 font-semibold text-lg">Requests by Division</h3>
          {divisionStats.map((item, idx) => (
            <div key={idx} className="flex justify-between border-b py-2">
              <span>{item.division}</span>
              <span className="font-semibold">{item.count}</span>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow">
          <h3 className="text-sm">Requests this Month</h3>
          <h1 className="text-4xl font-bold">3,240</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

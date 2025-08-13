import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { Doughnut,Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

import {
  BarChart,
  LineChart,
  Line,
  ComposedChart,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Label,
  Bar,
} from "recharts";

import loading_gif from "../../../../assets/gif/loading-gif.gif";

ChartJS.register(ArcElement, ChartTooltip, Legend);
dayjs.extend(isoWeek);

const Dashboard = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 15,
          boxHeight: 15,
          usePointStyle: true,
          pointStyle: "circle",
          color: "#374151",
        },
      },
    },
  };

  const [newsCategoryData, setNewsCategoryData] = useState(null);

  const categoryMap = {
    GOVERNMENT_ANNOUNCEMENT: "Government Announcement",
    INFRASTRUCTURE_MAINTENANCE: "Infrastructure & Maintenance",
    HEALTH_SAFETY: "Health & Safety",
    ELECTION: "Election & Participation",
    ENVIRONMENT_CLEANLINESS: "Environment & Cleanliness",
    CULTURAL_EVENTS: "Cultural & Community Events",
    PUBLIC_SERVICE: "Public Service Info",
    EMERGENCY: "Emergency Alert",
    JOBS_APPOINTMENTS: "Jobs & Appointments",
    PUBLIC_NOTICE: "Public Notice / Lost & Found",
    OTHERS: "Others"
  };

  useEffect(() => {
    fetch("https://city-news-alert-backend-new.onrender.com/api/news/get-all")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.records) {
          const categoryCount = {};

          data.data.records.forEach((item) => {
            const mappedCategory =
              categoryMap[item.category] || item.category || "Unknown";
            categoryCount[mappedCategory] =
              (categoryCount[mappedCategory] || 0) + 1;
          });

          setNewsCategoryData({
            labels: Object.keys(categoryCount),
            datasets: [
              {
                label: "News Count",
                data: Object.values(categoryCount),
                backgroundColor: [
                  "#4B77BE",
                  "#E74C3C",
                  "#F39C12",
                  "#1ABC9C",
                  "#8E44AD",
                  "#3498DB",
                  "#27AE60",
                  "#D35400",
                  "#C0392B",
                  "#16A085",
                  "#7F8C8D",
                  "#2ECC71"
                ],
                borderWidth: 1
              }
            ]
          });
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const [monthlyData, setMonthlyData] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      serviceRequests: 0,
    }))
  );

   const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("https://auth-backend-2-k3ph.onrender.com/api/auth/get-count/citizen")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data !== undefined) {
          animateCount(data.data);
        }
      })
      .catch((err) => console.error("Error fetching citizen count:", err));
  }, []);

  const animateCount = (target) => {
    let start = 0;
    const duration = 1500; 
    const stepTime = 20; 
    const increment = target / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(Math.floor(start));
    }, stepTime);
  };
  const [weeklyRequestData, setWeeklyRequestData] = useState([]);
  const [requestCount, setRequestCount] = useState(0);
  const [repeatComplaints, setRepeatComplaints] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_UTILITY_URL}/api/services/request/all`
        );
        const serviceRequests = res.data?.data || [];

        const monthlyCounts = Array(12).fill(0);
        serviceRequests.forEach((item) => {
          if (item.date) {
            const monthIndex = new Date(item.date).getMonth();
            if (!isNaN(monthIndex)) {
              monthlyCounts[monthIndex]++;
            }
          }
        });

        const finalData = monthlyCounts.map((count, i) => ({
          month: new Date(0, i).toLocaleString("default", { month: "short" }),
          serviceRequests: count,
        }));

        setMonthlyData(finalData);
      } catch (err) {
        console.error("Error loading service data", err);
      }
    };

    const fetchWeeklyRequests = async () => {
      try {
        const res = await axios.get(
          "https://utility-booking-backend.onrender.com/api/services/request/all"
        );
        const requests = res.data.data;

        const startOfWeek = dayjs().startOf("isoWeek");
        const endOfWeek = dayjs().endOf("isoWeek");

        const weekDays = Array.from({ length: 7 }, (_, i) => {
          const day = startOfWeek.add(i, "day");
          return {
            dayName: day.format("ddd"),
            date: day.format("YYYY-MM-DD"),
            count: 0,
          };
        });

        requests.forEach((req) => {
          const requestDate = dayjs(req.date).format("YYYY-MM-DD");
          const match = weekDays.find((day) => day.date === requestDate);
          if (match) match.count += 1;
        });

        const formattedData = weekDays.map((day) => ({
          day: day.dayName,
          date: day.date,
          requests: day.count,
        }));

        setWeeklyRequestData(formattedData);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    const fetchRequestCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_UTILITY_URL}/api/services/request/all`
        );
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const requests = response.data.data;

        const thisMonthRequests = requests.filter((item) => {
          if (!item.date) return false;
          const requestDate = new Date(item.date);
          return (
            requestDate.getMonth() === currentMonth &&
            requestDate.getFullYear() === currentYear
          );
        });

        setRequestCount(thisMonthRequests.length);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
    };

    const fetchRepeatComplaints = async () => {
      try {
        const res = await axios.get(
          "https://utility-booking-backend.onrender.com/api/services/request/all"
        );
        const requests = res.data.data;

        const complaintMap = {};

        requests.forEach((item) => {
          if (item.name && item.services) {
            const username = item.name.trim();
            const service = item.services.trim();

            if (!complaintMap[username]) {
              complaintMap[username] = {
                count: 0,
                services: new Set(),
              };
            }

            complaintMap[username].count += 1;
            complaintMap[username].services.add(service);
          }
        });

        const filtered = Object.entries(complaintMap)
          .filter(([_, val]) => val.count > 1)
          .map(([username, val]) => ({
            username,
            repeats: val.count,
            services: Array.from(val.services).join(", "),
          }));

        setRepeatComplaints(filtered);
      } catch (error) {
        console.error("Error fetching repeat complaints:", error);
      }
    };

    const fetchChartData = async () => {
      try {
        const res = await fetch("https://utility-booking-backend.onrender.com/api/staff/gender/count");
        const resData = await res.json();
        const genderData = resData.data || {};
        const maleCount = genderData.male || 0;
        const femaleCount = genderData.female || 0;

        setChartData({
          labels: ["Male", "Female"],
          datasets: [
            {
              data: [maleCount, femaleCount],
              backgroundColor: ["#3498db", "#e74c3c"],
              hoverBackgroundColor: ["#2980b9", "#c0392b"],
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching gender data:", err);
      }
    };

    const fetchOpportunities = async () => {
      try {
        const res = await fetch("https://job-application-service.onrender.com/api/work/jobs/active/count");
        const resData = await res.json();
        if (resData.success) {
          const apiData = resData.data;
          const chartData = [
            {
              type: "Total Active Opportunities",
              count: apiData.totalActiveOpportunities,
            },
            {
              type: "Volunteer Opportunities",
              count: apiData.totalActiveVolunteerOpportunities,
            },
            {
              type: "Job Opportunities",
              count: apiData.totalActiveJobOpportunities,
            },
          ];
          setData(chartData);
        } else {
          throw new Error("API returned success: false");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyData();
    fetchWeeklyRequests();
    fetchRequestCount();
    fetchRepeatComplaints();
    fetchChartData();
    fetchOpportunities();
  }, []);

  const isPageLoading =
    loading ||
    !chartData ||
    !data ||
    monthlyData.length === 0 ||
    weeklyRequestData.length === 0;

  if (isPageLoading) {
    return (
    <div className="fixed z-50 flex items-start justify-center w-full" style={{ top: '270px', left: '130px' }}>
  <img
    src={loading_gif}
    alt="Loading..."
    className="w-8 h-6 sm:w-10 sm:h-10"
  />
</div>
    );
  }

  return (
    <div className="p-6 space-y-6 dark:bg-navy-700 dark:text-white">
      {/* Monthly Service Trend */}
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
        <div className="bg-white dark:bg-navy-900 dark:text-white p-4 rounded-xl shadow">
          <h3 className="mb-2 font-semibold text-lg">Service Trend</h3>
          <ResponsiveContainer width="100%" height={420}>
            <ComposedChart data={monthlyData}>
              <XAxis dataKey="month">
                <Label value="Month" offset={0} position="insideBottom" />
              </XAxis>
              <YAxis>
                <Label
                  value="Number of Requests"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip />
              <Bar dataKey="serviceRequests" fill="#6a5acd" />
              <Line type="monotone" dataKey="complaints" stroke="#f97316" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

  <div className="bg-white dark:bg-navy-900 dark:text-white p-4 rounded-xl shadow">
  <h3 className="mb-4 font-semibold text-lg">City News Distribution by Category</h3>
  {newsCategoryData ? (
    <div className="flex items-center justify-center gap-6 flex-wrap">
      <div style={{ height: "270px", width: "250px" }}>
        <Pie
          data={newsCategoryData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        {newsCategoryData.labels.map((label, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              style={{
                backgroundColor:
                  newsCategoryData.datasets[0].backgroundColor[index],
                width: "12px",
                height: "12px",
                display: "inline-block",
                borderRadius: "2px"
              }}
            ></span>
            <span className="text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p>Loading chart...</p>
  )}
</div>

  <div className="bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-700 dark:to-purple-800 text-white p-6 rounded-xl">
  <h3 className="mb-4 font-semibold text-lg">Active Citizen Registration</h3>
  <div className="flex flex-col items-center justify-center">
    <div className="p-5 bg-white/20 rounded-full mb-4 shadow-lg">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-8 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.732 6.879 1.978M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    </div>
    <p className="text-4xl font-bold">{count}</p>
    <p className="text-white/80 text-xs mt-1 text-center">Active registered citizens</p>
  </div>
</div>
</div>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Active Opportunities */}
          <div className="bg-white dark:bg-navy-900 dark:text-white p-4 rounded-xl shadow h-[300px]">
            <h3 className="mb-2 font-semibold text-lg">Active Opportunities Summary</h3>
            <ResponsiveContainer width="100%" height={data.length * 60}>
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 45, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number">
                  <Label value="Count" offset={-1} position="insideBottom" />
                </XAxis>
                <YAxis
                  dataKey="type"
                  type="category"
                  width={180}
                  tick={{ fontSize: 14 }}
                  interval={0}>
                  <Label
                    value="Opportunity Type"
                    offset={-5}
                    angle={-90}
                    dy={70} 
                    position="insideLeft"/>
                </YAxis>
                <Tooltip
                  formatter={(value) => [`${value} opportunities`, "Count"]}/>
                <Bar dataKey="count" fill="#6366f1" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-navy-900 dark:text-white p-4 rounded-xl shadow">
            <h3 className="mb-4 font-semibold text-lg">Repeat Complaints by User</h3>
            {repeatComplaints.length === 0 ? (
              <p className="text-gray-500">No repeated complaints found.</p>
            ) : (
              <div
                style={{
                  height: `${Math.max(repeatComplaints.length * 80, 300)}px`,
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={repeatComplaints}
                    margin={{ top: 10, right: 30, left: 30, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      type="number"
                      domain={[0, 50]}
                      tickCount={11}
                      tick={{ fontSize: 12, fill: "#fff" }}
                      axisLine={{ stroke: "#ccc" }}
                      tickLine={false}
                    >
                      <Label
                        value="Number of Repeats"
                        position="insideBottom"
                        offset={-2}
                        style={{ fontSize: 14 }}
                      />
                    </XAxis>

                    <YAxis
                      dataKey="username"
                      type="category"
                      tickFormatter={() => "👤"}
                      width={30}
                      tick={{ fontSize: 18, fill: "#fff" }}
                      tickLine={false}
                    ></YAxis>

                    <Tooltip
                      formatter={(value, name) => [
                        `${value}`,
                        name === "repeats"
                          ? "Repeated Complaints"
                          : name,
                      ]}
                      labelFormatter={(label) => {
                        const item = repeatComplaints.find(
                          (d) => d.username === label
                        );
                        return (
                          <div
                            style={{
                              maxWidth: "250px",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                              lineHeight: "1.4",
                            }}
                          >
                            <strong>👤 {item?.username}</strong>
                            <br />
                            🛠️ <span>{item?.services}</span>
                          </div>
                        );
                      }}
                    />

                    <Bar
                      dataKey="repeats"
                      fill="#8b5cf6"
                      name="Repeats"
                      barSize={30}
                      radius={[5, 5, 5, 5]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-navy-900 dark:text-white p-4 rounded-xl shadow">
            <h3 className="mb-4 font-semibold text-lg">
              Staff Gender Distribution
            </h3>
            <div className="flex justify-center items-center">
              <div className="w-[220px] h-[270px]">
                <Doughnut data={chartData} options={options} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Request Traffic Card */}
        <div className="bg-white dark:bg-navy-900 dark:text-white p-4 rounded-xl shadow h-full">
          <h3 className="mb-2 font-semibold text-lg">Weekly Request Traffic</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="89%">
              <LineChart data={weeklyRequestData}>
                <XAxis dataKey="day">
                  <Label
                    value="Day of Week"
                    position="bottom"
                    offset={-5}
                    style={{ fontSize: 12 }}
                  />
                </XAxis>
                <YAxis>
                  <Label
                    value="Number of Requests"
                    angle={-90}
                    position="insideLeft"
                    offset={2}
                    style={{ fontSize: 12 }}/>
                </YAxis>
                <Tooltip
                  formatter={(value) => [`${value} requests`]}
                  labelFormatter={(label, payload) => {
                    const date = payload?.[0]?.payload?.date;
                    return `${label} (${date})`;
                  }}
                />
                <Line type="monotone" dataKey="requests" stroke="#6366f1" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests this Month Card */}
        <div className="bg-white dark:bg-navy-900 dark:text-white p-4 rounded-xl shadow h-full flex flex-col ">
          <h3 className="mb-2 font-semibold text-lg">Requests this Month</h3>
          <h1 className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            {requestCount}
          </h1>
          
          <p className="text-sm text-gray-700 dark:text-gray-400 mt-4">
  Total number of service requests received during the current month.
</p>
<div className="flex items-center space-x-3 mt-3">
  <div className="bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-full px-3 py-1 text-xs font-medium">
    Updated: {new Date().toLocaleDateString()}
  </div>
  <div className="text-sm text-black-600 dark:text-gray-300">
    Last 30 days data overview.
  </div>
</div>
</div>
        </div>
      </div>
  );
};
export default Dashboard;

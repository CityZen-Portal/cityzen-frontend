//analytics

import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { Doughnut } from "react-chartjs-2";
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

ChartJS.register(ArcElement, ChartTooltip, Legend);
dayjs.extend(isoWeek);


const Dashboard = () => {
  
const chartData = {
  labels: ["Male", "Female", "Other"],
  datasets: [
    {
      label: "Gender",
      data: [50, 40, 5],
      backgroundColor: ["#3b82f6", "#ec4899", "#10b981"], 
      borderColor: "#ffffff",
      borderWidth: 1,
    },
  ],
};

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


 const districtRequestData = [
  { division: "Coimbatore North", count: 80 },
  { division: "Coimbatore South", count: 95 },
  { division: "Pollachi", count: 40 },
  { division: "Mettupalayam", count: 25 },
  { division: "Sulur", count: 30 },
];


  const [monthlyData, setMonthlyData] = useState(
    Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      serviceRequests: 0,
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, []);


const [weeklyRequestData, setWeeklyRequestData] = useState([]);

useEffect(() => {
  const fetchWeeklyRequests = async () => {
    try {
      const res = await axios.get("https://utility-booking-backend.onrender.com/api/services/request/all");
      const requests = res.data.data;

      const startOfWeek = dayjs().startOf("isoWeek");
      const endOfWeek = dayjs().endOf("isoWeek");

      const weekDays = Array.from({ length: 7 }, (_, i) => {
        const day = startOfWeek.add(i, "day");
        return {
          dayName: day.format("ddd"),      
          date: day.format("YYYY-MM-DD"), 
          count: 0
        };
      });

      requests.forEach((req) => {
        const requestDate = dayjs(req.date).format("YYYY-MM-DD");
        const match = weekDays.find(day => day.date === requestDate);
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

  fetchWeeklyRequests();
}, []);


  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
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

    fetchRequestCount();
  }, []);

const [repeatComplaints, setRepeatComplaints] = useState([]);

useEffect(() => {
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
              services: new Set()
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
          services: Array.from(val.services).join(", ") 
        }));

      setRepeatComplaints(filtered);
    } catch (error) {
      console.error("Error fetching repeat complaints:", error);
    }
  };

  fetchRepeatComplaints();
}, []);


  return (
    <div className="p-6 space-y-6 dark:bg-navy-700 dark:text-white">
  
      {/* Monthly Service Trend */}
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
        <div className="bg-white dark:bg-navy-900 dark:text-white p-4 rounded-xl shadow">
          <h3 className="mb-2 font-semibold text-lg">
            Service Trend
          </h3>
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

<div className="grid grid-cols-1 md:grid-cols-1 gap-6">
      {/* Requests by heatmaps & Repeated complaints */}
        <div className="bg-white dark:bg-navy-900 dark:text-white p-4 rounded-xl shadow">
      <h3 className="mb-2 font-semibold text-lg">Requests Heatmap by Coimbatore Divisions</h3>
      <ResponsiveContainer width="100%" height={districtRequestData.length * 45}>
        <BarChart
          data={districtRequestData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number">
            <Label value="Requests" offset={-2} position="insideBottom" />
          </XAxis>
          <YAxis
            dataKey="division"
            type="category"
            width={100}
            interval={0}
            tick={{ fontSize: 14 }}
          >
            <Label
              value="Divisions"
              offset={-88}
              angle={-90}
              position="insideLeft"
            />
          </YAxis>
          <Tooltip formatter={(value) => [`${value} requests`, "Requests"]} />
          <Bar dataKey="count" fill="#6366f1" barSize={25} />
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
  tick={{ fontSize: 12, fill: '#fff' }}
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
  tick={{ fontSize: 18, fill: '#fff' }} 
  tickLine={false}
>

</YAxis>


          <Tooltip
  formatter={(value, name) => [`${value}`, name === "repeats" ? "Repeated Complaints" : name]}
  labelFormatter={(label) => {
    const item = repeatComplaints.find((d) => d.username === label);
    return (
      <div style={{
        maxWidth: "250px",
        whiteSpace: "normal",
        wordWrap: "break-word",
        overflowWrap: "break-word",
        lineHeight: "1.4"
      }}>
        <strong>👤 {item?.username}</strong><br />
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
      <h3 className="mb-4 font-semibold text-lg">Gender Distribution</h3>
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
       <XAxis dataKey="day" >
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
              style={{ fontSize: 12 }}
            />
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
    <p className="mt-2">
      Includes all utility service requests submitted by citizens through the SmartCitizen Portal during{" "}
      {new Date().toLocaleString("default", { month: "long" })}.
    </p>
  </div>
</div>
    </div>
  );
};

export default Dashboard;

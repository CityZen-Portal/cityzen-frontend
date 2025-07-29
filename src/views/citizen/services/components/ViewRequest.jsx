import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ViewRequest() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem("id");

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://utility-booking-backend.onrender.com/api/services/request/citizen/${id}`
        );
        console.log("API Response:", response.data);
        if (response.data?.data?.length > 0) {
          setUserData(response.data.data); 
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      fetchData();
    }
  }, []);

  return (
    <div className="p-6">
      <h2 className="mb-8 text-center text-3xl font-bold text-blue-600">
        Your Service Requests
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userData.length > 0 ? (
          userData.map((item, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-navy-900 dark:bg-navy-700 dark:text-white"
            >
              <h3 className="mb-2 text-xl font-semibold text-blue-500">
                {item.services}
              </h3>
              <p>
                <span className="font-medium">Name:</span> {item.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {item.email || "N/A"}
              </p>
              <p>
                <span className="font-medium">Date:</span> {item.date || "N/A"}
              </p>
              <p>
                <span className="font-medium">Time:</span> {item.time || "N/A"}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="text-yellow-600">Requested</span>
              </p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No requests found.
          </p>
        )}
      </div>
    </div>
  );
}

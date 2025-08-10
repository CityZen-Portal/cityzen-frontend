import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MdBuild,
  MdPerson,
  MdEmail,
  MdDateRange,
  MdAccessTime,
  MdPendingActions,
} from "react-icons/md";

export default function ViewRequest() {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const id = localStorage.getItem("id");

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://utility-booking-backend.onrender.com/api/services/request/citizen/${id}`
        );
        // console.log("API Response:", response.data);

        if (response.data?.data?.length > 0) {
          const shownRequests = response.data.data.filter(
            (req) => req.show === false
          );
          setUserData(shownRequests);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      fetchData();
    }
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(userData.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = userData.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-6">
      <h2 className="mb-8 text-center text-3xl font-bold text-blue-600">
        Your Service Requests
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentItems.length > 0 ? (
          currentItems.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-navy-900 dark:bg-navy-700 dark:text-white"
            >
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-blue-500">
                <MdBuild className="text-2xl text-blue-500" /> {item.services}
              </h3>

              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MdPerson className="text-pink-500" /> {item.name || "N/A"}
              </p>

              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MdEmail className="text-green-500" /> {item.email || "N/A"}
              </p>

              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MdDateRange className="text-orange-500" /> {item.date || "N/A"}
              </p>

              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MdAccessTime className="text-purple-500" />{" "}
                {item.time || "N/A"}
              </p>

              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MdPendingActions className="text-yellow-500" />
                <span className="font-medium text-yellow-600">Requested</span>
              </p>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No requests found.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded px-3 py-1 ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="rounded bg-gray-200 px-3 py-1 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

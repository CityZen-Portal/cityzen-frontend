import React, { useEffect, useState } from "react";
import img1 from "../../../../assets/img/service/govimg-4.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ViewRequest from "./ViewRequest";

function Servicelist() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://utility-booking-backend.onrender.com/api/service/all"
        );
        setList(response.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(list.length / itemsPerPage);

  return (
    <>
      <div
        className="border-r-lg border bg-cover bg-center dark:border-navy-900 md:h-72"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <h1 className="flex items-center justify-center pt-6 text-4xl font-bold text-white">
          Services
        </h1>
        <p className="text-center text-sm text-white md:pe-14 md:ps-14 md:pt-4 md:text-lg">
          Municipality services include water supply, waste management, road
          maintenance, street lighting, sanitation, public health, and
          infrastructure development—ensuring essential civic amenities and
          improving the quality of life in urban and rural areas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-3 md:grid-cols-2 md:p-10">
        {loading
          ? [...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="border-r-lg mt-6 animate-pulse overflow-hidden rounded border bg-white shadow-lg dark:border-navy-900 dark:bg-navy-700 dark:text-white md:max-w-lg"
              >
                <div className="h-60 w-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="px-6 py-4">
                  <div className="mx-auto mb-2 h-6 w-2/3 bg-gray-300 dark:bg-gray-600"></div>
                </div>
                <div className="flex justify-center pb-4">
                  <div className="h-10 w-32 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                </div>
              </div>
            ))
          : currentItems.map((item, index) => (
              <div
                key={index}
                className="border-r-lg mt-6 overflow-hidden rounded border bg-white shadow-lg dark:border-navy-900 dark:bg-navy-700 dark:text-white md:max-w-lg"
              >
                <img
                  src={item.imagePath}
                  alt={item.imageName}
                  className="h-60 w-full transform object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="px-6 py-4">
                  <div className="flex justify-center text-xl font-bold">
                    {item.serviceName}
                  </div>
                </div>
                <div className="flex justify-center pb-4">
                  <button
                    onClick={() =>
                      navigate(`/citizen/Services/form/${item.serviceName}`, {
                        state: { nameOfService: item.nameOfService },
                      })
                    }
                    className="rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                  >
                    Get service
                  </button>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination controls */}
      {!loading && totalPages > 1 && (
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

      <ViewRequest />
    </>
  );
}

export default Servicelist;

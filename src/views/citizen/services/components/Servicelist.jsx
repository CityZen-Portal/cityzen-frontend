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
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);console.log(currentItems[0]?.imagePath);
  const totalPages = Math.ceil(list.length / itemsPerPage);

  return (
    <>
<div className="relative md:h-72 w-full overflow-hidden">
  {/* Background Image */}
  <img
    src={img1}
    alt="Background"
    className="w-full h-full object-cover absolute inset-0 z-0"
  />

  {/* Colorful Gradient Overlay (gives depth & style) */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#243a6c] via-[#4078c1] to-[#244357] opacity-80 mix-blend-multiply z-10"></div>

  {/* Extra Dark Overlay for strong contrast */}
  <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>

  {/* Text Content */}
  <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
    <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] mb-3 text-white bg-gradient-to-r from-[#fff] to-[#92c7f7] bg-clip-text text-transparent">
      Services
    </h1>
    <p className="max-w-3xl text-base md:text-lg font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] leading-relaxed text-white backdrop-blur-sm p-4 rounded-lg bg-black/30 shadow-lg">
      Municipality services include water supply, waste management, road maintenance,
      street lighting, sanitation, public health, and infrastructure development —
      ensuring essential civic amenities and improving the quality of life in urban and rural areas.
    </p>
  </div>
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
                        state: { nameOfService: item.nameOfService,
                           imagePath: item.imagePath,

                         },
                       
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

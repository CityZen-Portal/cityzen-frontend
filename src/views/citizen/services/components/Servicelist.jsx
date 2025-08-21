import React, { useEffect, useState } from "react";
import img1 from "../../../../assets/img/service/Picture1.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ViewRequest from "./ViewRequest";
import ErrorAnimation1 from "../../../../components/error/ErrorAnimation1"

function Servicelist() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(list.length / itemsPerPage);

  return (
    <>
      <div className="relative md:h-72 w-full overflow-hidden">
        <img
          src={img1}
          alt="Background"
          className="w-full h-full object-cover absolute inset-0 z-0 transform scale-105 transition-transform duration-700 hover:scale-110"
        />
      </div>

      {error && !loading ? (
        <div className="flex justify-center items-center p-6">
          <ErrorAnimation1 />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
            {loading &&
              [...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-200 dark:border-navy-900 bg-white dark:bg-navy-700 shadow-lg animate-pulse"
                >
                  <div className="h-48 w-full bg-gray-300 dark:bg-gray-600 rounded-t-xl"></div>
                  <div className="px-6 py-4">
                    <div className="h-6 w-2/3 bg-gray-300 dark:bg-gray-600 mb-3 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="flex justify-center pb-4">
                    <div className="h-10 w-32 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  </div>
                </div>
              ))}

            {!loading &&
              currentItems.length > 0 &&
              currentItems.map((item, index) => (
                <div
                  key={index}
                  className="group relative rounded-xl border border-gray-200 dark:border-navy-900 bg-white dark:bg-navy-700 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={item.imagePath}
                      alt={item.imageName}
                      className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="px-6 py-4">
                    <div className="text-center text-lg font-bold text-gray-800 dark:text-white">
                      {item.serviceName}
                    </div>
                  </div>
                  <div className="flex justify-center pb-4">
                    <button
                      onClick={() =>
                        navigate(`/citizen/Services/form/${item.serviceName}`, {
                          state: {
                            nameOfService: item.nameOfService,
                            imagePath: item.imagePath,
                          },
                        })
                      }
                      className="rounded-full bg-blue-500 px-6 py-2 font-semibold text-white shadow-md hover:bg-blue-600 hover:shadow-lg transition-all duration-300"
                    >
                      Get Service
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {!loading && totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`rounded-lg px-4 py-2 transition ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white shadow-md"
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
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}

          <ViewRequest />
        </>
      )}
    </>
  );
}

export default Servicelist;

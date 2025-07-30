import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewsCard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          "https://city-news-alert-backend-new.onrender.com/api/news/get-all"
        );
        setData(response.data.data.records);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNews();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-navy-700 dark:text-white">
      {data.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">
          Loading news...
        </p>
      ) : (
        <>
          {/* News Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {paginatedData.map((news, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow-lg transition-transform hover:scale-105 dark:bg-navy-900 dark:text-white"
              >
                <img
                  src={news.imagePath}
                  alt={news.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                    {news.title}
                  </h2>
                  <button
                    onClick={() =>
                      navigate(
                        `/citizen/newsupdate/newsdetails/${encodeURIComponent(
                          news.id
                        )}`,
                        {
                          state: news,
                        }
                      )
                    }
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Read more →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-8 flex justify-center items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border text-gray-700 dark:text-white"
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
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

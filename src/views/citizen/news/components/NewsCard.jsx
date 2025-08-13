import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NewsCardSkeleton from "components/placeholder/NewsCardSkeleton";
import ErrorAnimation from "../../../../components/error/index";
export default function NewsCard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const itemsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "https://city-news-alert-backend-new.onrender.com/api/news/get-all"
        );
        const records = response.data.data.records || [];
         records.sort((a, b) => {
        if (a.breaking === b.breaking) return 0;
        return a.breaking ? -1 : 1;
      });
        setData(records);
        setFilteredData(records); 
      } catch (err) {
        console.log(err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    if (categoryFilter === "ALL") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((item) => item.category === categoryFilter));
    }
    setCurrentPage(1); 
  }, [categoryFilter, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = ["ALL", ...new Set(data.map((item) => item.category))];

  return (
    <div className="bg-gray-50 p-8 dark:bg-navy-700 dark:text-white">
      <div className="mb-6 flex justify-end">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-3 py-2 rounded-md dark:bg-navy-900"
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <NewsCardSkeleton key={index} />
          ))}
        </div>
      )}

      {error && !loading && (
        <ErrorAnimation/>
      )}

      {!loading && !error && filteredData.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {paginatedData.map((news, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow-lg transition-transform hover:scale-105 dark:bg-navy-900 dark:text-white"
              >
                <img
                  src={news.imagePath[0]}
                  alt={news.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4">
                  {/* {news.breaking && (
              <span className="inline-block bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
                🔥 Important
              </span>
            )} */}
                  <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                    {news.title}
                  </h2>
                  <button
                    onClick={() =>
                      navigate(
                        `/citizen/newsupdate/newsdetails/${encodeURIComponent(news.id)}`,
                        { state: news }
                      )
                    }
                    className="font-medium text-blue-600 hover:underline dark:text-cyan-500"
                  >
                    Read more →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
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
          )}
        </>
      )}
    </div>
  );
}

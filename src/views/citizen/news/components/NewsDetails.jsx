import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await axios.get(
          `https://city-news-alert-backend-new.onrender.com/api/news/${id}`
        );
        setNewsItem(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsData();
  }, [id]);

  function formatDate(isoString) {
    const date = new Date(isoString);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-IN", options);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-navy-900 px-4">
        <div className="w-full max-w-2xl animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
        <h2 className="text-2xl font-bold text-red-600">News Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 underline hover:text-blue-800 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 px-4 py-10 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto bg-white dark:bg-navy-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-blue-600 hover:underline hover:text-blue-800 text-sm transition"
          >
            ← Back to News
          </button>

          {newsItem.imagePath && (
            <div className="mb-6">
              <img
                src={newsItem.imagePath}
                alt={newsItem.title}
                className="w-full h-64 sm:h-96 object-cover rounded-xl shadow-md"
              />
            </div>
          )}

          <div className="flex flex-wrap justify-between items-center mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Published: {formatDate(newsItem.created_date)}
            </span>
            {newsItem.breaking && (
              <span className="inline-block bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
                🔥 Breaking News
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white mb-4 leading-tight">
            {newsItem.title}
          </h1>

          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
            {newsItem.description}
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none text-base leading-relaxed">
            <p>{newsItem.content}</p>
          </div>

          {newsItem.location && (
            <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              📍 Location: {newsItem.location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

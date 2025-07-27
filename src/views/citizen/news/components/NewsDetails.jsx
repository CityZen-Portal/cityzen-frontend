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
          `https://city-news-alert-backend.onrender.com/api/news/${id}`
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
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 text-gray-800 dark:text-white px-4 py-10">
      <div className="max-w-3xl mx-auto shadow-lg bg-white dark:bg-navy-800 rounded-2xl p-6 sm:p-10 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline hover:text-blue-800 transition text-sm"
        >
          ← Back to News
        </button>
        <img
          src={`https://media-api-service-hzx2.onrender.com/${newsItem.imagePath}`}
          alt={newsItem.title}
          className="w-full max-h-96 object-cover rounded-xl shadow"
        />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white">
          {newsItem.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
          {newsItem.description}
        </p>
        <div className="text-base leading-relaxed text-gray-700 dark:text-gray-200">
          {newsItem.content}
        </div>
      </div>
    </div>
  );
}

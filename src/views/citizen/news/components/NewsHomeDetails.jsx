import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import image from "../../../../assets/img/news/image.png"
const TEMP_IMAGE_URL = image;

const NewsHomeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let newsItem = location.state;

  if (!newsItem) {
    const saved = localStorage.getItem("currentNewsDetail");
    if (saved) newsItem = JSON.parse(saved);
  }

  if (!newsItem) {
    return (
      <div className="p-8">
        <p>News details not found. Please go back to the news list.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 border rounded"
        >
          Back
        </button>
      </div>
    );
  }

  const handleBack = () => {
    localStorage.removeItem("currentNewsDetail");
    navigate(-1);
  };

  const formatDate = (isoString) => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 px-4 py-10 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto bg-white dark:bg-navy-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <button
            onClick={handleBack}
            className="mb-4 dark:text-cyan-500 text-blue-600 hover:underline hover:text-blue-800 text-sm transition"
          >
            ← Back to News
          </button>

          <div className="mb-6">
            <img
              src={newsItem.urlToImage || TEMP_IMAGE_URL}
              alt={newsItem.title}
              className="w-full h-64 sm:h-96 object-cover rounded-xl shadow-md"
              onError={e => {
                e.target.onerror = null; // Prevents infinite fallback loop
                e.target.src = TEMP_IMAGE_URL;
              }}
            />
          </div>

          <div className="flex flex-wrap justify-between items-center mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Published: {formatDate(newsItem.publishedAt)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white mb-4 leading-tight">
            {newsItem.title}
          </h1>

          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
            {newsItem.description}
          </p>

          <div className="mt-8 border-t pt-6 text-base text-gray-600 dark:text-gray-300">
            <h2 className="text-xl font-semibold mb-2">More Detailed Content</h2>
            <p>
              For more information, visit the original article:{" "}
              <a
                href={newsItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-cyan-500 "
              >
                Read Full Article
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsHomeDetails;

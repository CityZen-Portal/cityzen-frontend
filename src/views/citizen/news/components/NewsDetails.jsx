import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await axios.get(
          `https://city-news-alert-backend-new.onrender.com/api/news/${id}`
        );
        setNewsItem(response.data.data);
        setCurrentImageIndex(0);
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

  const images = Array.isArray(newsItem.imagePath) ? newsItem.imagePath : [newsItem.imagePath];

  const prevImage = () => {
    setCurrentImageIndex((idx) => (idx === 0 ? images.length - 1 : idx - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((idx) => (idx === images.length - 1 ? 0 : idx + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900 px-4 py-10 text-gray-800 dark:text-white">
      <div className="max-w-4xl mx-auto bg-white dark:bg-navy-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-blue-600 hover:underline dark:text-cyan-500 hover:text-blue-800 text-sm transition"
          >
            ← Back to News
          </button>

          {images.length > 0 && (
            <div className="mb-6 relative">
              <img
                src={images[currentImageIndex]}
                alt={newsItem.title}
                className="w-full h-64 sm:h-96 object-cover rounded-xl shadow-md"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute top-1/2 text-white text-8xl left-2 transform -translate-y-1/2 bg-black bg-opacity-30  rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-50 transition"
                    aria-label="Previous Image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute top-1/2 text-8xl right-2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-50 transition"
                    aria-label="Next Image"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 space-x-2 flex">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-between items-center mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Published: {formatDate(newsItem.created_date)}
            </span>
            {/* {newsItem.breaking && (
              <span className="inline-block bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full dark:bg-red-900/30 dark:text-red-400">
                🔥 Breaking News
              </span>
            )} */}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white mb-4 leading-tight">
            {newsItem.title}
          </h1>

          <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
            {newsItem.description}
          </p>

          <div className="prose prose-gray dark:prose-invert max-w-none text-base leading-relaxed">
            <p dangerouslySetInnerHTML={{ __html: newsItem.content }}></p>
          </div>

          {newsItem.location && (
            <div className="mt-6  text-gray-500 dark:text-white-700 text-md"> Location: <span className="">{newsItem.location}</span></div>
          )}
        </div>
      </div>
    </div>
  );
}

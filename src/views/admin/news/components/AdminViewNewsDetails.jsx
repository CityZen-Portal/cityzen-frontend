import React, { useState, useEffect } from 'react';
import Card from 'components/card';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdNotifications, MdZoomIn } from 'react-icons/md';
import axios from 'axios';

const AdminViewNewsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    axios
      .get(`https://city-news-alert-backend-new.onrender.com/api/news/${id}`)
      .then((res) => {
        setNews(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/admin/news");
      });
  }, [id, navigate]);

  function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  }

  if (loading) {
    return (
      <div className="flex w-full min-h-[300px] flex-col items-center justify-center">
        <Card extra="w-full max-w-3xl p-6 shadow-xl rounded-2xl bg-white dark:bg-navy-700">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-2/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!news) return null;

  return (
    <div className="flex w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
      <Card extra="w-full max-w-3xl p-6 sm:p-8 shadow-xl rounded-2xl bg-white dark:bg-navy-700">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-md font-medium text-blue-500 dark:text-cyan-600 hover:text-blue-600"
        >
          <MdArrowBack /> Back
        </button>
        <h1 className="mb-3 text-3xl font-bold text-navy-700 dark:text-white leading-snug">
          {news.title}
        </h1>
        <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
          {news.breaking && (
            <span className="flex items-center rounded-full bg-red-100 px-3 py-1 font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
              <MdNotifications className="mr-1 h-4 w-4" /> Breaking
            </span>
          )}
          <span className="font-medium">{formatDate(news.created_date)}</span>
          {news.location && <span className="font-medium">📍 {news.location}</span>}
        </div>
        <div className="mb-6 text-sm">
          <span className="font-semibold text-navy-700 dark:text-white">Category:</span>{" "}
          <span className="text-gray-700 dark:text-gray-300">
            {news.category_name ? news.category_name : news.category}
          </span>
        </div>
        {news.imagePath && news.imagePath.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-navy-700 dark:text-white">Images</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {news.imagePath.map((img, i) => (
                <div key={i} className="relative group flex items-center justify-center">
                  <img
                    src={img}
                    alt={`news-img-${i}`}
                    className="w-full h-56 object-cover rounded-lg shadow-md transition-transform duration-200 group-hover:scale-105 cursor-pointer"
                    onClick={() => setPreviewImage(img)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-lg text-white transition-opacity duration-200">
                    <MdZoomIn className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-navy-700 dark:text-white">Content</h3>
          <div
            className="prose max-w-none dark:prose-invert text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </Card>
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative p-4">
            <img src={previewImage} alt="Preview" className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 text-white text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminViewNewsDetails;

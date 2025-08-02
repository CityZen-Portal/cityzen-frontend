import React, { useEffect, useState } from 'react';
import Card from 'components/card';
import { MdEdit, MdDelete, MdNotifications, MdAdd, MdRemoveRedEye } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Pagination from 'components/pagination';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const ViewNews = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteNews = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this news item?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://city-news-alert-backend-new.onrender.com/api/news/delete/${id}`);
      const updatedItems = newsData.filter(item => item.id !== id);
      setNewsData(updatedItems);
      toast.success('News Deleted successfully!');
    } catch (err) {
      console.log('Error deleting news item:', err);
      toast.error('Failed to delete the news item. Please try again.');
    }
  };

  const filteredNews = (newsData ?? []).filter(item => {
    if (activeTab === 'breaking') return item.breaking;
    return true;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date) - new Date(a.date);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);
  const paginatedNews = sortedNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const id=localStorage.getItem("id");
        const response = await axios.get(`https://city-news-alert-backend-new.onrender.com/api/news/author/${id}`);
        setNewsData(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsData();
  }, []);

  function formatDate(isoString) {
    const date = new Date(isoString);
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-IN', options);
  }

  const SkeletonRow = () => (
    <tr className="animate-pulse border-b border-gray-100 dark:border-white/5">
      <td className="py-3 px-4">
        <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="flex flex-col gap-5">
      <Card extra="p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">City News Feed</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Stay updated with the latest city announcements</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('../news/add')}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 dark:bg-brand-400 dark:hover:bg-brand-300"
            >
              <MdAdd className="h-4 w-4" /> Add News
            </button>
            <div className="flex rounded-lg bg-gray-100 dark:bg-navy-700">
              <button onClick={() => setActiveTab('all')} className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeTab === 'all' ? 'bg-brand-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}>All</button>
              <button onClick={() => setActiveTab('breaking')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'breaking' ? 'bg-brand-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}>Breaking</button>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-navy-700 dark:text-white"
            >
              <option value="newest">Newest First</option>
            </select>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-navy-700 dark:text-white"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={20}>20 per page</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 w-1/4">Title</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 w-1/3">Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : paginatedNews.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                    No news items available
                  </td>
                </tr>
              ) : (
                paginatedNews.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-navy-700/30">
                    <td className="py-3 px-4 w-3/4">
                      <div>
                        <h5 className="text-sm font-semibold text-navy-700 dark:text-white">{item.title}</h5>
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 line-clamp-1" dangerouslySetInnerHTML={{ __html: item.content }}></p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 w-1/3">
                      {formatDate(item.created_date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {item.breaking && (
                          <span className="flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            <MdNotifications className="mr-1 h-3 w-3" />Breaking
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {item.image && (
                          <button
                            onClick={() => {
                              setPreviewImage(item.image);
                              setShowPreview(true);
                            }}
                            className="rounded-full p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          >
                            <MdRemoveRedEye className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/staff/news/add/${item.id}`)}
                          className="rounded-full p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-navy-700"
                        >
                          <MdEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(item.id)}
                          className="rounded-full p-1 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <MdDelete className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </Card>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl">
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[80vh] rounded" />
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-2 right-2 text-gray-700 dark:text-white"
            >
              ✖
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default ViewNews;

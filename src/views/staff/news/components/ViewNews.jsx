import React, { useEffect, useState } from 'react';
import Card from 'components/card';
import { MdEdit, MdDelete, MdAdd, MdVisibility } from 'react-icons/md';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  const promptDeleteNews = (id) => {
    setNewsToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteNews = async () => {
    setShowDeleteModal(false);
    try {
      await axios.delete(`https://city-news-alert-backend-new.onrender.com/api/news/delete/${newsToDelete}`);
      const updatedItems = newsData.filter(item => item.id !== newsToDelete);
      setNewsData(updatedItems);
      toast.success('News Deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete the news item. Please try again.');
    }
    setNewsToDelete(null);
  };

  const filteredNews = (newsData ?? []).filter(item => {
    if (activeTab === 'breaking') return item.breaking;
    return true;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_date) - new Date(a.created_date);
    if (sortBy === 'oldest') return new Date(a.created_date) - new Date(b.created_date);
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
        const id = localStorage.getItem("id");
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
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleString('en-IN', options);
  }

  const SkeletonRow = () => (
    <tr className="animate-pulse border-b border-gray-100 dark:border-white/5">
      <td className="py-3 px-4"><div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div><div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div></td>
      <td className="py-3 px-4"><div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div></td>
      <td className="py-3 px-4"><div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div></td>
      <td className="py-3 px-4"><div className="flex gap-2"><div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div><div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div><div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div></div></td>
    </tr>
  );

  return (
    <div className="flex flex-col gap-5">
      <Card extra="p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white"> News / Update Feed</h4>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Stay updated with the latest city announcements</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('../news/add')}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              <MdAdd className="h-4 w-4" /> Add News
            </button>
            <div className="flex rounded-lg bg-gray-100 dark:bg-navy-700">
              <button onClick={() => setActiveTab('all')} className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeTab === 'all' ? 'bg-brand-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}>All</button>
              <button onClick={() => setActiveTab('breaking')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'breaking' ? 'bg-brand-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}>Breaking</button>
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-navy-700 dark:text-white">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-navy-700 dark:text-white">
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
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 w-[40%]">Title</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 w-[30%]">Content</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 w-[15%]">Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
                </>
              ) : paginatedNews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                    No news items available. You can add or edit news.
                  </td>
                </tr>
              ) : (
                paginatedNews.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-navy-700/30">
                    <td className="py-3 px-4 w-[40%] align-top">
                      <h5 className="text-sm font-semibold text-navy-700 dark:text-white break-words">{item.title}</h5>
                    </td>
                    <td className="py-5 px-4 w-[30%] max-w-[200px] text-sm text-gray-600 dark:text-gray-300 align-top overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.content.replace(/(<([^>]+)>)/gi, "")}
                    </td>
                    <td className="py-3 px-4 w-[15%] text-sm text-gray-600 dark:text-gray-400 align-top">{formatDate(item.created_date)}</td>
                    <td className="py-3 px-4 w-[15%] align-top">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/staff/news/view/${item.id}`)}
                          className="rounded-full p-1 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          aria-label="View News"
                        >
                          <MdVisibility className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/staff/news/add/${item.id}`)}
                          className="rounded-full p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-navy-700"
                          aria-label="Edit News"
                        >
                          <MdEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => promptDeleteNews(item.id)}
                          className="rounded-full p-1 text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                          aria-label="Delete News"
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

        {totalPages > 10 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
      </Card>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl">
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[80vh] rounded" />
            <button onClick={() => setShowPreview(false)} className="absolute top-2 right-2 text-gray-700 dark:text-white" aria-label="Close Preview">
              ✖
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
          <div className="bg-white dark:bg-navy-600 rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <h2 id="delete-modal-title" className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Are you sure you want to delete this news item?</p>
            <div className="flex justify-center gap-4">
              <button onClick={confirmDeleteNews} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">Yes, Delete</button>
              <button onClick={() => setShowDeleteModal(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default ViewNews;

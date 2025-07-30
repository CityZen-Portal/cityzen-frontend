import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewsHome() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(
                    "https://newsapi.org/v2/everything?q=Coimbatore&language=en&apiKey=fcfce62893e34a8faaf91490d1919e95"
                );

                const filteredAndSorted = response.data.articles
                    .filter(article => article.urlToImage) // remove if urlToImage is null
                    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)); // sort by date

                setData(filteredAndSorted);

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

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {paginatedData.map((news, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-2xl bg-white shadow-lg transition-transform hover:scale-105 dark:bg-navy-900 dark:text-white"
                            >
                                <img
                                    src={news.urlToImage}
                                    alt={news.title}
                                    className="h-48 w-full object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                                        {news.title}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            localStorage.setItem('currentNewsDetail', JSON.stringify(news));
                                            navigate('/citizen/newsupdate/newshomedetails');
                                        }}
                                     className="font-medium text-blue-600 hover:underline"
                                    >


                                    Read more →
                                </button>
                            </div>
                            </div>
                        ))}
                </div>


            <div className="mt-8 flex justify-center items-center space-x-2">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Previous
                </button>

                {(() => {
                    const pages = [];
                    const maxVisiblePages = 5;
                    const half = Math.floor(maxVisiblePages / 3);

                    let start = Math.max(1, currentPage - half);
                    let end = Math.min(totalPages, currentPage + half);

                    if (currentPage <= half) {
                        end = Math.min(totalPages, maxVisiblePages);
                    } else if (currentPage + half >= totalPages) {
                        start = Math.max(1, totalPages - maxVisiblePages + 1);
                    }

                    if (start > 1) {
                        pages.push(
                            <button
                                key={1}
                                onClick={() => setCurrentPage(1)}
                                className="px-3 py-1 border rounded text-gray-700 dark:text-white"
                            >
                                1
                            </button>,
                            <span key="start-ellipsis">...</span>
                        );
                    }

                    for (let i = start; i <= end; i++) {
                        pages.push(
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={`px-3 py-1 rounded ${currentPage === i
                                    ? "bg-blue-600 text-white"
                                    : "border text-gray-700 dark:text-white"
                                    }`}
                            >
                                {i}
                            </button>
                        );
                    }

                    if (end < totalPages) {
                        pages.push(
                            <span key="end-ellipsis">...</span>,
                            <button
                                key={totalPages}
                                onClick={() => setCurrentPage(totalPages)}
                                className="px-3 py-1 border rounded text-gray-700 dark:text-white"
                            >
                                {totalPages}
                            </button>
                        );
                    }

                    return pages;
                })()}

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
    )
}
        </div >
    );
}

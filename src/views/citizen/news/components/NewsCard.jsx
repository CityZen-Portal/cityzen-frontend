import React from "react";
import { useNavigate } from "react-router-dom";
import newsData from "./newsData";
export default function NewsCard() {
  const navigate = useNavigate();
    
  console.log(newsData);
  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-navy-700  dark:text-white">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {newsData.map((news, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl bg-white shadow-lg transition-transform hover:scale-105 dark:bg-navy-900 dark:text-white"
          >
            <img
              src={news.image}
              alt={news.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="mb-2 text-lg font-semibold text-gray-800  dark:text-white">
                {news.title}
              </h2>
              {/* <p className="mb-4 text-sm text-gray-600">{news.description}</p> */}
              <button
                onClick={() => {
                  navigate(
                    `/citizen/newsupdate/newsdetails/${encodeURIComponent(
                      news.title
                    )}`,
                    {
                      state: news,
                    }
                  );
                }}
                className="font-medium text-blue-600 hover:underline"
              >
                Read more →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

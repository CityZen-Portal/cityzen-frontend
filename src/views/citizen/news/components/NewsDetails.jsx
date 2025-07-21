import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import newsData from "./newsData";

export default function NewsDetails() {
  const { title } = useParams();
  const navigate = useNavigate();

  // Match title from URL with newsData
  const newsItem = newsData.find(
    (item) => item.title.toLowerCase() === decodeURIComponent(title).toLowerCase()
  );

  if (!newsItem) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-500">News Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto bg-white p-8 dark:bg-navy-800 dark:text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 underline"
      >
        ← Back to News
      </button>
      <img
        src={newsItem.image}
        alt={newsItem.title}
        className="mb-6 w-full rounded-xl"
      />
      <h1 className="mb-2 text-3xl font-bold">{newsItem.title}</h1>
      <p className="mb-4 text-gray-700 dark:text-gray-300">{newsItem.description}</p>
      <p className="text-gray-600 dark:text-gray-400">{newsItem.content}</p>
    </div>
  );
}

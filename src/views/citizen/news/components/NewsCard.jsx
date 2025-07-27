import React, { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import newsData from "./newsData";
import axios from "axios";
export default function NewsCard() {
  const navigate = useNavigate();
  const [total,setCount]=useState(null);
   const[data,setData]=useState(null);
   useEffect(()=>{
    const fetchNews=async ()=>{
      try{
        const response=await axios.get('https://city-news-alert-backend-new.onrender.com/api/news/get-all');
        console.log(response.data.data.records);
        setData(response.data.data.records);
        setCount(response.data.data.totalCount);
      }
      catch(err)
      {
        console.log(err);
      }
    }
    fetchNews();
   },[]); 
   
  // console.log(newsData);
  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-navy-700 dark:text-white">
      {data === null ? (
        <p className="text-center text-gray-500 dark:text-gray-300">
          Loading news...
        </p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">
          No news data available.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {data.map((news, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl bg-white shadow-lg transition-transform hover:scale-105 dark:bg-navy-900 dark:text-white"
            >
              <img
                src={`${news.imagePath}`}
                alt={news.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
                  {news.title}
                </h2>
                <button
                  onClick={() => {
                    navigate(
                      `/citizen/newsupdate/newsdetails/${encodeURIComponent(
                        news.id
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
      )}
    </div>
  );
}

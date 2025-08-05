import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  AlertCircle,
  Calendar,
  MapPin,
  ExternalLink,
} from "lucide-react";

const fallbackNews = [
  {
    id: 3,
    title: "Property Tax Deadline Reminder",
    description:
      "Citizens are reminded that the property tax payment deadline is approaching. Late fees will apply after August 15, 2025.",
    createdAt: "2025-08-03T14:20:00Z",
    category: "Finance",
    urgent: false,
    location: "City-wide",
    imagePath:
      "https://images.unsplash.com/photo-1581091215367-3c524d5d6b6f?w=400&h=250&fit=crop",
    content:
      "<p>Paying on time ensures uninterrupted civic services. Use the online portal or visit any tax office.</p>",
  },
  {
    id: 4,
    title: "Free Polio Vaccination Drive Starts",
    description:
      "A city-wide free polio vaccination drive is launching this weekend at community health centers. All children under 5 are eligible.",
    createdAt: "2025-08-02T09:00:00Z",
    category: "Health",
    urgent: false,
    location: "Community Health Centers",
    imagePath:
      "https://images.unsplash.com/photo-1584438786716-6a6c8b1b9a2b?w=400&h=250&fit=crop",
    content:
      "<p>Ensure your child is vaccinated. Visit any urban PHC between July 28 and 30. No cost involved.</p>",
  },
  {
    id: 5,
    title: "Digital Building Permit Portal Live",
    description:
      "Online building permit applications now available. Reduced processing time from 30 to 7 days.",
    createdAt: "2025-08-01T00:00:00Z",
    category: "Services",
    urgent: false,
    location: "Municipal Office",
    imagePath:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
    content:
      "<p>Apply online and track your building permit with reduced wait times.</p>",
  },
  {
    id: 6,
    title: "Road Repair Work Begins",
    description:
      "Major potholes and road surface repairs starting on Main Street. Traffic diversions in place.",
    createdAt: "2025-07-31T00:00:00Z",
    category: "Transportation",
    urgent: true,
    location: "Main Street",
    imagePath:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
    content:
      "<p>Detours are active. Expect delays; alternate routes are recommended.</p>",
  },
];

const NewsGallery = () => {
  const navigate = useNavigate();
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCategoryColor = (category) => {
    const colors = {
      Infrastructure:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      Finance: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
      Health:
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
      Services:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      Transportation:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
      Administration:
        "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
      Sanitation:
        "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      Utilities:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    };
    return (
      colors[category] ||
      "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400"
    );
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleNewsClick = (newsItem) => {
    const newsUrl = `/citizen/newsupdate/newsdetails/${newsItem.id}`;
    navigate(newsUrl, {
      state: {
        newsItem: newsItem,
        id: newsItem.id,
        title: newsItem.title,
        description: newsItem.description,
        content: newsItem.content,
        createdAt: newsItem.createdAt || newsItem.created_date,
        category: newsItem.category,
        location: newsItem.location,
        imagePath: newsItem.imagePath || newsItem.image,
        urgent: newsItem.urgent,
      },
    });
  };

  const handleSeeMoreClick = () => {
    navigate("/citizen/newsupdate");
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://city-news-alert-backend-new.onrender.com/api/news/get-all"
        );
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched news payload:", data);
        let records = data?.data?.records;

        if (Array.isArray(records) && records.length > 0) {
          const normalized = records.map((item) => ({
            ...item,
            _sortDate: new Date(
              item.createdAt || item.created_date || item.date || 0
            ).getTime(),
          }));

          normalized.sort((a, b) => b._sortDate - a._sortDate); // newest first

          const latestFour = normalized.slice(2, 6);

          const processedNews = latestFour.map((item) => ({
            id: item.id || item._id,
            title: item.title || "Untitled News",
            description: item.description || "No description available",
            content: item.content || item.description || "No content available",
            createdAt:
              item.createdAt || item.created_date || new Date().toISOString(),
            category: item.category || "General",
            location: item.location || "City-wide",
            imagePath: item.imagePath || item.image || fallbackNews[0].imagePath,
            urgent: item.urgent || false,
          }));

          setNewsItems(processedNews);
        } else {
          throw new Error("No valid records array");
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news from server");
        setNewsItems(fallbackNews);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">
            Loading latest news...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Latest City News
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Stay updated with the latest municipal developments
          </p>
        </div>
        <button
          onClick={handleSeeMoreClick}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span>See More</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {newsItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleNewsClick(item)}
            className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/20 hover:-translate-y-3 cursor-pointer overflow-hidden transform hover:scale-105"
          >
            {/* Image */}
            <div className="relative overflow-hidden h-48">
              <img
                src={item.imagePath}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400&h=250&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    item.category
                  )}`}
                >
                  {item.category}
                </span>
                {item.urgent && (
                  <div className="flex items-center text-red-500 animate-pulse">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                {item.description}
              </p>

              {/* Location */}
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-4">
                <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                <span className="truncate">{item.location}</span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </div>

            {/* Hover Effect Bar */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>
        ))}
      </div>

      {/* Error banner if fallback used */}
      {error && newsItems.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              Using fallback news data. {error}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsGallery;

import React from "react";
import { useNavigate } from "react-router-dom";

export default function NewsCard() {
  const navigate = useNavigate();

  const newsData = [
    {
      title: "AI Breakthrough in Healthcare",
      description:
        "AI models are helping diagnose diseases faster and more accurately than ever before.",
      image: "https://source.unsplash.com/400x250/?healthcare,technology",
      content:
        "AI is transforming the medical field by enabling rapid diagnostics, improving treatment outcomes, and offering personalized healthcare solutions.",
    },
    {
      title: "Climate Change Impacts",
      description:
        "Record temperatures and sea-level rise are putting pressure on global leaders to act.",
      image: "https://source.unsplash.com/400x250/?climate,earth",
      content:
        "The planet is experiencing severe climate events due to global warming. Governments are urged to act swiftly to mitigate carbon emissions and invest in sustainability.",
    },
    {
      title: "SpaceX Launches New Satellite",
      description:
        "Elon Musk's SpaceX successfully launched a new satellite to boost global internet.",
      image: "https://source.unsplash.com/400x250/?spacex,rocket",
      content:
        "SpaceX’s Starlink satellite network continues expanding, aiming to provide high-speed internet access to underserved regions across the globe.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {newsData.map((news, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl bg-white shadow-lg transition-transform hover:scale-105"
          >
            <img
              src={news.image}
              alt={news.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="mb-2 text-lg font-semibold text-gray-800">
                {news.title}
              </h2>
              <p className="mb-4 text-sm text-gray-600">{news.description}</p>
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

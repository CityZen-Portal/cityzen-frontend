import React from 'react'

export default function NewsCard() {
    const newsData = [
      {
        title: "AI Breakthrough in Healthcare",
        description:
          "AI models are helping diagnose diseases faster and more accurately than ever before.",
        image: "https://source.unsplash.com/400x250/?healthcare,technology",
        link: "#",
      },
      {
        title: "Climate Change Impacts",
        description:
          "Record temperatures and sea-level rise are putting pressure on global leaders to act.",
        image: "https://source.unsplash.com/400x250/?climate,earth",
        link: "#",
      },
      {
        title: "SpaceX Launches New Satellite",
        description:
          "Elon Musk's SpaceX successfully launched a new satellite to boost global internet.",
        image: "https://source.unsplash.com/400x250/?spacex,rocket",
        link: "#",
      },
    ];
  return (
    <>
      <div className="grid grid-cols-1 gap-6  sm:grid-cols-2 md:grid-cols-3">
        {newsData.map((news, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl bg-white dark:bg-navy-700 shadow-lg transition-transform hover:scale-105"
          >
            <img
              src={news.image}
              alt={news.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="mb-2 text-lg font-semibold dark:text-white">{news.title}</h2>
              <p className="mb-4 text-sm text-gray-900 dark:text-white">{news.description}</p>
              <a
                href={news.link}
                className="font-medium text-blue-600 hover:underline"
              >
                Read more →
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

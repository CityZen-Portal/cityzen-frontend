import React from 'react'
import NewsNav from './NewsNav';
import NewsCard from './NewsCard';
function NewsUpdate() {
  return (
    <>
      <NewsNav />
      <div>
        <h1 className="p-4 text-2xl font-bold text-gray-800 dark:text-white">Latest News</h1>
        <NewsCard />
      </div>
    </>
  );
}

export default NewsUpdate;
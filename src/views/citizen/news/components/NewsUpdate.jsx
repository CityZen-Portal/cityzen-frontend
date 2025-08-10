import React from 'react'
// import NewsNav from './NewsNav';
import NewsCard from './NewsCard';
import NewsHome from './NewsHome';

function NewsUpdate() {
  return (
    <>
      {/* <NewsNav /> */}
      
      <div>
        <h1 className="p-4 text-2xl font-bold text-gray-800 dark:text-white">Updates</h1>
        <NewsCard />
        <h1 className="p-4 text-2xl font-bold text-gray-800 dark:text-white">News</h1>
        <NewsHome/>
      </div>
    </>
  );
}

export default NewsUpdate;
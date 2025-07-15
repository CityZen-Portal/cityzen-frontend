// src/components/NewsNav.jsx

import React, { useState } from "react";

// Coimbatore Areas
const coimbatoreAreas = [
  "Coimbatore",
  "Gandhipuram",
  "RS Puram",
  "Peelamedu",
  "Saibaba Colony",
  "Town Hall",
  "Ukkadam",
  "Singanallur",
  "Race Course",
  "Vadavalli",
  "Ganapathy",
];

function NewsNav() {
  const [area, setArea] = useState("Coimbatore");

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md dark:bg-navy-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-3 md:flex-row">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          NewsToday
        </div>

        {/* News Categories */}
        <ul className="flex flex-wrap justify-center space-x-4 font-medium text-gray-700 dark:text-white ">
          <li>
            <a href="#" className="hover:text-blue-600">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Sports
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Business
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Entertainment
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-600">
              Tech
            </a>
          </li>
        </ul>

        {/* Area Selector + Search */}
        <div className="flex flex-col items-center gap-3 md:flex-row">
          {/* Area Dropdown */}
          <select
            className="rounded-md border px-3 py-1 text-gray-700 dark:bg-navy-800 dark:border-navy-900 "
            value={area}
            onChange={(e) => setArea(e.target.value)}
          >
            {coimbatoreAreas.map((place) => (
              <option key={place} value={place}>
                {place}
              </option>
            ))}
          </select>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search..."
            className="rounded-md border px-3 py-1 focus:outline-none focus:ring dark:bg-navy-800 dark:border-navy-900"
          />
        </div>
      </div>
    </nav>
  );
}

export default NewsNav;

import React from "react";

export default function DashboardCard({ title, count = 0 }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="text-black-700 text-sm font-semibold dark:text-gray-300">
        {title}
      </div>
      <div className="text-black text-xl font-bold dark:text-white">
        {count}
      </div>
    </div>
  );
}

import React from 'react';
import { MdOutlineAssignment, MdPendingActions, MdCheckCircleOutline } from "react-icons/md";

const FilterButtons = ({ viewMode, setViewMode }) => {
  return (
    
      <div className="py-5">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setViewMode("all")} 
            className={`flex text-sm items-center gap-1 px-3  py-2 rounded-2xl  transition-all duration-200 ${viewMode === "all" ? "bg-brand-500 text-white" : "bg-white text-navy-700 dark:bg-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-600"}`}
          >
            <MdOutlineAssignment className="h-5 w-5" />
            <span>All Requests</span>
          </button>
          <button 
            onClick={() => setViewMode("pending")} 
            className={`flex text-sm items-center gap-2 px-3  py-2 rounded-2xl shadow-md transition-all duration-200 ${viewMode === "pending" ? "bg-brand-500 text-white" : "bg-white text-navy-700 dark:bg-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-600"}`}
          >
            <MdPendingActions className="h-5 w-5" />
            <span>Pending</span>
          </button>
          <button 
            onClick={() => setViewMode("completed")} 
            className={`flex text-sm items-center gap-2 px-3  py-2 rounded-2xl shadow-md transition-all duration-200 ${viewMode === "completed" ? "bg-brand-500 text-white" : "bg-white text-navy-700 dark:bg-navy-700 dark:text-white hover:bg-gray-100 dark:hover:bg-navy-600"}`}
          >
            <MdCheckCircleOutline className="h-5 w-5" />
            <span>Completed</span>
          </button>
        </div>
      </div>
  );
};

export default FilterButtons;
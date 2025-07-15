import React from 'react';
import { useNavigate } from 'react-router-dom';

function ViewSchedule() {
  const navigate = useNavigate();
  
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 px-4">
      <div className="bg-white shadow rounded-lg">
        <div className="bg-blue-600 p-4 rounded-t-lg">
          <button onClick={() => navigate('/admin/services')} className="text-white hover:text-gray-200 transition-colors flex items-center gap-1 mb-2">
            <span>←</span> Back
          </button>
          <h2 className="text-white text-lg font-semibold">Staff Schedule</h2>
        </div>
        <div className="p-4">
          <p className="text-gray-600">Schedule content will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}

export default ViewSchedule;
import React from 'react';
import Card from "components/card";
import { MdOutlineAssignment, MdCheckCircleOutline, MdPendingActions, MdPhotoCamera, MdPerson } from "react-icons/md";

const RequestDetails = ({ viewingDetails, setViewingDetails }) => {
  if (!viewingDetails) return null;
  
  return (
    <Card extra="mt-7">
      <div className="p-5">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-brand-500 p-2 text-white">
              <MdOutlineAssignment className="h-6 w-6" />
            </div>
            <h5 className="text-xl font-bold text-navy-700 dark:text-white">Request Details</h5>
          </div>
          <button 
            onClick={() => setViewingDetails(null)} 
            className="px-3 py-[4px] rounded-xl bg-red-400 text-white dark:bg-red-400 dark:text-white hover:bg-red-600 dark:hover:bg-red-600 shadow-md transition-all duration-200"
          >
            Close
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-navy-900 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-navy-700">
              <MdPerson className="h-5 w-5 text-brand-500" />
              <p className="font-bold text-navy-700 dark:text-white">Citizen Information</p>
            </div>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium text-navy-700 dark:text-white min-w-[120px]">Name:</span> 
                {viewingDetails.citizenName}
              </p>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium text-navy-700 dark:text-white min-w-[120px]">Service Type:</span> 
                {viewingDetails.service}
              </p>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium text-navy-700 dark:text-white min-w-[120px]">Request Date:</span> 
                {viewingDetails.date}
              </p>
              <p className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium text-navy-700 dark:text-white min-w-[120px]">Description:</span> 
                {viewingDetails.description}
              </p>
            </div>
            
            {viewingDetails.status === "completed" && (
              <div className="mt-4 pt-2 border-t border-gray-200 dark:border-navy-700">
                <div className="flex items-center gap-2 mb-4">
                  <MdCheckCircleOutline className="h-5 w-5 text-green-500" />
                  <p className="font-bold text-navy-700 dark:text-white">Completion Details</p>
                </div>
                <div className="space-y-3">
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="font-medium text-navy-700 dark:text-white min-w-[120px]">Completed Date:</span> 
                    {viewingDetails.completedDate}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="font-medium text-navy-700 dark:text-white min-w-[120px]">Staff Member:</span> 
                    {viewingDetails.staffName}
                  </p>
                  <p className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <span className="font-medium text-navy-700 dark:text-white min-w-[120px]">Notes:</span> 
                    {viewingDetails.suggestion || "None"}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {viewingDetails.status === "completed" && viewingDetails.photo ? (
            <div className="bg-gray-50 dark:bg-navy-900 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-navy-700">
                <MdPhotoCamera className="h-5 w-5 text-brand-500" />
                <p className="font-bold text-navy-700 dark:text-white">Completion Photo</p>
              </div>
              <div className="overflow-hidden rounded-xl shadow-lg">
                <img 
                  src={viewingDetails.photo} 
                  alt="Completion Proof" 
                  className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105" 
                />
              </div>
            </div>
          ) : viewingDetails.status === "pending" ? (
            <div className="bg-gray-50 dark:bg-navy-900 p-4 rounded-xl flex flex-col items-center justify-center">
              <div className="rounded-full bg-yellow-100 p-4 mb-3">
                <MdPendingActions className="h-10 w-10 text-yellow-600" />
              </div>
              <p className="text-lg font-medium text-navy-700 dark:text-white mb-2">Request Pending</p>
              <p className="text-center text-gray-600 dark:text-gray-400">This service request is waiting to be completed by a staff member.</p>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

export default RequestDetails;
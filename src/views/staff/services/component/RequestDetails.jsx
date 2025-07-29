import React from 'react';
import Card from "components/card";
import { MdOutlineAssignment, MdCheckCircleOutline, MdPendingActions, MdPhotoCamera, MdPerson } from "react-icons/md";
import { Link } from 'react-router-dom';
const RequestDetails = ({ viewingDetails, setViewingDetails }) => {
  if (!viewingDetails) return null;
  
  return (
    <Card extra="mt-7">
      
      <div className="p-5">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-brand-500 p-2 text-white">
              <MdOutlineAssignment className="h-6 w-6" />
            </div>
            <h5 className="text-xl font-bold text-navy-700 dark:text-white">
              Request Details
            </h5>
          </div>
          <button
            onClick={() => setViewingDetails(null)}
            className="rounded-xl bg-red-400 px-3 py-[4px] text-white shadow-md transition-all duration-200 hover:bg-red-600 dark:bg-red-400 dark:text-white dark:hover:bg-red-600"
          >
            Close
          </button>
        </div>
           {viewingDetails.staffName!==null && 
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-navy-900">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-navy-700">
              <MdPerson className="h-5 w-5 text-brand-500" />
              <p className="font-bold text-navy-700 dark:text-white">
                Staff Information
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="min-w-[120px] font-medium text-navy-700 dark:text-white">
                  Name:
                </span>
                {viewingDetails.staffName}
              </p>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="min-w-[120px] font-medium text-navy-700 dark:text-white">
                  Service Type:
                </span>
                {viewingDetails.serviceName}
              </p>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <span className="min-w-[120px] font-medium text-navy-700 dark:text-white">
                  Request Date:
                </span>
                {viewingDetails.completedDate===null? "Not Completed Yet":viewingDetails.completedDate}
              </p>
              <p className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="min-w-[120px] font-medium text-navy-700 dark:text-white">
                  Description:
                </span>
                {viewingDetails.description===null ? "No Description":viewingDetails.description}
              </p>
            </div>

            {viewingDetails.status === "completed" && (
              <div className="mt-4 border-t border-gray-200 pt-2 dark:border-navy-700">
                <div className="mb-4 flex items-center gap-2">
                  <MdCheckCircleOutline className="h-5 w-5 text-green-500" />
                  <p className="font-bold text-navy-700 dark:text-white">
                    Completion Details
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="min-w-[120px] font-medium text-navy-700 dark:text-white">
                      Completed Date:
                    </span>
                    {viewingDetails.completedDate}
                  </p>
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="min-w-[120px] font-medium text-navy-700 dark:text-white">
                      Staff Member:
                    </span>
                    {viewingDetails.staffName}
                  </p>
                  <p className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <span className="min-w-[120px] font-medium text-navy-700 dark:text-white">
                      Notes:
                    </span>
                    {viewingDetails.suggestion || "None"}
                  </p>
                  <div className="flex justify-center">
                    <Link
                      to="/Services/feedform"
                      className=" rounded-xl bg-red-400 px-5 py-[6px] text-white shadow-md transition-all duration-200 hover:bg-red-600 dark:bg-red-400 dark:text-white dark:hover:bg-red-600"
                    >
                      Give FeedBack
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {viewingDetails.status === "completed" && viewingDetails.photo ? (
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-navy-900">
              <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-2 dark:border-navy-700">
                <MdPhotoCamera className="h-5 w-5 text-brand-500" />
                <p className="font-bold text-navy-700 dark:text-white">
                  Completion Photo
                </p>
              </div>

              <div className="overflow-hidden rounded-xl shadow-lg">
                <img
                  src={viewingDetails.photo}
                  alt="Completion Proof"
                  className="h-64 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          ) : viewingDetails.status === "pending" ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 p-4 dark:bg-navy-900">
              <div className="mb-3 rounded-full bg-yellow-100 p-4">
                <MdPendingActions className="h-10 w-10 text-yellow-600" />
              </div>
              <p className="mb-2 text-lg font-medium text-navy-700 dark:text-white">
                Request Pending
              </p>
              <p className="text-center text-gray-600 dark:text-gray-400">
                This service request is waiting to be completed by a staff
                member.
              </p>
              <div className="flex justify-center">
                <Link
                  to="/Services/reportform"
                  className=" rounded-xl bg-red-400 mt-3 px-5 py-[6px] text-white shadow-md transition-all duration-200 hover:bg-red-600 dark:bg-red-400 dark:text-white dark:hover:bg-red-600"
                >
                  Report
                </Link>
              </div>
            </div>
          ) : null}
        </div>}
        { viewingDetails.staffName===null && 
        
        <div>No staff is assigned yet</div>}
      </div>
    </Card>
  );
};

export default RequestDetails;
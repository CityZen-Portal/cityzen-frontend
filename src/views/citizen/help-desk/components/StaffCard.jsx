import React from 'react'

const StaffCard = ({ extra, complaintData, fields }) => {
  return (
    <div className={`bg-white dark:bg-navy-800 rounded-xl shadow-sm p-6 ${extra}`}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        Staff Assigned
        </h2>
        <div className="space-y-4">
          {fields.map((field, index) => (
              <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                  <div className="h-2 w-2 bg-blue-600 rounded-full mt-1.5"></div>
              </div>
              <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 my-1">{complaintData.staff[field]}</p>
              </div>
              </div>
          ))}
        </div>
    </div>
  )
}

export default StaffCard
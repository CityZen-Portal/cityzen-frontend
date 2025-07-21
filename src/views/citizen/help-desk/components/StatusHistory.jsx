import React from 'react'
import { MdHistory } from 'react-icons/md'

const StatusHistory = ({extra, statusHistory}) => {
  return (
    <div className={`bg-white dark:bg-navy-800 rounded-xl shadow-sm p-6 ${extra}`}>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <MdHistory className="mr-2 text-blue-600 h-6 w-6" /> Status History
        </h2>
        <div className="space-y-4">
        {statusHistory.map((entry, index) => (
            <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-blue-600 rounded-full mt-1.5"></div>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{entry.status}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{entry.date}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{entry.note}</p>
            </div>
            </div>
        ))}
        </div>
    </div>
  )
}

export default StatusHistory
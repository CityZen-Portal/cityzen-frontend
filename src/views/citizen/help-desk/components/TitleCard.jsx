import React from 'react'

const TitleCard = ({Icon, title, complaintStatus, getStatusColor, getStatusText}) => {
  return (
    <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
        <Icon className="text-3xl text-brand-500 h-9 w-8" />
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Manage your complaint details</p>
        </div>
        </div>
        <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(complaintStatus?.toLowerCase())}`}>
        {getStatusText(complaintStatus?.toLowerCase())}
        </span>
    </div>
  )
}

export default TitleCard
import React from 'react'
import AttachmentCard from './AttachmentCard'

const DetailsList = ({ Icon, title, complaintData, fields }) => {
  return (
    <div className="space-y-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
        <Icon className="mr-2 text-blue-600 h-6 w-6" />
        {title}
        </h2>
        {fields.map((field) => (
            <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                {field === 'attachment' ? 
                    <AttachmentCard 
                        fileUrl={complaintData.fileUrl}
                    />
                    : (<p className="mt-1 text-gray-900 dark:text-white">{complaintData[field] || "N/A"}</p>)
                }
                
            </div>
        ))}
    </div>
  )
}

export default DetailsList
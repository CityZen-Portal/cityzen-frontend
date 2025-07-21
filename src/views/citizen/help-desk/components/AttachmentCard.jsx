import React from 'react'
import pdf_file_icon from '../../../../assets/svg/pdf_file_icon.svg'

const AttachmentCard = ({fileUrl}) => {
  return ( fileUrl ? (
            <div className="mt-2 max-w-xs p-3 rounded-md border shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
                <div
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
                onClick={() => window.open(fileUrl, "_blank")}
                >
                <img
                    src={fileUrl.endsWith('.pdf') ? fileUrl : pdf_file_icon}
                    alt={fileUrl.endsWith('.pdf') ? "PDF" : "Complaint"}
                    className="rounded-md cursor-pointer hover:opacity-80 h-20"
                />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 wrap">
                    {`${fileUrl.split('/').pop().slice(0, 20)}...`}
                </span>
                </div>
            </div>
        ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">No attachment uploaded</p>
        )
    );
}

export default AttachmentCard
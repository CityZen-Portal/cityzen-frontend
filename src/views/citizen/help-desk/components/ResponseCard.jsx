import React from 'react'
import { MdSend } from 'react-icons/md'

const ResponseCard = ({extra, resolution, responses}) => {
  return (
    <div className={`${extra}`}>
        <div className="bg-white dark:bg-navy-800 rounded-xl shadow-sm p-6 col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4"> <MdSend className="mr-2 text-blue-600 h-6 w-6"  /> Responses & Resolutions</h2>
            {/* Response */}
            <div className="my-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                Responses
            </label>
            <ul className="">
                {responses.map((response) => (
                    <div key={response.index} className="flex items-start space-x-3 space-y-2">
                        <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-blue-600 rounded-full mt-4"></div>
                        </div>
                        <div>
                        <p className="text-md font-medium text-gray-900 dark:text-white">{response.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{response.date}</p>
                        </div>
                    </div>
                ))}
            </ul>
            </div>
            {/* Resolution */}
            <div className="my-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                Resolution
            </label>
            <p className="mt-1 text-gray-900 dark:text-white">{resolution}</p>
            </div>
        </div>
    </div>
  )
}

export default ResponseCard
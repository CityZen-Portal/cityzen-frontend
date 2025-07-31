import React from 'react'
import { MdSend } from 'react-icons/md'

const ResponseCard = ({extra, responses = []}) => {
  const toLocalTime = (time) => {
    if(!time) return null;

    const trimmedIsoString = time.slice(0, 23) + 'Z';

    const date = new Date(trimmedIsoString);

    return date.toLocaleString(); 
  }
  return (
    <div className={`${extra}`}>
        <div className="bg-white dark:bg-navy-800 rounded-xl shadow-sm p-6 col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-4"> <MdSend className="mr-2 text-brand-500 h-6 w-6"  /> Responses & Resolutions</h2>
            {/* Response */}
            <div className="my-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                Responses
            </label>
            <ul className="">
                {responses.length === 0 && <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>N/A</p>}
                {responses.map((response, index) => (
                    <div key={index} className="flex items-start space-x-3 space-y-2">
                        <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-brand-500 rounded-full mt-4"></div>
                        </div>
                        <div>
                        <p className="text-md font-medium text-gray-900 dark:text-white">{response.responseDetails}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{toLocalTime(response.respondedDate)}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{`Responded By ${response.respondedBy}`}</p>
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
                {responses.length === 0 && <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>N/A</p>}
                {responses.map((response, index) => (
                    response.resolutionDetails && (
                        <div key={index} className="flex items-start space-x-3 space-y-2">
                            <div className="flex-shrink-0">
                                <div className="h-2 w-2 bg-brand-500 rounded-full mt-4"></div>
                            </div>
                            <div>
                                <p className="text-md font-medium text-gray-900 dark:text-white">{response.resolutionDetails}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{toLocalTime(response.respondedDate)}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{`Responded By ${response.respondedBy}`}</p>
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    </div>
  )
}

export default ResponseCard
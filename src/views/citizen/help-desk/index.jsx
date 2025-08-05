import React from 'react'
import HelpCard from './components/HelpCard'
import { MdHistory, MdDescription, MdHelpOutline } from "react-icons/md";

const HelpDesk = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center justify-center bg-blue-50 rounded-full p-3 mb-4">
                    <MdHelpOutline className="text-3xl text-blue-600" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 dark:text-white">How can we help you today?</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Choose an option below to report issues or track your existing complaints
                </p>
            </div>

            <div 
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto"
            >
                <div>
                    <HelpCard
                        title={'Complaint Form'}
                        description={'Lodge a new civic complaint in your area by filling out our simple form'}
                        Icon={MdDescription}
                        link={'/citizen/help-desk/complaint/form'}
                        color="from-blue-500 to-blue-600"
                    />
                </div>
                <div>
                    <HelpCard 
                        title={'Complaint Log'}
                        description={'Track your submitted complaints and their status in real-time'}
                        Icon={MdHistory}
                        link={'/citizen/help-desk/complaint/log'}
                        color="from-purple-500 to-purple-600"
                    />
                </div>
            </div>
        </div>
    )
}

export default HelpDesk;
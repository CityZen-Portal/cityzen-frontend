import React from 'react'
import HelpCard from './components/HelpCard'
import { MdHistory, MdDescription } from "react-icons/md";

const HelpDesk = () => {
    return (
        <div className="mt-5 px-4 sm:px-6 lg:px-8">
            <div className='flex flex-col sm:flex-row justify-start gap-4 sm:gap-6 lg:gap-8'>
                <div className="w-full sm:w-1/2 lg:w-auto lg:flex-1">
                    <HelpCard
                        title={'Complaint Form'}
                        description={'Lodge a new civic complaint in your area by filling out the form'}
                        Icon={MdDescription}
                        link={'/citizen/help-desk/complaint/form'}
                    />
                </div>
                <div className="w-full sm:w-1/2 lg:w-auto lg:flex-1">
                    <HelpCard 
                        title={'Complaint Log'}
                        description={'Track your submitted complaints and their status in realtime'}
                        Icon={MdHistory}
                        link={'/citizen/help-desk/complaint/log'}
                    />
                </div>
            </div>
        </div>
    )
}

export default HelpDesk;
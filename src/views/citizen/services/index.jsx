import React from 'react'
import Servicelist from './components/Servicelist';
import CitizenServiceRequests from './components/CitizenServiceRequests';
const Service = () => {
  return (
    <>
   <Servicelist/>
   <div className='bg-white'>
   <CitizenServiceRequests currentCitizenName="John Doe" />
</div>
    </>
  )
}

export default Service;
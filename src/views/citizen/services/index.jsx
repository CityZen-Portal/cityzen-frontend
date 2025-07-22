import React from 'react'
import Servicelist from './components/Servicelist';
import CitizenServiceRequests from './components/CitizenServiceRequests';
const Service = () => {
  return (
    <>
   <Servicelist/>
   <CitizenServiceRequests currentCitizenName="John Doe" />

    </>
  )
}

export default Service;
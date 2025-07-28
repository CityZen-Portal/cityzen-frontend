import React from 'react'
import Servicelist from './components/Servicelist';
import CitizenServiceRequests from './components/CitizenServiceRequests';
const Service = () => {
  return (
    <>
   <Servicelist/>
   <CitizenServiceRequests id="1234" />
    </>
  )
}

export default Service;
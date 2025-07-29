// src/views/citizen/job-application/index.jsx

import React, { useState } from 'react';
import JobApplicationForm from './pages/JobApplicationForm';
import JobApplicationResponseView from './pages/JobApplicationResponseView';
import JobApplicationEdit from './pages/JobApplicationEdit';
import JobApplicationList from './pages/JobApplicationList'

const JobApplicationPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    formData: null,
    location: null,
    experiences: null,
  });

  const handleFormSubmit = (formData, location, experiences) => {
    setFormState({ formData, location, experiences });
    setIsSubmitted(true);
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  return (
    <JobApplicationList />
  )
}


export default JobApplicationPage;

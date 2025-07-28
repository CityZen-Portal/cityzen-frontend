// src/views/citizen/job-application/index.jsx

import React, { useState } from 'react';
import JobApplicationForm from './pages/JobApplicationForm';
import JobApplicationResponseView from './pages/JobApplicationResponseView';
import JobApplicationEdit from './pages/JobApplicationEdit';

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
    <div>
      {/* {!isSubmitted ? (
        <JobApplicationForm
          onFormSubmit={handleFormSubmit}
          initialData={formState}
        />
      ) : (
        <JobApplicationResponseView
          formData={formState.formData}
          location={formState.location}
          experiences={formState.experiences}
          onEdit={handleEdit}
        />
      )} */}
      <JobApplicationEdit />
    </div>
  );
};

export default JobApplicationPage;

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MdEdit,
  MdAccountBox,
  MdLocationOn,
  MdWork,
  MdMailOutline,
  MdPerson,
  MdPhone,
  MdSchool,
  MdBusinessCenter
} from 'react-icons/md';

const JobApplicationResponseView = ({ formData = {}, location = {}, experiences = [], jobDetails = {} }) => {
  const navigate = useNavigate();
  
  const onEdit = () => {
    navigate(`/job-application/edit/${formData.jobId}`);
  };

  const combinedLocation = `${location.taluk || ''}, ${location.district || ''}, ${location.state || ''}, ${location.pincode || ''}`.trim();

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-navy-800 rounded-2xl shadow-lg p-8 sm:p-12 text-black dark:text-white">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold flex items-center gap-3">
          <MdAccountBox className="text-blue-500 text-3xl" /> Application Summary
        </h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-lg transition duration-300"
        >
          <MdEdit className="text-l" /> Edit
        </button>
      </div>

      {/* Top section: Job Overview and Personal Info side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Job Overview */}
        <section className="bg-gray-50 dark:bg-navy-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <MdWork className="text-indigo-500 text-xl" /> Job Overview
          </h3>
          <div className="space-y-4">
            <Detail label="Applicant ID" value={formData.applicantId || 'N/A'} />
            <Detail label="Job Title" value={jobDetails.jobTitle || 'N/A'} />
            <Detail label="Department" value={jobDetails.department || 'N/A'} />
            <Detail label="Location" value={jobDetails.locationText || 'N/A'} />
            <Detail label="Applied Date" value={jobDetails.appliedDate || 'N/A'} />
          </div>
        </section>

        {/* Personal Information */}
        <section className="bg-gray-50 dark:bg-navy-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <MdPerson className="text-indigo-500 text-xl" /> Personal Information
          </h3>
          <div className="space-y-4">
            <Detail label="Full Name" value={formData.fullName || 'N/A'} />
            <Detail label="Email" value={formData.email || 'N/A'} />
            <Detail label="Phone" value={formData.phone || 'N/A'} />
            <Detail label="Age" value={formData.age || 'N/A'} />
            <Detail label="Gender" value={formData.gender || 'N/A'} />
            <Detail label="Education" value={formData.education || 'N/A'} />
          </div>
        </section>
      </div>

      {/* Address Section */}
      {/* Location Details Section */}
{/* Location Details Section */}
<section className="bg-gray-50 dark:bg-navy-700 rounded-xl p-6 shadow-lg mb-10">
  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
    <MdLocationOn className="text-indigo-500 text-xl" /> Location Details
  </h3>

  <div className="text-base leading-relaxed text-black dark:text-white space-y-2">
    <p className="font-semibold text-black dark:text-white mr-1 mb-2">Address</p>
    <p className='text-black dark:text-gray-300'>
      {[location.street, location.village, location.taluk].filter(Boolean).join(', ')}
    </p>
    <p className='text-black dark:text-gray-300'>
      {[location.district, location.state].filter(Boolean).join(', ')}
    </p>
    <p className='text-black dark:text-gray-300'>{location.pincode}</p>
    <p className="font-semibold text-black dark:text-white mr-1 mb-10">Ward Number</p>
    <p className='text-black dark:text-gray-300'>{location.wardNumber}</p>
    
  </div>
</section>


      {/* Experience Section */}
      <section className="bg-gray-50 dark:bg-navy-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <MdBusinessCenter className="text-indigo-500 text-xl" /> Past Experience
        </h3>
        {experiences.length > 0 ? (
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <div
                key={idx}
                className="border border-gray-300 dark:border-gray-600 p-4 rounded-lg bg-white dark:bg-navy-700"
              >
                <Detail label="Company" value={exp.company} /><br></br>
                <Detail label="Role" value={exp.role} /> <br></br>
                <Detail label="Years of Experience" value={exp.experience} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No experience added.</p>
        )}
      </section>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="text-base">
    <span className="font-semibold text-black dark:text-white mr-1 mb-10">{label}</span><br></br>
    <span className="text-black dark:text-gray-300">{value || 'N/A'}</span>
  </div>
);

export default JobApplicationResponseView;


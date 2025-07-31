import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdEdit,
  MdAccountBox,
  MdLocationOn,
  MdWork,
  MdPerson,
  MdBusinessCenter,
} from 'react-icons/md';

// --- DATA SIMULATION (All data is now inside this file) ---

// 1. A list of available municipal jobs with NUMERIC IDs
const MUNICIPAL_JOBS_DATABASE = [
  {
    jobId: 1, // Changed from '101' to 1
    jobTitle: 'Sanitation Worker',
    department: 'Public Works',
    locationText: 'Citywide',
    description: 'Responsible for city cleanliness and waste management.',
  },
  {
    jobId: 2, // Changed from '102' to 2
    jobTitle: 'Urban Planner Assistant',
    department: 'Urban Development',
    locationText: 'City Hall, Planning Dept.',
    description: 'Assists senior planners in developing and reviewing city projects.',
  },
  {
    jobId: 3, // Changed from '103' to 3
    jobTitle: 'Clerical Assistant',
    department: 'Administration',
    locationText: 'Municipal Office',
    description: 'Provides administrative support, data entry, and file management.',
  },
];

// 2. A list of job applications with NUMERIC keys to match the jobs
const APPLICATIONS_DATABASE = {
  1: { // Application for job 1
    formData: {
      applicantId: 'APP-001-007',
      fullName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '9876543211',
      age: '25',
      gender: 'Female',
      education: 'High School Diploma',
    },
    location: {
      street: '789 Gandhi Road',
      taluk: 'South Taluk',
      district: 'Capital District',
      state: 'State of Heritage',
      pincode: '543210',
      wardNumber: '12',
    },
    experiences: [
      { company: 'Local Supermarket', role: 'Cashier', experience: '2' },
    ],
  },
  2: { // Application for job 2
    formData: {
      applicantId: 'APP-002-003',
      fullName: 'Arun Kumar',
      email: 'arun.kumar@example.com',
      phone: '8765432109',
      age: '32',
      gender: 'Male',
      education: 'B.A. in Geography',
    },
    location: {
      street: '123 Nehru Street',
      taluk: 'West Taluk',
      district: 'River District',
      state: 'State of Progress',
      pincode: '654321',
      wardNumber: '05',
    },
    experiences: [
      { company: 'City Planning Intern', role: 'Intern', experience: '1' },
      { company: 'Mapping Solutions Inc.', role: 'GIS Technician', experience: '4' },
    ],
  },
};

// --- MOCK API FUNCTIONS (Simulating backend calls) ---

// Function to find a job by its ID. Now compares numbers.
const getJobById = (id) => {
  // The 'id' from useParams is a string, so we convert it to a number
  const numericId = parseInt(id, 10);
  console.log(`Searching for job with numeric ID: ${numericId}`);
  return MUNICIPAL_JOBS_DATABASE.find(job => job.jobId === numericId);
};

// Function to get a specific application by the job ID.
const getApplicationByJobId = (id) => {
  console.log(`Searching for application associated with job ID: ${id}`);
  // The key in APPLICATIONS_DATABASE is now a number, but the 'id' from the URL is a string.
  // We can use the string 'id' directly as object keys are often coerced.
  return APPLICATIONS_DATABASE[id];
};


// --- THE REACT COMPONENT ---

const JobApplicationResponseView = () => {
  const navigate = useNavigate();
  const { jobId } = useParams(); // Gets the ID from the URL, e.g., '1', '2'

  const [applicantData, setApplicantData] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!jobId) {
      setIsLoading(false);
      return;
    }

    const fetchData = () => {
      try {
        const jobData = getJobById(jobId);
        setJobDetails(jobData);

        const appData = getApplicationByJobId(jobId);
        setApplicantData(appData);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    fetchData();
  }, [jobId]);

  const onEdit = () => {
    navigate(`/citizen/job-application/edit/${jobId}`);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading Application Details...</div>;
  }

  if (!applicantData || !jobDetails) {
    return <div className="text-center p-10 text-xl text-red-500">Could not find application or job details for ID: {jobId}</div>;
  }

  const { formData, location, experiences } = applicantData;

  return (
    <div className="max-w-6xl mx-auto bg-white dark:bg-navy-800 rounded-2xl shadow-lg p-8 sm:p-12 text-black dark:text-white">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold flex items-center gap-3">
          <MdAccountBox className="text-blue-500" /> Application Summary
        </h2>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition duration-300"
        >
          <MdEdit /> Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Job Overview */}
        <section className="bg-gray-50 dark:bg-navy-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <MdWork className="text-indigo-500" /> Job Overview
          </h3>
          <div className="space-y-4">
            <Detail label="Applicant ID" value={formData.applicantId} />
            <Detail label="Job Title" value={jobDetails.jobTitle} />
            <Detail label="Department" value={jobDetails.department} />
            <Detail label="Work Location" value={jobDetails.locationText} />
            <Detail label="Applied On" value={new Date().toLocaleDateString()} />
          </div>
        </section>

        {/* Personal Information */}
        <section className="bg-gray-50 dark:bg-navy-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <MdPerson className="text-indigo-500" /> Personal Information
          </h3>
          <div className="space-y-4">
            <Detail label="Full Name" value={formData.fullName} />
            <Detail label="Email" value={formData.email} />
            <Detail label="Phone" value={formData.phone} />
            <Detail label="Age" value={formData.age} />
            <Detail label="Gender" value={formData.gender} />
            <Detail label="Education" value={formData.education} />
          </div>
        </section>
      </div>

      {/* Location Details Section */}
      <section className="bg-gray-50 dark:bg-navy-700 rounded-xl p-6 shadow-lg mb-10">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <MdLocationOn className="text-indigo-500" /> Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Detail label="Address" value={location.street} />
            <Detail label="Taluk / Tehsil" value={location.taluk} />
            <Detail label="District" value={location.district} />
            <Detail label="State" value={location.state} />
            <Detail label="Pincode" value={location.pincode} />
            <Detail label="Ward Number" value={location.wardNumber} />
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-gray-50 dark:bg-navy-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          <MdBusinessCenter className="text-indigo-500" /> Past Experience
        </h3>
        {experiences && experiences.length > 0 ? (
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <div key={idx} className="border border-gray-300 dark:border-gray-600 p-4 rounded-lg bg-white dark:bg-navy-800">
                <Detail label="Company" value={exp.company} />
                <Detail label="Role" value={exp.role} className="mt-2" />
                <Detail label="Years of Experience" value={exp.experience} className="mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No past experience provided.</p>
        )}
      </section>
    </div>
  );
};

// Reusable Detail component for consistent styling
const Detail = ({ label, value, className = '' }) => (
  <div className={className}>
    <p className="font-semibold text-black dark:text-white text-sm mb-1">{label}</p>
    <p className="text-black dark:text-gray-300">{value || 'N/A'}</p>
  </div>
);

export default JobApplicationResponseView;

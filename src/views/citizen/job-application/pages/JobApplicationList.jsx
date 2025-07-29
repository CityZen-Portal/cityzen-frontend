import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';

const municipalJobs = [
  {
    id: 1,
    title: 'Sanitary Inspector',
    description: 'Monitor sanitation and hygiene in public areas.',
    department: 'Public Health Department',
    location: 'Coimbatore Municipal Corporation',
    lastDate: '30 July 2025',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 2,
    title: 'Junior Engineer (Civil)',
    description: 'Oversee local infrastructure development projects.',
    department: 'Engineering Wing',
    location: 'Chennai Municipal Corporation',
    lastDate: '28 July 2025',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 3,
    title: 'Assistant Town Planner',
    description: 'Assist in planning city layout and zoning.',
    department: 'Urban Planning Dept.',
    location: 'Madurai Municipal Corporation',
    lastDate: '2 August 2025',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 4,
    title: 'Electrician (Grade II)',
    description: 'Maintain streetlights and civic electrical systems.',
    department: 'Electrical Maintenance',
    location: 'Tirunelveli Corporation',
    lastDate: '5 August 2025',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 5,
    title: 'Data Entry Operator',
    description: 'Manage digital records and civic data entry work.',
    department: 'Municipal Admin Office',
    location: 'Trichy Municipal Corporation',
    lastDate: '6 August 2025',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 6,
    title: 'Fire Safety Officer',
    description: 'Ensure fire safety protocols in city buildings.',
    department: 'Fire Department',
    location: 'Salem Municipal Corporation',
    lastDate: '8 August 2025',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 7,
    title: 'Public Relations Assistant',
    description: 'Coordinate communication between public and authorities.',
    department: 'Public Relations',
    location: 'Erode Municipal Corporation',
    lastDate: '10 August 2025',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 8,
    title: 'Environmental Officer',
    description: 'Implement environmental projects and inspections.',
    department: 'Environmental Cell',
    location: 'Vellore Municipal Corporation',
    lastDate: '12 August 2025',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop&crop=center'
  },
  {
    id: 9,
    title: 'Clerical Assistant',
    description: 'Support administrative tasks in municipal offices.',
    department: 'Clerical Services',
    location: 'Thanjavur Municipal Corporation',
    lastDate: '14 August 2025',
    image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&h=300&fit=crop&crop=center'
  }
];

const JobApplicationList = () => {
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);

  const handleApply = (job) => {
    setAppliedJobs((prev) => [...prev, job]);
    // alert(`Applied for ${job.title}`);
    navigate('/citizen/job-application/form');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 py-10 px-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Available Municipal Corporation Jobs
        </h2>
        <button
          onClick={() => navigate('/citizen/job-application/applications')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          View Applied Jobs
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-4 sm:px-6">
        {municipalJobs.map((job) => (
          <JobCard key={job.id} job={job} onApply={() => handleApply(job)} />
        ))}
      </div>
    </div>
  );
};

export default JobApplicationList;

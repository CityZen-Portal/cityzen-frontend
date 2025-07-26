import React, { useState } from 'react';
import { MdAddCircleOutline, MdDelete, MdLocationOn } from 'react-icons/md';

const JobApplicationForm = () => {
    const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    education: '',
  });

  const [experiences, setExperiences] = useState([
    { company: '', designation: '', duration: '' }
  ]);

  const [location, setLocation] = useState({
    street: '',
    taluk: '',
    district: '',
    state: '',
    pincode: '',
    wardNumber: '',
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
  };

  const addExperience = () => {
    setExperiences([...experiences, { company: '', designation: '', duration: '' }]);
  };

  const removeExperience = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
  };

  const handleLocationChange = (field, value) => {
    setLocation({ ...location, [field]: value });
  };

  const getLocationDetails = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const apiKey = 'pk.fa68c2e9928bf498051000f918028096';
      const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const address = data.address;

        setLocation((prev) => ({
          ...prev,
          street: address.road || address.neighbourhood || address.village || address.name || '',
          taluk: address.county || '',
          district: address.state_district || '',
          state: address.state || '',
          pincode: address.postcode || '',
        }));
      } catch (error) {
        console.error('Location fetch failed:', error);
        alert('Failed to fetch location details');
      }
    }, () => {
      alert('Unable to retrieve your location');
    });
  };
  return (
    <div className="min-h-screen bg-gray-100 py-10">
        <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-navy-900 py-6 sm:py-8 lg:py-10 px-4 sm:px-2 lg:px-8">
            <div className="bg-gray-50 dark:bg-gray-900 max-w-md sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl w-full p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-md text-black dark:text-white">
                <h2 className="text-2xl font-bold mb-6 text-center">Job Application Form</h2>

                {/* Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <label>Full Name
                    <input type="text" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
                </label>
                <label>Email
                    <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" /> 
                </label>
                <label>Phone Number
                    <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" /> 
                </label>
                <label>Date of Birth
                    <input type="date" value={formData.dob} onChange={(e) => handleInputChange('dob', e.target.value)} className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" /> 
                </label>
                <label>Gender
                    <select value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white">
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    </select>
                </label>
                <label>Highest Qualification
                    <input type="text" value={formData.education} onChange={(e) => handleInputChange('education', e.target.value)} className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white" />
                </label>
                </div>

                {/* Location Section */}
                <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MdLocationOn /> Location & Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label>Street
                    <input type="text" value={location.street} onChange={(e) => handleLocationChange('street', e.target.value)} className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white" />
                    </label>
                    <label>Taluk
                    <input type="text" value={location.taluk} onChange={(e) => handleLocationChange('taluk', e.target.value)} className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white" />
                    </label>
                    <label>District
                    <input type="text" value={location.district} onChange={(e) => handleLocationChange('district', e.target.value)} className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white" disabled />
                    </label>
                    <label>State
                    <input type="text" value={location.state} onChange={(e) => handleLocationChange('state', e.target.value)} className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white" disabled />
                    </label>
                    <label>Pincode
                    <input type="text" value={location.pincode} onChange={(e) => handleLocationChange('pincode', e.target.value)} className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white" disabled />
                    </label>
                    <label>Ward Number
                    <input type="text" value={location.wardNumber} onChange={(e) => handleLocationChange('wardNumber', e.target.value)} className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white" />
                    </label>
                </div>
                <div className="text-center">
                    <button onClick={getLocationDetails} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                    Get Location
                    </button>
                </div>
                </div>

                {/* Professional Experience */}
                <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Past Experience</h3>
                {experiences.map((exp, index) => (
                    <div key={index} className="border p-4 rounded mb-4 relative bg-gray-50 dark:bg-gray-700 shadow-sm">
                    <div className="absolute top-2 right-2">
                        {experiences.length > 1 && (
                        <button onClick={() => removeExperience(index)} className="text-red-600 text-xl" title="Remove Experience">
                            <MdDelete />
                        </button>
                        )}
                    </div>
                    <h4 className="text-lg font-semibold mb-4">Company {index + 1}</h4>
                    <div className="grid grid-cols-1 gap-4">
                        <label>Company Name
                        <input type="text" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white" />
                        </label>
                        <label>Job Role
                        <input type="text" value={exp.designation} onChange={(e) => handleExperienceChange(index, 'designation', e.target.value)} className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white" />
                        </label>
                        <label>Years of Experience
                        <input type="number" value={exp.duration} onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)} className="border dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-700 text-black dark:text-white" />
                        </label>
                    </div>
                    </div>
                ))}
                <button onClick={addExperience} className="text-blue-600 flex items-center gap-2 mt-2">
                    <MdAddCircleOutline /> Add Experience
                </button>
                </div>

                {/* Submit */}
                <div className="text-center">
                <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
                    Submit Application
                </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default JobApplicationForm;

import React, { useState } from 'react';
import { MdAddCircleOutline, MdDelete } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// This is a mock API function to CREATE a new application.
// Replace this with your actual API call.
const createJobApplication = async (data) => {
  console.log('Creating new application:', data);
  // Simulate an API call to your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      // Let's pretend the API returns the new ID of the application
      const newJobId = Math.floor(Math.random() * 1000);
      resolve({ success: true, message: 'Application submitted successfully!', jobId: newJobId });
    }, 1000);
  });
};

const JobApplicationForm = () => {
  const navigate = useNavigate();

  // All state now starts empty, as requested.
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', age: '', gender: '', education: ''
  });

  const [experiences, setExperiences] = useState([
    { company: '', role: '', experience: '' }
  ]);

  const [location, setLocation] = useState({
    street: '', taluk: '', district: '', state: '', pincode: '', wardNumber: '',
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
    setExperiences([...experiences, { company: '', role: '', experience: '' }]);
  };

  const removeExperience = (index) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
  };

  const handleLocationChange = (field, value) => {
    setLocation({ ...location, [field]: value });
  };

  const getLocationDetails = () => {
    // Your geolocation logic remains perfectly fine.
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = 'pk.fa68c2e9928bf498051000f918028096'; // Consider moving this to a .env file
        const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`;
        try {
            const response = await fetch(url );
            const data = await response.json();
            const address = data.address;
            setLocation((prev) => ({
                ...prev,
                street: address.road || '',
                taluk: address.county || '',
                district: address.state_district || '',
                state: address.state || '',
                pincode: address.postcode || '',
            }));
            toast.success("Location fetched successfully!");
        } catch (error) {
            toast.error("Unable to fetch your location.");
        }
    }, () => {
        toast.error("Unable to access your location. Please enable location services.");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- FORM VALIDATION ---
    if (!formData.fullName.trim()) return toast.error('Please enter your name');
    // ... (your other validation checks go here)

    const applicationData = { formData, location, experiences };

    try {
      // Use the create API function now
      const response = await createJobApplication(applicationData);
      if (response.success) {
        toast.success(response.message);
        // Navigate to the response page for the newly created job
        setTimeout(() => {
          navigate(`/citizen/job-application/response/${response.jobId}`);
        }, 2500);
      } else {
        toast.error(response.message || 'Failed to submit application.');
      }
    } catch (error) {
      toast.error('An error occurred during submission.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-navy-900 py-10 px-4">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="bg-gray-50 dark:bg-gray-900 max-w-3xl w-full p-8 rounded-xl shadow-md text-black dark:text-white mx-auto">
          {/* Changed title to reflect creation */}
          <h2 className="text-2xl font-bold mb-6 text-center">Job Application Form</h2>

          {/* Personal Info */}
          <h3 className="text-xl font-semibold mb-6 mt-8 text-center">Personal Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* All fields are now blank initially */}
            <div>
              <label className="block font-bold text-sm sm:text-base mb-1">Full Name</label>
              <input type="text" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block font-bold text-sm sm:text-base mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block font-bold text-sm sm:text-base mb-1">Phone Number</label>
              <input type="number" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
            </div>
            <div>
              <label className="block font-bold text-sm sm:text-base mb-1">Age</label>
              <input type="number" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
            </div>
            <div>
              <label className="block font-bold text-sm sm:text-base mb-1">Gender</label>
              <select value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-sm sm:text-base mb-1">Highest Qualification</label>
              <input type="text" value={formData.education} onChange={(e) => handleInputChange('education', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6 mt-14 text-center">Location & Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <label className="block font-bold text-sm sm:text-base mb-1">Street<input type="text" value={location.street} onChange={(e) => handleLocationChange('street', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500" /></label>
              <label className="block font-bold text-sm sm:text-base mb-1">Taluk<input type="text" value={location.taluk} onChange={(e) => handleLocationChange('taluk', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500" /></label>
              <label className="block font-bold text-sm sm:text-base mb-1">District<input type="text" value={location.district} onChange={(e) => handleLocationChange('district', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500" /></label>
              <label className="block font-bold text-sm sm:text-base mb-1">State<input type="text" value={location.state} onChange={(e) => handleLocationChange('state', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500" /></label>
              <label className="block font-bold text-sm sm:text-base mb-1">Pincode<input type="number" value={location.pincode} onChange={(e) => handleLocationChange('pincode', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /></label>
              <label className="block font-bold text-sm sm:text-base mb-1">Ward Number<input type="number" value={location.wardNumber} onChange={(e) => handleLocationChange('wardNumber', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /></label>
            </div>
            <div className="text-center">
              <button type="button" onClick={getLocationDetails} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Get Location</button>
            </div>
          </div>

          {/* Professional Experience */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6 mt-14 text-center">Past Experience</h3>
            {experiences.map((exp, index) => (
              <div key={index} className="border border-gray-300 dark:border-gray-600 p-4 rounded mb-4 relative bg-gray-50 dark:bg-navy-800 shadow-sm">
                <div className="absolute top-2 right-2">{experiences.length > 1 && (<button type="button" onClick={() => removeExperience(index)} className="text-red-600 text-xl" title="Remove Experience"><MdDelete /></button>)}</div>
                <h4 className="text-lg font-semibold mb-4">Company {index + 1}</h4>
                <div className="grid grid-cols-1 gap-4">
                  <label className="block font-bold text-sm sm:text-base mb-1">Company Name<input type="text" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500" /></label>
                  <label className="block font-bold text-sm sm:text-base mb-1">Job Role<input type="text" value={exp.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500" /></label>
                  <label className="block font-bold text-sm sm:text-base mb-1">Years of Experience<input type="number" value={exp.experience} onChange={(e) => handleExperienceChange(index, 'experience', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /></label>
                </div>
              </div>
            ))}
            <button type="button" onClick={addExperience} className="text-blue-600 flex items-center gap-2 mt-2"><MdAddCircleOutline /> Add Experience</button>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Submit Application</button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default JobApplicationForm;

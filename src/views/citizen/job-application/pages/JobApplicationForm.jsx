import React, { useState } from 'react';
import { MdAddCircleOutline, MdDelete, MdLocationOn } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


// const JobApplicationForm = ({ onFormSubmit, initialData }) => {
//   const [formData, setFormData] = useState(initialData?.formData || {
//     fullName: '', email: '', phone: '', age: '', gender: '', education: ''
//   });

//   const [experiences, setExperiences] = useState(initialData?.experiences || [
//     { company: '', role: '', experience: '' }
//   ]);

//   const [location, setLocation] = useState(initialData?.location || {
//     street: '', taluk: '', district: '', state: '', pincode: '', wardNumber: '',
//   });

const JobApplicationForm = ({ onFormSubmit, initialData }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialData?.formData || {
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    education: '',
  });

  const [experiences, setExperiences] = useState(initialData?.experiences || [
    { company: '', role: '', experience: '' }
  ]);

  const [location, setLocation] = useState(initialData?.location || {
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
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser", {
              position: 'top-right',
              autoClose: 3000,
              theme: 'colored',
      });
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
        toast.error("Unable to fetch your location", {
              position: 'top-right',
              autoClose: 3000,
              theme: 'colored',
        });
      }
    }, () => {
      toast.error("Unable to fetch your location", {
              position: 'top-right',
              autoClose: 3000,
              theme: 'colored',
        });
    });
  };
  const handleSubmit = (e) => {
  e.preventDefault();

  // Personal Info validation
  if (!formData.fullName.trim()) {
    toast.error('Please enter your name');
    return;
  }
  if (!formData.email.trim()) {
    toast.error('Please enter your email');
    return;
  }
  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    toast.error('Please enter a valid email');
    return;
  }
  if (!formData.phone.trim()) {
    toast.error('Please enter your phone number');
    return;
  }
  if (!/^\d{10}$/.test(formData.phone)) {
    toast.error('Please enter a valid 10-digit phone number');
    return;
  }
  if (!formData.age) {
    toast.error('Please enter your age');
    return;
  }
  if (formData.age < 18) {
    toast.error('You must be at least 18 years old to apply');
    return;
  }
  if (!formData.gender) {
    toast.error('Please select your gender');
    return;
  }
  if (!formData.education.trim()) {
    toast.error('Please enter your highest qualification');
    return;
  }

  // Location validation
  if (!location.street.trim()) {
    toast.error('Please enter your street');
    return;
  }
  if (!location.taluk.trim()) {
    toast.error('Please enter your taluk');
    return;
  }
  if (!location.district.trim()) {
    toast.error('Please enter your district');
    return;
  }
  if (!location.state.trim()) {
    toast.error('Please enter your state');
    return;
  }
  if (!location.pincode.trim()) {
    toast.error('Please enter your pincode');
    return;
  }
  if (!/^\d{6}$/.test(location.pincode)) {
    toast.error('Please enter a valid 6-digit pincode');
    return;
  }
  if (!location.wardNumber.trim()) {
    toast.error('Please enter your ward number');
    return;
  }
  if (!/^\d+$/.test(location.wardNumber)) {
    toast.error('Ward number must be numeric');
    return;
  }

  // Experience validation
  for (let i = 0; i < experiences.length; i++) {
  const exp = experiences[i];

  if (!(exp.company || '').trim()) {
    toast.error(`Please enter company name for experience ${i + 1}`);
    return;
  }

  if (!(exp.role || '').trim()) {
    toast.error(`Please enter job role for experience ${i + 1}`);
    return;
  }

  if (!(exp.experience || '').trim()) {
    toast.error(`Please enter years of experience for experience ${i + 1}`);
    return;
  }

  if (!/^\d+$/.test((exp.experience || '').trim())) {
    toast.error(`Experience for company ${i + 1} must be numeric`);
    return;
  }

  navigate('/citizen/job-application/applications');
}


  // Success
// Success toast before navigating
toast.success('Application submitted successfully!', {
  position: 'top-right',
  autoClose: 2000,
  theme: 'colored',
});

// Delay calling onFormSubmit to give the toast time to show
setTimeout(() => {
  onFormSubmit(formData, location, experiences);
}, 2500);


};

  return (
    // <div className="min-h-screen bg-navy-900 py-10">
        <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-navy-900 py-6 sm:py-8 lg:py-10 px-4 sm:px-2 lg:px-8">
          <form onSubmit={handleSubmit}>
            <div className="bg-gray-50 dark:bg-gray-900 max-w-md sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl w-full p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-md text-black dark:text-white">
                <h2 className="text-2xl font-bold mb-6 text-center">Job Application Form</h2>

                {/* Personal Info */}
                <h3 className="text-xl font-semibold mb-6 mt-14 text-center">Personal Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Full Name
                    <input type="text" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal" />
                </label>
                <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Email
                    <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal" /> 
                </label>
                <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Phone Number
                    <input type="number" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /> 
                </label >
                <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Age
                    <input type="number" value={formData.age} onChange={(e) => handleInputChange('age', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" /> 
                </label>
                <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Gender
                    <select value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal">
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                    </select>
                </label>
                <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Highest Qualification
                    <input type="text" value={formData.education} onChange={(e) => handleInputChange('education', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal" />
                </label>
                </div>

                {/* Location Section */}
                <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6 mt-14 text-center">
                    Location & Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Street
                    <input type="text" value={location.street} onChange={(e) => handleLocationChange('street', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal" />
                    </label>
                    <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Taluk
                    <input type="text" value={location.taluk} onChange={(e) => handleLocationChange('taluk', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal" />
                    </label>
                    <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">District
                    <input type="text" value={location.district} onChange={(e) => handleLocationChange('district', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal" />
                    </label>
                    <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">State
                    <input type="text" value={location.state} onChange={(e) => handleLocationChange('state', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal" />
                    </label>
                    <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Pincode
                    <input type="number" value={location.pincode} onChange={(e) => handleLocationChange('pincode', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
                    </label>
                    <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Ward Number
                    <input type="number" value={location.wardNumber} onChange={(e) => handleLocationChange('wardNumber', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
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
                <h3 className="text-xl font-semibold mb-6 mt-14 text-center">Past Experience</h3>
                {experiences.map((exp, index) => (
                    <div key={index} className="border border-gray-300 dark:border-gray-600 p-4 rounded mb-4 relative bg-gray-50 dark:bg-navy-700 shadow-sm">
                    <div className="absolute top-2 right-2">
                        {experiences.length > 1 && (
                        <button onClick={() => removeExperience(index)} className="text-red-600 text-xl" title="Remove Experience">
                            <MdDelete />
                        </button>
                        )}
                    </div>
                    <h4 className="text-lg font-semibold mb-4">Company {index + 1}</h4>
                    <div className="grid grid-cols-1 gap-4">
                        <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Company Name
                        <input type="text" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal" />
                        </label>
                        <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Job Role
                        <input type="text" value={exp.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal" />
                        </label>
                        <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Years of Experience
                        <input type="number" value={exp.experience} onChange={(e) => handleExperienceChange(index, 'experience', e.target.value)} className="w-full border mt-2 px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-normal [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" />
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
                  <button type="submit" onSubmit={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                    Submit Application
                  </button>
                </div>

                
            </div></form>
            <ToastContainer />
        </div>
    // </div>
  );
};

export default JobApplicationForm;

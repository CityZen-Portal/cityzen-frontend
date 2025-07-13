import React, { useState } from 'react';

function ComplaintForm() {
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [wardNumber, setWardNumber] = useState('');
  const [pincode, setPincode] = useState('');
  const [complaintType, setComplaintType] = useState('');
  const [others, setOthers] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!location.trim()) return alert('Please enter a location');
    if (!address.trim()) return alert('Please enter an address');
    if (wardNumber && !/^[0-9]+$/.test(wardNumber)) {
      return alert('Ward number must be numeric');
    }
    if (!/^[0-9]{6}$/.test(pincode)) {
      return alert('Please enter a valid 6-digit pincode');
    }
    if (!complaintType.trim()) return alert('Please select a complaint type');
    if (complaintType === 'Other' && !others.trim()) {
      return alert('Please describe the issue under "Other"');
    }
    if (!description.trim()) return alert('Please enter a description');
    if (!imageFile) return alert('Please upload the PDF');
    if (imageFile && imageFile.type !== 'application/pdf') {
      return alert('Only PDF files are allowed.');
    }

    console.log('Submitting complaint:', {
      location,
      address,
      wardNumber,
      pincode,
      complaintType,
      others,
      title,
      description,
      imageFile,
    });
    setLocation('');
    setAddress('');
    setWardNumber('');
    setPincode('');
    setComplaintType('');
    setOthers('');
    setTitle('');
    setDescription('');
    setImageFile(null);

    alert('Complaint submitted successfully!');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 dark:bg-navy-900 py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-gray-50 dark:bg-gray-900 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl w-full p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-md text-black dark:text-white">
        <h1 className="font-bold text-center text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6">Complaint Form</h1>
        <form className="space-y-3 sm:space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
          <h2 className="font-bold text-center text-base sm:text-lg lg:text-xl">Location & Address</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div>
              <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border px-3 sm:px-4 py-2 sm:py-3 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border px-3 sm:px-4 py-2 sm:py-3 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div>
              <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Ward Number</label>
              <input
                type="text"
                value={wardNumber}
                onChange={(e) => setWardNumber(e.target.value)}
                className="w-full border px-3 sm:px-4 py-2 sm:py-3 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full border px-3 sm:px-4 py-2 sm:py-3 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm sm:text-base"
              />
            </div>
          </div>

          <h2 className="font-bold text-center pt-2 sm:pt-4 text-base sm:text-lg lg:text-xl">Complaint Details</h2>

          <div>
            <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Complaint Type</label>
            <select
              value={complaintType}
              onChange={(e) => setComplaintType(e.target.value)}
              className="w-full border px-4 sm:px-6 py-2 sm:py-3 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm sm:text-base"
            >
              <option value="">-- Select Complaint Type --</option>
              <option value="Water Leakage">Water Leakage</option>
              <option value="No Water Supply">No Water Supply</option>
              <option value="Contaminated Water">Contaminated Water</option>
              <option value="Garbage not collected">Garbage not collected</option>
              <option value="Blocked Drainage">Blocked Drainage</option>
              <option value="Potholes on road">Potholes on road</option>
              <option value="Broken street signage">Broken street signage</option>
              <option value="Street light not working">Street light not working</option>
              <option value="Flickering light">Flickering light</option>
              <option value="Illegal Construction">Illegal Construction</option>
              <option value="Stray Animal Problem">Stray Animal Problem</option>
              <option value="Noise Pollution">Noise Pollution</option>
              <option value="Corruption">Corruption</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {complaintType === 'Other' && (
            <div>
              <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Please specify the issue</label>
              <textarea
                rows="3"
                value={others}
                onChange={(e) => setOthers(e.target.value)}
                placeholder="Describe your complaint"
                className="w-full border px-3 sm:px-4 py-2 sm:py-3 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm sm:text-base resize-none"
              ></textarea>
            </div>
          )}

          <div>
            <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Issue</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-3 sm:px-4 py-2 sm:py-3 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-3 sm:px-4 py-2 sm:py-3 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-900 text-sm sm:text-base resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
            {imageFile && (
              <p className="text-xs sm:text-sm text-green-600 mt-1">Selected: {imageFile.name}</p>
            )}
          </div>

          <div className="text-center pt-2 sm:pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-md hover:bg-blue-700 text-sm sm:text-base lg:text-lg transition-colors duration-200 w-full sm:w-auto"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ComplaintForm;
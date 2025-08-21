import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import loading_gif from '../../../../assets/gif/loading-gif.gif'
import FileUpload from '../components/FileUpload';

function ComplaintForm() {
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const citizenId = localStorage.getItem("id")

  const HELPDESK_API = process.env.REACT_APP_API_HELPDESK_URL;
  const MEDIA_UPLOAD_API = process.env.REACT_APP_API_MEDIA_URL;
  
  const navigate = useNavigate();
  const [loadingSubmit, setLoadingSubmit] = useState(false);  
  
  const [complaintType, setComplaintType] = useState('');
  const [others, setOthers] = useState('');
  const [issue, setIssue] = useState('Drinking Water is contaminated for 2 days.');
  const [description, setDescription] = useState('Drinking Water is contaminated for 2 days.');
  const [file, setFile] = useState(null);

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [pincode, setPincode] = useState("");
  const [street, setStreet] = useState('');
  const [wardNumber, setWardNumber] = useState('');

  const setLocationDetails = (address) => {

    if(address.length <= 5){
      toast.error("Received unexpected response", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
      return;
    }

    setStreet(address.road)
    setTaluk(address.suburb)
    setDistrict(address.state_district)
    setState(address.state)
    setPincode( Number(address.postcode))
  };

  const options = {method: 'GET', headers: {accept: 'application/json'}};
  const LOCATION_BASE_URL = 'https://us1.locationiq.com/v1/reverse'

  const getLocation = async () => {
    const LOCATIONIQ_API_KEY = "pk.fa68c2e9928bf498051000f918028096";

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          
          const response = await fetch(`${LOCATION_BASE_URL}?key=${LOCATIONIQ_API_KEY}&lat=${latitude}&lon=${longitude}&format=json`, options); // https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=8eb4c196fb814a5eb2a97f5ba78b9b21&format=json
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const data = await response.json();
          
          console.log(data);
          const address = data.address;

          setLocationDetails(address); // Setting the Location details
        } catch (error) {
          console.error("Error fetching location:", error);
          toast.error("Unable to fetch Location", {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
          });
        }
      }, (err) => {
        toast.error("Failed to get geolocation:" + err.message, {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        });
      });
    } else {
      
      toast.error("Geolocation is not supported by this browser", {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }
  };


  const [uploadedFile, setUploadedFile] = useState({ fileName: "", filePath: "" });

  const handleBack = () => {
    navigate('/citizen/help-desk');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    if (!street.trim()) {
      setLoadingSubmit(false)
      toast.error('Please enter the street');
      return;
    }
    if (!taluk.trim()) {
      setLoadingSubmit(false)
      toast.error('Please enter taluk');
      return;
    }
    if (!district.trim()) {
      setLoadingSubmit(false)
      toast.error('Please enter district');
      return;
    }
    if (!state.trim()) {
      setLoadingSubmit(false)
      toast.error('Please enter state');
      return;
    }
    if(!pincode){
      setLoadingSubmit(false)
      toast.error('Please enter pincode');
      return;
    }
    if (!/^[0-9]{6}$/.test(pincode)) {
      setLoadingSubmit(false)
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    if(!wardNumber){
      setLoadingSubmit(false)
      toast.error('Please enter Ward Number');
      return;
    }
    if (!/^[0-9]+$/.test(wardNumber)) {
      setLoadingSubmit(false)
      toast.error('Ward number must be numeric');
      return;
    }
    if (!complaintType.trim()) {
      setLoadingSubmit(false)
      toast.error('Please select a complaint type');
      return;
    }
    if (complaintType === 'Other' && !others.trim()) {
      setLoadingSubmit(false)
      toast.error('Please describe the issue under "Other"');
      return;
    }
    if(!issue.trim()){
      setLoadingSubmit(false)
      toast.error('Please enter the issue');
      return;
    }
    if (!description.trim()) {
      setLoadingSubmit(false)
      toast.error('Please enter a description');
      return;
    }
    if (file) {
      
      if (!(file instanceof File)) {
          setLoadingSubmit(false);
          toast.error('Invalid file input.');
          return;
      }

      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      if (!isImage && !isPdf) {
          setLoadingSubmit(false);
          toast.error('Only PDF or Image files are allowed.');
          return;
      }

      const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
      if (file.size > maxSize) {
          setLoadingSubmit(false);
          toast.error('File size should not exceed 5 MB.');
          return;
      }
    }

    let uploadedFile = { fileName: "", filePath: "" };
    let filePath = "";

    if (file && !uploadedFile.filePath) {
      try {
        const fileType = file.type;
        const serviceName = "helpdesk";
        let uploadUrl = "";
        let formData = new FormData();

        if (fileType.startsWith("image/")) {
          uploadUrl = `${MEDIA_UPLOAD_API}/api/images/upload`;
          formData.append("name", serviceName);
          formData.append("imageFile", file);
        } else if (fileType === "application/pdf") {
          uploadUrl = `${MEDIA_UPLOAD_API}/api/images/upload/base`;
          formData.append("name", serviceName);
          formData.append("file", file);
        }

        const fileRes = await axios.post(uploadUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log(fileRes)

        if (fileType.startsWith("image/")) {
          filePath = fileRes.data.data.path;
          setUploadedFile({
            fileName: fileRes.data.data.name,
            filePath: fileRes.data.data.path,
          });
        }
        else if (fileType === "application/pdf") {
          filePath = fileRes.data;
          console.log(fileRes.data);
          setUploadedFile({
            filePath: fileRes.data,
          });
        }
        
      } catch (error) {
        setLoadingSubmit(false);
        toast.error("Upload failed. Please try again.");
        console.error(error);
        return;
      }
    }

    const postData = {
      citizenId,
      street,
      taluk,
      district,
      state,
      pincode,
      wardNumber,
      category: complaintType !== "Other" ? complaintType : others,
      issue,
      issueDescription: description,
      attachment: filePath ? filePath : null,
    };


    axios.post(`${HELPDESK_API}/citizen/complaint-form`, postData,
      {
        headers:{
          token,
          email,
          id: citizenId
        }
      }
    )
    .then(res => {
      console.log('Response:', res.data);
      toast.success('Complaint submitted successfully!', {
        position: 'top-right',
        autoClose: 1000,
        theme: 'colored'
      });

      setTimeout(() => {
        navigate('/citizen/help-desk/');
      }, 1500);
    })
    .catch(err => {
      console.error('Error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Server Error!Unable to Submit Complaint', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored'
      });
      return;
    })
    .finally(() => {
      setLoadingSubmit(false);
    });
  };

  useEffect(() => {
    document.body.style.overflow = loadingSubmit ? 'hidden' : 'auto';
  }, [loadingSubmit]);


  return (
    <div 
      className="relative flex items-center justify-center min-h-screen py-6 sm:py-8 lg:py-10 px-4 sm:px-2 lg:px-8"
      style={{ overflow: loadingSubmit ? 'hidden' : 'auto' }}
    >
      {/* Loading */}
      { loadingSubmit && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <img
            src={loading_gif}
            alt="Loading..."
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
        </div>
      )}
      <div className="bg-gray-50 dark:bg-navy-900 max-w-4xl w-full p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-md text-black dark:text-white">
      <div className="flex items-center gap-4 mb-6">
        <button
        onClick={handleBack}
        className="bg-brand-500 text-white font-bold px-4 py-2 rounded-md hover:bg-brand-600 text-sm transition-colors duration-200 w-full sm:w-auto outline-none focus:ring-2 focus:ring-brand-600"
        title="Back to helpdesk"
        >
        Back to Help Desk
        </button>
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 max-w-md sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl w-full p-4 sm:p-6 lg:p-6 rounded-lg sm:rounded-xl shadow-md text-black dark:text-white">
        
        <h1 className="font-bold text-center text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6">Complaint Form</h1>
        <form className="space-y-3 sm:space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
          <h2 className="font-bold text-center text-base sm:text-lg lg:text-xl">Location & Address</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div>
              <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Street</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Taluk</label>
              <input
                type="text"
                value={taluk}
                onChange={(e) => setTaluk(e.target.value)}
                className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">District</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Ward Number</label>
              <input
                type="text"
                value={wardNumber}
                onChange={(e) => setWardNumber(e.target.value)}
                className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div className=' w-full flex align-middle justify-center items-center col-span-2'>
            <button 
              type="button" 
              className="bg-brand-500 text-white font-bold px-9 py-2 rounded-md hover:bg-brand-600 text-sm transition-colors duration-200 w-max sm:w-auto outline-none focus:ring-2 focus:ring-brand-500"
              onClick={() => getLocation()}
            >
              Get Location
            </button>
          </div>

          <h2 className="font-bold text-center pt-2 sm:pt-4 text-base sm:text-lg lg:text-xl">Complaint Details</h2>

          <div>
            <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Complaint Type</label>
            <select
              value={complaintType}
              onChange={(e) => setComplaintType(e.target.value)}
              className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            >
              <option value="" disabled>-- Select Complaint Type --</option>
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
                className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              ></textarea>
            </div>
          )}

          <div>
            <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Issue</label>
            <input
              type="text"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-sm sm:text-base mb-1 sm:mb-2">Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-3 py-2 rounded-md bg-white text-gray-800 dark:text-white dark:border-gray-700 dark:bg-navy-700 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            ></textarea>
          </div>

          <FileUpload
            file={file}
            setFile={setFile}
          />


          <div className="text-center pt-2 sm:pt-4">
            <button
              disabled={loadingSubmit}
              type="submit"
              className="bg-brand-500 text-white font-bold px-9 py-2 rounded-md hover:bg-brand-600 text-sm transition-colors duration-200 w-max sm:w-auto outline-none focus:ring-2 focus:ring-brand-500"
            >
              Submit Complaint
            </button>
          </div>
        </form>

        {/* ToastContainer renders the toasts */}
        <ToastContainer />
      </div>
    </div>
    </div>
  );
}

export default ComplaintForm;

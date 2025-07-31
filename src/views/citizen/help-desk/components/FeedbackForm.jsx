import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import loading_gif from '../../../../assets/img/loading/loading_gif.gif';
import axios from "axios";

const FeedbackForm = () => {
  const token = localStorage.getItem("token")
  const email = localStorage.getItem("email")
  const citizenId = localStorage.getItem("id")

  const HELPDESK_API = process.env.REACT_APP_API_HELPDESK_URL;
  
  const {id} = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Jeghan",
    complaintId: "7689",
    complaint: "Water Supply Issue",
    comments: "",
    rating: 0,
    isResolved: "",
  });

  const [loading, setLoading] = useState(false);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRating = (rate) => {
    setFormData((prev) => ({ ...prev, rating: rate }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setLoading(true);

    if (!formData.name.trim() || !formData.complaintId.trim() || !formData.complaint.trim()) {
      toast.error("Missing complaint data", {
        position: "top-right",
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    if (!formData.isResolved) {
      toast.error("Please select if the issue was resolved", {
        position: "top-right",
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    if (!formData.rating) {
      toast.error("Please provide a rating", {
        position: "top-right",
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    const feedback = {
      isResolved: (formData.isResolved).toLowerCase() === 'yes',
      rating: formData.rating,
      comments: formData.comments
    }

    axios.put(`${HELPDESK_API}/citizen/complaints/${id}/feedback`, feedback,
      {
        headers:{
          token,
          email,
          id: citizenId
        }
      }
    )
      .then(() => {
          toast.success("Feedback Submitted Successfully!", {
            position: "top-right",
            autoClose: 1000,
            theme: "colored",
            onClose: () => navigate("/citizen/help-desk/complaint/log"),
          });
          return;
        })
        .catch(err => {
          toast.error('Server Error! Unable to Submit Feedback', {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored'
          });
          console.error('Error:', err.response?.data || err.message);
        })
        .finally(() => setLoading(false)); 

    console.log(feedback);    
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <img
            src={loading_gif}
            alt="Loading..."
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-navy-700 rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 w-[95vw] max-w-md sm:max-w-lg lg:max-w-2xl"
      >
        <h2 className="text-center font-semibold text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 text-black dark:text-white">
          Feedback Form
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div>
            <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base text-black dark:text-white">
              Complaint ID
            </label>
            <input
              type="text"
              name="complaintId"
              value={id}
              disabled
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-navy-800 dark:text-white rounded px-3 py-2 text-sm sm:text-base"
            />
          </div>

          {/* <div>
            <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base text-black dark:text-white">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-navy-800 dark:text-white rounded px-3 py-2 text-sm sm:text-base"
            />
          </div> */}
        </div>

        {/* <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base text-black dark:text-white">
          Complaint
        </label>
        <input
          type="text"
          name="complaint"
          value={formData.complaint}
          disabled
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-navy-800 dark:text-white rounded px-3 py-2 mb-4 sm:mb-6 text-sm sm:text-base"
        /> */}

        <label className="block mb-2 sm:mb-3 font-medium text-sm sm:text-base text-black dark:text-white">
          Was the issue resolved?
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-6">
          {["Yes", "No"].map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="isResolved"
                value={option}
                onChange={handleChange}
                className="accent-black dark:accent-white h-4 w-4"
              />
              <span className="text-black dark:text-white text-sm sm:text-base">{option}</span>
            </label>
          ))}
        </div>

        <label className="block mb-2 sm:mb-3 font-medium text-sm sm:text-base text-black dark:text-white">
          Rating
        </label>
        <div className="flex justify-center sm:justify-start space-x-2 sm:space-x-4 lg:space-x-6 mb-4 sm:mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleRating(star)}
              className={`text-2xl sm:text-3xl lg:text-4xl cursor-pointer transition-colors duration-200 ${
                formData.rating >= star ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base text-black dark:text-white">
          Comments (Optional)
        </label>
        <textarea
          name="comments"
          placeholder="Enter Comments"
          value={formData.comments}
          onChange={handleChange}
          rows="4"
          className="w-full border border-gray-300 dark:border-gray-700 dark:bg-navy-800 dark:text-white rounded px-3 py-2 mb-4 sm:mb-6 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="w-full sm:w-2/3 lg:w-2/6 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full font-bold text-sm sm:text-base lg:text-lg shadow-md transition-all duration-200 bg-blue-700 hover:bg-blue-800"
          >
            Submit <span className="animate-pulse"></span>
          </button>
        </div>
      </form>

      {/* Toastify container */}
      <ToastContainer />
    </div>
  );
};

export default FeedbackForm;

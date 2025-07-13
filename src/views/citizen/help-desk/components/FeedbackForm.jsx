import React, { useState } from "react";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    complaintId: "",
    complaint: "",
    comments: "",
    rating: 0,
    resolved: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRating = (rate) => {
    setFormData((prev) => ({ ...prev, rating: rate }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Feedback Submitted Successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-navy-700 rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 lg:p-8 w-full max-w-xs sm:max-w-md lg:max-w-2xl"
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
              placeholder="Enter Complaint ID"
              value={formData.complaintId}
              onChange={handleChange}
              disabled
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-navy-800 dark:text-white rounded px-3 py-2 text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base text-black dark:text-white">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              disabled
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-navy-800 dark:text-white rounded px-3 py-2 text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        <label className="block mb-1 sm:mb-2 font-medium text-sm sm:text-base text-black dark:text-white">
          Complaint
        </label>
        <input
          type="text"
          name="complaint"
          placeholder="Enter Complaint"
          value={formData.complaint}
          onChange={handleChange}
          disabled
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-navy-800 dark:text-white rounded px-3 py-2 mb-4 sm:mb-6 text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500"
        />

        <label className="block mb-2 sm:mb-3 font-medium text-sm sm:text-base text-black dark:text-white">
          Was the issue resolved?
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4 sm:mb-6">
          {["Yes", "No"].map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="resolved"
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
          Comments
        </label>
        <textarea
          name="comments"
          placeholder="Enter Comments"
          value={formData.comments}
          onChange={handleChange}
          rows="4"
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-navy-800 dark:text-white rounded px-3 py-2 mb-4 sm:mb-6 text-sm sm:text-base placeholder-gray-400 dark:placeholder-gray-500 resize-none"
        />
        
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="w-full sm:w-2/3 lg:w-2/6 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-full font-bold text-sm sm:text-base lg:text-lg shadow-md transition-all duration-200 dark:text-white bg-blue-700 hover:bg-blue-800"
          >
            Submit <span className="animate-pulse"></span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
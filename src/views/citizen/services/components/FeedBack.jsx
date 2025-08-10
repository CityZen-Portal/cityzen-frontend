import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
function FeedBack() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userName = localStorage.getItem("userName");
    const date = new Date().toISOString();

    const data = {
      name: userName,
      description: feedback,
      date,
    };
    console.log(data);

    try {
      await axios.post(
        "https://utility-booking-backend.onrender.com/api/feedback/add",
        data
      );
      toast.success("Feedback submitted!");
      setTimeout(() => {
        navigate("/citizen/Services");
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center pt-12 md:p-12">
      <div className="mx-auto w-full max-w-[700px] rounded-lg bg-white p-8 dark:border-navy-700 dark:bg-navy-700">
        <div className="flex items-center justify-between px-4 pt-4">
          <button
            onClick={() => navigate("/citizen/Services")}
            className="mb-2 flex items-center gap-1 text-blue-500 transition-colors hover:text-blue-600"
            type="button"
          >
            <span>←</span> Back
          </button>
        </div>
        <h2 className="mb-6 text-2xl font-semibold dark:text-white">
          Feedback Form
        </h2>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="feedbackText"
            className="m-3 block text-base font-semibold text-[#07074D] dark:text-white sm:text-xl"
          >
            Your Feedback
          </label>
          <textarea
            id="feedbackText"
            rows="6"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required
          />
          <div className="mb-5 mt-6 flex justify-center">
            <button
              type="submit"
              className="hover:shadow-form rounded-md bg-[#6A64F1] px-4 py-3 text-center text-base font-semibold text-white outline-none"
            >
              Submit Feedback
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
}

export default FeedBack;

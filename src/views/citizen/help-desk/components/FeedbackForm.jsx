import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loading_gif from "../../../../assets/img/loading/loading_gif.gif";
import axios from "axios";

const FeedbackForm = () => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const citizenId = localStorage.getItem("id");

  const HELPDESK_API = process.env.REACT_APP_API_HELPDESK_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    isResolved: "",
    rating: 0,
    comments: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRating = (rate) => {
    setFormData((prev) => ({ ...prev, rating: rate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.isResolved) {
      toast.error("Please select if the issue was resolved", {
        position: "top-right",
        autoClose: 1000,
        theme: "colored",
      });
      setLoading(false);
      return;
    }

    if (formData.isResolved === "Yes" && formData.rating === 0) {
      toast.error("Please provide a rating", {
        position: "top-right",
        autoClose: 1000,
        theme: "colored",
      });
      setLoading(false);
      return;
    }

    try {
      await axios.put(
        `${HELPDESK_API}/citizen/complaints/${id}/feedback`,
        {
          isResolved: formData.isResolved === "Yes",
          rating: formData.rating,
          comments: formData.comments,
        },
        {
          headers: {
            token,
            email,
            id: citizenId,
          },
        }
      );

      toast.success("Feedback Submitted Successfully!", {
        position: "top-right",
        autoClose: 1000,
        theme: "colored",
        onClose: () => navigate("/citizen/help-desk/complaint/log"),
      });
    } catch (err) {
      console.error("Error submitting feedback:", err.response?.data || err);
      toast.error("Server Error! Unable to Submit Feedback", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Loading overlay */}
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
        className="bg-white dark:bg-navy-700 rounded-lg shadow-lg p-6 w-[95vw] max-w-md sm:max-w-lg lg:max-w-2xl"
      >
        <h2 className="text-center font-semibold text-lg mb-6 text-black dark:text-white">
          Feedback Form
        </h2>

        {/* Complaint ID (read-only) */}
        <div className="mb-6">
          <label className="block mb-1 font-medium text-sm text-black dark:text-white">
            Complaint ID
          </label>
          <input
            type="text"
            name="complaintId"
            value={id}
            disabled
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-navy-800 dark:text-white rounded px-3 py-2 text-base"
          />
        </div>

        {/* Resolution radio */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-sm text-black dark:text-white">
            Was the issue resolved?
          </label>
          <div className="flex space-x-6">
            {["Yes", "No"].map((opt) => (
              <label key={opt} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="isResolved"
                  value={opt}
                  checked={formData.isResolved === opt}
                  onChange={handleChange}
                  className="accent-black dark:accent-white"
                />
                <span className="text-black dark:text-white">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating (only if Yes) */}
        {formData.isResolved === "Yes" && (
          <div className="mb-6">
            <label className="block mb-2 font-medium text-sm text-black dark:text-white">
              Rating
            </label>
            <div className="flex space-x-2 text-4xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`cursor-pointer ${
                    formData.rating >= star
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comments (always optional) */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-sm text-black dark:text-white">
            Comments (Optional)
          </label>
          <textarea
            name="comments"
            rows="4"
            placeholder="Enter Comments"
            value={formData.comments}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-navy-800 dark:text-white rounded px-3 py-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-full font-bold text-base shadow-md transition"
        >
          Submit
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default FeedbackForm;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loading_gif from "../../../../assets/img/loading/loading_gif.gif";
import axios from "axios";
import { MdCheck, MdStar } from "react-icons/md";

const FeedbackForm = () => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const citizenId = localStorage.getItem("id");

  const [complaint, setComplaint] = useState({})

  const HELPDESK_API = process.env.REACT_APP_API_HELPDESK_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
  
    axios.get(`${HELPDESK_API}/citizen/complaints/${id}`,
      {
        headers:{
          token,
          email,
          id: citizenId
        }
      }
    )
      .then(res => {
          console.log('Response:', res.data.data);
          const data = res.data.data
          setComplaint(data)
        })
        .catch(err => {
          toast.error(err.response?.data?.message || "Server error! Unable to Fetch Data", {
            position: 'top-right',
            autoClose: 3000,
            theme: 'colored',
            onClose: () => navigate("/citizen/help-desk/complaint/log"),
          });
          console.error('Error:', err.response?.data || err.message);
        })
        .finally(() => {
          setLoading(false);
        });
  }, [id, complaint.id, token, email, citizenId, HELPDESK_API, navigate])

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

  const [hoverRating, setHoverRating] = useState(0);

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
      toast.error(err.response?.data?.message || "Server Error! Unable to Submit Feedback", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const InfoBlock = ({ label, value }) => (
    <div>
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-md text-gray-900 dark:text-gray-100">{value}</dd>
    </div>
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full flex items-center justify-center p-4">
      
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <img
            src={loading_gif}
            alt="Loading..."
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl grid grid-cols-1 lg:grid-cols-5 overflow-hidden">
          
          {/* --- Left Column: Information Panel --- */}
          <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-900/40 p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Feedback Details</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Please review the complaint details before sharing your experience.
              </p>
              <dl className="mt-8 space-y-6">
                <InfoBlock label="Complaint ID" value={id} />
                <InfoBlock label="Issue" value={complaint.issue} />
                <InfoBlock label="Resolved By" value={complaint.staffName} />
              </dl>
            </div>
            <p className="mt-8 text-xs text-center text-gray-400 dark:text-gray-500">
              Your feedback is confidential and helps us improve.
            </p>
          </div>

          {/* --- Right Column: Interactive Form --- */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 p-8 space-y-6">
            {/* Resolution Radio Buttons */}
            <div>
              <label className="block mb-2 text-md font-semibold text-gray-800 dark:text-white">
                Was the issue resolved to your satisfaction?
              </label>
              <div className="flex items-center space-x-4">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex-1">
                    <input
                      type="radio"
                      name="isResolved"
                      value={opt}
                      checked={formData.isResolved === opt}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="flex items-center justify-center gap-x-2 w-full text-center px-4 py-3 rounded-lg border cursor-pointer transition-all duration-200 peer-checked:border-blue-500 peer-checked:ring-1 peer-checked:ring-blue-500 peer-checked:text-blue-600 dark:peer-checked:text-blue-400 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        {opt}
                        {formData.isResolved === opt && <MdCheck />}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Conditional Star Rating */}
            {formData.isResolved === 'Yes' && (
              <div className="animate-in fade-in duration-500">
                <label className="block mb-2 text-md font-semibold text-gray-800 dark:text-white">
                  How would you rate our service?
                </label>
                <div
                  className="flex items-center space-x-1 sm:space-x-2"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <MdStar
                      key={star}
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className={`w-10 h-10 cursor-pointer transition-colors duration-200 ${
                        star <= (hoverRating || formData.rating)
                          ? "text-amber-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Comments Textarea */}
            <div>
              <label htmlFor="comments" className="block mb-2 text-md font-semibold text-gray-800 dark:text-white">
                Additional Comments (Optional)
              </label>
              <textarea
                id="comments" name="comments" rows="4"
                placeholder="What did we do well? What could we improve?"
                value={formData.comments} onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-base placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit" disabled={loading}
                className="bg-brand-500 text-white font-bold px-9 py-2 rounded-md hover:bg-brand-600 text-md transition-colors duration-200 w-max sm:w-auto outline-none focus:ring-2 focus:ring-brand-500"
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <ToastContainer
        position="bottom-right" theme="colored" autoClose={4000}
      />
    </div>

  );
};

export default FeedbackForm;

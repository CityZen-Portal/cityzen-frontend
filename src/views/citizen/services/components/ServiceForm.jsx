import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";


function ServiceForm() {
  const { serviceName } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const services = location.state?.nameOfService;
  const id = localStorage.getItem("id");
  const imagePath = location.state?.imagePath; 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    address: "",
    area: "",
    city: "",
    postcode: "",
    citizenId: id,
    services,
  });

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      axios
        .get(
          `https://auth-backend-2-k3ph.onrender.com/api/auth/getUser/${email}`
        )
        .then((res) => {
          const number = res.data?.phone || "9876543210";
          setFormData((prev) => ({
            ...prev,
            name: localStorage.getItem("userName") || "John Doe",
            email: localStorage.getItem("email") || "",
            phone: number,
          }));
        })
        .catch((err) => {
          console.error("Error fetching user info:", err);
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const now = new Date();
    const bookingDate = now.toISOString().split("T")[0];
    const bookingTime = now.toTimeString().slice(0, 5);

    const errors = [];
    // if (!formData.name.trim()) errors.push("Full Name is required.");
    // if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone))
    //   errors.push("Enter a valid 10-digit phone number.");
    // if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
    //   errors.push("Enter a valid email address.");
    if (!formData.address.trim()) errors.push("Address is required.");
    if (!formData.area.trim()) errors.push("Area is required.");
    if (!formData.city.trim()) errors.push("City is required.");
    if (!formData.postcode.trim()) errors.push("Post Code is required.");

    if (errors.length > 0) {
      errors.forEach(toast.error);
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      date: bookingDate,
      time: bookingTime,
      services: serviceName || "",
    };

    try {
      await axios.post(
        "https://utility-booking-backend.onrender.com/api/services/request/add",
        payload
      );
      toast.success("Service Booked Successfully!");
      setTimeout(() => {
        navigate("/citizen/Services");
      }, 2000);
    } catch {
      toast.error("Failed to submit form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 py-10 px-4 flex justify-center items-center">
      <div className="max-w-6xl w-full bg-white dark:bg-navy-800 rounded-xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-gray-200 dark:border-navy-700">
        
        {/* LEFT: Service Info */}
       <div className="bg-gradient-to-br from-blue-600 to-indigo-500 dark:from-blue-500/20 dark:to-indigo-500/20 p-8 text-white dark:text-gray-100 flex flex-col justify-start ">
  
  {/* Back Button */}

  <button
              type="button"
              onClick={() => navigate("/citizen/Services")}
              disabled={loading}
              className="flex items-center gap-2 dark:text-cyan-500 hover:text-gray-200 mb-4"
            >
              ← Back
            </button>

  <h1 className="text-3xl font-bold mb-4">
    {serviceName || "Selected Service"}
  </h1>

  <div>
    <img
      src={imagePath}
      alt={serviceName}
      className="w-full h-48 object-cover rounded-lg mb-4"
    />
  </div>

  <p className="opacity-90 mb-4">
    You are booking for <b>{services || serviceName}</b>. Please fill in
    your details and confirm your appointment.
  </p>
  <ul className="list-disc list-inside space-y-1 opacity-90 mt-2">
    <li>Fast & secure booking</li>
    <li>Get confirmation instantly</li>
    <li>Trusted city services</li>
  </ul>
</div>
        {/* RIGHT: Booking Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">



          {/* Description */}
          <div>
            <label className="block font-semibold mb-1 text-gray-800 dark:text-white">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 dark:border-navy-700 rounded-lg px-4 py-2 bg-white dark:bg-navy-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a brief description"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-semibold mb-1 text-gray-800 dark:text-white">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 dark:border-navy-700 rounded-lg px-4 py-2 bg-white dark:bg-navy-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Full address"
            />
          </div>

          {/* Area */}
          <div>
            <label className="block font-semibold mb-1 text-gray-800 dark:text-white">
              Area
            </label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-navy-700 rounded-lg px-4 py-2 bg-white dark:bg-navy-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Area"
            />
          </div>

          {/* City */}
          <div>
            <label className="block font-semibold mb-1 text-gray-800 dark:text-white">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-navy-700 rounded-lg px-4 py-2 bg-white dark:bg-navy-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City"
            />
          </div>

          {/* Postcode */}
          <div>
            <label className="block font-semibold mb-1 text-gray-800 dark:text-white">
              Post Code
            </label>
            <input
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-navy-700 rounded-lg px-4 py-2 bg-white dark:bg-navy-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Post code"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4">
            
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-70"
            >
              {loading && (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default ServiceForm;

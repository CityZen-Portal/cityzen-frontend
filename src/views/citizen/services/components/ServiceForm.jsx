import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ServiceForm() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const services = location.state?.nameOfService;
  const id = localStorage.getItem("id");

  const [loading, setLoading] = useState(false); // 🔹 Loader state for submit button
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "9876543210",
    date: "",
    time: "",
    address: "",
    area: "",
    city: "",
    postcode: "",
    description: "",
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
    setLoading(true); // 🔹 Start loader
    const now = new Date();
    const bookingDate = now.toISOString().split("T")[0];
    const bookingTime = now.toTimeString().slice(0, 5);

    const errors = [];
    if (!formData.name.trim()) errors.push("Full Name is required.");
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone))
      errors.push("Enter a valid 10-digit phone number.");
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      errors.push("Enter a valid email address.");
    if (!formData.address.trim()) errors.push("Address is required.");
    if (!formData.area.trim()) errors.push("Area is required.");
    if (!formData.city.trim()) errors.push("City is required.");
    if (!formData.postcode.trim()) errors.push("Post Code is required.");

    if (errors.length > 0) {
      errors.forEach(toast.error);
      setLoading(false); // 🔹 Stop loader if errors found
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
      setLoading(false); // 🔹 Stop loader after request
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center pt-12 md:p-12">
          <div className="mx-auto w-full max-w-[700px] bg-white dark:border-navy-700 dark:bg-navy-700">
            <div className="flex items-center justify-between px-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/citizen/Services")}
                className="mb-2 flex items-center gap-1 text-blue-500 transition-colors hover:text-blue-600 disabled:opacity-50"
                disabled={loading} // 🔹 Disable during loading
              >
                <span>←</span> Back
              </button>
            </div>

            {/* Description */}
            <div className="m-8">
              <label className="mb-2 block text-lg font-semibold dark:text-white">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter your description"
                className="w-full rounded-md border px-4 py-2 text-sm dark:bg-navy-600 dark:text-white"
              />
            </div>

            {/* Address */}
            <div className="m-8">
              <label className="mb-2 block text-lg font-semibold dark:text-white">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                placeholder="Enter your address"
                className="w-full rounded-md border px-4 py-2 text-sm dark:bg-navy-600 dark:text-white"
              />
            </div>

            {/* Area, City, Postcode */}
            <div className="-mx-4 flex flex-wrap">
              <div className="w-full px-6 sm:w-1/2">
                <div className="m-4">
                  <label className="mb-2 block font-semibold dark:text-white">
                    Area
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Enter area"
                    className="w-full rounded-md border px-6 py-3 dark:bg-navy-600 dark:text-white"
                  />
                </div>
              </div>
              <div className="w-full px-6 sm:w-1/2">
                <div className="m-4">
                  <label className="mb-2 block font-semibold dark:text-white">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full rounded-md border px-6 py-3 dark:bg-navy-600 dark:text-white"
                  />
                </div>
              </div>
              <div className="w-full px-6 sm:w-1/2">
                <div className="m-4">
                  <label className="mb-2 block font-semibold dark:text-white">
                    Post Code
                  </label>
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleChange}
                    placeholder="Post Code"
                    className="w-full rounded-md border px-6 py-3 dark:bg-navy-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mb-5 flex justify-center">
              <button
                type="submit"
                disabled={loading} // 🔹 Disable during loading
                className="flex items-center justify-center gap-2 rounded-md bg-[#6A64F1] px-4 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
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
                    Booking...
                  </>
                ) : (
                  "Book Appointment"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default ServiceForm;

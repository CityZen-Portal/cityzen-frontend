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

  // Prefill with localStorage OR default phone
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
    setFormData((prev) => ({
      ...prev,
      name: localStorage.getItem("name") || "John Doe",
      email: localStorage.getItem("email") || "",
      phone: localStorage.getItem("phone") || "9876543210",
    }));
    // Citizen Id may (optionally) update too
  }, []);
  console.log(formData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = [];
    if (!formData.name.trim()) errors.push("Full Name is required.");
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone))
      errors.push("Enter a valid 10-digit phone number.");
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      errors.push("Enter a valid email address.");
    if (!formData.date) errors.push("Please select a date.");
    if (!formData.time) errors.push("Please select a time.");
    if (!formData.address.trim()) errors.push("Address is required.");
    if (!formData.area.trim()) errors.push("Area is required.");
    if (!formData.city.trim()) errors.push("City is required.");
    if (!formData.postcode.trim()) errors.push("Post Code is required.");

    if (errors.length > 0) {
      errors.forEach(toast.error);
      return;
    }

    const payload = {
      ...formData,
      services: serviceName || "",
    };

    try {
      await axios.post(
        "https://utility-booking-backend.onrender.com/api/services/request/add",
        payload
      );
      toast.success("Form submitted successfully!");
      setTimeout(() => {
        navigate("/citizen/Services");
      }, 2000);
    } catch {
      toast.error("Failed to submit form.");
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
                className="mb-2 flex items-center gap-1 text-blue-500 transition-colors hover:text-blue-600"
              >
                <span>←</span> Back
              </button>
            </div>
            {/* <div className="m-8 dark:text-white">
              <label
                htmlFor="name"
                className="mb-2 block text-lg font-semibold"
              >
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full rounded-md border px-6 py-3 text-base text-[#6B7280]"
              />
            </div>
            <div className="m-8">
              <label
                htmlFor="phone"
                className="mb-2 block text-lg font-semibold dark:text-white"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full rounded-md border px-6 py-3 text-base text-[#6B7280]"
              />
            </div>
            <div className="m-8">
              <label
                htmlFor="email"
                className="mb-2 block text-lg font-semibold dark:text-white"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full rounded-md border px-6 py-3 text-base text-[#6B7280]"
              />
            </div> */}
            <div className="flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <div className="m-5">
                  <label
                    htmlFor="date"
                    className="mb-2 block font-semibold dark:text-white"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full rounded-md border px-6 py-3"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="m-5">
                  <label
                    htmlFor="time"
                    className="mb-2 block font-semibold dark:text-white"
                  >
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full rounded-md border px-6 py-3"
                  />
                </div>
              </div>
            </div>
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
                className="w-full rounded-md border px-4 py-2 text-sm"
              />
            </div>
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
                className="w-full rounded-md border px-4 py-2 text-sm"
              />
            </div>
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
                    className="w-full rounded-md border px-6 py-3"
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
                    className="w-full rounded-md border px-6 py-3"
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
                    className="w-full rounded-md border px-6 py-3"
                  />
                </div>
              </div>
            </div>
            <div className="mb-5 flex justify-center">
              <button
                type="submit"
                className="rounded-md bg-[#6A64F1] px-4 py-3 text-base font-semibold text-white"
              >
                Book Appointment
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

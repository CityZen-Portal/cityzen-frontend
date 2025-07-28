
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";




function ReportForm() {
  const navigate = useNavigate();

  const [reporterName, setReporterName] = useState("");
  const [reportDetails, setReportDetails] = useState("");

 

  const handleSubmit =async (e) => {
    e.preventDefault();
    const data={
      name:reporterName,
      description:reportDetails
    }
    try{
    await axios.post(
      "https://utility-booking-backend.onrender.com/api/report/add",
      data
    );
    alert("Report submitted!");
    navigate("/citizen/Services");
    }
    catch(error)
    {
      console.error("Error submitting feedback:", error);
      alert("Something went wrong. Please try again.");
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
          Report Form
        </h2>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="reporterName"
            className="m-3 block text-base font-semibold text-[#07074D] dark:text-white sm:text-xl"
          >
            Your Full Name
          </label>
          <input
            type="text"
            name="reporterName"
            id="reporterName"
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            placeholder="Full Name"
            className="bg-whiten w-full rounded-md border border-[#e0e0e0] px-6 py-3 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md dark:border-navy-800 dark:bg-navy-900 dark:text-white"
            required
          />

          <label
            htmlFor="reportDetails"
            className="m-3 block text-base font-semibold text-[#07074D] dark:text-white sm:text-xl"
          >
            Report Details
          </label>
          <textarea
            id="reportDetails"
            rows="6"
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
            placeholder="Describe your report here"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            required
          />
          <div className="mb-5 mt-6 flex justify-center">
            <button
              type="submit"
              className="hover:shadow-form rounded-md bg-[#6A64F1] px-4 py-3 text-center text-base font-semibold text-white outline-none"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportForm;

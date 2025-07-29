import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialNewStaffState = {
  fullName: "",
  department: "",
  contactNumber: "",
  emailAddress: "",
  password: "",
  fullAddress: "",
  dob: "",
  aadharNumber: "",
};

function ManageStaffs() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(
          "https://utility-booking-backend.onrender.com/api/service/all"
        );
        const serviceList = response.data.data;
        // setList(serviceList);

        // Extract unique service names into departments
        const extractedDepartments = serviceList.map(
          (item) => item.serviceName
        );
        setDepartments(extractedDepartments);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDepartment();
  }, []);

  const [staffs, setStaffs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newStaff, setNewStaff] = useState(initialNewStaffState);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(
          "https://utility-booking-backend.onrender.com/api/staff/all"
        );
        const staffData = response.data?.data.data;
        setStaffs(Array.isArray(staffData) ? staffData : []);
      } catch (err) {
        console.error("Failed to fetch staff data:", err);
        toast.error("Failed to fetch staff data. Please try again.");
        setStaffs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const handleOpen = (staff = null) => {
    if (staff) {
      setEditId(staff.id);
      setNewStaff({
        fullName: staff.fullName || "",
        department: staff.department || "",
        contactNumber: staff.contactNumber || "",
        emailAddress: staff.emailAddress || "",
        password: staff.password || "",
        fullAddress: staff.fullAddress || "",
        dob: staff.dob || "",
      });
    } else {
      setEditId(null);
      setNewStaff(initialNewStaffState);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateStaff = async () => {
    const requiredFields = [
      "fullName",
      "department",
      "contactNumber",
      "emailAddress",
      "password",
      "fullAddress",
      "dob",
      "aadharNumber",
    ];
    const missing = requiredFields.filter((field) => !newStaff[field]);
    if (missing.length) {
      toast.error(`Please fill all fields: ${missing.join(", ")}`);
      return;
    }

    try {
      if (editId) {
        // Update staff
        await axios.put(
          `https://utility-booking-backend.onrender.com/api/staff/${editId}`,
          newStaff
        );
        setStaffs((prev) =>
          prev.map((s) =>
            s.id === editId ? { ...s, ...newStaff, id: editId } : s
          )
        );
        toast.success("Staff updated successfully!");
      } else {
        // Add new staff
        const response = await axios.post(
          "https://utility-booking-backend.onrender.com/api/staff/add",
          // "http://localhost:5000/api/staff/add",
          newStaff
        );
        const createdStaff = response.data?.data;
        setStaffs((prev) => [...prev, createdStaff]);
        toast.success("Staff added successfully!");
      }
      handleClose();
    } catch (error) {
      console.error("Error saving staff:", error);
      toast.error("Failed to save staff. Please try again.");
    }
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await axios.delete(
          `https://utility-booking-backend.onrender.com/api/staff/${id}`
        );
        setStaffs((prev) => prev.filter((s) => s.id !== id));
        toast.success("Staff deleted successfully!");
      } catch (error) {
        console.error("Failed to delete staff:", error);
        toast.error("Failed to delete staff. Please try again.");
      }
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());
    if (!hasBirthdayPassed) {
      age--;
    }
    return age;
  };

  return (
    <div className="mb-8 mt-12 flex flex-col gap-12 px-4 md:px-6">
      <div className="rounded-xl bg-white shadow-xl dark:bg-navy-800">
        <div className="flex flex-col justify-between gap-4 rounded-t-xl bg-blue-600 p-6 dark:bg-navy-700 md:flex-row md:items-center">
          <div>
            <button
              onClick={() => navigate("/admin/services")}
              className="mb-2 flex items-center gap-2 text-sm text-white transition-colors hover:text-gray-200"
            >
              <span>←</span> Back to Services
            </button>
            <h2 className="text-2xl font-bold text-white">
              Manage Staff Members
            </h2>
          </div>
          <button
            onClick={() => handleOpen()}
            className="flex transform items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-blue-600 shadow-md transition-transform hover:scale-105 hover:bg-gray-100"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="font-semibold">Add New Staff</span>
          </button>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse space-y-4 rounded-lg border border-gray-200 bg-gray-100 p-5 shadow-lg dark:border-navy-700 dark:bg-navy-900/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gray-300 dark:bg-navy-700"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-navy-700"></div>
                      <div className="h-3 w-1/2 rounded bg-gray-300 dark:bg-navy-700"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 rounded bg-gray-300 dark:bg-navy-700"></div>
                    <div className="h-3 w-5/6 rounded bg-gray-300 dark:bg-navy-700"></div>
                    <div className="h-3 w-2/3 rounded bg-gray-300 dark:bg-navy-700"></div>
                  </div>
                </div>
              ))
            : Array.isArray(staffs) &&
              staffs.map((staff) => (
                <div
                  key={staff.id}
                  className="flex flex-col justify-between rounded-lg border border-gray-200 bg-gray-50 p-5 shadow-lg dark:border-navy-700 dark:bg-navy-900/50"
                >
                  <div>
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-navy-700">
                          <UserIcon className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                            {staff.fullName}
                          </h3>
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {staff.department}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <span>{staff.emailAddress}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <span>{staff.contactNumber}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                        <span>{staff.fullAddress}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <span>Age: {calculateAge(staff.dob)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-navy-700">
                    <button
                      onClick={() => handleOpen(staff)}
                      className="text-yellow-500 transition-colors hover:text-yellow-600"
                      aria-label="Edit Staff"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(staff.id)}
                      className="text-red-500 transition-colors hover:text-red-600"
                      aria-label="Delete Staff"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {open && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm">
          <div className="m-4 w-full max-w-xl rounded-xl border bg-white p-8 shadow-2xl dark:border-navy-700 dark:bg-navy-800">
            <h2 className="mb-6 text-center text-2xl font-semibold text-blue-600 dark:text-white">
              {editId ? "Edit Staff Member" : "Add New Staff Member"}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <input
                name="fullName"
                placeholder="Full Name"
                value={newStaff.fullName}
                onChange={handleInputChange}
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              />
              <select
                name="department"
                value={newStaff.department}
                onChange={handleInputChange}
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              >
                <option value="" disabled>
                  Select Department
                </option>
                {departments.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
              <input
                name="contactNumber"
                placeholder="Contact Number"
                value={newStaff.contactNumber}
                onChange={handleInputChange}
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              />
              <input
                name="aadharNumber"
                placeholder="Aadhaar Number"
                value={newStaff.aadharNumber}
                onChange={handleInputChange}
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              />

              <input
                name="dob"
                type="date"
                value={newStaff.dob}
                onChange={handleInputChange}
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              />
              <input
                name="emailAddress"
                placeholder="Email Address"
                value={newStaff.emailAddress}
                onChange={handleInputChange}
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={newStaff.password}
                onChange={handleInputChange}
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              />
              <input
                name="fullAddress"
                placeholder="Full Address"
                value={newStaff.fullAddress}
                onChange={handleInputChange}
                className="col-span-2 w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              />
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={handleClose}
                className="rounded-lg border px-5 py-2.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateStaff}
                className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {editId ? "Update Staff" : "Add Staff"}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default ManageStaffs;

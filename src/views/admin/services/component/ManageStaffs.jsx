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
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialNewStaffState = {
  fullName: "",
  department: "",
  designation: "",
  contactNumber: "",
  emailAddress: "",
  fullAddress: "",
  dob: "",
  aadharNumber: "",
};

const PAGE_SIZE = 6;

function ManageStaffs() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [staffs, setStaffs] = useState(null);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newStaff, setNewStaff] = useState(initialNewStaffState);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [resetRequestStaffIds, setResetRequestStaffIds] = useState([]);


  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(
          "https://utility-booking-backend.onrender.com/api/service/all"
        );
        const serviceList = response.data.data;
        const extractedDepartments = serviceList.map((item) => item.serviceName);
        setDepartments(extractedDepartments);
      } catch (err) {}
    };
    fetchDepartment();
  }, []);

  const handleOpen = (staff = null) => {
    if (staff) {
      setEditId(staff.id);
      setNewStaff({
        fullName: staff.fullName || "",
        department: staff.department || "",
        designation: staff.designation || "",
        contactNumber: staff.contactNumber || "",
        emailAddress: staff.emailAddress || "",
        fullAddress: staff.fullAddress || "",
        dob: staff.dob || "",
        aadharNumber: staff.aadharNumber || "",
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

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (number) => /^\d{10}$/.test(number);
  const isValidAadhar = (number) => /^\d{12}$/.test(number);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    if (!hasBirthdayPassed) {
      age--;
    }
    return age;
  };

  const handleAddOrUpdateStaff = async () => {
    const requiredFields = [
      "fullName",
      "department",
      "designation",
      "contactNumber",
      "emailAddress",
      "fullAddress",
      "dob",
      "aadharNumber",
    ];
    const missing = requiredFields.filter((field) => !newStaff[field]);
    if (missing.length) {
      toast.error(`Please fill all fields: ${missing.join(", ")}`);
      return;
    }
    if (!isValidEmail(newStaff.emailAddress)) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (!isValidPhone(newStaff.contactNumber)) {
      toast.error("Contact number must be 10 digits.");
      return;
    }
    if (!isValidAadhar(newStaff.aadharNumber)) {
      toast.error("Aadhar number must be 12 digits.");
      return;
    }
    const age = calculateAge(newStaff.dob);
    if (age < 18 || age > 60) {
      toast.error("Staff age must be between 18 and 60 years.");
      return;
    }
    if (new Date(newStaff.dob) > new Date()) {
      toast.error("DOB cannot be a future date.");
      return;
    }
    try {
      if (editId) {
        await axios.put(
          `https://utility-booking-backend.onrender.com/api/staff/${editId}`,
          newStaff
        );
        setStaffs((prev) =>
          prev.map((s) => (s.id === editId ? { ...s, ...newStaff, id: editId } : s))
        );
        setRefreshTrigger((prev) => !prev);
        toast.success("Staff updated successfully!");
      } else {
        const response = await axios.post(
          "https://utility-booking-backend.onrender.com/api/staff/add",
          newStaff
        );
        const createdStaff = response.data?.data;
        setStaffs((prev) => [...prev, createdStaff]);
        setRefreshTrigger((prev) => !prev);
        toast.success("Staff added successfully!");
      }
      handleClose();
    } catch (error) {
      if (error.response?.data?.statusCode === 409) {
        toast.error("Failed to save staff. Email is Already registered ");
      } else {
        toast.error("Failed to save staff. Please try again.");
      }
    }
  };

  const confirmDeleteStaff = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteStaff = async () => {
    try {
      await axios.put(
        `https://utility-booking-backend.onrender.com/api/staff/delete-status/${deleteId}?isDelete=true`
      );
      setStaffs((prev) =>
        prev.map((s) => (s.id === deleteId ? { ...s, delete: true } : s))
      );
      setRefreshTrigger((prev) => !prev);
      toast.success("Staff marked as deleted successfully!");
    } catch (error) {
      toast.error("Failed to update delete status. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

const resetPasswordHandler = async (email) => {
  try {
    await axios.put(
      `https://utility-booking-backend.onrender.com/api/staff/resend-password/${encodeURIComponent(email)}`
    );
    toast.success("Password reset link sent.");

    setStaffs((prev) =>
      prev.map((staff) =>
        staff.emailAddress === email
          ? { ...staff, requestToResetPassword: false }
          : staff
      )
    );
  } catch (error) {
    console.error("Password reset error:", error);
    toast.error("Failed to send reset link.");
  }
};

useEffect(() => {
  const fetchResetPasswordRequests = async () => {
    try {
      const response = await axios.get(
        "https://utility-booking-backend.onrender.com/api/staff/reset-password-request/688b49083f074e456ee154c9?isRequestToResetPassword=true"
      );
      const idsWithResetRequests = response.data?.data ?? [];
      setResetRequestStaffIds(idsWithResetRequests);
    } catch (error) {
      setResetRequestStaffIds([]);
    }
  };
  fetchResetPasswordRequests();
}, []);
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(
          "https://utility-booking-backend.onrender.com/api/staff/all"
        );
        const staffData = response.data?.data?.data;
        const filteredStaff = Array.isArray(staffData)
          ? staffData.filter((staff) => staff.delete === false)
          : [];
        setStaffs(filteredStaff);
      } catch (err) {
        toast.error("Failed to fetch staff data. Please try again.");
        setStaffs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [refreshTrigger]);

useEffect(() => {
  let filtered = staffs || [];
  if (selectedDepartment) {
    filtered = filtered.filter(
      (staff) => staff.department === selectedDepartment
    );
  }
  if (searchText.trim()) {
    const query = searchText.toLowerCase();
    filtered = filtered.filter(
      (staff) =>
        (staff.fullName && staff.fullName.toLowerCase().includes(query)) ||
        (staff.contactNumber && staff.contactNumber.includes(query)) ||
        (staff.emailAddress && staff.emailAddress.toLowerCase().includes(query))
    );
  }
  filtered.sort((a, b) => {
    const aPriority = a.requestToResetPassword ? 0 : 1;
    const bPriority = b.requestToResetPassword ? 0 : 1;
    return aPriority - bPriority;
  });


  setFilteredStaffs(filtered);
  setCurrentPage(1);
}, [searchText, staffs, selectedDepartment, resetRequestStaffIds]);

  const totalStaffs = filteredStaffs.length;
  const totalPages = Math.ceil(totalStaffs / PAGE_SIZE);
  const currentStaffs = filteredStaffs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div className="mb-8 mt-12 flex flex-col gap-12 px-4 md:px-6">
      <div className="rounded-xl bg-white shadow-xl dark:bg-navy-800">
        <div className="flex flex-col justify-between gap-4 rounded-t-xl bg-blue-600 p-6 dark:bg-navy-700 md:flex-row md:items-center">
          <div>
            <button
              onClick={() => navigate("/admin/services")}
              className="mb-2 flex items-center gap-2 text-sm text-white dark:text-cyan-500 transition-colors hover:text-gray-200"
            >
              <span>←</span> Back to Services
            </button>
            <h2 className="text-2xl font-bold text-white ">
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
        <div className="flex items-center justify-between px-6 pt-6 gap-4">
<div className="flex items-center w-full max-w-sm 
                bg-gray-50 dark:bg-navy-700 
                border dark:border-navy-600 
                rounded-lg px-3 py-2">
  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-300" />
  <input
    type="text"
    value={searchText}
    onChange={handleSearchChange}
    className="ml-2 w-full outline-none 
               text-gray-700 dark:text-white 
               placeholder-gray-400 dark:placeholder-gray-300
               bg-transparent appearance-none"
    style={{ backgroundColor: 'transparent' }}
    placeholder="Search by name, mobile, or email..."
  />
</div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="rounded-lg border px-3 py-2 bg-gray-50 text-gray-700 dark:bg-navy-700 dark:text-white"
            style={{minWidth:"180px"}}
          >
            <option value="">All Departments</option>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
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
          ) : filteredStaffs.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 text-lg font-medium">
              No staff available{selectedDepartment ? ` in ${selectedDepartment}` : ""}.
            </div>
          ) : (
            Array.isArray(currentStaffs) &&
              currentStaffs.map((staff) => (
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
                          {staff.requestToResetPassword && (
  <span className="text-xs font-semibold text-red-600 ml-2">
    Reset Requested
  </span>
)}
                          </h3>
                          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {staff.department}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {staff.designation}
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
                      <div className="flex items-start gap-2 w-full">
                        <div className="pt-1">
                          <MapPinIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words w-full overflow-hidden">
                          {staff.fullAddress}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <span>Age: {calculateAge(staff.dob)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                   onClick={() => resetPasswordHandler(staff.emailAddress)}
                    className="flex-1 text-white py-2 rounded-md"
                                       >
                    Reset Password
                     </button>
                  <div className="mt-5 flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-navy-700">
                    <button
                      onClick={() => handleOpen(staff)}
                      className="text-yellow-500 transition-colors hover:text-yellow-600"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => confirmDeleteStaff(staff.id)}
                      className="text-red-500 transition-colors hover:text-red-600"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
        <div className="flex justify-center items-center my-6 gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? 'bg-gray-200 text-gray-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="mx-2 font-semibold text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-2 rounded-lg ${
              currentPage === totalPages || totalPages === 0
                ? 'bg-gray-200 text-gray-400'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-60 backdrop-blur-sm">
          <div className="m-4 w-full max-w-xl rounded-xl border bg-white p-8 shadow-2xl dark:border-navy-700 dark:bg-navy-800">
            <h2 className="mb-6 text-center text-2xl font-semibold text-blue-600 dark:text-white">
              {editId ? "Edit Staff Member" : "Add New Staff Member"}
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <input name="fullName" placeholder="Full Name" value={newStaff.fullName} onChange={handleInputChange} className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white" />
              <select name="department" value={newStaff.department} onChange={handleInputChange} className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white">
                <option value="" disabled>Select Department</option>
                {departments.map((dep) => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>
              <input name="designation" placeholder="Designation" value={newStaff.designation} onChange={handleInputChange} className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white" />
              <input name="contactNumber" placeholder="Contact Number" value={newStaff.contactNumber} onChange={handleInputChange} className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white" />
              <input name="aadharNumber" placeholder="Aadhaar Number" value={newStaff.aadharNumber} onChange={handleInputChange} className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white" />
              
              <input
                name="dob"
                type="date"
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                value={newStaff.dob}
                onChange={handleInputChange}
                className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white"
              />
              <input name="emailAddress" placeholder="Email Address" value={newStaff.emailAddress} onChange={handleInputChange} className="w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white" />
              <textarea
                name="fullAddress"
                placeholder="Full Address"
                value={newStaff.fullAddress}
                onChange={handleInputChange}
                rows={3}
                className="col-span-2 w-full rounded-lg border bg-gray-50 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:border-navy-600 dark:bg-navy-700 dark:text-white resize-none"
              />
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button onClick={handleClose} className="rounded-lg border px-5 py-2.5 text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-700">Cancel</button>
              <button onClick={handleAddOrUpdateStaff} className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700">{editId ? "Update Staff" : "Add Staff"}</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="rounded-xl bg-white p-6 shadow-xl dark:bg-navy-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Confirm Delete</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Are you sure you want to delete this staff member?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-700">Cancel</button>
              <button onClick={handleDeleteStaff} className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default ManageStaffs;

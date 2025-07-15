import React from "react";

// Citizen Views
import CitizenDashboard from "./views/citizen/dashboard/index";
import Service from "views/citizen/services";
import Grievance_Management from "views/citizen/grievance-management";

// Admin Views
import AdminDashboard from "./views/admin/dashboard/index.jsx";
import AdminProfile from "views/admin/profile/Profile";
import AdminServices from "views/admin/services/index.jsx";

// Staff Views
import StaffDashboard from "views/staff/dashboard";
import StaffService from "views/staff/services";

// Auth Views
import SignIn from "views/auth/SignIn";

// Icons
import {
  MdDashboard,
  MdHomeRepairService,
  MdPerson,
  MdAdminPanelSettings,
  MdMiscellaneousServices,
  MdLock,
  MdReportProblem,
  MdContactSupport
} from "react-icons/md";

const routes = [
  // ------------------ Citizen Routes ------------------
  {
    name: "Dashboard",
    layout: "/citizen",
    path: "dashboard",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <CitizenDashboard />,
  },
  {
    name: "Grievance Management",
    layout: "/citizen",
    path: "grievance-management",
    icon: <MdReportProblem className="h-6 w-6" />,
    component: <Grievance_Management />,
  },
  {
    name: "Services",
    layout: "/citizen",
    path: "services",
    icon: <MdMiscellaneousServices className="h-6 w-6" />,
    component: <Service />,
  },

  // ------------------ Admin Routes ------------------
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <AdminDashboard />,
  },
  {
    name: "Services",
    layout: "/admin",
    path: "services",
    icon: <MdHomeRepairService className="h-6 w-6" />,
    component: <AdminServices />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <AdminProfile />,
  },

  // ------------------ Staff Routes ------------------
  {
    name: "Staff Dashboard",
    layout: "/staff",
    path: "dashboard",
    icon: <MdAdminPanelSettings className="h-6 w-6" />,
    component: <StaffDashboard />,
  },
  {
    name: "Service Requests",
    layout: "/staff",
    path: "services",
    icon: <MdContactSupport className="h-6 w-6" />,
    component: <StaffService />,
  },

  // ------------------ Auth Routes ------------------
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
];

export default routes;
